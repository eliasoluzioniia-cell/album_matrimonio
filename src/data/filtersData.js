// Set predefinito di Filtri Colorimetrici e Valori Slider (filtersData.js)

export const defaultFilterPresets = [
  { id: 'original', name: 'Originale', filter: 'none', values: { brightness: 100, contrast: 100, saturate: 100, blur: 0, hueRotate: 0 } },
  { id: 'bw-classic', name: 'Bianco & Nero', filter: 'grayscale(100%) contrast(110%)', values: { brightness: 100, contrast: 110, saturate: 0, blur: 0, hueRotate: 0 } },
  { id: 'sepia-vintage', name: 'Seppia Vintage', filter: 'sepia(80%) contrast(95%) brightness(95%)', values: { brightness: 95, contrast: 95, saturate: 80, blur: 0, hueRotate: 0 } },
  { id: 'warm-sun', name: 'Caldo', filter: 'sepia(20%) saturate(130%) brightness(105%)', values: { brightness: 105, contrast: 100, saturate: 130, blur: 0, hueRotate: 0 } },
  { id: 'cool-breeze', name: 'Freddo', filter: 'hue-rotate(180deg) saturate(90%)', values: { brightness: 100, contrast: 100, saturate: 90, blur: 0, hueRotate: 180 } },
  { id: 'soft-portrait', name: 'Ritratto Morbido', filter: 'brightness(108%) contrast(92%) saturate(95%)', values: { brightness: 108, contrast: 92, saturate: 95, blur: 0, hueRotate: 0 } }
];

export const DEFAULT_SLIDER_VALUES = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  blur: 0,
  hueRotate: 0
};

export const buildFilterCssString = (vals) => {
  if (!vals) return 'none';
  const parts = [];
  if (vals.brightness !== undefined && vals.brightness !== 100) parts.push(`brightness(${vals.brightness}%)`);
  if (vals.contrast !== undefined && vals.contrast !== 100) parts.push(`contrast(${vals.contrast}%)`);
  if (vals.saturate !== undefined && vals.saturate !== 100) parts.push(`saturate(${vals.saturate}%)`);
  if (vals.blur !== undefined && vals.blur > 0) parts.push(`blur(${vals.blur}px)`);
  if (vals.hueRotate !== undefined && vals.hueRotate !== 0) parts.push(`hue-rotate(${vals.hueRotate}deg)`);
  
  return parts.length > 0 ? parts.join(' ') : 'none';
};
