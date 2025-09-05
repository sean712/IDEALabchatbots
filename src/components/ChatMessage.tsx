import React from 'react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-fade-in`}>
      <div
        className={`flex items-start max-w-[70%] ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-full shadow-sm ${
            isUser ? 'ml-3' : 'mr-3'
          } ${isUser ? 'bg-imperial-teal/20' : 'bg-white border border-gray-200 overflow-hidden'}`}
        >
          {isUser ? (
            <User className="w-5 h-5 text-imperial-navy" />
          ) : (
            <Bot className="w-5 h-5 text-imperial-teal" />
          )}
        </div>
        
        <div
          className={`rounded-lg px-5 py-3 shadow-sm ${
            isUser
              ? 'bg-imperial-navy text-white rounded-br-none'
              : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
          }`}
        >
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              components={{
                p: ({ children }) => <span className={`block ${isUser ? 'text-white' : ''}`}>{children}</span>,
                strong: ({ children }) => <strong className={`font-semibold ${isUser ? 'text-white' : ''}`}>{children}</strong>,
                em: ({ children }) => <em className={`italic ${isUser ? 'text-white' : ''}`}>{children}</em>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
          <div
            className={`text-xs mt-1 ${
              isUser ? 'text-imperial-teal/70' : 'text-gray-500'
            }`}
          >
            {format(message.timestamp, 'HH:mm')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;