import React, { useState, useMemo } from 'react';
import { 
  X, 
  Bookmark, 
  Settings, 
  FlipHorizontal, 
  Star, 
  Image as ImageIcon 
} from 'lucide-react';
import './LayoutPanel.css';
import { INITIAL_PRESETS } from '../../data/layoutPresets';

export default function LayoutPanel({ 
  onClose, 
  onSelectPreset, 
  onMirrorLayout, 
  onSaveLayout, 
  activePresetId 
}) {
  const [presets, setPresets] = useState(() => {
    const saved = localStorage.getItem('album_layout_presets_favs');
    if (saved) {
      try {
        const favIds = JSON.parse(saved);
        return INITIAL_PRESETS.map(p => ({
          ...p,
          isFavorite: favIds.includes(p.id)
        }));
      } catch (e) {
        return INITIAL_PRESETS;
      }
    }
    return INITIAL_PRESETS;
  });

  // Filtri UI
  const [designLine, setDesignLine] = useState('Tutti');
  const [imagesPerPage, setImagesPerPage] = useState('4'); // Predefinito come nello screenshot
  const [borderDistance, setBorderDistance] = useState('Tutti');
  const [gapDistance, setGapDistance] = useState('Tutti');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Toggle Preferito
  const toggleFavorite = (e, presetId) => {
    e.stopPropagation();
    setPresets(prev => {
      const updated = prev.map(p => 
        p.id === presetId ? { ...p, isFavorite: !p.isFavorite } : p
      );
      const favIds = updated.filter(p => p.isFavorite).map(p => p.id);
      localStorage.setItem('album_layout_presets_favs', JSON.stringify(favIds));
      return updated;
    });
  };

  // Filtraggio dinamico
  const filteredPresets = useMemo(() => {
    return presets.filter(p => {
      if (showFavoritesOnly && !p.isFavorite) return false;
      if (designLine !== 'Tutti' && p.designLine !== designLine) return false;
      if (imagesPerPage !== 'Tutti' && p.imagesPerPage !== imagesPerPage) return false;
      if (borderDistance !== 'Tutti' && p.borderDistance !== borderDistance) return false;
      if (gapDistance !== 'Tutti' && p.gapDistance !== gapDistance) return false;
      return true;
    });
  }, [presets, designLine, imagesPerPage, borderDistance, gapDistance, showFavoritesOnly]);

  return (
    <aside className="layout-panel-sidebar">
      {/* 1. Header & Titolo */}
      <div className="layout-panel-header">
        <h3 className="layout-panel-title">Layout</h3>
        <button className="layout-close-btn" onClick={onClose} title="Chiudi pannello">
          <X size={18} />
        </button>
      </div>

      {/* Barra Strumenti Principale */}
      <div className="layout-action-toolbar">
        <button className="layout-action-btn" onClick={onSaveLayout}>
          <Bookmark size={15} />
          <span>Salva layout</span>
        </button>
        <button className="layout-action-btn" onClick={() => alert('Design Manager aperto')}>
          <Settings size={15} />
          <span>Design Manager</span>
        </button>
        <button className="layout-action-btn highlight" onClick={onMirrorLayout}>
          <FlipHorizontal size={15} />
          <span>Specchia layout</span>
        </button>
      </div>

      {/* 2. Filtri di Selezione (Filter Bar 2x2) */}
      <div className="layout-filter-section">
        <div className="filter-grid">
          <div className="filter-group">
            <label>Linea di design</label>
            <select value={designLine} onChange={(e) => setDesignLine(e.target.value)}>
              <option value="Tutti">Tutti</option>
              <option value="Semplice">Semplice</option>
              <option value="Classico">Classico</option>
              <option value="Moderno">Moderno</option>
              <option value="Full Bleed">Full Bleed</option>
              <option value="Pic in Pic">Pic in Pic</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Immagini per pagina</label>
            <select value={imagesPerPage} onChange={(e) => setImagesPerPage(e.target.value)}>
              <option value="Tutti">Tutti</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5+">5+</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Distanza dal bordo</label>
            <select value={borderDistance} onChange={(e) => setBorderDistance(e.target.value)}>
              <option value="Tutti">Tutti</option>
              <option value="variabile">variabile</option>
              <option value="fissa">fissa</option>
              <option value="0px / A filo">0px / A filo</option>
              <option value="ampia">ampia</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Distanza</label>
            <select value={gapDistance} onChange={(e) => setGapDistance(e.target.value)}>
              <option value="Tutti">Tutti</option>
              <option value="variabile">variabile</option>
              <option value="fissa">fissa</option>
              <option value="piccola">piccola</option>
              <option value="media">media</option>
              <option value="ampia">ampia</option>
            </select>
          </div>
        </div>

        <div className="filter-checkbox-row">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={showFavoritesOnly} 
              onChange={(e) => setShowFavoritesOnly(e.target.checked)} 
            />
            <Star size={14} className="star-icon-small" fill={showFavoritesOnly ? '#eab308' : 'none'} color={showFavoritesOnly ? '#eab308' : '#666'} />
            <span>Mostra solo i preferiti</span>
          </label>
        </div>
      </div>

      {/* 3. Griglia delle Miniature Preset (Layout Gallery) */}
      <div className="layout-gallery-container">
        {filteredPresets.length === 0 ? (
          <div className="no-presets-message">
            Nessun layout trovato con i filtri selezionati.
          </div>
        ) : (
          <div className="layout-gallery-grid">
            {filteredPresets.map((preset) => {
              const isActive = activePresetId === preset.id;
              return (
                <div 
                  key={preset.id}
                  className={`wireframe-card ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectPreset(preset)}
                  title={preset.title}
                >
                  <button 
                    className={`fav-toggle-btn ${preset.isFavorite ? 'fav' : ''}`}
                    onClick={(e) => toggleFavorite(e, preset.id)}
                    title={preset.isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
                  >
                    <Star 
                      size={13} 
                      fill={preset.isFavorite ? '#eab308' : 'rgba(0,0,0,0.1)'} 
                      color={preset.isFavorite ? '#eab308' : '#999'} 
                    />
                  </button>

                  {/* Canvas Vettoriale della Doppia Pagina */}
                  <div className="wireframe-spread">
                    <div className="wireframe-spine"></div>
                    {preset.frames.map((frame, fIdx) => (
                      <div 
                        key={fIdx}
                        className="wireframe-photo-box"
                        style={{
                          left: frame.left,
                          top: frame.top,
                          width: frame.width,
                          height: frame.height,
                          zIndex: frame.zIndex || 1
                        }}
                      >
                        {/* Icona vettoriale "Sole/Montagna" placeholder foto */}
                        <svg className="sun-mountain-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
                          <path d="M21 15l-5-5L5 20" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M14 14l3-3 4 4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    ))}
                  </div>

                  <span className="preset-card-title">{preset.title}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
