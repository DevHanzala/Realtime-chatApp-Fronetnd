const MessageSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 px-2 py-2 animate-fadeIn">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"} mb-2`}
        >
          <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[75%] ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
            {/* Avatar skeleton */}
            {i % 2 === 0 && (
              <div className="w-7 h-7 bg-linear-to-br from-gray-200 to-gray-300 rounded-full shrink-0 animate-pulse"></div>
            )}
            
            <div className={`rounded-2xl p-3 ${i % 2 === 0 ? 'bg-gray-100 rounded-bl-none' : 'bg-linear-to-r from-indigo-100 to-purple-100 rounded-br-none'} animate-pulse`}>
              <div className="h-3 bg-gray-300 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MessageSkeleton;
