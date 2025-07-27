
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'

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

interface BookmarkState {
  bookmarks: NewsArticle[];
  addBookmark: (article: NewsArticle) => void;
  removeBookmark: (url: string) => void;
}

export const useBookmarks = create<BookmarkState>()(
  persist(
    (set) => ({
      bookmarks: [],
      addBookmark: (article) => set((state) => ({ bookmarks: [...state.bookmarks, article] })),
      removeBookmark: (url) => set((state) => ({ bookmarks: state.bookmarks.filter(b => b.url !== url) })),
    }),
    {
      name: 'urobili-bookmark-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // use localStorage for persistence
    }
  )
);
