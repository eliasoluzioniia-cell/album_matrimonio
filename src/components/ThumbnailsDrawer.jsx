import React, { useState } from 'react';
import { BookOpen, ChevronUp, ChevronDown } from 'lucide-react';

export default function ThumbnailsDrawer({ pagesData, onSelectPage, currentPage }) {
  const [isOpen, setIsOpen] = useState(false);

  const getPageTitle = (name, index) => {
    if (index === 0) return 'Copertina';
    if (name === 'pg 2_3') return 'Preparativi - Trucco & Fedi';
    if (name === 'pg 4_5') return 'Momenti Intimi';
    if (name === 'pg 6_7') return 'Ritratti Sposa';
    if (name === 'pg 8_9') return 'Foto di Gruppo';
    if (name === 'pg 10_11') return 'La Cerimonia';
    if (name === 'pg 12_13') return 'Ritratti Insieme';
    if (name === 'pg 14_15') return 'La Festa';
    if (name === 'pg 16_17') return 'Panorama Finale';
    return `Pagina ${index + 1}`;
  };

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'rgba(26, 26, 26, 0.85)',
          backdropFilter: 'blur(10px)',
          color: '#ffffff',
          border: '1px solid rgba(255,255,255,0.2)',
          borderBottom: 'none',
          padding: '8px 18px',
          borderRadius: '12px 12px 0 0',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: "'Playfair Display', serif",
          fontSize: '0.9rem',
          boxShadow: '0 -4px 15px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease'
        }}
      >
        <BookOpen size={16} />
        <span>Indice Pagine</span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>

      {/* Thumbnails Carousel */}
      {isOpen && (
        <div
          style={{
            width: '100%',
            backgroundColor: 'rgba(18, 18, 18, 0.95)',
            backdropFilter: 'blur(15px)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            padding: '14px 20px',
            display: 'flex',
            gap: '16px',
            overflowX: 'auto',
            boxSizing: 'border-box',
            boxShadow: '0 -10px 25px rgba(0,0,0,0.4)',
            scrollBehavior: 'smooth'
          }}
        >
          {pagesData.map((page, idx) => {
            const previewImg = page.images && page.images.length > 0 ? page.images[0] : null;
            const title = getPageTitle(page.name, idx);

            return (
              <div
                key={idx}
                onClick={() => {
                  onSelectPage(idx);
                  setIsOpen(false);
                }}
                style={{
                  flex: '0 0 auto',
                  width: '120px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'transform 0.2s ease'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '75px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: currentPage === idx ? '2px solid #c5a059' : '1px solid rgba(255,255,255,0.2)',
                    boxShadow: currentPage === idx ? '0 0 12px rgba(197, 160, 89, 0.6)' : '0 2px 8px rgba(0,0,0,0.3)',
                    backgroundColor: '#111'
                  }}
                >
                  {previewImg ? (
                    <img src={encodeURI(previewImg)} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '0.75rem' }}>
                      Copertina
                    </div>
                  )}
                </div>
                <span style={{ color: currentPage === idx ? '#c5a059' : '#cccccc', fontSize: '0.72rem', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                  {title}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
