'use server';

import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

export async function readability(url: string) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch article: ${response.statusText}`);
        }
        const html = await response.text();
        const doc = new JSDOM(html, { url });
        const reader = new Readability(doc.window.document);
        const article = reader.parse();

        if (!article) {
            throw new Error('Failed to parse article content.');
        }

        return {
            title: article.title,
            content: article.content,
            author: article.byline,
        };
    } catch (error) {
        console.error('Error in readability tool:', error);
        throw new Error('Could not process the article from the provided URL.');
    }
}
