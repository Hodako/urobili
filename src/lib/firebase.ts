// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyA0KayZ79yt8tT9ynM1v18sfxIOd1wQ_IA",
    authDomain: "urobili.firebaseapp.com",
    projectId: "urobili",
    storageBucket: "urobili.firebasestorage.app",
    messagingSenderId: "852936759517",
    appId: "1:852936759517:web:50bfb7ce258cb2ea942334",
    measurementId: "G-XHL2SSCYS4"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
