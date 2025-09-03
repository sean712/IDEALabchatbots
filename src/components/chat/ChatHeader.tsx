import React, { useState } from 'react';
import { User, RotateCcw } from 'lucide-react';
import { BotConfig } from '../../config/bots';

interface ChatHeaderProps {
  bot: BotConfig;
  onClearChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ bot, onClearChat }) => {
  return (
    <div className="p-6 bg-imperial-navy text-white flex items-center justify-between shadow-md">
      <div className="flex items-center">
        <User className="h-6 w-6 mr-3 text-imperial-teal" />
        <div>
          <h2 className="text-xl font-semibold">Chat with {bot.instructor}</h2>
          <p className="text-imperial-teal text-sm font-medium">{bot.module} • {bot.program}</p>
        </div>
      </div>
      <button
        onClick={onClearChat}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-imperial-teal hover:bg-imperial-light-teal transition-colors duration-200 rounded-md shadow-sm hover:shadow-md"
        title="Clear chat and start new conversation"
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Clear Chat
      </button>
    </div>
  );
};

export default ChatHeader;