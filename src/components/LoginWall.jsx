import { useState } from 'react';
import { Lock, KeyRound } from 'lucide-react';
import albumData from '../albumData.json';

export default function LoginWall({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAdminLogin = () => {
    try {
      const p = localStorage.getItem('admin_album_pages');
      if (p) JSON.parse(p);
    } catch (e) {
      localStorage.removeItem('admin_album_pages');
    }
    try {
      const c = localStorage.getItem('admin_layout_coords');
      if (c) JSON.parse(c);
    } catch (e) {
      localStorage.removeItem('admin_layout_coords');
    }
    onLogin('admin_editor');
  };

  const handleViewerLogin = () => {
    onLogin('user_viewer');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanPw = password.trim().toLowerCase();
    if (cleanPw.includes('admin') || cleanPw === '123' || cleanPw === 'admin123') {
      handleAdminLogin();
    } else if (cleanPw !== '') {
      handleViewerLogin();
    } else {
      // Se vuoto, si può accedere comunque in lettura
      handleViewerLogin();
    }
  };

  const bgImage = albumData.login ? `url('${albumData.login}')` : 'none';

  return (
    <div 
      className="login-container"
      style={{ 
        backgroundColor: '#0f172a',
        backgroundImage: `${bgImage}, linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 25%',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div 
        className="login-box"
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          padding: '40px 30px',
          maxWidth: '440px',
          width: '100%',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          color: '#ffffff',
          textAlign: 'center'
        }}
      >
        <div className="flex-center" style={{ marginBottom: '1.2rem', color: '#f59e0b', display: 'flex', justifyContent: 'center' }}>
          <Lock size={44} strokeWidth={1.5} />
        </div>
        <h1 className="login-title" style={{ color: '#ffffff', fontSize: '2rem', marginBottom: '0.5rem' }}>
          Album Matrimonio
        </h1>
        <p className="login-subtitle" style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: '1.4' }}>
          Ricordi di Fabio e Tiziana • Inserisci la password per accedere
        </p>

        {/* Form Password Classico */}
        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative', marginBottom: '15px' }}>
            <input
              type="password"
              className="login-input"
              placeholder="Inserisci la password..."
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              autoFocus
              style={{
                width: '100%',
                padding: '14px 16px',
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '1rem',
                outline: 'none',
                textAlign: 'center',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {error && <p className="error-text" style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '10px' }}>{error}</p>}

          <button 
            type="submit" 
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(2, 132, 199, 0.4)',
              transition: 'all 0.2s ease'
            }}
          >
            <KeyRound size={20} />
            <span>ACCEDI ALL'ALBUM</span>
          </button>
        </form>
      </div>
    </div>
  );
}
