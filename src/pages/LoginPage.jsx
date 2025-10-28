import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSignInAlt, 
  faEnvelope,
  faLock       
} from '@fortawesome/free-solid-svg-icons';


const GoogleGIcon = () => (
  <svg className="mr-3 h-5 w-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.618-3.108-11.28-7.481l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C39.902 36.631 44 30.771 44 24c0-1.341-.138-2.65-.389-3.917z"/>
  </svg>
);


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password); 
      navigate('/meus-projetos');
    } catch (err) {
      setError('Falha ao entrar. Verifique seu email e senha.');
    }
    setLoading(false);
  }

  async function handleGoogleSignIn() {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      navigate('/meus-projetos');
    } catch (error) {
      setError('Falha ao fazer login com o Google.');
    }
    setLoading(false);
  }

  return (
  <div className="py-12 px-4">
    <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 max-w-lg mx-auto
                 border-2 border-transparent hover:border-coral transition-all duration-300 ease-in-out">
      
      <h2 className="text-3xl font-bold text-gunmetal mb-6 text-center flex items-center justify-center">
        <FontAwesomeIcon icon={faSignInAlt} className="mr-3 text-coral h-6 w-6" />
        Login
      </h2>

      {error && (
        <p className="text-red-600 font-semibold mb-4 text-center p-3 bg-red-50 border border-red-200 rounded-md">
          {error}
        </p>
      )}
      
      <button 
        onClick={handleGoogleSignIn} 
        disabled={loading}
        className="w-full inline-flex items-center justify-center bg-white hover:bg-gray-50 text-paynes-gray font-medium py-2 px-5 rounded-lg text-base transition-colors shadow-sm border border-gray-300 disabled:opacity-50"
      >
        <GoogleGIcon />
        {loading ? 'Aguarde...' : 'Entrar com Google'}
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-paynes-gray">ou</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Campo Email com Ícone - AQUI É A MUDANÇA */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-paynes-gray mb-1">Email</label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 h-3.5 w-3.5" /> {/* Tamanho alterado */}
            </div>
            <input
              id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full border border-gray-300 rounded-md p-2 pl-10 focus:ring-coral focus:border-coral"
              placeholder="seu.email@exemplo.com"
            />
          </div>
        </div>

        {/* Campo Senha com Ícone - AQUI É A MUDANÇA */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-paynes-gray mb-1">Senha</label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faLock} className="text-gray-400 h-3.5 w-3.5" /> {/* Tamanho alterado */}
            </div>
            <input
              id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full border border-gray-300 rounded-md p-2 pl-10 focus:ring-coral focus:border-coral"
              placeholder="Sua senha"
            />
          </div>
        </div>

        <button
          disabled={loading} type="submit"
          className="w-full inline-flex items-center justify-center bg-coral hover:bg-opacity-80 text-white font-bold py-2 px-5 rounded-lg text-base transition-colors shadow-md disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faSignInAlt} className="mr-2 h-4 w-4" />
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="text-sm text-center text-paynes-gray mt-6">
        Não tem uma conta?{' '}
        <Link to="/register" className="font-medium text-coral hover:underline">
          Cadastre-se
        </Link>
      </div>
    </div>
  </div>
);
}