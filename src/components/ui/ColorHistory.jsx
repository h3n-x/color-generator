import { useState, useEffect } from 'react';
import { useColorContext } from '../../context/ColorContext';
import { convertColor } from '../../utils/colorUtils';
import { ClockIcon, TrashIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const ColorHistory = () => {
  const { history = [], clearHistory, setPrimaryColor, format, toggleFavorite, favorites = [] } = useColorContext();
  const [viewMode, setViewMode] = useState('compact');
  const [selectedColor, setSelectedColor] = useState(null);
  
  if (!history || history.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Historial</h2>
        <div className="text-gray-500 dark:text-gray-400 text-center py-10 space-y-3">
          <ClockIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
          <p>
            No hay historial de colores.
            <br />
            Los colores que selecciones aparecerán aquí.
          </p>
        </div>
      </div>
    );
  }
  
  // Formatear la fecha
  const formatDate = (timestamp) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.round(diffMs / 60000);
      
      if (diffMins < 1) return 'Ahora mismo';
      if (diffMins < 60) return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
      
      const diffHours = Math.round(diffMins / 60);
      if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
      
      return date.toLocaleDateString([], { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit', 
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha desconocida';
    }
  };
  
  const handleColorClick = (color, index) => {
    if (color) {
      setPrimaryColor(color);
      setSelectedColor(index);
      setTimeout(() => setSelectedColor(null), 500);
    }
  };
  
  const isColorInFavorites = (color) => {
    return Array.isArray(favorites) && color && favorites.includes(color);
  };
  
  const handleToggleFavorite = (e, color) => {
    if (e && color) {
      e.stopPropagation();
      toggleFavorite(color);
    }
  };
  
  // Agrupar historial por día
  const groupHistoryByDay = () => {
    try {
      const groups = {};
      
      history.forEach(item => {
        if (item && item.timestamp) {
          const date = new Date(item.timestamp);
          const dateKey = date.toLocaleDateString();
          
          if (!groups[dateKey]) {
            groups[dateKey] = [];
          }
          
          groups[dateKey].push(item);
        }
      });
      
      return Object.entries(groups).map(([date, items]) => ({
        date,
        items
      }));
    } catch (error) {
      console.error('Error al agrupar historial:', error);
      return [];
    }
  };
  
  const groupedHistory = groupHistoryByDay();
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Historial</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode(viewMode === 'compact' ? 'detailed' : 'compact')}
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
            title={viewMode === 'compact' ? 'Ver detalles' : 'Vista compacta'}
          >
            {viewMode === 'compact' ? 'Ver detalles' : 'Vista compacta'}
          </button>
          <button
            onClick={clearHistory}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center"
            title="Limpiar historial"
          >
            <TrashIcon className="w-4 h-4 mr-1" />
            <span>Limpiar</span>
          </button>
        </div>
      </div>
      
      {viewMode === 'compact' ? (
        <div className="space-y-2">
          {history.map((item, index) => (
            item && item.color ? (
              <div 
                key={`history-${index}`}
                className={`flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors ${selectedColor === index ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                onClick={() => handleColorClick(item.color, index)}
              >
                <div 
                  className="w-8 h-8 rounded-md shadow-sm transition-transform hover:scale-110"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {convertColor(item.color, format)}
                  </div>
                </div>
                <button
                  onClick={(e) => handleToggleFavorite(e, item.color)}
                  className={`p-1 rounded-full transition-colors ${
                    isColorInFavorites(item.color) 
                      ? 'text-red-500 hover:bg-red-100 dark:hover:bg-red-900' 
                      : 'text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={isColorInFavorites(item.color) ? "Quitar de favoritos" : "Añadir a favoritos"}
                >
                  {isColorInFavorites(item.color) ? (
                    <HeartIconSolid className="w-4 h-4" />
                  ) : (
                    <HeartIcon className="w-4 h-4" />
                  )}
                </button>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <ClockIcon className="w-3 h-3 mr-1" />
                  {item.timestamp ? formatDate(item.timestamp) : 'Fecha desconocida'}
                </div>
              </div>
            ) : null
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {groupedHistory.map((group, groupIndex) => (
            <div key={`group-${groupIndex}`} className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 pb-1 border-b border-gray-200 dark:border-gray-700">
                {new Date(group.date).toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {group.items.map((item, itemIndex) => {
                  if (!item || !item.color) return null;
                  
                  const globalIndex = history.findIndex(h => h && h.timestamp === item.timestamp);
                  return (
                    <div 
                      key={`history-detailed-${groupIndex}-${itemIndex}`}
                      className={`relative group transform transition-all duration-300 ${selectedColor === globalIndex ? 'scale-110' : 'hover:scale-105'}`}
                    >
                      <div 
                        className="h-16 rounded-md shadow-sm cursor-pointer"
                        style={{ backgroundColor: item.color }}
                        onClick={() => handleColorClick(item.color, globalIndex)}
                        title="Usar este color"
                      />
                      
                      <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-70 text-white text-xs p-1 rounded-b-md">
                        <div className="flex justify-between items-center">
                          <span>{convertColor(item.color, format)}</span>
                          <span className="text-xs opacity-80">
                            {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        className={`absolute top-1 right-1 p-1 rounded-full ${
                          isColorInFavorites(item.color) 
                            ? 'bg-white bg-opacity-80 text-red-500' 
                            : 'bg-white bg-opacity-80 text-gray-400 hover:text-red-500'
                        } opacity-0 group-hover:opacity-100 transition-opacity`}
                        onClick={(e) => handleToggleFavorite(e, item.color)}
                        title={isColorInFavorites(item.color) ? "Quitar de favoritos" : "Añadir a favoritos"}
                      >
                        {isColorInFavorites(item.color) ? (
                          <HeartIconSolid className="w-3 h-3" />
                        ) : (
                          <HeartIcon className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>Total: {history.length} {history.length === 1 ? 'color' : 'colores'}</p>
      </div>
    </div>
  );
};

export default ColorHistory;
