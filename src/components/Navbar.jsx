// src/components/Navbar.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// ÍCONE 'faSearch' ADICIONADO
import { 
  faBars, faTimes, faInfoCircle, faListAlt, faUserCog, 
  faSignInAlt, faUserPlus, faSignOutAlt, faSearch 
} from '@fortawesome/free-solid-svg-icons';
import logoImage from '../assets/logo-sala-solidaria.png'; // Importa o logo

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  async function handleLogout() {
    setIsMobileMenuOpen(false);
    try { await logout(); navigate('/login'); }
    catch { console.error("Falha ao fazer logout"); }
  }

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 py-3 px-4 md:px-8 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        {/* LOGO (Sem alteração) */}
        <Link 
          to="/" 
          className="flex items-center text-xl md:text-2xl font-bold text-gunmetal hover:text-coral transition-colors"
          onClick={closeMobileMenu}
        >
          <img src={logoImage} alt="Sala Solidária Logo" className="h-8 w-auto mr-3" />
          Sala Solidária
        </Link>

        {/* --- Menu Desktop --- */}
        <ul className="hidden md:flex items-center space-x-6">
           {/* Link Sobre */}
           <li>
            <Link to="/sobre" className="text-paynes-gray hover:text-coral transition-colors flex items-center">
              <FontAwesomeIcon icon={faInfoCircle} className="mr-1.5 h-4 w-4" /> Sobre o projeto
            </Link>
          </li>

          {/* --- NOVO LINK PÚBLICO DE PROJETOS --- */}
          <li>
            <Link to="/projetos" className="text-paynes-gray hover:text-coral transition-colors flex items-center">
              <FontAwesomeIcon icon={faSearch} className="mr-1.5 h-4 w-4" /> Projetos
            </Link>
          </li>
          
          {/* Links Condicionais (Sem alteração) */}
          {currentUser ? (
            <>
              <li>
                <Link to="/meus-projetos" className="text-paynes-gray hover:text-coral transition-colors flex items-center">
                  <FontAwesomeIcon icon={faListAlt} className="mr-1.5 h-4 w-4" /> Meus Projetos
                </Link>
              </li>
              <li>
                <Link to="/meu-perfil" className="text-paynes-gray hover:text-coral transition-colors flex items-center">
                  <FontAwesomeIcon icon={faUserCog} className="mr-1.5 h-4 w-4" /> Meu Perfil
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded text-sm transition-colors flex items-center">
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-1.5 h-4 w-4" /> Sair
                </button>
              </li>
            </>
          ) : (
             <>
              <li>
                <Link to="/login" className="text-paynes-gray hover:text-coral transition-colors flex items-center">
                   <FontAwesomeIcon icon={faSignInAlt} className="mr-1.5 h-4 w-4" /> Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="bg-coral hover:bg-opacity-80 text-white font-semibold py-1 px-3 rounded text-sm transition-colors flex items-center">
                  <FontAwesomeIcon icon={faUserPlus} className="mr-1.5 h-4 w-4" /> Cadastre-se
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* --- Botão Hambúrguer (Sem alteração) --- */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gunmetal text-2xl">
            <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
          </button>
        </div>
      </div>

      {/* --- Menu Mobile --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md absolute top-full left-0 w-full border-t border-gray-200">
          <ul className="flex flex-col items-center py-4 space-y-4">
             {/* Link Sobre */}
             <li>
              <Link to="/sobre" className="text-paynes-gray hover:text-coral transition-colors block flex items-center" onClick={closeMobileMenu}>
                <FontAwesomeIcon icon={faInfoCircle} className="mr-2 h-4 w-4" /> Sobre o projeto
              </Link>
            </li>

            {/* --- NOVO LINK PÚBLICO DE PROJETOS --- */}
            <li>
              <Link to="/projetos" className="text-paynes-gray hover:text-coral transition-colors block flex items-center" onClick={closeMobileMenu}>
                <FontAwesomeIcon icon={faSearch} className="mr-2 h-4 w-4" /> Projetos
              </Link>
            </li>

            {/* Links Condicionais (Sem alteração) */}
            {currentUser ? (
              <>
                <li><Link to="/meus-projetos" className="text-paynes-gray hover:text-coral transition-colors block flex items-center" onClick={closeMobileMenu}><FontAwesomeIcon icon={faListAlt} className="mr-2 h-4 w-4" /> Meus Projetos</Link></li>
                <li><Link to="/meu-perfil" className="text-paynes-gray hover:text-coral transition-colors block flex items-center" onClick={closeMobileMenu}><FontAwesomeIcon icon={faUserCog} className="mr-2 h-4 w-4" /> Meu Perfil</Link></li>
                <li><button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded text-sm transition-colors w-3/4 flex items-center justify-center"><FontAwesomeIcon icon={faSignOutAlt} className="mr-2 h-4 w-4" /> Sair</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="text-paynes-gray hover:text-coral transition-colors block flex items-center" onClick={closeMobileMenu}><FontAwesomeIcon icon={faSignInAlt} className="mr-2 h-4 w-4" /> Login</Link></li>
                <li><Link to="/register" className="bg-coral hover:bg-opacity-80 text-white font-semibold py-2 px-4 rounded text-sm transition-colors w-3/4 block text-center flex items-center justify-center" onClick={closeMobileMenu}><FontAwesomeIcon icon={faUserPlus} className="mr-2 h-4 w-4" /> Cadastre-se</Link></li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}