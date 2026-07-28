import React, { useRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight, Maximize, Minimize, Play } from 'lucide-react';
import albumData from '../albumData.json';
import initialLayoutCoords from '../layoutCoordinates.json';

import FullSpreadLayout from './layouts/FullSpreadLayout';
import SoftCollageLayout from './layouts/SoftCollageLayout';
import SinglePageLayout from './layouts/SinglePageLayout';
import AsymmetricGridLayout from './layouts/AsymmetricGridLayout';
import PictureInPictureLayout from './layouts/PictureInPictureLayout';
import SixPhotoGridLayout from './layouts/SixPhotoGridLayout';

import ThumbnailsDrawer from './ThumbnailsDrawer';
import MusicPlayer from './MusicPlayer';
import LightboxModal from './LightboxModal';
import ShareModal from './ShareModal';
import Tilt3DWrapper from './Tilt3DWrapper';
import { getCloudinaryUrl, getCloudinaryVideoUrl, getCloudinaryVideoPosterUrl, isVideoFile, resolveLocalFallback } from '../utils/cloudinary';

const InteractiveVideoElement = ({ rawImg, videoSettings, maskStyle, filterCss, innerCrop, effectClass, onImageClick }) => {
  const [isPlayingHover, setIsPlayingHover] = useState(false);
  const videoRef = useRef(null);

  const videoPosterUrl = getCloudinaryVideoPosterUrl(rawImg, { startOffset: videoSettings?.startOffset || 0, width: 1200 });
  const videoStreamUrl = getCloudinaryVideoUrl(rawImg);
  const localFallback = resolveLocalFallback(rawImg);

  const handleMouseEnter = () => {
    setIsPlayingHover(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsPlayingHover(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        cursor: 'pointer',
        backgroundColor: '#0f172a',
        ...maskStyle
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onImageClick(rawImg, true, videoSettings)}
    >
      <img
        className={effectClass}
        src={videoPosterUrl}
        alt="Video poster"
        onError={(e) => {
          if (localFallback && e.currentTarget.src !== localFallback) {
            e.currentTarget.src = localFallback;
          } else {
            e.currentTarget.style.opacity = '0.2';
          }
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          opacity: isPlayingHover ? 0 : 1,
          filter: filterCss,
          transform: `scale(${innerCrop.zoom}) translate(${innerCrop.offsetX}px, ${innerCrop.offsetY}px)`,
          transition: 'opacity 0.25s ease-out'
        }}
      />

      <video
        ref={videoRef}
        src={videoStreamUrl}
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isPlayingHover ? 1 : 0,
          filter: filterCss,
          transition: 'opacity 0.25s ease-out',
          pointerEvents: 'none'
        }}
      />

      {!isPlayingHover && (
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50px',
            height: '50px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(6px)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            zIndex: 10
          }}
        >
          <Play size={24} fill="#ffffff" style={{ marginLeft: '3px' }} />
        </div>
      )}
    </div>
  );
};

const DynamicPageContent = ({ pageName, images, isLeft, isSpread, onImageClick, layoutCoords }) => {
  const pageCoord = layoutCoords.find(c => c.folder === pageName);

  if (pageCoord && pageCoord.elements && pageCoord.elements.length > 0) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        {pageCoord.elements.map((el, idx) => {
          const rawImg = el.file || images?.[idx];
          if (!rawImg) return null;

          const rawLeft = parseFloat(el.left) || 0;
          const rawWidth = parseFloat(el.width) || 40;
          const rawTop = parseFloat(el.top) || 0;
          const rawHeight = parseFloat(el.height) || 40;

          let displayLeft = rawLeft;
          let displayWidth = rawWidth;

          if (isSpread) {
            if (isLeft) {
              if (rawLeft >= 50) return null;
              displayLeft = rawLeft * 2;
              displayWidth = rawWidth * 2;
            } else {
              if (rawLeft + rawWidth <= 50) return null;
              displayLeft = (rawLeft - 50) * 2;
              displayWidth = rawWidth * 2;
            }
          }

          const isVid = isVideoFile(rawImg) || el.type === 'video';
          const videoSettings = el.videoSettings || {};
          const effect3D = videoSettings.effect3D || { enabled: isVid, tiltMaxAngle: 12, glareEnabled: true, scaleOnHover: 1.03 };

          const imgSrc = isVid 
            ? getCloudinaryVideoPosterUrl(rawImg, { startOffset: videoSettings.startOffset || 0, width: 1200 })
            : getCloudinaryUrl(rawImg, { width: 1200 });

          const localFallback = resolveLocalFallback(rawImg, pageName);

          const maskStyle = el.mask?.styleObj || {};
          const filterCss = el.filters?.cssString || 'none';
          const innerCrop = el.innerCrop || { zoom: 1.0, offsetX: 0, offsetY: 0 };
          const effectClass = el.effect && el.effect !== 'none' ? el.effect : '';

          const content = isVid ? (
            <InteractiveVideoElement
              rawImg={rawImg}
              videoSettings={videoSettings}
              maskStyle={maskStyle}
              filterCss={filterCss}
              innerCrop={innerCrop}
              effectClass={effectClass}
              onImageClick={onImageClick}
            />
          ) : (
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                cursor: 'zoom-in',
                ...maskStyle
              }}
              onClick={() => onImageClick(rawImg, false, videoSettings)}
            >
              <img
                className={effectClass}
                src={imgSrc}
                alt={`album-media-${idx}`}
                onError={(e) => {
                  if (localFallback && e.currentTarget.src !== localFallback) {
                    e.currentTarget.src = localFallback;
                  } else {
                    e.currentTarget.style.opacity = '0.2';
                  }
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  filter: filterCss,
                  transform: `scale(${innerCrop.zoom}) translate(${innerCrop.offsetX}px, ${innerCrop.offsetY}px)`
                }}
              />
            </div>
          );

          const containerStyle = {
            position: 'absolute',
            left: `${displayLeft}%`,
            top: `${rawTop}%`,
            width: `${displayWidth}%`,
            height: `${rawHeight}%`,
            zIndex: el.zIndex || idx + 1
          };

          if (isVid && effect3D.enabled) {
            return (
              <Tilt3DWrapper
                key={idx}
                enabled={true}
                maxTiltAngle={effect3D.tiltMaxAngle || 12}
                glareEnabled={effect3D.glareEnabled !== false}
                scaleOnHover={effect3D.scaleOnHover || 1.03}
                style={containerStyle}
              >
                {content}
              </Tilt3DWrapper>
            );
          }

          return (
            <div key={idx} style={containerStyle}>
              {content}
            </div>
          );
        })}
      </div>
    );
  }

  // Fallback generico per layout senza coordinate definite
  if (images && images.length === 1) {
    return <FullSpreadLayout images={images} isLeft={isLeft} onImageClick={onImageClick} />;
  } else if (images && images.length > 1) {
    return <AsymmetricGridLayout images={images} isLeft={isLeft} onImageClick={onImageClick} />;
  }
  return null;
};

const Page = React.forwardRef((props, ref) => {
  const isLeft = props.position === 'left';
  const { images, isSpread, pageName, onImageClick, layoutCoords } = props;

  return (
    <div className={`page ${isLeft ? '--left' : '--right'}`} ref={ref}>
      <div className="page-content" style={{ width: '100%', height: '100%', padding: 0 }}>
        <DynamicPageContent 
          pageName={pageName} 
          images={images} 
          isLeft={isLeft} 
          isSpread={isSpread}
          onImageClick={onImageClick} 
          layoutCoords={layoutCoords} 
        />
      </div>
    </div>
  );
});

export default function FlipbookViewer() {
  const bookRef = useRef();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeLightboxMedia, setActiveLightboxMedia] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Stato reattivo da localStorage o fallback sui JSON
  const [pagesData, setPagesData] = useState(() => {
    const saved = localStorage.getItem('admin_album_pages');
    return saved ? JSON.parse(saved) : albumData.pages;
  });

  const [layoutCoords, setLayoutCoords] = useState(() => {
    const saved = localStorage.getItem('admin_layout_coords');
    return saved ? JSON.parse(saved) : initialLayoutCoords;
  });

  // Listener per aggiornamenti dall'Admin Editor
  useEffect(() => {
    const refreshData = () => {
      const savedPages = localStorage.getItem('admin_album_pages');
      if (savedPages) setPagesData(JSON.parse(savedPages));
      const savedCoords = localStorage.getItem('admin_layout_coords');
      if (savedCoords) setLayoutCoords(JSON.parse(savedCoords));
    };

    refreshData();
    window.addEventListener('admin_layout_updated', refreshData);
    window.addEventListener('storage', refreshData);

    return () => {
      window.removeEventListener('admin_layout_updated', refreshData);
      window.removeEventListener('storage', refreshData);
    };
  }, []);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => console.log(err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false));
      }
    }
  };

  const goNext = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const goPrev = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  const handleSelectPage = (pageIdx) => {
    if (bookRef.current) {
      const targetPage = pageIdx === 0 ? 0 : (pageIdx * 2) - 1;
      bookRef.current.pageFlip().flip(targetPage);
      setCurrentPage(pageIdx);
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      goNext();
    } else if (diff < -50) {
      goPrev();
    }
  };

  const handleMediaClick = (imgOrVideo, isVideo = false, videoSettings = null) => {
    setActiveLightboxMedia({
      src: imgOrVideo,
      isVideo: isVideo || isVideoFile(imgOrVideo),
      videoSettings: videoSettings || { autoplay: true, loop: true, muted: false, controls: true }
    });
  };

  const isMobile = windowWidth < 768;
  const coverImgUrl = getCloudinaryUrl(albumData.login || '/login/IMG_2281.JPG', { width: 1200 });
  const coverLocalFallback = resolveLocalFallback(albumData.login || '/login/IMG_2281.JPG');

  const renderPages = () => {
    const elements = [];
    pagesData.forEach((pageData, index) => {
      if (!pageData || !pageData.images || pageData.images.length === 0) return;

      if (pageData.isSpread) {
        elements.push(
          <Page 
            key={`p-${index}-left`} 
            position="left" 
            images={pageData.images} 
            pageName={pageData.name} 
            isSpread={true} 
            onImageClick={handleMediaClick}
            layoutCoords={layoutCoords}
          />
        );
        elements.push(
          <Page 
            key={`p-${index}-right`} 
            position="right" 
            images={pageData.images} 
            pageName={pageData.name} 
            isSpread={true} 
            onImageClick={handleMediaClick}
            layoutCoords={layoutCoords}
          />
        );
      } else {
        elements.push(
          <Page 
            key={`p-${index}-single`} 
            position="right" 
            images={pageData.images} 
            pageName={pageData.name} 
            isSpread={false} 
            onImageClick={handleMediaClick}
            layoutCoords={layoutCoords}
          />
        );
      }
    });
    return elements;
  };

  return (
    <div className="viewer-container">
      {/* Bottoni di Condivisione, Fullscreen e Riproduttore Musicale */}
      <ShareModal />
      <MusicPlayer />

      <button className="fullscreen-btn" onClick={toggleFullscreen} title="Schermo Intero">
        {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        <span className="fullscreen-btn-text">{isFullscreen ? 'Esci' : 'Schermo Intero'}</span>
      </button>

      <header className="viewer-header">
        <h2 className="viewer-title">Tiziana & Fabio</h2>
      </header>

      {/* Contenitore Libro Ultra Full Web Page (100% Viewport Fill) */}
      <div 
        className="book-wrapper"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button className="nav-button prev" onClick={goPrev}>
          <ChevronLeft size={24} />
        </button>

        <HTMLFlipBook
          width={isMobile ? 360 : 850}
          height={isMobile ? 480 : 920}
          size="stretch"
          minWidth={300}
          maxWidth={2400}
          minHeight={380}
          maxHeight={1400}
          maxShadowOpacity={0.4}
          showCover={true}
          usePortrait={true}
          mobileScrollSupport={true}
          className="flip-book"
          ref={bookRef}
          onFlip={(e) => {
            const pageNum = e.data;
            const calculatedSpread = pageNum === 0 ? 0 : Math.ceil(pageNum / 2);
            setCurrentPage(calculatedSpread);
          }}
        >
          {/* Copertina Rigida */}
          <div className="page cover" data-density="hard" style={{ width: '100%', height: '100%', position: 'relative', backgroundColor: '#ffffff', boxSizing: 'border-box', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '28px', backgroundColor: '#181818', backgroundImage: 'radial-gradient(circle, #282828 1px, transparent 1px)', backgroundSize: '4px 4px', boxShadow: 'inset -3px 0 6px rgba(0,0,0,0.6)', zIndex: 10 }}></div>
            <div style={{ position: 'absolute', top: 0, left: '28px', right: 0, bottom: 0, padding: '20px 15px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '2.2rem', color: '#1a1a1a', fontWeight: '400', margin: 0 }}>
                  Tiziana e Fabio
                </h1>
              </div>

              <div 
                onClick={() => handleMediaClick(albumData.login || '/login/IMG_2281.JPG')}
                style={{ position: 'relative', width: '85%', height: '65%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', cursor: 'zoom-in' }}
              >
                <div style={{ position: 'absolute', top: '-8px', left: '-10px', right: '10px', bottom: '8px', border: '1.5px solid #c5a059', pointerEvents: 'none', transform: 'rotate(-1deg)', opacity: 0.85 }}></div>
                <div style={{ position: 'absolute', top: '8px', left: '10px', right: '-10px', bottom: '-8px', border: '1.5px solid #c5a059', pointerEvents: 'none', transform: 'rotate(1deg)', opacity: 0.85 }}></div>

                <svg style={{ position: 'absolute', top: '-18px', left: '-18px', width: '40px', height: '40px', zIndex: 6, pointerEvents: 'none' }} viewBox="0 0 100 100">
                  <path d="M15 50 Q 25 15 65 25 Q 45 65 15 50 Z" fill="#6b8e23" />
                  <path d="M35 25 Q 55 5 85 25 Q 65 45 35 25 Z" fill="#4b6b13" />
                </svg>
                <svg style={{ position: 'absolute', bottom: '-18px', right: '-18px', width: '40px', height: '40px', zIndex: 6, pointerEvents: 'none', transform: 'rotate(180deg)' }} viewBox="0 0 100 100">
                  <path d="M15 50 Q 25 15 65 25 Q 45 65 15 50 Z" fill="#6b8e23" />
                  <path d="M35 25 Q 55 5 85 25 Q 65 45 35 25 Z" fill="#4b6b13" />
                </svg>

                <img 
                  src={coverImgUrl} 
                  alt="Copertina"
                  onError={(e) => {
                    if (coverLocalFallback && e.currentTarget.src !== coverLocalFallback) {
                      e.currentTarget.src = coverLocalFallback;
                    }
                  }}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    objectPosition: 'center 20%',
                    position: 'relative',
                    zIndex: 2,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.12)'
                  }} 
                />
              </div>

              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '1.2rem', color: '#333', margin: 0, letterSpacing: '1px' }}>
                  02 marzo 2024
                </p>
              </div>
            </div>
          </div>

          {/* Photo Pages Dinamiche */}
          {renderPages()}
          
          {/* Back Cover */}
          <div className="page cover --left" data-density="hard">
            <p>Fine</p>
          </div>
          <div className="page cover --right" data-density="hard">
          </div>
        </HTMLFlipBook>

        <button className="nav-button next" onClick={goNext}>
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Barra di Navigazione con Miniature dell'Indice */}
      <ThumbnailsDrawer 
        pagesData={pagesData} 
        onSelectPage={handleSelectPage} 
        currentPage={currentPage}
      />

      {/* Lightbox Modal per Zoom Foto & Player Video ad Alta Risoluzione */}
      {activeLightboxMedia && (
        <LightboxModal 
          media={activeLightboxMedia} 
          onClose={() => setActiveLightboxMedia(null)} 
        />
      )}
    </div>
  );
}
