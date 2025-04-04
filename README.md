# H3n - Color Generator

Una aplicación web moderna para crear, personalizar y evaluar paletas de colores con estilo pastel que cumplen con los estándares de accesibilidad WCAG.

![H3n Color Generator](https://via.placeholder.com/800x400/0ea5e9/FFFFFF?text=H3n+Color+Generator)

## Características

- **Selector de colores visual e intuitivo** con soporte para diferentes formatos (HEX, RGB, HSL, CMYK)
- **Generación automática de escalas de colores** (11 tonos desde más claro a más oscuro)
- **Evaluación de accesibilidad WCAG** con puntuaciones y recomendaciones de contraste
- **Información detallada del color** incluyendo valores, contraste y puntuación SEO
- **Componentes UI accesibles** que se adaptan automáticamente al color seleccionado
- **Copiado de códigos de color con un clic** en cualquier componente de la interfaz
- **Exportación de colores** en diferentes formatos (Tailwind, CSS, SCSS, JSON)
- **Guardado de colores favoritos** en almacenamiento local
- **Interfaz responsive con estética retro** y efectos visuales nostálgicos
- **Atajos de teclado** para una experiencia de usuario mejorada

## Tecnologías Utilizadas

- **React** - Biblioteca de UI
- **Vite** - Entorno de desarrollo
- **Tailwind CSS** - Framework de estilos
- **React Colorful** - Selector de colores
- **Chroma.js** - Manipulación de colores
- **React Toastify** - Notificaciones
- **Heroicons** - Iconos

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/h3n-x/color-generator.git
cd color-generator

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

## Uso

1. **Selección de Color**: Usa el selector visual o ingresa valores manualmente en diferentes formatos
2. **Información del Color**: Revisa datos técnicos, accesibilidad y recomendaciones SEO
3. **Ejemplos UI**: Visualiza cómo se verían los componentes con tu color seleccionado
4. **Exportación**: Exporta tu paleta en el formato que necesites para tu proyecto

## Atajos de Teclado

- **R**: Genera un color aleatorio
- **P**: Abre/cierra el selector de color
- **C**: Copia el color actual al portapapeles

## Accesibilidad

Esta aplicación está diseñada con la accesibilidad como prioridad:

- Cálculo automático de contraste según estándares WCAG
- Adaptación dinámica del color del texto para garantizar legibilidad
- Indicadores visuales para colores con contraste insuficiente
- Componentes UI que muestran su puntuación de contraste

## Licencia

MIT

---

Desarrollado por H3n 2025
