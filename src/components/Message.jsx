import useAuthStore from '../store/authStore.js';

const Message = ({ msg }) => {
  const { user, users } = useAuthStore();
  const isOwn = msg.sender === user?.uid;

  const sender =
    users.find(u => u.uid === msg.sender)?.username ||
    users.find(u => u.uid === msg.sender)?.email ||
    'User';

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2 md:mb-3 animate-fadeIn`}>
      <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[75%] md:max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar for other users */}
        {!isOwn && (
          <div className="w-7 md:w-9 h-7 md:h-9 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xs shrink-0">
            {sender.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`px-3 md:px-4 py-2 md:py-2.5 rounded-2xl shadow-sm text-sm md:text-base ${
            isOwn
              ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
              : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none'
          }`}
        >
          {!isOwn && (
            <p className={`text-xs font-semibold mb-1 ${isOwn ? 'text-indigo-200' : 'text-indigo-600'}`}>
              {sender}
            </p>
          )}
          <p className="wrap-break-word leading-relaxed">{msg.text}</p>
          <p className={`text-[10px] md:text-xs mt-1 ${isOwn ? 'text-indigo-200' : 'text-gray-500'}`}>
            {new Date(msg.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Message;
