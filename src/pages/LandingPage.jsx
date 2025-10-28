import React from 'react';
import { Link } from 'react-router-dom'; // O Link agora será usado

export default function LandingPage() {
  return (
    <div
      className="relative flex flex-col items-center justify-center py-20 px-4" // Ajuste o py-20 se necessário
    >
      <div className="relative bg-white bg-opacity-95 p-8 md:p-10 rounded-lg shadow-2xl max-w-2xl text-center z-10
                 border-2 border-transparent hover:border-coral transition-all duration-300 ease-in-out">
        <header className="mb-8"> {/* Aumentamos a margem inferior do header */}
          {/* TÍTULO PRINCIPAL*/}
          <h1 className="text-4xl md:text-5xl font-bold text-gunmetal mb-4">
            Bem-vindo à Sala Solidária!
          </h1>
          <br></br>
          {/* Subtítulo */}
          <p className="text-lg md:text-xl text-paynes-gray">
            Conectando a generosidade da comunidade com as necessidades reais da sala de aula.
          </p>
        </header>
        
        <main>
          <p className="text-base md:text-lg text-paynes-gray leading-relaxed mb-8">
            Nosso projeto cria uma ponte direta entre professores que precisam de materiais
            para seus projetos pedagógicos e pessoas incríveis como você, que desejam ajudar.
            Com um gesto simples, você pode transformar a educação de uma criança.
          </p>
          <p className="text-base md:text-lg text-paynes-gray leading-relaxed mb-8">
            É muito simples, procure por algum projeto que você tenha condições de contribuir, entre em contato com o professor e pronto!</p>
          
          {/* Botão com o Link restaurado */}
          <Link 
            to="/projetos" 
            className="inline-block bg-coral hover:bg-opacity-80 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors transform hover:-translate-y-1 shadow-md"
          >
            Ver Projetos Precisando de Ajuda
          </Link>
        </main>
      </div>
    </div>
  );
}