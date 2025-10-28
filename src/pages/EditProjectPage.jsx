import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSave, 
  faPencilAlt,  
  faLightbulb,    
  faSchool,    
  faParagraph,    
  faMapMarkerAlt  
} from '@fortawesome/free-solid-svg-icons';

export default function EditProjectPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [school, setSchool] = useState(''); 
  const [description, setDescription] = useState('');
  const [endereco, setEndereco] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

 
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectRef = doc(db, 'projetos', projectId);
        const docSnap = await getDoc(projectRef);
        if (docSnap.exists()) {
          const projectData = docSnap.data();
          setTitle(projectData.titulo);
          setSchool(projectData.escola || ''); 
          setDescription(projectData.descricao);
          setEndereco(projectData.endereco || '');
        } else {
          setError("Projeto não encontrado.");
        }
      } catch (err) {
        setError("Falha ao carregar dados do projeto.");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);


  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const projectRef = doc(db, 'projetos', projectId);
      await updateDoc(projectRef, {
        titulo: title,
        descricao: description,
        endereco: endereco
      });
      setSuccess("Projeto atualizado com sucesso!");
      setTimeout(() => navigate('/meus-projetos'), 1500);
    } catch (err) {
      setError("Falha ao atualizar o projeto.");
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center py-10 text-paynes-gray">Carregando...</p>;

  return (
    <div className="py-8">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 max-w-2xl mx-auto border-2 border-transparent hover:border-coral transition-all duration-300 ease-in-out">
        
        {/* Título com Ícone */}
        <h2 className="text-3xl font-bold text-gunmetal mb-6 text-center flex items-center justify-center">
          <FontAwesomeIcon icon={faPencilAlt} className="mr-3 text-coral h-6 w-6" />
          Editar Projeto
        </h2>
        
        {error && <p className="text-red-600 font-semibold mb-4 text-center">{error}</p>}
        {success && <p className="text-green-600 font-semibold mb-4 text-center">{success}</p>}

        <form onSubmit={handleUpdate} className="space-y-4">
          
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
            <label className="block text-sm font-medium text-paynes-gray mb-1">Escola (não editável)</label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSchool} className="text-gray-400 h-4 w-4" />
              </div>
              <input
                type="text"
                value={school}
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

          {/* Botão Salvar (Sem alterações) */}
          <div className="text-center pt-4">
            <button
              disabled={loading} type="submit"
              className="inline-flex items-center bg-coral hover:bg-opacity-80 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faSave} className="mr-2 h-4 w-4" />
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}