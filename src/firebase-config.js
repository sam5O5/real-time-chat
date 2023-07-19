import { initializeApp } from 'firebase/app'
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import { getFirestore } from '@firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGcHaEwV-aZtB2OWMJ52e2wz1F6e1qDHw",
  authDomain: "real-time-chat-e917a.firebaseapp.com",
  projectId: "real-time-chat-e917a",
  storageBucket: "real-time-chat-e917a.appspot.com",
  messagingSenderId: "358184490996",
  appId: "1:358184490996:web:a16c28cac740e136da8ba1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);