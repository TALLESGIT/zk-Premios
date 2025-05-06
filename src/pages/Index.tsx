
import Sorteio from "@/components/Sorteio";
import { Toaster } from "@/components/ui/toaster";
import { SorteioProvider } from "@/context/SorteioContext";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <div className="absolute top-0 left-0 w-full h-16 bg-brasil-blue/10 z-0" />
      <SorteioProvider>
        <Sorteio />
        <footer className="container py-6 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} ZK Premios - Todos os direitos reservados</p>
        </footer>
      </SorteioProvider>
      <Toaster />
    </div>
  );
};

export default Index;
