// src/components/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css'; // Vamos criar este arquivo de estilo a seguir

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login'); // Redireciona para a página de login após o logout
    } catch {
      console.error("Falha ao fazer logout");
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Sala Solidária
        </Link>
        <ul className="navbar-menu">
          {currentUser ? (
            // Se existe um usuário logado
            <>
              <li className="navbar-item">
                <Link to="/meus-projetos" className="navbar-link">
                  Meus Projetos
                </Link>
              </li>
              <li className="navbar-item">
                <button onClick={handleLogout} className="navbar-button">
                  Sair
                </button>
              </li>
            </>
          ) : (
            // Se NÃO existe um usuário logado
            <>
              <li className="navbar-item">
                <Link to="/login" className="navbar-link">
                  Login
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/register" className="navbar-link-button">
                  Cadastre-se
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}