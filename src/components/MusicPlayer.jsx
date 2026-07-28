import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Utilizzo del brano musicale personalizzato presente nella cartella public:
  const audioSrc = encodeURI("/08 - Come musica.mp3");

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.log("Audio play error:", err);
      });
    }
  };

  return (
    <div style={{ position: 'fixed', top: '15px', right: '20px', zIndex: 110 }}>
      <audio ref={audioRef} src={audioSrc} loop preload="auto" />
      <button
        onClick={togglePlay}
        style={{
          background: isPlaying ? 'rgba(197, 160, 89, 0.9)' : 'rgba(30, 30, 30, 0.75)',
          backdropFilter: 'blur(10px)',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          borderRadius: '25px',
          padding: '8px 16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: "'Playfair Display', serif",
          fontSize: '0.85rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease'
        }}
      >
        <Music size={16} className={isPlaying ? 'pulse-icon' : ''} />
        <span>{isPlaying ? 'Musica ON' : 'Musica OFF'}</span>
        {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>
    </div>
  );
}
