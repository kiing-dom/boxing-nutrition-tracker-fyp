import { initializeApp } from 'firebase/app'; 
// Optionally import the services that you want to use
import { getAuth, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCf00d51GJxE-LRI2Bs1v3U8DeYQtxpMfs",
    authDomain: "boxing-tracker.firebaseapp.com",
    databaseURL: "https://boxing-tracker-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "boxing-tracker",
    storageBucket: "boxing-tracker.appspot.com",
    messagingSenderId: "236314462113",
    appId: "1:236314462113:web:68d84b063f45b066d7ade0",
    measurementId: "G-7XF9DXE9JV"
  };


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app, {
  persistence: browserLocalPersistence,
});
export const db = getFirestore(app)