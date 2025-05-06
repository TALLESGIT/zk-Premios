import { ArrowRight, Trophy, Users } from "lucide-react";
import React, { useState, useRef } from "react";
import { useSorteio } from "../context/SorteioContext";
import { useIsMobile } from "../hooks/use-mobile";
import FormularioCadastro from "./FormularioCadastro";
import GradeNumeros from "./GradeNumeros";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const Sorteio = () => {
  const [numeroSelecionado, setNumeroSelecionado] = useState<number | null>(null);
  const { numerosEscolhidos, participantes, jaFezCadastro } = useSorteio();
  const formRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Calculate progress percentage
  const progressValue = (numerosEscolhidos.length / 1000) * 100;

  const handleNumeroSelecionado = (numero: number) => {
    if (!jaFezCadastro) {
      setNumeroSelecionado(numero);

      // Scroll to form on mobile when a number is selected
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
                            .map((p, idx) => (
                              <tr
                                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                key={idx}
                                className={`border-b hover:bg-muted/50 transition-colors ${
                                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }`}
                              >
                                <td className="p-2">
                                  <Badge className="bg-brasil-blue">{p.numero}</Badge>
                                </td>
                                <td className="p-2 font-medium">{p.nome}</td>
                                <td className="p-2">{p.telefone}</td>
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
        </div>
      </div>
    </div>
  );
};

export default Sorteio;
