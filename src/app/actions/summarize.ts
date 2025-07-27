'use server';

import { summarizeArticleFlow } from '@/ai/flows/summarize-article';

export async function summarizeArticle(content: string): Promise<string> {
  try {
    const result = await summarizeArticleFlow({ content });
    return result.summary;
  } catch (error) {
    console.error('Error summarizing article:', error);
    return 'Sorry, we were unable to summarize this article at the moment.';
  }
}
