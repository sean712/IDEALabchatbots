import React, { useRef, useEffect } from 'react';
import ChatMessage from '../ChatMessage';
import { Message } from '../../types';
import TypingIndicator from './TypingIndicator';
import { useAppContext } from '../../context/AppContext';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { isLoading } = useAppContext();

  const scrollToBottom = () => {
    // Use scrollTop instead of scrollIntoView to prevent parent page scrolling
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div 
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto p-6 bg-[#f7f9fc]"
    >
      <div className="max-w-4xl mx-auto">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;