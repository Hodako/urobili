import { Header } from '@/components/Header';
import { MovieCard } from '@/components/MovieCard';
import { getSuggestedMovies } from './actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';

async function MovieGrid() {
  const suggestedMovies = await getSuggestedMovies();

  if (!suggestedMovies || suggestedMovies.length === 0) {
    return <p>Could not load movies at the moment. Please try again later.</p>
  }

  return (
     <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {suggestedMovies.map((movie) => (
        <MovieCard key={movie.title} {...movie} />
      ))}
    </div>
  )
}

function MoviesSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-[2/3] w-full rounded-lg" />
          <Skeleton className="h-5 w-4/5 rounded-md" />
        </div>
      ))}
    </div>
  )
}


export default function MoviesPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <Header title="Suggested Movies" subtitle="New and trending movies you might like." />
       <Suspense fallback={<MoviesSkeleton />}>
        <MovieGrid />
      </Suspense>
    </div>
  );
}
