import React, { useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(children) {
  const [currentUser, setCurrentUser] = useState(null);
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
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
  }, []);

  const value = {
    currentUser,
    passwordreset,
    signin,
    signout,
    signup,
  };

  if (loading) {
    return <>Loading...</>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children.children}
    </AuthContext.Provider>
  );
}
