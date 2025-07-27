'use client';

import { Header } from '@/components/Header';
import { PhotoCard } from '@/components/PhotoCard';
import { Input } from '@/components/ui/input';
import { Search, Download, X } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { getStockPhotos } from './actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

type Photo = {
  id: number;
  webformatURL: string;
  largeImageURL: string;
  tags: string;
  user: string;
}

export default function PhotosPage() {
  const [query, setQuery] = useState('Trending');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isPending, startTransition] = useTransition();
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    startTransition(async () => {
      const fetchedPhotos = await getStockPhotos('Nature');
      setPhotos(fetchedPhotos);
    });
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
       const fetchedPhotos = await getStockPhotos(query || 'Trending');
       setPhotos(fetchedPhotos);
    })
  }

  const handleDownload = (photo: Photo) => {
    const link = document.createElement('a');
    link.href = photo.largeImageURL;
    link.download = `photo_${photo.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Header title="Stock Photos" subtitle="Find free high-quality photos from Pixabay." />
      <form onSubmit={handleSearch} className="relative mt-8 mb-8 w-full max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search for photos..." 
          className="pl-10" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      {isPending ? (
        <div className="columns-2 gap-4 space-y-4 sm:columns-3 md:columns-4">
          {[...Array(12)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : (
        <div className="columns-2 gap-4 space-y-4 sm:columns-3 md:columns-4">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} onPhotoClick={setSelectedPhoto} />
          ))}
        </div>
      )}

      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-5xl p-0 bg-transparent border-0">
          {selectedPhoto && (
            <>
              <DialogHeader className="sr-only">
                <DialogTitle>Image Viewer</DialogTitle>
                <DialogDescription>Viewing image: {selectedPhoto.tags}</DialogDescription>
              </DialogHeader>
              <div className="relative">
                 <Image
                    src={selectedPhoto.largeImageURL}
                    alt={selectedPhoto.tags}
                    width={1920}
                    height={1080}
                    className="rounded-lg object-contain h-auto w-full max-h-[85vh]"
                  />
                 <div className="absolute top-2 right-2 flex gap-2">
                   <Button size="icon" onClick={() => handleDownload(selectedPhoto)}>
                     <Download className="h-5 w-5" />
                   </Button>
                   <Button size="icon" variant="destructive" onClick={() => setSelectedPhoto(null)}>
                     <X className="h-5 w-5" />
                   </Button>
                 </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
