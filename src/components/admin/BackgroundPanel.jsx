import React from 'react';
import { X, Palette } from 'lucide-react';
import './BackgroundPanel.css';

const PRESET_COLORS = [
  { id: 'white', name: 'Bianco Seta', hex: '#ffffff' },
  { id: 'cream', name: 'Crema Perla', hex: '#fdfbf7' },
  { id: 'gold', name: 'Oro Dorato', hex: '#f7f1e3' },
  { id: 'rose', name: 'Rosa Cipria', hex: '#fcf5f3' },
  { id: 'silver', name: 'Grigio Perla', hex: '#f1f5f9' },
  { id: 'black', name: 'Nero Antracite', hex: '#0f172a' },
  { id: 'navy', name: 'Blu Notte', hex: '#090d16' },
  { id: 'vintage', name: 'Carta D\'Epoca', hex: '#f4ede4' }
];

export default function BackgroundPanel({ 
  onClose, 
  activeBgColor, 
  onSelectBgColor 
}) {
  return (
    <div className="sidebar-panel background-panel">
      <div className="panel-header">
        <div className="panel-title-box">
          <Palette size={18} className="panel-icon" />
          <h3>Sfondo Pagina</h3>
        </div>
        <button className="panel-close-btn" onClick={onClose} title="Chiudi">
          <X size={18} />
        </button>
      </div>

      <div className="panel-content">
        <div className="panel-section">
          <h4 className="section-title">Colori Predefiniti Album</h4>
          <div className="color-presets-grid">
            {PRESET_COLORS.map(color => (
              <button
                key={color.id}
                className={`color-preset-item ${activeBgColor === color.hex ? 'active' : ''}`}
                style={{ backgroundColor: color.hex }}
                onClick={() => onSelectBgColor(color.hex)}
                title={color.name}
              >
                {activeBgColor === color.hex && <div className="color-check-dot" />}
              </button>
            ))}
          </div>
        </div>

        <div className="panel-section">
          <h4 className="section-title">Colore Personalizzato</h4>
          <div className="custom-color-row">
            <input 
              type="color" 
              className="color-picker-input"
              value={activeBgColor || '#ffffff'}
              onChange={(e) => onSelectBgColor(e.target.value)}
            />
            <span className="color-hex-label">{activeBgColor || '#ffffff'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
