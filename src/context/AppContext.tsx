import React, { createContext, useContext, useState } from 'react';
import { Message } from '../types';

interface AppContextType {
  chatMessages: Message[];
  setChatMessages: (messages: Message[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  threadId: string | null;
  setThreadId: (threadId: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);

  return (
    <AppContext.Provider
      value={{
        chatMessages,
        setChatMessages,
        isLoading,
        setIsLoading,
        error,
        setError,
        threadId,
        setThreadId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};