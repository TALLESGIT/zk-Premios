
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSorteio } from '@/context/SorteioContext';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface GradeNumerosProps {
  onNumeroSelecionado: (numero: number) => void;
}

const GradeNumeros: React.FC<GradeNumerosProps> = ({ onNumeroSelecionado }) => {
  const { numerosEscolhidos, jaFezCadastro, bloqueado } = useSorteio();
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [filtro, setFiltro] = useState('');
  const { toast } = useToast();
  const numerosPorPagina = 100;
  const totalPaginas = 10;

  // Estado para armazenar o número selecionado temporariamente (clicado)
  const [numeroSelecionadoTemp, setNumeroSelecionadoTemp] = useState<number | null>(null);

  // Gera números de 1 a 1000
  const todosNumeros = Array.from({ length: 1000 }, (_, i) => i + 1);
  
  // Filtra os números baseado na busca
  const numerosFiltrados = filtro 
    ? todosNumeros.filter(num => num.toString().includes(filtro))
    : todosNumeros;
  
  // Calcula os números para a página atual
  const numerosExibidos = !filtro
    ? numerosFiltrados.slice(
        (paginaAtual - 1) * numerosPorPagina,
        paginaAtual * numerosPorPagina
      )
    : numerosFiltrados;

  const handleNumeroCLick = (numero: number) => {
    if (bloqueado) {
      toast({
        title: "Seleção bloqueada",
        description: "A seleção de números está bloqueada pelo administrador.",
        variant: "destructive"
      });
      return;
    }
    if (jaFezCadastro) {
      toast({
        title: "Cadastro já realizado",
        description: "Você já escolheu um número para este sorteio.",
        variant: "destructive"
      });
      return;
    }
    
    setNumeroSelecionadoTemp(numero);
    onNumeroSelecionado(numero);
  };

  const irParaPagina = (pagina: number) => {
    setPaginaAtual(pagina);
    setFiltro('');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const isNumeroEscolhido = useCallback((numero: number) => {
    return numerosEscolhidos.includes(numero);
  }, [numerosEscolhidos]);

  return (
    <div className="w-full">
      {jaFezCadastro && (
        <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} className="text-yellow-600" />
          <p className="text-yellow-800">
            Você já escolheu um número. Cada participante pode escolher apenas um número para o sorteio.
          </p>
        </div>
      )}
      
      <div className="mb-6 relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          <Search size={18} />
        </div>
        <Input
          id="filtro"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Procurar número específico..."
          className="pl-10 border-brasil-blue/30 focus:border-brasil-blue focus-visible:ring-brasil-blue/20"
        />
      </div>

      {!filtro && (
        <div className="mb-6 flex justify-center flex-wrap gap-1">
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(pagina => (
            <Button
              key={pagina}
              onClick={() => irParaPagina(pagina)}
              variant={paginaAtual === pagina ? "default" : "outline"}
              className={`
                ${paginaAtual === pagina 
                  ? "bg-brasil-blue hover:bg-brasil-blue/90" 
                  : "hover:border-brasil-blue hover:text-brasil-blue"}
                transition-all font-medium
              `}
              size="sm"
            >
              {`${(pagina - 1) * 100 + 1}-${pagina * 100}`}
            </Button>
          ))}
        </div>
      )}

      <Card className="p-4 border-brasil-blue/20">
        <div className="number-grid">
          {numerosExibidos.map(numero => (
            <Button
              key={numero}
              onClick={() => handleNumeroCLick(numero)}
              disabled={isNumeroEscolhido(numero)}
              className={`
                rounded-md h-12 w-full p-0 font-bold text-lg transition-all transform hover:scale-105
                ${
                  isNumeroEscolhido(numero)
                    ? 'number-selected bg-brasil-blue text-white animate-pulse-light'
                    : numeroSelecionadoTemp === numero
                    ? 'number-selected bg-brasil-blue text-white'
                    : 'number-available hover:shadow-md'
                }
                ${jaFezCadastro ? 'cursor-not-allowed opacity-70' : ''}
              `}
              variant="outline"
            >
              {numero}
            </Button>
          ))}
        </div>
      </Card>
      
      {numerosFiltrados.length === 0 && (
        <p className="text-center text-muted-foreground mt-6 p-6 bg-muted/20 rounded-lg">
          Nenhum número encontrado. Tente outra busca.
        </p>
      )}
      
      {filtro && numerosFiltrados.length > 0 && (
        <p className="text-center text-muted-foreground mt-4">
          {numerosFiltrados.length} número(s) encontrado(s).
        </p>
      )}
      
      {!filtro && (
        <div className="mt-6 flex justify-center flex-wrap gap-1">
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(pagina => (
            <Button
              key={`bottom-${pagina}`}
              onClick={() => irParaPagina(pagina)}
              variant={paginaAtual === pagina ? "default" : "outline"}
              className={`
                ${paginaAtual === pagina 
                  ? "bg-brasil-blue hover:bg-brasil-blue/90" 
                  : "hover:border-brasil-blue hover:text-brasil-blue"}
                transition-all font-medium
              `}
              size="sm"
            >
              {`${(pagina - 1) * 100 + 1}-${pagina * 100}`}
            </Button>
          ))}
        </div>
      )}
      {bloqueado && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} className="text-red-600" />
          <p className="text-red-800">
            A seleção de números está bloqueada pelo administrador.
          </p>
        </div>
      )}
    </div>
  );
};

export default GradeNumeros;
