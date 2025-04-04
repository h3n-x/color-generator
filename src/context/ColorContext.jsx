import { createContext, useContext, useState, useEffect } from 'react';
import { generateColorScale, generateRelatedColors } from '../utils/colorUtils';

const ColorContext = createContext();

export const useColorContext = () => useContext(ColorContext);

export const ColorProvider = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState('#0ea5e9');
  const [colorScale, setColorScale] = useState([]);
  const [relatedColors, setRelatedColors] = useState({});
  const [format, setFormat] = useState('hex');
  const [favorites, setFavorites] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);

  // Generar escala de colores cuando cambia el color primario
  useEffect(() => {
    const scale = generateColorScale(primaryColor, 11);
    setColorScale(scale);
    
    const related = generateRelatedColors(primaryColor);
    setRelatedColors(related);
    
    // Agregar al historial
    setHistory(prev => {
      const newHistory = [{ color: primaryColor, timestamp: Date.now() }, ...prev];
      // Limitar historial a 10 elementos
      return newHistory.slice(0, 10);
    });
    
    // Actualizar variables CSS
    document.documentElement.style.setProperty('--color-primary-500', primaryColor);
    scale.forEach((color, index) => {
      const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
      if (index < steps.length) {
        document.documentElement.style.setProperty(`--color-primary-${steps[index]}`, color);
      }
    });
  }, [primaryColor]);

  // Cargar favoritos desde localStorage al iniciar
  useEffect(() => {
    const savedFavorites = localStorage.getItem('colorFavorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error al cargar favoritos:', error);
      }
    }
  }, []);

  // Guardar favoritos en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem('colorFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Alternar entre modo claro y oscuro
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Alternar un color en favoritos
  const toggleFavorite = (color) => {
    setFavorites(prev => {
      if (prev.includes(color)) {
        return prev.filter(c => c !== color);
      } else {
        // Añadir el nuevo color al principio para que sea el más reciente
        return [color, ...prev];
      }
    });
  };

  // Cambiar el formato de color
  const changeFormat = (newFormat) => {
    setFormat(newFormat);
  };

  return (
    <ColorContext.Provider
      value={{
        primaryColor,
        setPrimaryColor,
        colorScale,
        relatedColors,
        format,
        setFormat,
        favorites,
        toggleFavorite,
        darkMode,
        toggleDarkMode,
        history
      }}
    >
      {children}
    </ColorContext.Provider>
  );
};
