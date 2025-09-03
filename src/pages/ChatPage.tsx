import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import { getBotById } from '../config/bots';
import ChatHeader from '../components/chat/ChatHeader';
import ChatInput from '../components/chat/ChatInput';
import ErrorMessage from '../components/chat/ErrorMessage';
import MessageList from '../components/chat/MessageList';
import SamplePrompts from '../components/chat/SamplePrompts';
import { useAppContext } from '../context/AppContext';

const ChatPage: React.FC = () => {
  const { botId } = useParams<{ botId: string }>();
  const bot = getBotById(botId || '');
  const [input, setInput] = useState('');
  const { setChatMessages, setThreadId, setError } = useAppContext();

  // Redirect to landing page if bot not found
  if (!bot) {
    return <Navigate to="/" replace />;
  }

  const { messages, isLoading, error, sendMessage, initializeChat, clearChat } = useChat(bot);

  // Clear chat state when switching to a different bot
  useEffect(() => {
    setChatMessages([]);
    setThreadId(null);
    setError(null);
  }, [botId, setChatMessages, setThreadId, setError]);
  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  const handleSamplePrompt = (prompt: string) => {
    sendMessage(prompt);
  };
  return (
    <div className="h-full">
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden h-full flex flex-col">
        <ChatHeader bot={bot} onClearChat={clearChat} />
        {error && <ErrorMessage message={error} />}
        
        {messages.length === 0 && (
          <div className="p-8 text-center bg-gray-50 flex-1 flex flex-col justify-center items-center">
            <h2 className="text-2xl font-semibold text-imperial-navy mb-4">
              Welcome to {bot.module}
            </h2>
            <div className="max-w-2xl mx-auto mb-8">
              <p className="text-gray-700 mb-6">
                I'm {bot.instructor}, and I'm here to help you with your {bot.module} studies in the {bot.program} programme. You can ask me about concepts, strategies, case studies, or get help with your assignments.
              </p>
            </div>
            <SamplePrompts samplePrompts={bot.samplePrompts} onPromptClick={handleSamplePrompt} />
          </div>
        )}
        
        <MessageList messages={messages} botImage={bot.image} />
        <ChatInput
          input={input}
          isLoading={isLoading}
          error={error}
          onInputChange={setInput}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ChatPage;