import useAuthStore from '../store/authStore.js';

const Message = ({ msg }) => {
  const { user } = useAuthStore();
  const isOwn = msg.sender === user?.uid;

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-sm wrap-break-word ${isOwn ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
        <p className="text-sm font-medium mb-1">{isOwn ? 'You' : msg.sender.slice(0, 8)}</p>
        <p>{msg.text}</p>
        <p className={`text-xs mt-2 ${isOwn ? 'text-indigo-200' : 'text-gray-500'}`}>
          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default Message;