import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAjsQ9_cOcpEoXN_v3t87N5RkE-niEMlG4",
    authDomain: "feedie-e5d5d.firebaseapp.com",
    projectId: "feedie-e5d5d",
    storageBucket: "feedie-e5d5d.firebasestorage.app",
    messagingSenderId: "1039584890246",
    appId: "1:1039584890246:web:9ea151ed6432b4237eb007",
    measurementId: "G-X2JDK1WLRS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
