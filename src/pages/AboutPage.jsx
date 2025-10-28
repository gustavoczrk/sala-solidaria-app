import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/logo-sala-solidaria.png';

export default function AboutPage() {
  return (
    // Contêiner principal com padding vertical para espaçamento acima e abaixo do card
    <div className="flex justify-center items-center py-16 px-4"> 
      
      {/* CARD BRANCO PARA O CONTEÚDO */}
      <div className="bg-white bg-opacity-95 p-8 md:p-10 rounded-lg shadow-xl max-w-3xl w-full
                 border-2 border-transparent hover:border-coral transition-all duration-300 ease-in-out"> 
        
        {/* LOGO ADICIONADO AQUI */}
        <div className="flex justify-center mb-6"> {/* Div para centralizar o logo */}
          <img src={logoImage} alt="Sala Solidária Logo" className="h-16 w-auto" /> {/* Ajuste a altura h-16 conforme necessário */}
        </div>

        {/* Título da página DENTRO do card */}
        <h2 className="text-3xl md:text-4xl font-bold text-gunmetal text-center mb-8">
          Sobre a Sala Solidária
        </h2>
        
        {/* Parágrafos */}
        <div className="space-y-6 text-paynes-gray leading-relaxed text-base md:text-lg">
          <p>
              O projeto Sala Solidária nasceu da observação de uma realidade comum em muitas escolas públicas:
            professores dedicados e cheios de ideias criativas, mas que frequentemente esbarram na falta
            de materiais básicos para colocar seus projetos em prática.
          </p>
          
          <p>
              Ao mesmo tempo, percebemos que a comunidade ao redor da escola – pais, moradores,
            pequenos negócios locais – muitas vezes tem o desejo genuíno de ajudar, mas não sabe
            como direcionar esse apoio de forma eficaz. Doações genéricas nem sempre atendem às
            necessidades específicas de uma turma ou de um projeto pedagógico.
          </p>

          <p>
              Foi dessa lacuna de comunicação que surgiu a ideia da plataforma: criar uma ponte
            direta, transparente e simples entre quem precisa e quem quer ajudar. Acreditamos
            que, ao dar visibilidade às necessidades reais das salas de aula, podemos mobilizar
            a generosidade local e gerar um impacto positivo direto no aprendizado dos alunos.
          </p>

          <p>
              Este projeto foi desenvolvido como parte da disciplina de Projeto Integrador III do curso
            de Ciência da Computação do UniCEUB, no segundo semestre de 2025, com o objetivo de
            aplicar os conhecimentos técnicos na criação de uma solução com relevância social
            para a comunidade do Distrito Federal.
          </p>
        </div>

        {/* Botão Call-to-Action */}
        <div className="text-center mt-10"> 
          <Link 
            to="/projetos" 
            className="inline-block bg-coral hover:bg-opacity-80 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors transform hover:-translate-y-1 shadow-md"
          >
            Ver Projetos Precisando de Ajuda
          </Link>
        </div>
      </div> 
    </div>
  );
}