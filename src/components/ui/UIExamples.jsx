import { useState, useEffect, useRef } from 'react';
import { useColorContext } from '../../context/ColorContext';
import { toast } from 'react-toastify';

// Versiones simplificadas de los componentes
const SimpleAccordion = ({ items, accentColor }) => {
  const [openItem, setOpenItem] = useState(null);
  
  const toggleItem = (index) => {
    setOpenItem(openItem === index ? null : index);
  };
  
  return (
    <div className="w-full border rounded-md">
      {items.map((item, index) => (
        <div key={index} className="border-b last:border-b-0">
          <button
            onClick={() => toggleItem(index)}
            className="flex justify-between w-full px-4 py-2 text-left font-medium"
            style={{ color: accentColor }}
          >
            {item.title}
            <span>{openItem === index ? '▲' : '▼'}</span>
          </button>
          {openItem === index && (
            <div className="px-4 py-2 text-sm">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const SimpleAlert = ({ title, description, variant, style }) => {
  return (
    <div className="w-full p-4 border rounded-md" style={style}>
      <h5 className="font-medium">{title}</h5>
      <p className="text-sm">{description}</p>
    </div>
  );
};

const SimpleCard = ({ title, description, children, headerStyle, footerStyle, buttonStyle }) => {
  return (
    <div className="w-full border rounded-md overflow-hidden">
      <div className="p-4" style={headerStyle}>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="p-4 border-t border-b">
        {children}
      </div>
      <div className="p-4 flex justify-between" style={footerStyle}>
        <button className="text-sm">Cancelar</button>
        <button className="text-sm px-3 py-1 rounded text-white" style={buttonStyle}>Guardar</button>
      </div>
    </div>
  );
};

const SimpleScrollArea = ({ height, children }) => {
  return (
    <div className={`overflow-auto border rounded-md p-4`} style={{ height }}>
      {children}
    </div>
  );
};

const SimpleTable = ({ caption, headers, rows }) => {
  return (
    <div className="w-full">
      <table className="w-full border-collapse">
        <caption className="text-sm text-gray-500 mb-2">{caption}</caption>
        <thead>
          <tr className="border-b">
            {headers.map((header, index) => (
              <th key={index} className="px-4 py-2 text-left font-medium">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b last:border-b-0">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className={`px-4 py-2 ${cellIndex === 0 ? 'font-medium' : ''}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SimpleTabs = ({ tabs, defaultTab, tabListStyle }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  return (
    <div className="w-full">
      <div className="flex border-b" style={tabListStyle}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 ${activeTab === tab.value ? 'border-b-2 font-medium' : ''}`}
            style={activeTab === tab.value ? { borderColor: tabListStyle?.backgroundColor } : {}}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4">
        {tabs.find(tab => tab.value === activeTab)?.content}
      </div>
    </div>
  );
};

const UIExamples = () => {
  const { primaryColor, colorScale } = useColorContext();
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const categories = [
    { id: 'ui-components', name: 'EJEMPLOS UI' }
  ];
  
  const getColor = (index) => colorScale[index] || primaryColor;
  
  const [selectedTab, setSelectedTab] = useState(0);
  
  // Efecto de glitch aleatorio en elementos retro
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 150);
    }, 5000);
    
    return () => clearInterval(glitchInterval);
  }, []);
  
  // Función para copiar texto al portapapeles
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success(`Color ${text} copiado al portapapeles`, {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch(err => {
        toast.error('Error al copiar: ' + err, {
          position: "bottom-right",
        });
      });
  };
  
  // Componente para elementos con color que se pueden copiar con un clic
  const CopyableColorBox = ({ color, children, className, style }) => {
    return (
      <div 
        className={`cursor-pointer relative ${className || ''}`}
        style={style}
        onClick={() => copyToClipboard(color)}
        title={`Clic para copiar: ${color}`}
      >
        {children}
        <div className="absolute top-1 right-1 text-xs opacity-70 hover:opacity-100">
          📋
        </div>
      </div>
    );
  };
  
  // Función para copiar color al portapapeles
  const copyColorToClipboard = (color) => {
    navigator.clipboard.writeText(color);
    toast.success(`Color ${color} copiado al portapapeles`, {
      icon: '🎨',
      className: 'retro-toast'
    });
  };
  
  // Función para determinar si un color es oscuro (para elegir texto claro u oscuro)
  const isColorDark = (hexColor) => {
    // Convertir hex a RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calcular luminosidad (fórmula WCAG)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Si luminance < 0.5, el color es oscuro
    return luminance < 0.5;
  };
  
  // Función para calcular el contraste entre dos colores (según WCAG)
  const calculateContrast = (color1, color2) => {
    // Convertir colores a RGB
    const rgb1 = {
      r: parseInt(color1.slice(1, 3), 16),
      g: parseInt(color1.slice(3, 5), 16),
      b: parseInt(color1.slice(5, 7), 16)
    };
    
    const rgb2 = {
      r: parseInt(color2.slice(1, 3), 16),
      g: parseInt(color2.slice(3, 5), 16),
      b: parseInt(color2.slice(5, 7), 16)
    };
    
    // Calcular luminancia relativa
    const l1 = calculateRelativeLuminance(rgb1);
    const l2 = calculateRelativeLuminance(rgb2);
    
    // Calcular contraste
    const contrast = l1 > l2 
      ? (l1 + 0.05) / (l2 + 0.05) 
      : (l2 + 0.05) / (l1 + 0.05);
    
    return contrast;
  };
  
  // Función para calcular la luminancia relativa (según WCAG)
  const calculateRelativeLuminance = (rgb) => {
    // Convertir RGB a valores relativos
    const sRGB = {
      r: rgb.r / 255,
      g: rgb.g / 255,
      b: rgb.b / 255
    };
    
    // Aplicar transformación
    const rgb2 = {
      r: sRGB.r <= 0.03928 ? sRGB.r / 12.92 : Math.pow((sRGB.r + 0.055) / 1.055, 2.4),
      g: sRGB.g <= 0.03928 ? sRGB.g / 12.92 : Math.pow((sRGB.g + 0.055) / 1.055, 2.4),
      b: sRGB.b <= 0.03928 ? sRGB.b / 12.92 : Math.pow((sRGB.b + 0.055) / 1.055, 2.4)
    };
    
    // Calcular luminancia
    return 0.2126 * rgb2.r + 0.7152 * rgb2.g + 0.0722 * rgb2.b;
  };
  
  // Función para obtener color de texto con buen contraste
  const getTextColor = (bgColor) => {
    const whiteContrast = calculateContrast(bgColor, '#FFFFFF');
    const blackContrast = calculateContrast(bgColor, '#000000');
    
    // Elegir el color con mejor contraste (debe ser al menos 4.5:1 para texto normal)
    return whiteContrast > blackContrast ? '#FFFFFF' : '#000000';
  };
  
  // Función para obtener un color con buen contraste para texto pequeño
  const getAccessibleTextColor = (bgColor) => {
    const white = '#FFFFFF';
    const black = '#000000';
    const whiteContrast = calculateContrast(bgColor, white);
    const blackContrast = calculateContrast(bgColor, black);
    
    // Para texto normal, WCAG requiere un contraste mínimo de 4.5:1
    if (whiteContrast >= 4.5 || blackContrast >= 4.5) {
      return whiteContrast > blackContrast ? white : black;
    }
    
    // Si ninguno cumple, buscar en la escala de colores
    for (let i = 0; i < 10; i++) {
      const scaleColor = getColor(i);
      const contrast = calculateContrast(bgColor, scaleColor);
      if (contrast >= 4.5) {
        return scaleColor;
      }
    }
    
    // Si no hay suficiente contraste, usar el mejor disponible
    return whiteContrast > blackContrast ? white : black;
  };
  
  // Función para obtener un color de fondo con buen contraste para un color de texto
  const getAccessibleBgColor = (textColor, preferredBgColor) => {
    // Verificar si el color preferido ya tiene buen contraste
    const contrast = calculateContrast(preferredBgColor, textColor);
    if (contrast >= 4.5) {
      return preferredBgColor;
    }
    
    // Buscar en la escala de colores
    for (let i = 0; i < 10; i++) {
      const scaleColor = getColor(i);
      const newContrast = calculateContrast(scaleColor, textColor);
      if (newContrast >= 4.5) {
        return scaleColor;
      }
    }
    
    // Si no hay suficiente contraste, usar blanco o negro
    return isColorDark(textColor) ? '#FFFFFF' : '#000000';
  };
  
  // Componente para elementos con color que muestran tooltip
  const ColorElement = ({ style, className, children, colorIndex, tooltip }) => {
    const color = getColor(colorIndex);
    const colorStyles = { ...style, backgroundColor: color };
    
    return (
      <div 
        className={`relative ${className}`} 
        style={colorStyles}
        onClick={() => copyColorToClipboard(color)}
      >
        {children}
      </div>
    );
  };
  
  return (
    <div className="mb-4">
      <div className="space-y-6 w-full">
        {/* Accordion */}
        <div className="retro-card">
          <div className="mb-2 pixel-text">Accordion</div>
          <div className="border-2 border-black rounded-lg overflow-hidden">
            <SimpleAccordion 
              items={[
                { title: '¿Qué es una paleta de colores?', content: 'Una paleta de colores es un conjunto de colores seleccionados para usar en un diseño. Una buena paleta debe ser armoniosa y adecuada para el propósito del diseño.' },
                { title: '¿Qué es el contraste de color?', content: 'El contraste de color es la diferencia en luminosidad o color que hace que un objeto sea distinguible de otro. Un buen contraste es esencial para la accesibilidad.' },
                { title: '¿Qué es WCAG?', content: 'WCAG (Web Content Accessibility Guidelines) son pautas de accesibilidad para el contenido web que aseguran que los sitios sean accesibles para personas con discapacidades.' }
              ]}
              accentColor={getColor(7)}
            />
          </div>
        </div>
        
        {/* Alert */}
        <div className="retro-card">
          <div className="mb-2 pixel-text">Alert</div>
          <div className="border-2 border-black rounded-lg overflow-hidden">
            <div className="p-4 bg-white space-y-4">
              {(() => {
                const infoBgColor = getColor(1);
                const infoTextColor = getAccessibleTextColor(infoBgColor);
                const successBgColor = getColor(3);
                const successTextColor = getAccessibleTextColor(successBgColor);
                const errorBgColor = getColor(8);
                const errorTextColor = getAccessibleTextColor(errorBgColor);
                
                const contrastInfo = calculateContrast(infoBgColor, infoTextColor).toFixed(2);
                const contrastSuccess = calculateContrast(successBgColor, successTextColor).toFixed(2);
                const contrastError = calculateContrast(errorBgColor, errorTextColor).toFixed(2);
                
                return (
                  <>
                    <CopyableColorBox color={infoBgColor}>
                      <SimpleAlert 
                        title="Información"
                        description={`Esta es una alerta informativa sobre colores. Contraste: ${contrastInfo}:1`}
                        variant="info"
                        style={{ 
                          backgroundColor: infoBgColor, 
                          borderColor: getColor(5),
                          color: infoTextColor
                        }}
                      />
                    </CopyableColorBox>
                    
                    <CopyableColorBox color={successBgColor}>
                      <SimpleAlert 
                        title="Éxito"
                        description={`Color generado con éxito. Contraste: ${contrastSuccess}:1`}
                        variant="success"
                        style={{ 
                          backgroundColor: successBgColor, 
                          borderColor: getColor(6),
                          color: successTextColor
                        }}
                      />
                    </CopyableColorBox>
                    
                    <CopyableColorBox color={errorBgColor}>
                      <SimpleAlert 
                        title="Error"
                        description={`El formato de color no es válido. Contraste: ${contrastError}:1`}
                        variant="error"
                        style={{ 
                          backgroundColor: errorBgColor, 
                          borderColor: getColor(9),
                          color: errorTextColor
                        }}
                      />
                    </CopyableColorBox>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
        
        {/* Card */}
        <div className="retro-card">
          <div className="mb-2 pixel-text">Card</div>
          <div className="border-2 border-black rounded-lg overflow-hidden">
            {(() => {
              const headerBgColor = getColor(5);
              const headerTextColor = getAccessibleTextColor(headerBgColor);
              const footerBgColor = getColor(1);
              const footerTextColor = getAccessibleTextColor(footerBgColor);
              const buttonBgColor = getColor(7);
              const buttonTextColor = getAccessibleTextColor(buttonBgColor);
              
              return (
                <SimpleCard 
                  title="Paleta de Colores"
                  description="Crea y personaliza tu paleta"
                  headerStyle={{ 
                    backgroundColor: headerBgColor,
                    color: headerTextColor
                  }}
                  footerStyle={{ 
                    backgroundColor: footerBgColor,
                    color: footerTextColor,
                    borderTopColor: headerBgColor
                  }}
                  buttonStyle={{
                    backgroundColor: buttonBgColor,
                    color: buttonTextColor
                  }}
                >
                  <div>
                    <p className="text-sm mb-2">Selecciona un color base y genera una escala de colores completa para tu proyecto.</p>
                    <div className="text-xs space-y-2">
                      <CopyableColorBox 
                        color={headerBgColor}
                        className="p-2 rounded"
                        style={{ backgroundColor: headerBgColor, color: headerTextColor }}
                      >
                        <p>Encabezado: {headerBgColor} (Contraste: {calculateContrast(headerBgColor, headerTextColor).toFixed(2)}:1)</p>
                      </CopyableColorBox>
                      
                      <CopyableColorBox 
                        color={footerBgColor}
                        className="p-2 rounded"
                        style={{ backgroundColor: footerBgColor, color: footerTextColor }}
                      >
                        <p>Pie: {footerBgColor} (Contraste: {calculateContrast(footerBgColor, footerTextColor).toFixed(2)}:1)</p>
                      </CopyableColorBox>
                      
                      <CopyableColorBox 
                        color={buttonBgColor}
                        className="p-2 rounded"
                        style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
                      >
                        <p>Botón: {buttonBgColor} (Contraste: {calculateContrast(buttonBgColor, buttonTextColor).toFixed(2)}:1)</p>
                      </CopyableColorBox>
                    </div>
                  </div>
                </SimpleCard>
              );
            })()}
          </div>
        </div>
        
        {/* ScrollArea */}
        <div className="retro-card">
          <div className="mb-2 pixel-text">ScrollArea</div>
          <div className="border-2 border-black rounded-lg overflow-hidden">
            <SimpleScrollArea height="200px">
              <div className="space-y-4">
                {Array.from({ length: 9 }).map((_, i) => {
                  const bgColor = getColor(i);
                  const textColor = getAccessibleTextColor(bgColor);
                  const contrast = calculateContrast(bgColor, textColor).toFixed(2);
                  const isAccessible = contrast >= 4.5;
                  
                  return (
                    <CopyableColorBox 
                      key={i} 
                      color={bgColor}
                      className="p-3 rounded" 
                      style={{ 
                        backgroundColor: bgColor,
                        color: textColor,
                        border: !isAccessible ? '2px dashed red' : 'none'
                      }}
                    >
                      <p className="text-sm font-medium">Color {i + 1}</p>
                      <p className="text-xs opacity-80">
                        {isAccessible 
                          ? `Este color tiene buen contraste (${contrast}:1)` 
                          : `¡Advertencia! Contraste insuficiente (${contrast}:1)`
                        }
                      </p>
                      <p className="text-xs mt-1">{bgColor} / Texto: {textColor}</p>
                    </CopyableColorBox>
                  );
                })}
              </div>
            </SimpleScrollArea>
          </div>
        </div>
        
        {/* Table */}
        <div className="retro-card">
          <div className="mb-2 pixel-text">Table</div>
          <div className="border-2 border-black rounded-lg overflow-hidden">
            <div style={{ backgroundColor: getColor(0) }}>
              <SimpleTable 
                caption="Paleta de colores y contraste"
                headers={['Nombre', 'Color', 'Contraste con blanco', 'Contraste con negro', 'Recomendación']}
                rows={[0, 3, 5, 7, 9].map(index => {
                  const color = getColor(index);
                  const whiteContrast = calculateContrast(color, '#FFFFFF').toFixed(2);
                  const blackContrast = calculateContrast(color, '#000000').toFixed(2);
                  const bestTextColor = getAccessibleTextColor(color);
                  const bestContrast = Math.max(parseFloat(whiteContrast), parseFloat(blackContrast)).toFixed(2);
                  
                  return [
                    `Color ${index}`,
                    <CopyableColorBox 
                      color={color}
                      className="w-full h-6 rounded flex items-center justify-center text-xs"
                      style={{ 
                        backgroundColor: color,
                        color: bestTextColor
                      }}
                    >
                      {color}
                    </CopyableColorBox>,
                    <span style={{ color: whiteContrast >= 4.5 ? 'green' : 'red' }}>{whiteContrast}:1</span>,
                    <span style={{ color: blackContrast >= 4.5 ? 'green' : 'red' }}>{blackContrast}:1</span>,
                    <CopyableColorBox 
                      color={color}
                      style={{ 
                        backgroundColor: color, 
                        color: bestTextColor,
                        padding: '2px 4px',
                        borderRadius: '2px',
                        display: 'inline-block'
                      }}
                    >
                      Texto ({bestContrast}:1)
                    </CopyableColorBox>
                  ];
                })}
              />
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="retro-card">
          <div className="mb-2 pixel-text">Tabs</div>
          <div className="border-2 border-black rounded-lg overflow-hidden">
            {(() => {
              const tabsBgColor = getColor(2);
              const tabsTextColor = getAccessibleTextColor(tabsBgColor);
              
              return (
                <SimpleTabs 
                  tabs={[
                    { 
                      value: 'contraste', 
                      label: 'Contraste', 
                      content: (
                        <div>
                          <h3 className="font-medium mb-2">Recomendaciones de Contraste</h3>
                          <p className="text-sm mb-2">Para texto normal: Ratio mínimo de 4.5:1</p>
                          <p className="text-sm mb-3">Para texto grande: Ratio mínimo de 3:1</p>
                          
                          {colorScale.slice(0, 5).map((color, index) => {
                            const textColor = getAccessibleTextColor(color);
                            const contrast = calculateContrast(color, textColor).toFixed(2);
                            
                            return (
                              <CopyableColorBox 
                                key={index}
                                color={color}
                                className="mt-2 p-3 rounded" 
                                style={{ 
                                  backgroundColor: color,
                                  color: textColor
                                }}
                              >
                                <p className="font-medium">Ejemplo {index + 1}: Contraste {contrast}:1</p>
                                <p className="text-xs">{color}</p>
                              </CopyableColorBox>
                            );
                          })}
                        </div>
                      )
                    },
                    { 
                      value: 'seo', 
                      label: 'SEO', 
                      content: (
                        <div>
                          <h3 className="font-medium mb-2">Recomendaciones SEO</h3>
                          <p className="text-sm mb-2">Utiliza colores que reflejen la identidad de marca</p>
                          <p className="text-sm mb-2">Asegura que los elementos importantes tengan buen contraste</p>
                          <p className="text-sm">Los colores pueden influir en la percepción y experiencia del usuario</p>
                          
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            {[4, 6].map((colorIndex) => {
                              const bgColor = getColor(colorIndex);
                              const textColor = getAccessibleTextColor(bgColor);
                              
                              return (
                                <CopyableColorBox 
                                  key={colorIndex}
                                  color={bgColor}
                                  className="p-3 rounded text-center" 
                                  style={{ 
                                    backgroundColor: bgColor,
                                    color: textColor
                                  }}
                                >
                                  <p className="font-medium">Botón de acción</p>
                                  <p className="text-xs">{bgColor}</p>
                                </CopyableColorBox>
                              );
                            })}
                          </div>
                        </div>
                      )
                    },
                    { 
                      value: 'accesibilidad', 
                      label: 'Accesibilidad', 
                      content: (
                        <div>
                          <h3 className="font-medium mb-2">Accesibilidad</h3>
                          <p className="text-sm mb-2">No dependas solo del color para transmitir información</p>
                          <p className="text-sm mb-2">Considera usuarios con daltonismo</p>
                          <p className="text-sm mb-3">Usa íconos y texto además de colores</p>
                          
                          <div className="mt-3 space-y-2">
                            {[
                              { icon: '✓', text: 'Completado', color: 3 },
                              { icon: '⚠️', text: 'Advertencia', color: 2 },
                              { icon: '✗', text: 'Error', color: 8 }
                            ].map((item, index) => {
                              const bgColor = getColor(item.color);
                              const textColor = getAccessibleTextColor(bgColor);
                              
                              return (
                                <CopyableColorBox 
                                  key={index}
                                  color={bgColor}
                                  className="p-2 rounded flex items-center" 
                                  style={{ 
                                    backgroundColor: bgColor,
                                    color: textColor
                                  }}
                                >
                                  <span className="mr-2 text-lg">{item.icon}</span>
                                  <span>{item.text}</span>
                                  <span className="ml-auto text-xs">{bgColor}</span>
                                </CopyableColorBox>
                              );
                            })}
                          </div>
                        </div>
                      )
                    }
                  ]}
                  defaultTab="contraste"
                  tabListStyle={{ 
                    backgroundColor: tabsBgColor,
                    color: tabsTextColor
                  }}
                />
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIExamples;
