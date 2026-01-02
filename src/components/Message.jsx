import { useState } from 'react';
import useAuthStore from '../store/authStore.js';

const Message = ({ msg }) => {
  const { user, users } = useAuthStore();
  const isOwn = msg.sender === user?.uid;
  const [showImage, setShowImage] = useState(false);

  const file = msg.file;

  // ✅ ROBUST IMAGE DETECTION
  const isImage =
    Boolean(file?.url) &&
    /\.(jpg|jpeg|png|webp|gif)$/i.test(file.url);

  const sender =
    users.find(u => u.uid === msg.sender)?.username ||
    users.find(u => u.uid === msg.sender)?.email ||
    'User';

  // ✅ FORCE DOWNLOAD (NO NEW TAB, NO 401)
  const forceDownload = async () => {
    try {
      const res = await fetch(file.url, {
        mode: 'cors',
        credentials: 'omit',
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = file.name || 'download';
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Download failed');
    }
  };

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

          <div className="flex flex-col">
            {/* Sender name */}
            {!isOwn && (
              <p className="text-xs text-indigo-600 font-semibold mb-1 px-1">
                {sender}
              </p>
            )}

            <div
              className={`rounded-2xl px-3 py-2 shadow-sm ${isOwn
                ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                }`}
            >
              {/* ✅ IMAGE */}
              {isImage && (
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full max-w-62.5 max-h-50 object-cover rounded-xl mb-1 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setShowImage(true)}
                  loading="lazy"
                />
              )}

              {/* ✅ TEXT */}
              {msg.text && (
                <p className="text-sm wrap-break-word leading-relaxed">{msg.text}</p>
              )}

              {/* ✅ NON-IMAGE FILE */}
              {file && !isImage && (
                <button
                  onClick={forceDownload}
                  className={`text-xs font-medium underline inline-flex items-center gap-1 ${isOwn
                    ? 'text-indigo-200 hover:text-white'
                    : 'text-indigo-600 hover:text-indigo-700'
                    } transition-colors`}
                >
                  📎 {file.name}
                </button>
              )}



              {/* Timestamp */}
              <p className={`text-[10px] mt-1 ${isOwn ? 'text-indigo-200' : 'text-gray-500'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ FULLSCREEN IMAGE VIEWER */}
      {showImage && isImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={() => setShowImage(false)}
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowImage(false)}
              className="absolute md:top-12 top-3 right-2 w-10 h-10 rounded-full
           bg-black/40 hover:bg-black/60
           text-white text-2xl
           flex items-center justify-center
           backdrop-blur-sm z-50"

              aria-label="Close image"
            >
              ×
            </button>

            <img
              src={file.url}
              alt={file.name}
              className="max-w-[95vw] max-h-[95vh]   rounded-xl shadow-2xl"
            />

            <button
              onClick={forceDownload}
              className="absolute -bottom-12 right-0 bg-linear-to-br from-indigo-500 to-purple-500 bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-full text-sm font-medium transition-all backdrop-blur-sm flex items-center gap-2"
            >
              ⬇️ Download
            </button>
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