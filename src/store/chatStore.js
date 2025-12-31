import { create } from 'zustand';
import { io } from 'socket.io-client';
import useAuthStore from './authStore.js';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const socket = io(BACKEND_URL, {
  autoConnect: false,
  transports: ['websocket'],
});

let listenersInitialized = false;
let typingTimeout = null;

const useChatStore = create((set, get) => ({
  messages: {},
  onlineUsers: [],
  socketConnected: false,
  error: null,
  activeRoomId: null,
  typingUsers: [],

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

    socket.on('messageHistory', ({ roomId, history }) => {
      set((state) => ({
        messages: {
          ...state.messages,
          [roomId]: history,
        },
      }));
    });

    socket.on('message', (msg) => {
      console.log('[RECEIVED MESSAGE]', msg);
      if (msg.file && !msg.file.base64) {
  console.warn('[FILE RECEIVED WITHOUT BASE64]', msg.file);
}
      set((state) => ({
        messages: {
          ...state.messages,
          [msg.roomId]: [...(state.messages[msg.roomId] || []), msg],
        },
      }));
    });

    socket.on('typing', ({ username, isTyping }) => {
      set((state) => ({
        typingUsers: isTyping
          ? [...new Set([...state.typingUsers, username])]
          : state.typingUsers.filter((u) => u !== username),
      }));
    });

    socket.on('connect_error', (err) => {
      console.error('[SOCKET ERROR]', err.message);
      set({ error: err.message });
    });
  },

  

  joinRoom: (roomId) => {
    set({ activeRoomId: roomId, typingUsers: [] });
    socket.emit('joinRoom', roomId);
  },

  // FIXED: Properly handle text + file
  sendMessage: (text = '', file = null) => {
    const { activeRoomId } = get();
    if (!activeRoomId) return;

    const payload = {
      roomId: activeRoomId,
      text: text.trim(),
    };

    if (file) {
     payload.file = {
  name: file.name,
  type: file.type,
  size: file.size,
 base64: file.base64,
};
      console.log('[SENDING FILE]', payload.file.name);
    } else {
      console.log('[SENDING TEXT]', text);
    }

    socket.emit('message', payload);
  },

  emitTyping: (isTyping) => {
    const roomId = get().activeRoomId;
    const currentUser = useAuthStore.getState().user;
    const users = useAuthStore.getState().users;
    if (!roomId || !currentUser) return;

    const senderUser = users.find(u => u.uid === currentUser.uid);
    const displayName = senderUser?.username || currentUser.email.split('@')[0] || currentUser.email;

    socket.emit('typing', {
      roomId,
      username: displayName,
      isTyping,
    });

    if (isTyping) {
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        socket.emit('typing', {
          roomId,
          username: displayName,
          isTyping: false,
        });
      }, 1000);
    }
  },

  disconnectSocket: () => {
    if (socket.connected) socket.disconnect();
    set({
      messages: {},
      onlineUsers: [],
      socketConnected: false,
      activeRoomId: null,
      typingUsers: [],
    });
  },
}));

export default useChatStore;