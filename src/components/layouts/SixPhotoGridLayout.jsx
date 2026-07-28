import React from 'react';

export default function SixPhotoGridLayout({ images, isLeft, onImageClick }) {
  if (!images || images.length === 0) return null;

  if (isLeft) {
    const topLeftImg = images.find(img => img.includes('DSC_0089')) || images[0];
    const bottomLeftImg = images.find(img => img.includes('DSC_0140')) || images[1];
    const rightImg = images.find(img => img.includes('DSC_0081')) || images[2];

    return (
      <div 
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
          padding: '16px 8px 16px 16px',
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ width: '48.5%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div 
            onClick={() => onImageClick && onImageClick(topLeftImg)}
            style={{ width: '100%', height: '58.5%', overflow: 'hidden', cursor: 'zoom-in' }}
          >
            <img 
              src={encodeURI(topLeftImg)} 
              alt="left-top" 
              className="ken-burns"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', border: 'none' }} 
            />
          </div>
          <div 
            onClick={() => onImageClick && onImageClick(bottomLeftImg)}
            style={{ width: '100%', height: '38.5%', overflow: 'hidden', cursor: 'zoom-in' }}
          >
            <img 
              src={encodeURI(bottomLeftImg)} 
              alt="left-bottom" 
              className="ken-burns-reverse"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', border: 'none' }} 
            />
          </div>
        </div>

        <div 
          onClick={() => onImageClick && onImageClick(rightImg)}
          style={{ width: '48.5%', height: '100%', overflow: 'hidden', cursor: 'zoom-in' }}
        >
          <img 
            src={encodeURI(rightImg)} 
            alt="left-right" 
            className="ken-burns"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', border: 'none' }} 
          />
        </div>
      </div>
    );
  } else {
    const topLeftImg = images.find(img => img.includes('DSC_0159')) || images[3] || images[0];
    const bottomLeftImg = images.find(img => img.includes('DSC_0160')) || images[4] || images[1];
    const rightImg = images.find(img => img.includes('DSC_0163')) || images[5] || images[2];

    return (
      <div 
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
          padding: '16px 16px 16px 8px',
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ width: '48.5%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div 
            onClick={() => onImageClick && onImageClick(topLeftImg)}
            style={{ width: '100%', height: '38.5%', overflow: 'hidden', cursor: 'zoom-in' }}
          >
            <img 
              src={encodeURI(topLeftImg)} 
              alt="right-top" 
              className="ken-burns-reverse"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', border: 'none' }} 
            />
          </div>
          <div 
            onClick={() => onImageClick && onImageClick(bottomLeftImg)}
            style={{ width: '100%', height: '58.5%', overflow: 'hidden', cursor: 'zoom-in' }}
          >
            <img 
              src={encodeURI(bottomLeftImg)} 
              alt="right-bottom" 
              className="ken-burns"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', border: 'none' }} 
            />
          </div>
        </div>

        <div 
          onClick={() => onImageClick && onImageClick(rightImg)}
          style={{ width: '48.5%', height: '100%', overflow: 'hidden', cursor: 'zoom-in' }}
        >
          <img 
            src={encodeURI(rightImg)} 
            alt="right-right" 
            className="ken-burns"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', border: 'none' }} 
          />
        </div>
      </div>
    );
  }
}
