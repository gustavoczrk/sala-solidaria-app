// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. IMPORTE OS NOVOS COMPONENTES
import LandingPage from './pages/LandingPage';
import ProjectsPage from './pages/ProjectsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          {/* 2. ATUALIZE AS ROTAS */}
          <Route path="/" element={<LandingPage />} /> {/* Rota principal */}
          <Route path="/projetos" element={<ProjectsPage />} /> {/* Rota para a lista de projetos */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;