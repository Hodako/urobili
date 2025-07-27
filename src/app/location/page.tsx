import { Header } from '@/components/Header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { List } from 'lucide-react';
import Image from 'next/image';

const friends = [
  { name: 'Casey', avatar: 'https://placehold.co/100x100.png', initials: 'C', status: 'Sharing Location' },
  { name: 'Jordan', avatar: 'https://placehold.co/100x100.png', initials: 'J', status: '2 hours ago' },
  { name: 'Taylor', avatar: 'https://placehold.co/100x100.png', initials: 'T', status: 'Location Paused' },
];

export default function LocationPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <Header title="Live Location" subtitle="See where your friends are." />
      </div>

      <div className="relative flex-1">
        <Image
          src="https://placehold.co/1200x800.png"
          alt="Map view of friends' locations"
          layout="fill"
          objectFit="cover"
          className="opacity-70"
          data-ai-hint="world map"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
      </div>

      <Card className="m-4 -mt-24 rounded-xl border-2 bg-background/80 backdrop-blur-md">
        <CardContent className="p-4">
          <h3 className="mb-4 font-headline text-lg font-medium">Friends Sharing</h3>
          <ul className="space-y-4">
            {friends.map((friend) => (
              <li key={friend.name} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={friend.avatar} alt={friend.name} data-ai-hint="person portrait"/>
                    <AvatarFallback>{friend.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{friend.name}</p>
                    <p className="text-sm text-muted-foreground">{friend.status}</p>
                  </div>
                </div>
                {friend.status === 'Sharing Location' && (
                  <Button variant="secondary" size="sm">
                    View
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
