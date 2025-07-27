
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../auth/actions';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState, type FormEvent } from 'react';

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.651-3.356-11.303-7.962H6.306C9.656,39.663,16.318,44,24,44z"></path>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C43.021,36.687,44,34.061,44,31C44,27.201,44,24,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const error = await signInWithGoogle();
    if (error) {
      toast({
        title: 'Sign-In Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      router.push('/');
    }
    setIsLoading(false);
  };
  
  const handleEmailSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const error = await signInWithEmail(email, password);
    if (error) {
       toast({
        title: 'Sign-In Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
       router.push('/');
    }
    setIsLoading(false);
  }

  const handleEmailSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const error = await signUpWithEmail(email, password, fullName);
     if (error) {
       toast({
        title: 'Sign-Up Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
       router.push('/');
    }
    setIsLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <Tabs defaultValue="login" onValueChange={(value) => setIsSigningUp(value === 'signup')}>
            <CardHeader className="text-center pb-2">
                <CardTitle className="font-headline text-3xl">Urobili Connect</CardTitle>
                <CardDescription>Welcome! Sign in or create an account.</CardDescription>
                <TabsList className="grid w-full grid-cols-2 mt-4">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
            </CardHeader>
            <TabsContent value="login">
                <form onSubmit={handleEmailSignIn}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email-login">Email</Label>
                            <Input id="email-login" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="password-login">Password</Label>
                            <Input id="password-login" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && !isSigningUp ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </CardContent>
                </form>
            </TabsContent>
             <TabsContent value="signup">
                <form onSubmit={handleEmailSignUp}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName-signup">Full Name</Label>
                            <Input id="fullName-signup" placeholder="John Doe" required value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={isLoading} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email-signup">Email</Label>
                            <Input id="email-signup" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="password-signup">Password</Label>
                            <Input id="password-signup" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                             {isLoading && isSigningUp ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </CardContent>
                </form>
            </TabsContent>
            
            <div className="relative mb-4 px-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div>
             <CardFooter>
                <Button onClick={handleGoogleSignIn} className="w-full" variant="outline" disabled={isLoading}>
                    <GoogleIcon />
                    {isSigningUp ? 'Sign Up with Google' : 'Sign In with Google'}
                </Button>
            </CardFooter>
        </Tabs>
      </Card>
    </div>
  );
}
