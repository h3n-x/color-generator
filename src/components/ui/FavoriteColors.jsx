import { useState, useEffect } from 'react';
import { useColorContext } from '../../context/ColorContext';
import { convertColor } from '../../utils/colorUtils';
import { toast } from 'react-toastify';

const FavoriteColors = () => {
  const { favorites = [], toggleFavorite, setPrimaryColor, format } = useColorContext();
  const [animatedIndex, setAnimatedIndex] = useState(null);
  const [displayMode, setDisplayMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [glitchEffect, setGlitchEffect] = useState(false);
  
  // Efecto de glitch aleatorio
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 150);
    }, 10000);
    
    return () => clearInterval(glitchInterval);
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFavorites(favorites || []);
    } else {
      setFilteredFavorites(
        (favorites || []).filter(color => 
          convertColor(color, format).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, favorites, format]);
  
  const handleColorSelect = (color, index) => {
    setPrimaryColor(color);
    setAnimatedIndex(index);
    setTimeout(() => setAnimatedIndex(null), 500);
    
    toast.success('Color principal actualizado', {
      icon: '',
      className: 'retro-toast'
    });
  };
  
  const handleRemoveFavorite = (e, color) => {
    e.stopPropagation();
    toggleFavorite(color);
    
    toast.info('Color eliminado de favoritos', {
      icon: '',
      className: 'retro-toast'
    });
  };
  
  const handleKeyDown = (e, color, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleColorSelect(color, index);
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      handleRemoveFavorite(e, color);
    }
  };
  
  if (!favorites || favorites.length === 0) {
    return (
      <div className="border-4 border-black bg-white p-4 button-3d">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-pixel)' }}>COLORES FAVORITOS</h2>
        </div>
        <div className="text-center py-10 space-y-3 crt-effect">
          <div className="text-6xl mb-4"></div>
          <p className="scanline" style={{ fontFamily: 'var(--font-retro)' }}>
            No tienes colores guardados como favoritos.
            <br />
            Marca colores como favoritos haciendo clic en el ícono de corazón.
          </p>
          <button 
            className="mt-4 px-4 py-2 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-colors retro-button"
            onClick={() => setPrimaryColor('#0ea5e9')}
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            PROBAR COLOR DE EJEMPLO
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`border-4 border-black bg-white p-4 button-3d ${glitchEffect ? 'glitch-effect' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-pixel)' }}>COLORES FAVORITOS</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setDisplayMode('grid')}
            className={`p-1.5 border-2 border-black ${displayMode === 'grid' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
            title="Vista de cuadrícula"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setDisplayMode('list')}
            className={`p-1.5 border-2 border-black ${displayMode === 'list' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
            title="Vista de lista"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="BUSCAR COLOR..."
            className="w-full pl-10 pr-4 py-2 border-2 border-black bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
            style={{ fontFamily: 'var(--font-retro)' }}
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {filteredFavorites.length === 0 ? (
        <p className="text-center py-6 scanline" style={{ fontFamily: 'var(--font-retro)' }}>
          No se encontraron colores que coincidan con tu búsqueda.
        </p>
      ) : displayMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredFavorites.map((color, index) => (
            <div 
              key={`favorite-${index}`}
              className={`relative group transform transition-all duration-300 ${animatedIndex === index ? 'scale-110' : ''}`}
              onClick={() => handleColorSelect(color, index)}
              onKeyDown={(e) => handleKeyDown(e, color, index)}
              tabIndex={0}
              role="button"
              aria-label={`Color ${convertColor(color, format)}`}
            >
              <div 
                className="h-16 border-2 border-black cursor-pointer pixel-corners"
                style={{ backgroundColor: color }}
                title="Usar este color"
              />
              
              <div className="absolute inset-x-0 bottom-0 bg-black text-white text-xs p-1 text-center font-mono">
                {convertColor(color, format)}
              </div>
              
              <button
                className="absolute top-1 right-1 bg-white bg-opacity-80 text-red-500 border border-black p-1 opacity-0 group-hover:opacity-100 transition-opacity retro-button"
                onClick={(e) => handleRemoveFavorite(e, color)}
                title="Eliminar de favoritos"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2 border-2 border-black">
          {filteredFavorites.map((color, index) => (
            <div 
              key={`favorite-list-${index}`}
              className={`flex items-center p-2 cursor-pointer transition-colors border-b border-black last:border-b-0 ${
                animatedIndex === index ? 'bg-gray-100' : 'hover:bg-gray-100'
              }`}
              onClick={() => handleColorSelect(color, index)}
              onKeyDown={(e) => handleKeyDown(e, color, index)}
              tabIndex={0}
              role="button"
              aria-label={`Color ${convertColor(color, format)}`}
            >
              <div 
                className="w-8 h-8 border-2 border-black mr-3 flex-shrink-0 pixel-corners"
                style={{ backgroundColor: color }}
              />
              <div className="flex-grow">
                <p className="font-bold" style={{ fontFamily: 'var(--font-mono)' }}>
                  {convertColor(color, format)}
                </p>
                <p className="text-xs" style={{ fontFamily: 'var(--font-retro)' }}>
                  {convertColor(color, 'rgb')}
                </p>
              </div>
              <button
                className="p-1 text-red-500 hover:bg-red-100 border border-black retro-button"
                onClick={(e) => handleRemoveFavorite(e, color)}
                title="Eliminar de favoritos"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 flex justify-between items-center text-sm p-2 border-2 border-black bg-gray-900 text-white crt-effect">
        <p style={{ fontFamily: 'var(--font-retro)' }}>
          {filteredFavorites.length} {filteredFavorites.length === 1 ? 'color guardado' : 'colores guardados'}
        </p>
        <button 
          className="text-red-400 hover:text-red-300 flex items-center retro-button"
          onClick={() => {
            if (window.confirm('¿Estás seguro de que deseas eliminar todos los colores favoritos?')) {
              favorites.forEach(color => toggleFavorite(color));
              toast.info('Todos los favoritos han sido eliminados', {
                icon: '',
                className: 'retro-toast'
              });
            }
          }}
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          ELIMINAR TODOS
        </button>
      </div>
      
      {/* Atajos de teclado */}
      <div className="mt-4 text-xs border-2 border-black p-2" style={{ fontFamily: 'var(--font-retro)' }}>
        <p className="font-bold mb-1" style={{ fontFamily: 'var(--font-pixel)' }}>ATAJOS DE TECLADO:</p>
        <ul className="list-disc list-inside">
          <li>Presiona <kbd className="px-1 py-0.5 border border-black bg-gray-100">Enter</kbd> o <kbd className="px-1 py-0.5 border border-black bg-gray-100">Espacio</kbd> para seleccionar un color</li>
          <li>Presiona <kbd className="px-1 py-0.5 border border-black bg-gray-100">Delete</kbd> o <kbd className="px-1 py-0.5 border border-black bg-gray-100">Backspace</kbd> para eliminar un color de favoritos</li>
        </ul>
      </div>
    </div>
  );
};

export default FavoriteColors;
