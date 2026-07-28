import React from 'react';
import { 
  X, 
  Lock, 
  Unlock, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  Crop,
  Move
} from 'lucide-react';
import './PositionPanel.css';

export default function PositionPanel({ 
  onClose, 
  selectedElement, 
  onUpdateElementRect, 
  onUpdateInnerCrop, 
  onAlignElement, 
  onChangeZIndex,
  onOpenCropModal
}) {
  if (!selectedElement) {
    return (
      <aside className="position-panel-sidebar">
        <div className="position-panel-header">
          <h3 className="position-panel-title">Posizione & Crop</h3>
          <button className="position-close-btn" onClick={onClose} title="Chiudi pannello">
            <X size={18} />
          </button>
        </div>
        <div className="no-selection-message">
          Seleziona un riquadro fotografico sul Canvas per modificarne la posizione ed il ritaglio.
        </div>
      </aside>
    );
  }

  // Estrazione dati rettangolo cornice e ritaglio interno
  const leftVal = parseFloat(selectedElement.left) || 0;
  const topVal = parseFloat(selectedElement.top) || 0;
  const widthVal = parseFloat(selectedElement.width) || 40;
  const heightVal = parseFloat(selectedElement.height) || 40;
  const zIndexVal = selectedElement.zIndex || 1;

  const innerCrop = selectedElement.innerCrop || {
    zoom: 1.0,
    offsetX: 0,
    offsetY: 0,
    aspectRatioLocked: true
  };

  const handleRectChange = (key, val) => {
    const numVal = parseFloat(val) || 0;
    onUpdateElementRect({
      ...selectedElement,
      [key]: `${numVal}%`
    });
  };

  const handleInnerCropChange = (key, val) => {
    onUpdateInnerCrop({
      ...innerCrop,
      [key]: val
    });
  };

  const toggleAspectRatioLock = () => {
    onUpdateInnerCrop({
      ...innerCrop,
      aspectRatioLocked: !innerCrop.aspectRatioLocked
    });
  };

  return (
    <aside className="position-panel-sidebar">
      {/* Header */}
      <div className="position-panel-header">
        <h3 className="position-panel-title">Posizione & Crop</h3>
        <button className="position-close-btn" onClick={onClose} title="Chiudi pannello">
          <X size={18} />
        </button>
      </div>

      <div className="position-scroll-body">
        {/* Sezione 1: Coordinate & Dimensioni Cornice */}
        <div className="position-section">
          <h4 className="section-subtitle">
            <Move size={14} />
            <span>Cornice (Posizione & Dimensioni)</span>
          </h4>

          <div className="inputs-grid-2x2">
            <div className="input-field-group">
              <label>Posizione X (%)</label>
              <input 
                type="number" 
                value={Math.round(leftVal)} 
                onChange={(e) => handleRectChange('left', e.target.value)} 
              />
            </div>
            <div className="input-field-group">
              <label>Posizione Y (%)</label>
              <input 
                type="number" 
                value={Math.round(topVal)} 
                onChange={(e) => handleRectChange('top', e.target.value)} 
              />
            </div>
            <div className="input-field-group">
              <label>Larghezza W (%)</label>
              <input 
                type="number" 
                value={Math.round(widthVal)} 
                onChange={(e) => handleRectChange('width', e.target.value)} 
              />
            </div>
            <div className="input-field-group">
              <label>Altezza H (%)</label>
              <input 
                type="number" 
                value={Math.round(heightVal)} 
                onChange={(e) => handleRectChange('height', e.target.value)} 
              />
            </div>
          </div>

          <div className="aspect-ratio-row">
            <button className="aspect-lock-btn" onClick={toggleAspectRatioLock}>
              {innerCrop.aspectRatioLocked ? <Lock size={14} color="#2563eb" /> : <Unlock size={14} color="#64748b" />}
              <span>Mantieni proporzioni (Aspect Ratio Lock)</span>
            </button>
          </div>
        </div>

        {/* Sezione 2: Inquadratura & Ritaglio Classico */}
        <div className="position-section">
          <h4 className="section-subtitle">
            <Crop size={14} />
            <span>Inquadratura & Ritaglio Foto</span>
          </h4>

          {onOpenCropModal && (
            <button 
              className="open-crop-modal-btn" 
              onClick={onOpenCropModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '10px'
              }}
            >
              <Crop size={16} />
              <span>Apri Finestra Ritaglio Foto</span>
            </button>
          )}

          <div className="sliders-stack">
            <div className="slider-control-group">
              <div className="slider-label-row">
                <span>Zoom Interno</span>
                <span className="slider-value-badge">{Math.round(innerCrop.zoom * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="1.0" 
                max="3.0" 
                step="0.05"
                value={innerCrop.zoom} 
                onChange={(e) => handleInnerCropChange('zoom', parseFloat(e.target.value))} 
              />
            </div>

            <div className="slider-control-group">
              <div className="slider-label-row">
                <span>Offset Orizzontale (X)</span>
                <span className="slider-value-badge">{innerCrop.offsetX}px</span>
              </div>
              <input 
                type="range" 
                min="-150" 
                max="150" 
                step="1"
                value={innerCrop.offsetX} 
                onChange={(e) => handleInnerCropChange('offsetX', parseInt(e.target.value))} 
              />
            </div>

            <div className="slider-control-group">
              <div className="slider-label-row">
                <span>Offset Verticale (Y)</span>
                <span className="slider-value-badge">{innerCrop.offsetY}px</span>
              </div>
              <input 
                type="range" 
                min="-150" 
                max="150" 
                step="1"
                value={innerCrop.offsetY} 
                onChange={(e) => handleInnerCropChange('offsetY', parseInt(e.target.value))} 
              />
            </div>
          </div>
        </div>

        {/* Sezione 3: Allineamento Rapido */}
        <div className="position-section">
          <h4 className="section-subtitle">Allineamento Rapido</h4>
          <div className="alignment-buttons-grid">
            <button className="align-btn" onClick={() => onAlignElement('left')} title="Allinea a Sinistra">
              <AlignLeft size={16} />
              <span>Sinistra</span>
            </button>
            <button className="align-btn" onClick={() => onAlignElement('center-h')} title="Centra Orizzontalmente">
              <AlignCenter size={16} />
              <span>Centra H</span>
            </button>
            <button className="align-btn" onClick={() => onAlignElement('right')} title="Allinea a Destra">
              <AlignRight size={16} />
              <span>Destra</span>
            </button>

            <button className="align-btn" onClick={() => onAlignElement('top')} title="Allinea in Alto">
              <ArrowUp size={16} />
              <span>In Alto</span>
            </button>
            <button className="align-btn" onClick={() => onAlignElement('center-v')} title="Centra Verticalmente">
              <AlignCenter size={16} />
              <span>Centra V</span>
            </button>
            <button className="align-btn" onClick={() => onAlignElement('bottom')} title="Allinea in Basso">
              <ArrowDown size={16} />
              <span>In Basso</span>
            </button>
          </div>
        </div>

        {/* Sezione 4: Disposizione Livelli Z-Index */}
        <div className="position-section">
          <h4 className="section-subtitle">Disposizione Livelli (Z-Index: {zIndexVal})</h4>
          <div className="zindex-buttons-grid">
            <button className="zindex-btn" onClick={() => onChangeZIndex('top')} title="Porta in primo piano">
              <ChevronsUp size={16} />
              <span>Primo Piano</span>
            </button>
            <button className="zindex-btn" onClick={() => onChangeZIndex('up')} title="Avanti di un livello">
              <ArrowUp size={16} />
              <span>Avanti +1</span>
            </button>

            <button className="zindex-btn" onClick={() => onChangeZIndex('down')} title="Indietro di un livello">
              <ArrowDown size={16} />
              <span>Indietro -1</span>
            </button>
            <button className="zindex-btn" onClick={() => onChangeZIndex('bottom')} title="Porta in secondo piano">
              <ChevronsDown size={16} />
              <span>Secondo Piano</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
