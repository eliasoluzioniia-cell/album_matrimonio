import React from 'react';

export default function FullSpreadLayout({ images, isLeft, onImageClick }) {
  const image = images[0];
  if (!image) return null;

  return (
    <div 
      onClick={() => onImageClick && onImageClick(image)}
      style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', cursor: 'zoom-in' }}
    >
      <img
        src={encodeURI(image)}
        alt="panoramic"
        className="ken-burns"
        style={{
          position: 'absolute',
          top: 0,
          left: isLeft ? '0%' : '-100%',
          width: '200%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }}
      />
    </div>
  );
}
