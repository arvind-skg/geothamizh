import React, { useRef, useEffect, useState } from 'react';
import { 
  X, Download, Copy, Check, Share2, Sparkles, MapPin, 
  Landmark, Palette, CheckCircle2, ExternalLink 
} from 'lucide-react';
import { PLACES } from '../data/places';

export const SocialShareCardModal = ({
  isOpen,
  onClose,
  place,
  cardData,
  places = PLACES,
  onSelectPlace,
  userLocation,
  translations
}) => {
  const canvasRef = useRef(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [directDownloadUrl, setDirectDownloadUrl] = useState('');
  const [selectedPlaceId, setSelectedPlaceId] = useState(place?.id || cardData?.id || 'thanjavur');
  const [cardTheme, setCardTheme] = useState('bronze'); // 'bronze' | 'sangam' | 'midnight'
  const [logoImage, setLogoImage] = useState(null);
  const [placeImage, setPlaceImage] = useState(null);

  // Load logo via blob URL to guarantee canvas is 100% untainted
  useEffect(() => {
    fetch('/logo.png')
      .then(res => res.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => setLogoImage(img);
        img.src = blobUrl;
      })
      .catch(err => {
        console.warn('Logo blob fetch fallback:', err);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => setLogoImage(img);
        img.src = '/logo.png';
      });
  }, []);

  // Sync when place prop changes
  useEffect(() => {
    if (place?.id) {
      setSelectedPlaceId(place.id);
    }
  }, [place]);

  const currentPlace = places.find(p => p.id === selectedPlaceId) || place || cardData || places[0];

  // Load place image via local image proxy blob URL so canvas remains 100% untainted
  useEffect(() => {
    if (!currentPlace?.image) {
      setPlaceImage(null);
      return;
    }

    const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(currentPlace.image)}`;
    fetch(proxyUrl)
      .then(res => {
        if (!res.ok) throw new Error('Proxy image error');
        return res.blob();
      })
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => setPlaceImage(img);
        img.src = blobUrl;
      })
      .catch(err => {
        console.warn('Place image proxy fallback:', err);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => setPlaceImage(img);
        img.src = currentPlace.image;
      });
  }, [currentPlace?.id, currentPlace?.image]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const userDistKm = (userLocation?.lat && userLocation?.lng && currentPlace?.lat && currentPlace?.lng)
    ? calculateDistance(userLocation.lat, userLocation.lng, currentPlace.lat, currentPlace.lng)
    : (userLocation?.distanceKm || null);

  const chennaiDistKm = (currentPlace?.lat && currentPlace?.lng)
    ? calculateDistance(13.0827, 80.2707, currentPlace.lat, currentPlace.lng)
    : null;

  const data = {
    name: currentPlace.name || cardData?.name || 'Brihadisvara Temple (தஞ்சைப் பெரிய கோயில்)',
    tamilName: currentPlace.tamilName || cardData?.tamilName || 'இராஜராஜேஸ்வரம்',
    district: currentPlace.district || cardData?.district || 'Thanjavur',
    lat: currentPlace.lat || 10.7828,
    lng: currentPlace.lng || 79.1318,
    timeSpan: currentPlace.timeSpan || cardData?.timeSpan || (currentPlace.historicalEvents?.[0]?.year || '1010 CE • Imperial Chola'),
    whyItMatters: currentPlace.whyItMatters || cardData?.whyItMatters || currentPlace.shortDescription || 'A monumental testament to classical Tamil architectural prowess, preserved through millennia.',
    classicalName: currentPlace.classicalName || cardData?.classicalName || 'Thanjai (தஞ்சை)',
    periods: currentPlace.periods ? currentPlace.periods.join(', ').replace(/_/g, ' ') : 'Classical Sangam & Medieval',
    dynasties: currentPlace.connectedPolities?.map(p => p.dynasty).slice(0, 3).join(' • ') || 'Imperial Cholas & Pandyas',
    heritageStatus: currentPlace.zoomTier === 'macro' ? 'Major Imperial Seat • State Monument' : 'Classical Cultural Heritage Site'
  };

  // Draw 1080x1080 High-Res Social Card on Canvas
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = 1080;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    // 1. Theme-Specific Gradients
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    if (cardTheme === 'sangam') {
      bgGrad.addColorStop(0, '#220805');
      bgGrad.addColorStop(0.35, '#351009');
      bgGrad.addColorStop(0.75, '#240805');
      bgGrad.addColorStop(1, '#140402');
    } else if (cardTheme === 'midnight') {
      bgGrad.addColorStop(0, '#090807');
      bgGrad.addColorStop(0.4, '#181410');
      bgGrad.addColorStop(0.8, '#0f0d0a');
      bgGrad.addColorStop(1, '#050403');
    } else {
      // Bronze
      bgGrad.addColorStop(0, '#170b06');
      bgGrad.addColorStop(0.4, '#281309');
      bgGrad.addColorStop(0.8, '#1c0c05');
      bgGrad.addColorStop(1, '#100502');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle Radial Glow in Center
    const radialGlow = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, 530);
    const glowColor = cardTheme === 'sangam' ? 'rgba(230, 80, 50, 0.12)' : 'rgba(212, 149, 43, 0.15)';
    radialGlow.addColorStop(0, glowColor);
    radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radialGlow;
    ctx.fillRect(0, 0, width, height);

    // 2. Ornate Golden Double Border Framing
    ctx.strokeStyle = '#d4952b';
    ctx.lineWidth = 5;
    ctx.strokeRect(32, 32, width - 64, height - 64);

    ctx.strokeStyle = 'rgba(212, 149, 43, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(44, 44, width - 88, height - 88);

    // Corner Accents (Ornate squares)
    const drawCorner = (x, y) => {
      ctx.fillStyle = '#d4952b';
      ctx.fillRect(x - 8, y - 8, 16, 16);
      ctx.fillStyle = '#ffd166';
      ctx.fillRect(x - 4, y - 4, 8, 8);
    };
    drawCorner(44, 44);
    drawCorner(width - 44, 44);
    drawCorner(44, height - 44);
    drawCorner(width - 44, height - 44);

    // 3. Top Header: GeoThamizh Logo & Brand Title
    const logoSize = 52;
    const logoY = 56;

    if (logoImage) {
      const logoX = width / 2 - logoSize / 2;
      ctx.save();
      ctx.beginPath();
      ctx.arc(width / 2, logoY + logoSize / 2, logoSize / 2 + 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(24, 14, 9, 0.9)';
      ctx.fill();
      ctx.strokeStyle = '#d4952b';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(width / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
      ctx.restore();
    }

    const titleY = logoImage ? 144 : 100;
    const subTitleY = logoImage ? 168 : 126;

    ctx.fillStyle = '#ffd166';
    ctx.font = 'bold 30px "Cinzel", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('GEOTHAMIZH', width / 2, titleY);

    ctx.fillStyle = '#d4a359';
    ctx.font = '600 13px "Outfit", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('ROOTED IN TIME. ALIVE IN STORIES.', width / 2, subTitleY);

    // 4. Hero Monument Photography Window
    const photoX = 68;
    const photoY = 188;
    const photoW = width - 136; // 944px
    const photoH = 390;
    const photoRadius = 14;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(photoX, photoY, photoW, photoH, photoRadius);
    ctx.clip();

    if (placeImage) {
      // Calculate object-fit: cover
      const imgRatio = placeImage.width / placeImage.height;
      const targetRatio = photoW / photoH;
      let sw, sh, sx, sy;
      if (imgRatio > targetRatio) {
        sh = placeImage.height;
        sw = sh * targetRatio;
        sx = (placeImage.width - sw) / 2;
        sy = 0;
      } else {
        sw = placeImage.width;
        sh = sw / targetRatio;
        sx = 0;
        sy = (placeImage.height - sh) / 2;
      }
      ctx.drawImage(placeImage, sx, sy, sw, sh, photoX, photoY, photoW, photoH);
    } else {
      // Rich textured gradient fallback
      const darkGrad = ctx.createLinearGradient(photoX, photoY, photoX, photoY + photoH);
      darkGrad.addColorStop(0, '#2e190e');
      darkGrad.addColorStop(1, '#150904');
      ctx.fillStyle = darkGrad;
      ctx.fillRect(photoX, photoY, photoW, photoH);
    }

    // Deep Dark gradient overlay on photo bottom
    const photoOverlay = ctx.createLinearGradient(photoX, photoY + photoH * 0.3, photoX, photoY + photoH);
    photoOverlay.addColorStop(0, 'rgba(10, 5, 2, 0)');
    photoOverlay.addColorStop(0.5, 'rgba(10, 5, 2, 0.65)');
    photoOverlay.addColorStop(1, 'rgba(10, 5, 2, 0.96)');
    ctx.fillStyle = photoOverlay;
    ctx.fillRect(photoX, photoY, photoW, photoH);

    // Floating Era Badge on Photo (Top Left)
    ctx.fillStyle = 'rgba(143, 29, 29, 0.88)';
    ctx.beginPath();
    ctx.roundRect(photoX + 22, photoY + 20, 270, 34, 17);
    ctx.fill();
    ctx.strokeStyle = '#d4952b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ffd166';
    ctx.font = 'bold 14px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(data.timeSpan.toUpperCase(), photoX + 157, photoY + 42);

    // Floating Heritage Status Tag on Photo (Top Right)
    ctx.fillStyle = 'rgba(18, 10, 6, 0.88)';
    ctx.beginPath();
    ctx.roundRect(photoX + photoW - 292, photoY + 20, 270, 34, 17);
    ctx.fill();
    ctx.strokeStyle = 'rgba(212, 149, 43, 0.55)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#e8dfd1';
    ctx.font = '600 13px "Outfit", sans-serif';
    ctx.fillText(`🏛️ ${data.district} District`, photoX + photoW - 157, photoY + 42);

    // Monument Place Names on the Photo (Bottom Left)
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px "Cinzel", Georgia, serif';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 12;
    ctx.fillText(data.name.split(' (')[0], photoX + 26, photoY + photoH - 62, photoW - 52);
    ctx.shadowBlur = 0;

    if (data.tamilName) {
      ctx.fillStyle = '#ffd166';
      ctx.font = 'bold 28px "Noto Sans Tamil", sans-serif';
      ctx.fillText(data.tamilName, photoX + 26, photoY + photoH - 22, photoW - 52);
    }
    ctx.restore();

    // Photo Outer Golden Frame
    ctx.strokeStyle = '#d4952b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(photoX, photoY, photoW, photoH, photoRadius);
    ctx.stroke();

    // 5. Real-World Live Data Info Matrix (Below Photo: Y = 596)
    const matrixY = 596;
    const colW = (photoW - 14) / 2;

    // Cell 1 (Left): Real Distance
    const hasUserGps = userDistKm !== null;
    ctx.fillStyle = hasUserGps ? 'rgba(38, 75, 40, 0.75)' : 'rgba(75, 55, 30, 0.75)';
    ctx.beginPath();
    ctx.roundRect(photoX, matrixY, colW, 58, 8);
    ctx.fill();
    ctx.strokeStyle = hasUserGps ? '#4b662f' : '#8c6b3b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = hasUserGps ? '#95d5b2' : '#ffd166';
    ctx.font = 'bold 12px "Outfit", sans-serif';
    ctx.fillText('🧭 REAL DISTANCE MEASUREMENT:', photoX + 16, matrixY + 22);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px "Outfit", sans-serif';
    ctx.fillText(hasUserGps ? `~${userDistKm} km from current GPS location` : `~${chennaiDistKm || 380} km from Chennai Hub`, photoX + 16, matrixY + 44);

    // Cell 2 (Right): Cartographic Coordinates & Classical Name
    ctx.fillStyle = 'rgba(20, 12, 7, 0.85)';
    ctx.beginPath();
    ctx.roundRect(photoX + colW + 14, matrixY, colW, 58, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(212, 149, 43, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ffd166';
    ctx.font = 'bold 12px "Outfit", sans-serif';
    ctx.fillText('📍 GPS COORDINATES & CLASSICAL ID:', photoX + colW + 30, matrixY + 22);
    ctx.fillStyle = '#fff';
    ctx.font = '600 15px "Outfit", sans-serif';
    ctx.fillText(`${data.lat.toFixed(4)}° N, ${data.lng.toFixed(4)}° E • ${data.classicalName}`, photoX + colW + 30, matrixY + 44, colW - 32);

    // Cell 3 (Full Width): Connected Polities & Dynasties
    const politiesY = 666;
    ctx.fillStyle = 'rgba(20, 12, 7, 0.8)';
    ctx.beginPath();
    ctx.roundRect(photoX, politiesY, photoW, 44, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(212, 149, 43, 0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#ffd166';
    ctx.font = 'bold 12px "Outfit", sans-serif';
    ctx.fillText('🏛️ CONNECTED POLITIES:', photoX + 16, politiesY + 27);
    ctx.fillStyle = '#faf6ed';
    ctx.font = '500 14.5px "Outfit", sans-serif';
    ctx.fillText(data.dynasties, photoX + 205, politiesY + 27, photoW - 220);

    // 6. Historical & Architectural Significance Section (Y = 722 to 945)
    const sigY = 722;
    const sigH = 226;
    ctx.fillStyle = 'rgba(24, 14, 9, 0.9)';
    ctx.beginPath();
    ctx.roundRect(photoX, sigY, photoW, sigH, 12);
    ctx.fill();
    ctx.strokeStyle = 'rgba(212, 149, 43, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ffd166';
    ctx.font = 'bold 16px "Cinzel", Georgia, serif';
    ctx.fillText('HISTORICAL & ARCHITECTURAL SIGNIFICANCE:', photoX + 22, sigY + 34);

    ctx.fillStyle = '#e8dfd1';
    ctx.font = '400 20px Georgia, serif';
    const descText = data.whyItMatters;
    
    // Smooth text wrapping
    const words = descText.split(' ');
    let line = '';
    let y = sigY + 70;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > (photoW - 44) && n > 0) {
        ctx.fillText(line, photoX + 22, y);
        line = words[n] + ' ';
        y += 32;
        if (y > sigY + sigH - 20) break;
      } else {
        line = testLine;
      }
    }
    if (y <= sigY + sigH - 20) {
      ctx.fillText(line, photoX + 22, y);
    }

    // 7. Footer Seal & Brand Link (Y = 965 to 1010)
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(212, 149, 43, 0.9)';
    ctx.font = 'bold 18px "Outfit", sans-serif';
    ctx.fillText('DISCOVER LIVE AT GEOTHAMIZH.ORG', width / 2, 980);

    ctx.fillStyle = '#888';
    ctx.font = '13.5px "Outfit", sans-serif';
    ctx.fillText('Interactive Cartographic Atlas of Tamil Civilization • Grounded in Archaeological & Epigraphic Data', width / 2, 1008);
  }, [isOpen, currentPlace, userLocation, logoImage, placeImage, cardTheme]);

  // Robust PNG Download Trigger
  const triggerDownload = (url, filename) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    }, 500);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    setIsDownloading(true);
    const canvas = canvasRef.current;
    const filename = `GeoThamizh-${(data.name || 'heritage').replace(/[^a-zA-Z0-9]/g, '_')}.png`;

    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          // Fallback to dataURL
          const dataUrl = canvas.toDataURL('image/png');
          setDirectDownloadUrl(dataUrl);
          triggerDownload(dataUrl, filename);
          setIsDownloading(false);
          setDownloadSuccess(true);
          setTimeout(() => setDownloadSuccess(false), 3000);
          return;
        }

        const blobUrl = URL.createObjectURL(blob);
        setDirectDownloadUrl(blobUrl);
        triggerDownload(blobUrl, filename);
        setIsDownloading(false);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      }, 'image/png', 1.0);
    } catch (err) {
      console.error('Blob download failed, trying dataURL fallback:', err);
      try {
        const dataUrl = canvas.toDataURL('image/png');
        setDirectDownloadUrl(dataUrl);
        triggerDownload(dataUrl, filename);
        setIsDownloading(false);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      } catch (e2) {
        setIsDownloading(false);
        alert('Could not download image. Please right-click or long-press on the image preview and select "Save image as...".');
      }
    }
  };

  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    } catch (e) {
      handleDownload();
    }
  };

  const handleNativeShare = async () => {
    if (!canvasRef.current) return;
    try {
      if (navigator.share) {
        canvasRef.current.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], `${data.name.split(' (')[0]}.png`, { type: 'image/png' });
          await navigator.share({
            title: `GeoThamizh — ${data.name}`,
            text: `Explore the historical legacy of ${data.name} on GeoThamizh!`,
            files: [file]
          });
        });
      } else {
        handleDownload();
      }
    } catch (err) {}
  };

  if (!isOpen) return null;

  return (
    <div className="social-share-modal-overlay" onClick={onClose}>
      <div className="social-share-card-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="social-share-header">
          <div className="social-share-header-left">
            <div className="social-share-badge-icon">
              <Share2 size={18} color="#d4952b" />
            </div>
            <div>
              <h2 className="social-share-title">1080x1080 Social Heritage Share Card</h2>
              <div className="social-share-sub">Export high-resolution story cards formatted for Instagram, WhatsApp & Twitter</div>
            </div>
          </div>
          <button 
            type="button"
            className="social-share-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Monument Thumbnail Strip */}
        <div className="share-sites-carousel">
          {places.slice(0, 12).map(p => (
            <button
              key={p.id}
              type="button"
              className={`share-site-card ${selectedPlaceId === p.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedPlaceId(p.id);
                if (onSelectPlace) onSelectPlace(p);
              }}
              title={`${p.name} (${p.district})`}
            >
              <img 
                src={p.image || "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=100&q=80"} 
                alt={p.name} 
                className="share-site-card-img" 
              />
              <span>{p.name.split(' (')[0]}</span>
            </button>
          ))}
        </div>

        {/* Site and Theme Selector Row */}
        <div className="social-share-selector-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
            <label htmlFor="share-place-select" style={{ fontSize: '12px', color: '#ffd166', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}>
              <Landmark size={13} color="#d4952b" />
              <span>Site:</span>
            </label>
            <select
              id="share-place-select"
              className="social-share-dropdown"
              value={selectedPlaceId}
              onChange={(e) => {
                setSelectedPlaceId(e.target.value);
                const p = places.find(item => item.id === e.target.value);
                if (onSelectPlace && p) onSelectPlace(p);
              }}
            >
              {places.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name.split(' (')[0]} ({p.district})
                </option>
              ))}
            </select>
          </div>

          {/* Theme Switcher Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              className={`share-theme-pill ${cardTheme === 'bronze' ? 'active' : ''}`}
              onClick={() => setCardTheme('bronze')}
              title="Imperial Bronze Theme"
            >
              Bronze
            </button>
            <button
              type="button"
              className={`share-theme-pill ${cardTheme === 'sangam' ? 'active' : ''}`}
              onClick={() => setCardTheme('sangam')}
              title="Sangam Terracotta & Red Theme"
            >
              Sangam
            </button>
            <button
              type="button"
              className={`share-theme-pill ${cardTheme === 'midnight' ? 'active' : ''}`}
              onClick={() => setCardTheme('midnight')}
              title="Midnight Obsidian Theme"
            >
              Obsidian
            </button>
          </div>
        </div>

        {/* Canvas Card Live Preview */}
        <div className="social-share-canvas-wrap">
          <canvas ref={canvasRef} className="social-share-canvas" />
        </div>

        {/* Download Success Confirmation Link */}
        {downloadSuccess && (
          <div style={{
            background: 'rgba(38, 75, 40, 0.85)',
            borderTop: '1px solid #4b662f',
            padding: '6px 14px',
            fontSize: '11.5px',
            color: '#95d5b2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={14} color="#80ed99" />
            <span>High-resolution PNG saved to your downloads folder!</span>
            {directDownloadUrl && (
              <a 
                href={directDownloadUrl} 
                download={`GeoThamizh-${data.name.split(' (')[0]}.png`}
                style={{ color: '#ffd166', textDecoration: 'underline', fontWeight: 600 }}
              >
                Click here if download didn't start
              </a>
            )}
          </div>
        )}

        {/* Action Controls Bar */}
        <div className="social-share-actions-bar">
          <button 
            type="button"
            className="share-action-btn share-download-btn"
            onClick={handleDownload}
            disabled={isDownloading}
            title="Download PNG to your device"
          >
            {isDownloading ? (
              <>
                <Sparkles size={15} className="spin-slow" />
                <span>Exporting PNG...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <Check size={15} color="#80ed99" />
                <span>Saved to Downloads!</span>
              </>
            ) : (
              <>
                <Download size={15} />
                <span>Download PNG (1080x1080)</span>
              </>
            )}
          </button>

          <button 
            type="button"
            className={`share-action-btn share-copy-btn ${isCopied ? 'is-copied' : ''}`}
            onClick={handleCopyImage}
            title="Copy image directly to clipboard"
          >
            {isCopied ? <Check size={15} color="#80ed99" /> : <Copy size={15} />}
            <span>{isCopied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
          </button>

          {typeof navigator !== 'undefined' && navigator.share && (
            <button 
              type="button"
              className="share-action-btn share-native-btn"
              onClick={handleNativeShare}
              title="Share via native device sharing"
            >
              <Share2 size={15} />
              <span>Share</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

