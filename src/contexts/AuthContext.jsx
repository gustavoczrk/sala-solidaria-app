import React, { useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Dentro de src/contexts/AuthContext.jsx

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // AS FUNÇÕES ABAIXO ESTAVAM FALTANDO, CAUSANDO OS AVISOS
  async function signup(email, password, name, school) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return setDoc(doc(db, "users", user.uid), {
      nome: name,
      escola: school,
      email: email,
      createdAt: serverTimestamp()
    });
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);
    if (!docSnap.exists()) {
      await setDoc(userDocRef, {
        nome: user.displayName,
        email: user.email,
        escola: '',
        createdAt: serverTimestamp()
      });
    }
  }
  
  // O useEffect que carrega o perfil já está correto
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        } else {
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    signInWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}