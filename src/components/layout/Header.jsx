import { useState, useEffect } from 'react';
import FormatSelector from '../ui/FormatSelector';
import { SwatchIcon } from '@heroicons/react/24/solid';
import { useColorContext } from '../../context/ColorContext';

// Componente para atajos de teclado
const KeyboardShortcut = ({ letter, description }) => {
  const getBackgroundColor = () => {
    switch (letter) {
      case 'R': return 'var(--pastel-pink)';
      case 'P': return 'var(--pastel-green)';
      case 'S': return 'var(--pastel-yellow)';
      default: return 'var(--pastel-blue)';
    }
  };
  
  return (
    <div className="flex items-center">
      <kbd 
        className="px-2 py-1 border-2 border-black mr-2 neon-border text-sm font-mono" 
        style={{ backgroundColor: getBackgroundColor() }}
      >
        {letter}
      </kbd>
      <span className="text-sm">{description}</span>
    </div>
  );
};

const Header = () => {
  const [glitchEffect, setGlitchEffect] = useState(false);
  
  // Efecto de glitch aleatorio
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 150);
    }, 8000);
    
    return () => clearInterval(glitchInterval);
  }, []);
  
  return (
    <header className={`header ${glitchEffect ? 'glitch-effect' : ''}`}>
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <div className="pulse">
              <SwatchIcon className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="header-title section-title text-2xl md:text-3xl font-bold retro-text">
              H3n - COLOR GENERATOR
            </h1>
          </div>
          
          <div className="flex items-center">
            <FormatSelector />
          </div>
        </div>
        
        <div className="flex justify-center space-x-4 py-2 border-t border-b border-black mt-2 mb-4">
          <KeyboardShortcut letter="R" description="Color aleatorio" />
          <KeyboardShortcut letter="P" description="Abrir/cerrar selector" />
          <KeyboardShortcut letter="S" description="Guardar color" />
        </div>
      </div>
    </header>
  );
};

export default Header;
