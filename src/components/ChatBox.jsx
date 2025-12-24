import { useState } from 'react';
import useChatStore from '../store/chatStore.js';
import useAuthStore from '../store/authStore.js';
import Message from './Message.jsx';

const ChatBox = () => {
  const { messages, activeRoomId, sendMessage } = useChatStore();
  const { user } = useAuthStore();
  const [text, setText] = useState('');

  const roomMessages = activeRoomId ? (messages[activeRoomId] || []) : [];

  const handleSend = (e) => {
    e.preventDefault(); // ← THIS FIXES THE DISAPPEARING INPUT
    if (text.trim()) {
      sendMessage(text);
      setText(''); // Clear input after send
    }
  };

  if (!activeRoomId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p className="text-lg">Select a user to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {roomMessages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
        ) : (
          roomMessages.map((msg, i) => <Message key={i} msg={msg} />)
        )}
      </div>

      {/* Input Form — FIXED */}
      <form onSubmit={handleSend} className="p-4 border-t bg-white">
        <div className="flex gap-3">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            autoFocus
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition font-medium"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;