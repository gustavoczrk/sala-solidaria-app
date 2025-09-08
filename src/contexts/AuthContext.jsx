// src/contexts/AuthContext.jsx

import React, { useContext, useState, useEffect } from 'react';
import { auth } from '../firebase'; // Importando a instância 'auth' que você já configurou
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para cadastrar um novo usuário
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Função para logar um usuário existente
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Função para deslogar
  function logout() {
    return signOut(auth);
  }

  // Efeito que roda uma vez para verificar o estado da autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe; // Desmonta o listener quando o componente for destruído
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}