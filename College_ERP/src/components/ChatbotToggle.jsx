import React from 'react';
import { MessageSquare } from 'lucide-react';

const ChatbotToggle = ({ onClick, isOpen = false, title = "Open AI Assistant" }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40"
      style={{ backgroundColor: 'var(--accent)' }}
      title={title}
    >
      <MessageSquare className="h-6 w-6" />
    </button>
  );
};

export default ChatbotToggle;