'use server';

/**
 * @fileOverview Suggests relevant posts based on user interests.
 *
 * - suggestPosts - A function that suggests posts based on user interests.
 * - SuggestPostsInput - The input type for the suggestPosts function.
 * - SuggestPostsOutput - The return type for the suggestPosts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPostsInputSchema = z.object({
  userActivity: z
    .string()
    .describe(
      'A description of the users activities and recent interactions within the application, like posts they have viewed, liked, or commented on.'
    ),
  trendingTopics: z
    .string()
    .describe('A list of trending topics within the Urobili Connect application.'),
});
export type SuggestPostsInput = z.infer<typeof SuggestPostsInputSchema>;

const SuggestPostsOutputSchema = z.object({
  suggestedPosts: z
    .array(z.string())
    .describe('A list of suggested posts based on the users interests.'),
});
export type SuggestPostsOutput = z.infer<typeof SuggestPostsOutputSchema>;

export async function suggestPosts(input: SuggestPostsInput): Promise<SuggestPostsOutput> {
  return suggestPostsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPostsPrompt',
  input: {schema: SuggestPostsInputSchema},
  output: {schema: SuggestPostsOutputSchema},
  prompt: `You are an expert social media content curator for the Urobili Connect application.

  Based on the user's recent activity and current trending topics, you will provide a list of posts that would be relevant and engaging to the user.

  User Activity: {{{userActivity}}}

  Trending Topics: {{{trendingTopics}}}

  Please provide a list of suggested posts that the user would find interesting:
  `,
});

const suggestPostsFlow = ai.defineFlow(
  {
    name: 'suggestPostsFlow',
    inputSchema: SuggestPostsInputSchema,
    outputSchema: SuggestPostsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
