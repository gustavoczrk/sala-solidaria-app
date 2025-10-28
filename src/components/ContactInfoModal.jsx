import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faHeart, faCheck } from '@fortawesome/free-solid-svg-icons';

export default function ContactInfoModal({ isOpen, onClose, project, professor }) {
  if (!isOpen || !project) return null;

  
  const displayName = professor ? professor.nome : project.professorNome;
  const displayEmail = professor ? professor.email : project.professorEmail;
  const displaySchool = professor ? professor.escola : project.escola;
  const displayPhone = professor ? professor.telefone : null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4" 
      onClick={onClose}
    >
      {/* Conteúdo do Modal (Card Branco) */}
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full relative
                   p-6 md:p-8 border-2 border-transparent hover:border-coral transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Botão de Fechar 'X' */}
        <button 
          className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-600 transition-colors" 
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        
        {/* Título */}
        <h2 className="text-2xl font-bold text-gunmetal mb-2 flex items-center">
          <FontAwesomeIcon icon={faHeart} className="mr-3 text-coral h-6 w-6" />
          Obrigado por querer ajudar!
        </h2>
        
        {/* Subtítulo */}
        <p className="text-paynes-gray mb-4">
          O próximo passo é combinar a entrega diretamente com o(a) professor(a) responsável.
        </p>

        {/* Caixa de Informações de Contato */}
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 my-4 space-y-2">
          <p className="text-paynes-gray">
            <strong>Professor(a):</strong> {displayName || 'Não informado'}
          </p>
          <p className="text-paynes-gray">
            <strong>E-mail para Contato:</strong> {displayEmail ? 
              <a href={`mailto:${displayEmail}`} className="text-coral hover:underline ml-1">{displayEmail}</a> 
              : 'Não informado'}
          </p>
          {displayPhone && 
            <p className="text-paynes-gray">
              <strong>Telefone:</strong> {displayPhone}
            </p>
          }
          <p className="text-paynes-gray">
            <strong>Escola:</strong> {displaySchool || 'Não informada'}
          </p>
          <p className="text-paynes-gray">
            <strong>Endereço:</strong> {project.endereco || 'Não informado'}
          </p>
        </div>

        {/* Dica */}
        <p className="text-sm text-paynes-gray mt-6">
          <strong>Dica:</strong> Ao enviar o e-mail, mencione o nome do projeto ("{project.titulo}") para facilitar a comunicação.
        </p>

        {/* Botão de Confirmação */}
        <button 
          className="w-full inline-flex items-center justify-center bg-coral hover:bg-opacity-80 text-white font-bold py-2 px-5 rounded-lg text-base transition-colors shadow-md disabled:opacity-50 mt-6" 
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faCheck} className="mr-2 h-4 w-4" />
          Entendi
        </button>
      </div>
    </div>
  );
}