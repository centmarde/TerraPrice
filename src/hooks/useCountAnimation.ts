import { useState, useEffect } from 'react';

interface UseCountAnimationOptions {
  end: number;
  duration?: number;
  delay?: number;
  start?: number;
}

export const useCountAnimation = ({ 
  end, 
  duration = 2000, 
  delay = 0,
  start = 0 
}: UseCountAnimationOptions) => {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (end === start) {
      setCount(end);
      return;
    }

    const timer = setTimeout(() => {
      setIsAnimating(true);
      
      const startTime = Date.now();
      const startValue = start;
      const endValue = end;
      const totalChange = endValue - startValue;

      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation (easeOutCubic)
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        const currentValue = Math.round(startValue + (totalChange * easeProgress));
        setCount(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };

      requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timer);
      setIsAnimating(false);
    };
  }, [end, duration, delay, start]);

  return { count, isAnimating };
};
