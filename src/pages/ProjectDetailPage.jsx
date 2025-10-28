// src/pages/ProjectDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Ensure Link is imported
import { doc, getDoc, collection, addDoc, serverTimestamp, query, onSnapshot, orderBy, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import ContactInfoModal from '../components/ContactInfoModal';
// Ensure all necessary icons are imported
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt, faCheckSquare, faHeart, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

// --- AddItemForm Component ---
// (Ensure this component definition is present and complete in your file)
function AddItemForm({ projectId }) {
    const [itemName, setItemName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleAddItem = async (e) => {
      e.preventDefault();
      if (itemName.trim() === '' || quantity <= 0) {
        setError("Por favor, preencha um nome válido e uma quantidade maior que zero.");
        return;
      }
      setLoading(true);
      setError('');
      setSuccess('');
      try {
        const itemsCollectionRef = collection(db, 'projetos', projectId, 'itens');
        await addDoc(itemsCollectionRef, {
          nomeItem: itemName,
          qtdNecessaria: Number(quantity),
          qtdRecebida: 0,
          createdAt: serverTimestamp()
        });
        setSuccess(`Item "${itemName}" adicionado com sucesso!`);
        setItemName('');
        setQuantity(1);
      } catch (err) {
        console.error("Erro ao adicionar item:", err); // Log error
        setError("Não foi possível adicionar o item.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg mt-8
                 border-2 border-transparent hover:border-coral transition-all duration-300 ease-in-out">
        <h4 className="text-lg font-semibold text-gunmetal mb-4">Adicionar Novo Item ao Projeto</h4>
        <form onSubmit={handleAddItem} className="space-y-4">
          <div>
            <label htmlFor="itemName" className="block text-sm font-medium text-paynes-gray mb-1">Nome do Item:</label>
            <input
              id="itemName" type="text" value={itemName} onChange={(e) => setItemName(e.target.value)}
              placeholder="Ex: Caderno brochura 96fls" required
              className="w-full md:w-2/3 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-coral focus:border-coral"
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-paynes-gray mb-1">Quantidade Necessária:</label>
            <input
              id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}
              min="1" required
              className="w-1/3 md:w-1/4 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-coral focus:border-coral"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="inline-flex items-center bg-coral hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
            {loading ? 'Adicionando...' : 'Adicionar Item'}
          </button>
          {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
          {success && <p className="text-green-600 mt-2 text-sm">{success}</p>}
        </form>
      </div>
    );
}

// --- ProjectDetailPage Component ---
export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const { currentUser } = useAuth(); // Get currentUser

  const [project, setProject] = useState(null);
  const [professor, setProfessor] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // useEffect for hybrid logic (fetch project and potentially professor)
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        const projectRef = doc(db, 'projetos', projectId);
        const docSnap = await getDoc(projectRef);

        if (docSnap.exists()) {
          const projectData = { id: docSnap.id, ...docSnap.data() };
          setProject(projectData);

          // Try to fetch professor details only if project has userId
          if (projectData.userId) {
            try {
              const professorRef = doc(db, 'users', projectData.userId);
              const professorSnap = await getDoc(professorRef);
              if (professorSnap.exists()) {
                setProfessor(professorSnap.data());
              } else {
                 setProfessor(null); // Professor doc doesn't exist
              }
            } catch (profError) {
              console.warn("Could not load professor details (visitor might not be logged in).", profError);
              setProfessor(null); // Permission error or other issue
            }
          } else {
             setProfessor(null); // No userId on project
          }
        } else {
          setError("Projeto não encontrado.");
        }
      } catch (err) {
        console.error("Error loading project:", err); // Log the actual error
        setError("Falha ao carregar o projeto.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjectData();
  }, [projectId]);

  // useEffect to fetch items in real-time
  useEffect(() => {
    // Ensure projectId is available before querying subcollection
    if (!projectId) return;

    const itemsCollectionRef = collection(db, 'projetos', projectId, 'itens');
    const q = query(itemsCollectionRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q,
      (querySnapshot) => {
        const itemsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setItems(itemsData);
      },
      (err) => {
        console.error("Erro ao buscar itens:", err);
        setError("Falha ao carregar os itens do projeto.");
      }
    );

    // Cleanup function to unsubscribe when component unmounts
    return () => unsubscribe();
  }, [projectId]); // Dependency array includes projectId

  // --- Action Functions ---

  const handleMarkAsReceived = async (item) => {
    const receivedAmountStr = window.prompt(`Quantos "${item.nomeItem}" você recebeu?`);
    if (receivedAmountStr === null || receivedAmountStr.trim() === '') return;
    const receivedAmount = parseInt(receivedAmountStr, 10);
    if (isNaN(receivedAmount) || receivedAmount <= 0) {
      alert("Por favor, insira um número válido.");
      return;
    }
    const newTotalReceived = (item.qtdRecebida || 0) + receivedAmount; // Ensure qtdRecebida is treated as 0 if undefined
    if (newTotalReceived > item.qtdNecessaria) {
      alert(`A quantidade recebida não pode ultrapassar o total necessário de ${item.qtdNecessaria}.`);
      return;
    }
    try {
      const itemRef = doc(db, 'projetos', projectId, 'itens', item.id);
      await updateDoc(itemRef, { qtdRecebida: newTotalReceived });
    } catch (err) {
       console.error("Error updating item:", err); // Log error
      alert("Falha ao atualizar o item.");
    }
  };

  const handleDeleteItem = async (itemId, itemName) => {
    const confirmDelete = window.confirm(`Você tem certeza que deseja excluir o item "${itemName}"?`);
    if (!confirmDelete) return;
    try {
      const itemRef = doc(db, 'projetos', projectId, 'itens', itemId);
      await deleteDoc(itemRef);
    } catch (err) {
      console.error("Error deleting item:", err); // Log error
      alert("Falha ao excluir o item.");
    }
  };

  const handleSignalDonation = () => {
    setIsModalOpen(true);
  };

  // --- Render Logic ---

  if (loading && !project) return <p className="text-center py-10 text-paynes-gray">Carregando detalhes do projeto...</p>;
  if (error) return <p className="text-center py-10 text-red-600 font-semibold">{error}</p>;
  if (!project) return <p className="text-center py-10 text-paynes-gray">Projeto não encontrado.</p>;

  // Check if the current user is the owner of the project
  const isOwner = currentUser && project && currentUser.uid === project.userId;

  return (
    <div className="py-10 space-y-8">

      {/* CARD 1: Project Info */}
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 border-2 border-transparent hover:border-coral transition-all duration-300 ease-in-out max-w-4xl mx-auto">
        {/* Flex container for Title and Edit Button */}
        <div className="flex justify-between items-start mb-4 gap-4"> {/* Added gap */}
          <h2 className="text-3xl md:text-4xl font-bold text-gunmetal break-words">{project.titulo}</h2> {/* Added break-words */}
          {/* Edit Button (only shows for owner) */}
          {isOwner && (
            <Link
              to={`/projeto/edit/${projectId}`}
              className="flex-shrink-0 flex items-center text-sm text-yellow-600 hover:text-yellow-800 font-medium transition-colors whitespace-nowrap ml-4" // flex-shrink-0 prevents shrinking
            >
              <FontAwesomeIcon icon={faPencilAlt} className="mr-1 h-3 w-3" /> Editar Projeto
            </Link>
          )}
        </div>
        {/* Rest of project info */}
        <div className="text-paynes-gray space-y-1 mb-6">
            {/* Display logic prioritizes loaded professor profile, falls back to project data */}
            <p><strong>Escola:</strong> {professor ? professor.escola : project.escola || 'Não informada'}</p>
            <p><strong>Professor(a):</strong> {professor ? professor.nome : (project.professorNome || project.professorEmail || 'Não informado')}</p>
            <p><strong>Endereço:</strong> {project.endereco || 'Não informado'}</p>
        </div>
        <h4 className="text-xl font-semibold text-gunmetal mb-2">Descrição do Projeto</h4>
        <p className="text-paynes-gray leading-relaxed whitespace-pre-wrap">{project.descricao}</p>
      </div>

      {/* CARD 2: Needed Items List */}
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 max-w-4xl mx-auto border-2 border-transparent hover:border-coral transition-all duration-300 ease-in-out">
        <h3 className="text-2xl font-semibold text-gunmetal mb-6 border-b border-gray-200 pb-3">
          Itens Necessários
        </h3>
        {/* Conditional loading message for items specifically */}
        {loading && items.length === 0 && !error && <p className="text-paynes-gray text-center">Carregando itens...</p>}

        <div className="space-y-4">
            {!loading && items.length > 0 ? (
              items.map(item => (
                // Individual Item Card
                <div key={item.id} className="border border-gray-200 rounded-md p-4 bg-gray-50">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    {/* Item Info */}
                    <div className="flex-grow">
                      <p className="font-bold text-gunmetal break-words">{item.nomeItem}</p> {/* Added break-words */}
                      <p className="text-sm text-paynes-gray">{`Recebido: ${item.qtdRecebida || 0} de ${item.qtdNecessaria}`}</p> {/* Added fallback for qtdRecebida */}
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-300 rounded-full h-2.5 mt-1">
                        <div
                          className="bg-green-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                          // Ensure division by zero is handled, ensure values are numbers
                          style={{ width: `${Math.min(100, ( (item.qtdRecebida || 0) / (item.qtdNecessaria || 1) ) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex-shrink-0 flex items-center gap-3 mt-2 sm:mt-0">
                      {isOwner ? (
                        // Buttons for Professor
                        <>
                          <button onClick={() => handleMarkAsReceived(item)} className="text-sm text-green-600 hover:text-green-800 flex items-center gap-1 font-medium hover:underline">
                            <FontAwesomeIcon icon={faCheckSquare} className="h-4 w-4"/> Recebido
                          </button>
                          <button onClick={() => handleDeleteItem(item.id, item.nomeItem)} className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1 font-medium hover:underline">
                             <FontAwesomeIcon icon={faTrashAlt} className="h-4 w-4"/> Excluir
                          </button>
                        </>
                      ) : (
                        // Button for Donor
                        <button onClick={handleSignalDonation} className="bg-coral hover:bg-opacity-80 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors flex items-center gap-1 shadow">
                          <FontAwesomeIcon icon={faHeart} className="h-4 w-4"/> Quero Ajudar!
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Show only if not loading and no error occurred fetching items
              !loading && !error && <p className="text-center text-paynes-gray">Nenhum item cadastrado para este projeto ainda.</p>
            )}
            {/* Show error specific to item loading */}
            {!loading && error && error.includes("itens") && <p className="text-center text-red-600 font-semibold">{error}</p>}
          </div>
          {/* Add Item Form (conditionally rendered) */}
          {isOwner && <AddItemForm projectId={projectId} />}
        </div>

      {/* Contact Info Modal */}
      <ContactInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={project}
        professor={professor}
      />
    </div>
  );
}