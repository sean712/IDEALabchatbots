import { useCallback } from 'react';
import { Message } from '../types';
import { BotConfig } from '../config/bots';
import { openAIService } from '../services/openai';
import { useAppContext } from '../context/AppContext';
import { conversationStorageService } from '../services/conversationStorage';

export const useChat = (bot: BotConfig) => {
  const {
    chatMessages,
    setChatMessages,
    isLoading,
    setIsLoading,
    error,
    setError,
    threadId,
    setThreadId,
  } = useAppContext();

  const initializeChat = useCallback(async () => {
    if (threadId) return; // Already initialized

    try {
      openAIService.initialize(bot.assistantId);
      if (!openAIService.isInitialized()) {
        setError('OpenAI service not initialized. Please check your environment variables.');
        return;
      }
      const thread = await openAIService.createThread();
      setThreadId(thread.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize chat');
    }
  }, [threadId, setError, setThreadId, bot.assistantId]);

  const clearChat = useCallback(async () => {
    try {
      setIsLoading(false);
      setError(null);
      setChatMessages([]);
      setThreadId(null);
      
      // Initialize a new thread
      openAIService.initialize(bot.assistantId);
      if (!openAIService.isInitialized()) {
        setError('OpenAI service not initialized. Please check your environment variables.');
        return;
      }
      const thread = await openAIService.createThread();
      setThreadId(thread.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear chat');
    }
  }, [setIsLoading, setError, setChatMessages, setThreadId, bot.assistantId]);
  const sendMessage = useCallback(async (content: string) => {
    if (!threadId) return;

    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await openAIService.sendMessage(threadId, content);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setChatMessages(prev => [...prev, assistantMessage]);

      // Save the complete updated conversation to Supabase
      setChatMessages(currentMessages => {
        const updatedMessages = [...currentMessages];
        conversationStorageService.saveConversation(threadId, updatedMessages, bot.id, bot.name);
        return updatedMessages;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  }, [threadId, setChatMessages, setIsLoading, setError, bot.id, bot.name]);

  return {
    messages: chatMessages,
    isLoading,
    error,
    sendMessage,
    initializeChat,
    clearChat,
  };
};