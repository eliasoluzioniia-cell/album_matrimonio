// Set predefinito di Maschere e Bordi (masksData.js)

// Inline SVG Data URLs per pennellate e cornici decorative per garantire il rendering in ogni ambiente
const BRUSH_01_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 300"><path d="M10,40 Q80,10 250,30 Q420,50 490,20 Q480,140 495,250 Q380,280 240,260 Q100,275 10,240 Q25,120 10,40 Z" fill="black"/></svg>`;
const BRUSH_02_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 300"><path d="M20,20 Q150,5 300,25 Q450,40 480,15 Q495,150 475,280 Q320,295 180,270 Q40,285 20,260 Q5,150 20,20 Z" fill="black"/></svg>`;
const GRUNGE_01_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 300"><rect x="15" y="15" width="470" height="270" rx="20" fill="black"/></svg>`;
const FLOURISH_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 300"><path d="M30,30 Q250,5 470,30 Q495,150 470,270 Q250,295 30,270 Q5,150 30,30 Z" fill="black"/></svg>`;

export const defaultMasks = [
  // 1. Geometriche (Clip-Path / Shapes)
  { 
    id: 'rect-smooth', 
    name: 'Angoli Arrotondati', 
    type: 'shape', 
    css: 'border-radius: 16px;',
    styleObj: { borderRadius: '16px' }
  },
  { 
    id: 'circle', 
    name: 'Cerchio / Ovale', 
    type: 'shape', 
    css: 'border-radius: 50%;',
    styleObj: { borderRadius: '50%' }
  },
  { 
    id: 'hexagon', 
    name: 'Esagono', 
    type: 'clip', 
    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
    styleObj: { clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }
  },

  // 2. Sfumature / Feathering (CSS Radial & Linear Gradients)
  { 
    id: 'fade-radial', 
    name: 'Sfumatura Radiale', 
    type: 'gradient', 
    maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
    styleObj: { 
      WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
      maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)'
    }
  },
  { 
    id: 'fade-edges', 
    name: 'Sfumatura Bordi', 
    type: 'gradient', 
    maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
    styleObj: { 
      WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
      maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
    }
  },

  // 3. Artistiche & Spazzolate (SVG / Alpha PNG Masks)
  { 
    id: 'brush-stroke-01', 
    name: 'Pennellata Acrilica', 
    type: 'svg', 
    maskUrl: BRUSH_01_SVG,
    styleObj: { 
      WebkitMaskImage: `url("${BRUSH_01_SVG}")`,
      maskImage: `url("${BRUSH_01_SVG}")`,
      WebkitMaskSize: 'cover',
      maskSize: 'cover'
    }
  },
  { 
    id: 'brush-stroke-02', 
    name: 'Acquerello Bordo', 
    type: 'svg', 
    maskUrl: BRUSH_02_SVG,
    styleObj: { 
      WebkitMaskImage: `url("${BRUSH_02_SVG}")`,
      maskImage: `url("${BRUSH_02_SVG}")`,
      WebkitMaskSize: 'cover',
      maskSize: 'cover'
    }
  },
  { 
    id: 'vignette-grunge', 
    name: 'Bordo Rovinato', 
    type: 'svg', 
    maskUrl: GRUNGE_01_SVG,
    styleObj: { 
      WebkitMaskImage: `url("${GRUNGE_01_SVG}")`,
      maskImage: `url("${GRUNGE_01_SVG}")`,
      WebkitMaskSize: 'cover',
      maskSize: 'cover'
    }
  },

  // 4. Decorative
  { 
    id: 'frame-flourish', 
    name: 'Cornice Floreale', 
    type: 'svg', 
    maskUrl: FLOURISH_SVG,
    styleObj: { 
      WebkitMaskImage: `url("${FLOURISH_SVG}")`,
      maskImage: `url("${FLOURISH_SVG}")`,
      WebkitMaskSize: 'cover',
      maskSize: 'cover'
    }
  }
];
