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
  messages: {}, // { [roomId]: [] }
  onlineUsers: [],
  socketConnected: false,
  error: null,
  activeRoomId: null,

  connectSocket: async () => {
    if (socket.connected) return;

    const user = useAuthStore.getState().user;
    if (!user) return;

    const token = await user.getIdToken();
    socket.auth = { token };
    socket.connect();
  },

  initListeners: () => {
    if (listenersInitialized) return;
    listenersInitialized = true;

    socket.on('connect', () => {
      console.log('[SOCKET CONNECTED]');
      set({ socketConnected: true });
    });

    socket.on('disconnect', () => {
      set({ socketConnected: false });
    });

    socket.on('onlineUsers', (users) => {
      set({ onlineUsers: users });
    });

    // ✅ FIXED: messageHistory WITH roomId
    socket.on('messageHistory', ({ roomId, history }) => {
      console.log('[HISTORY]', roomId, history.length);

      set((state) => ({
        messages: {
          ...state.messages,
          [roomId]: history,
        },
      }));
    });

    socket.on('message', (msg) => {
      set((state) => ({
        messages: {
          ...state.messages,
          [msg.roomId]: [...(state.messages[msg.roomId] || []), msg],
        },
      }));
    });

    socket.on('connect_error', (err) => {
      console.error('[SOCKET ERROR]', err.message);
      set({ error: err.message });
    });
  },

  joinRoom: (roomId) => {
    console.log('[JOIN ROOM REQUEST]', roomId);
    socket.emit('joinRoom', roomId);
    set({ activeRoomId: roomId });
  },

  sendMessage: (text) => {
    const { activeRoomId } = get();
    if (!activeRoomId || !text.trim()) return;

    socket.emit('message', {
      roomId: activeRoomId,
      text: text.trim(),
    });
  },

  disconnectSocket: () => {
  if (socket.connected) socket.disconnect();

  set((state) => ({
    messages: state.messages,      // preserve
    onlineUsers: [],
    socketConnected: false,
    activeRoomId: state.activeRoomId, // 🔒 DO NOT RESET
  }));
},

}));

export default useChatStore;
