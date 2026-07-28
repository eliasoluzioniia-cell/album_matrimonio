import React, { useState, useRef } from 'react';
import { X, Check, RotateCcw, ZoomIn, Move } from 'lucide-react';
import { resolveLocalFallback } from '../../utils/cloudinary';
import './CropModal.css';

export default function CropModal({ 
  isOpen, 
  onClose, 
  imageSrc, 
  rawImgSrc,
  pageName,
  initialCrop, 
  onApplyCrop 
}) {
  if (!isOpen || (!imageSrc && !rawImgSrc)) return null;

  const [crop, setCrop] = useState(initialCrop || { zoom: 1.0, offsetX: 0, offsetY: 0 });
  const isDragging = useRef(false);
  const startMousePos = useRef({ x: 0, y: 0 });
  const startOffset = useRef({ x: 0, y: 0 });

  const localFallback = resolveLocalFallback(rawImgSrc || imageSrc, pageName);

  const handleZoomChange = (val) => {
    setCrop(prev => ({ ...prev, zoom: parseFloat(val) }));
  };

  const handleOffsetXChange = (val) => {
    setCrop(prev => ({ ...prev, offsetX: parseInt(val) }));
  };

  const handleOffsetYChange = (val) => {
    setCrop(prev => ({ ...prev, offsetY: parseInt(val) }));
  };

  const handleReset = () => {
    setCrop({ zoom: 1.0, offsetX: 0, offsetY: 0 });
  };

  const handleApply = () => {
    onApplyCrop(crop);
    onClose();
  };

  // Dragging Mouse Handlers per centrare l'immagine col mouse
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startMousePos.current = { x: e.clientX, y: e.clientY };
    startOffset.current = { x: crop.offsetX, y: crop.offsetY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - startMousePos.current.x;
    const deltaY = e.clientY - startMousePos.current.y;
    setCrop(prev => ({
      ...prev,
      offsetX: Math.max(-150, Math.min(150, startOffset.current.x + deltaX)),
      offsetY: Math.max(-150, Math.min(150, startOffset.current.y + deltaY))
    }));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="crop-modal-overlay">
      <div className="crop-modal-container">
        {/* Header */}
        <div className="crop-modal-header">
          <div className="crop-header-title">
            <h3>Ritaglia Inquadratura Foto</h3>
            <span className="crop-subtitle">Trascina col mouse o usa gli slider per centrare il soggetto</span>
          </div>
          <button className="crop-close-btn" onClick={onClose} title="Chiudi">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body: Interactive Drag Preview Area */}
        <div className="crop-modal-body">
          <div 
            className="crop-preview-box"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: 'grab' }}
          >
            <img 
              src={imageSrc} 
              alt="Crop preview" 
              onError={(e) => {
                if (localFallback && e.currentTarget.src !== localFallback) {
                  e.currentTarget.src = localFallback;
                }
              }}
              style={{
                transform: `scale(${crop.zoom}) translate(${crop.offsetX}px, ${crop.offsetY}px)`,
                transition: isDragging.current ? 'none' : 'transform 0.05s ease-out'
              }}
            />
            <div className="crop-mask-guide">
              <div className="crop-guide-lines" />
              <div className="crop-handles-container">
                <div className="crop-handle handle-tl" />
                <div className="crop-handle handle-tc" />
                <div className="crop-handle handle-tr" />
                <div className="crop-handle handle-ml" />
                <div className="crop-handle handle-mr" />
                <div className="crop-handle handle-bl" />
                <div className="crop-handle handle-bc" />
                <div className="crop-handle handle-br" />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Controls Footer */}
        <div className="crop-modal-controls">
          <div className="crop-sliders-row">
            <div className="crop-slider-group">
              <div className="crop-slider-label">
                <ZoomIn size={14} />
                <span>Zoom Inquadratura</span>
                <span className="crop-val-badge">{Math.round(crop.zoom * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="1.0" 
                max="3.0" 
                step="0.05"
                value={crop.zoom} 
                onChange={(e) => handleZoomChange(e.target.value)} 
              />
            </div>

            <div className="crop-slider-group">
              <div className="crop-slider-label">
                <Move size={14} />
                <span>Spostamento Orizzontale (X)</span>
                <span className="crop-val-badge">{crop.offsetX}px</span>
              </div>
              <input 
                type="range" 
                min="-150" 
                max="150" 
                step="1"
                value={crop.offsetX} 
                onChange={(e) => handleOffsetXChange(e.target.value)} 
              />
            </div>

            <div className="crop-slider-group">
              <div className="crop-slider-label">
                <Move size={14} />
                <span>Spostamento Verticale (Y)</span>
                <span className="crop-val-badge">{crop.offsetY}px</span>
              </div>
              <input 
                type="range" 
                min="-150" 
                max="150" 
                step="1"
                value={crop.offsetY} 
                onChange={(e) => handleOffsetYChange(e.target.value)} 
              />
            </div>
          </div>

          <div className="crop-actions-row">
            <button className="crop-btn reset" onClick={handleReset}>
              <RotateCcw size={14} />
              <span>Ripristina</span>
            </button>
            <div className="crop-actions-right">
              <button className="crop-btn cancel" onClick={onClose}>
                Annulla
              </button>
              <button className="crop-btn apply" onClick={handleApply}>
                <Check size={16} />
                <span>Applica Ritaglio</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
