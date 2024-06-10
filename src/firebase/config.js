//src/firebase/confug.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA1OQqgDPpGY15XzOXuSHJ-y9ry6z-B7P8",
  authDomain: "expertstep-ce041.firebaseapp.com",
  databaseURL: "https://expertstep-ce041-default-rtdb.firebaseio.com",
  projectId: "expertstep-ce041",
  storageBucket: "expertstep-ce041.appspot.com",
  messagingSenderId: "753140132296",
  appId: "1:753140132296:web:fbd72ddb74ef5b9a91f8fd",
  measurementId: "G-3T98MFJ612",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const appAuth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, appAuth, storage };
