import { create } from 'zustand';
import { io } from 'socket.io-client';
import useAuthStore from './authStore.js';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const socket = io(BACKEND_URL, {
  autoConnect: false,
  transports: ['websocket'],
});

let listenersInitialized = false;

const useChatStore = create((set, get) => ({
  messages: {}, // { [roomId]: [messages] }
  onlineUsers: [],
  socketConnected: false,
  error: null,
  activeRoomId: null,

  connectSocket: async () => {
    if (socket.connected) return;

    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const token = await user.getIdToken();
      socket.auth = { token };
      socket.connect();
    } catch (err) {
      console.error('Token error:', err);
    }
  },

  initListeners: () => {
    if (listenersInitialized) return;
    listenersInitialized = true;

    socket.on('connect', () => {
      set({ socketConnected: true, error: null });
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      set({ socketConnected: false });
    });

    socket.on('onlineUsers', (users) => {
      set({ onlineUsers: users });
    });

    // NEW: Listen for message history when joining room
    socket.on('messageHistory', (history) => {
      const roomId = get().activeRoomId;
      if (roomId && Array.isArray(history)) {
        console.log('[RECEIVED HISTORY]', history.length, 'messages for room', roomId);
        set((state) => ({
          messages: {
            ...state.messages,
            [roomId]: history,
          },
        }));
      }
    });

    socket.on('message', (msg) => {
      const roomId = msg.roomId;
      console.log('[RECEIVED MESSAGE]', msg);
      set((state) => ({
        messages: {
          ...state.messages,
          [roomId]: [...(state.messages[roomId] || []), msg],
        },
      }));
    });

    socket.on('connect_error', (err) => {
      set({ error: err.message });
      console.error('Connect error:', err.message);
    });
  },

  joinRoom: (roomId) => {
    socket.emit('joinRoom', roomId);
    set({ activeRoomId: roomId });
  },

  sendMessage: (text) => {
    const { activeRoomId } = get();
    if (!socket.connected || !activeRoomId || !text.trim()) return;

    const msg = {
      roomId: activeRoomId,
      text: text.trim(),
    };

    socket.emit('message', msg);
  },

  disconnectSocket: () => {
    if (socket.connected) socket.disconnect();
    set({
      messages: {},
      onlineUsers: [],
      socketConnected: false,
      activeRoomId: null,
    });
  },
}));

export default useChatStore;