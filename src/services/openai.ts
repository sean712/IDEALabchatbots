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
    if (!this.initialized || !this.client || !this.currentAssistantId) {
      throw new Error('OpenAI service not initialized. Please check your environment variables.');
    }

    await this.client.beta.threads.messages.create(threadId, {
      role: 'user',
      content
    });

    const run = await this.client.beta.threads.runs.create(threadId, {
      assistant_id: this.currentAssistantId
    });

    // Poll for the run completion
    let runStatus = await this.client.beta.threads.runs.retrieve(threadId, run.id);
    while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await this.client.beta.threads.runs.retrieve(threadId, run.id);
    }

    // Check if the run completed successfully
    if (runStatus.status === 'failed') {
      throw new Error(`Assistant run failed: ${runStatus.last_error?.message || 'Unknown error'}`);
    }

    if (runStatus.status !== 'completed') {
      throw new Error(`Assistant run did not complete successfully. Status: ${runStatus.status}`);
    }

    // Get the messages after the run completes
    const messages = await this.client.beta.threads.messages.list(threadId);
    
    // Find the first message from the assistant (should be the most recent)
    const assistantMessage = messages.data.find(message => message.role === 'assistant');
    
    if (!assistantMessage) {
      throw new Error('No assistant response found');
    }

    // Make sure the message has content
    if (!assistantMessage.content || assistantMessage.content.length === 0) {
      throw new Error('Assistant response is empty');
    }

    let responseText = assistantMessage.content[0].text.value;
    
    // Process citations if they exist
    if (assistantMessage.content[0].text.annotations && assistantMessage.content[0].text.annotations.length > 0) {
      const annotations = assistantMessage.content[0].text.annotations;
      const sources: string[] = [];
      
      // Process annotations and get file information
      for (const annotation of annotations) {
        if (annotation.type === 'file_citation') {
          try {
            const fileId = annotation.file_citation?.file_id;
            if (fileId && this.client) {
              const file = await this.client.files.retrieve(fileId);
              const fileName = file.filename || 'Unknown Source';
              sources.push(fileName);
              responseText = responseText.replace(annotation.text, '');
            }
          } catch (error) {
            console.warn('Could not retrieve file information for citation:', error);
            sources.push('Unknown Source');
            responseText = responseText.replace(annotation.text, '');
          }
        }
      }
      
      // Add sources at the end of the response
      if (sources.length > 0) {
        const uniqueSources = [...new Set(sources)]; // Remove duplicates
        responseText += '\n\n' + uniqueSources.map(source => `(Source: ${source})`).join('\n');
      }
    }
    
    return responseText;
  }
}

export const openAIService = OpenAIService.getInstance();