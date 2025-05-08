import { ArrowRight, Check, Lock, Phone, User } from "lucide-react";
import { useState } from "react";
import { useSorteio } from "../context/SorteioContext";
import { useToast } from "../hooks/use-toast";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const FormularioCadastro = ({ numeroSelecionado }: { numeroSelecionado: number | null }) => {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const { addParticipante, isNumeroDisponivel, jaFezCadastro } = useSorteio();
  const { toast } = useToast();

  const usuarioEspecialNome = "Itallo Antônio Ferreira";
  const usuarioEspecialWhatsApp = "31983886065";

  const isAdmin =
    nome === usuarioEspecialNome && telefone.replace(/\D/g, "") === usuarioEspecialWhatsApp;

  const formatarTelefone = (valor: string) => {
    const apenasDigitos = valor.replace(/\D/g, "");
    const limitado = apenasDigitos.slice(0, 11);

    if (limitado.length <= 2) {
      return limitado;
    }
    if (limitado.length <= 7) {
      return `(${limitado.slice(0, 2)}) ${limitado.slice(2)}`;
    }
    return `(${limitado.slice(0, 2)}) ${limitado.slice(2, 7)}-${limitado.slice(7)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (jaFezCadastro) {
      toast({
        title: "Cadastro já realizado",
        description: "Você já reservou um número neste sorteio.",
        variant: "destructive",
      });
      return;
    }

    if (!numeroSelecionado && !isAdmin) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um número primeiro.",
        variant: "destructive",
      });
      return;
    }

    if (!isAdmin && !isNumeroDisponivel(numeroSelecionado ?? -1)) {
      toast({
        title: "Número indisponível",
        description: "Este número já foi escolhido. Por favor, selecione outro.",
        variant: "destructive",
      });
      return;
    }

    if (!nome || !telefone || telefone.replace(/\D/g, "").length < 10) {
      toast({
        title: "Dados incompletos",
        description: "Preencha seu nome completo e telefone corretamente.",
        variant: "destructive",
      });
      return;
    }

    addParticipante({
      nome,
      telefone,
      numero: isAdmin ? 0 : numeroSelecionado ?? 0,
    });

    try {
      localStorage.setItem("telefoneUsuarioAtual", telefone);
      localStorage.setItem("nomeUsuarioAtual", nome);
    } catch (error) {
      console.warn("Não foi possível salvar telefone ou nome no localStorage");
    }

    setNome("");
    setTelefone("");

    toast({
      title: "Cadastro realizado!",
      description: isAdmin
        ? "Cadastro de administrador realizado com sucesso."
        : `Seu número ${numeroSelecionado} foi reservado com sucesso.`,
      variant: "default",
    });
  };

  return (
    <Card
      className={`w-full border-brasil-blue/20 shadow-lg transition-all hover:shadow-xl ${
        (!numeroSelecionado && !isAdmin) || jaFezCadastro ? "opacity-80" : ""
      }`}
    >
      <CardHeader className="bg-gradient-to-r from-brasil-blue/10 to-white pb-2 rounded-t-lg">
        <CardTitle className="text-xl text-brasil-blue text-center">
          {jaFezCadastro
            ? "Você já escolheu um número"
            : numeroSelecionado || isAdmin
            ? `Reservar número ${numeroSelecionado ?? "Admin"}`
            : "Selecione um número primeiro"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {jaFezCadastro ? (
          <div className="text-center p-6">
            <div className="mb-4 flex justify-center">
              <div className="bg-brasil-blue/10 p-4 rounded-full">
                <Lock size={40} className="text-brasil-blue" />
              </div>
            </div>
            <p className="text-lg font-medium mb-2">Cadastro já realizado</p>
            <p className="text-gray-500 text-sm mb-4">
              Cada participante pode escolher apenas um número para o sorteio.
            </p>
            <Button className="bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-not-allowed" disabled>
              <Check className="mr-2" size={16} /> Número reservado
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="flex items-center gap-2">
                <User size={16} />
                Nome completo
              </Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite seu nome completo"
                required
                disabled={(!numeroSelecionado && !isAdmin) || jaFezCadastro}
                className="border-brasil-blue/30 focus:border-brasil-blue focus-visible:ring-brasil-blue/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone" className="flex items-center gap-2">
                <Phone size={16} />
                WhatsApp
              </Label>
              <Input
                id="telefone"
                value={telefone}
                onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                placeholder="(XX) XXXXX-XXXX"
                required
                disabled={(!numeroSelecionado && !isAdmin) || jaFezCadastro}
                className="border-brasil-blue/30 focus:border-brasil-blue focus-visible:ring-brasil-blue/20"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-brasil-blue hover:bg-brasil-blue/90 transition-all"
              disabled={(!numeroSelecionado && !isAdmin) || jaFezCadastro}
            >
              {numeroSelecionado || isAdmin ? (
                <>
                  Confirmar Reserva <ArrowRight className="ml-2" size={16} />
                </>
              ) : (
                "Selecione um número"
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default FormularioCadastro;
