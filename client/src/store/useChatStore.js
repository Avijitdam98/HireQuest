import { create } from 'zustand';
import { getSession } from '../utils/auth';

const WEBSOCKET_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';

const useChatStore = create((set, get) => ({
  socket: null,
  messages: [],
  connected: false,
  error: null,

  initializeWebSocket: () => {
    const session = getSession();
    const currentSocket = get().socket;

    // Close existing socket if any
    if (currentSocket) {
      currentSocket.close();
    }

    try {
      // Only initialize WebSocket for job seekers
      const userRole = session?.user?.user_metadata?.role;
      if (userRole !== 'jobseeker') {
        return;
      }

      const wsUrl = `${WEBSOCKET_URL}/chat?token=${session?.access_token}`;
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log('WebSocket connected');
        set({ socket, connected: true, error: null });
      };

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        set((state) => ({
          messages: [...state.messages, message],
        }));
      };

      socket.onclose = () => {
        console.log('WebSocket disconnected');
        set({ socket: null, connected: false });
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          if (!get().connected) {
            get().initializeWebSocket();
          }
        }, 5000);
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        set({ error: 'Failed to connect to chat server' });
      };

      set({ socket });
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
      set({ error: 'Failed to initialize chat connection' });
    }
  },

  sendMessage: (message) => {
    const { socket } = get();
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.close();
    }
    set({ socket: null, connected: false, messages: [] });
  },
}));

export default useChatStore;
