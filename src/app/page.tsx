'use client';
import { getNews } from '@/lib/news';
import { PostCard } from '@/components/PostCard';
import { Header } from '@/components/Header';
import { useEffect, useState } from 'react';
import { PostCardSkeleton } from '@/components/PostCardSkeleton';
import { useAuth } from '@/hooks/use-auth';

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

function NewsFeed() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      const fetchedArticles = await getNews();
       // Shuffle articles for variety
      setArticles(fetchedArticles.sort(() => 0.5 - Math.random()));
      setLoading(false);
    }
    loadNews();
  }, []);


  if (loading) {
      return <PostCardSkeleton />;
  }

  if (!articles || articles.length === 0) {
    return <p className="mt-8 text-center text-muted-foreground">Could not load news feed at the moment.</p>
  }

  return (
    <div className="space-y-4">
      {articles.map((article, index) => (
        <PostCard
          key={index}
          article={article}
          user={{
            name: user?.displayName || 'Anonymous',
            avatar: user?.photoURL || 'https://placehold.co/100x100.png',
            initials: user?.displayName?.substring(0,2).toUpperCase() || 'AD'
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-6">
      <Header title="Trending News" subtitle="Latest in design & AI" />
      <div className="mt-6">
        <NewsFeed />
      </div>
    </div>
  );
}
