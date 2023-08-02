// contexts/authContext.jsx
import React, { useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config.js';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password) => {
    return auth.createUserWithEmailAndPassword(email, password);
  };

  const login = async (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  const logout = async () => {
    return auth.signOut();
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
