// lib/news.ts
'use server';
import 'server-only';
import { subDays, format } from 'date-fns';

interface NewsArticle {
    source: {
        id: string | null;
        name: string;
    };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
}

export async function getNews(): Promise<NewsArticle[]> {
    const apiKey = "39c2228d67714a88968ab22ae6bb6b52";
    if (!apiKey) {
        console.error('News API key is not configured.');
        return [];
    }

    // Get a random date within the last 30 days
    const randomDaysAgo = Math.floor(Math.random() * 30);
    const date = subDays(new Date(), randomDaysAgo);
    const formattedDate = format(date, 'yyyy-MM-dd');
    const query = '("graphic design" OR "image generation" OR "generative ai" OR "design trends")';

    const url = `https://newsapi.org/v2/everything?q=(${encodeURIComponent(query)})&from=${formattedDate}&to=${formattedDate}&apiKey=${apiKey}&language=en&sortBy=popularity&pageSize=40`;

    try {
        const response = await fetch(url, { next: { revalidate: 3600 }}); // Revalidate every hour
        if (!response.ok) {
            const errorData = await response.text();
            console.error('Failed to fetch news:', response.statusText, errorData);
            return [];
        }
        const data = await response.json();
        if (data.status === 'error') {
            console.error('News API Error:', data.message);
            return [];
        }
        return data.articles.filter((article: NewsArticle) => article.urlToImage && article.title && article.content);
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}
