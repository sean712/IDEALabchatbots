import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config/env';

class OpenAIService {
  private static instance: OpenAIService;
  private client: OpenAI | null = null;
  private initialized = false;
  private currentAssistantId: string | null = null;

  private constructor() {}

  static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  initialize(assistantId: string) {
    if (!OPENAI_API_KEY || !assistantId) {
      this.initialized = false;
      return;
    }

    this.currentAssistantId = assistantId;
    this.client = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true // Note: In production, you should use a backend proxy
    });
    this.initialized = true;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  async createThread() {
    if (!this.initialized || !this.client) {
      throw new Error('OpenAI service not initialized. Please check your environment variables.');
    }
    return await this.client.beta.threads.create();
  }

  async sendMessage(
    threadId: string, 
    content: string, 
    onContentUpdate: (content: string) => void,
    onComplete: () => void
  ) {
    if (!this.initialized || !this.client || !this.currentAssistantId) {
      throw new Error('OpenAI service not initialized. Please check your environment variables.');
    }

    await this.client.beta.threads.messages.create(threadId, {
      role: 'user',
      content
    });

    try {
      const stream = this.client.beta.threads.runs.stream(threadId, {
        assistant_id: this.currentAssistantId
      });

      let fullContent = '';

      for await (const event of stream) {
        if (event.event === 'thread.message.delta') {
          const delta = event.data.delta;
          if (delta.content && delta.content[0] && delta.content[0].type === 'text') {
            const textDelta = delta.content[0].text?.value || '';
            if (textDelta) {
              fullContent += textDelta;
              // Remove citation markers like 【4:1†source】 from the content
              const cleanContent = fullContent.replace(/【[^】]*】/g, '');
              onContentUpdate(cleanContent);
            }
          }
        } else if (event.event === 'thread.run.completed') {
          onComplete();
          break;
        } else if (event.event === 'thread.run.failed') {
          const error = event.data.last_error;
          throw new Error(`Assistant run failed: ${error?.message || 'Unknown error'}`);
        } else if (event.event === 'thread.run.cancelled') {
          throw new Error('Assistant run was cancelled');
        } else if (event.event === 'thread.run.expired') {
          throw new Error('Assistant run expired');
        }
      }

      // If we get here without completion, throw an error
      if (!fullContent) {
        throw new Error('No content received from assistant');
      }
    } catch (error) {
      console.error('Streaming error:', error);
      throw error;
    }
  }
}

export const openAIService = OpenAIService.getInstance();