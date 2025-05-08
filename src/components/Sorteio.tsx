import { ArrowRight, Trophy, Users } from "lucide-react";
import  { useEffect, useRef, useState } from "react";
import { useSorteio } from "../context/SorteioContext";
import { useIsMobile } from "../hooks/use-mobile";
import FormularioCadastro from "./FormularioCadastro";
import GradeNumeros from "./GradeNumeros";
import "../components/ui/animations.css";
import Fireworks from "./Fireworks";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const Sorteio = () => {
  const [numeroSelecionado, setNumeroSelecionado] = useState<number | null>(null);
  const [ganhador, setGanhador] = useState<null | { numero: number; nome: string; telefone: string }>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const { numerosEscolhidos, participantes, jaFezCadastro, bloqueado, setBloqueado, usuarioLogado } = useSorteio();
  const formRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Calculate progress percentage
  const progressValue = (numerosEscolhidos.length / 1000) * 100;

  const handleNumeroSelecionado = (numero: number) => {
    const usuarioEspecialNome = "Itallo Antônio Ferreira";
    const usuarioEspecialWhatsApp = "31983886065";

    const usuarioEspecialCadastrado = participantes.some(
      (p) =>
        p.nome === usuarioEspecialNome &&
        p.telefone.replace(/\D/g, "") === usuarioEspecialWhatsApp
    );

    if (bloqueado && !usuarioEspecialCadastrado) {
      // Bloqueado para usuários que não são o administrador
      return;
    }

    if (!jaFezCadastro || usuarioEspecialCadastrado) {
      setNumeroSelecionado(numero);
      if (isMobile && formRef.current) {
        setTimeout(() => {
          formRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    }
  };

  function maskLastFourDigits(num: number | string): string {
    const numStr = num.toString();
    if (numStr.length <= 4) {
      return '*'.repeat(numStr.length);
    }
    const visiblePart = numStr.slice(0, numStr.length - 4);
    return `${visiblePart}****`;
  }

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      // Contagem terminou, sortear número
      sortearNumero();
      setCountdown(null);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const sortearNumero = () => {
    if (numerosEscolhidos.length === 0) {
      alert("Nenhum número reservado para sortear.");
      return;
    }
    const numeroSorteado = numerosEscolhidos[Math.floor(Math.random() * numerosEscolhidos.length)];
    const participanteGanhador = participantes.find(p => p.numero === numeroSorteado);
    if (participanteGanhador) {
      setGanhador(participanteGanhador);
    }
  };

  const iniciarContagemRegressiva = () => {
    setCountdown(5);
  };

  // Verificar se o usuário especial fez cadastro para liberar o botão sortear
  const usuarioEspecialNome = "Itallo Antônio Ferreira";
  const usuarioEspecialWhatsApp = "31983886065";

  const usuarioEspecialCadastrado = participantes.some(
    (p) =>
      p.nome === usuarioEspecialNome &&
      p.telefone.replace(/\D/g, "") === usuarioEspecialWhatsApp
  );

  const podeSortear = usuarioEspecialCadastrado;

  return (
    <div className="container py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-brasil-blue to-brasil-yellow bg-clip-text text-transparent mb-3">
          ZK Premios
        </h1>
        <p className="text-xl text-gray-600 mb-3">Escolha seu número da sorte entre 1 e 1000</p>

        <div className="max-w-md mx-auto mb-4">
          <Progress value={progressValue} className="h-2 mb-2" />
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="bg-white border-brasil-blue text-brasil-blue">
              Disponível: {1000 - numerosEscolhidos.length}
            </Badge>
            <Badge variant="outline" className="bg-brasil-yellow text-black border-brasil-yellow">
              Reservados: {numerosEscolhidos.length}
            </Badge>
          </div>
        </div>

        <div className="mb-6">
          {countdown !== null ? (
            <div className="mx-auto w-24 h-24 rounded-full border-4 border-brasil-blue flex items-center justify-center text-4xl font-bold text-brasil-blue animate-pulse">
              {countdown}
            </div>
          ) : (
            <>
              {(usuarioLogado?.nome === "Itallo Antônio Ferreira" && usuarioLogado?.telefone && usuarioLogado.telefone.replace(/\D/g, "") === "31983886065") && (
                <>
                  <button
                    type="button"
                    onClick={iniciarContagemRegressiva}
                    disabled={numerosEscolhidos.length === 0}
                    className="px-6 py-3 bg-gradient-to-r from-brasil-blue to-brasil-yellow text-black font-semibold rounded-lg shadow-lg hover:from-brasil-yellow hover:to-brasil-blue hover:text-white transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-brasil-yellow focus:ring-opacity-50"
                  >
                    Sortear Número
                  </button>
                  <button
                    type="button"
                    onClick={() => setBloqueado(!bloqueado)}
                    className="ml-4 px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold rounded-lg shadow-lg hover:from-red-800 hover:to-red-600 transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-600 focus:ring-opacity-50"
                    aria-label={bloqueado ? "Desbloquear Seleção" : "Bloquear Seleção"}
                  >
                    {bloqueado ? "Desbloquear Seleção" : "Bloquear Seleção"}
                  </button>
                  {bloqueado && (
                    <p className="text-red-600 font-semibold mt-2">
                      A seleção de números está bloqueada pelo administrador.
                    </p>
                  )}
                </>
              )}
              {!podeSortear && bloqueado && (
                <p className="text-red-600 font-semibold mt-2">
                  A seleção de números está bloqueada pelo administrador.
                </p>
              )}
            </>
          )}
        </div>

        {ganhador && (
          <div className="relative max-w-md mx-auto mb-6">
            <Fireworks position="left" />
            <Fireworks position="right" />
            <Card
              key={ganhador.numero}
              className="border-brasil-yellow shadow-lg animate-fadeInScale"
            >
              <CardHeader className="bg-brasil-yellow/20 rounded-t-lg">
                <CardTitle className="text-2xl text-brasil-blue flex items-center gap-2">
                  <Trophy size={24} />
                  Ganhador do Sorteio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Número:</strong> {ganhador.numero}</p>
                <p><strong>Nome:</strong> {ganhador.nome}</p>
                <p><strong>Telefone:</strong> {maskLastFourDigits(ganhador.telefone)}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="numeros" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="numeros" className="text-base">
                Escolha seu Número
              </TabsTrigger>
              <TabsTrigger value="ultimos" className="text-base">
                Últimas Reservas
              </TabsTrigger>
            </TabsList>
            <TabsContent value="numeros">
              <Card className="border-brasil-blue/20 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-brasil-blue/10 to-white pb-2 rounded-t-lg">
                  <CardTitle className="text-2xl text-brasil-blue flex items-center gap-2">
                    <Trophy size={24} />
                    Escolha seu número da sorte
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {jaFezCadastro
                      ? "Você já escolheu um número para este sorteio"
                      : numeroSelecionado
                      ? `Você selecionou o número ${numeroSelecionado}`
                      : "Clique em um número disponível abaixo"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <GradeNumeros onNumeroSelecionado={handleNumeroSelecionado} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="ultimos">
              <Card className="border-brasil-blue/20 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-brasil-blue/10 to-white pb-2 rounded-t-lg">
                  <CardTitle className="text-2xl text-brasil-blue flex items-center gap-2">
                    <Users size={24} />
                    Últimas Reservas
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {participantes.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full table-auto">
                        <thead>
                          <tr className="bg-muted">
                            <th className="p-2 text-left rounded-l-md">Número</th>
                            <th className="p-2 text-left">Nome</th>
                            <th className="p-2 text-left rounded-r-md">Telefone</th>
                          </tr>
                        </thead>
                        <tbody>
                          {participantes
                            .slice(-10)
                            .reverse()
                            .map((p) => (
                                <tr
                                  key={p.numero}
                                  className="border-b hover:bg-muted/50 transition-colors"
                                >
                                  <td className="p-2">
                                    <Badge className="bg-brasil-blue">{p.numero}</Badge>
                                  </td>
                                  <td className="p-2 font-medium">{p.nome}</td>
                                  <td className="p-2">{maskLastFourDigits(p.telefone)}</td>
                                </tr>
                              ))}

                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      <p className="text-xl">Nenhuma reserva realizada ainda.</p>
                      <p className="mt-2">Seja o primeiro a escolher seu número da sorte!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6" ref={formRef}>
          <FormularioCadastro numeroSelecionado={numeroSelecionado} />
          <Card className="border-brasil-blue/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-brasil-blue/10 to-white pb-2 rounded-t-lg">
              <CardTitle className="text-xl text-brasil-blue">Legenda</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center mb-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-md number-available mr-3 flex items-center justify-center">
                  {1000 - numerosEscolhidos.length}
                </div>
                <span className="text-gray-600">Número disponível</span>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center p-2 rounded-md hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-md number-selected mr-3 flex items-center justify-center">
                  {numerosEscolhidos.length}
                </div>
                <span className="text-gray-600">Número já reservado</span>
              </div>
            </CardContent>
          </Card>

          {/* Banner clicável abaixo da legenda */}
          <a
            href="https://zksorteios.com.br/campanha/r-usd-10-000-00-reias-no-pix-2"
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-6 rounded-lg overflow-hidden shadow-lg cursor-pointer relative hover:brightness-110 transition max-w-md mx-auto animate-pulse"
            style={{ aspectRatio: '16 / 9' }}
          >
            <img
              src="/WhatsApp Image 2025-04-29 at 12.49.29.ico"
              alt="Banner campanha"
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center text-brasil-yellow font-semibold text-sm bg-black bg-opacity-20 rounded-lg px-4 select-none pointer-events-none">
              Clique aqui
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sorteio;
