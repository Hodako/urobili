import { config } from 'dotenv';
config();

import '@/ai/flows/ai-chat-assistant.ts';
import '@/ai/flows/suggest-posts.ts';
import '@/ai/flows/generate-image.ts';
import '@/ai/flows/summarize-article.ts';
import '@/ai/flows/fetch-article-content.ts';
