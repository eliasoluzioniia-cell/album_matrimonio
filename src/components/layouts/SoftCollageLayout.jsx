import React from 'react';

export default function SoftCollageLayout({ images, isLeft, pageName, onImageClick }) {
  if (!images || images.length === 0) return null;

  // Mappatura esatta per pg 10_11 (Pagina 9 di Saal Digital - Foto Cerimonia & Sposi con sfumatura morbida)
  if (pageName === 'pg 10_11' && images.length === 3) {
    const altarImg = images.find(img => img.includes('4892')) || images[0];
    const familyImg = images.find(img => img.includes('9057')) || images[1];
    const kissImg = images.find(img => img.includes('0294')) || images[2];

    return (
      <div className="collage-container" style={{ backgroundColor: '#1a1a1a', width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
        {/* Foto 1 (Altar/Cerimonia): A Sinistra con sfumatura morbida verso destra */}
        <div
          onClick={() => onImageClick && onImageClick(altarImg)}
          style={{
            position: 'absolute',
            top: 0,
            left: isLeft ? '0%' : '-100%',
            width: '95%',
            height: '100%',
            zIndex: 1,
            backgroundImage: `url('${encodeURI(altarImg)}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            maskImage: 'linear-gradient(to right, black 50%, rgba(0,0,0,0.7) 75%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, black 50%, rgba(0,0,0,0.7) 75%, transparent 100%)',
            cursor: 'zoom-in'
          }}
        />

        {/* Foto 2 (Famiglia col bimbo al centro): Al centro a cavallo tra le pagine con sfumatura su entrambi i lati */}
        <div
          onClick={() => onImageClick && onImageClick(familyImg)}
          style={{
            position: 'absolute',
            top: 0,
            left: isLeft ? '60%' : '-40%',
            width: '80%',
            height: '100%',
            zIndex: 2,
            backgroundImage: `url('${encodeURI(familyImg)}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
            cursor: 'zoom-in'
          }}
        />

        {/* Foto 3 (Bacio davanti alla statua): A Destra con sfumatura morbida da sinistra */}
        <div
          onClick={() => onImageClick && onImageClick(kissImg)}
          style={{
            position: 'absolute',
            top: 0,
            left: isLeft ? '115%' : '15%',
            width: '85%',
            height: '100%',
            zIndex: 3,
            backgroundImage: `url('${encodeURI(kissImg)}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.7) 25%, black 50%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.7) 25%, black 50%)',
            cursor: 'zoom-in'
          }}
        />
      </div>
    );
  }

  // Fallback generico per pg 2_3 e pg 4_5
  return (
    <div className="collage-container" style={{ backgroundColor: '#ffffff', width: '100%', height: '100%', position: 'relative' }}>
      {images.map((img, idx) => {
        let style = {};
        let extraClass = 'soft-edge';

        if (images.length === 4) {
          if (idx === 3) {
            style = { 
              top: '2%', 
              left: isLeft ? '3%' : '-97%', 
              width: '88%', 
              height: '42%', 
              zIndex: 1, 
              maskImage: 'radial-gradient(ellipse at 40% 45%, black 10%, rgba(0,0,0,0.8) 40%, transparent 80%)', 
              WebkitMaskImage: 'radial-gradient(ellipse at 40% 45%, black 10%, rgba(0,0,0,0.8) 40%, transparent 80%)' 
            };
          } else if (idx === 1) {
            style = { 
              top: '4%', 
              left: isLeft ? '48%' : '-52%', 
              width: '100%', 
              height: '50%', 
              zIndex: 2, 
              maskImage: 'radial-gradient(ellipse at 50% 45%, black 15%, rgba(0,0,0,0.85) 45%, transparent 80%)', 
              WebkitMaskImage: 'radial-gradient(ellipse at 50% 45%, black 15%, rgba(0,0,0,0.85) 45%, transparent 80%)' 
            };
          } else if (idx === 0) {
            style = { 
              top: '35%', 
              left: isLeft ? '-2%' : '-102%', 
              width: '104%', 
              height: '62%', 
              zIndex: 3
            };
            extraClass = 'brush-effect';
          } else if (idx === 2) {
            style = { 
              top: '4%', 
              left: isLeft ? '98%' : '-2%', 
              width: '102%', 
              height: '92%', 
              zIndex: 4
            };
            extraClass = 'smoke-effect';
          }
        } else if (images.length === 3) {
          if (idx === 0) {
            style = { 
              top: '0%', 
              left: isLeft ? '0%' : '-100%', 
              width: '200%', 
              height: '100%', 
              zIndex: 1,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              maskImage: 'none',
              WebkitMaskImage: 'none'
            };
            extraClass = '';
          } else if (idx === 1) {
            style = { 
              top: '2%', 
              left: isLeft ? '2%' : '-98%', 
              width: '95%', 
              height: '65%', 
              zIndex: 2
            };
            extraClass = 'brush-effect';
          } else if (idx === 2) {
            style = { 
              top: '2%', 
              left: isLeft ? '132%' : '32%', 
              width: '66%', 
              height: '75%', 
              zIndex: 3
            };
            extraClass = 'smoke-effect';
          }
        } else if (images.length === 2) {
          if (idx === 0) style = { top: '10%', left: isLeft ? '10%' : '-90%', width: '150%', height: '80%' };
          if (idx === 1) style = { top: '20%', left: isLeft ? '50%' : '-50%', width: '150%', height: '60%', zIndex: 2 };
        } else {
          style = { 
            top: `${(idx * 15)}%`, 
            left: isLeft ? `${idx * 20}%` : `${(idx * 20) - 100}%`, 
            width: '130%', 
            height: '60%',
            zIndex: idx
          };
        }

        return (
          <div 
            key={idx} 
            className={`collage-item ${extraClass}`}
            onClick={() => onImageClick && onImageClick(img)}
            style={{ 
              ...style, 
              backgroundImage: `url('${encodeURI(img)}')`,
              cursor: 'zoom-in'
            }}
          ></div>
        );
      })}
    </div>
  );
}
