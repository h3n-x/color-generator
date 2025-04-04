import { useState, useEffect } from 'react';
import { useColorContext } from '../../context/ColorContext';
import { convertColor, evaluateAccessibility } from '../../utils/colorUtils';
import { toast } from 'react-toastify';

const ColorInfo = () => {
  const { primaryColor, format } = useColorContext();
  const [glitchEffect, setGlitchEffect] = useState(false);
  
  // Efecto de glitch aleatorio
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 150);
    }, 8000);
    
    return () => clearInterval(glitchInterval);
  }, []);
  
  // Calcular accesibilidad
  const whiteAccessibility = evaluateAccessibility('white', primaryColor);
  const blackAccessibility = evaluateAccessibility('black', primaryColor);
  
  // Calcular puntuación SEO
  const seoScore = Math.min(
    Math.round((Math.max(whiteAccessibility.contrast, blackAccessibility.contrast) / 7) * 100),
    100
  );
  
  // Copiar al portapapeles
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('¡Copiado al portapapeles!', {
      icon: '📋',
      className: 'retro-toast'
    });
  };
  
  return (
    <div className="color-picker">
      <div className="color-picker-title mb-4">
        ACCESIBILIDAD
      </div>
      
      <div className="space-y-6">
        {/* Contrastes */}
        <div>
          <div className="mb-2 pixel-text">CONTRASTE CON TEXTO:</div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Contraste con blanco */}
            <div className="retro-card">
              <div className="flex items-center justify-between mb-2">
                <div className="pixel-text">TEXTO BLANCO</div>
                <div 
                  className={`px-2 py-1 text-xs ${
                    whiteAccessibility.wcagAA ? 'bg-green-200' : 'bg-red-200'
                  } rounded`}
                >
                  {whiteAccessibility.contrast.toFixed(2)}:1
                </div>
              </div>
              
              <div 
                className="p-3 mb-2 flex items-center justify-center" 
                style={{ backgroundColor: primaryColor }}
              >
                <span className="text-white font-bold">
                  Texto de ejemplo
                </span>
              </div>
              
              <div className="text-xs">
                <div className="flex justify-between mb-1">
                  <span>WCAG AA (Normal):</span>
                  <span className={whiteAccessibility.wcagAA ? 'text-green-600' : 'text-red-600'}>
                    {whiteAccessibility.wcagAA ? '✓ PASA' : '✗ NO PASA'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>WCAG AAA (Estricto):</span>
                  <span className={whiteAccessibility.wcagAAA ? 'text-green-600' : 'text-red-600'}>
                    {whiteAccessibility.wcagAAA ? '✓ PASA' : '✗ NO PASA'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Contraste con negro */}
            <div className="retro-card">
              <div className="flex items-center justify-between mb-2">
                <div className="pixel-text">TEXTO NEGRO</div>
                <div 
                  className={`px-2 py-1 text-xs ${
                    blackAccessibility.wcagAA ? 'bg-green-200' : 'bg-red-200'
                  } rounded`}
                >
                  {blackAccessibility.contrast.toFixed(2)}:1
                </div>
              </div>
              
              <div 
                className="p-3 mb-2 flex items-center justify-center" 
                style={{ backgroundColor: primaryColor }}
              >
                <span className="text-black font-bold">
                  Texto de ejemplo
                </span>
              </div>
              
              <div className="text-xs">
                <div className="flex justify-between mb-1">
                  <span>WCAG AA (Normal):</span>
                  <span className={blackAccessibility.wcagAA ? 'text-green-600' : 'text-red-600'}>
                    {blackAccessibility.wcagAA ? '✓ PASA' : '✗ NO PASA'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>WCAG AAA (Estricto):</span>
                  <span className={blackAccessibility.wcagAAA ? 'text-green-600' : 'text-red-600'}>
                    {blackAccessibility.wcagAAA ? '✓ PASA' : '✗ NO PASA'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Puntuación SEO */}
        <div>
          <div className="mb-2 pixel-text">PUNTUACIÓN SEO:</div>
          <div className="retro-card">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm">Legibilidad del color</div>
              <div 
                className={`px-2 py-1 text-xs ${
                  seoScore >= 70 ? 'bg-green-200' : seoScore >= 50 ? 'bg-yellow-200' : 'bg-red-200'
                } rounded`}
              >
                {seoScore}/100
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div 
                className="h-4 rounded-full" 
                style={{ 
                  width: `${seoScore}%`,
                  backgroundColor: seoScore >= 70 ? '#4ade80' : seoScore >= 50 ? '#facc15' : '#f87171'
                }}
              ></div>
            </div>
            
            <div className="text-xs">
              {seoScore >= 70 ? (
                <div className="text-green-600">✓ Excelente contraste para SEO</div>
              ) : seoScore >= 50 ? (
                <div className="text-yellow-600">⚠ Contraste aceptable para SEO</div>
              ) : (
                <div className="text-red-600">✗ Contraste pobre para SEO</div>
              )}
            </div>
          </div>
        </div>
        
        {/* Recomendaciones */}
        <div>
          <div className="mb-2 pixel-text">RECOMENDACIONES:</div>
          <div className="retro-card">
            <ul className="text-sm space-y-2">
              {!whiteAccessibility.wcagAA && !blackAccessibility.wcagAA && (
                <li>• Considera usar un color con mayor contraste para mejorar la accesibilidad.</li>
              )}
              {whiteAccessibility.contrast > blackAccessibility.contrast ? (
                <li>• Este color funciona mejor con texto blanco.</li>
              ) : (
                <li>• Este color funciona mejor con texto negro.</li>
              )}
              {seoScore < 70 && (
                <li>• Para mejorar el SEO, elige un color con mayor contraste.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorInfo;
