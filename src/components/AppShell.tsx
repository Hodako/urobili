'use client';

import { usePathname, useRouter } from 'next/navigation';
import { BottomNav } from './BottomNav';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';
import { Skeleton } from './ui/skeleton';

const noNavRoutes = ['/login', '/signup'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const showNav = !noNavRoutes.includes(pathname);

  useEffect(() => {
    if (!loading && !user && showNav) {
      router.push('/login');
    }
  }, [user, loading, showNav, router, pathname]);
  
  if (loading && showNav) {
    return (
       <div className="container mx-auto max-w-2xl px-4 py-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 bg-card rounded-lg shadow-sm flex items-start space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Render children if user is logged in or on a public route
  if ((user && !loading) || !showNav) {
      return (
        <div className="relative flex min-h-screen flex-col bg-background">
          <div className={showNav ? 'flex-1 pb-20' : 'flex-1'}>{children}</div>
          {showNav && <BottomNav />}
        </div>
      );
  }

  return null;
}
