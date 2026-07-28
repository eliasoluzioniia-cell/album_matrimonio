import React, { useState, Component } from 'react';
import LoginWall from './components/LoginWall';
import FlipbookViewer from './components/FlipbookViewer';
import AdminLayoutEditor from './components/admin/AdminLayoutEditor';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React ErrorBoundary ha catturato un'eccezione:", error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          fontFamily: 'sans-serif',
          textAlign: 'center',
          padding: '20px'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#f59e0b' }}>
            Album Matrimonio - Ripristino Sessione
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '500px', marginBottom: '1rem', lineHeight: '1.5' }}>
            È stata rilevata una discrepanza nei dati di sessione salvati nel browser. Clicca il pulsante in basso per ripristinare ed accedere all'album.
          </p>
          {this.state.error && (
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #ef4444', padding: '10px 14px', borderRadius: '6px', color: '#f87171', fontFamily: 'monospace', fontSize: '0.8rem', marginBottom: '1.5rem', maxWidth: '600px', wordBreak: 'break-all' }}>
              {this.state.error.toString()}
            </div>
          )}
          <button
            onClick={this.handleReset}
            style={{
              padding: '12px 28px',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
            }}
          >
            Ripristina Sessione & Ricarica Album
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainApp() {
  const [authMode, setAuthMode] = useState('guest');

  return (
    <>
      {authMode === 'guest' && (
        <LoginWall onLogin={(mode) => setAuthMode(mode || 'user_viewer')} />
      )}

      {authMode === 'user_viewer' && (
        <FlipbookViewer />
      )}

      {authMode === 'admin_editor' && (
        <AdminLayoutEditor onSwitchToViewer={() => setAuthMode('user_viewer')} />
      )}
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
