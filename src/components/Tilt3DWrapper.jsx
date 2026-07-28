import React, { useState, useRef } from 'react';
import './Tilt3DWrapper.css';

export default function Tilt3DWrapper({ 
  children, 
  enabled = true, 
  maxTiltAngle = 12, 
  glareEnabled = true, 
  scaleOnHover = 1.03,
  className = '',
  style = {}
}) {
  const [tiltStyle, setTiltStyle] = useState({});
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  if (!enabled) {
    return <div className={className} style={style}>{children}</div>;
  }

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * maxTiltAngle;
    const rotateY = ((x - centerX) / centerX) * maxTiltAngle;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scaleOnHover}, ${scaleOnHover}, 1.03)`,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)'
    });

    if (glareEnabled) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      const glareOpacity = Math.min(0.35, (Math.abs(rotateX) + Math.abs(rotateY)) / (maxTiltAngle * 2));

      setGlareStyle({
        opacity: glareOpacity,
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 70%)`
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)'
    });
    setGlareStyle({ opacity: 0 });
  };

  return (
    <div
      ref={containerRef}
      className={`tilt-3d-container ${isHovered ? 'hovered' : ''} ${className}`}
      style={{
        ...style,
        ...tiltStyle
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {/* Glossy Light Glare Overlay */}
      {glareEnabled && (
        <div 
          className="tilt-glare-overlay" 
          style={glareStyle} 
        />
      )}
    </div>
  );
}
