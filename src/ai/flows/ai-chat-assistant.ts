// src/ai/flows/ai-chat-assistant.ts
'use server';

/**
 * @fileOverview An AI chat assistant flow. This flow allows users to chat with an AI assistant for quick answers and casual conversation.
 *
 * - aiChatAssistant - A function that handles the chat with the AI assistant.
 * - AiChatAssistantInput - The input type for the aiChatAssistant function.
 * - AiChatAssistantOutput - The return type for the aiChatAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiChatAssistantInputSchema = z.object({
  message: z.string().describe('The message from the user to the AI assistant.'),
});
export type AiChatAssistantInput = z.infer<typeof AiChatAssistantInputSchema>;

const AiChatAssistantOutputSchema = z.object({
  response: z.string().describe('The response from the AI assistant.'),
});
export type AiChatAssistantOutput = z.infer<typeof AiChatAssistantOutputSchema>;

export async function aiChatAssistant(input: AiChatAssistantInput): Promise<AiChatAssistantOutput> {
  return aiChatAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatAssistantPrompt',
  input: {schema: AiChatAssistantInputSchema},
  output: {schema: AiChatAssistantOutputSchema},
  prompt: `You are a helpful AI assistant named Urobili. Respond to the user message below.

User Message: {{{message}}}`,
});

const aiChatAssistantFlow = ai.defineFlow(
  {
    name: 'aiChatAssistantFlow',
    inputSchema: AiChatAssistantInputSchema,
    outputSchema: AiChatAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
