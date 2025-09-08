import React, { useState, useEffect } from 'react';
// import { db } from '../firebase'; // Descomente quando for conectar ao Firestore
// import { collection, getDocs } from "firebase/firestore";

// --- DADOS DE EXEMPLO (Substituir com Firebase depois) ---
const mockProjects = [
  { id: '1', title: 'Clube de Leitura - Turma 4B', school: 'Escola Classe 01 de Ceilândia', description: 'Precisamos de 25 exemplares do livro "O Pequeno Príncipe" para iniciar nosso clube de leitura semanal.', professor: 'Prof. Ana' },
  { id: '2', title: 'Feira de Ciências', school: 'Centro de Ensino Fundamental 10 de Taguatinga', description: 'Buscamos doações de cartolinas, potes de vidro e tintas para a nossa feira de ciências anual.', professor: 'Prof. Carlos' },
  { id: '3', title: 'Horta Comunitária', school: 'Escola Primária 05 do Gama', description: 'Precisamos de sementes de hortaliças, pás pequenas e luvas de jardinagem para criar uma horta educativa.', professor: 'Prof. Maria' },
];

function ProjectCard({ project }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
      <p className="text-sm text-gray-500 mb-4">{project.school} - {project.professor}</p>
      <p className="text-gray-600 flex-grow mb-6">{project.description}</p>
      <button className="w-full mt-auto bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300">
        Ver Itens e Ajudar
      </button>
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Substituir este bloco pelo código que busca dados do Firestore
    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Projetos Precisando de Ajuda</h1>
        <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
          Cada pequeno gesto ajuda a construir um futuro melhor. Encontre um projeto perto de você e faça a diferença.
        </p>
      </div>
      
      {loading ? (
        <div className="text-center text-gray-500">Carregando projetos...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
