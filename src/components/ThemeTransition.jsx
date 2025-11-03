import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from '@/context/ThemeContext';

const ThemeTransition = () => {
  const { theme } = useContext(ThemeContext);
  const [isAnimating, setIsAnimating] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const toggleButton = document.getElementById('theme-toggle-button');
    if (!toggleButton) return;

    const handleClick = (e) => {
      const rect = toggleButton.getBoundingClientRect();
      setClickPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
      setIsAnimating(true);
    };

    toggleButton.addEventListener('click', handleClick);
    return () => toggleButton.removeEventListener('click', handleClick);
  }, []);

  const radius = Math.hypot(window.innerWidth, window.innerHeight);

  const transitionVariants = {
    initial: {
      clipPath: `circle(0px at ${clickPosition.x}px ${clickPosition.y}px)`,
    },
    animate: {
      clipPath: `circle(${radius * 1.5}px at ${clickPosition.x}px ${clickPosition.y}px)`,
      transition: { duration: 1.2, ease: 'circOut' },
    },
  };

  if (!isAnimating) return null;

  return (
    <motion.div
      key={theme}
      variants={transitionVariants}
      initial="initial"
      animate="animate"
      onAnimationComplete={() => setIsAnimating(false)}
      className={`fixed inset-0 z-50 pointer-events-none ${theme === 'dark' ? 'bg-background' : 'bg-background'}`}
    />
  );
};

export default ThemeTransition;