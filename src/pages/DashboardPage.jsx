import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, deleteDoc, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEye, 
  faPencilAlt, 
  faTrashAlt, 
  faPlus,
  faTachometerAlt, 
  faClipboardList,  
  faFolderOpen      
} from '@fortawesome/free-solid-svg-icons';


function ProjectCard({ project, onDelete }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4
                   border-2 border-transparent hover:border-coral transition-all duration-300 ease-in-out">
      <h4 className="text-lg font-bold text-gunmetal mb-1 truncate">{project.titulo}</h4>
      <p className="text-sm text-paynes-gray mb-4 truncate">{project.escola}</p>
      <div className="flex items-center space-x-4 pt-2 border-t border-gray-100 mt-4">
        <Link to={`/projeto/${project.id}`} className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors">
          <FontAwesomeIcon icon={faEye} className="mr-1 h-3 w-3" /> Detalhes
        </Link>
        <Link to={`/projeto/edit/${project.id}`} className="flex items-center text-sm text-yellow-600 hover:text-yellow-800 transition-colors">
          <FontAwesomeIcon icon={faPencilAlt} className="mr-1 h-3 w-3" /> Editar
        </Link>
        <button onClick={() => onDelete(project.id)} className="flex items-center text-sm text-red-600 hover:text-red-800 font-semibold transition-colors">
          <FontAwesomeIcon icon={faTrashAlt} className="mr-1 h-3 w-3" /> Excluir
        </button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { currentUser, userProfile } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const handleDelete = async (projectId) => {
    const confirmDelete = window.confirm("Você tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.");
    if (!confirmDelete) return;
    try {
      const projectRef = doc(db, 'projetos', projectId);
      await deleteDoc(projectRef);
      setProjects(currentProjects => currentProjects.filter(p => p.id !== projectId));
    } catch (err) {
      console.error("Erro ao excluir projeto:", err);
      setError("Falha ao excluir o projeto. Tente novamente."); 
    }
  };
  
  
  useEffect(() => {
    if (!currentUser) { setLoading(false); return; };

    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        let q;
        if (userProfile && userProfile.role === 'admin') {
          q = query(collection(db, 'projetos'), orderBy('createdAt', 'desc'));
        } else {
          q = query(collection(db, 'projetos'), where("userId", "==", currentUser.uid), orderBy('createdAt', 'desc'));
        }
        const querySnapshot = await getDocs(q);
        const projectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(projectsData);
      } catch (err) {
        console.error("Erro detalhado ao buscar dados:", err);
        setError("Não foi possível carregar os dados do painel.");
      } finally {
        setLoading(false);
      }
    };
    
    if(userProfile !== undefined) { 
        fetchProjects();
    }
  }, [currentUser, userProfile]);


  return (
    <div className="py-8 space-y-8">
      
      {/* CARD 1: PAINEL */}
      <div className="bg-white rounded-lg shadow-xl p-6 border-2 border-transparent hover:border-coral transition-all duration-300 ease-in-out max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 ">
          <div>
            {/* Título com Ícone */}
            <h2 className="text-3xl font-bold text-gunmetal flex items-center">
              <FontAwesomeIcon icon={faTachometerAlt} className="mr-3 text-coral h-6 w-6" />
              Painel do Professor
            </h2>
            <p className="text-paynes-gray mt-1">
              Bem-vindo, <strong>{userProfile ? userProfile.nome : currentUser?.email}</strong>!
            </p>
          </div>
          <Link
            to="/criar-projeto"
            className="bg-coral hover:bg-opacity-80 text-white font-bold py-2 px-5 rounded-lg text-base transition-colors shadow-md whitespace-nowrap flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
            Criar Novo Projeto
          </Link>
        </div>
      </div>

      {/* CARD 2: LISTA DE PROJETOS */}
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-5xl mx-auto border-2 border-transparent hover:border-coral transition-all duration-300 ease-in-out">
        {/* Título com Ícone */}
        <h3 className="text-2xl font-semibold text-gunmetal mb-6 hover:border-coral transition-all duration-300 ease-in-out flex items-center">
          <FontAwesomeIcon icon={faClipboardList} className="mr-3 text-coral h-5 w-5" />
          Meus Projetos Cadastrados {userProfile?.role === 'admin' && '(Visão de Admin)'}
        </h3>

        {error && <p className="text-red-600 font-semibold">{error}</p>} 
        {loading && <p className="text-paynes-gray">Carregando seus projetos...</p>} 

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length > 0 ? (
              projects.map(project => (
                <ProjectCard key={project.id} project={project} onDelete={handleDelete} />
              ))
            ) : (
              <p className="col-span-full text-center text-paynes-gray mt-4 flex items-center justify-center">
                <FontAwesomeIcon icon={faFolderOpen} className="mr-2 h-4 w-4 text-gray-400" />
                Você ainda não cadastrou nenhum projeto.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}