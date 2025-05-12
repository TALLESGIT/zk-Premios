import { Phone } from "lucide-react";
import { useEffect, useState } from "react";

const messages = [
  "Clique aqui, e participe do nosaa lista de transmição!"
];

const WhatsAppButton = () => {
  const [showMessage, setShowMessage] = useState(true);
  const whatsappLink = "https://wa.me/553172393341"; // Placeholder link

  useEffect(() => {
    const interval = setInterval(() => {
      setShowMessage((prev) => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-2 flex flex-col items-center cursor-pointer z-50 sm:right-1">
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 p-3 rounded-full shadow-lg flex items-center justify-center animate-pulse"
        aria-label="Entrar na lista de transmissão do WhatsApp"
      >
        <Phone size={24} className="text-white animate-pulse" />
      </a>
      <span
        className={`mt-1 text-xs text-center max-w-xs text-green-400 font-semibold select-none transition-opacity duration-1000 ease-in-out ${
          showMessage ? "opacity-100" : "opacity-0"
        } hidden sm:block`}
      >
        Clique aqui, e participe do nosaa lista de transmição!
      </span>
    </div>

  );
};

export default WhatsAppButton;
