import { auth, db } from "../firebase-config.js";
import { signOut } from "firebase/auth";
import {
    collection, deleteDoc, doc, where, serverTimestamp, onSnapshot, query, orderBy, getDocs
} from "firebase/firestore";
import Cookies from "universal-cookie";
import Data from "./Data.js"

const cookies = new Cookies();
const onlineusersRef = collection(db, "onlineusers");

export const AppWrapper = ({ children, isAuth, setIsAuth, setIsInChat }) => {
  const signUserOut = async () => {
    const user = auth.currentUser;
    if (user) {
        const querySnapshot = await getDocs(query(onlineusersRef, where("user", "==", user.displayName)));
        // console.log("yes");
        querySnapshot.forEach((doc) => {
            deleteDoc(doc.ref);
        });
    }
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(false);
    setIsInChat(false);
  };

  return (
    <div className="App">
      <div className="app-header">
        <h1> CricRizz </h1>
      </div>
      <div className="scoreBoard">
        <Data />
      </div>

      <div className="app-container">{children}</div>
      {isAuth && (
        <div className="sign-out">
          <button onClick={signUserOut}> Sign Out</button>
        </div>
      )}
    </div>
  );
};