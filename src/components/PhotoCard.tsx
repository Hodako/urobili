import Image from 'next/image';

type Photo = {
  id: number;
  webformatURL: string;
  largeImageURL: string;
  tags: string;
  user: string;
}

interface PhotoCardProps {
  photo: Photo;
  onPhotoClick: (photo: Photo) => void;
}

export function PhotoCard({ photo, onPhotoClick }: PhotoCardProps) {
  return (
    <div 
      className="relative mb-4 break-inside-avoid overflow-hidden rounded-lg group cursor-pointer"
      onClick={() => onPhotoClick(photo)}
    >
      <Image
        src={photo.webformatURL}
        alt={photo.tags}
        width={600}
        height={800}
        className="h-auto w-full transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 p-4">
          <p className="text-white text-sm font-medium capitalize">{photo.tags.split(',')[0]}</p>
          <p className="text-white/80 text-xs">by {photo.user}</p>
        </div>
      </div>
    </div>
  );
}
