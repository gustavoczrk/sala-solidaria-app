// src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      navigate('/'); // Redireciona para a HomePage após o sucesso
    } catch (err) {
      console.error(err);
      setError('Falha ao criar a conta. Verifique os dados e tente novamente.');
    }

    setLoading(false);
  }

  return (
    <div>
      <h2>Cadastro</h2>
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
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
      <div>
        Já tem uma conta? <Link to="/login">Faça Login</Link>
      </div>
    </div>
  );
}