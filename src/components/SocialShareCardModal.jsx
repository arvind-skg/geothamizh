import React, { useRef, useEffect, useState } from 'react';
import { X, Download, Copy, Check, Share2, Sparkles, MapPin } from 'lucide-react';

export const SocialShareCardModal = ({
  isOpen,
  onClose,
  cardData,
  userLocation
}) => {
  const canvasRef = useRef(null);
  const [isCopied, setIsCopied] = useState(false);

  const data = cardData || {
    name: 'Brihadisvara Temple (தஞ்சைப் பெரிய கோயில்)',
    tamilName: 'இராஜராஜேஸ்வரம்',
    district: 'Thanjavur',
    timeSpan: 'c. 1010 CE',
    whyItMatters: 'Apex of Chola monolithic stone architecture with an 80-tonne granite dome capstone.',
    classicalVerse: '“கல்லிலே வெட்டுக நம் பெருமை!” — தஞ்சைக் கல்வெட்டு'
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

    // 1. Deep Heritage Chocolate Bronze & Madder Red Gradient Background
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#1c0d08');
    bgGrad.addColorStop(0.5, '#2b140b');
    bgGrad.addColorStop(1, '#140a05');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Ornate Golden Double Border Framing
    ctx.strokeStyle = '#d4952b';
    ctx.lineWidth = 8;
    ctx.strokeRect(36, 36, width - 72, height - 72);

    ctx.strokeStyle = 'rgba(212, 149, 43, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 48, width - 96, height - 96);

    // Corner Accents
    const drawCorner = (x, y) => {
      ctx.fillStyle = '#d4952b';
      ctx.fillRect(x - 6, y - 6, 12, 12);
    };
    drawCorner(48, 48);
    drawCorner(width - 48, 48);
    drawCorner(48, height - 48);
    drawCorner(width - 48, height - 48);

    // 3. Header: Brand Logo & Title
    ctx.fillStyle = '#ffd166';
    ctx.font = 'bold 36px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.fillText('GEOTHAMIZH', width / 2, 120);

    ctx.fillStyle = '#d4952b';
    ctx.font = '500 20px "Outfit", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('ROOTED IN TIME. ALIVE IN STORIES.', width / 2, 155);

    // Divider Line
    ctx.strokeStyle = 'rgba(212, 149, 43, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 180, 185);
    ctx.lineTo(width / 2 + 180, 185);
    ctx.stroke();

    // 4. Central Monument Badge / Era Pill
    ctx.fillStyle = 'rgba(143, 29, 29, 0.45)';
    ctx.beginPath();
    ctx.roundRect(width / 2 - 160, 230, 320, 52, 26);
    ctx.fill();
    ctx.strokeStyle = '#8f1d1d';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffd166';
    ctx.font = 'bold 22px "Outfit", sans-serif';
    ctx.fillText(data.timeSpan || 'HISTORICAL HERITAGE', width / 2, 264);

    // 5. Place Names (English & Classical Tamil)
    ctx.fillStyle = '#faf6ed';
    ctx.font = 'bold 54px "Cinzel", serif';
    // Word wrap name if long
    ctx.fillText(data.name, width / 2, 360, width - 160);

    if (data.tamilName) {
      ctx.fillStyle = '#f2c76e';
      ctx.font = 'bold 38px "Noto Sans Tamil", sans-serif';
      ctx.fillText(data.tamilName, width / 2, 425, width - 160);
    }

    // District Location Badge
    if (data.district) {
      ctx.fillStyle = '#aaa';
      ctx.font = '500 24px "Outfit", sans-serif';
      ctx.fillText(`📍 ${data.district}, Tamil Nadu`, width / 2, 480);
    }

    // 6. User Live Distance Pill (if available)
    if (userLocation?.distanceKm !== undefined) {
      ctx.fillStyle = 'rgba(75, 102, 47, 0.35)';
      ctx.beginPath();
      ctx.roundRect(width / 2 - 200, 520, 400, 46, 23);
      ctx.fill();
      ctx.strokeStyle = '#4b662f';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#95d5b2';
      ctx.font = 'bold 20px "Outfit", sans-serif';
      ctx.fillText(`🧭 ${userLocation.distanceKm} km from your live location`, width / 2, 550);
    }

    // 7. Significance Box
    ctx.fillStyle = 'rgba(28, 16, 11, 0.7)';
    ctx.beginPath();
    ctx.roundRect(90, 600, width - 180, 240, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(212, 149, 43, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ffd166';
    ctx.font = 'bold 22px "Outfit", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('HISTORICAL ARCHITECTURAL SIGNIFICANCE:', 125, 650);

    ctx.fillStyle = '#ded6c9';
    ctx.font = '400 24px "Cormorant Garamond", Georgia, serif';
    const descText = data.whyItMatters || 'A monumental testament to classical Tamil architectural prowess, preserved through millennia.';
    
    // Simple text wrapping
    const words = descText.split(' ');
    let line = '';
    let y = 695;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > (width - 250) && n > 0) {
        ctx.fillText(line, 125, y);
        line = words[n] + ' ';
        y += 34;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 125, y);

    // 8. Footer Watermark & App Link
    ctx.fillStyle = 'rgba(212, 149, 43, 0.7)';
    ctx.font = 'bold 20px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DISCOVER LIVE AT GEOTHAMIZH.ORG', width / 2, 980);

    ctx.fillStyle = '#777';
    ctx.font = '16px "Outfit", sans-serif';
    ctx.fillText('Interactive Cartographic Atlas of Tamil Civilization', width / 2, 1010);
  }, [isOpen, data, userLocation]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `GeoThamizh-${(data.name || 'heritage').replace(/\s+/g, '_')}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
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
      // Fallback
      handleDownload();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="social-share-modal-overlay">
      <div className="social-share-card-container">
        {/* Header */}
        <div className="social-share-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Share2 size={18} color="#d4952b" />
            <span className="social-share-title">Shareable Heritage Story Card</span>
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

        {/* Canvas Card Preview */}
        <div className="social-share-canvas-wrap">
          <canvas ref={canvasRef} className="social-share-canvas" />
        </div>

        {/* Action Buttons */}
        <div className="social-share-actions-bar">
          <button 
            type="button"
            className="social-btn-download"
            onClick={handleDownload}
            title="Download PNG image card"
          >
            <Download size={16} />
            <span>Download PNG Card</span>
          </button>

          <button 
            type="button"
            className="social-btn-copy"
            onClick={handleCopyImage}
            title="Copy image to clipboard"
          >
            {isCopied ? <Check size={16} color="#95d5b2" /> : <Copy size={16} />}
            <span>{isCopied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
