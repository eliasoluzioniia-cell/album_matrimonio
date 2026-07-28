import React, { useState } from 'react';

export default function PictureInPictureLayout({ images, isLeft, onImageClick }) {
  if (!images || images.length === 0) return null;

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const bgImage = images[0];
  const insetImages = images.slice(1);

  const bgParallaxTransform = `translate3d(${mousePos.x * -8}px, ${mousePos.y * -8}px, 0)`;
  const fgParallaxTransform = `translate3d(${mousePos.x * 14}px, ${mousePos.y * 14}px, 0)`;

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#000000', overflow: 'hidden' }}
    >
      <div
        className="parallax-bg"
        onClick={() => onImageClick && onImageClick(bgImage)}
        style={{
          position: 'absolute',
          top: 0,
          left: isLeft ? '0%' : '-100%',
          width: '200%',
          height: '100%',
          zIndex: 1,
          transform: bgParallaxTransform,
          overflow: 'hidden',
          cursor: 'zoom-in'
        }}
      >
        <img
          src={encodeURI(bgImage)}
          alt="pip-bg"
          className="ken-burns"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
      </div>

      {insetImages.map((img, idx) => {
        let posStyle = {};

        if (idx === 0) {
          posStyle = { top: '8%', left: isLeft ? '5%' : '-95%', width: '80%', height: '42%' };
        } else if (idx === 1) {
          posStyle = { top: '52%', left: isLeft ? '5%' : '-95%', width: '80%', height: '40%' };
        } else if (idx === 2) {
          posStyle = { top: '8%', left: isLeft ? '115%' : '15%', width: '75%', height: '42%' };
        } else {
          posStyle = { top: '52%', left: isLeft ? '115%' : '15%', width: '75%', height: '40%' };
        }

        return (
          <div
            key={idx}
            className="parallax-fg-fast"
            onClick={() => onImageClick && onImageClick(img)}
            style={{
              position: 'absolute',
              ...posStyle,
              zIndex: idx + 2,
              border: '4px solid #000000',
              borderRadius: '0px',
              boxShadow: 'none',
              overflow: 'hidden',
              boxSizing: 'border-box',
              transform: fgParallaxTransform,
              cursor: 'zoom-in'
            }}
          >
            <img
              src={encodeURI(img)}
              alt={`pip-inset-${idx}`}
              className={idx % 2 === 0 ? 'ken-burns' : 'ken-burns-reverse'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
