import { useState } from 'react';
import useChatStore from '../store/chatStore.js';
import Message from './Message.jsx';

const ChatBox = () => {
  const { messages, sendMessage } = useChatStore();
  const [text, setText] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (text.trim()) {
      sendMessage(text);
      setText('');
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl flex flex-col h-96 bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => <Message key={idx} msg={msg} />)}
      </div>
      <form onSubmit={handleSend} className="flex p-4 border-t border-gray-200">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-r-lg hover:bg-indigo-700 transition">Send</button>
      </form>
    </div>
  );
};

export default ChatBox;