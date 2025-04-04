import { useState, useEffect } from 'react';
import { useColorContext } from '../context/ColorContext';
import ColorPicker from '../components/ui/ColorPicker';
import ColorInfo from '../components/ui/ColorInfo';
import UIExamples from '../components/ui/UIExamples';
import ExportColors from '../components/ui/ExportColors';

const HomePage = () => {
  const { primaryColor } = useColorContext();
  const [scrollY, setScrollY] = useState(0);
  const [glitchEffect, setGlitchEffect] = useState(false);
  
  // Seguimiento del scroll para efectos visuales
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Efecto de glitch aleatorio
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 150);
    }, 15000);
    
    return () => clearInterval(glitchInterval);
  }, []);
  
  return (
    <div className={glitchEffect ? 'glitch-effect' : ''}>
      <div className="w-full px-4 sm:px-6 pb-20">
        {/* Main content */}
        <div className="flex flex-col space-y-8 mt-8 max-w-4xl mx-auto">
          {/* 1. Selector de Color - La herramienta principal y punto de entrada */}
          <div id="color-picker" className="section-container">
            <h2 className="text-xl font-bold mb-4 retro-text">SELECTOR DE COLOR</h2>
            <ColorPicker />
          </div>
          
          {/* 2. Información del Color - Detalles técnicos importantes */}
          <div id="color-info" className="section-container">
            <h2 className="text-xl font-bold mb-4 retro-text">INFORMACIÓN DEL COLOR</h2>
            <ColorInfo />
          </div>
          
          {/* 3. Ejemplos UI - Visualización práctica del color */}
          <div id="ui-examples" className="section-container">
            <h2 className="text-xl font-bold mb-4 retro-text">EJEMPLOS UI</h2>
            <UIExamples />
          </div>
          
          {/* 4. Exportar - Útil cuando ya se ha encontrado el color deseado */}
          <div id="export" className="section-container">
            <h2 className="text-xl font-bold mb-4 retro-text">EXPORTAR COLORES</h2>
            <ExportColors />
          </div>
        </div>
        
        {/* Footer con estilo retro */}
        <footer className="mt-16 pt-8 border-t-4 border-black text-center max-w-4xl mx-auto">
          <p className="text-sm">H3n - Color Generator 2025</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
