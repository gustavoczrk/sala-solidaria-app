import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserPlus,  
  faUser,   
  faSchool,   
  faEnvelope, 
  faLock      
} from '@fortawesome/free-solid-svg-icons';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

async function handleSubmit(e) {
    e.preventDefault();
    setError(''); 

    if (password !== confirmPassword) {
      return setError("As senhas não coincidem.");
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/;
    
    if (!passwordRegex.test(password)) {
      setError(
        "A senha é fraca. Ela deve ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula e um número."
      );
      return; 
    }

    try {
      setLoading(true);
      await signup(email, password, name, school); 
      navigate('/meus-projetos');
    } catch (err) {
      console.error("Erro no cadastro:", err.code);
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('Este e-mail já está em uso por outra conta.');
          break;
        case 'auth/weak-password': 
          setError('A senha é muito fraca (mínimo 6 caracteres).');
          break;
        case 'auth/invalid-email':
          setError('O formato do e-mail é inválido.');
          break;
        default:
          setError('Ocorreu uma falha ao criar a conta. Tente novamente.');
      }
    }
    setLoading(false);
  }

 
  return (
    <div className="py-12 px-4">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 max-w-lg mx-auto
                   border-2 border-transparent hover:border-coral transition-all duration-300 ease-in-out">
        
        <h2 className="text-3xl font-bold text-gunmetal mb-6 text-center flex items-center justify-center">
          <FontAwesomeIcon icon={faUserPlus} className="mr-3 text-coral h-6 w-6" />
          Cadastro de Professor
        </h2>

        {/* Mensagem de Erro Estilizada */}
        {error && (
          <p className="text-red-600 font-semibold mb-4 text-center p-3 bg-red-50 border border-red-200 rounded-md">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-paynes-gray mb-1">Nome Completo</label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faUser} className="text-gray-400 h-3.5 w-3.5" />
              </div>
              <input
                id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full border border-gray-300 rounded-md p-2 pl-10 focus:ring-coral focus:border-coral"
                placeholder="Seu nome completo"
              />
            </div>
          </div>
          
          {/*Campo Escola com Ícone*/}
          <div>
            <label htmlFor="school" className="block text-sm font-medium text-paynes-gray mb-1">Escola</label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSchool} className="text-gray-400 h-3.5 w-3.5" />
              </div>
              <input
                id="school" type="text" value={school} onChange={(e) => setSchool(e.target.value)} required
                className="w-full border border-gray-300 rounded-md p-2 pl-10 focus:ring-coral focus:border-coral"
                placeholder="Nome da sua escola"
              />
            </div>
          </div>

          {/*Campo Email com Ícone*/}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-paynes-gray mb-1">Email</label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 h-3.5 w-3.5" />
              </div>
              <input
                id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full border border-gray-300 rounded-md p-2 pl-10 focus:ring-coral focus:border-coral"
                placeholder="seu.email@exemplo.com"
              />
            </div>
          </div>

          {/*Campo Senha com Ícone*/}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-paynes-gray mb-1">Senha</label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faLock} className="text-gray-400 h-3.5 w-3.5" />
              </div>
              <input
                id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full border border-gray-300 rounded-md p-2 pl-10 focus:ring-coral focus:border-coral"
                placeholder="Digite sua senha"
              />
            </div>
          </div>

          {/*Campo Confirmar Senha com Ícone*/}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-paynes-gray mb-1">Confirmar Senha</label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faLock} className="text-gray-400 h-3.5 w-3.5" />
              </div>
              <input
                id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                className="w-full border border-gray-300 rounded-md p-2 pl-10 focus:ring-coral focus:border-coral"
                placeholder="Repita sua senha"
              />
            </div>
          </div>

          {/*Botão Cadastrar*/}
          <button
            disabled={loading} type="submit"
            className="w-full inline-flex items-center justify-center bg-coral hover:bg-opacity-80 text-white font-bold py-2 px-5 rounded-lg text-base transition-colors shadow-md disabled:opacity-50 mt-4" // Adicionado mt-4
          >
            <FontAwesomeIcon icon={faUserPlus} className="mr-2 h-4 w-4" />
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        {/*Link para Login*/}
        <div className="text-sm text-center text-paynes-gray mt-6">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-medium text-coral hover:underline">
            Faça Login
          </Link>
        </div>
      </div>
    </div>
  );
}