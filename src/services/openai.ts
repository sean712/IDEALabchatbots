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

  async sendMessage(threadId: string, content: string, onUpdate: (partialResponse: string) => void): Promise<string> {
    return this.sendMessageWithStreaming(threadId, content, onUpdate);
  }

  private async sendMessageWithStreaming(threadId: string, content: string, onUpdate: (partialResponse: string) => void): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!this.initialized || !this.client || !this.currentAssistantId) {
        reject(new Error('OpenAI service not initialized. Please check your environment variables.'));
        return;
      }

      this.client.beta.threads.messages.create(threadId, {
        role: 'user',
        content
      }).then(() => {
        if (!this.client || !this.currentAssistantId) {
          reject(new Error('OpenAI service not initialized.'));
          return;
        }

        const run = this.client.beta.threads.runs.createAndStream(threadId, {
          assistant_id: this.currentAssistantId,
          tool_choice: { type: "file_search" }
        });

        let fullResponse = '';

        run
          .on('textCreated', () => {
            // Text generation started
          })
          .on('textDelta', (textDelta) => {
            if (textDelta.value) {
              fullResponse += textDelta.value;
              onUpdate(fullResponse);
            }
          })
          .on('toolCallCreated', (toolCall) => {
            console.log('Tool call created:', toolCall.type);
          })
          .on('toolCallDelta', (toolCallDelta) => {
            if (toolCallDelta.type === 'file_search') {
              // Handle file search tool calls if needed
            }
          })
          .on('messageDone', () => {
            // Clean up any citation markers from the final response
            fullResponse = fullResponse.replace(/【\d+:\d+†[^】]*】/g, '');
            onUpdate(fullResponse);
          })
          .on('end', () => {
            resolve(fullResponse);
          })
          .on('error', (error) => {
            reject(error);
          });
      }).catch(reject);
    });
  }
}

export const openAIService = OpenAIService.getInstance();