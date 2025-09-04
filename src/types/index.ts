export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatHistory {
  messages: Message[];
}