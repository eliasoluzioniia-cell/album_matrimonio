/**
 * Helper per la composizione degli URL Cloudinary CDN, Mappatura Smart
 * e Caricamento Diretto REST API per l'Album di Matrimonio.
 */

const CLOUD_NAME = 'jkxwp5hj';
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}`;
const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

/**
 * Mappatura iniziale dei Public ID reali su Cloudinary per i file del matrimonio
 * I Public ID su Cloudinary jkxwp5hj sono registrati direttamente nel root dell'account.
 */
const CLOUDINARY_PUBLIC_MAP = {
  'DSC_0081.JPG': 'v1784975418/DSC_0081_feblep.jpg',
  'DSC_0081': 'v1784975418/DSC_0081_feblep.jpg',
  'DSCN4918.JPG': 'DSCN4918.JPG_ft_ggswnd.jpg',
  'DSCN4918': 'DSCN4918.JPG_ft_ggswnd.jpg',
  'DSCN4898.JPG': 'DSCN4898.JPG_ft_znke8w.jpg',
  'DSCN4898': 'DSCN4898.JPG_ft_znke8w.jpg',
  'DSC_0270.JPG': 'DSC_0270_msm6wp.jpg',
  'DSC_0270': 'DSC_0270_msm6wp.jpg',
  'al_comune': 'al_comune_mqj3v9.jpg',
  'al comune.JPG': 'al_comune_mqj3v9.jpg',
  'al comune': 'al_comune_mqj3v9.jpg',
  'matrimonio_comune1': 'matrimonio_comune1_s6qf1i',
  'matrimonio_comune1_s6qf1i': 'matrimonio_comune1_s6qf1i'
};

/**
 * Verifica se la sorgente o l'estensione corrisponde a un file video
 */
export function isVideoFile(src) {
  if (!src) return false;
  const str = String(src).toLowerCase();
  return str.endsWith('.mp4') || str.endsWith('.mov') || str.endsWith('.webm') || str.endsWith('.m4v') || str.includes('video') || str.includes('matrimonio_comune');
}

/**
 * Genera l'URL ottimizzato per un'immagine,
 * risolvendo con intelligenza sia Cloudinary CDN sia le immagini locali su Vercel.
 */
export function getCloudinaryUrl(publicIdOrSrc, options = {}) {
  if (!publicIdOrSrc) return '';

  if (publicIdOrSrc.startsWith('data:') || publicIdOrSrc.startsWith('blob:')) {
    return publicIdOrSrc;
  }

  let inputSrc = publicIdOrSrc;

  // Se è un URL di vercel completo, estrai il nome file per mapparlo
  if (inputSrc.includes('vercel.app')) {
    const parts = inputSrc.split('/');
    inputSrc = decodeURIComponent(parts.pop());
  }

  // Se è già un URL completo http/https
  if (inputSrc.startsWith('http://') || inputSrc.startsWith('https://')) {
    let finalUrl = inputSrc.replace(/matrimonio%20fabio%20tiziana\//g, '').replace(/matrimonio_fabio_tiziana\//g, '');
    if (options.cropParams && options.cropParams.w && options.cropParams.h) {
      const { w, h, x, y } = options.cropParams;
      const cropStr = `c_crop,w_${Math.round(w)},h_${Math.round(h)},x_${Math.round(x || 0)},y_${Math.round(y || 0)},f_auto,q_auto`;
      if (finalUrl.includes('/upload/')) {
        return finalUrl.replace('/upload/', `/upload/${cropStr}/`);
      }
    }
    if (!finalUrl.includes('/f_auto,q_auto/') && finalUrl.includes('/upload/')) {
      return finalUrl.replace('/upload/', '/upload/f_auto,q_auto/');
    }
    return finalUrl;
  }

  // Pulisci il percorso rimuovendo gli slash iniziali e la cartella locale
  let cleanId = inputSrc.replace(/^\//, '');
  const fileName = cleanId.split('/').pop();
  const rawBaseName = fileName.replace(/\.[^/.]+$/, "");

  // Se è un percorso locale (es. /login/IMG_2281.JPG) e non ha un Public ID mappato su Cloudinary, usa il file locale Vercel!
  if (inputSrc.startsWith('/')) {
    if (CLOUDINARY_PUBLIC_MAP[fileName] || CLOUDINARY_PUBLIC_MAP[cleanId] || CLOUDINARY_PUBLIC_MAP[rawBaseName]) {
      cleanId = CLOUDINARY_PUBLIC_MAP[fileName] || CLOUDINARY_PUBLIC_MAP[cleanId] || CLOUDINARY_PUBLIC_MAP[rawBaseName];
    } else {
      return inputSrc;
    }
  } else {
    if (CLOUDINARY_PUBLIC_MAP[fileName]) {
      cleanId = CLOUDINARY_PUBLIC_MAP[fileName];
    } else if (CLOUDINARY_PUBLIC_MAP[cleanId]) {
      cleanId = CLOUDINARY_PUBLIC_MAP[cleanId];
    } else if (CLOUDINARY_PUBLIC_MAP[rawBaseName]) {
      cleanId = CLOUDINARY_PUBLIC_MAP[rawBaseName];
    } else {
      cleanId = encodeURIComponent(fileName);
    }
  }

  const transforms = [];

  if (options.cropParams && options.cropParams.w && options.cropParams.h) {
    const { w, h, x, y } = options.cropParams;
    transforms.push(`c_crop,w_${Math.round(w)},h_${Math.round(h)},x_${Math.round(x || 0)},y_${Math.round(y || 0)}`);
  }

  transforms.push('f_auto', 'q_auto');

  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop && !options.cropParams) transforms.push(`c_${options.crop}`);

  const transformString = transforms.join(',');
  return `${CLOUDINARY_BASE_URL}/image/upload/${transformString}/${cleanId}`;
}

/**
 * Genera l'URL per la riproduzione del video su Cloudinary (f_auto, q_auto)
 */
export function getCloudinaryVideoUrl(publicIdOrSrc) {
  if (!publicIdOrSrc) return '';

  if (publicIdOrSrc.startsWith('data:') || publicIdOrSrc.startsWith('blob:')) {
    return publicIdOrSrc;
  }

  let inputSrc = publicIdOrSrc;
  if (inputSrc.includes('vercel.app')) {
    inputSrc = decodeURIComponent(inputSrc.split('/').pop());
  }

  if (inputSrc.startsWith('http://') || inputSrc.startsWith('https://')) {
    return inputSrc.replace(/matrimonio%20fabio%20tiziana\//g, '').replace(/matrimonio_fabio_tiziana\//g, '');
  }

  let cleanId = inputSrc.replace(/^\//, '');
  const fileName = cleanId.split('/').pop();
  const rawBaseName = fileName.replace(/\.[^/.]+$/, "");

  if (inputSrc.startsWith('/') && !CLOUDINARY_PUBLIC_MAP[fileName] && !CLOUDINARY_PUBLIC_MAP[rawBaseName]) {
    return inputSrc;
  }

  if (CLOUDINARY_PUBLIC_MAP[fileName]) {
    cleanId = CLOUDINARY_PUBLIC_MAP[fileName];
  } else if (CLOUDINARY_PUBLIC_MAP[rawBaseName]) {
    cleanId = CLOUDINARY_PUBLIC_MAP[rawBaseName];
  } else {
    if (!cleanId.endsWith('.mp4') && !cleanId.endsWith('.mov') && !cleanId.endsWith('.webm')) {
      cleanId += '.mp4';
    }
    cleanId = encodeURIComponent(cleanId);
  }

  return `${CLOUDINARY_BASE_URL}/video/upload/f_auto,q_auto/${cleanId}`;
}

/**
 * Genera l'URL per la copertina/fotogramma statico del video (so_[secondi])
 */
export function getCloudinaryVideoPosterUrl(publicIdOrSrc, options = {}) {
  if (!publicIdOrSrc) return '';

  if (publicIdOrSrc.startsWith('data:') || publicIdOrSrc.startsWith('blob:')) {
    return publicIdOrSrc;
  }

  const startOffset = options.startOffset || 0;
  let inputSrc = publicIdOrSrc;
  if (inputSrc.includes('vercel.app')) {
    inputSrc = decodeURIComponent(inputSrc.split('/').pop());
  }

  if (inputSrc.startsWith('http://') || inputSrc.startsWith('https://')) {
    let posterUrl = inputSrc.replace(/matrimonio%20fabio%20tiziana\//g, '').replace(/matrimonio_fabio_tiziana\//g, '').replace(/\.(mp4|mov|webm|m4v)$/i, '.jpg');
    if (posterUrl.includes('/video/upload/')) {
      if (!posterUrl.includes(`so_${startOffset}`)) {
        return posterUrl.replace('/video/upload/', `/video/upload/f_auto,q_auto,so_${startOffset}/`);
      }
    } else if (posterUrl.includes('/image/upload/')) {
      if (!posterUrl.includes('/f_auto,q_auto/')) {
        return posterUrl.replace('/image/upload/', '/image/upload/f_auto,q_auto/');
      }
    }
    return posterUrl;
  }

  let cleanId = inputSrc.replace(/^\//, '');
  const fileName = cleanId.split('/').pop();
  const rawBaseName = fileName.replace(/\.[^/.]+$/, "");

  if (inputSrc.startsWith('/') && !CLOUDINARY_PUBLIC_MAP[fileName] && !CLOUDINARY_PUBLIC_MAP[rawBaseName]) {
    return inputSrc.replace(/\.(mp4|mov|webm|m4v)$/i, '') + '.jpg';
  }

  if (CLOUDINARY_PUBLIC_MAP[fileName]) {
    cleanId = CLOUDINARY_PUBLIC_MAP[fileName];
  } else if (CLOUDINARY_PUBLIC_MAP[rawBaseName]) {
    cleanId = CLOUDINARY_PUBLIC_MAP[rawBaseName];
  } else {
    cleanId = cleanId.replace(/\.(mp4|mov|webm|m4v)$/i, '') + '.jpg';
    cleanId = encodeURIComponent(cleanId);
  }

  const transforms = [];

  if (options.cropParams && options.cropParams.w && options.cropParams.h) {
    const { w, h, x, y } = options.cropParams;
    transforms.push(`c_crop,w_${Math.round(w)},h_${Math.round(h)},x_${Math.round(x || 0)},y_${Math.round(y || 0)}`);
  }

  transforms.push('f_auto', 'q_auto', `so_${startOffset}`);

  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);

  const transformString = transforms.join(',');
  return `${CLOUDINARY_BASE_URL}/video/upload/${transformString}/${cleanId}`;
}

/**
 * Invia una foto o video direttamente alle API REST di Cloudinary
 */
export async function uploadToCloudinary(file, folder = 'matrimonio fabio tiziana') {
  if (!file) throw new Error('Nessun file selezionato per il caricamento');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default');
  if (folder) {
    formData.append('folder', folder);
  }

  try {
    const response = await fetch(CLOUDINARY_API_URL, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn('Risposta caricamento Cloudinary:', errorData);
      
      const objectUrl = URL.createObjectURL(file);
      return {
        secure_url: objectUrl,
        public_id: file.name,
        isLocalBlob: true
      };
    }

    const data = await response.json();
    return {
      secure_url: data.secure_url,
      public_id: data.public_id || data.secure_url || file.name,
      isLocalBlob: false
    };
  } catch (err) {
    console.error('Errore durante l\'invio a Cloudinary:', err);
    const objectUrl = URL.createObjectURL(file);
    return {
      secure_url: objectUrl,
      public_id: file.name,
      isLocalBlob: true
    };
  }
}

/**
 * Risolve il percorso locale di fallback
 */
export function resolveLocalFallback(publicIdOrSrc, pageFolder = '') {
  if (!publicIdOrSrc) return '';

  if (publicIdOrSrc.startsWith('blob:') || publicIdOrSrc.startsWith('data:') || publicIdOrSrc.startsWith('http://') || publicIdOrSrc.startsWith('https://')) {
    return publicIdOrSrc;
  }

  if (publicIdOrSrc.startsWith('/')) {
    return publicIdOrSrc;
  }

  if (pageFolder) {
    return `/${pageFolder}/${publicIdOrSrc}`;
  }

  return `/${publicIdOrSrc}`;
}

/**
 * Invia una richiesta di eliminazione file alle API Cloudinary
 */
export async function deleteFromCloudinary(publicIdOrUrl) {
  if (!publicIdOrUrl) return { success: false };

  const isVid = isVideoFile(publicIdOrUrl);
  const resourceType = isVid ? 'video' : 'image';

  let publicId = publicIdOrUrl;
  if (publicIdOrUrl.includes('/upload/')) {
    const parts = publicIdOrUrl.split('/upload/');
    if (parts[1]) {
      const pathParts = parts[1].split('/');
      publicId = pathParts.slice(-2).join('/').replace(/\.[^/.]+$/, "");
    }
  }

  try {
    const destroyUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/destroy`;
    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('upload_preset', 'ml_default');

    await fetch(destroyUrl, {
      method: 'POST',
      body: formData
    }).catch(() => {});

    return { success: true, publicId };
  } catch (err) {
    console.warn('Cancellazione Cloudinary ignorata:', err);
    return { success: false, error: err.message };
  }
}
