import React, { useState } from 'react';
import { X, Star, Trash2, Layers } from 'lucide-react';
import { defaultMasks } from '../../data/masksData';
import './MasksPanel.css';

export default function MasksPanel({ 
  onClose, 
  onSelectMask, 
  onRemoveMask, 
  onApplyToAll, 
  activeMaskId 
}) {
  const [masks, setMasks] = useState(() => {
    const saved = localStorage.getItem('album_masks_favs');
    if (saved) {
      try {
        const favIds = JSON.parse(saved);
        return defaultMasks.map(m => ({ ...m, isFavorite: favIds.includes(m.id) }));
      } catch (e) {
        return defaultMasks;
      }
    }
    return defaultMasks;
  });

  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const toggleFavorite = (e, maskId) => {
    e.stopPropagation();
    setMasks(prev => {
      const updated = prev.map(m => m.id === maskId ? { ...m, isFavorite: !m.isFavorite } : m);
      const favIds = updated.filter(m => m.isFavorite).map(m => m.id);
      localStorage.setItem('album_masks_favs', JSON.stringify(favIds));
      return updated;
    });
  };

  const filteredMasks = masks.filter(m => showFavoritesOnly ? m.isFavorite : true);

  return (
    <aside className="masks-panel-sidebar">
      {/* Header */}
      <div className="masks-panel-header">
        <h3 className="masks-panel-title">Bordo & Maschere</h3>
        <button className="masks-close-btn" onClick={onClose} title="Chiudi pannello">
          <X size={18} />
        </button>
      </div>

      {/* Toolbar Azioni */}
      <div className="masks-action-toolbar">
        <button className="masks-action-btn danger" onClick={onRemoveMask}>
          <Trash2 size={14} />
          <span>Rimuovi maschera</span>
        </button>

        <button className="masks-action-btn highlight" onClick={onApplyToAll}>
          <Layers size={14} />
          <span>A tutte</span>
        </button>
      </div>

      {/* Checkbox Preferiti */}
      <div className="masks-filter-row">
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={showFavoritesOnly} 
            onChange={(e) => setShowFavoritesOnly(e.target.checked)} 
          />
          <Star size={14} fill={showFavoritesOnly ? '#eab308' : 'none'} color={showFavoritesOnly ? '#eab308' : '#666'} />
          <span>Mostra solo i preferiti</span>
        </label>
      </div>

      {/* Griglia Preset a 3 Colonne */}
      <div className="masks-gallery-container">
        {filteredMasks.length === 0 ? (
          <div className="no-masks-message">Nessuna maschera nei preferiti.</div>
        ) : (
          <div className="masks-gallery-grid">
            {filteredMasks.map((mask) => {
              const isActive = activeMaskId === mask.id;
              return (
                <div 
                  key={mask.id}
                  className={`mask-preset-card ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectMask(mask)}
                  title={mask.name}
                >
                  <button 
                    className={`mask-fav-btn ${mask.isFavorite ? 'fav' : ''}`}
                    onClick={(e) => toggleFavorite(e, mask.id)}
                  >
                    <Star 
                      size={12} 
                      fill={mask.isFavorite ? '#eab308' : 'rgba(0,0,0,0.1)'} 
                      color={mask.isFavorite ? '#eab308' : '#999'} 
                    />
                  </button>

                  {/* Anteprima grafica della maschera */}
                  <div className="mask-preview-box">
                    <div 
                      className="mask-preview-shape"
                      style={mask.styleObj}
                    />
                  </div>

                  <span className="mask-card-name">{mask.name}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
