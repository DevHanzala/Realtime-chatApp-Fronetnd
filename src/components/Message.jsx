import { useState } from 'react';
import useAuthStore from '../store/authStore.js';

const Message = ({ msg }) => {
  const { user, users } = useAuthStore();
  const isOwn = msg.sender === user?.uid;
  const [showImage, setShowImage] = useState(false);

  const hasImage = msg.file?.type?.startsWith('image/');
  const hasText = msg.text?.trim();

  const sender = users.find(u => u.uid === msg.sender)?.username ||
                 users.find(u => u.uid === msg.sender)?.email || 'User';

  return (
    <>
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2 animate-fadeIn`}>
        <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[75%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Avatar for other users */}
          {!isOwn && (
            <div className="w-7 h-7 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xs shrink-0">
              {sender.charAt(0).toUpperCase()}
            </div>
          )}

          <div
            className={`px-3 py-2 rounded-2xl shadow-sm ${
              isOwn
                ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
            }`}
          >
            {/* Sender name for other users */}
            {!isOwn && (
              <p className="text-xs font-semibold mb-1 text-indigo-600">{sender}</p>
            )}

            {/* IMAGE MESSAGE */}
            {hasImage && (
              <img
                src={msg.file.base64}
                alt={msg.file.name}
                className="w-full max-w-62.5 max-h-50 object-cover rounded-xl mb-1 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setShowImage(true)}
                loading="lazy"
              />
            )}

            {/* TEXT MESSAGE */}
            {hasText && <p className="text-sm wrap-break-word leading-relaxed">{msg.text}</p>}

            {/* FILE (NON-IMAGE) */}
            {msg.file && !hasImage && (
              <a
                href={msg.file.base64}
                download={msg.file.name}
                className={`mt-1 inline-block text-xs font-medium underline ${
                  isOwn ? 'text-indigo-200 hover:text-white' : 'text-indigo-600 hover:text-indigo-700'
                } transition-colors`}
              >
                📎 {msg.file.name}
              </a>
            )}

            <p className={`text-[10px] mt-1 ${isOwn ? 'text-indigo-200' : 'text-gray-500'}`}>
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* FULLSCREEN IMAGE VIEWER */}
      {showImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={() => setShowImage(false)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowImage(false)}
              className="absolute -top-7  -right-3 w-10 h-10   text-white   cursor-pointer text-2xl  transition-all "
              aria-label="Close image"
            >
              ×
            </button>

            <img
              src={msg.file.base64}
              alt="full"
              className="max-w-[95vw] max-h-[95vh] rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Message;