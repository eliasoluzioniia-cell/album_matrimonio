import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Loader2, AlertCircle } from 'lucide-react';
import { getCloudinaryUrl, getCloudinaryVideoUrl, getCloudinaryVideoPosterUrl, isVideoFile, resolveLocalFallback } from '../utils/cloudinary';

export default function LightboxModal({ media, imageSrc, onClose }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isVideoError, setIsVideoError] = useState(false);

  const rawSrc = typeof media === 'object' ? media?.src : (media || imageSrc);
  const isVideo = typeof media === 'object' ? media?.isVideo : isVideoFile(rawSrc);

  const videoUrl = isVideo ? getCloudinaryVideoUrl(rawSrc) : '';
  const videoPosterUrl = isVideo ? getCloudinaryVideoPosterUrl(rawSrc, { width: 1200 }) : '';
  const photoUrl = !isVideo ? getCloudinaryUrl(rawSrc, { width: 1400 }) : '';
  const localFallback = resolveLocalFallback(rawSrc);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.5, 1));
  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div 
        style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: '#fff',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            cursor: 'pointer',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(6px)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
          }}
        >
          <X size={24} />
        </button>

        {/* Indicatori di Caricamento Spinner Dorato */}
        {!isVideo && isImageLoading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            color: '#c5a059',
            zIndex: 5
          }}>
            <Loader2 size={40} className="spin-animation" style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: '0.85rem', letterSpacing: '1px', color: '#e2e8f0' }}>Caricamento HD da Cloudinary...</span>
          </div>
        )}

        {/* Controlli Zoom per le Foto */}
        {!isVideo && (
          <div style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255,255,255,0.15)',
            padding: '8px 18px',
            borderRadius: '24px',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.6)',
            zIndex: 10
          }}>
            <button onClick={handleZoomOut} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <ZoomOut size={20} />
            </button>
            <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>{Math.round(scale * 100)}%</span>
            <button onClick={handleZoomIn} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <ZoomIn size={20} />
            </button>

            {scale > 1 && (
              <button onClick={handleResetZoom} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', marginLeft: '8px' }}>
                <RotateCcw size={14} /> Reset
              </button>
            )}
          </div>
        )}

        {/* Media Content: Video Player vs Photo Zoom */}
        {isVideo ? (
          <div style={{ width: '90vw', maxHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {isVideoError ? (
              <div style={{
                padding: '30px 40px',
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '16px',
                color: '#f8fafc',
                textAlign: 'center',
                maxWidth: '500px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
              }}>
                <AlertCircle size={48} style={{ color: '#f59e0b', marginBottom: '12px' }} />
                <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#f1f5f9' }}>Video Non Trovato su Cloudinary</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  Per avviare la riproduzione in streaming HD, carica il file video tramite il pulsante azzurro <strong>"Carica Foto su Cloudinary"</strong> oppure incolla l'URL diretto di Cloudinary nella barra laterale dell'Editor Admin.
                </p>
              </div>
            ) : (
              <video
                src={videoUrl}
                poster={videoPosterUrl}
                controls
                autoPlay
                playsInline
                style={{
                  maxWidth: '100%',
                  maxHeight: '85vh',
                  borderRadius: '8px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
                }}
                onError={(e) => {
                  if (localFallback && e.currentTarget.src !== localFallback) {
                    e.currentTarget.src = localFallback;
                  } else {
                    setIsVideoError(true);
                  }
                }}
              />
            )}
          </div>
        ) : (
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%'
            }}
          >
            <img
              src={photoUrl}
              alt="Zoomed media"
              onLoad={() => setIsImageLoading(false)}
              onError={(e) => {
                setIsImageLoading(false);
                if (localFallback && e.currentTarget.src !== localFallback) {
                  e.currentTarget.src = localFallback;
                }
              }}
              style={{
                maxWidth: '92vw',
                maxHeight: '92vh',
                objectFit: 'contain',
                opacity: isImageLoading ? 0 : 1,
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                transition: isDragging ? 'none' : 'opacity 0.25s ease-out, transform 0.1s ease-out',
                boxShadow: '0 10px 40px rgba(0,0,0,0.7)'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
