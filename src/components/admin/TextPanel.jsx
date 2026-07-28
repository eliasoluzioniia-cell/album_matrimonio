import React from 'react';
import { X, Type, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import './TextPanel.css';

const FONT_OPTIONS = [
  { id: 'Great Vibes', name: 'Great Vibes (Corsivo Elegante)', family: "'Great Vibes', cursive" },
  { id: 'Playfair Display', name: 'Playfair Display (Classico)', family: "'Playfair Display', serif" },
  { id: 'Cormorant Garamond', name: 'Cormorant Garamond (Raffinato)', family: "'Cormorant Garamond', serif" },
  { id: 'Source Sans Pro', name: 'Source Sans Pro (Moderno)', family: "'Source Sans Pro', sans-serif" },
  { id: 'Montserrat', name: 'Montserrat (Pulito)', family: "'Montserrat', sans-serif" }
];

export default function TextPanel({
  onClose,
  selectedElement,
  onUpdateTextProp
}) {
  if (!selectedElement || selectedElement.type !== 'text') {
    return (
      <div className="sidebar-panel text-panel">
        <div className="panel-header">
          <div className="panel-title-box">
            <Type size={18} className="panel-icon" />
            <h3>Editor di Testo</h3>
          </div>
          <button className="panel-close-btn" onClick={onClose} title="Chiudi">
            <X size={18} />
          </button>
        </div>
        <div className="panel-content empty-state">
          <p>Nessun elemento di testo selezionato.</p>
          <span className="sub-text">Clicca su "+ Inserire testo" in alto o seleziona una scritta sul Canvas.</span>
        </div>
      </div>
    );
  }

  const textVal = selectedElement.text || 'Immettere qui il testo';
  const fontFamily = selectedElement.fontFamily || "'Great Vibes', cursive";
  const fontSize = selectedElement.fontSize || 40;
  const fontColor = selectedElement.color || '#000000';
  const align = selectedElement.align || 'center';
  const isBold = !!selectedElement.bold;
  const isItalic = !!selectedElement.italic;
  const isUnderline = !!selectedElement.underline;

  return (
    <div className="sidebar-panel text-panel">
      <div className="panel-header">
        <div className="panel-title-box">
          <Type size={18} className="panel-icon" />
          <h3>Editor di Testo</h3>
        </div>
        <button className="panel-close-btn" onClick={onClose} title="Chiudi">
          <X size={18} />
        </button>
      </div>

      <div className="panel-content">
        {/* Modifica Testo Live */}
        <div className="panel-section">
          <h4 className="section-title">Contenuto Testo</h4>
          <textarea
            className="text-input-field"
            rows={3}
            value={textVal}
            onChange={(e) => onUpdateTextProp('text', e.target.value)}
            placeholder="Immettere qui il testo..."
          />
        </div>

        {/* Tipo di Font */}
        <div className="panel-section">
          <h4 className="section-title">Tipo di font</h4>
          <select 
            className="text-select-field"
            value={fontFamily}
            onChange={(e) => onUpdateTextProp('fontFamily', e.target.value)}
          >
            {FONT_OPTIONS.map(font => (
              <option key={font.id} value={font.family} style={{ fontFamily: font.family }}>
                {font.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dimensione Font */}
        <div className="panel-section">
          <div className="label-with-value">
            <h4 className="section-title">Dimensione font</h4>
            <span className="val-badge">{fontSize} pt</span>
          </div>
          <input 
            type="range" 
            min="14" 
            max="96" 
            step="1"
            value={fontSize}
            onChange={(e) => onUpdateTextProp('fontSize', parseInt(e.target.value))}
          />
        </div>

        {/* Stili Testo: Grassetto, Corsivo, Sottolineato */}
        <div className="panel-section">
          <h4 className="section-title">Stile del testo</h4>
          <div className="text-style-toolbar">
            <button 
              className={`style-btn ${isBold ? 'active' : ''}`}
              onClick={() => onUpdateTextProp('bold', !isBold)}
              title="Grassetto"
            >
              <Bold size={16} />
            </button>
            <button 
              className={`style-btn ${isItalic ? 'active' : ''}`}
              onClick={() => onUpdateTextProp('italic', !isItalic)}
              title="Corsivo"
            >
              <Italic size={16} />
            </button>
            <button 
              className={`style-btn ${isUnderline ? 'active' : ''}`}
              onClick={() => onUpdateTextProp('underline', !isUnderline)}
              title="Sottolineato"
            >
              <Underline size={16} />
            </button>
          </div>
        </div>

        {/* Colore del Testo */}
        <div className="panel-section">
          <h4 className="section-title">Colore del testo</h4>
          <div className="custom-color-row">
            <input 
              type="color" 
              className="color-picker-input"
              value={fontColor}
              onChange={(e) => onUpdateTextProp('color', e.target.value)}
            />
            <span className="color-hex-label">{fontColor}</span>
          </div>
        </div>

        {/* Allineamento */}
        <div className="panel-section">
          <h4 className="section-title">Allineamento</h4>
          <div className="text-style-toolbar">
            <button 
              className={`style-btn ${align === 'left' ? 'active' : ''}`}
              onClick={() => onUpdateTextProp('align', 'left')}
              title="A Sinistra"
            >
              <AlignLeft size={16} />
            </button>
            <button 
              className={`style-btn ${align === 'center' ? 'active' : ''}`}
              onClick={() => onUpdateTextProp('align', 'center')}
              title="Al Centro"
            >
              <AlignCenter size={16} />
            </button>
            <button 
              className={`style-btn ${align === 'right' ? 'active' : ''}`}
              onClick={() => onUpdateTextProp('align', 'right')}
              title="A Destra"
            >
              <AlignRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
