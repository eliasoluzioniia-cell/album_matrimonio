import React from 'react';

export default function AsymmetricGridLayout({ images, isLeft, onImageClick }) {
  if (!images || images.length === 0) return null;

  if (images.length === 3) {
    if (isLeft) {
      const topImg = images.find(img => img.includes('DSC_0049')) || images[0];
      const bottomImg = images.find(img => img.includes('DSC_0069')) || images[1];

      return (
        <div 
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
            padding: '16px 8px 16px 16px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div 
            onClick={() => onImageClick && onImageClick(topImg)}
            style={{ width: '100%', height: '48.5%', overflow: 'hidden', cursor: 'zoom-in' }}
          >
            <img 
              src={encodeURI(topImg)} 
              alt="left-top" 
              className="ken-burns"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', border: 'none' }} 
            />
          </div>

          <div 
            onClick={() => onImageClick && onImageClick(bottomImg)}
            style={{ width: '100%', height: '48.5%', overflow: 'hidden', cursor: 'zoom-in' }}
          >
            <img 
              src={encodeURI(bottomImg)} 
              alt="left-bottom" 
              className="ken-burns-reverse"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', border: 'none' }} 
            />
          </div>
        </div>
      );
    } else {
      const rightImg = images.find(img => img.includes('DSC_0078')) || images[2] || images[0];

      return (
        <div 
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
            padding: '16px 16px 16px 8px',
            boxSizing: 'border-box'
          }}
        >
          <div 
            onClick={() => onImageClick && onImageClick(rightImg)}
            style={{ width: '100%', height: '100%', overflow: 'hidden', cursor: 'zoom-in' }}
          >
            <img 
              src={encodeURI(rightImg)} 
              alt="right-main" 
              className="ken-burns"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', border: 'none' }} 
            />
          </div>
        </div>
      );
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#ffffff', padding: '16px', boxSizing: 'border-box' }}>
      <div 
        onClick={() => onImageClick && onImageClick(images[0])}
        style={{ width: '100%', height: '100%', overflow: 'hidden', cursor: 'zoom-in' }}
      >
        <img src={encodeURI(images[0])} alt="grid-default" className="ken-burns" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    </div>
  );
}
