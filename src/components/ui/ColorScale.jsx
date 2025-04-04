import { useState, useEffect, useRef } from 'react';
import { useColorContext } from '../../context/ColorContext';
import { convertColor, evaluateAccessibility } from '../../utils/colorUtils';
import { ClipboardDocumentIcon, CheckIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';

const ColorScale = () => {
  const { colorScale, format, favorites, toggleFavorite, setPrimaryColor } = useColorContext();
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const [selectedColor, setSelectedColor] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [hoverInfo, setHoverInfo] = useState({ show: false, color: null, x: 0, y: 0 });
  const [draggedColor, setDraggedColor] = useState(null);
  const scaleContainerRef = useRef(null);

  const handleColorClick = (color) => {
    setPrimaryColor(color);
    toast.success('Color principal actualizado', {
      icon: '🎨',
      className: 'retro-toast'
    });
  };

  const handleCopyClick = (color, index, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(convertColor(color, format));
    setCopiedIndex(index);
    
    toast.success('Color copiado al portapapeles', {
      icon: '📋',
      className: 'retro-toast'
    });
    
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleFavoriteClick = (color, e) => {
    e.stopPropagation();
    toggleFavorite(color);
    
    const message = isColorInFavorites(color) 
      ? 'Color eliminado de favoritos' 
      : 'Color añadido a favoritos';
    
    toast.info(message, {
      icon: isColorInFavorites(color) ? '💔' : '❤️',
      className: 'retro-toast'
    });
  };

  const isColorInFavorites = (color) => {
    return favorites.includes(color);
  };

  // Obtener contraste con blanco y negro para determinar el color del texto
  const getTextColor = (bgColor) => {
    const whiteContrast = evaluateAccessibility('white', bgColor).contrast;
    const blackContrast = evaluateAccessibility('black', bgColor).contrast;
    return whiteContrast > blackContrast ? 'white' : 'black';
  };
  
  // Manejar eventos de mouse para mostrar información detallada
  const handleMouseEnter = (color, e) => {
    if (!scaleContainerRef.current) return;
    
    const rect = scaleContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setHoverInfo({
      show: true,
      color,
      x,
      y
    });
  };
  
  const handleMouseLeave = () => {
    setHoverInfo({ show: false, color: null, x: 0, y: 0 });
  };
  
  const handleMouseMove = (e) => {
    if (hoverInfo.show && scaleContainerRef.current) {
      const rect = scaleContainerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setHoverInfo({
        ...hoverInfo,
        x,
        y
      });
    }
  };
  
  // Funciones para drag and drop
  const handleDragStart = (color, e) => {
    setDraggedColor(color);
    e.dataTransfer.setData('text/plain', color);
    // Crear una imagen fantasma personalizada
    const ghostElement = document.createElement('div');
    ghostElement.style.width = '50px';
    ghostElement.style.height = '50px';
    ghostElement.style.backgroundColor = color;
    ghostElement.style.border = '2px solid black';
    ghostElement.style.borderRadius = '4px';
    ghostElement.style.position = 'absolute';
    ghostElement.style.top = '-1000px';
    document.body.appendChild(ghostElement);
    e.dataTransfer.setDragImage(ghostElement, 25, 25);
    setTimeout(() => {
      document.body.removeChild(ghostElement);
    }, 0);
  };
  
  const handleDragEnd = () => {
    setDraggedColor(null);
  };

  // Efecto para añadir atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Solo si no está en un input o textarea
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        // Números del 1 al 9 para seleccionar tonos de la escala
        const num = parseInt(e.key);
        if (!isNaN(num) && num >= 1 && num <= 9) {
          const index = num - 1;
          if (index < colorScale.length) {
            handleColorClick(colorScale[index]);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [colorScale]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-lg font-bold" style={{ fontFamily: 'var(--font-pixel)' }}>
          ESCALA DE COLORES
        </div>
        <div className="text-xs font-mono bg-gray-100 px-2 py-1 border-2 border-black">
          Atajos: [1-9] Seleccionar tono
        </div>
      </div>
      
      {/* Escala de colores con estilo retro */}
      <div className="mb-6 relative" ref={scaleContainerRef}>
        <div className="flex mb-2 border-4 border-black overflow-hidden">
          {colorScale.map((color, index) => {
            if (index < steps.length) {
              const textColor = getTextColor(color);
              return (
                <div 
                  key={`color-${index}`} 
                  className="flex-1 relative group"
                  onMouseEnter={(e) => handleMouseEnter(color, e)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                  draggable
                  onDragStart={(e) => handleDragStart(color, e)}
                  onDragEnd={handleDragEnd}
                >
                  <div
                    className="h-20 flex items-center justify-center cursor-pointer hover:transform hover:scale-105 transition-all duration-200 relative"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorClick(color)}
                  >
                    <div 
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-center absolute inset-0 flex flex-col items-center justify-center"
                      style={{ 
                        color: textColor,
                        backgroundColor: `${color}CC`
                      }}
                    >
                      <div className="font-bold text-sm" style={{ fontFamily: 'var(--font-pixel)' }}>{steps[index]}</div>
                      <div className="text-xs font-mono mt-1">{convertColor(color, 'hex')}</div>
                    </div>
                  </div>
                  
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                    <button
                      onClick={(e) => handleFavoriteClick(color, e)}
                      className="p-1 rounded-full bg-white border-2 border-black hover:bg-gray-100 transition-all"
                      style={{ color: isColorInFavorites(color) ? '#ef4444' : '#6b7280' }}
                      title={isColorInFavorites(color) ? "Quitar de favoritos" : "Añadir a favoritos"}
                    >
                      {isColorInFavorites(color) ? (
                        <HeartIconSolid className="w-4 h-4" />
                      ) : (
                        <HeartIcon className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={(e) => handleCopyClick(color, index, e)}
                      className="p-1 rounded-full bg-white border-2 border-black hover:bg-gray-100 transition-all text-gray-600"
                      title="Copiar valor"
                    >
                      {copiedIndex === index ? (
                        <CheckIcon className="w-4 h-4" />
                      ) : (
                        <ClipboardDocumentIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  
                  {/* Número de atajo de teclado */}
                  {index < 9 && (
                    <div className="absolute bottom-1 left-1 text-xs font-bold bg-black bg-opacity-50 text-white px-1 rounded">
                      {index + 1}
                    </div>
                  )}
                </div>
              );
            }
            return null;
          })}
        </div>
        
        <div className="flex justify-between text-xs font-bold px-1 mt-2" style={{ fontFamily: 'var(--font-pixel)' }}>
          <span className="bg-gray-100 px-2 py-1 border-2 border-black">MÁS CLARO</span>
          <span className="bg-gray-100 px-2 py-1 border-2 border-black">MÁS OSCURO</span>
        </div>
        
        {/* Información detallada del color al hacer hover */}
        {hoverInfo.show && (
          <div 
            className="absolute z-10 p-3 border-4 border-black bg-white shadow-lg button-3d"
            style={{ 
              left: `${Math.min(Math.max(0, hoverInfo.x - 100), scaleContainerRef.current?.clientWidth - 200 || 0)}px`, 
              top: `${hoverInfo.y + 20}px`,
              width: '200px'
            }}
          >
            <div className="flex items-center mb-2">
              <div 
                className="w-10 h-10 border-2 border-black mr-2"
                style={{ backgroundColor: hoverInfo.color }}
              ></div>
              <div className="font-bold text-sm" style={{ fontFamily: 'var(--font-pixel)' }}>
                {convertColor(hoverInfo.color, format)}
              </div>
            </div>
            
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="font-bold">HEX:</span>
                <span className="font-mono">{convertColor(hoverInfo.color, 'hex')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">RGB:</span>
                <span className="font-mono">{convertColor(hoverInfo.color, 'rgb')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">HSL:</span>
                <span className="font-mono">{convertColor(hoverInfo.color, 'hsl')}</span>
              </div>
              
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="flex justify-between">
                  <span>Contraste (blanco):</span>
                  <span>{evaluateAccessibility('white', hoverInfo.color).contrast.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Contraste (negro):</span>
                  <span>{evaluateAccessibility('black', hoverInfo.color).contrast.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Instrucciones de arrastrar y soltar */}
      <div className="text-sm text-center mt-4 p-3 border-2 border-black bg-gray-100 button-3d">
        <p style={{ fontFamily: 'var(--font-retro)' }}>
          <span className="font-bold">PRO TIP:</span> Puedes arrastrar cualquier color de la escala y soltarlo en el selector de color principal
        </p>
      </div>
    </div>
  );
};

export default ColorScale;
