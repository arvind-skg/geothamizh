import React, { useRef, useEffect } from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';
import { animate } from 'animejs';
import './AIChatbot.css';

/**
 * Floating AI Guide Trigger Button with Anime.js subtle float animation
 */
export const AIChatbotFloatingButton = ({ onClick, label = 'AI Heritage Guide' }) => {
  const btnRef = useRef(null);

  useEffect(() => {
    if (!btnRef.current) return;
    try {
      const anim = animate(btnRef.current, {
        translateY: [-2, 2],
        duration: 1800,
        alternate: true,
        loop: true,
        ease: 'inOutSine'
      });
      return () => {
        if (anim && typeof anim.pause === 'function') anim.pause();
      };
    } catch (e) {}
  }, []);

  return (
    <button 
      ref={btnRef}
      className="geothamizh-floating-chatbtn"
      onClick={onClick}
      title="Open AI Heritage Guide"
      aria-label="Open AI Heritage Guide"
    >
      <Sparkles size={18} color="#ffd166" />
      <span>{label}</span>
    </button>
  );
};

export default AIChatbotFloatingButton;
