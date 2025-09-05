import { useCallback } from 'react';
import { Message } from '../types';
import { BotConfig } from '../config/bots';
import { openAIService } from '../services/openai';
import { useAppContext } from '../context/AppContext';
import { conversationStorageService } from '../services/conversationStorage';

export const useChat = (bot: BotConfig, isTestMode: boolean = false) => {
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

    // Add empty assistant message immediately for streaming
    const assistantMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage, assistantMessage]);
    setIsLoading(true);
    setError(null);

    try {
      await openAIService.sendMessage(
        threadId, 
        content,
        // onContentUpdate callback
        (streamContent: string) => {
          setChatMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage && lastMessage.role === 'assistant') {
              lastMessage.content = streamContent;
            }
            return newMessages;
          });
        },
        // onComplete callback
        () => {
          setIsLoading(false);
          
          // Save the complete conversation to Supabase (only if not in test mode)
          if (!isTestMode) {
            setChatMessages(currentMessages => {
              conversationStorageService.saveConversation(threadId, currentMessages, bot.id, bot.name);
              return currentMessages;
            });
          }
        }
      );
    } catch (err) {
      // Remove the empty assistant message if there was an error
      setChatMessages(prev => prev.slice(0, -1));
      setError(err instanceof Error ? err.message : 'Failed to send message');
      console.error('Error sending message:', err);
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