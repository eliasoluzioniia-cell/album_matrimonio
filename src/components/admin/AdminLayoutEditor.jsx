import React, { useState, useEffect, useRef } from 'react';
import { 
  Eye, 
  Save, 
  Upload, 
  Plus, 
  Trash2, 
  Layout, 
  ChevronLeft, 
  ChevronRight, 
  Download,
  Scissors,
  Sliders,
  Move,
  CheckCircle,
  Crop,
  Film,
  Play,
  UploadCloud,
  Check,
  Palette,
  Type
} from 'lucide-react';
import LayoutPanel from './LayoutPanel';
import MasksPanel from './MasksPanel';
import FiltersPanel from './FiltersPanel';
import PositionPanel from './PositionPanel';
import VideoPanel from './VideoPanel';
import BackgroundPanel from './BackgroundPanel';
import TextPanel from './TextPanel';
import CropModal from './CropModal';
import initialAlbumData from '../../albumData.json';
import initialLayoutCoords from '../../layoutCoordinates.json';
import { defaultMasks } from '../../data/masksData';
import { defaultFilterPresets, DEFAULT_SLIDER_VALUES, buildFilterCssString } from '../../data/filtersData';
import { 
  getCloudinaryUrl, 
  getCloudinaryVideoPosterUrl, 
  isVideoFile, 
  resolveLocalFallback,
  uploadToCloudinary,
  deleteFromCloudinary 
} from '../../utils/cloudinary';
import { syncLayoutToGitHub } from '../../utils/githubSync';
import './AdminLayoutEditor.css';

export default function AdminLayoutEditor({ onSwitchToViewer }) {
  // Inizializzazione pulita dai file JSON per garantire la visibilita di tutte le 16 doppie pagine e pg 1
  const [albumPages, setAlbumPages] = useState(initialAlbumData.pages);
  const [layoutCoords, setLayoutCoords] = useState(initialLayoutCoords);

  const handleResetToJSON = () => {
    if (window.confirm("Vuoi ripristinare l'ultima configurazione salvata nel file JSON?")) {
      localStorage.removeItem('admin_album_pages');
      localStorage.removeItem('admin_layout_coords');
      setAlbumPages(initialAlbumData.pages);
      setLayoutCoords(initialLayoutCoords);
      setActivePageIndex(0);
      showNotification("Layout ripristinato con successo dal file JSON salvato!");
    }
  };

  const [activePageIndex, setActivePageIndex] = useState(0);
  const [activeSidebarTab, setActiveSidebarTab] = useState('layout'); // 'layout' | 'masks' | 'filters' | 'position' | 'video'
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePresetId, setActivePresetId] = useState(null);
  const [selectedFrameIndex, setSelectedFrameIndex] = useState(0);
  const [dragHoverFrameIndex, setDragHoverFrameIndex] = useState(null);
  const [isCroppingInPlace, setIsCroppingInPlace] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isUploadingToCloudinary, setIsUploadingToCloudinary] = useState(false);
  const [notification, setNotification] = useState('');

  // Dragging & Resizing States
  const isDragging = useRef(false);
  const isInnerPanning = useRef(false);
  const isResizing = useRef(null);
  const isCropInsetResizing = useRef(null);
  const startMousePos = useRef({ x: 0, y: 0 });
  const startFrameRect = useRef({ left: 0, top: 0, width: 0, height: 0 });
  const startInnerCrop = useRef({ zoom: 1.0, offsetX: 0, offsetY: 0 });
  const startCropInset = useRef({ top: 0, right: 0, bottom: 0, left: 0 });
  const framePxRect = useRef({ width: 1, height: 1 });
  const draggedMediaUrlRef = useRef(null);

  const sheetRef = useRef(null);

  // Sincronizzazione localStorage ed emissione evento in tempo reale
  useEffect(() => {
    localStorage.setItem('admin_album_pages', JSON.stringify(albumPages));
    localStorage.setItem('admin_layout_coords', JSON.stringify(layoutCoords));
    window.dispatchEvent(new CustomEvent('admin_layout_updated'));
  }, [albumPages, layoutCoords]);

  const currentPage = albumPages[activePageIndex] || albumPages[0];

  // Garantisce che la pagina corrente sia sempre presente in layoutCoords
  const currentPageCoords = layoutCoords.find(c => c.folder === currentPage?.name || (currentPage?.name === 'pg 1' && c.folder === 'login')) || {
    folder: currentPage?.name,
    elements: currentPage?.images?.map((img, idx) => ({
      file: img,
      type: isVideoFile(img) ? 'video' : 'image',
      left: currentPage?.isSpread ? `${(idx % 2) * 50}%` : '10%',
      top: '5%',
      width: currentPage?.isSpread ? '45%' : '80%',
      height: '90%',
      zIndex: idx + 1
    })) || []
  };

  const safeElements = Array.isArray(currentPageCoords?.elements) ? currentPageCoords.elements : [];
  const selectedElement = safeElements[selectedFrameIndex] || safeElements[0] || null;

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  // Helper per assicurare l'esistenza della voce di pagina in layoutCoords
  const updateOrEnsurePageCoords = (updateFn) => {
    setLayoutCoords(prev => {
      const exists = prev.some(c => c.folder === currentPage.name);
      if (exists) {
        return prev.map(c => {
          if (c.folder !== currentPage.name) return c;
          return updateFn(c);
        });
      } else {
        const initialPageObj = {
          pageIndex: activePageIndex + 1,
          folder: currentPage.name,
          elements: currentPageCoords.elements
        };
        const updatedPageObj = updateFn(initialPageObj);
        return [...prev, updatedPageObj];
      }
    });
  };

  // 1. Applicazione Layout Preset
  const handleSelectPreset = (preset) => {
    setActivePresetId(preset.id);
    const currentImages = currentPage.images || [];
    const newElements = preset.frames.map((frame, idx) => {
      const prevEl = currentPageCoords.elements[idx];
      const fileSrc = currentImages[idx] || prevEl?.file || null;
      return {
        file: fileSrc,
        type: isVideoFile(fileSrc) ? 'video' : 'image',
        left: frame.left,
        top: frame.top,
        width: frame.width,
        height: frame.height,
        zIndex: frame.zIndex || idx + 1,
        mask: prevEl?.mask || null,
        filters: prevEl?.filters || null,
        effect: prevEl?.effect || 'none',
        videoSettings: prevEl?.videoSettings || { autoplay: false, loop: true, muted: true, controls: true, startOffset: 0 },
        innerCrop: prevEl?.innerCrop || { zoom: 1.0, offsetX: 0, offsetY: 0, aspectRatioLocked: true }
      };
    });

    updateOrEnsurePageCoords(pageObj => ({
      ...pageObj,
      template: preset.id,
      elements: newElements
    }));

    showNotification(`Layout "${preset.title}" applicato alla pagina ${currentPage.name}`);
  };

  // 2. Specchia Layout (mirrorLayout)
  const handleMirrorLayout = () => {
    updateOrEnsurePageCoords(pageObj => {
      const mirroredElements = pageObj.elements.map(el => {
        const leftVal = parseFloat(el.left);
        const widthVal = parseFloat(el.width);
        const newLeft = 100 - (leftVal + widthVal);
        return {
          ...el,
          left: `${Math.max(0, Math.round(newLeft * 10) / 10)}%`
        };
      });
      return { ...pageObj, elements: mirroredElements };
    });

    showNotification(`Layout specchiato per la pagina ${currentPage.name}`);
  };

  // 3. Maschere & Bordi
  const handleSelectMask = (mask) => {
    updateOrEnsurePageCoords(pageObj => {
      const updatedElements = pageObj.elements.map((el, idx) => {
        if (idx === selectedFrameIndex) {
          return {
            ...el,
            mask: {
              active: true,
              id: mask.id,
              name: mask.name,
              styleObj: mask.styleObj,
              styleString: mask.css || mask.maskImage || mask.clipPath || ''
            }
          };
        }
        return el;
      });
      return { ...pageObj, elements: updatedElements };
    });
    showNotification(`Maschera "${mask.name}" applicata alla foto ${selectedFrameIndex + 1}`);
  };

  const handleRemoveMask = () => {
    updateOrEnsurePageCoords(pageObj => {
      const updatedElements = pageObj.elements.map((el, idx) => {
        if (idx === selectedFrameIndex) {
          return { ...el, mask: null };
        }
        return el;
      });
      return { ...pageObj, elements: updatedElements };
    });
    showNotification(`Maschera rimossa dalla foto ${selectedFrameIndex + 1}`);
  };

  const handleApplyMaskToAll = () => {
    const currentMask = selectedElement?.mask;
    if (!currentMask) {
      showNotification('Seleziona una foto con una maschera per applicarla a tutte');
      return;
    }
    updateOrEnsurePageCoords(pageObj => {
      const updatedElements = pageObj.elements.map(el => ({ ...el, mask: currentMask }));
      return { ...pageObj, elements: updatedElements };
    });
    showNotification(`Maschera "${currentMask.name}" applicata a tutte le foto della pagina`);
  };

  // 4. Filtri Colorimetrici & Effetti Dinamici
  const handleUpdateFilterValues = (newVals, presetId = 'custom') => {
    const cssStr = buildFilterCssString(newVals);
    updateOrEnsurePageCoords(pageObj => {
      const updatedElements = pageObj.elements.map((el, idx) => {
        if (idx === selectedFrameIndex) {
          return {
            ...el,
            filters: {
              preset: presetId,
              values: newVals,
              cssString: cssStr
            }
          };
        }
        return el;
      });
      return { ...pageObj, elements: updatedElements };
    });
  };

  const handleSelectFilterPreset = (preset) => {
    handleUpdateFilterValues(preset.values, preset.id);
    showNotification(`Filtro "${preset.name}" applicato alla foto ${selectedFrameIndex + 1}`);
  };

  const handleSelectEffect = (effectId) => {
    updateOrEnsurePageCoords(pageObj => {
      const updatedElements = pageObj.elements.map((el, idx) => {
        if (idx === selectedFrameIndex) {
          return { ...el, effect: effectId };
        }
        return el;
      });
      return { ...pageObj, elements: updatedElements };
    });
    showNotification(`Effetto dinamico "${effectId}" applicato alla foto ${selectedFrameIndex + 1}`);
  };

  const handleUpdateVideoSettings = (newVideoSettings) => {
    updateOrEnsurePageCoords(pageObj => {
      const updatedElements = pageObj.elements.map((el, idx) => {
        if (idx === selectedFrameIndex) {
          return {
            ...el,
            type: 'video',
            videoSettings: newVideoSettings
          };
        }
        return el;
      });
      return { ...pageObj, elements: updatedElements };
    });
    showNotification('Impostazioni video aggiornate!');
  };

  const handleUpdateElementFile = (newFileUrl) => {
    updateOrEnsurePageCoords(pageObj => {
      const updatedElements = pageObj.elements.map((el, idx) => {
        if (idx === selectedFrameIndex) {
          const isVid = isVideoFile(newFileUrl) || el.type === 'video';
          return {
            ...el,
            file: newFileUrl,
            cloudinaryPublicId: newFileUrl,
            type: isVid ? 'video' : 'image'
          };
        }
        return el;
      });
      return { ...pageObj, elements: updatedElements };
    });
    showNotification('Media Cloudinary aggiornato!');
  };

  const handleAssignImageToFrame = (frameIndex, mediaUrl) => {
    if (!mediaUrl) return;
    const isVid = isVideoFile(mediaUrl);
    updateOrEnsurePageCoords(pageObj => {
      const updatedElements = pageObj.elements.map((el, idx) => {
        if (idx === frameIndex) {
          return {
            ...el,
            file: mediaUrl,
            cloudinaryPublicId: mediaUrl,
            type: isVid ? 'video' : 'image'
          };
        }
        return el;
      });
      return { ...pageObj, elements: updatedElements };
    });
    setSelectedFrameIndex(frameIndex);
    showNotification(`${isVid ? 'Video' : 'Foto'} assegnata al Riquadro #${frameIndex + 1}!`);
  };

  const handleDropNewFrameOnSheet = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!sheetRef.current || isDragging.current || isResizing.current || isCropInsetResizing.current) {
      draggedMediaUrlRef.current = null;
      return;
    }

    const droppedMediaUrl = draggedMediaUrlRef.current;
    draggedMediaUrlRef.current = null;
    if (!droppedMediaUrl) return;

    const sheetRect = sheetRef.current.getBoundingClientRect();
    const mouseX = e.clientX - sheetRect.left;
    const mouseY = e.clientY - sheetRect.top;

    const dropXPercent = Math.max(0, Math.min(65, Math.round(((mouseX / sheetRect.width) * 100 - 17.5) * 10) / 10));
    const dropYPercent = Math.max(0, Math.min(65, Math.round(((mouseY / sheetRect.height) * 100 - 17.5) * 10) / 10));

    const isVid = isVideoFile(droppedMediaUrl);

    updateOrEnsurePageCoords(pageObj => {
      const newIdx = pageObj.elements.length;
      const newFrame = {
        id: `item_${newIdx + 1}`,
        type: isVid ? 'video' : 'image',
        file: droppedMediaUrl,
        cloudinaryPublicId: droppedMediaUrl,
        left: `${dropXPercent}%`,
        top: `${dropYPercent}%`,
        width: '35%',
        height: '35%',
        zIndex: newIdx + 1,
        rotation: 0,
        effect: 'none',
        innerCrop: { zoom: 1.0, offsetX: 0, offsetY: 0, aspectRatioLocked: true },
        mask: { active: false, id: 'none', styleString: '' },
        filters: { preset: 'original', values: DEFAULT_SLIDER_VALUES, cssString: 'none' }
      };
      setSelectedFrameIndex(newIdx);
      return {
        ...pageObj,
        elements: [...pageObj.elements, newFrame]
      };
    });

    showNotification(`Nuova cornice ${isVid ? 'Video' : 'Foto'} creata nell'area bianca dell'album!`);
  };

  const handleDeleteFrameElement = (frameIndex) => {
    updateOrEnsurePageCoords(pageObj => {
      const updatedElements = pageObj.elements.filter((_, idx) => idx !== frameIndex);
      return { ...pageObj, elements: updatedElements };
    });
    setSelectedFrameIndex(prev => Math.max(0, prev - 1));
    showNotification(`Cornice #${frameIndex + 1} eliminata dalla pagina! (Il media rimane salvato nel Media Pool in basso)`);
  };

  const handleAddTextElement = () => {
    updateOrEnsurePageCoords(pageObj => {
      const newIdx = pageObj.elements.length;
      const newTextEl = {
        id: `text_${Date.now()}`,
        type: 'text',
        text: 'Tiziana e Fabio',
        left: '25%',
        top: '20%',
        width: '50%',
        height: '15%',
        fontFamily: "'Great Vibes', cursive",
        fontSize: 40,
        color: '#1e293b',
        align: 'center',
        bold: false,
        italic: false,
        underline: false,
        zIndex: newIdx + 1
      };
      setSelectedFrameIndex(newIdx);
      return {
        ...pageObj,
        elements: [...pageObj.elements, newTextEl]
      };
    });
    setActiveSidebarTab('text');
    setIsSidebarOpen(true);
    showNotification('Nuovo testo aggiunto all\'album! Modificalo dal pannello Editor di Testo.');
  };

  const handleUpdateTextProp = (propName, value) => {
    updateOrEnsurePageCoords(pageObj => {
      const updatedElements = pageObj.elements.map((el, idx) => {
        if (idx === selectedFrameIndex) {
          return {
            ...el,
            [propName]: value
          };
        }
        return el;
      });
      return { ...pageObj, elements: updatedElements };
    });
  };

  const handleSelectBgColor = (colorHex) => {
    updateOrEnsurePageCoords(pageObj => {
      return { ...pageObj, backgroundColor: colorHex };
    });
    showNotification(`Colore di sfondo pagina aggiornato!`);
  };

  const handleResetFilters = () => {
    handleUpdateFilterValues(DEFAULT_SLIDER_VALUES, 'original');
    showNotification(`Filtri azzerati per la foto ${selectedFrameIndex + 1}`);
  };

  const handleApplyFilterToAll = () => {
    const currentFilter = selectedElement?.filters || {
      preset: 'original',
      values: DEFAULT_SLIDER_VALUES,
      cssString: 'none'
    };

    updateOrEnsurePageCoords(pageObj => {
      const updatedElements = pageObj.elements.map(el => ({ ...el, filters: currentFilter }));
      return { ...pageObj, elements: updatedElements };
    });
    showNotification('Filtro applicato a tutte le foto della pagina');
  };

  // 5. Posizione, Ritaglio & Allineamento
  const handleUpdateElementRect = (updatedEl) => {
    updateOrEnsurePageCoords(pageObj => {
      const updatedElements = pageObj.elements.map((el, idx) => {
        if (idx === selectedFrameIndex) {
          return { ...el, ...updatedEl };
        }
        return el;
      });
      return { ...pageObj, elements: updatedElements };
    });
  };

  const handleUpdateInnerCrop = (newInnerCrop) => {
    updateOrEnsurePageCoords(pageObj => {
      const updatedElements = pageObj.elements.map((el, idx) => {
        if (idx === selectedFrameIndex) {
          return { ...el, innerCrop: newInnerCrop };
        }
        return el;
      });
      return { ...pageObj, elements: updatedElements };
    });
  };

  const handleAlignElement = (alignType) => {
    if (!selectedElement) return;
    const widthVal = parseFloat(selectedElement.width) || 40;
    const heightVal = parseFloat(selectedElement.height) || 40;
    let newLeft = parseFloat(selectedElement.left) || 0;
    let newTop = parseFloat(selectedElement.top) || 0;

    switch (alignType) {
      case 'left': newLeft = 2; break;
      case 'center-h': newLeft = (100 - widthVal) / 2; break;
      case 'right': newLeft = 100 - widthVal - 2; break;
      case 'top': newTop = 2; break;
      case 'center-v': newTop = (100 - heightVal) / 2; break;
      case 'bottom': newTop = 100 - heightVal - 2; break;
      default: break;
    }

    handleUpdateElementRect({
      left: `${Math.round(newLeft * 10) / 10}%`,
      top: `${Math.round(newTop * 10) / 10}%`
    });
    showNotification(`Allineamento "${alignType}" applicato`);
  };

  const handleChangeZIndex = (changeType) => {
    if (!selectedElement) return;
    let curZ = selectedElement.zIndex || 1;

    switch (changeType) {
      case 'top': curZ = 10; break;
      case 'bottom': curZ = 1; break;
      case 'up': curZ = Math.min(10, curZ + 1); break;
      case 'down': curZ = Math.max(1, curZ - 1); break;
      default: break;
    }

    handleUpdateElementRect({ zIndex: curZ });
  };

  // Drag & Resize Mouse Handlers sul Canvas (Single Click per Frame, Double Click per In-Place Crop)
  const handleFrameMouseDown = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFrameIndex(idx);
    startMousePos.current = { x: e.clientX, y: e.clientY };
    const el = currentPageCoords.elements[idx];

    if (isCroppingInPlace && selectedFrameIndex === idx) {
      // In-Place Crop Pan Mode: sposta l'immagine interna
      isInnerPanning.current = true;
      const crop = el.innerCrop || { zoom: 1.0, offsetX: 0, offsetY: 0 };
      startInnerCrop.current = { ...crop };
    } else {
      // Frame Drag Mode: sposta il rettangolo cornice
      isDragging.current = true;
      startFrameRect.current = {
        left: parseFloat(el.left) || 0,
        top: parseFloat(el.top) || 0,
        width: parseFloat(el.width) || 40,
        height: parseFloat(el.height) || 40
      };
    }
  };

  const commitCropInsetToFrame = (idx) => {
    const el = currentPageCoords.elements[idx];
    if (!el || !el.cropInset) return;
    const { top, right, bottom, left } = el.cropInset;
    if (!top && !right && !bottom && !left) return;

    const oldLeft = parseFloat(el.left) || 0;
    const oldTop = parseFloat(el.top) || 0;
    const oldWidth = parseFloat(el.width) || 40;
    const oldHeight = parseFloat(el.height) || 40;

    const newLeft = oldLeft + (oldWidth * left / 100);
    const newTop = oldTop + (oldHeight * top / 100);
    const newWidth = oldWidth * (100 - left - right) / 100;
    const newHeight = oldHeight * (100 - top - bottom) / 100;

    updateOrEnsurePageCoords(pageObj => {
      const updatedElements = pageObj.elements.map((item, itemIdx) => {
        if (itemIdx === idx) {
          return {
            ...item,
            left: `${Math.round(newLeft * 10) / 10}%`,
            top: `${Math.round(newTop * 10) / 10}%`,
            width: `${Math.round(newWidth * 10) / 10}%`,
            height: `${Math.round(newHeight * 10) / 10}%`,
            cropInset: { top: 0, right: 0, bottom: 0, left: 0 }
          };
        }
        return item;
      });
      return { ...pageObj, elements: updatedElements };
    });
  };

  const handleFrameDoubleClick = (idx) => {
    setSelectedFrameIndex(idx);
    if (isCroppingInPlace) {
      commitCropInsetToFrame(idx);
      setIsCroppingInPlace(false);
      showNotification('Ritaglio applicato! La cornice si è adattata perfettamente alla foto.');
    } else {
      setIsCroppingInPlace(true);
      showNotification('Modalità Ritaglio Attivata (Trascina le maniglie per ritagliare)');
    }
  };

  const handleResizeHandleMouseDown = (e, handleName, idx) => {
    e.stopPropagation();
    setSelectedFrameIndex(idx);
    isResizing.current = handleName;
    startMousePos.current = { x: e.clientX, y: e.clientY };
    const el = currentPageCoords.elements[idx];
    startFrameRect.current = {
      left: parseFloat(el.left) || 0,
      top: parseFloat(el.top) || 0,
      width: parseFloat(el.width) || 40,
      height: parseFloat(el.height) || 40
    };
  };

  const handleCropHandleMouseDown = (e, handleName, idx) => {
    e.stopPropagation();
    setSelectedFrameIndex(idx);
    isCropInsetResizing.current = handleName;
    startMousePos.current = { x: e.clientX, y: e.clientY };
    const el = currentPageCoords.elements[idx];
    const inset = el.cropInset || { top: 0, right: 0, bottom: 0, left: 0 };
    startCropInset.current = { ...inset };

    if (sheetRef.current) {
      const sheetRect = sheetRef.current.getBoundingClientRect();
      const wPercent = parseFloat(el.width) || 40;
      const hPercent = parseFloat(el.height) || 40;
      framePxRect.current = {
        width: Math.max(10, (wPercent / 100) * sheetRect.width),
        height: Math.max(10, (hPercent / 100) * sheetRect.height)
      };
    }
  };

  const handleUpdateCropInset = (newCropInset) => {
    updateOrEnsurePageCoords(pageObj => {
      const updatedElements = pageObj.elements.map((el, idx) => {
        if (idx === selectedFrameIndex) {
          return {
            ...el,
            cropInset: newCropInset
          };
        }
        return el;
      });
      return { ...pageObj, elements: updatedElements };
    });
  };

  const handleCanvasWheel = (e, idx) => {
    if (isCroppingInPlace && selectedFrameIndex === idx) {
      e.preventDefault();
      e.stopPropagation();
      const el = currentPageCoords.elements[idx];
      const curCrop = el.innerCrop || { zoom: 1.0, offsetX: 0, offsetY: 0 };
      const deltaZoom = e.deltaY < 0 ? 0.05 : -0.05;
      const newZoom = Math.max(1.0, Math.min(3.0, Math.round((curCrop.zoom + deltaZoom) * 100) / 100));
      handleUpdateInnerCrop({
        ...curCrop,
        zoom: newZoom
      });
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (!sheetRef.current) return;
    const sheetRect = sheetRef.current.getBoundingClientRect();
    const deltaXPercent = ((e.clientX - startMousePos.current.x) / sheetRect.width) * 100;
    const deltaYPercent = ((e.clientY - startMousePos.current.y) / sheetRect.height) * 100;

    if (isCropInsetResizing.current) {
      const handle = isCropInsetResizing.current;
      const deltaXPixels = e.clientX - startMousePos.current.x;
      const deltaYPixels = e.clientY - startMousePos.current.y;

      const deltaXPercent = (deltaXPixels / framePxRect.current.width) * 100;
      const deltaYPercent = (deltaYPixels / framePxRect.current.height) * 100;

      let { top, right, bottom, left } = startCropInset.current;

      if (handle.includes('t')) {
        top = Math.max(0, Math.min(100 - bottom - 5, top + deltaYPercent));
      }
      if (handle.includes('b')) {
        bottom = Math.max(0, Math.min(100 - top - 5, bottom - deltaYPercent));
      }
      if (handle.includes('l')) {
        left = Math.max(0, Math.min(100 - right - 5, left + deltaXPercent));
      }
      if (handle.includes('r')) {
        right = Math.max(0, Math.min(100 - left - 5, right - deltaXPercent));
      }

      handleUpdateCropInset({
        top: Math.round(top * 10) / 10,
        right: Math.round(right * 10) / 10,
        bottom: Math.round(bottom * 10) / 10,
        left: Math.round(left * 10) / 10
      });
      return;
    }

    if (isInnerPanning.current) {
      const deltaXPixels = e.clientX - startMousePos.current.x;
      const deltaYPixels = e.clientY - startMousePos.current.y;
      handleUpdateInnerCrop({
        ...startInnerCrop.current,
        offsetX: Math.round(startInnerCrop.current.offsetX + deltaXPixels),
        offsetY: Math.round(startInnerCrop.current.offsetY + deltaYPixels)
      });
      return;
    }

    if (isDragging.current) {
      const newLeft = Math.max(0, Math.min(100 - startFrameRect.current.width, startFrameRect.current.left + deltaXPercent));
      const newTop = Math.max(0, Math.min(100 - startFrameRect.current.height, startFrameRect.current.top + deltaYPercent));
      handleUpdateElementRect({
        left: `${Math.round(newLeft * 10) / 10}%`,
        top: `${Math.round(newTop * 10) / 10}%`
      });
      return;
    }

    if (isResizing.current) {
      let { left, top, width, height } = startFrameRect.current;
      const handle = isResizing.current;

      if (handle.includes('r')) width = Math.max(10, width + deltaXPercent);
      if (handle.includes('l')) {
        const potentialW = width - deltaXPercent;
        if (potentialW >= 10) {
          width = potentialW;
          left = left + deltaXPercent;
        }
      }
      if (handle.includes('b')) height = Math.max(10, height + deltaYPercent);
      if (handle.includes('t')) {
        const potentialH = height - deltaYPercent;
        if (potentialH >= 10) {
          height = potentialH;
          top = top + deltaYPercent;
        }
      }

      handleUpdateElementRect({
        left: `${Math.round(left * 10) / 10}%`,
        top: `${Math.round(top * 10) / 10}%`,
        width: `${Math.round(width * 10) / 10}%`,
        height: `${Math.round(height * 10) / 10}%`
      });
    }
  };

  const handleCanvasMouseUp = () => {
    isDragging.current = false;
    isInnerPanning.current = false;
    isResizing.current = null;
    isCropInsetResizing.current = null;
  };

  // Caricamento Diretto su Cloudinary REST API
  const handleCloudinaryDirectUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploadingToCloudinary(true);
    showNotification(`Caricamento di ${files.length} file su Cloudinary jkxwp5hj in corso...`);

    const uploadedUrls = [];
    for (const file of files) {
      try {
        const res = await uploadToCloudinary(file, currentPage.name || 'matrimonio fabio tiziana');
        uploadedUrls.push(res.public_id || res.secure_url);
      } catch (err) {
        console.error('Errore caricamento file:', err);
      }
    }

    setIsUploadingToCloudinary(false);
    if (uploadedUrls.length > 0) {
      setAlbumPages(prev => {
        return prev.map((pg, idx) => {
          if (idx === activePageIndex) {
            return { ...pg, images: [...(pg.images || []), ...uploadedUrls] };
          }
          return pg;
        });
      });
      showNotification(`${uploadedUrls.length} file caricati con successo su Cloudinary per ${currentPage.name}!`);
    }
  };

  // Aggiungi nuova pagina
  const handleAddNewPage = () => {
    let lastPgNum = 0;
    const lastPage = albumPages[albumPages.length - 1];
    if (lastPage && lastPage.name) {
      const matches = lastPage.name.match(/(\d+)(?:_(\d+))?/);
      if (matches) {
        lastPgNum = parseInt(matches[2] || matches[1], 10);
      }
    }
    const startNum = lastPgNum > 0 ? (lastPgNum % 2 === 1 ? lastPgNum + 1 : lastPgNum + 2) : albumPages.length * 2;
    const endNum = startNum + 1;
    const newPageName = `pg ${startNum}_${endNum}`;

    const newPageObj = {
      name: newPageName,
      isSpread: true,
      images: []
    };

    const newCoordObj = {
      pageIndex: albumPages.length + 1,
      folder: newPageName,
      template: 'grid-soft',
      aspectRatio: 2.63,
      elements: []
    };

    const updatedPages = [...albumPages, newPageObj];
    const updatedCoords = [...layoutCoords, newCoordObj];
    setAlbumPages(updatedPages);
    setLayoutCoords(updatedCoords);
    setActivePageIndex(updatedPages.length - 1);
    setSelectedFrameIndex(0);
    showNotification(`Nuova pagina "${newPageName}" creata con successo!`);
  };

  // Elimina pagina corrente
  const handleDeleteCurrentPage = () => {
    if (albumPages.length <= 1) {
      showNotification("Impossibile eliminare l'unica pagina dell'album.");
      return;
    }
    const pageToDelete = currentPage.name;
    if (window.confirm(`Sei sicuro di voler eliminare la pagina "${pageToDelete}"?`)) {
      const newPages = albumPages.filter((_, idx) => idx !== activePageIndex);
      const newCoords = layoutCoords.filter(c => c.folder !== pageToDelete);
      setAlbumPages(newPages);
      setLayoutCoords(newCoords);
      setActivePageIndex(prev => Math.max(0, prev - 1));
      showNotification(`Pagina "${pageToDelete}" eliminata con successo.`);
    }
  };

  // 6. Pubblica su Vercel (Salva & Sincronizza JSON con Trasformazioni Cloudinary)
  const handlePublishToVercel = () => {
    localStorage.setItem('admin_album_pages', JSON.stringify(albumPages));
    localStorage.setItem('admin_layout_coords', JSON.stringify(layoutCoords));
    window.dispatchEvent(new Event('admin_layout_updated'));

    const exportData = getExportLayoutData();
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `layoutCoordinates_${Date.now()}.json`;
    a.click();

    syncLayoutToGitHub(exportData);
    showNotification('Layout salvato nel browser e file JSON scaricato per la pubblicazione su Vercel!');
  };

  // Genera Struttura JSON conforme allo Schema Cloudinary Vercel
  const getExportLayoutData = () => {
    return {
      pages: albumPages,
      layoutCoordinates: layoutCoords.map(c => ({
        ...c,
        elements: c.elements.map((el, idx) => {
          const rawFile = el.cloudinaryPublicId || el.file || el.url || el.src || el.originalFilename || 'N/A';
          const fileNameOnly = rawFile.split('/').pop();
          const isVid = isVideoFile(rawFile) || el.type === 'video';

          const cropTransform = el.innerCrop ? {
            zoom: el.innerCrop.zoom,
            offsetX: el.innerCrop.offsetX,
            offsetY: el.innerCrop.offsetY
          } : undefined;

          return {
            id: `item_${idx + 1}`,
            type: isVid ? 'video' : 'image',
            cloudinaryPublicId: isVid ? getCloudinaryVideoPosterUrl(rawFile) : getCloudinaryUrl(rawFile),
            originalFilename: fileNameOnly,
            videoSettings: isVid ? (el.videoSettings || { autoplay: false, playOnHover: true, loop: true, muted: true, controls: true, startOffset: 0 }) : undefined,
            effect: el.effect || 'none',
            rect: {
              x: el.left,
              y: el.top,
              width: el.width,
              height: el.height,
              rotation: el.rotation || 0,
              zIndex: el.zIndex || idx + 1
            },
            cloudinaryTransform: {
              crop: cropTransform,
              innerCrop: el.innerCrop || { zoom: 1.0, offsetX: 0, offsetY: 0, aspectRatioLocked: true },
              mask: el.mask || { active: false, id: 'none', styleString: '' },
              filters: el.filters || { preset: 'original', values: DEFAULT_SLIDER_VALUES, cssString: 'none' }
            }
          };
        })
      }))
    };
  };

  const handleSaveLayout = () => {
    const exportData = getExportLayoutData();
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `layoutCoordinates_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    showNotification('File layoutCoordinates.json scaricato con successo!');
  };

  // Caricamento foto/video locale
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const newImgUrls = files.map(file => URL.createObjectURL(file));

    setAlbumPages(prev => {
      return prev.map((pg, idx) => {
        if (idx === activePageIndex) {
          return { ...pg, images: [...(pg.images || []), ...newImgUrls] };
        }
        return pg;
      });
    });
    showNotification(`${files.length} file caricatori per ${currentPage.name}`);
  };

  const handleRemoveImage = async (imgSrc) => {
    showNotification('Cancellazione da Cloudinary jkxwp5hj in corso...');
    await deleteFromCloudinary(imgSrc);

    setAlbumPages(prev => {
      return prev.map((pg, idx) => {
        if (idx === activePageIndex) {
          return { ...pg, images: (pg.images || []).filter(img => img !== imgSrc) };
        }
        return pg;
      });
    });

    updateOrEnsurePageCoords(pageObj => {
      const updatedElements = pageObj.elements.filter(el => (el.cloudinaryPublicId || el.file || el.originalFilename) !== imgSrc);
      return { ...pageObj, elements: updatedElements };
    });

    showNotification('File eliminato con successo dal Media Pool e da Cloudinary!');
  };

  const selectedSampleImgSrc = selectedElement?.file || currentPage.images?.[selectedFrameIndex] || currentPage.images?.[0];
  const isSelectedVid = isVideoFile(selectedSampleImgSrc) || selectedElement?.type === 'video';
  const cropModalImgSrc = isSelectedVid 
    ? getCloudinaryVideoPosterUrl(selectedSampleImgSrc, { startOffset: selectedElement?.videoSettings?.startOffset || 0, width: 1200 })
    : getCloudinaryUrl(selectedSampleImgSrc, { width: 1200 });

  return (
    <div className="admin-editor-container">
      {/* Toast Notifica */}
      {notification && <div className="admin-toast">{notification}</div>}

      {/* Modale Classica di Ritaglio Immagine con Fallback e Drag */}
      {isCropModalOpen && (
        <CropModal
          isOpen={isCropModalOpen}
          onClose={() => setIsCropModalOpen(false)}
          imageSrc={cropModalImgSrc}
          rawImgSrc={selectedSampleImgSrc}
          pageName={currentPage.name}
          initialCrop={selectedElement?.innerCrop}
          onApplyCrop={(newCrop) => {
            handleUpdateInnerCrop(newCrop);
            showNotification('Ritaglio applicato alla foto selezionata!');
          }}
        />
      )}

      {/* Topbar Amministratore */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <h2 className="admin-logo">Admin Album Editor</h2>
          <span className="admin-badge">Modalità Gestione</span>
        </div>

        <div className="admin-topbar-center" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className="admin-nav-page-btn"
            disabled={activePageIndex === 0}
            onClick={() => {
              setActivePageIndex(prev => prev - 1);
              setSelectedFrameIndex(0);
              setIsCroppingInPlace(false);
            }}
          >
            <ChevronLeft size={18} />
          </button>

          <span className="admin-page-indicator">
            Pagina <strong>{currentPage?.name || `pg ${activePageIndex + 1}`}</strong> ({activePageIndex + 1} / {albumPages.length})
          </span>

          <button 
            className="admin-nav-page-btn"
            disabled={activePageIndex === albumPages.length - 1}
            onClick={() => {
              setActivePageIndex(prev => prev + 1);
              setSelectedFrameIndex(0);
              setIsCroppingInPlace(false);
            }}
          >
            <ChevronRight size={18} />
          </button>

          <button
            className="admin-btn secondary"
            style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '6px 12px', fontSize: '0.85rem', marginLeft: '8px' }}
            onClick={handleAddNewPage}
            title="Aggiungi una nuova pagina all'album"
          >
            <Plus size={16} />
            <span>+ Nuova Pagina</span>
          </button>

          {albumPages.length > 1 && (
            <button
              className="admin-btn secondary"
              style={{ backgroundColor: '#7f1d1d', color: '#f87171', border: '1px solid #991b1b', padding: '6px 10px', fontSize: '0.85rem' }}
              onClick={handleDeleteCurrentPage}
              title="Elimina la pagina corrente"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        <div className="admin-topbar-right">
          <button 
            className="admin-btn secondary"
            style={{ backgroundColor: '#475569', color: '#f8fafc', border: '1px solid #64748b' }}
            onClick={handleResetToJSON}
            title="Ripristina l'ultima configurazione salvata dal file JSON"
          >
            <span>Ripristina Layout JSON</span>
          </button>

          <button 
            className="admin-btn secondary" 
            style={{ backgroundColor: '#1e293b', color: '#f8fafc', border: '1px solid #38bdf8' }}
            onClick={handleAddTextElement}
            title="Aggiungi una casella di testo trascinabile nell'album"
          >
            <Type size={16} color="#38bdf8" />
            <span>+ Inserire testo</span>
          </button>

          <button className="admin-btn secondary" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Layout size={16} />
            <span>Pannelli Editor</span>
          </button>

          {/* Pulsante speciale per Caricamento Diretto su Cloudinary */}
          <label 
            className="admin-btn primary" 
            style={{ backgroundColor: '#0284c7', color: '#ffffff', cursor: 'pointer' }}
            title="Carica immagini e video direttamente sul tuo Cloud Name Cloudinary jkxwp5hj"
          >
            <UploadCloud size={16} />
            <span>{isUploadingToCloudinary ? 'Caricamento Cloudinary...' : 'Carica Foto su Cloudinary'}</span>
            <input 
              type="file" 
              multiple 
              accept="image/*,video/*" 
              onChange={handleCloudinaryDirectUpload} 
              disabled={isUploadingToCloudinary}
              style={{ display: 'none' }} 
            />
          </label>

          <button 
            className="admin-btn primary" 
            style={{ backgroundColor: '#059669', color: '#ffffff' }}
            onClick={handlePublishToVercel}
            title="Pubblica ed esporta layout per Vercel"
          >
            <UploadCloud size={16} />
            <span>Pubblica su Vercel</span>
          </button>

          <button className="admin-btn secondary" onClick={handleSaveLayout}>
            <Download size={16} />
            <span>Esporta JSON</span>
          </button>

          <button className="admin-btn viewer-mode" onClick={onSwitchToViewer}>
            <Eye size={16} />
            <span>Anteprima Album Cliente</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div 
        className="admin-workspace"
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
      >
        {/* Canvas Centrale */}
        <main className="admin-canvas-area">
          <div className="canvas-header-bar">
            <span>
              Pagina Album: <strong>{currentPage?.name}</strong> {currentPage.isSpread ? '(Doppia Pagina)' : '(Pagina Singola)'} | 
              Elemento Selezionato: <strong>#{selectedFrameIndex + 1} {isSelectedVid ? '(VIDEO)' : '(FOTO)'}</strong>
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                className="admin-btn secondary" 
                style={{ backgroundColor: isCroppingInPlace ? '#f59e0b' : '#2563eb', color: '#ffffff' }}
                onClick={() => {
                  setIsCroppingInPlace(!isCroppingInPlace);
                  showNotification(!isCroppingInPlace ? 'Ritaglio In-Place Attivo (Doppio click per uscire)' : 'Uscito da Ritaglio In-Place');
                }}
              >
                {isCroppingInPlace ? <Check size={14} /> : <Crop size={14} />}
                <span>{isCroppingInPlace ? 'Conferma Ritaglio In-Place' : 'Ritaglia In-Place (Doppio Click)'}</span>
              </button>

              <label className="upload-photo-btn" style={{ backgroundColor: '#0284c7' }}>
                <UploadCloud size={14} />
                <span>Carica Media Cloudinary</span>
                <input type="file" multiple accept="image/*,video/*" onChange={handleCloudinaryDirectUpload} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

            <div className="canvas-spread-viewport">
              <div 
                ref={sheetRef}
                className={`canvas-spread-sheet ${!currentPage.isSpread ? 'single-page' : ''}`}
                style={{ backgroundColor: currentPageCoords.backgroundColor || currentPage.backgroundColor || '#ffffff' }}
                onClick={() => {
                  if (isCroppingInPlace) setIsCroppingInPlace(false);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'copy';
                }}
                onDrop={handleDropNewFrameOnSheet}
              >
              {currentPage.isSpread && <div className="canvas-spine-line"></div>}

              {/* Riquadri Canvas con Dual-Mode In-Place Crop & Fallback Infallibile */}
              {currentPageCoords.elements.map((el, idx) => {
                const isSelected = selectedFrameIndex === idx;

                if (el.type === 'text') {
                  return (
                    <div
                      key={idx}
                      className={`canvas-photo-frame canvas-text-frame ${isSelected ? 'selected' : ''}`}
                      draggable={false}
                      onMouseDown={(e) => {
                        handleFrameMouseDown(e, idx);
                        if (activeSidebarTab !== 'text') setActiveSidebarTab('text');
                      }}
                      style={{
                        left: el.left,
                        top: el.top,
                        width: el.width,
                        height: el.height,
                        zIndex: el.zIndex || 1,
                        fontFamily: el.fontFamily || "'Great Vibes', cursive",
                        fontSize: `${el.fontSize || 40}pt`,
                        color: el.color || '#1e293b',
                        textAlign: el.align || 'center',
                        fontWeight: el.bold ? 'bold' : 'normal',
                        fontStyle: el.italic ? 'italic' : 'normal',
                        textDecoration: el.underline ? 'underline' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: el.align === 'left' ? 'flex-start' : el.align === 'right' ? 'flex-end' : 'center',
                        cursor: 'move',
                        userSelect: 'none',
                        padding: '8px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <span style={{ width: '100%', wordBreak: 'break-word', lineHeight: 1.2 }}>
                        {el.text || 'Immettere qui il testo'}
                      </span>

                      <button 
                        className="remove-img-btn" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFrameElement(idx);
                        }}
                        title="Elimina testo dall'album"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  );
                }

                const rawImgSrc = el.cloudinaryPublicId || el.file || el.url || el.src || el.originalFilename || currentPage.images?.[idx];
                const isVideo = isVideoFile(rawImgSrc) || el.type === 'video';

                const resolvedImgSrc = isVideo 
                  ? getCloudinaryVideoPosterUrl(rawImgSrc, { startOffset: el.videoSettings?.startOffset || 0, width: 1200 })
                  : getCloudinaryUrl(rawImgSrc, { width: 1200 });

                const localFallbackSrc = resolveLocalFallback(rawImgSrc, currentPage.name);
                const isCroppingThis = isCroppingInPlace && isSelected;

                const maskStyle = el.mask?.styleObj || {};
                const filterCss = el.filters?.cssString || 'none';
                const innerCrop = el.innerCrop || { zoom: 1.0, offsetX: 0, offsetY: 0 };
                const effectClass = el.effect && el.effect !== 'none' ? el.effect : '';

                const inset = el.cropInset || { top: 0, right: 0, bottom: 0, left: 0 };
                const clipInsetCss = `inset(${inset.top}% ${inset.right}% ${inset.bottom}% ${inset.left}%)`;
                const isDragHovered = dragHoverFrameIndex === idx;

                return (
                  <div
                    key={idx}
                    className={`canvas-photo-frame ${isSelected ? 'selected' : ''} ${isCroppingThis ? 'in-place-cropping' : ''} ${isDragHovered ? 'drag-target-hover' : ''}`}
                    draggable={false}
                    onMouseDown={(e) => handleFrameMouseDown(e, idx)}
                    onDoubleClick={() => handleFrameDoubleClick(idx)}
                    onWheel={(e) => handleCanvasWheel(e, idx)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'copy';
                      if (dragHoverFrameIndex !== idx) setDragHoverFrameIndex(idx);
                    }}
                    onDragLeave={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget)) {
                        setDragHoverFrameIndex(null);
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragHoverFrameIndex(null);
                      const droppedImg = e.dataTransfer.getData('text/plain') || 
                                         e.dataTransfer.getData('text/uri-list') || 
                                         e.dataTransfer.getData('URL') || 
                                         draggedMediaUrlRef.current;
                      if (droppedImg) handleAssignImageToFrame(idx, droppedImg);
                      draggedMediaUrlRef.current = null;
                    }}
                    style={{
                      left: el.left,
                      top: el.top,
                      width: el.width,
                      height: el.height,
                      zIndex: isCroppingThis ? 999 : (el.zIndex || 1),
                      ...(!isCroppingThis ? maskStyle : {})
                    }}
                  >
                    {/* Foto Sottostante 100% Fissa ed Immobile ad Opacità 35% */}
                    {isCroppingThis && (
                      <div className="crop-fixed-underlay">
                        <img 
                          src={resolvedImgSrc} 
                          alt="crop-underlay" 
                          draggable={false}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: filterCss }} 
                        />
                      </div>
                    )}

                    {isCroppingThis && (
                      <div 
                        className="crop-mode-badge"
                        style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                        onClick={() => {
                          commitCropInsetToFrame(idx);
                          setIsCroppingInPlace(false);
                          showNotification('Ritaglio applicato! La cornice si è adattata perfettamente alla foto.');
                        }}
                      >
                        ✓ Conferma Ritaglio & Adatta Cornice
                      </div>
                    )}

                    {/* Griglia 3x3 e 8 Maniglie Perimetrali sull'Inset */}
                    {isCroppingThis && (
                      <div className="crop-handles-container">
                        <div className="crop-grid-3x3" style={{ clipPath: clipInsetCss }} />
                        <div className="crop-handle-white handle-tl" style={{ top: `${inset.top}%`, left: `${inset.left}%` }} onMouseDown={(e) => handleCropHandleMouseDown(e, 'tl', idx)} />
                        <div className="crop-handle-white handle-tc" style={{ top: `${inset.top}%`, left: `${(100 - inset.left - inset.right)/2 + inset.left}%`, transform: 'translateX(-50%)' }} onMouseDown={(e) => handleCropHandleMouseDown(e, 'tc', idx)} />
                        <div className="crop-handle-white handle-tr" style={{ top: `${inset.top}%`, right: `${inset.right}%` }} onMouseDown={(e) => handleCropHandleMouseDown(e, 'tr', idx)} />

                        <div className="crop-handle-white handle-ml" style={{ top: `${(100 - inset.top - inset.bottom)/2 + inset.top}%`, left: `${inset.left}%`, transform: 'translateY(-50%)' }} onMouseDown={(e) => handleCropHandleMouseDown(e, 'ml', idx)} />
                        <div className="crop-handle-white handle-mr" style={{ top: `${(100 - inset.top - inset.bottom)/2 + inset.top}%`, right: `${inset.right}%`, transform: 'translateY(-50%)' }} onMouseDown={(e) => handleCropHandleMouseDown(e, 'mr', idx)} />

                        <div className="crop-handle-white handle-bl" style={{ bottom: `${inset.bottom}%`, left: `${inset.left}%` }} onMouseDown={(e) => handleCropHandleMouseDown(e, 'bl', idx)} />
                        <div className="crop-handle-white handle-bc" style={{ bottom: `${inset.bottom}%`, left: `${(100 - inset.left - inset.right)/2 + inset.left}%`, transform: 'translateX(-50%)' }} onMouseDown={(e) => handleCropHandleMouseDown(e, 'bc', idx)} />
                        <div className="crop-handle-white handle-br" style={{ bottom: `${inset.bottom}%`, right: `${inset.right}%` }} onMouseDown={(e) => handleCropHandleMouseDown(e, 'br', idx)} />
                      </div>
                    )}

                    {rawImgSrc ? (
                      <div className="frame-image-wrapper" style={{ backgroundColor: '#0f172a', clipPath: clipInsetCss }}>
                        <img 
                          className={effectClass}
                          src={resolvedImgSrc} 
                          alt={`media ${idx}`} 
                          onError={(e) => {
                            if (localFallbackSrc && e.currentTarget.src !== localFallbackSrc) {
                              e.currentTarget.src = localFallbackSrc;
                            } else {
                              e.currentTarget.style.opacity = '0.3';
                            }
                          }}
                          style={{ 
                            filter: filterCss,
                            transform: `scale(${innerCrop.zoom}) translate(${innerCrop.offsetX}px, ${innerCrop.offsetY}px)`,
                            cursor: isCroppingThis ? 'grab' : 'pointer'
                          }}
                        />

                        {/* Overlay Play Badge per Elementi Video */}
                        {isVideo && (
                          <div 
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              width: '44px',
                              height: '44px',
                              backgroundColor: 'rgba(0, 0, 0, 0.65)',
                              backdropFilter: 'blur(4px)',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#ffffff',
                              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                              pointerEvents: 'none',
                              zIndex: 10
                            }}
                          >
                            <Play size={20} fill="#ffffff" style={{ marginLeft: '3px' }} />
                          </div>
                        )}

                        <button 
                          className="remove-img-btn" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFrameElement(idx);
                          }}
                          title="Elimina cornice dall'album"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="frame-placeholder">
                        <svg className="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
                          <path d="M21 15l-5-5L5 20" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M14 14l3-3 4 4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Media {idx + 1}</span>
                      </div>
                    )}

                    {/* 8 Maniglie esterne di Ridimensionamento in Stato A (Single Click) */}
                    {isSelected && !isCroppingThis && (
                      <div className="resize-handles-container">
                        <div className="resize-handle handle-tl" onMouseDown={(e) => handleResizeHandleMouseDown(e, 'tl', idx)} />
                        <div className="resize-handle handle-tc" onMouseDown={(e) => handleResizeHandleMouseDown(e, 'tc', idx)} />
                        <div className="resize-handle handle-tr" onMouseDown={(e) => handleResizeHandleMouseDown(e, 'tr', idx)} />
                        <div className="resize-handle handle-ml" onMouseDown={(e) => handleResizeHandleMouseDown(e, 'ml', idx)} />
                        <div className="resize-handle handle-mr" onMouseDown={(e) => handleResizeHandleMouseDown(e, 'mr', idx)} />
                        <div className="resize-handle handle-bl" onMouseDown={(e) => handleResizeHandleMouseDown(e, 'bl', idx)} />
                        <div className="resize-handle handle-bc" onMouseDown={(e) => handleResizeHandleMouseDown(e, 'bc', idx)} />
                        <div className="resize-handle handle-br" onMouseDown={(e) => handleResizeHandleMouseDown(e, 'br', idx)} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Media Pool Foto/Video di Pagina con Aggregazione Dinamica e Cancellazione Cloudinary */}
          {(() => {
            const combinedPageMedia = Array.from(new Set([
              ...(currentPage.images || []),
              ...currentPageCoords.elements.map(el => el.cloudinaryPublicId || el.file || el.originalFilename).filter(Boolean)
            ]));
            return (
              <div className="admin-media-pool">
                <h4 className="media-pool-title">Pool Foto/Video Pagina ({combinedPageMedia.length})</h4>
                <div className="media-pool-thumbnails">
                  {combinedPageMedia.map((img, idx) => {
                    const isVid = isVideoFile(img);
                    const cloudThumb = isVid 
                      ? getCloudinaryVideoPosterUrl(img, { width: 200, height: 200, crop: 'thumb' })
                      : getCloudinaryUrl(img, { width: 200, height: 200, crop: 'thumb' });
                    const localThumb = resolveLocalFallback(img, currentPage.name);
                    return (
                      <div 
                        key={idx} 
                        className="media-thumb-item" 
                        draggable={true}
                        onDragStart={(e) => {
                          draggedMediaUrlRef.current = img;
                          e.dataTransfer.setData('text/plain', img);
                          e.dataTransfer.setData('text/uri-list', img);
                          e.dataTransfer.setData('URL', img);
                          e.dataTransfer.effectAllowed = 'copy';
                        }}
                        onClick={() => {
                          if (selectedFrameIndex !== null && selectedFrameIndex !== undefined) {
                            handleAssignImageToFrame(selectedFrameIndex, img);
                          }
                        }}
                        style={{ position: 'relative', cursor: 'grab' }}
                        title="Trascina la foto sul riquadro del Canvas o clicca per assegnare"
                      >
                        <img 
                          src={cloudThumb} 
                          alt={`thumb-${idx}`} 
                          onError={(e) => {
                            if (localThumb && e.currentTarget.src !== localThumb) {
                              e.currentTarget.src = localThumb;
                            }
                          }}
                        />
                        {isVid && (
                          <div style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(0,0,0,0.7)', borderRadius: '50%', padding: '2px', display: 'flex', color: '#fff' }}>
                            <Play size={10} fill="#fff" />
                          </div>
                        )}
                        <button className="thumb-remove-btn" onClick={(e) => { e.stopPropagation(); handleRemoveImage(img); }} title="Elimina da Pool e Cloudinary">
                          <Trash2 size={10} />
                        </button>
                      </div>
                    );
                  })}
                  <label className="media-thumb-add" style={{ backgroundColor: '#0284c7' }} title="Carica foto su Cloudinary">
                    <UploadCloud size={20} />
                    <input type="file" multiple accept="image/*,video/*" onChange={handleCloudinaryDirectUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
            );
          })()}
        </main>

        {/* Sidebar Laterale con 5 Schede Navigation */}
        {isSidebarOpen && (
          <div className="sidebar-tab-wrapper">
            {/* Header 5 Schede */}
            <div className="sidebar-tabs-nav">
              <button 
                className={`tab-nav-btn ${activeSidebarTab === 'layout' ? 'active' : ''}`}
                onClick={() => setActiveSidebarTab('layout')}
              >
                <Layout size={14} />
                <span>Layout</span>
              </button>
              <button 
                className={`tab-nav-btn ${activeSidebarTab === 'masks' ? 'active' : ''}`}
                onClick={() => setActiveSidebarTab('masks')}
              >
                <Scissors size={14} />
                <span>Bordo</span>
              </button>
              <button 
                className={`tab-nav-btn ${activeSidebarTab === 'filters' ? 'active' : ''}`}
                onClick={() => setActiveSidebarTab('filters')}
              >
                <Sliders size={14} />
                <span>Filtri</span>
              </button>
              <button 
                className={`tab-nav-btn ${activeSidebarTab === 'position' ? 'active' : ''}`}
                onClick={() => setActiveSidebarTab('position')}
              >
                <Move size={14} />
                <span>Posizione</span>
              </button>
              <button 
                className={`tab-nav-btn ${activeSidebarTab === 'video' ? 'active' : ''}`}
                onClick={() => setActiveSidebarTab('video')}
              >
                <Film size={14} />
                <span>Video</span>
              </button>
              <button 
                className={`tab-nav-btn ${activeSidebarTab === 'bg' ? 'active' : ''}`}
                onClick={() => setActiveSidebarTab('bg')}
              >
                <Palette size={14} />
                <span>Sfondo</span>
              </button>
              <button 
                className={`tab-nav-btn ${activeSidebarTab === 'text' ? 'active' : ''}`}
                onClick={() => setActiveSidebarTab('text')}
              >
                <Type size={14} />
                <span>Testo</span>
              </button>
            </div>

            {/* Contenuto Scheda Attiva */}
            {activeSidebarTab === 'layout' && (
              <LayoutPanel
                onClose={() => setIsSidebarOpen(false)}
                onSelectPreset={handleSelectPreset}
                onMirrorLayout={handleMirrorLayout}
                onSaveLayout={handleSaveLayout}
                activePresetId={activePresetId}
              />
            )}

            {activeSidebarTab === 'masks' && (
              <MasksPanel
                onClose={() => setIsSidebarOpen(false)}
                onSelectMask={handleSelectMask}
                onRemoveMask={handleRemoveMask}
                onApplyToAll={handleApplyMaskToAll}
                activeMaskId={selectedElement?.mask?.id}
              />
            )}

            {activeSidebarTab === 'filters' && (
              <FiltersPanel
                onClose={() => setIsSidebarOpen(false)}
                activeFilterValues={selectedElement?.filters?.values}
                activeEffect={selectedElement?.effect || 'none'}
                onUpdateFilterValues={handleUpdateFilterValues}
                onSelectPreset={handleSelectFilterPreset}
                onSelectEffect={handleSelectEffect}
                onResetFilters={handleResetFilters}
                onApplyToAll={handleApplyFilterToAll}
                sampleImage={getCloudinaryUrl(selectedElement?.file || currentPage.images?.[0], { width: 200, height: 200, crop: 'thumb' })}
              />
            )}

            {activeSidebarTab === 'position' && (
              <PositionPanel
                onClose={() => setIsSidebarOpen(false)}
                selectedElement={selectedElement}
                onUpdateElementRect={handleUpdateElementRect}
                onUpdateInnerCrop={handleUpdateInnerCrop}
                onAlignElement={handleAlignElement}
                onChangeZIndex={handleChangeZIndex}
                onOpenCropModal={() => setIsCropModalOpen(true)}
              />
            )}

            {activeSidebarTab === 'video' && (
              <VideoPanel
                onClose={() => setIsSidebarOpen(false)}
                selectedElement={selectedElement}
                onUpdateVideoSettings={handleUpdateVideoSettings}
                onUpdateElementFile={handleUpdateElementFile}
              />
            )}

            {activeSidebarTab === 'bg' && (
              <BackgroundPanel
                onClose={() => setIsSidebarOpen(false)}
                activeBgColor={currentPageCoords.backgroundColor || currentPage.backgroundColor || '#ffffff'}
                onSelectBgColor={handleSelectBgColor}
              />
            )}

            {activeSidebarTab === 'text' && (
              <TextPanel
                onClose={() => setIsSidebarOpen(false)}
                selectedElement={selectedElement}
                onUpdateTextProp={handleUpdateTextProp}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
