import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faPaintBrush, faFlask, faSeedling } from '@fortawesome/free-solid-svg-icons';

function ProjectCard({ project }) {
  const getIcon = (title = '') => {
    const lowerCaseTitle = title.toLowerCase();
    if (lowerCaseTitle.includes('leitura') || lowerCaseTitle.includes('livro')) return faBookOpen;
    if (lowerCaseTitle.includes('arte') || lowerCaseTitle.includes('pintura')) return faPaintBrush;
    if (lowerCaseTitle.includes('ciência') || lowerCaseTitle.includes('feira')) return faFlask;
    if (lowerCaseTitle.includes('horta') || lowerCaseTitle.includes('jardim')) return faSeedling;
    return faBookOpen; // Default icon
  };

  const truncateText = (text = '', maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Link
      to={`/projeto/${project.id}`}
      className="flex group transition-shadow duration-300 ease-in-out"
    >
      <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-md p-4 w-full group-hover:shadow-lg transition-shadow duration-300 ease-in-out border-2 border-transparent hover:border-coral transition-all duration-300 ease-in-out">
        <div className="flex-shrink-0 mr-4">
          <FontAwesomeIcon icon={getIcon(project.titulo)} className="text-coral text-3xl md:text-4xl" />
        </div>
        <div className="flex-grow min-w-0">
          <h4 className="text-lg md:text-xl font-bold text-gunmetal mb-1 truncate">{project.titulo}</h4>
          <p className="text-sm text-paynes-gray truncate">{project.escola}</p>
          <p className="text-sm text-paynes-gray mb-2">por {project.professorNome || 'Professor(a)'}</p>
          <p className="text-xs text-gray-500 mb-3">{truncateText(project.descricao, 70)}</p>
          <span className="text-coral font-semibold group-hover:underline text-sm">Ver Detalhes e Ajudar</span>
        </div>
      </div>
    </Link>
  );
}


export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        setLoading(true);
        const projectsCollectionRef = collection(db, 'projetos');
        const q = query(projectsCollectionRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const projectsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProjects(projectsData);
      } catch (err) {
        console.error("Erro ao buscar projetos:", err); // Keep console error for debugging
        setError("Não foi possível carregar os projetos. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllProjects();
  }, []);

  return (
    <div className="py-12 px-4">

      {/* --- HEADER SECTION UPDATED WITH CARD --- */}
      <div className="mb-12 flex justify-center"> {/* Centering container */}
        {/* Card for the header */}
        <div className="bg-white bg-opacity-95 p-6 md:p-8 rounded-lg shadow-xl max-w-3xl text-center
                   border-2 border-transparent hover:border-coral transition-all duration-300 ease-in-out">
          <h1 className="text-4xl md:text-5xl font-bold text-gunmetal mb-4">
            Projetos Precisando de Ajuda
          </h1>
          <p className="text-lg text-paynes-gray max-w-2xl mx-auto">
            Cada pequeno gesto ajuda a construir um futuro melhor. Encontre um projeto perto de você e faça a diferença.
          </p>
        </div>
      </div>
      {/* --- END HEADER SECTION --- */}

      {/* Loading, Error, or Projects Grid */}
      {loading && <div className="text-center text-paynes-gray">Carregando projetos...</div>}
      {error && <div className="text-center text-red-600 font-semibold">{error}</div>}

      {!loading && !error && (
        // Responsive Grid
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.length > 0 ? (
            projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <p className="col-span-full text-center text-paynes-gray">Nenhum projeto precisando de ajuda no momento.</p>
          )}
        </div>
      )}
    </div>
  );
}