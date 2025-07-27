'use server';
/**
 * @fileOverview Fetches and parses article content from a URL.
 *
 * - fetchArticleContent - A function that takes a URL and returns the parsed article content.
 * - FetchArticleContentInput - The input type for the fetchArticleContent function.
 * - FetchArticleContentOutput - The return type for the fetchArticleContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {readability} from '@/tools/readability';

const FetchArticleContentInputSchema = z.object({
  url: z.string().url().describe('The URL of the article to fetch.'),
});
export type FetchArticleContentInput = z.infer<typeof FetchArticleContentInputSchema>;

const FetchArticleContentOutputSchema = z.object({
  title: z.string().describe('The title of the article.'),
  content: z.string().describe('The main content of the article in HTML format.'),
  author: z.string().optional().describe('The author of the article.'),
});
export type FetchArticleContentOutput = z.infer<typeof FetchArticleContentOutputSchema>;

const fetchArticleTool = ai.defineTool(
    {
        name: 'fetchArticle',
        description: 'Fetches the main content of an article from a given URL.',
        inputSchema: FetchArticleContentInputSchema,
        outputSchema: FetchArticleContentOutputSchema,
    },
    async (input) => {
        try {
            const article = await readability(input.url);
            return {
                ...article,
                author: article.author || '',
            };
        } catch (error) {
            console.error(`Failed to process article from ${input.url}:`, error);
            // Return a result that indicates failure but still fits the schema
            return {
                title: 'Could not load article',
                content: '',
                author: '',
            }
        }
    }
)


export const fetchArticleContentFlow = ai.defineFlow(
  {
    name: 'fetchArticleContentFlow',
    inputSchema: FetchArticleContentInputSchema,
    outputSchema: FetchArticleContentOutputSchema,
    tools: [fetchArticleTool]
  },
  async (input) => {
    const result = await fetchArticleTool(input);
    return result;
  }
);

export async function fetchArticleContent(url: string): Promise<FetchArticleContentOutput> {
    return fetchArticleContentFlow({ url });
}
