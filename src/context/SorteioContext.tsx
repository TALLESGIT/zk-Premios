
import { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, addDoc, query } from "firebase/firestore";
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
      for (const doc of querySnapshot.docs) {
        const data = doc.data() as Participante;
        participantesData.push(data);
        numerosData.push(data.numero);
      }
      setParticipantes(participantesData);
      setNumerosEscolhidos(numerosData);
    });

    return () => unsubscribe();
  }, []);

  const numerosDisponiveis = Array.from({ length: MAX_NUMERO }, (_, i) => i + 1)
    .filter(num => !numerosEscolhidos.includes(num));

  const addParticipante = async (participante: Participante) => {
    try {
      await addDoc(collection(db, "participantes"), participante);
      setJaFezCadastro(true);
    } catch (error) {
      console.error("Erro ao adicionar participante:", error);
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
