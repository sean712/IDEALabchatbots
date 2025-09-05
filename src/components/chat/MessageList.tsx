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
  const { isLoading } = useAppContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#f7f9fc]">
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