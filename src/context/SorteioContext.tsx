
import { createContext, useContext, useEffect, useState } from 'react';

type Participante = {
  nome: string;
  telefone: string;
  numero: number;
};

interface SorteioContextType {
  participantes: Participante[];
  numerosEscolhidos: number[];
  numerosDisponiveis: number[];
  addParticipante: (participante: Participante) => void;
  isNumeroDisponivel: (numero: number) => boolean;
  getParticipantePorNumero: (numero: number) => Participante | undefined;
  limparSelecao: () => void;
  jaFezCadastro: boolean;
}

const MAX_NUMERO = 1000;

const SorteioContext = createContext<SorteioContextType | undefined>(undefined);

export function SorteioProvider({ children }: { children: React.ReactNode }) {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [numerosEscolhidos, setNumerosEscolhidos] = useState<number[]>([]);
  const [jaFezCadastro, setJaFezCadastro] = useState<boolean>(false);
  
  // Inicializar dados do localStorage se existirem
  useEffect(() => {
    const storedParticipantes = localStorage.getItem('sorteioParticipantes');
    const storedNumeros = localStorage.getItem('sorteioNumeros');
    const storedJaFezCadastro = localStorage.getItem('jaFezCadastro');
    
    if (storedParticipantes) {
      setParticipantes(JSON.parse(storedParticipantes));
    }
    
    if (storedNumeros) {
      setNumerosEscolhidos(JSON.parse(storedNumeros));
    }
    
    if (storedJaFezCadastro) {
      setJaFezCadastro(JSON.parse(storedJaFezCadastro));
    }
  }, []);
  
  // Salvar mudanças no localStorage
  useEffect(() => {
    if (participantes.length > 0) {
      localStorage.setItem('sorteioParticipantes', JSON.stringify(participantes));
      localStorage.setItem('sorteioNumeros', JSON.stringify(numerosEscolhidos));
    }
    localStorage.setItem('jaFezCadastro', JSON.stringify(jaFezCadastro));
  }, [participantes, numerosEscolhidos, jaFezCadastro]);

  const numerosDisponiveis = Array.from({ length: MAX_NUMERO }, (_, i) => i + 1)
    .filter(num => !numerosEscolhidos.includes(num));

  const addParticipante = (participante: Participante) => {
    setParticipantes(prev => [...prev, participante]);
    setNumerosEscolhidos(prev => [...prev, participante.numero]);
    setJaFezCadastro(true);
  };

  const isNumeroDisponivel = (numero: number) => {
    return !numerosEscolhidos.includes(numero);
  };

  const getParticipantePorNumero = (numero: number) => {
    return participantes.find(p => p.numero === numero);
  };
  
  const limparSelecao = () => {
    // Função que limpa o estado de cadastro (para desenvolvimento/teste)
    localStorage.removeItem('jaFezCadastro');
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
      jaFezCadastro
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
