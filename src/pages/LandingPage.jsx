// src/pages/LandingPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; // Vamos criar este arquivo de estilo

export default function LandingPage() {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Bem-vindo ao Sala Solidária</h1>
        <p className="subtitle">
          Conectando a generosidade da comunidade com as necessidades reais das salas de aula.
        </p>
      </header>
      <main className="landing-main">
        <p>
          Nosso projeto cria uma ponte direta entre professores que precisam de materiais
          para seus projetos pedagógicos e pessoas incríveis como você, que desejam ajudar.
          Com um gesto simples, você pode transformar a educação de uma criança.
        </p>
        <Link to="/projetos" className="cta-button">
          Ver Projetos Precisando de Ajuda
        </Link>
      </main>
    </div>
  );
}