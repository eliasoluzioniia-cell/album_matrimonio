// Libreria dei Preset Vettoriali per i Layout dell'Album
export const INITIAL_PRESETS = [
  // --- 1 IMMAGINE PER PAGINA / SPREAD ---
  {
    id: 'preset_full_1',
    title: 'Full Bleed 1 Foto (Doppia Pagina)',
    designLine: 'Full Bleed',
    imagesPerPage: '1',
    borderDistance: '0px / A filo',
    gapDistance: 'fissa',
    isFavorite: true,
    frames: [
      { left: '0%', top: '0%', width: '100%', height: '100%', zIndex: 1 }
    ]
  },
  {
    id: 'preset_simple_1_centered',
    title: '1 Foto Centrata con Passpartout',
    designLine: 'Semplice',
    imagesPerPage: '1',
    borderDistance: 'ampia',
    gapDistance: 'variabile',
    isFavorite: false,
    frames: [
      { left: '15%', top: '10%', width: '70%', height: '80%', zIndex: 1 }
    ]
  },
  {
    id: 'preset_classic_1_left',
    title: '1 Foto Pagina Sinistra',
    designLine: 'Classico',
    imagesPerPage: '1',
    borderDistance: 'fissa',
    gapDistance: 'variabile',
    isFavorite: false,
    frames: [
      { left: '4%', top: '5%', width: '44%', height: '90%', zIndex: 1 }
    ]
  },

  // --- 2 IMMAGINI PER PAGINA / SPREAD ---
  {
    id: 'preset_classic_2_side_by_side',
    title: '2 Foto Affiancate',
    designLine: 'Classico',
    imagesPerPage: '2',
    borderDistance: 'fissa',
    gapDistance: 'media',
    isFavorite: true,
    frames: [
      { left: '4%', top: '10%', width: '43%', height: '80%', zIndex: 1 },
      { left: '53%', top: '10%', width: '43%', height: '80%', zIndex: 1 }
    ]
  },
  {
    id: 'preset_modern_2_asymmetric',
    title: '2 Foto Asimmetriche Moderno',
    designLine: 'Moderno',
    imagesPerPage: '2',
    borderDistance: 'variabile',
    gapDistance: 'piccola',
    isFavorite: false,
    frames: [
      { left: '2%', top: '4%', width: '56%', height: '92%', zIndex: 1 },
      { left: '60%', top: '20%', width: '38%', height: '60%', zIndex: 1 }
    ]
  },
  {
    id: 'preset_pip_2',
    title: 'Picture in Picture 2 Foto',
    designLine: 'Pic in Pic',
    imagesPerPage: '2',
    borderDistance: '0px / A filo',
    gapDistance: 'ampia',
    isFavorite: false,
    frames: [
      { left: '0%', top: '0%', width: '100%', height: '100%', zIndex: 1 },
      { left: '55%', top: '15%', width: '40%', height: '55%', zIndex: 2 }
    ]
  },

  // --- 3 IMMAGINI PER PAGINA / SPREAD ---
  {
    id: 'preset_simple_3_grid',
    title: '3 Foto Triptico',
    designLine: 'Semplice',
    imagesPerPage: '3',
    borderDistance: 'fissa',
    gapDistance: 'piccola',
    isFavorite: true,
    frames: [
      { left: '3%', top: '10%', width: '30%', height: '80%', zIndex: 1 },
      { left: '35%', top: '10%', width: '30%', height: '80%', zIndex: 1 },
      { left: '67%', top: '10%', width: '30%', height: '80%', zIndex: 1 }
    ]
  },
  {
    id: 'preset_modern_3_featured',
    title: '1 Grande + 2 Piccole Verticali',
    designLine: 'Moderno',
    imagesPerPage: '3',
    borderDistance: 'fissa',
    gapDistance: 'piccola',
    isFavorite: false,
    frames: [
      { left: '3%', top: '5%', width: '55%', height: '90%', zIndex: 1 },
      { left: '61%', top: '5%', width: '36%', height: '43%', zIndex: 1 },
      { left: '61%', top: '52%', width: '36%', height: '43%', zIndex: 1 }
    ]
  },
  {
    id: 'preset_pip_3',
    title: 'Sfondo Full + 2 Inset',
    designLine: 'Pic in Pic',
    imagesPerPage: '3',
    borderDistance: 'variabile',
    gapDistance: 'media',
    isFavorite: true,
    frames: [
      { left: '0%', top: '0%', width: '100%', height: '100%', zIndex: 1 },
      { left: '5%', top: '10%', width: '42%', height: '50%', zIndex: 2 },
      { left: '53%', top: '35%', width: '42%', height: '50%', zIndex: 3 }
    ]
  },

  // --- 4 IMMAGINI PER PAGINA / SPREAD ---
  {
    id: 'preset_classic_4_grid',
    title: 'Griglia 4 Foto Bilanciata (2x2)',
    designLine: 'Classico',
    imagesPerPage: '4',
    borderDistance: 'fissa',
    gapDistance: 'media',
    isFavorite: true,
    frames: [
      { left: '4%', top: '6%', width: '43%', height: '42%', zIndex: 1 },
      { left: '53%', top: '6%', width: '43%', height: '42%', zIndex: 1 },
      { left: '4%', top: '52%', width: '43%', height: '42%', zIndex: 1 },
      { left: '53%', top: '52%', width: '43%', height: '42%', zIndex: 1 }
    ]
  },
  {
    id: 'preset_modern_4_asymmetric',
    title: '4 Foto Asimmetrico Moderno',
    designLine: 'Moderno',
    imagesPerPage: '4',
    borderDistance: 'variabile',
    gapDistance: 'piccola',
    isFavorite: false,
    frames: [
      { left: '3%', top: '4%', width: '45%', height: '92%', zIndex: 1 },
      { left: '51%', top: '4%', width: '46%', height: '28%', zIndex: 1 },
      { left: '51%', top: '36%', width: '46%', height: '28%', zIndex: 1 },
      { left: '51%', top: '68%', width: '46%', height: '28%', zIndex: 1 }
    ]
  },
  {
    id: 'preset_simple_4_strip',
    title: '4 Foto Striscia Orizzontale',
    designLine: 'Semplice',
    imagesPerPage: '4',
    borderDistance: 'ampia',
    gapDistance: 'piccola',
    isFavorite: false,
    frames: [
      { left: '4%', top: '25%', width: '21%', height: '50%', zIndex: 1 },
      { left: '27%', top: '25%', width: '21%', height: '50%', zIndex: 1 },
      { left: '50%', top: '25%', width: '21%', height: '50%', zIndex: 1 },
      { left: '73%', top: '25%', width: '21%', height: '50%', zIndex: 1 }
    ]
  },
  {
    id: 'preset_pip_4',
    title: 'Full Bleed + 3 Inset Sospesi',
    designLine: 'Pic in Pic',
    imagesPerPage: '4',
    borderDistance: '0px / A filo',
    gapDistance: 'media',
    isFavorite: true,
    frames: [
      { left: '0%', top: '0%', width: '100%', height: '100%', zIndex: 1 },
      { left: '4%', top: '8%', width: '28%', height: '40%', zIndex: 2 },
      { left: '36%', top: '8%', width: '28%', height: '40%', zIndex: 2 },
      { left: '68%', top: '8%', width: '28%', height: '40%', zIndex: 2 }
    ]
  },

  // --- 5+ IMMAGINI PER PAGINA / SPREAD ---
  {
    id: 'preset_classic_6_grid',
    title: 'Griglia 6 Foto (3x2)',
    designLine: 'Classico',
    imagesPerPage: '5+',
    borderDistance: 'fissa',
    gapDistance: 'piccola',
    isFavorite: true,
    frames: [
      { left: '3%', top: '6%', width: '29%', height: '42%', zIndex: 1 },
      { left: '35%', top: '6%', width: '29%', height: '42%', zIndex: 1 },
      { left: '67%', top: '6%', width: '29%', height: '42%', zIndex: 1 },
      { left: '3%', top: '52%', width: '29%', height: '42%', zIndex: 1 },
      { left: '35%', top: '52%', width: '29%', height: '42%', zIndex: 1 },
      { left: '67%', top: '52%', width: '29%', height: '42%', zIndex: 1 }
    ]
  },
  {
    id: 'preset_modern_5_collage',
    title: 'Collage 5 Foto Misto',
    designLine: 'Moderno',
    imagesPerPage: '5+',
    borderDistance: 'variabile',
    gapDistance: 'piccola',
    isFavorite: false,
    frames: [
      { left: '2%', top: '4%', width: '45%', height: '92%', zIndex: 1 },
      { left: '49%', top: '4%', width: '24%', height: '44%', zIndex: 1 },
      { left: '74%', top: '4%', width: '24%', height: '44%', zIndex: 1 },
      { left: '49%', top: '52%', width: '24%', height: '44%', zIndex: 1 },
      { left: '74%', top: '52%', width: '24%', height: '44%', zIndex: 1 }
    ]
  }
];
