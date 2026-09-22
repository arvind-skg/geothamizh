import React, { useState, useEffect } from 'react';

export const SplashScreen = ({ onFinish, duration = 1000 }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start fade-out at the 1 second mark
    const timer = setTimeout(() => {
      setIsFadingOut(true);
    }, duration);

    // Completely unmount after fade-out transition completes (350ms)
    const cleanupTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, duration + 350);

    return () => {
      clearTimeout(timer);
      clearTimeout(cleanupTimer);
    };
  }, [duration, onFinish]);

  return (
    <div className={`splash-overlay ${isFadingOut ? 'fade-out' : ''}`}>
      <div className="splash-background-glow" />
      
      <div className="splash-content">
        {/* Animated Brand Emblem with Radiant Halo */}
        <div className="splash-logo-container">
          <div className="splash-logo-halo" />
          <img 
            src="/logo.png" 
            alt="GeoThamizh Official Logo" 
            className="splash-logo-image" 
          />
        </div>

        {/* Title & Classical Tamil Subtitle */}
        <div className="splash-brand-text">
          <h1 className="splash-title">
            Geo<span className="splash-title-highlight">Thamizh</span>
          </h1>
          <p className="splash-tagline-tamil">
            காலத்தில் வேரூன்றி... கதைகளில் வாழும்...
          </p>
          <p className="splash-tagline-en">
            Rooted in Time • Alive in Stories
          </p>
        </div>

        {/* 1-Second Smooth Progress Loading Bar */}
        <div className="splash-loader-wrap">
          <div 
            className="splash-loader-bar" 
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>

        <div className="splash-status-text">
          <span>Initializing Cartographic Atlas...</span>
        </div>
      </div>
    </div>
  );
};
