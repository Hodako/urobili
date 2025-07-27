'use server';

import 'server-only';

export async function getSuggestedMovies() {
  const apiKey = process.env.THEMOVIEDB_API_KEY;
  if (!apiKey) {
    throw new Error('The Movie DB API key is not configured.');
  }

  // Fetch a random page of popular movies to ensure variety
  const randomPage = Math.floor(Math.random() * 20) + 1; // Fetch from pages 1-20

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${randomPage}`
    );
    if (!response.ok) {
      console.error('Failed to fetch movies:', response.statusText);
      return [];
    }
    const data = await response.json();
    
    // Shuffle the results for more randomness
    const shuffledResults = data.results.sort(() => 0.5 - Math.random());

    return shuffledResults.map((movie: any) => ({
      title: movie.title,
      description: movie.overview,
      posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    })).slice(0, 12); // Return top 12 from the shuffled list
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
}
