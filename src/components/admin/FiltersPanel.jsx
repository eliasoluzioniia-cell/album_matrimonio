import React from 'react';
import { X, RotateCcw, Layers, Sliders, Sparkles } from 'lucide-react';
import { defaultFilterPresets, DEFAULT_SLIDER_VALUES } from '../../data/filtersData';
import './FiltersPanel.css';

export const DYNAMIC_EFFECTS = [
  { id: 'none', name: 'Nessun Effetto (Statica)', description: 'Foto fissa senza movimenti' },
  { id: 'ken-burns', name: 'Ken Burns (Zoom & Pan)', description: 'Ingrandimento e scorrimento lento' },
  { id: 'ken-burns-reverse', name: 'Ken Burns Inverso', description: 'Zoom indietro e scorrimento opposto' },
  { id: 'parallax-bg', name: 'Parallasse Lento', description: 'Profondità 3D a velocità graduale' },
  { id: 'parallax-fg-fast', name: 'Parallasse Reattivo', description: 'Movimento in primo piano dinamico' },
  { id: 'pulse', name: 'Respiro Delicato (Pulse)', description: 'Micro-pulsazione morbida continua' }
];

export default function FiltersPanel({
  onClose,
  activeFilterValues = DEFAULT_SLIDER_VALUES,
  activeEffect = 'none',
  onUpdateFilterValues,
  onSelectPreset,
  onResetFilters,
  onApplyToAll,
  onSelectEffect,
  sampleImage
}) {
  const currentValues = { ...DEFAULT_SLIDER_VALUES, ...activeFilterValues };

  const handleSliderChange = (key, val) => {
    onUpdateFilterValues({
      ...currentValues,
      [key]: parseInt(val)
    });
  };

  return (
    <aside className="filters-panel-sidebar">
      {/* Header */}
      <div className="filters-panel-header">
        <h3 className="filters-panel-title">Filtri & Effetti</h3>
        <button className="filters-close-btn" onClick={onClose} title="Chiudi pannello">
          <X size={18} />
        </button>
      </div>

      <div className="filters-scroll-body">
        {/* Sezione 1: Effetti Dinamici (Ken Burns & Parallasse) */}
        <div className="filters-section">
          <h4 className="section-subtitle">
            <Sparkles size={14} />
            <span>Effetto Dinamico di Movimento</span>
          </h4>
          <div className="effects-grid">
            {DYNAMIC_EFFECTS.map(effect => (
              <button
                key={effect.id}
                className={`effect-option-btn ${activeEffect === effect.id ? 'active' : ''}`}
                onClick={() => onSelectEffect && onSelectEffect(effect.id)}
              >
                <span className="effect-name">{effect.name}</span>
                <span className="effect-desc">{effect.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sezione 2: Preset Colorimetrici 1-Click */}
        <div className="filters-section">
          <h4 className="section-subtitle">
            <Layers size={14} />
            <span>Preset Colorimetrici Pronti</span>
          </h4>
          <div className="filter-presets-grid">
            {defaultFilterPresets.map(preset => (
              <button
                key={preset.id}
                className="filter-preset-card"
                onClick={() => onSelectPreset(preset)}
              >
                <div className="preset-thumb-wrapper">
                  {sampleImage ? (
                    <img 
                      src={sampleImage} 
                      alt={preset.name}
                      style={{ filter: preset.cssString }} 
                    />
                  ) : (
                    <div className="preset-thumb-placeholder" style={{ filter: preset.cssString }} />
                  )}
                </div>
                <span className="preset-card-name">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sezione 3: Slider Manuali Fine-Tuning */}
        <div className="filters-section">
          <div className="section-header-row">
            <h4 className="section-subtitle">
              <Sliders size={14} />
              <span>Regolazione Manuale</span>
            </h4>
            <button className="reset-sliders-btn" onClick={onResetFilters} title="Ripristina filtri">
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>

          <div className="sliders-stack">
            <div className="slider-control-group">
              <div className="slider-label-row">
                <span>Luminosità</span>
                <span className="slider-value-badge">{currentValues.brightness}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="200" 
                value={currentValues.brightness} 
                onChange={(e) => handleSliderChange('brightness', e.target.value)} 
              />
            </div>

            <div className="slider-control-group">
              <div className="slider-label-row">
                <span>Contrasto</span>
                <span className="slider-value-badge">{currentValues.contrast}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="200" 
                value={currentValues.contrast} 
                onChange={(e) => handleSliderChange('contrast', e.target.value)} 
              />
            </div>

            <div className="slider-control-group">
              <div className="slider-label-row">
                <span>Saturazione</span>
                <span className="slider-value-badge">{currentValues.saturate}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="200" 
                value={currentValues.saturate} 
                onChange={(e) => handleSliderChange('saturate', e.target.value)} 
              />
            </div>

            <div className="slider-control-group">
              <div className="slider-label-row">
                <span>Sfocatura (Blur)</span>
                <span className="slider-value-badge">{currentValues.blur}px</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="20" 
                value={currentValues.blur} 
                onChange={(e) => handleSliderChange('blur', e.target.value)} 
              />
            </div>

            <div className="slider-control-group">
              <div className="slider-label-row">
                <span>Tonalità (Hue)</span>
                <span className="slider-value-badge">{currentValues.hueRotate}°</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="360" 
                value={currentValues.hueRotate} 
                onChange={(e) => handleSliderChange('hueRotate', e.target.value)} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Toolbar */}
      <div className="filters-panel-footer">
        <button className="apply-all-btn" onClick={onApplyToAll}>
          Applica a Tutte le Foto della Pagina
        </button>
      </div>
    </aside>
  );
}
