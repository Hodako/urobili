'use server';
/**
 * @fileOverview An AI flow to summarize an article.
 *
 * - summarizeArticleFlow - A function that handles the article summarization.
 * - SummarizeArticleInput - The input type for the summarizeArticleFlow function.
 * - SummarizeArticleOutput - The return type for the summarizeArticleFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeArticleInputSchema = z.object({
  content: z.string().describe('The full content of the article to be summarized.'),
});
export type SummarizeArticleInput = z.infer<typeof SummarizeArticleInputSchema>;

const SummarizeArticleOutputSchema = z.object({
  summary: z.string().describe('The concise summary of the article.'),
});
export type SummarizeArticleOutput = z.infer<typeof SummarizeArticleOutputSchema>;

const prompt = ai.definePrompt({
  name: 'summarizeArticlePrompt',
  input: {schema: SummarizeArticleInputSchema},
  output: {schema: SummarizeArticleOutputSchema},
  prompt: `You are an expert content summarizer. Your task is to provide a clear and concise summary of the following article content. Focus on the main points and key takeaways. The summary should be about 3-4 sentences long.

Article Content:
{{{content}}}`,
});

export const summarizeArticleFlow = ai.defineFlow(
  {
    name: 'summarizeArticleFlow',
    inputSchema: SummarizeArticleInputSchema,
    outputSchema: SummarizeArticleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
