import { create } from 'zustand';
import { io } from 'socket.io-client';
import useAuthStore from './authStore.js';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const socket = io(BACKEND_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,  // 1 second delay between reconnects
  reconnectionDelayMax: 5000,  // Max 5 seconds
});

const useChatStore = create((set, get) => ({
  messages: [],
  onlineUsers: [],
  socketConnected: false,
  error: null,

  connectSocket: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const token = await user.getIdToken();
      socket.auth = { token };
      socket.connect();

      socket.on('connect', () => set({ socketConnected: true, error: null }));
      socket.on('connect_error', (err) => set({ error: err.message, socketConnected: false }));
      socket.on('disconnect', () => set({ socketConnected: false }));

      socket.on('message', (msg) => set((state) => ({ messages: [...state.messages, msg] })));
      socket.on('onlineUsers', (users) => set({ onlineUsers: users }));
    } catch (err) {
      set({ error: err.message });
    }
  },

  sendMessage: (message) => {
    if (get().socketConnected) {
      socket.emit('message', { text: message });
    }
  },

  disconnectSocket: () => {
    socket.disconnect();
    set({ socketConnected: false, messages: [], onlineUsers: [] });
  },
}));

export default useChatStore;