import React, { useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(children) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function passwordreset(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function signup(email, password) {
    db.collection("users").doc(email).set({});

    return auth.createUserWithEmailAndPassword(email, password);
  }

  function signin(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function signout() {
    return auth.signOut();
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [currentUser]);

  const value = {
    currentUser,
    passwordreset,
    signin,
    signout,
    signup,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children.children}
    </AuthContext.Provider>
  );
}
