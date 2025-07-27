'use client';

import { Header } from '@/components/Header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Camera, LogOut, Bookmark } from 'lucide-react';
import { handleSignOut } from '../auth/actions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBookmarks } from '@/hooks/use-bookmarks';
import { PostCard } from '@/components/PostCard';
import { PostCardSkeleton } from '@/components/PostCardSkeleton';

function BookmarksList() {
  const { user } = useAuth();
  const { bookmarks } = useBookmarks();
  const [loading, setLoading] = useState(true);

  useState(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  });
  
  if (loading) {
      return <PostCardSkeleton />;
  }
  
  return (
    <div className="mt-6">
      {bookmarks.length > 0 ? (
        <div className="space-y-4">
          {bookmarks.map((article, index) => (
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
      ) : (
        <div className="text-center py-16">
          <Bookmark className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Bookmarks Yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You haven&apos;t saved any articles yet. Start exploring and bookmark your favorites!
          </p>
        </div>
      )}
    </div>
  )
}


export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [bio, setBio] = useState("Connecting dots and pixels. Passionate about AI, design, and the future of web development. Let's build something amazing together.");

  const onSignOut = async () => {
    const error = await handleSignOut();
    if (error) {
       toast({
        title: 'Sign Out Error',
        description: error.message,
        variant: 'destructive',
      });
      console.error('Sign Out Error:', error.message);
    } else {
      router.push('/login');
    }
  };

  if (loading) {
      return (
          <div className="container mx-auto max-w-2xl px-4 py-6">
              <Header title="My Profile" />
              <div className="mt-8 space-y-8">
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                           <Skeleton className="h-24 w-24 rounded-full" />
                      </div>
                      <Skeleton className="h-10 w-28" />
                  </div>
                   <Skeleton className="h-10 w-full max-w-xs" />
                   <div className="space-y-6 mt-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                           <Skeleton className="h-10 w-full" />
                           <Skeleton className="h-10 w-full" />
                        </div>
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-24 w-full" />
                         <div className="flex justify-end">
                            <Skeleton className="h-10 w-32" />
                        </div>
                  </div>
              </div>
          </div>
      )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6">
      <div className="flex justify-between items-center">
        <Header title="My Profile" />
        <Button onClick={onSignOut} variant="outline">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

       <Tabs defaultValue="profile" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Edit Profile</TabsTrigger>
          <TabsTrigger value="bookmarks">My Bookmarks</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <div className="mt-8 space-y-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-2 border-primary">
                  <AvatarImage src={user?.photoURL || "https://placehold.co/200x200.png"} alt="User Avatar" data-ai-hint="user portrait" />
                  <AvatarFallback>{user?.displayName?.substring(0,2).toUpperCase() || 'AD'}</AvatarFallback>
                </Avatar>
                <Button size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">Change profile picture</span>
                </Button>
              </div>
               <div>
                  <h2 className="text-2xl font-bold">{user?.displayName}</h2>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue={user?.displayName || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue={user?.email?.split('@')[0] || ''} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </div>
        </TabsContent>
        <TabsContent value="bookmarks">
            <BookmarksList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
