

'use client';
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark, Loader2, BookOpen, Sparkles, ExternalLink } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { summarizeArticle } from '@/app/actions/summarize';
import { useBookmarks } from '@/hooks/use-bookmarks';
import { useToast } from '@/hooks/use-toast';

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

interface PostCardProps {
  article: NewsArticle;
  user: {
    name: string;
    avatar: string;
    initials: string;
  }
}

function ArticleSummary({ content }: { content: string }) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getSummary() {
      if (!content) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const result = await summarizeArticle(content);
        setSummary(result);
      } catch (error) {
        console.error("Summarization failed:", error);
        setSummary("Sorry, we couldn't summarize this article right now.");
      } finally {
        setIsLoading(false);
      }
    }
    getSummary();
  }, [content]);
  
  if(!content) {
    return (
        <div className="space-y-4">
            <p className="text-base leading-relaxed text-destructive">Could not generate summary because article content is not available.</p>
        </div>
    )
  }

  return (
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <p className="text-base leading-relaxed">{summary}</p>
        )}
      </div>
  );
}


export function PostCard({ article, user }: PostCardProps) {
  const { author, source, title, content, urlToImage, url } = article;
  const [isLiked, setIsLiked] = useState(false);
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();
  const [isSummarizeOpen, setIsSummarizeOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();
  
  const isBookmarked = bookmarks.some(b => b.url === url);

  const handleBookmarkToggle = () => {
    if (isBookmarked) {
      removeBookmark(url);
       toast({ title: "Bookmark removed", description: "Article removed from your bookmarks." });
    } else {
      addBookmark(article);
       toast({ title: "Bookmark added!", description: "Article saved to your bookmarks." });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this article: ${title}`,
          url: url,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback to clipboard if share fails
        navigator.clipboard.writeText(url);
        toast({ title: "Link Copied", description: "Sharing is not available, so the link was copied to your clipboard." });
      }
    } else {
       navigator.clipboard.writeText(url);
       toast({ title: "Link Copied", description: "Article URL copied to your clipboard." });
    }
  };

  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <CardHeader className="flex flex-row items-center gap-4 p-4">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="user avatar" />
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">{author || source.name || 'Urobili News'}</p>
            <p className="text-sm text-muted-foreground">{`@${(source.name || '').replace(/\s+/g, '').toLowerCase()}`}</p>
          </div>
           <Button variant="ghost" size="icon" onClick={handleBookmarkToggle}>
            <Bookmark className={isBookmarked ? "h-5 w-5 text-primary fill-primary" : "h-5 w-5"} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                <span>Share</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open(url, '_blank')}>
                <ExternalLink className="mr-2 h-4 w-4" />
                <span>Open in new tab</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="space-y-4 px-4 pb-4">
            <p className="text-base font-semibold">{title}</p>
            {urlToImage && (
                <button className="w-full" onClick={() => setIsPreviewOpen(true)}>
                    <div className="mt-4 relative aspect-video w-full overflow-hidden rounded-lg border">
                        <Image src={urlToImage} alt={title} layout="fill" objectFit="cover" className="transition-transform duration-300 hover:scale-105" />
                    </div>
                </button>
            )}
        </CardContent>
        <CardFooter className="flex justify-around border-t p-2">
          <Button variant="ghost" className="flex-1 gap-2" onClick={() => setIsLiked(!isLiked)}>
            <Heart className={isLiked ? "h-5 w-5 text-red-500 fill-red-500" : "h-5 w-5"} />
            <span className="hidden sm:inline">Like</span>
          </Button>
          <Button variant="ghost" className="flex-1 gap-2" onClick={() => setIsSummarizeOpen(true)}>
            <MessageCircle className="h-5 w-5" />
            <span className="hidden sm:inline">Summarize</span>
          </Button>
          <Button onClick={() => setIsPreviewOpen(true)} variant="ghost" className="flex-1 gap-2">
              <BookOpen className="h-5 w-5" />
              <span className="hidden sm:inline">Read More</span>
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={isSummarizeOpen} onOpenChange={setIsSummarizeOpen}>
        <DialogContent className="sm:max-w-2xl">
           <DialogHeader>
            <DialogTitle>Article Summary</DialogTitle>
            <DialogDescription>
              AI-powered summary of the article.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-4">
            <ArticleSummary content={content || ''} />
          </div>
          <DialogFooter>
            <Button onClick={() => { setIsSummarizeOpen(false); setIsPreviewOpen(true);}} variant="secondary">
                Read Full Article
            </Button>
             <Button onClick={() => setIsSummarizeOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="h-full max-h-[90svh] w-full max-w-[90vw] p-0">
          <DialogHeader className="sr-only">
              <DialogTitle>Article Preview: {title}</DialogTitle>
              <DialogDescription>Embedded preview of the article.</DialogDescription>
          </DialogHeader>
          <div className="relative h-full w-full">
            <iframe src={url} className="h-full w-full border-0" title={title} sandbox="allow-scripts allow-same-origin" />
            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                <Button asChild size="icon" className="h-14 w-14 rounded-full shadow-lg">
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-7 w-7" />
                      <span className="sr-only">Open in new tab</span>
                    </a>
                </Button>
                <Button size="icon" className="h-14 w-14 rounded-full shadow-lg" onClick={() => { setIsPreviewOpen(false); setIsSummarizeOpen(true); }}>
                    <Sparkles className="h-7 w-7" />
                    <span className="sr-only">Summarize Article</span>
                </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
