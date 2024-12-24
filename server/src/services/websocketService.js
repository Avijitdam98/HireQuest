const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const supabase = require('./supabaseService'); // Assuming supabase is initialized in a separate file

class WebSocketService {
  constructor() {
    this.clients = new Map(); // userId -> WebSocket
    this.wss = null;
  }

  initialize(server) {
    this.wss = new WebSocket.Server({ server });

    this.wss.on('connection', async (ws, req) => {
      try {
        // Get token from query string
        const token = new URL(req.url, 'ws://localhost').searchParams.get('token');
        if (!token) {
          ws.close(1008, 'Token required');
          return;
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.sub;

        // Store client connection
        this.clients.set(userId, ws);

        // Handle client messages
        ws.on('message', (data) => {
          this.handleMessage(userId, data);
        });

        // Handle client disconnect
        ws.on('close', () => {
          this.clients.delete(userId);
        });

        // Send initial connection success message
        ws.send(JSON.stringify({
          type: 'connection',
          status: 'success',
          userId
        }));
      } catch (error) {
        ws.close(1008, error.message);
      }
    });
  }

  handleMessage(userId, data) {
    try {
      const message = JSON.parse(data);
      switch (message.type) {
        case 'ping':
          this.sendToUser(userId, { type: 'pong' });
          break;
        // Add more message type handlers here
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  }

  sendToUser(userId, data) {
    const client = this.clients.get(userId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  }

  broadcastToRoom(roomId, data, excludeUserId = null) {
    this.clients.forEach((client, userId) => {
      if (userId !== excludeUserId && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          ...data,
          roomId
        }));
      }
    });
  }

  // Notification events
  sendNotification(userId, notification) {
    this.sendToUser(userId, {
      type: 'notification',
      data: notification
    });
  }

  // Chat events
  sendChatMessage(chatId, message) {
    const messageData = {
      type: 'chat_message',
      data: message
    };

    // Send to all participants except sender
    message.chat.participants.forEach(userId => {
      if (userId !== message.sender_id) {
        this.sendToUser(userId, messageData);
      }
    });
  }

  // Job events
  broadcastNewJob(job) {
    const jobData = {
      type: 'new_job',
      data: job
    };

    // Broadcast to all connected clients
    this.clients.forEach((client, userId) => {
      if (client.readyState === WebSocket.OPEN) {
        // Check if job matches user's skills
        this.checkJobMatch(userId, job).then(matches => {
          if (matches) {
            jobData.matches = true;
          }
          client.send(JSON.stringify(jobData));
        });
      }
    });
  }

  async checkJobMatch(userId, job) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('skills')
        .eq('id', userId)
        .single();

      if (!profile || !profile.skills) return false;

      const userSkills = new Set(profile.skills);
      const jobSkills = new Set(job.required_skills);

      // Check if user has at least 50% of required skills
      const matchingSkills = [...jobSkills].filter(skill => userSkills.has(skill));
      return matchingSkills.length >= jobSkills.size * 0.5;
    } catch (error) {
      console.error('Error checking job match:', error);
      return false;
    }
  }

  sendJobUpdate(jobId, update) {
    const jobData = {
      type: 'job_updated',
      data: update
    };

    this.broadcastToRoom(`job_${jobId}`, jobData);
  }

  notifyJobApplication(employerId, application) {
    this.sendToUser(employerId, {
      type: 'new_application',
      data: application
    });
  }

  notifyApplicationUpdate(applicantId, update) {
    this.sendToUser(applicantId, {
      type: 'application_update',
      data: update
    });
  }

  // Team events
  sendTeamUpdate(teamId, update) {
    const teamData = {
      type: 'team_update',
      data: update
    };

    this.broadcastToRoom(teamId, teamData);
  }

  // Application events
  sendApplicationUpdate(userId, application) {
    this.sendToUser(userId, {
      type: 'application_update',
      data: application
    });
  }
}

module.exports = new WebSocketService();
