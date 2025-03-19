import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDWoam5FPtMhSUAusu6Zx81D0qYXW2HRpw",
    authDomain: "edu-struct.firebaseapp.com",
    projectId: "edu-struct",
    storageBucket: "edu-struct.firebasestorage.app",
    messagingSenderId: "46638086741",
    appId: "1:46638086741:web:85df061c0e9262ad1872dc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Log initialization
console.log('Firebase initialized with project:', firebaseConfig.projectId);
