import { useState, useEffect, useRef } from 'react';
import { useGesture } from 'use-gesture';

export interface SwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  threshold?: number;
  velocity?: number;
}

export const useSwipe = (options: SwipeOptions) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);
  
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    threshold = 100,
    velocity = 0.5
  } = options;

  const bind = useGesture({
    onDrag: ({ offset: [x, y], velocity: [vx], direction: [dx], down, cancel }) => {
      if (isAnimating) return;
      
      setDragOffset({ x, y });

      if (!down) {
        const shouldSwipe = Math.abs(x) > threshold || Math.abs(vx) > velocity;
        
        if (shouldSwipe) {
          setIsAnimating(true);
          
          if (x > 0 && dx > 0) {
            onSwipeRight?.();
          } else if (x < 0 && dx < 0) {
            onSwipeLeft?.();
          } else if (y < -threshold) {
            onSwipeUp?.();
          }
          
          setTimeout(() => {
            setIsAnimating(false);
            setDragOffset({ x: 0, y: 0 });
          }, 300);
        } else {
          setDragOffset({ x: 0, y: 0 });
        }
      }
    }
  });

  const swipeDirection = dragOffset.x > 0 ? 'right' : dragOffset.x < 0 ? 'left' : null;
  const swipeIntensity = Math.min(Math.abs(dragOffset.x) / threshold, 1);

  return {
    bind,
    dragOffset,
    swipeDirection,
    swipeIntensity,
    isAnimating,
    elementRef
  };
};