import useAuthStore from '../store/authStore.js';
import { User } from 'lucide-react';

const Message = ({ msg }) => {
  const { user, users } = useAuthStore();
  const isOwn = msg.sender === user?.uid;

  // Find sender's username from the users list
  const senderUser = users.find((u) => u.uid === msg.sender);
  const senderName = isOwn 
    ? 'You' 
    : (senderUser?.username || senderUser?.email || 'Unknown');

  const formatTime = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return '';
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3 animate-fadeIn`}>
      <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[75%] md:max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        {!isOwn && (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xs sm:text-sm shrink-0">
            {senderName.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Message Bubble */}
        <div className={`px-4 py-2.5 rounded-2xl shadow-sm ${
          isOwn 
            ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-br-none' 
            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
        }`}>
          {!isOwn && (
            <p className="text-xs font-semibold mb-1 text-indigo-600">
              {senderName}
            </p>
          )}
          <p className="text-sm sm:text-base wrap-break-word leading-relaxed">
            {msg.text}
          </p>
          <p className={`text-xs mt-1.5 ${isOwn ? 'text-indigo-200' : 'text-gray-500'}`}>
            {formatTime(msg.timestamp)}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Message;
