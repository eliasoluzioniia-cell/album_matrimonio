import React from 'react';
import { X, Play, Film, Volume2, VolumeX, Repeat, Clock, Layers, Link as LinkIcon, MousePointer, Sparkles } from 'lucide-react';
import './VideoPanel.css';

export default function VideoPanel({ 
  onClose, 
  selectedElement, 
  onUpdateVideoSettings,
  onUpdateElementFile
}) {
  if (!selectedElement) {
    return (
      <aside className="video-panel-sidebar">
        <div className="video-panel-header">
          <h3 className="video-panel-title">Impostazioni Video</h3>
          <button className="video-close-btn" onClick={onClose} title="Chiudi pannello">
            <X size={18} />
          </button>
        </div>
        <div className="no-selection-message">
          Seleziona un riquadro fotografico/video sul Canvas per modificarne le impostazioni multimediali.
        </div>
      </aside>
    );
  }

  const videoSettings = selectedElement.videoSettings || {
    autoplay: false,
    playOnHover: true,
    loop: true,
    muted: true,
    controls: true,
    startOffset: 0,
    effect3D: {
      enabled: true,
      tiltMaxAngle: 12,
      glareEnabled: true,
      scaleOnHover: 1.03
    }
  };

  const effect3D = videoSettings.effect3D || {
    enabled: true,
    tiltMaxAngle: 12,
    glareEnabled: true,
    scaleOnHover: 1.03
  };

  const currentFile = selectedElement.file || selectedElement.cloudinaryPublicId || '';

  const handleToggleSetting = (key) => {
    onUpdateVideoSettings({
      ...videoSettings,
      [key]: !videoSettings[key]
    });
  };

  const handleToggle3DSetting = (key) => {
    onUpdateVideoSettings({
      ...videoSettings,
      effect3D: {
        ...effect3D,
        [key]: !effect3D[key]
      }
    });
  };

  const handleTiltAngleChange = (val) => {
    onUpdateVideoSettings({
      ...videoSettings,
      effect3D: {
        ...effect3D,
        tiltMaxAngle: parseInt(val) || 12
      }
    });
  };

  const handleOffsetChange = (val) => {
    onUpdateVideoSettings({
      ...videoSettings,
      startOffset: parseInt(val) || 0
    });
  };

  const handleFileUrlChange = (e) => {
    const val = e.target.value;
    if (onUpdateElementFile) {
      onUpdateElementFile(val);
    }
  };

  return (
    <aside className="video-panel-sidebar">
      {/* Header */}
      <div className="video-panel-header">
        <h3 className="video-panel-title">
          <Film size={18} style={{ color: '#38bdf8' }} />
          <span>Impostazioni Video & Media</span>
        </h3>
        <button className="video-close-btn" onClick={onClose} title="Chiudi pannello">
          <X size={18} />
        </button>
      </div>

      <div className="video-scroll-body">
        {/* Sezione 0: Incolla URL / Public ID Cloudinary */}
        <div className="video-section">
          <h4 className="section-subtitle">
            <LinkIcon size={14} style={{ color: '#38bdf8' }} />
            <span>Sorgente Media Cloudinary</span>
          </h4>

          <div className="slider-control-group">
            <div className="slider-label-row">
              <span>Incolla URL o Public ID</span>
            </div>
            <input 
              type="text" 
              className="cloudinary-url-input"
              placeholder="https://res.cloudinary.com/..." 
              value={currentFile} 
              onChange={handleFileUrlChange} 
              style={{
                width: '100%',
                padding: '8px 12px',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '6px',
                color: '#f8fafc',
                fontSize: '0.85rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <span className="slider-hint">
              Incolla l'URL copiato da Cloudinary (es. https://res.cloudinary.com/jkxwp5hj/video/upload/...) o il Public ID.
            </span>
          </div>
        </div>

        {/* Sezione 1: Parametri di Riproduzione */}
        <div className="video-section">
          <h4 className="section-subtitle">
            <Play size={14} />
            <span>Parametri di Riproduzione</span>
          </h4>

          <div className="video-toggles-list">
            <label className="video-toggle-row">
              <div className="toggle-info">
                <span className="toggle-title">Avvia all'Hover del Mouse</span>
                <span className="toggle-desc">Riproduce il video quando il mouse passa sulla copertina</span>
              </div>
              <input 
                type="checkbox" 
                checked={videoSettings.playOnHover !== false} 
                onChange={() => handleToggleSetting('playOnHover')} 
              />
            </label>

            <label className="video-toggle-row">
              <div className="toggle-info">
                <span className="toggle-title">Avvio Automatico (Autoplay)</span>
                <span className="toggle-desc">Riproduce il video alla voltata di pagina</span>
              </div>
              <input 
                type="checkbox" 
                checked={!!videoSettings.autoplay} 
                onChange={() => handleToggleSetting('autoplay')} 
              />
            </label>

            <label className="video-toggle-row">
              <div className="toggle-info">
                <span className="toggle-title">Ripeti in Ciclo (Loop)</span>
                <span className="toggle-desc">Ricomincia da capo una volta terminato</span>
              </div>
              <input 
                type="checkbox" 
                checked={!!videoSettings.loop} 
                onChange={() => handleToggleSetting('loop')} 
              />
            </label>

            <label className="video-toggle-row">
              <div className="toggle-info">
                <span className="toggle-title">Disattiva Audio (Muted)</span>
                <span className="toggle-desc">Riproduce il video in modalità silenziosa</span>
              </div>
              <input 
                type="checkbox" 
                checked={!!videoSettings.muted} 
                onChange={() => handleToggleSetting('muted')} 
              />
            </label>

            <label className="video-toggle-row">
              <div className="toggle-info">
                <span className="toggle-title">Mostra Controlli Player</span>
                <span className="toggle-desc">Barra di avanzamento e pulsante di pausa</span>
              </div>
              <input 
                type="checkbox" 
                checked={!!videoSettings.controls} 
                onChange={() => handleToggleSetting('controls')} 
              />
            </label>
          </div>
        </div>

        {/* Sezione 2: Effetto 3D Tilt & Riflesso (Modello Carta 3D) */}
        <div className="video-section">
          <h4 className="section-subtitle">
            <Layers size={14} style={{ color: '#f59e0b' }} />
            <span>Effetto 3D Parallax Tilt (Carta 3D)</span>
          </h4>

          <div className="video-toggles-list">
            <label className="video-toggle-row">
              <div className="toggle-info">
                <span className="toggle-title">Abilita Effetto 3D Tilt</span>
                <span className="toggle-desc">Rotazione e rilievo 3D al passaggio del mouse</span>
              </div>
              <input 
                type="checkbox" 
                checked={!!effect3D.enabled} 
                onChange={() => handleToggle3DSetting('enabled')} 
              />
            </label>

            {effect3D.enabled && (
              <>
                <label className="video-toggle-row">
                  <div className="toggle-info">
                    <span className="toggle-title">Mostra Riflesso di Luce (Glare)</span>
                    <span className="toggle-desc">Bagliore luminoso dinamico che segue il cursore</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={!!effect3D.glareEnabled} 
                    onChange={() => handleToggle3DSetting('glareEnabled')} 
                  />
                </label>

                <div className="slider-control-group">
                  <div className="slider-label-row">
                    <span>Intensità Inclinazione</span>
                    <span className="slider-value-badge">{effect3D.tiltMaxAngle || 12}°</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="25" 
                    step="1"
                    value={effect3D.tiltMaxAngle || 12} 
                    onChange={(e) => handleTiltAngleChange(e.target.value)} 
                  />
                  <span className="slider-hint">
                    Angolo di rotazione 3D in gradi (da 5° a 25°, consigliato 12°).
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sezione 3: Fotogramma Copertina (Cloudinary so_sec) */}
        <div className="video-section">
          <h4 className="section-subtitle">
            <Clock size={14} />
            <span>Fotogramma Copertina (Cloudinary Poster)</span>
          </h4>

          <div className="slider-control-group">
            <div className="slider-label-row">
              <span>Secondo del Frame</span>
              <span className="slider-value-badge">{videoSettings.startOffset || 0} sec (so_{videoSettings.startOffset || 0})</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="60" 
              step="1"
              value={videoSettings.startOffset || 0} 
              onChange={(e) => handleOffsetChange(e.target.value)} 
            />
            <span className="slider-hint">
              Estrae al volo il fotogramma al secondo selezionato come foto di copertina per l'album.
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
