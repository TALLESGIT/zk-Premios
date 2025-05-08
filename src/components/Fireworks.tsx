import type React from "react";
import "./fireworks.css";

interface FireworksProps {
  position?: "left" | "right";
}

const Fireworks: React.FC<FireworksProps> = ({ position = "left" }) => {
  return (
    <div className={`fireworks-container ${position}`} aria-hidden="true">
      {[...Array(10)].map((_, i) => (
        <span key={`${position}-${// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
i}`} className={`firework firework-${i + 1}`} />
      ))}
    </div>
  );
};

export default Fireworks;
