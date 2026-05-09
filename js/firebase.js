import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, onSnapshot, addDoc, updateDoc, deleteDoc, serverTimestamp, initializeFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const liveFirebaseConfig = {
    apiKey: "AIzaSyCA4U4jva7HHeMP-yk1VJy3l_BBct3Gohg",
    authDomain: "gramzo.firebaseapp.com",
    projectId: "gramzo",
    storageBucket: "gramzo.firebasestorage.app",
    messagingSenderId: "674262956986",
    appId: "1:674262956986:web:772f68694c77e15bf3fb83"
};

export const app = initializeApp(liveFirebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, { experimentalForceLongPolling: true });

// Core DB Helpers
export const getCol = (name) => collection(db, name);
export const getDocRef = (colName, docId) => doc(db, colName, docId);

// Export standard Firebase methods so other files can use them easily later
export { 
    signInAnonymously, onAuthStateChanged, signInWithCustomToken, signOut, 
    getDoc, getDocs, setDoc, onSnapshot, addDoc, updateDoc, deleteDoc, serverTimestamp 
};
