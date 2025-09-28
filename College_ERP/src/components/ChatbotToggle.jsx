import React, { useState } from 'react';
import UniversalChatbot from './AI/UniversalChatbot';

const ChatbotToggle = ({ portal = 'student' }) => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <UniversalChatbot 
      portal={portal}
      isOpen={isChatbotOpen}
      onToggle={toggleChatbot}
    />
  );
};

export default ChatbotToggle;