// LLM Integration for AI Co-writing
export interface StoryConfig {
  genre: string;
  tone: string;
  style: string;
  pov: string;
}

export interface LLMResponse {
  content: string;
  error?: string;
}

// OpenAI GPT-4 Integration (Recommended for creative writing)
export class OpenAIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateStoryContent(
    prompt: string,
    context: string[],
    config: StoryConfig,
    controls: { pace: number; detail: number; tone: number }
  ): Promise<LLMResponse> {
    try {
      const systemPrompt = this.buildSystemPrompt(config, controls);
      const contextString = context.join('\n\n');

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Story so far:\n${contextString}\n\nUser input: ${prompt}` }
          ],
          max_tokens: 800,
          temperature: 0.8,
          presence_penalty: 0.1,
          frequency_penalty: 0.1,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'API request failed');
      }

      return {
        content: data.choices[0]?.message?.content || 'No response generated',
      };
    } catch (error) {
      return {
        content: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  private buildSystemPrompt(config: StoryConfig, controls: { pace: number; detail: number; tone: number }): string {
    const paceLevel = controls.pace < 33 ? 'slow and contemplative' : controls.pace < 66 ? 'moderate' : 'fast-paced and dynamic';
    const detailLevel = controls.detail < 33 ? 'concise' : controls.detail < 66 ? 'moderately detailed' : 'richly detailed';
    const toneIntensity = controls.tone < 33 ? 'subtle' : controls.tone < 66 ? 'balanced' : 'intense';

    return `You are an expert creative writing assistant specializing in ${config.genre} fiction. 

Writing Guidelines:
- Genre: ${config.genre}
- Tone: ${config.tone} (${toneIntensity})
- Style: ${config.style}
- Point of View: ${config.pov}
- Pacing: ${paceLevel}
- Detail Level: ${detailLevel}

Instructions:
1. Continue the story naturally from where the user left off
2. Maintain consistency with established characters, plot, and world-building
3. Match the user's writing style and voice
4. Keep responses between 100-300 words unless the user requests otherwise
5. End at a natural pause or cliffhanger to encourage continued collaboration
6. Avoid repetitive phrases or concepts from previous segments
7. Focus on advancing the plot or developing characters

Remember: You're a co-writer, not taking over the story. Collaborate and build upon what the user has created.`;
  }
}

// Anthropic Claude Integration (Alternative - excellent for creative writing)
export class ClaudeService {
  private apiKey: string;
  private baseUrl = 'https://api.anthropic.com/v1/messages';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateStoryContent(
    prompt: string,
    context: string[],
    config: StoryConfig,
    controls: { pace: number; detail: number; tone: number }
  ): Promise<LLMResponse> {
    try {
      const systemPrompt = this.buildSystemPrompt(config, controls);
      const contextString = context.join('\n\n');

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 800,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: `Story so far:\n${contextString}\n\nUser input: ${prompt}`
            }
          ],
          temperature: 0.8,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'API request failed');
      }

      return {
        content: data.content[0]?.text || 'No response generated',
      };
    } catch (error) {
      return {
        content: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  private buildSystemPrompt(config: StoryConfig, controls: { pace: number; detail: number; tone: number }): string {
    const paceLevel = controls.pace < 33 ? 'slow and contemplative' : controls.pace < 66 ? 'moderate' : 'fast-paced and dynamic';
    const detailLevel = controls.detail < 33 ? 'concise' : controls.detail < 66 ? 'moderately detailed' : 'richly detailed';
    const toneIntensity = controls.tone < 33 ? 'subtle' : controls.tone < 66 ? 'balanced' : 'intense';

    return `You are an expert creative writing assistant specializing in ${config.genre} fiction. 

Writing Guidelines:
- Genre: ${config.genre}
- Tone: ${config.tone} (${toneIntensity})
- Style: ${config.style}
- Point of View: ${config.pov}
- Pacing: ${paceLevel}
- Detail Level: ${detailLevel}

Instructions:
1. Continue the story naturally from where the user left off
2. Maintain consistency with established characters, plot, and world-building
3. Match the user's writing style and voice
4. Keep responses between 100-300 words unless the user requests otherwise
5. End at a natural pause or cliffhanger to encourage continued collaboration
6. Avoid repetitive phrases or concepts from previous segments
7. Focus on advancing the plot or developing characters

Remember: You're a co-writer, not taking over the story. Collaborate and build upon what the user has created.`;
  }
}

// Factory function to create LLM service
export function createLLMService(provider: 'openai' | 'claude', apiKey: string) {
  switch (provider) {
    case 'openai':
      return new OpenAIService(apiKey);
    case 'claude':
      return new ClaudeService(apiKey);
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
}