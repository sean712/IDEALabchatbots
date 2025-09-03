import { supabase } from './supabase';
import { Message } from '../types';

export class ConversationStorageService {
  private static instance: ConversationStorageService;

  private constructor() {}

  static getInstance(): ConversationStorageService {
    if (!ConversationStorageService.instance) {
      ConversationStorageService.instance = new ConversationStorageService();
    }
    return ConversationStorageService.instance;
  }

  async saveConversation(threadId: string, messages: Message[], botId: string, botName: string): Promise<void> {
    if (!threadId || messages.length === 0) return;

    try {
      const conversationData = {
        thread_id: threadId,
        bot_id: botId,
        bot_name: botName,
        messages: messages,
        message_count: messages.length
      };

      // Use upsert to handle both insert and update automatically
      const { error } = await supabase
        .from('conversations')
        .upsert(conversationData, {
          onConflict: 'thread_id'
        });

      if (error) {
        console.error('Error saving conversation:', error);
      }
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  }

  async getConversationAnalytics() {
    try {
      // Get all conversations for analysis
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversation analytics:', error);
        return null;
      }

      return data?.map(conversation => ({
        ...conversation,
        messages: JSON.parse(conversation.messages)
      }));
    } catch (error) {
      console.error('Error in getConversationAnalytics:', error);
      return null;
    }
  }

  async getConversationStats() {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('message_count, created_at, updated_at, bot_id, bot_name');

      if (error) {
        console.error('Error fetching conversation stats:', error);
        return null;
      }

      return {
        totalConversations: data?.length || 0,
        totalMessages: data?.reduce((sum, conv) => sum + conv.message_count, 0) || 0,
        averageMessagesPerConversation: data?.length ? 
          (data.reduce((sum, conv) => sum + conv.message_count, 0) / data.length).toFixed(1) : 0,
        botBreakdown: data?.reduce((acc, conv) => {
          const botKey = conv.bot_name || 'Unknown Bot';
          if (!acc[botKey]) {
            acc[botKey] = { conversations: 0, messages: 0 };
          }
          acc[botKey].conversations += 1;
          acc[botKey].messages += conv.message_count;
          return acc;
        }, {} as Record<string, { conversations: number; messages: number }>) || {}
      };
    } catch (error) {
      console.error('Error in getConversationStats:', error);
      return null;
    }
  }

  async getBotComparison() {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('bot_id, bot_name, message_count, created_at, updated_at');

      if (error) {
        console.error('Error fetching bot comparison data:', error);
        return null;
      }

      return data?.reduce((acc, conv) => {
        const botId = conv.bot_id || 'unknown';
        if (!acc[botId]) {
          acc[botId] = {
            bot_name: conv.bot_name || 'Unknown Bot',
            total_conversations: 0,
            total_messages: 0,
            average_messages: 0
          };
        }
        
        acc[botId].total_conversations += 1;
        acc[botId].total_messages += conv.message_count;
        acc[botId].average_messages = acc[botId].total_messages / acc[botId].total_conversations;
        
        return acc;
      }, {} as Record<string, {
        bot_name: string;
        total_conversations: number;
        total_messages: number;
        average_messages: number;
      }>) || {};
    } catch (error) {
      console.error('Error in getBotComparison:', error);
      return null;
    }
  }
}

export const conversationStorageService = ConversationStorageService.getInstance();