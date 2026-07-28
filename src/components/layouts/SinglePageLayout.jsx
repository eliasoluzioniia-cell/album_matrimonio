import React from 'react';

export default function SinglePageLayout({ images }) {
  const image = images && images[0];

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      padding: '8% 6%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#ffffff', 
      boxSizing: 'border-box' 
    }}>
      {image && (
        <div style={{ 
          width: '100%', 
          height: '100%', 
          border: '1px solid #e0e0e0', 
          padding: '8px', 
          backgroundColor: '#fff', 
          boxSizing: 'border-box',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url('${encodeURI(image)}')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }} />
        </div>
      )}
    </div>
  );
}
