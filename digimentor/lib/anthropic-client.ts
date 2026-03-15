import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client with explicit API key
const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  console.error('ANTHROPIC_API_KEY is not set in environment variables');
}

const anthropic = new Anthropic({
  apiKey: apiKey || '',
});

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ClaudeResponse {
  content: string;
  error?: string;
}

/**
 * Call Claude API with retry logic and exponential backoff
 * @param messages - Array of chat messages
 * @param systemPrompt - System prompt for Claude
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @returns Claude's response or error message
 */
export async function callClaude(
  messages: ChatMessage[],
  systemPrompt: string,
  maxRetries: number = 3
): Promise<ClaudeResponse> {
  let lastError: Error | null = null;

  // Check if API key is configured
  if (!apiKey) {
    console.error('Cannot call Claude: ANTHROPIC_API_KEY is not configured');
    return {
      content: '',
      error: 'API key not configured',
    };
  }

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`Calling Claude API (attempt ${attempt + 1}/${maxRetries})...`);
      
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
      });

      console.log('Claude API call successful');

      // Extract text content from response
      const textContent = response.content
        .filter(block => block.type === 'text')
        .map(block => ('text' in block ? block.text : ''))
        .join('');

      return {
        content: textContent,
      };
    } catch (error) {
      lastError = error as Error;
      console.error(`Claude API attempt ${attempt + 1} failed:`, error);

      // If this isn't the last attempt, wait before retrying
      if (attempt < maxRetries - 1) {
        // Exponential backoff: 1s, 2s, 4s
        const waitTime = Math.pow(2, attempt) * 1000;
        console.log(`Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  // All retries failed
  console.error('All Claude API retry attempts failed');
  return {
    content: '',
    error: lastError?.message || 'Failed to get response from AI tutor',
  };
}

/**
 * Validate that the API key is configured
 */
export function isClaudeConfigured(): boolean {
  const isConfigured = !!apiKey;
  console.log('Claude API configured:', isConfigured);
  return isConfigured;
}
