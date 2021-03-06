import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Initialize Firebase
const fb = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIRESTORE_API_KEY,
  authDomain: process.env.REACT_APP_FIRESTORE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIRESTORE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIRESTORE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIRESTORE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIRESTORE_APP_ID,
  measurementId: process.env.REACT_APP_FIRESTORE_MEASUREMENT_ID,
});

export const fbAuth = fb.auth();
const auth = fb.auth();
const db = fb.firestore();
const currentTimestamp = firebase.firestore.Timestamp.now();
const firebaseAuth = firebase.auth;
const fbService = firebase;
const fbAuthSession = firebase.auth.Auth.Persistence.SESSION;

export { db, currentTimestamp, auth, fbService };
