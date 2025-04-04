import { useState, useEffect } from 'react';
import { useColorContext } from '../../context/ColorContext';
import { convertColor } from '../../utils/colorUtils';

const RelatedColors = () => {
  const { primaryColor, relatedColors, setPrimaryColor, toggleFavorite, favorites, format } = useColorContext();
  const [activeTab, setActiveTab] = useState('complementary');
  const [hoveredColor, setHoveredColor] = useState(null);
  const [localRelatedColors, setLocalRelatedColors] = useState({
    complementary: '#000000',
    analogous: ['#000000', '#000000'],
    triadic: ['#000000', '#000000']
  });
  
  // Actualizar colores relacionados cuando cambian en el contexto
  useEffect(() => {
    if (relatedColors && relatedColors.analogous && relatedColors.triadic) {
      setLocalRelatedColors(relatedColors);
    }
  }, [relatedColors]);
  
  const isColorInFavorites = (color) => {
    return favorites.includes(color);
  };
  
  const handleColorClick = (color) => {
    setPrimaryColor(color);
  };
  
  const handleToggleFavorite = (e, color) => {
    e.stopPropagation();
    toggleFavorite(color);
  };
  
  const colorSets = {
    complementary: [
      { label: 'Principal', color: primaryColor },
      { label: 'Complementario', color: localRelatedColors.complementary }
    ],
    analogous: [
      { label: 'Principal', color: primaryColor },
      { label: 'Análogo 1', color: localRelatedColors.analogous[0] },
      { label: 'Análogo 2', color: localRelatedColors.analogous[1] }
    ],
    triadic: [
      { label: 'Principal', color: primaryColor },
      { label: 'Triádico 1', color: localRelatedColors.triadic[0] },
      { label: 'Triádico 2', color: localRelatedColors.triadic[1] }
    ]
  };
  
  const tabs = [
    { id: 'complementary', label: 'Complementario' },
    { id: 'analogous', label: 'Análogos' },
    { id: 'triadic', label: 'Triádicos' }
  ];
  
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Colores Relacionados</h2>
      
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-4 overflow-x-auto pb-2 hide-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? `border-primary-600 text-primary-600` 
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="space-y-6">
        {/* Visualización de colores */}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {colorSets[activeTab].map((item, index) => (
              <div 
                key={`${activeTab}-${index}`}
                className="relative group"
                onMouseEnter={() => setHoveredColor(item.color)}
                onMouseLeave={() => setHoveredColor(null)}
              >
                <div 
                  className="w-20 h-20 rounded-md shadow-sm cursor-pointer transition-transform hover:scale-105 hover:shadow-md"
                  style={{ backgroundColor: item.color }}
                  onClick={() => handleColorClick(item.color)}
                >
                  <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-70 text-white text-xs p-1 rounded-b-md text-center">
                    {item.label}
                  </div>
                </div>
                
                <button
                  className={`absolute top-1 right-1 p-1 rounded-full bg-white bg-opacity-80 ${
                    isColorInFavorites(item.color) 
                      ? 'text-red-500' 
                      : 'text-gray-400 hover:text-red-500'
                  } opacity-0 group-hover:opacity-100 transition-opacity`}
                  onClick={(e) => handleToggleFavorite(e, item.color)}
                  title={isColorInFavorites(item.color) ? "Quitar de favoritos" : "Añadir a favoritos"}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d={isColorInFavorites(item.color) 
                        ? "M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
                        : "M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      } 
                      clipRule="evenodd" 
                      strokeWidth={isColorInFavorites(item.color) ? 0 : 1}
                      stroke="currentColor"
                      fill={isColorInFavorites(item.color) ? "currentColor" : "none"}
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Ejemplos de uso */}
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 className="text-md font-medium mb-3">Ejemplo de Combinación</h3>
          
          {activeTab === 'complementary' && (
            <div className="space-y-3">
              <div className="p-3 rounded-md" style={{ backgroundColor: colorSets.complementary[0].color }}>
                <h4 className="text-lg font-medium" style={{ color: colorSets.complementary[1].color }}>
                  Encabezado con Color Complementario
                </h4>
                <p className="text-sm" style={{ color: 'white' }}>
                  Este es un ejemplo de cómo usar colores complementarios para crear contraste entre el encabezado y el fondo.
                </p>
                <button 
                  className="mt-2 px-3 py-1 rounded-md text-sm"
                  style={{ 
                    backgroundColor: colorSets.complementary[1].color,
                    color: colorSets.complementary[0].color
                  }}
                >
                  Botón de Acción
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'analogous' && (
            <div className="space-y-3">
              <div className="p-3 rounded-md" style={{ backgroundColor: colorSets.analogous[0].color }}>
                <div className="flex space-x-3">
                  <div className="p-2 rounded-md" style={{ backgroundColor: colorSets.analogous[1].color }}>
                    <p className="text-sm" style={{ color: 'white' }}>Panel 1</p>
                  </div>
                  <div className="p-2 rounded-md" style={{ backgroundColor: colorSets.analogous[2].color }}>
                    <p className="text-sm" style={{ color: 'white' }}>Panel 2</p>
                  </div>
                </div>
                <p className="mt-2 text-sm" style={{ color: 'white' }}>
                  Los colores análogos crean una sensación de armonía y son ideales para crear esquemas de color cohesivos.
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'triadic' && (
            <div className="space-y-3">
              <div className="p-3 rounded-md" style={{ backgroundColor: 'white' }}>
                <div className="flex space-x-2 mb-2">
                  <div className="h-4 w-1/3" style={{ backgroundColor: colorSets.triadic[0].color }}></div>
                  <div className="h-4 w-1/3" style={{ backgroundColor: colorSets.triadic[1].color }}></div>
                  <div className="h-4 w-1/3" style={{ backgroundColor: colorSets.triadic[2].color }}></div>
                </div>
                <p className="text-sm text-gray-700">
                  Los colores triádicos ofrecen un alto contraste visual manteniendo la armonía. Son excelentes para diseños vibrantes.
                </p>
                <div className="flex justify-between mt-2">
                  {colorSets.triadic.map((item, index) => (
                    <button 
                      key={`triadic-button-${index}`}
                      className="px-2 py-1 rounded-md text-xs text-white"
                      style={{ backgroundColor: item.color }}
                    >
                      Botón {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Información del color seleccionado */}
        {hoveredColor && (
          <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-md"
                style={{ backgroundColor: hoveredColor }}
              ></div>
              <div>
                <p className="text-sm font-medium">{convertColor(hoveredColor, format)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{convertColor(hoveredColor, 'rgb')}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>Haz clic en un color para seleccionarlo como color principal</p>
      </div>
    </div>
  );
};

export default RelatedColors;
