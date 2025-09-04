import React, { useState } from 'react';
import { User, RotateCcw, TestTube } from 'lucide-react';
import { BotConfig } from '../../config/bots';
import { useSearchParams } from 'react-router-dom';

interface ChatHeaderProps {
  bot: BotConfig;
  onClearChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ bot, onClearChat }) => {
  const [searchParams] = useSearchParams();
  const isTestMode = searchParams.get('test') === 'true';

  return (
    <div className="p-6 bg-imperial-navy text-white flex items-center justify-between shadow-md">
      <div className="flex items-center">
        <User className="h-6 w-6 mr-3 text-imperial-teal" />
        <div>
          <h2 className="text-xl font-semibold">{bot.module}</h2>
          {isTestMode && (
            <div className="flex items-center mt-1">
              <TestTube className="h-4 w-4 mr-1 text-yellow-400" />
              <span className="text-xs text-yellow-400 font-medium">TEST MODE - Data not saved</span>
            </div>
          )}
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