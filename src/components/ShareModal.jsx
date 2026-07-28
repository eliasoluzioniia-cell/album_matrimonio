import React, { useState } from 'react';
import { Share2, X, Copy, Check, MessageCircle, Mail } from 'lucide-react';

export default function ShareModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = window.location.href;
  const shareText = "Guarda l'album di matrimonio digitale di Tiziana e Fabio!";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
  const mailtoUrl = `mailto:?subject=${encodeURIComponent("Album Matrimonio Tiziana & Fabio")}&body=${encodeURIComponent(shareText + "\n" + shareUrl)}`;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          top: '15px',
          left: '20px',
          zIndex: 110,
          background: 'rgba(30, 30, 30, 0.75)',
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
        <Share2 size={16} />
        <span>Condividi</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(10px)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            style={{
              backgroundColor: '#1c1c1c',
              border: '1px solid #333',
              borderRadius: '16px',
              padding: '28px',
              width: '90%',
              maxWidth: '420px',
              color: '#fff',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}
          >
            <button
              onClick={() => setIsOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', marginBottom: '8px', color: '#c5a059' }}>
              Condividi l'Album
            </h3>
            <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '20px' }}>
              Invia questo album di matrimonio a parenti ed amici.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: '#25D366',
                  color: '#fff',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 500
                }}
              >
                <MessageCircle size={20} />
                <span>Condividi su WhatsApp</span>
              </a>

              <a
                href={mailtoUrl}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: '#333',
                  color: '#fff',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 500
                }}
              >
                <Mail size={20} />
                <span>Invia via Email</span>
              </a>

              <button
                onClick={copyToClipboard}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                  <Copy size={18} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{shareUrl}</span>
                </div>
                {copied ? <Check size={18} color="#25D366" /> : null}
              </button>
              {copied && <span style={{ color: '#25D366', fontSize: '0.8rem', textAlign: 'center' }}>Link copiato negli appunti!</span>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
