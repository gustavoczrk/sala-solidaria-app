// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Usamos o 'login' do nosso contexto de autenticação
  const { login } = useAuth(); 
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      // Chamamos a função de login em vez de signup
      await login(email, password); 
      navigate('/'); // Redireciona para a HomePage após o sucesso
    } catch (err) {
      console.error(err);
      setError('Falha ao entrar. Verifique seu email e senha.');
    }

    setLoading(false);
  }

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Senha</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button disabled={loading} type="submit">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <div>
        Não tem uma conta? <Link to="/register">Cadastre-se</Link>
      </div>
    </div>
  );
}