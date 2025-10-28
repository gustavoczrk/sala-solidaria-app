import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlusCircle,  
  faFileSignature, 
  faLightbulb,  
  faSchool,    
  faParagraph,   
  faMapMarkerAlt 
} from '@fortawesome/free-solid-svg-icons';

export default function CreateProjectPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [endereco, setEndereco] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || !userProfile) {
      setError("Você precisa estar logado e seu perfil precisa estar carregado.");
      return;
    }

    try {
      setError('');
      setLoading(true);

      await addDoc(collection(db, "projetos"), {
        titulo: title,
        escola: userProfile.escola,
        descricao: description,
        endereco: endereco,
        professorNome: userProfile.nome,
        professorEmail: currentUser.email,
        userId: currentUser.uid,
        createdAt: serverTimestamp()
      });

      console.log("Projeto criado com sucesso!");
      navigate('/meus-projetos');

    } catch (err) {
      console.error("Erro ao criar projeto:", err);
      setError("Falha ao criar o projeto.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="py-8">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 max-w-2xl mx-auto border-2 border-transparent hover:border-coral transition-all duration-300 ease-in-out">
        
        {/* Título com Ícone */}
        <h2 className="text-3xl font-bold text-gunmetal mb-2 text-center flex items-center justify-center">
          <FontAwesomeIcon icon={faFileSignature} className="mr-3 text-coral h-6 w-6" />
          Criar Novo Projeto
        </h2>
        <p className="text-paynes-gray text-center mb-6">Preencha as informações abaixo para que a comunidade possa ajudar.</p>

        {error && <p className="text-red-600 font-semibold mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Título do Projeto com Ícone */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-paynes-gray mb-1">Título do Projeto</label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faLightbulb} className="text-gray-400 h-4 w-4" />
              </div>
              <input
                id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                className="w-full border border-gray-300 rounded-md p-2 pl-10 focus:ring-coral focus:border-coral"
              />
            </div>
          </div>

          {/* Escola (Desabilitado) com Ícone */}
          <div>
            <label className="block text-sm font-medium text-paynes-gray mb-1">Escola</label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSchool} className="text-gray-400 h-4 w-4" />
              </div>
              <input
                type="text"
                value={userProfile?.escola || 'Carregando...'}
                disabled
                className="w-full border border-gray-300 rounded-md p-2 pl-10 bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Descrição com Ícone */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-paynes-gray mb-1">Descrição</label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute top-0 left-0 pl-3 pt-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faParagraph} className="text-gray-400 h-4 w-4" />
              </div>
              <textarea
                id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows="5"
                className="w-full border border-gray-300 rounded-md p-2 pl-10 focus:ring-coral focus:border-coral"
              />
            </div>
          </div>

          {/* Endereço com Ícone */}
          <div>
            <label htmlFor="endereco" className="block text-sm font-medium text-paynes-gray mb-1">Endereço da Escola</label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute top-0 left-0 pl-3 pt-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 h-4 w-4" />
              </div>
              <textarea
                id="endereco" value={endereco} onChange={(e) => setEndereco(e.target.value)} required rows="3"
                className="w-full border border-gray-300 rounded-md p-2 pl-10 focus:ring-coral focus:border-coral"
              />
            </div>
          </div>

          {/* Botão Salvar com Ícone (Sem alterações) */}
          <div className="text-center pt-4">
            <button
              disabled={loading} type="submit"
              className="inline-flex items-center bg-coral hover:bg-opacity-80 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faPlusCircle} className="mr-2 h-5 w-5" />
              {loading ? 'Salvando...' : 'Salvar Projeto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}