import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import {
  doc, getDoc, collection, query, where, getDocs, writeBatch
} from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSave, 
  faUser,   
  faEnvelope, 
  faSchool, 
  faPhone, 
  faIdCard  
} from '@fortawesome/free-solid-svg-icons';

export default function ProfilePage() {
  const { currentUser } = useAuth();
  
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // useEffect (Sem alterações)
  useEffect(() => {
    if (currentUser) {
      const fetchUserData = async () => {
        setLoading(true);
        const userDocRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setName(userData.nome || '');
          setSchool(userData.escola || '');
          setTelefone(userData.telefone || '');
        } else {
          setName(currentUser.displayName || '');
        }
        setLoading(false);
      };
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  // handleUpdate (Sem alterações)
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const batch = writeBatch(db);
      const userDocRef = doc(db, 'users', currentUser.uid);
      batch.set(userDocRef, {
        nome: name,
        escola: school,
        email: currentUser.email,
        telefone: telefone // Salva apenas os números
      }, { merge: true });

      const projetosQuery = query(
        collection(db, 'projetos'),
        where("userId", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(projetosQuery);

      querySnapshot.forEach((projectDoc) => {
        const projectRef = doc(db, 'projetos', projectDoc.id);
        batch.update(projectRef, {
          professorNome: name,
          escola: school
        });
      });
      
      await batch.commit();
      setSuccess("Perfil e todos os projetos foram atualizados com sucesso!");

    } catch (err) {
      console.error("Erro ao atualizar perfil e projetos: ", err);
      setError("Falha ao atualizar o perfil. Tente novamente.");
    }
    setLoading(false);
  };

  // Tela de Loading (Sem alterações)
  if (loading && !name) {
    return <p className="text-center py-10 text-paynes-gray">Carregando perfil...</p>;
  }

  // --- JSX ---
  return (
    <div className="py-8 space-y-8">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 max-w-4xl mx-auto
                   border-2 border-transparent hover:border-coral transition-all duration-300 ease-in-out">
        
        <h2 className="text-3xl font-bold text-gunmetal flex items-center mb-1">
          <FontAwesomeIcon icon={faIdCard} className="mr-3 text-coral h-6 w-6" />
          Meu Perfil
        </h2>
        <p className="text-paynes-gray mb-6">
          Aqui você pode editar suas informações.
        </p>
        
        <form onSubmit={handleUpdate} className="space-y-6">
          
          {/* Nome (Sem alterações) */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-paynes-gray mb-1">
              Nome Completo
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faUser} className="text-gray-400 h-4 w-4" />
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md p-2 pl-10 focus:ring-coral focus:border-coral"
              />
            </div>
          </div>

          {/* Email (Sem alterações) */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-paynes-gray mb-1">
              Email
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 h-4 w-4" />
              </div>
              <input
                id="email"
                type="email"
                value={currentUser?.email || ''}
                disabled
                className="w-full border border-gray-300 rounded-md p-2 pl-10 bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Escola (Sem alterações) */}
          <div>
            <label htmlFor="school" className="block text-sm font-medium text-paynes-gray mb-1">
              Escola
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSchool} className="text-gray-400 h-4 w-4" />
              </div>
              <input
                id="school"
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                required
                placeholder="Ex: CED 08 OCTOGONAL"
                className="w-full border border-gray-300 rounded-md p-2 pl-10 focus:ring-coral focus:border-coral"
              />
            </div>
          </div>

          {/* --- CAMPO DE TELEFONE ATUALIZADO --- */}
          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-paynes-gray mb-1">
              Telefone para Contato (Opcional)
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faPhone} className="text-gray-400 h-4 w-4" />
              </div>
              <input
                id="telefone"
                type="tel"
                value={telefone}
                onChange={(e) => {
                  // Pega o valor, remove tudo que NÃO FOR dígito (\D)
                  const onlyNums = e.target.value.replace(/\D/g, '');
                  // Limita a 11 dígitos (DDD + 9xxxx-xxxx)
                  if (onlyNums.length <= 11) {
                    setTelefone(onlyNums);
                  }
                }}
                placeholder="(XX) 9XXXXXXXX" // Atualizado para refletir o formato de 11 dígitos
                className="w-full border border-gray-300 rounded-md p-2 pl-10 focus:ring-coral focus:border-coral"
              />
            </div>
          </div>
          {/* --- FIM DA ATUALIZAÇÃO --- */}

          {/* Feedback */}
          <div className="h-4">
            {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}
            {success && <p className="text-green-600 text-sm font-semibold">{success}</p>}
          </div>

          {/* Botão Salvar (Sem alterações) */}
          <div className="pt-2">
            <button
              disabled={loading}
              type="submit"
              className="inline-flex items-center justify-center bg-coral hover:bg-opacity-80 text-white font-bold py-2 px-5 rounded-lg text-base transition-colors shadow-md disabled:opacity-50"
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