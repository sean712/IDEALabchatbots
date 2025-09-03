import React from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  error: string | null;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  isLoading,
  error,
  onInputChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="p-4 border-t bg-gray-50">
      <div className="flex space-x-4">
        <input
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-lg border-gray-300 shadow-sm focus:ring-imperial-teal focus:border-imperial-teal bg-white"
          disabled={isLoading || !!error}
        />
        <button
          type="submit"
          disabled={isLoading || !!error}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-imperial-navy hover:bg-imperial-navy/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-imperial-teal disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.02]"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;