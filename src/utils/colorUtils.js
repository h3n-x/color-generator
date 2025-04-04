import chroma from 'chroma-js';

/**
 * Verifica si un string es un color hexadecimal válido
 * @param {string} hex - String a validar como color hexadecimal
 * @returns {boolean} - true si es un color hexadecimal válido, false en caso contrario
 */
export const isValidHex = (hex) => {
  if (!hex) return false;
  // Validar formato hexadecimal (#RGB o #RRGGBB)
  const regex = /^#([A-Fa-f0-9]{3}){1,2}$/;
  return regex.test(hex);
};

/**
 * Verifica si un string es un color CMYK válido
 * @param {string} cmyk - String a validar como color CMYK
 * @returns {boolean} - true si es un color CMYK válido, false en caso contrario
 */
export const isValidCMYK = (cmyk) => {
  if (!cmyk) return false;
  // Validar formato CMYK (cmyk(0-100%, 0-100%, 0-100%, 0-100%))
  const regex = /^cmyk\(\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i;
  if (!regex.test(cmyk)) return false;
  
  // Extraer valores y verificar que estén en el rango 0-100
  const matches = cmyk.match(regex);
  const values = [
    parseInt(matches[1], 10),
    parseInt(matches[2], 10),
    parseInt(matches[3], 10),
    parseInt(matches[4], 10)
  ];
  
  return values.every(val => val >= 0 && val <= 100);
};

/**
 * Parsea un color CMYK a un objeto RGB
 * @param {string} cmyk - Color en formato CMYK
 * @returns {object} - Objeto con valores RGB
 */
export const parseCMYK = (cmyk) => {
  const regex = /^cmyk\(\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i;
  const matches = cmyk.match(regex);
  
  if (!matches) {
    throw new Error('Formato CMYK inválido');
  }
  
  // Extraer valores CMYK (0-100)
  const c = parseInt(matches[1], 10) / 100;
  const m = parseInt(matches[2], 10) / 100;
  const y = parseInt(matches[3], 10) / 100;
  const k = parseInt(matches[4], 10) / 100;
  
  // Convertir CMYK a RGB
  const r = Math.round(255 * (1 - c) * (1 - k));
  const g = Math.round(255 * (1 - m) * (1 - k));
  const b = Math.round(255 * (1 - y) * (1 - k));
  
  return { r, g, b };
};

/**
 * Convierte un color entre diferentes formatos
 * @param {string} color - Color en formato HEX, RGB, HSL o CMYK
 * @param {string} format - Formato deseado ('hex', 'rgb', 'hsl', 'cmyk')
 * @returns {string} Color en el formato solicitado
 */
export const convertColor = (color, format) => {
  try {
    let chromaColor;
    
    // Manejar formato CMYK de entrada
    if (color.toLowerCase().startsWith('cmyk')) {
      if (isValidCMYK(color)) {
        const { r, g, b } = parseCMYK(color);
        chromaColor = chroma.rgb(r, g, b);
      } else {
        throw new Error('Formato CMYK inválido');
      }
    } else {
      chromaColor = chroma(color);
    }
    
    switch (format.toLowerCase()) {
      case 'hex':
        return chromaColor.hex();
      case 'rgb':
        const [r, g, b] = chromaColor.rgb();
        return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
      case 'hsl':
        const [h, s, l] = chromaColor.hsl();
        return `hsl(${Math.round(h || 0)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
      case 'cmyk':
        const [c, m, y, k] = chromaColor.cmyk();
        return `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`;
      default:
        return chromaColor.hex();
    }
  } catch (error) {
    console.error('Error al convertir color:', error);
    return color;
  }
};

/**
 * Valida si un string es un color válido en cualquier formato soportado
 * @param {string} color - String a validar como color
 * @returns {boolean} - true si es un color válido, false en caso contrario
 */
export const isValidColor = (color) => {
  if (!color) return false;
  
  // Verificar si es un color CMYK
  if (color.toLowerCase().startsWith('cmyk')) {
    return isValidCMYK(color);
  }
  
  // Verificar otros formatos utilizando chroma.js
  try {
    chroma(color);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Genera una escala de colores basada en un color base
 * @param {string} baseColor - Color base en cualquier formato válido
 * @param {number} steps - Número de pasos en la escala
 * @returns {Array} Array de colores en formato HEX
 */
export const generateColorScale = (baseColor, steps = 11) => {
  try {
    const chromaColor = chroma(baseColor);
    
    // Crear una escala más equilibrada con menos blancos
    // Usamos un color ligeramente tintado en lugar de blanco puro
    const lightestColor = chroma(baseColor).luminance(0.9);
    const darkestColor = chroma(baseColor).luminance(0.05);
    
    // Generar la escala completa de una vez para mejor distribución
    const scale = chroma.scale([lightestColor, baseColor, darkestColor])
      .mode('lab')
      .colors(steps);
    
    return scale;
  } catch (error) {
    console.error('Error al generar escala de colores:', error);
    return [baseColor];
  }
};

/**
 * Calcula el contraste entre dos colores
 * @param {string} color1 - Primer color
 * @param {string} color2 - Segundo color
 * @returns {number} Ratio de contraste (WCAG)
 */
export const calculateContrast = (color1, color2) => {
  try {
    return chroma.contrast(color1, color2);
  } catch (error) {
    console.error('Error al calcular contraste:', error);
    return 1;
  }
};

/**
 * Evalúa la accesibilidad de un color de texto sobre un fondo
 * @param {string} textColor - Color del texto
 * @param {string} bgColor - Color del fondo
 * @returns {Object} Evaluación de accesibilidad
 */
export const evaluateAccessibility = (textColor, bgColor) => {
  const contrast = calculateContrast(textColor, bgColor);
  
  return {
    contrast,
    smallText: contrast >= 4.5,
    largeText: contrast >= 3,
    uiComponents: contrast >= 3,
    wcagAA: contrast >= 4.5,
    wcagAAA: contrast >= 7,
    score: getAccessibilityScore(contrast)
  };
};

/**
 * Calcula una puntuación de accesibilidad basada en el contraste
 * @param {number} contrast - Ratio de contraste
 * @returns {number} Puntuación de 0 a 100
 */
const getAccessibilityScore = (contrast) => {
  if (contrast >= 7) return 100;
  if (contrast >= 4.5) return 80;
  if (contrast >= 3) return 60;
  if (contrast >= 2) return 40;
  return 20;
};

/**
 * Genera colores complementarios y análogos
 * @param {string} baseColor - Color base
 * @returns {Object} Colores relacionados
 */
export const generateRelatedColors = (baseColor) => {
  try {
    const chromaColor = chroma(baseColor);
    const [h, s, l] = chromaColor.hsl();
    
    // Complementario (opuesto en la rueda de colores)
    const complementary = chroma.hsl((h + 180) % 360, s, l).hex();
    
    // Análogos (adyacentes en la rueda de colores)
    const analogous1 = chroma.hsl((h + 30) % 360, s, l).hex();
    const analogous2 = chroma.hsl((h - 30 + 360) % 360, s, l).hex();
    
    // Triádicos (separados por 120 grados)
    const triadic1 = chroma.hsl((h + 120) % 360, s, l).hex();
    const triadic2 = chroma.hsl((h + 240) % 360, s, l).hex();
    
    return {
      complementary,
      analogous: [analogous1, analogous2],
      triadic: [triadic1, triadic2]
    };
  } catch (error) {
    console.error('Error al generar colores relacionados:', error);
    return {
      complementary: baseColor,
      analogous: [baseColor, baseColor],
      triadic: [baseColor, baseColor]
    };
  }
};

/**
 * Exporta colores en diferentes formatos
 * @param {Array} colors - Array de colores en formato HEX
 * @param {string} format - Formato de exportación ('tailwind', 'css', 'scss', 'json')
 * @returns {string} Texto formateado para exportación
 */
export const exportColors = (colors, format) => {
  try {
    switch (format.toLowerCase()) {
      case 'tailwind':
        return generateTailwindConfig(colors);
      case 'css':
        return generateCSSVariables(colors);
      case 'scss':
        return generateSCSSVariables(colors);
      case 'json':
        return JSON.stringify(colors, null, 2);
      default:
        return JSON.stringify(colors, null, 2);
    }
  } catch (error) {
    console.error('Error al exportar colores:', error);
    return JSON.stringify(colors, null, 2);
  }
};

/**
 * Genera configuración para Tailwind CSS
 * @param {Array} colors - Array de colores
 * @returns {string} Configuración de Tailwind
 */
const generateTailwindConfig = (colors) => {
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  let config = 'module.exports = {\n  theme: {\n    extend: {\n      colors: {\n        primary: {\n';
  
  // Asegurarse de que tenemos suficientes colores
  const safeColors = Array.isArray(colors) ? [...colors] : [];
  
  // Si no hay colores o hay menos de los necesarios, usar un color por defecto
  if (safeColors.length === 0) {
    safeColors.push('#0ea5e9'); // Color por defecto
  }
  
  // Rellenar el array hasta tener 11 colores
  while (safeColors.length < steps.length) {
    safeColors.push(safeColors[safeColors.length - 1] || '#0ea5e9');
  }
  
  // Generar la configuración
  steps.forEach((step, index) => {
    config += `          ${step}: '${safeColors[index]}',\n`;
  });
  
  config += '        },\n      },\n    },\n  },\n}';
  return config;
};

/**
 * Genera variables CSS
 * @param {Array} colors - Array de colores
 * @returns {string} Variables CSS
 */
const generateCSSVariables = (colors) => {
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  let css = ':root {\n';
  
  // Asegurarse de que tenemos suficientes colores
  const safeColors = Array.isArray(colors) ? [...colors] : [];
  
  // Si no hay colores o hay menos de los necesarios, usar un color por defecto
  if (safeColors.length === 0) {
    safeColors.push('#0ea5e9'); // Color por defecto
  }
  
  // Rellenar el array hasta tener 11 colores
  while (safeColors.length < steps.length) {
    safeColors.push(safeColors[safeColors.length - 1] || '#0ea5e9');
  }
  
  // Generar las variables CSS
  steps.forEach((step, index) => {
    css += `  --color-primary-${step}: ${safeColors[index]};\n`;
  });
  
  css += '}';
  return css;
};

/**
 * Genera variables SCSS
 * @param {Array} colors - Array de colores
 * @returns {string} Variables SCSS
 */
const generateSCSSVariables = (colors) => {
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  let scss = '// Variables de color primario\n';
  
  // Asegurarse de que tenemos suficientes colores
  const safeColors = Array.isArray(colors) ? [...colors] : [];
  
  // Si no hay colores o hay menos de los necesarios, usar un color por defecto
  if (safeColors.length === 0) {
    safeColors.push('#0ea5e9'); // Color por defecto
  }
  
  // Rellenar el array hasta tener 11 colores
  while (safeColors.length < steps.length) {
    safeColors.push(safeColors[safeColors.length - 1] || '#0ea5e9');
  }
  
  // Generar las variables SCSS
  steps.forEach((step, index) => {
    scss += `$color-primary-${step}: ${safeColors[index]};\n`;
  });
  
  // Generar mapa de colores
  scss += '\n// Mapa de colores primarios\n';
  scss += '$colors-primary: (\n';
  
  steps.forEach((step, index) => {
    scss += `  ${step}: ${safeColors[index]},\n`;
  });
  
  scss += ');';
  return scss;
};

/**
 * Evalúa la calidad SEO de un color
 * @param {string} color - Color a evaluar
 * @returns {Object} Evaluación SEO
 */
export const evaluateSEO = (color) => {
  try {
    const chromaColor = chroma(color);
    const [h, s, l] = chromaColor.hsl();
    
    // Evaluar saturación y luminosidad para SEO
    const saturationScore = s > 0.2 && s < 0.8 ? 100 : (s <= 0.2 ? s * 500 : (1 - s) * 250);
    const luminanceScore = l > 0.2 && l < 0.8 ? 100 : (l <= 0.2 ? l * 500 : (1 - l) * 250);
    
    // Evaluar si es un color web seguro
    const [r, g, b] = chromaColor.rgb().map(v => Math.round(v));
    const isWebSafe = (r % 51 === 0) && (g % 51 === 0) && (b % 51 === 0);
    
    // Puntuación total
    const totalScore = Math.round((saturationScore + luminanceScore) / 2);
    
    return {
      score: totalScore,
      saturationScore: Math.round(saturationScore),
      luminanceScore: Math.round(luminanceScore),
      isWebSafe,
      recommendations: getSEORecommendations(s, l, isWebSafe)
    };
  } catch (error) {
    console.error('Error al evaluar SEO del color:', error);
    return {
      score: 0,
      saturationScore: 0,
      luminanceScore: 0,
      isWebSafe: false,
      recommendations: []
    };
  }
};

/**
 * Genera recomendaciones SEO para colores
 * @param {number} s - Saturación (0-1)
 * @param {number} l - Luminosidad (0-1)
 * @param {boolean} isWebSafe - Si es un color web seguro
 * @returns {Array} Lista de recomendaciones
 */
const getSEORecommendations = (s, l, isWebSafe) => {
  const recommendations = [];
  
  if (s < 0.2) {
    recommendations.push('Aumentar la saturación para mejorar la visibilidad');
  } else if (s > 0.8) {
    recommendations.push('Reducir la saturación para mejorar la legibilidad');
  }
  
  if (l < 0.2) {
    recommendations.push('Aumentar la luminosidad para mejorar la visibilidad');
  } else if (l > 0.8) {
    recommendations.push('Reducir la luminosidad para mejorar el contraste');
  }
  
  if (!isWebSafe) {
    recommendations.push('Considerar usar un color web seguro para mayor compatibilidad');
  }
  
  return recommendations;
};

/**
 * Obtiene los valores de color en diferentes formatos
 * @param {string} color - Color a analizar
 * @returns {Object} Valores en diferentes formatos
 */
export const getColorValues = (color) => {
  try {
    const chromaColor = chroma(color);
    const [r, g, b] = chromaColor.rgb().map(Math.round);
    const [h, s, l] = chromaColor.hsl();
    const [c, m, y, k] = chromaColor.cmyk();
    
    return {
      hex: chromaColor.hex(),
      rgb: {
        r, g, b,
        string: `rgb(${r}, ${g}, ${b})`
      },
      hsl: {
        h: Math.round(h || 0),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
        string: `hsl(${Math.round(h || 0)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
      },
      cmyk: {
        c: Math.round(c * 100),
        m: Math.round(m * 100),
        y: Math.round(y * 100),
        k: Math.round(k * 100),
        string: `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`
      },
      luminance: Math.round(chromaColor.luminance() * 100) / 100
    };
  } catch (error) {
    console.error('Error al obtener valores de color:', error);
    return {
      hex: color,
      rgb: { r: 0, g: 0, b: 0, string: 'rgb(0, 0, 0)' },
      hsl: { h: 0, s: 0, l: 0, string: 'hsl(0, 0%, 0%)' },
      cmyk: { c: 0, m: 0, y: 0, k: 0, string: 'cmyk(0%, 0%, 0%, 0%)' },
      luminance: 0
    };
  }
};
