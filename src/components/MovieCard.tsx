import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MovieCardProps {
  title: string;
  posterUrl: string;
  aiHint?: string;
}

export function MovieCard({ title, posterUrl, aiHint }: MovieCardProps) {
  return (
    <Card className="overflow-hidden border-0 bg-transparent shadow-none transition-all hover:scale-105">
      <CardContent className="p-0">
        <div className="aspect-[2/3] w-full">
          <Image
            src={posterUrl}
            alt={`Poster for ${title}`}
            width={500}
            height={750}
            className="h-full w-full rounded-lg object-cover"
            data-ai-hint={aiHint}
          />
        </div>
        <h3 className="mt-2 font-headline text-base font-medium text-foreground">
          {title}
        </h3>
      </CardContent>
    </Card>
  );
}
