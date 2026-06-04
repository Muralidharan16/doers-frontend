/*
 * THEME ANALYSIS FINDINGS
 * Colors: --bg-page: #F7F5F1, --bg-surface: #FFFFFF, --text-primary: #1A1814, --accent-gold: #B87333
 * Radius: rounded-[6px] / var(--radius-md)
 * Font: Instrument Sans (--font-sans), Cormorant Garamond (--font-serif)
 * Components: Custom UI components (Card, Button, Input) & lucide-react icons
 * Buttons: Button (variants: primary | secondary | danger | ghost)
 * Forms: Vanilla React state-driven, luxury-input styling
 * API: Axios instance (apiClient) at src/shared/services/api/client.ts with Authorization headers
 * Toasts: Premium inline custom status banners (matching existing error/success styling)
 * Loading: Loader2 spinner from lucide-react with animate-spin
 * File upload: No existing pattern found — establish new
 */

import { useState, useCallback, type RefObject } from 'react';

export function useFocalPoint(
  containerRef: RefObject<HTMLDivElement | null>
) {
  const [focalY, setFocalY] = useState(0.5); // Default to center

  const handleUpdateFocal = useCallback((clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeY = clientY - rect.top;
    
    // Mathematically clamp between 0.0 and 1.0 (top to bottom)
    const clampedY = Math.max(0.0, Math.min(1.0, relativeY / rect.height));
    setFocalY(parseFloat(clampedY.toFixed(3)));
  }, [containerRef]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleUpdateFocal(e.clientY);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      handleUpdateFocal(moveEvent.clientY);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [handleUpdateFocal]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleUpdateFocal(e.touches[0].clientY);
    }

    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (moveEvent.touches[0]) {
        handleUpdateFocal(moveEvent.touches[0].clientY);
      }
    };

    const handleTouchEnd = () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
  }, [handleUpdateFocal]);

  return {
    focalY,
    setFocalY,
    handleMouseDown,
    handleTouchStart,
  };
}
