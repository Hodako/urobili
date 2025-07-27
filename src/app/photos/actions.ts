'use server';

import 'server-only';

export async function getStockPhotos(query: string = 'Nature') {
  const apiKey = '51462590-4cd4ebd2c6862518f7a5cd4de';
  if (!apiKey) {
    throw new Error('Pixabay API key is not configured.');
  }
  
  // Fetch a random page to get different results each time
  const randomPage = Math.floor(Math.random() * 10) + 1; // pages 1-10

  const URL = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=24&page=${randomPage}`;

  try {
    const response = await fetch(URL, { next: { revalidate: 3600 } }); // Revalidate every hour
    
    if (!response.ok) {
      console.error('Failed to fetch photos from Pixabay:', response.statusText);
      return [];
    }

    const data = await response.json();
    
    // Shuffle results for more variety
    const shuffledHits = data.hits.sort(() => 0.5 - Math.random());

    return shuffledHits.map((photo: any) => ({
      id: photo.id,
      webformatURL: photo.webformatURL,
      largeImageURL: photo.largeImageURL,
      tags: photo.tags,
      user: photo.user,
    }));
  } catch (error) {
    console.error('Error fetching stock photos:', error);
    return [];
  }
}
