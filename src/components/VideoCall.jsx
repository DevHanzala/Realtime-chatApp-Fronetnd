import { useEffect, useRef } from 'react';
import useChatStore from '../store/chatStore.js';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import toast from 'react-hot-toast';

const VideoCall = () => {
  const {
    localStream,
    remoteStream,
    isCallActive,
    isIncomingCall,
    incomingCaller,
    answerCall,
    rejectCall,
    hangUp,
    toggleMute,
    toggleVideo,
    isMuted,
    isVideoOff,
  } = useChatStore();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const ringtoneRef = useRef(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    if (isIncomingCall && ringtoneRef.current) {
      ringtoneRef.current.play().catch(() => console.log('Ringtone play prevented'));
    } else if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }
  }, [isIncomingCall]);

  // Incoming Call Screen
  if (isIncomingCall && !isCallActive) {
    return (
      <div className="fixed inset-0 bg-linear-to-b from-indigo-900 to-purple-900 z-50 flex flex-col items-center justify-center text-white p-4 animate-fadeIn">
        <audio ref={ringtoneRef} src="/snopdop.mp3" loop />

        <div className="animate-pulse mb-6 md:mb-8">
          <div className="w-24 md:w-32 h-24 md:h-32 rounded-full  bg-opacity-20 flex items-center justify-center">
            <Phone className="w-12 md:w-16 h-12 md:h-16 text-white animate-ping" />
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Incoming Call</h2>
        <p className="text-lg md:text-xl mb-8 md:mb-12">{incomingCaller || 'Someone'} is calling...</p>
        <div className="flex gap-6 md:gap-8">
          <button
            onClick={() => {
              rejectCall();
              toast.info('Call rejected');
            }}
            className="w-14 md:w-16 h-14 md:h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95"
          >
            <PhoneOff className="w-7 md:w-8 h-7 md:h-8" />
          </button>
          <button
            onClick={() => {
              answerCall();
              toast.success('Call connected');
            }}
            className="w-14 md:w-16 h-14 md:h-16 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95"
          >
            <Phone className="w-7 md:w-8 h-7 md:h-8" />
          </button>
        </div>
      </div>
    );
  }

  // Active Call Screen
  if (isCallActive) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col animate-fadeIn">
        {/* Remote Video */}
        <div className="flex-1 relative">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {!remoteStream && (
            <div className="absolute inset-0 flex items-center justify-center text-white text-xl md:text-2xl bg-black bg-opacity-50 animate-pulse">
              Connecting...
            </div>
          )}

          {/* Local Video PIP */}
          <div className="absolute bottom-4 right-4 w-32 h-24 md:w-48 md:h-36 rounded-xl overflow-hidden shadow-2xl border-2 md:border-4 border-white animate-slideInRight">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 md:p-6 bg-gray-900 flex items-center justify-center gap-4 md:gap-8">
          <button
            onClick={toggleMute}
            className={`p-3 md:p-4 rounded-full transition-all ${isMuted ? 'bg-red-600' : 'bg-gray-700'} hover:opacity-80 active:scale-95`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-5 md:w-6 h-5 md:h-6 text-white" /> : <Mic className="w-5 md:w-6 h-5 md:h-6 text-white" />}
          </button>

          <button
            onClick={hangUp}
            className="p-4 md:p-5 rounded-full bg-red-600 hover:bg-red-700 transition-all active:scale-95"
            title="End Call"
          >
            <PhoneOff className="w-6 md:w-7 h-6 md:h-7 text-white" />
          </button>

          <button
            onClick={toggleVideo}
            className={`p-3 md:p-4 rounded-full transition-all ${isVideoOff ? 'bg-red-600' : 'bg-gray-700'} hover:opacity-80 active:scale-95`}
            title={isVideoOff ? 'Turn on video' : 'Turn off video'}
          >
            {isVideoOff ? <VideoOff className="w-5 md:w-6 h-5 md:h-6 text-white" /> : <Video className="w-5 md:w-6 h-5 md:h-6 text-white" />}
          </button>
        </div>

        <style jsx>{`
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .animate-slideInRight {
            animation: slideInRight 0.3s ease-out;
          }
        `}</style>
      </div>
    );
  }

  return null;
};

export default VideoCall;
