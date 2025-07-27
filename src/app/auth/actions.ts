'use client';

import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup, type AuthError, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

export async function signInWithGoogle(): Promise<AuthError | null> {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    return null;
  } catch (error) {
    return error as AuthError;
  }
}

export async function signUpWithEmail(email: string, password: string, fullName: string): Promise<AuthError | null> {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
            displayName: fullName,
        });
        return null;
    } catch(error) {
        return error as AuthError;
    }
}

export async function signInWithEmail(email: string, password: string): Promise<AuthError | null> {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        return null;
    } catch(error) {
        return error as AuthError;
    }
}

export async function handleSignOut(): Promise<AuthError | null> {
    try {
        await signOut(auth);
        return null;
    } catch (error) {
        return error as AuthError;
    }
}
