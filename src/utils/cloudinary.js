/**
 * Helper per la composizione degli URL Cloudinary CDN, Mappatura Smart
 * e Caricamento Diretto REST API per l'Album di Matrimonio.
 */

const CLOUD_NAME = 'jkxwp5hj';
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}`;
const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

/**
 * Mappatura iniziale dei Public ID reali su Cloudinary per i file del matrimonio
 */
const CLOUDINARY_PUBLIC_MAP = {
  'DSC_0081.JPG': 'v1784975418/DSC_0081_feblep.jpg',
  'DSC_0081': 'v1784975418/DSC_0081_feblep.jpg',
  'DSCN4918.JPG': 'v1784975465/DSCN4918.JPG_ft_ggswnd.jpg',
  'DSCN4918': 'v1784975465/DSCN4918.JPG_ft_ggswnd.jpg',
  'DSCN4898.JPG': 'v1784975466/DSCN4898.JPG_ft_znke8w.jpg',
  'DSCN4898': 'v1784975466/DSCN4898.JPG_ft_znke8w.jpg'
};

/**
 * Verifica se la sorgente o l'estensione corrisponde a un file video
 */
export function isVideoFile(src) {
  if (!src) return false;
  const str = String(src).toLowerCase();
  return str.endsWith('.mp4') || str.endsWith('.mov') || str.endsWith('.webm') || str.endsWith('.m4v') || str.includes('video');
}

/**
 * Genera l'URL ottimizzato di Cloudinary per un'immagine,
 * risolvendo al volo Public ID, URL completi e trasformazioni c_crop.
 */
export function getCloudinaryUrl(publicIdOrSrc, options = {}) {
  if (!publicIdOrSrc) return '';

  if (publicIdOrSrc.startsWith('data:') || publicIdOrSrc.startsWith('blob:')) {
    return publicIdOrSrc;
  }

  // Se è già un URL completo di Cloudinary
  if (publicIdOrSrc.startsWith('http://') || publicIdOrSrc.startsWith('https://')) {
    let finalUrl = publicIdOrSrc;
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
  let cleanId = publicIdOrSrc.replace(/^\//, '');
  const fileName = cleanId.split('/').pop();

  // Verifica se esiste una mappatura esplicita per questo file
  if (CLOUDINARY_PUBLIC_MAP[fileName]) {
    cleanId = CLOUDINARY_PUBLIC_MAP[fileName];
  } else if (CLOUDINARY_PUBLIC_MAP[cleanId]) {
    cleanId = CLOUDINARY_PUBLIC_MAP[cleanId];
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

  if (publicIdOrSrc.startsWith('http://') || publicIdOrSrc.startsWith('https://')) {
    return publicIdOrSrc;
  }

  let cleanId = publicIdOrSrc.replace(/^\//, '');
  if (!cleanId.endsWith('.mp4') && !cleanId.endsWith('.mov') && !cleanId.endsWith('.webm')) {
    cleanId += '.mp4';
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

  if (publicIdOrSrc.startsWith('http://') || publicIdOrSrc.startsWith('https://')) {
    let posterUrl = publicIdOrSrc.replace(/\.(mp4|mov|webm|m4v)$/i, '.jpg');
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

  let cleanId = publicIdOrSrc.replace(/^\//, '');
  cleanId = cleanId.replace(/\.(mp4|mov|webm|m4v)$/i, '') + '.jpg';

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
