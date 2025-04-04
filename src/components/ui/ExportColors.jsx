import { useState, useEffect } from 'react';
import { useColorContext } from '../../context/ColorContext';
import { exportColors } from '../../utils/colorUtils';
import { toast } from 'react-toastify';

const ExportColors = () => {
  const { primaryColor, colorScale } = useColorContext();
  const [exportFormat, setExportFormat] = useState('tailwind');
  const [copied, setCopied] = useState(false);
  const [exportedCode, setExportedCode] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [syntaxHighlighted, setSyntaxHighlighted] = useState(true);
  
  // Mapear la escala de colores a los valores de Tailwind
  const mapColorsToTailwindScale = () => {
    try {
      if (!colorScale || !Array.isArray(colorScale) || colorScale.length < 2) {
        // Si no hay una escala válida, crear una escala básica con el color primario
        return [primaryColor, primaryColor, primaryColor, primaryColor, primaryColor, 
                primaryColor, primaryColor, primaryColor, primaryColor, primaryColor, primaryColor];
      }
      
      // Si tenemos menos de 11 colores, rellenar con el último color
      const filledColorScale = [...colorScale];
      while (filledColorScale.length < 11) {
        filledColorScale.push(colorScale[colorScale.length - 1]);
      }
      
      const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
      return filledColorScale.map((color, index) => color);
    } catch (error) {
      console.error('Error al mapear colores para exportar:', error);
      // Devolver una escala básica con el color primario
      return Array(11).fill(primaryColor);
    }
  };
  
  useEffect(() => {
    const colors = mapColorsToTailwindScale();
    setExportedCode(exportColors(colors, exportFormat));
  }, [primaryColor, colorScale, exportFormat]);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(exportedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast.success('¡Código copiado al portapapeles!', {
      icon: '📋',
      className: 'retro-toast'
    });
  };
  
  const handleDownload = () => {
    const fileExtension = getFileExtension(exportFormat);
    const fileName = `color-palette.${fileExtension}`;
    const blob = new Blob([exportedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`¡Archivo ${fileName} descargado!`, {
      icon: '💾',
      className: 'retro-toast'
    });
  };
  
  const getFileExtension = (format) => {
    switch (format) {
      case 'tailwind': return 'js';
      case 'css': return 'css';
      case 'scss': return 'scss';
      case 'json': return 'json';
      default: return 'txt';
    }
  };
  
  // Resaltar sintaxis para previsualización
  const highlightSyntax = (code) => {
    if (!code) return '';
    
    try {
      switch (exportFormat) {
        case 'tailwind':
          return code
            .replace(/module\.exports/g, '<span class="text-purple-600">module.exports</span>')
            .replace(/theme|extend|colors|primary/g, match => `<span class="text-blue-600">${match}</span>`)
            .replace(/[{}]/g, match => `<span class="text-yellow-600">${match}</span>`)
            .replace(/(\d+):/g, match => `<span class="text-green-600">${match}</span>`)
            .replace(/'(#[A-Fa-f0-9]{3,6})'/g, (_, color) => `'<span class="text-red-600">${color}</span>'`);
        
        case 'css':
        case 'scss':
          return code
            .replace(/(--color-primary-\d+)/g, '<span class="text-purple-600">$1</span>')
            .replace(/(:.*)(#[A-Fa-f0-9]{3,6})/g, (match, prefix, color) => 
              `${prefix}<span class="text-red-600">${color}</span>`
            )
            .replace(/(@import|@use|@forward|@mixin|@include|@function|@return|@if|@else|@for|@each|@while)/g, 
              '<span class="text-blue-600">$1</span>'
            );
        
        case 'json':
          return code
            .replace(/"([^"]+)":/g, '<span class="text-blue-600">"$1"</span>:')
            .replace(/: ?"(#[A-Fa-f0-9]{3,6})"/g, (match, color) => 
              `: "<span class="text-red-600">${color}</span>"`
            );
          
        default:
          return code;
      }
    } catch (error) {
      console.error('Error al resaltar sintaxis:', error);
      return code;
    }
  };
  
  return (
    <div className="color-picker">
      <div className="color-picker-title mb-4">
      </div>
      
      {/* Vista previa de colores */}
      <div className="mb-6">
        <div className="retro-card">
          <div className="mb-2 pixel-text">PALETA DE COLORES</div>
          <div className="flex flex-wrap gap-1">
            {mapColorsToTailwindScale().map((color, index) => (
              <div 
                key={`preview-${index}`} 
                className="relative group cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(color);
                  toast.success(`Color ${color} copiado`, { icon: '🎨', className: 'retro-toast' });
                }}
              >
                <div 
                  className="w-8 h-8 border-2 border-black transition-transform hover:scale-110"
                  style={{ backgroundColor: color }}
                ></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 text-xs bg-black text-white px-1 py-0.5 rounded-sm whitespace-nowrap z-10 pointer-events-none transition-opacity">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950][index]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Selector de formato */}
      <div className="mb-6">
        <div className="retro-card">
          <div className="mb-2 pixel-text">FORMATO</div>
          <div className="retro-tabs">
            {['tailwind', 'css', 'scss', 'json'].map(format => (
              <button
                key={format}
                onClick={() => setExportFormat(format)}
                className={`retro-tab ${exportFormat === format ? 'active' : ''}`}
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Código exportado */}
      <div className="retro-card">
        <div className="mb-2 pixel-text">CÓDIGO GENERADO</div>
        <div className="border-2 border-black overflow-hidden rounded-sm">
          <div className="flex justify-between items-center px-4 py-2 bg-gray-900 text-white">
            <div className="text-sm font-bold mono-text">
              {exportFormat.toUpperCase()}
            </div>
          </div>
          
          <div className="bg-gray-900 text-white p-4 font-mono text-sm overflow-auto max-h-80 scanline">
            {syntaxHighlighted ? (
              <pre dangerouslySetInnerHTML={{ __html: highlightSyntax(exportedCode) }} />
            ) : (
              <pre>{exportedCode}</pre>
            )}
          </div>
        </div>
      </div>
      
      {/* Botones de acción */}
      <div className="mt-6 flex justify-center space-x-3">
        <button 
          onClick={handleCopy}
          className="retro-button secondary"
        >
          COPIAR CÓDIGO
        </button>
        <button 
          onClick={handleDownload}
          className="retro-button primary"
        >
          DESCARGAR
        </button>
      </div>
    </div>
  );
};

export default ExportColors;
