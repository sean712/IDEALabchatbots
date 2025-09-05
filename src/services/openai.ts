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

  async sendMessage(threadId: string, content: string) {
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
        const sources: string[] = [];

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
          .on('messageDone', async (message) => {
            // Process citations when message is complete
            if (message.content && message.content.length > 0) {
              const textContent = message.content[0];
              if (textContent.type === 'text' && textContent.text.annotations) {
                let responseText = textContent.text.value; // Use the actual message content with annotations
                
                for (const annotation of textContent.text.annotations) {
                  if (annotation.type === 'file_citation') {
                    try {
                      const fileId = annotation.file_citation?.file_id;
                      if (fileId && this.client) {
                        const file = await this.client.files.retrieve(fileId);
                        const fileName = file.filename || 'Unknown Source';
                        sources.push(fileName);
                      }
                    } catch (error) {
                      console.warn('Could not retrieve file information for citation:', error);
                      sources.push('Unknown Source');
                    }
                  }
                }
                
                // Remove all citation markers from the text
                responseText = responseText.replace(/\【\d+:\d+†[^】]*\】/g, '');
                
                // Add sources at the end of the response
                if (sources.length > 0) {
                  const uniqueSources = [...new Set(sources)];
                  responseText += '\n\n**Sources:**\n' + uniqueSources.map(source => `• ${source}`).join('\n');
                }
                
                fullResponse = responseText;
                onUpdate(fullResponse);
              } else {
                // If no annotations, just clean up any citation markers that might be in fullResponse
                fullResponse = fullResponse.replace(/\【\d+:\d+†[^】]*\】/g, '');
                if (sources.length > 0) {
                  const uniqueSources = [...new Set(sources)];
                  fullResponse += '\n\n**Sources:**\n' + uniqueSources.map(source => `• ${source}`).join('\n');
                }
                onUpdate(fullResponse);
              }
            }
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
        const sources: string[] = [];

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
          .on('messageDone', async (message) => {
            // Process citations when message is complete
            if (message.content && message.content.length > 0) {
              const textContent = message.content[0];
              if (textContent.type === 'text' && textContent.text.annotations) {
                let responseText = textContent.text.value; // Use the actual message content with annotations
                
                for (const annotation of textContent.text.annotations) {
                  if (annotation.type === 'file_citation') {
                    try {
                      const fileId = annotation.file_citation?.file_id;
                      if (fileId && this.client) {
                        const file = await this.client.files.retrieve(fileId);
                        const fileName = file.filename || 'Unknown Source';
                        sources.push(fileName);
                      }
                    } catch (error) {
                      console.warn('Could not retrieve file information for citation:', error);
                      sources.push('Unknown Source');
                    }
                  }
                }
                
                // Remove all citation markers from the text
                responseText = responseText.replace(/\【\d+:\d+†[^】]*\】/g, '');
                
                // Add sources at the end of the response
                if (sources.length > 0) {
                  const uniqueSources = [...new Set(sources)];
                  responseText += '\n\n**Sources:**\n' + uniqueSources.map(source => `• ${source}`).join('\n');
                }
                
                fullResponse = responseText;
                onUpdate(fullResponse);
              } else {
                // If no annotations, just clean up any citation markers that might be in fullResponse
                fullResponse = fullResponse.replace(/\【\d+:\d+†[^】]*\】/g, '');
                if (sources.length > 0) {
                  const uniqueSources = [...new Set(sources)];
                  fullResponse += '\n\n**Sources:**\n' + uniqueSources.map(source => `• ${source}`).join('\n');
                }
                onUpdate(fullResponse);
              }
            }
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