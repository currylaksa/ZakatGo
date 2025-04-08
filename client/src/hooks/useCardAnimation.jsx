import { useState, useEffect } from "react";

export const useCardAnimation = (ref, threshold = 150, maxRotation = 20) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ref.current) return;

      const card = ref.current;
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      const distX = e.clientX - cardCenterX;
      const distY = e.clientY - cardCenterY;

      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < threshold) {
        const rotateY = (distX / rect.width) * maxRotation;
        const rotateX = -(distY / rect.height) * maxRotation;
        setRotation({ x: rotateX, y: rotateY });
      } else {
        setRotation({ x: 0, y: 0 });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [ref, threshold, maxRotation]);

  return rotation;
};
