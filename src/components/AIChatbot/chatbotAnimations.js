import { animate, stagger } from 'animejs';

/**
 * Geoதமிழ் Production Animation Design System
 * Powered by Anime.js v4.5
 * 
 * Rules:
 * - Premium, quiet, precise transitions (no cartoon bounce or elastic wobble).
 * - Standardized duration tokens.
 * - Full prefers-reduced-motion compliance.
 * - Explicit instance tracking for leak-free cleanup.
 */

export const ANIM_TOKENS = {
  micro: 120,
  fast: 180,
  normal: 280,
  slow: 450
};

/**
 * Check if user prefers reduced motion
 */
export function isReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Active animation tracker for cleanup
const activeAnimations = new Set();

function registerAnimation(anim) {
  if (!anim) return null;
  activeAnimations.add(anim);
  return anim;
}

export function cancelAllAnimations() {
  activeAnimations.forEach(anim => {
    try {
      if (typeof anim.pause === 'function') anim.pause();
    } catch (e) {}
  });
  activeAnimations.clear();
}

/**
 * 1. Coordinated Drawer Entrance
 * Total time: ~280–320ms. Fast, crisp, museum-grade.
 */
export function animateDrawerOpen(panelEl, backdropEl, onComplete) {
  if (isReducedMotion()) {
    if (backdropEl) backdropEl.style.opacity = '1';
    if (panelEl) {
      panelEl.style.opacity = '1';
      panelEl.style.transform = 'none';
    }
    if (onComplete) onComplete();
    return;
  }

  // Backdrop fade
  if (backdropEl) {
    try {
      registerAnimation(animate(backdropEl, {
        opacity: [0, 1],
        duration: ANIM_TOKENS.normal,
        ease: 'outQuad'
      }));
    } catch (e) {}
  }

  // Panel slide
  if (panelEl) {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;
    try {
      const anim = animate(panelEl, {
        translateX: isMobile ? '0%' : ['24px', '0px'],
        translateY: isMobile ? ['100%', '0%'] : '0%',
        opacity: [0.3, 1],
        duration: ANIM_TOKENS.normal + 40,
        ease: 'outCubic',
        onComplete: () => {
          activeAnimations.delete(anim);
          if (onComplete) onComplete();
        }
      });
      registerAnimation(anim);
    } catch (e) {
      if (onComplete) onComplete();
    }
  } else if (onComplete) {
    onComplete();
  }
}

/**
 * 2. Coordinated Drawer Exit
 * Reverses open cleanly in ~220ms.
 */
export function animateDrawerClose(panelEl, backdropEl, onComplete) {
  if (isReducedMotion()) {
    if (onComplete) onComplete();
    return;
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;

  if (backdropEl) {
    try {
      registerAnimation(animate(backdropEl, {
        opacity: [1, 0],
        duration: ANIM_TOKENS.fast,
        ease: 'inQuad'
      }));
    } catch (e) {}
  }

  if (panelEl) {
    try {
      const anim = animate(panelEl, {
        translateX: isMobile ? '0%' : ['0px', '24px'],
        translateY: isMobile ? ['0%', '100%'] : '0%',
        opacity: [1, 0],
        duration: ANIM_TOKENS.fast + 40,
        ease: 'inQuad',
        onComplete: () => {
          activeAnimations.delete(anim);
          cancelAllAnimations();
          if (onComplete) onComplete();
        }
      });
      registerAnimation(anim);
      return;
    } catch (e) {}
  }

  if (onComplete) onComplete();
}

/**
 * 3. Message Bubble Entrance
 * Discrete, subtle entrance for newly arrived messages.
 */
export function animateMessageEnter(messageEl) {
  if (!messageEl || isReducedMotion()) return;

  try {
    const anim = animate(messageEl, {
      translateY: ['8px', '0px'],
      scale: [0.99, 1],
      opacity: [0, 1],
      duration: ANIM_TOKENS.normal,
      ease: 'outCubic',
      onComplete: () => activeAnimations.delete(anim)
    });
    registerAnimation(anim);
  } catch (e) {}
}

/**
 * 4. Staggered Entity Cards Entrance
 * 50ms stagger across child cards.
 */
export function animateEntityCardsStagger(containerEl) {
  if (!containerEl || isReducedMotion()) return;

  const cards = containerEl.querySelectorAll('.heritage-entity-card, .heritage-waypoint-card');
  if (!cards || cards.length === 0) return;

  try {
    const anim = animate(cards, {
      translateY: ['8px', '0px'],
      opacity: [0, 1],
      delay: stagger(50, { start: 60 }),
      duration: ANIM_TOKENS.normal,
      ease: 'outCubic',
      onComplete: () => activeAnimations.delete(anim)
    });
    registerAnimation(anim);
  } catch (e) {}
}

/**
 * 5. Smooth Language Switch Crossfade
 * Changes content smoothly without layout jumps.
 */
export function animateLanguageSwitch(containerEl, onHalfway) {
  if (!containerEl || isReducedMotion()) {
    if (onHalfway) onHalfway();
    return;
  }

  try {
    // Fade out slightly
    const animOut = animate(containerEl, {
      opacity: [1, 0.4],
      translateY: ['0px', '3px'],
      duration: ANIM_TOKENS.fast,
      ease: 'inQuad',
      onComplete: () => {
        activeAnimations.delete(animOut);
        if (onHalfway) onHalfway();

        // Fade in updated text
        const animIn = animate(containerEl, {
          opacity: [0.4, 1],
          translateY: ['3px', '0px'],
          duration: ANIM_TOKENS.fast,
          ease: 'outQuad',
          onComplete: () => activeAnimations.delete(animIn)
        });
        registerAnimation(animIn);
      }
    });
    registerAnimation(animOut);
  } catch (e) {
    if (onHalfway) onHalfway();
  }
}

/**
 * 6. Map Action Button Feedback
 */
export function animateActionButtonFeedback(buttonEl) {
  if (!buttonEl || isReducedMotion()) return;

  try {
    const anim = animate(buttonEl, {
      scale: [1, 1.04, 1],
      duration: ANIM_TOKENS.fast,
      ease: 'outQuad',
      onComplete: () => activeAnimations.delete(anim)
    });
    registerAnimation(anim);
  } catch (e) {}
}

/**
 * 7. Typing Indicator Sine Wave
 */
export function animateTypingIndicator(dotsContainerEl) {
  if (!dotsContainerEl || isReducedMotion()) return null;

  const dots = dotsContainerEl.querySelectorAll('.typing-dot');
  if (!dots || dots.length === 0) return null;

  try {
    const anim = animate(dots, {
      translateY: [-4, 2],
      duration: 380,
      delay: stagger(100),
      alternate: true,
      loop: true,
      ease: 'inOutSine'
    });
    registerAnimation(anim);
    return anim;
  } catch (e) {
    return null;
  }
}

/**
 * 8. Subtle Emblem Glow Pulse
 */
export function animateEmblemGlow(emblemEl) {
  if (!emblemEl || isReducedMotion()) return null;

  try {
    const anim = animate(emblemEl, {
      scale: [1, 1.04],
      duration: 1800,
      alternate: true,
      loop: true,
      ease: 'inOutSine'
    });
    registerAnimation(anim);
    return anim;
  } catch (e) {
    return null;
  }
}

// Convenience Aliases
export const animateDrawerEnter = animateDrawerOpen;
export const animateDrawerExit = animateDrawerClose;
export const animateMessageBubble = animateMessageEnter;
export const animateTypingDots = animateTypingIndicator;
export const animateEmblemPulse = animateEmblemGlow;
