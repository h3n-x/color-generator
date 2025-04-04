import { useState, useEffect, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useColorContext } from '../../context/ColorContext';
import { isValidHex, convertColor, isValidColor } from '../../utils/colorUtils';
import { toast } from 'react-toastify';
import chroma from 'chroma-js';

const ColorPicker = () => {
  const { primaryColor, setPrimaryColor, history, format, toggleFavorite, favorites } = useColorContext();
  const [inputValue, setInputValue] = useState(primaryColor);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [recentColors, setRecentColors] = useState([]);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const pickerRef = useRef(null);
  
  // Actualizar el valor del input cuando cambia el color primario o el formato
  useEffect(() => {
    try {
      setInputValue(format === 'hex' ? primaryColor : convertColor(primaryColor, format));
    } catch (error) {
      console.error('Error al convertir color:', error);
      setInputValue(primaryColor);
    }
  }, [primaryColor, format]);
  
  // Actualizar colores recientes cuando cambia el historial
  useEffect(() => {
    if (history && history.length > 0) {
      // Limitar a exactamente 3 colores recientes
      const recentColorsList = history.slice(0, 3).map(item => item.color);
      setRecentColors(recentColorsList);
    }
  }, [history]);
  
  // Efecto de glitch aleatorio
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 150);
    }, 10000);
    
    return () => clearInterval(glitchInterval);
  }, []);
  
  // Cerrar el picker al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsPickerOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Manejar teclas para acciones rápidas
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Solo si no está en un input o textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      if (e.key === 'r' || e.key === 'R') {
        generateRandomColor();
      } else if (e.key === 'p' || e.key === 'P') {
        // Si está abierto, cerrarlo
        if (isPickerOpen) {
          handlePickerClose();
        } else {
          // Si está cerrado, abrirlo
          setIsPickerOpen(true);
        }
      } else if (e.key === 'c' || e.key === 'C') {
        copyColorToClipboard();
      } else if (e.key === 's' || e.key === 'S') {
        saveToFavorites();
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isPickerOpen, primaryColor]);
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    try {
      // Intentar convertir el valor a un color válido
      const color = chroma(value);
      setPrimaryColor(color.hex());
    } catch (error) {
      // No hacer nada si el formato no es válido
    }
  };
  
  const handlePickerChange = (color) => {
    setPrimaryColor(color);
    try {
      setInputValue(format === 'hex' ? color : convertColor(color, format));
    } catch (error) {
      console.error('Error al convertir color:', error);
      setInputValue(color);
    }
  };
  
  // Memoizar las funciones para evitar recreaciones en cada renderizado
  const handlePickerClose = () => {
    try {
      // Intentar convertir el valor actual a un color válido
      const hexColor = chroma(inputValue).hex();
      setPrimaryColor(hexColor);
      setInputValue(format === 'hex' ? hexColor : convertColor(hexColor, format));
    } catch (error) {
      // Si no es un color válido, restaurar al color primario actual
      try {
        setInputValue(format === 'hex' ? primaryColor : convertColor(primaryColor, format));
      } catch (convError) {
        console.error('Error al convertir color:', convError);
        setInputValue(primaryColor);
      }
    }
    setIsPickerOpen(false);
  };
  
  // Generar un color aleatorio pastel
  const generateRandomColor = () => {
    // Función para generar colores pastel
    const generatePastelColor = () => {
      // Generar valores RGB altos (más claros) para crear colores pastel
      const r = Math.floor(Math.random() * 55) + 200; // 200-255
      const g = Math.floor(Math.random() * 55) + 200; // 200-255
      const b = Math.floor(Math.random() * 55) + 200; // 200-255
      
      // Convertir a hexadecimal
      return '#' + 
        r.toString(16).padStart(2, '0') + 
        g.toString(16).padStart(2, '0') + 
        b.toString(16).padStart(2, '0');
    };
    
    const newColor = generatePastelColor();
    setPrimaryColor(newColor);
    try {
      setInputValue(format === 'hex' ? newColor : convertColor(newColor, format));
    } catch (error) {
      console.error('Error al convertir color:', error);
      setInputValue(newColor);
    }
    
    toast.success('¡Color aleatorio generado!', {
      icon: '🎲',
      className: 'retro-toast'
    });
  };
  
  const copyColorToClipboard = () => {
    try {
      const colorToCopy = format === 'hex' ? primaryColor : convertColor(primaryColor, format);
      navigator.clipboard.writeText(colorToCopy);
      
      toast.success(`¡Color copiado al portapapeles! (${format.toUpperCase()})`, {
        icon: '📋',
        className: 'retro-toast'
      });
    } catch (error) {
      console.error('Error al copiar color:', error);
      navigator.clipboard.writeText(primaryColor);
      
      toast.success('¡Color copiado al portapapeles!', {
        icon: '📋',
        className: 'retro-toast'
      });
    }
  };
  
  const saveToFavorites = () => {
    toggleFavorite(primaryColor);
    toast.success('¡Color agregado a favoritos!', {
      icon: '❤️',
      className: 'retro-toast'
    });
  };
  
  const handleRecentColorClick = (color) => {
    setPrimaryColor(color);
    try {
      setInputValue(format === 'hex' ? color : convertColor(color, format));
    } catch (error) {
      console.error('Error al convertir color:', error);
      setInputValue(color);
    }
  };
  
  const checkValidColor = () => {
    return isValidColor(inputValue);
  };
  
  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="color-picker">
          <div className="mb-4">
            <div 
              className="color-preview"
              style={{ backgroundColor: primaryColor }}
            ></div>
            
            <div className="mb-2 pixel-text">HEX: {primaryColor}</div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={copyColorToClipboard}
                className="retro-button primary"
              >
                COPIAR
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="mb-2 pixel-text">VALOR DEL COLOR:</div>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handlePickerClose}
              className={`retro-input w-full ${checkValidColor() ? '' : 'border-red-500'}`}
            />
          </div>
          
          {isPickerOpen && (
            <div ref={pickerRef} className="mb-4">
              <HexColorPicker color={primaryColor} onChange={handlePickerChange} />
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsPickerOpen(!isPickerOpen)}
              className="retro-button secondary"
            >
              {isPickerOpen ? 'CERRAR SELECTOR' : 'ABRIR SELECTOR'}
            </button>
            
            <button 
              onClick={generateRandomColor}
              className="retro-button accent"
            >
              COLOR ALEATORIO
            </button>
          </div>
        </div>
        
        <div className="color-picker">
          <div className="mb-4">
            <div className="mb-2 pixel-text">
              COLORES RECIENTES
            </div>
            
            <div className="space-y-2">
              {/* Siempre mostrar 3 espacios para colores recientes */}
              {Array.from({ length: 3 }).map((_, index) => {
                const color = recentColors[index];
                return (
                  <div 
                    key={index}
                    className="flex items-center"
                  >
                    {color ? (
                      <div 
                        className="w-full h-8 border-2 border-black cursor-pointer"
                        style={{ backgroundColor: color }}
                        onClick={() => handleRecentColorClick(color)}
                        title={color}
                      ></div>
                    ) : (
                      <div 
                        className="w-full h-8 border-2 border-black bg-gray-100"
                        title="Sin color"
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Sección de colores favoritos */}
          <div className="mb-4">
            <div className="mb-2 pixel-text">
              COLORES FAVORITOS
            </div>
            
            <div className="space-y-2">
              {/* Siempre mostrar 3 espacios para colores favoritos */}
              {Array.from({ length: 3 }).map((_, index) => {
                const color = favorites && favorites.length > index ? favorites[index] : null;
                return (
                  <div 
                    key={index}
                    className="flex items-center"
                  >
                    {color ? (
                      <div 
                        className="w-full h-8 border-2 border-black cursor-pointer relative"
                        style={{ backgroundColor: color }}
                        onClick={() => handleRecentColorClick(color)}
                        title={color}
                      >
                        <div className="absolute top-1 right-1 text-xs">❤️</div>
                      </div>
                    ) : (
                      <div 
                        className="w-full h-8 border-2 border-black bg-gray-100"
                        title="Sin color favorito"
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-2 text-xs text-center text-gray-500">
              Presiona S para guardar en favoritos
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
