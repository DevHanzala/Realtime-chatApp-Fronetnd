import { create } from 'zustand';
import { io } from 'socket.io-client';
import useAuthStore from './authStore.js';
import { uploadToCloudinary } from '../config/uploadToCloudinary';
import { iceServers } from '../config/webrtcConfig.js';

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

  // WebRTC Call State
  localStream: null,
  remoteStream: null,
  peerConnection: null,
  isCallActive: false,
  isIncomingCall: false,
  incomingCaller: null,
  pendingOffer: null,
  pendingWithVideo: true,
  isMuted: false,
  isVideoOff: false,

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

    socket.on('connect', () => set({ socketConnected: true }));

    socket.on('disconnect', () => set({ socketConnected: false }));

    socket.on('onlineUsers', (users) => set({ onlineUsers: users }));

    socket.on('messageHistory', ({ roomId, history }) => {
      set((state) => ({
        messages: { ...state.messages, [roomId]: history },
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

    socket.on('typing', ({ username, isTyping }) => {
      set((state) => ({
        typingUsers: isTyping
          ? [...new Set([...state.typingUsers, username])]
          : state.typingUsers.filter((u) => u !== username),
      }));
    });

    // CALL SIGNALING
    socket.on('call-offer', ({ offer, from, withVideo = true }) => {
      set({ 
        pendingOffer: offer, 
        isIncomingCall: true, 
        incomingCaller: from,
        pendingWithVideo: withVideo 
      });
    });

    socket.on('call-answer', ({ answer }) => {
      const { peerConnection } = get();
      if (peerConnection) {
        peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on('ice-candidate', ({ candidate }) => {
      const { peerConnection } = get();
      if (peerConnection) {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket.on('call-ended', () => {
      get().hangUp();
    });
  },

  joinRoom: (roomId) => {
    set({ activeRoomId: roomId, typingUsers: [] });
    socket.emit('joinRoom', roomId);
  },

  sendMessage: async (text = '', file = null) => {
    const { activeRoomId } = get();
    if (!activeRoomId) return;

    const payload = { roomId: activeRoomId, text: text.trim() };

    if (file) {
      const uploaded = await uploadToCloudinary(file);
      payload.file = {
        url: uploaded.secure_url,
        name: file.name,
        type: file.type,
        size: uploaded.bytes,
      };
    }

    socket.emit('message', payload);
  },

  startCall: async (withVideo = true) => {
    const { activeRoomId } = get();
    if (!activeRoomId) return;


    try {
      const constraints = { video: withVideo, audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      set({ localStream: stream, isCallActive: true });

      const pc = new RTCPeerConnection({ iceServers });
      set({ peerConnection: pc });

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        set({ remoteStream: event.streams[0] });
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', { roomId: activeRoomId, candidate: event.candidate });
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit('call-offer', { roomId: activeRoomId, offer, withVideo });
    } catch (err) {
      console.error('Error starting call:', err);
    }
  },

  answerCall: async () => {
    const { activeRoomId, pendingOffer, pendingWithVideo } = get();
    if (!activeRoomId || !pendingOffer) return;


    try {
      const constraints = { video: pendingWithVideo, audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      set({ localStream: stream, isCallActive: true, isIncomingCall: false, pendingOffer: null });

      const pc = new RTCPeerConnection({ iceServers });
      set({ peerConnection: pc });

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        set({ remoteStream: event.streams[0] });
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', { roomId: activeRoomId, candidate: event.candidate });
        }
      };

      await pc.setRemoteDescription(new RTCSessionDescription(pendingOffer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit('call-answer', { roomId: activeRoomId, answer });
    } catch (err) {
      console.error('Error answering call:', err);
    }
  },

  rejectCall: () => {
    set({ isIncomingCall: false, incomingCaller: null, pendingOffer: null });
    socket.emit('call-ended', { roomId: get().activeRoomId });
  },

  toggleMute: () => {
    const { localStream, isMuted } = get();
    if (localStream && localStream.getAudioTracks().length > 0) {
      localStream.getAudioTracks()[0].enabled = !isMuted;
      set({ isMuted: !isMuted });
    }
  },

  toggleVideo: () => {
    const { localStream, isVideoOff } = get();
    if (localStream && localStream.getVideoTracks().length > 0) {
      localStream.getVideoTracks()[0].enabled = !isVideoOff;
      set({ isVideoOff: !isVideoOff });
      console.log(isVideoOff ? 'Video on' : 'Video off');
    }
  },

  hangUp: () => {
    const { peerConnection, localStream, activeRoomId, isCallActive } = get();

    if (peerConnection) peerConnection.close();
    if (localStream) localStream.getTracks().forEach(t => t.stop());

    if (isCallActive) {
      socket.emit('call-ended', { roomId: activeRoomId });
    }


    set({
      localStream: null,
      remoteStream: null,
      peerConnection: null,
      isCallActive: false,
      isIncomingCall: false,
      incomingCaller: null,
      pendingOffer: null,
      isMuted: false,
      isVideoOff: false,
    });
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
      localStream: null,
      remoteStream: null,
      peerConnection: null,
      isCallActive: false,
    });
  },
}));

export default useChatStore;