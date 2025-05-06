
import { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, addDoc, query, getDocs } from "firebase/firestore";
import { db } from '../lib/firebase';

type Participante = {
  nome: string;
  telefone: string;
  numero: number;
};

interface SorteioContextType {
  participantes: Participante[];
  numerosEscolhidos: number[];
  numerosDisponiveis: number[];
  addParticipante: (participante: Participante) => Promise<void>;
  isNumeroDisponivel: (numero: number) => boolean;
  getParticipantePorNumero: (numero: number) => Participante | undefined;
  limparSelecao: () => void;
  jaFezCadastro: boolean;
  setParticipantes: React.Dispatch<React.SetStateAction<Participante[]>>;
  setNumerosEscolhidos: React.Dispatch<React.SetStateAction<number[]>>;
}

const MAX_NUMERO = 1000;

const SorteioContext = createContext<SorteioContextType | undefined>(undefined);

export function SorteioProvider({ children }: { children: React.ReactNode }) {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [numerosEscolhidos, setNumerosEscolhidos] = useState<number[]>([]);
  const [jaFezCadastro, setJaFezCadastro] = useState<boolean>(false);

  useEffect(() => {
    const q = query(collection(db, "participantes"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const participantesData: Participante[] = [];
      const numerosData: number[] = [];
      let telefoneUsuarioAtual = ''; // variável para armazenar telefone do usuário atual
      let nomeUsuarioAtual = ''; // variável para armazenar nome do usuário atual

      // Tentar obter telefone e nome do usuário atual do localStorage ou outro meio
      try {
        telefoneUsuarioAtual = localStorage.getItem('telefoneUsuarioAtual') || '';
        nomeUsuarioAtual = localStorage.getItem('nomeUsuarioAtual') || '';
      } catch (error) {
        console.warn('Não foi possível acessar localStorage para telefone ou nome do usuário atual');
      }

      let jaFezCadastroLocal = false;

      for (const doc of querySnapshot.docs) {
        const data = doc.data() as Participante;
        participantesData.push(data);
        numerosData.push(data.numero);

        if (data.telefone === telefoneUsuarioAtual && data.nome === nomeUsuarioAtual) {
          jaFezCadastroLocal = true;
        }
      }
      setParticipantes(participantesData);
      setNumerosEscolhidos(numerosData);
      setJaFezCadastro(jaFezCadastroLocal);
    });

    return () => unsubscribe();
  }, []);

  const numerosDisponiveis = Array.from({ length: MAX_NUMERO }, (_, i) => i + 1)
    .filter(num => !numerosEscolhidos.includes(num));

  const addParticipante = async (participante: Participante) => {
    try {
      // Verifica se o participante já fez cadastro pelo telefone
      const q = query(collection(db, "participantes"));
      const querySnapshot = await getDocs(q);
      const jaCadastrado = querySnapshot.docs.some(doc => {
        const data = doc.data() as Participante;
        return data.telefone === participante.telefone;
      });
      if (jaCadastrado) {
        throw new Error("Participante já cadastrado com esse telefone.");
      }
      await addDoc(collection(db, "participantes"), participante);
      setJaFezCadastro(true);
    } catch (error) {
      console.error("Erro ao adicionar participante:", error);
      throw error;
    }
  };

  const isNumeroDisponivel = (numero: number) => {
    return !numerosEscolhidos.includes(numero);
  };

  const getParticipantePorNumero = (numero: number) => {
    return participantes.find(p => p.numero === numero);
  };

  const limparSelecao = () => {
    setJaFezCadastro(false);
  };

  return (
    <SorteioContext.Provider value={{
      participantes,
      numerosEscolhidos,
      numerosDisponiveis,
      addParticipante,
      isNumeroDisponivel,
      getParticipantePorNumero,
      limparSelecao,
      jaFezCadastro,
      setParticipantes,
      setNumerosEscolhidos
    }}>
      {children}
    </SorteioContext.Provider>
  );
}

export const useSorteio = () => {
  const context = useContext(SorteioContext);
  if (context === undefined) {
    throw new Error('useSorteio deve ser usado dentro de um SorteioProvider');
  }
  return context;
};
