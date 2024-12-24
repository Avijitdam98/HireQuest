const supabase = require('./supabaseService');

class NotificationService {
  async createNotification(notificationData) {
    const { data, error } = await supabase
      .from('notifications')
      .insert([notificationData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getNotifications(userId) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async markAsRead(notificationId) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async markAllAsRead(userId) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)
      .select();

    if (error) throw error;
    return data;
  }

  async deleteNotification(notificationId) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
  }

  async getUnreadCount(userId) {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
    return count;
  }

  async createSystemNotification(userId, title, message) {
    return this.createNotification({
      user_id: userId,
      type: 'system',
      title,
      message,
      data: {}
    });
  }

  async createJobNotification(userId, jobId, type, title, message) {
    return this.createNotification({
      user_id: userId,
      type: `job_${type}`,
      title,
      message,
      data: { job_id: jobId }
    });
  }

  async createTeamNotification(userId, teamId, type, title, message) {
    return this.createNotification({
      user_id: userId,
      type: `team_${type}`,
      title,
      message,
      data: { team_id: teamId }
    });
  }
}

module.exports = new NotificationService();
