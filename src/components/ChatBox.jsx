import { useState, useEffect, useRef } from 'react';
import useChatStore from '../store/chatStore.js';
import useAuthStore from '../store/authStore.js';
import Message from './Message.jsx';
import { Send, Loader2, MessageSquare } from 'lucide-react';

const ChatBox = () => {
  const { messages, activeRoomId, sendMessage } = useChatStore();
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const roomMessages = activeRoomId ? (messages[activeRoomId] || []) : [];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomMessages]);

  // Focus input when room changes
  useEffect(() => {
    if (activeRoomId) {
      inputRef.current?.focus();
    }
  }, [activeRoomId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(text);
      setText('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  if (!activeRoomId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="w-10 h-10 text-indigo-600" />
        </div>
        <p className="text-lg font-medium text-gray-700">No Chat Selected</p>
        <p className="text-sm text-gray-500 mt-2 text-center">
          Select a user from the sidebar to start chatting
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden bg-linear-to-b from-slate-50 to-white">
      {/* Messages Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 space-y-3">
        {roomMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
              <MessageSquare className="w-8 h-8 text-indigo-600" />
            </div>
            <p className="text-center text-gray-600 font-medium">No messages yet</p>
            <p className="text-sm text-gray-500 mt-1">Start the conversation!</p>
          </div>
        ) : (
          <>
            {roomMessages.map((msg, i) => (
              <Message key={`${msg.timestamp}-${i}`} msg={msg} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-gray-200 bg-white shadow-lg"
      >
        <div className="flex gap-2 md:gap-3 max-w-4xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            disabled={isSending}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-sm md:text-base"
          />
          <button
            type="submit"
            disabled={!text.trim() || isSending}
            className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-4 md:px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium min-w-20 md:min-w-25"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Sending</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
