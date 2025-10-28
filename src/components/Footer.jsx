// src/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    // Aplicando fundo branco, borda superior sutil, texto paynes-gray, padding reduzido
    <footer className="bg-white border-t border-gray-200 text-paynes-gray py-2 mt-16"> 
      <div className="container mx-auto text-center text-sm">
        <p>
          &copy; {currentYear} Sala Solidária DF
        </p>
        <p className="mt-2">
          {/* Link "Sobre" com a cor coral */}
          <Link to="/sobre" className="text-coral hover:underline transition-colors">
            Sobre o Projeto
          </Link>
        </p>
      </div>
    </footer>
  );
}