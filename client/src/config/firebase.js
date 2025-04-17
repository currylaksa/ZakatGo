import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyCcByH3h7eDGdsb_uzMk6hKkCXj9UzQGfM",
  authDomain: "zakatgo.firebaseapp.com",
  projectId: "zakatgo",
  storageBucket: "zakatgo.firebasestorage.app",
  messagingSenderId: "914949625175",
  appId: "1:914949625175:web:a61b1df582f0e794411a12"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);