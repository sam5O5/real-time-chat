import { auth, provider, db } from "../firebase-config.js";
import { signInWithPopup } from "firebase/auth";
import "../styles/auth.css";
import Cookies from "universal-cookie";
import {
    collection, addDoc, where, serverTimestamp, onSnapshot, query, orderBy,
} from "firebase/firestore";

const cookies = new Cookies();
const onlineusersRef = collection(db, "onlineusers");

// const handlelogin = async (event) => {
//     event.preventDefault();

//     await addDoc(onlineusersRef, {
//         user: auth.currentUser.displayName,
//         createdAt: serverTimestamp(),
//     });

// };


export const Auth = ({ setIsAuth }) => {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      cookies.set("auth-token", result.user.refreshToken);
      
      await addDoc(onlineusersRef, {
        user: auth.currentUser.displayName,
        createdAt: serverTimestamp(),
      });

      setIsAuth(true);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="auth">
      <p> Sign In With Google To Continue </p>
      <button onClick={signInWithGoogle}> Sign In With Google </button>
    </div>
  );
};