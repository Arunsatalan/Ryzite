import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  value: string;
  prefix?: string | null;
  suffix?: string | null;
  animationEnabled?: boolean;
  className?: string;
  durationMs?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  prefix = '',
  suffix = '',
  animationEnabled = true,
  className = '',
  durationMs = 1500
}) => {
  const [displayValue, setDisplayValue] = useState<number | string>(() => {
    // If animation is disabled, start directly with parsed number or raw string
    if (!animationEnabled) return value;
    return 0;
  });
  
  const containerRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef<boolean>(false);

  useEffect(() => {
    // Extract numeric portion from string (e.g. "25" -> 25)
    const numericTarget = parseFloat(value.replace(/[^0-9.]/g, ''));
    
    if (isNaN(numericTarget) || !animationEnabled) {
      setDisplayValue(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;

          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / durationMs, 1);
            
            // Ease out expo formula: 1 - Math.pow(2, -10 * progress)
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentCount = Math.floor(easeProgress * numericTarget);

            setDisplayValue(currentCount);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setDisplayValue(numericTarget);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [value, animationEnabled, durationMs]);

  return (
    <span ref={containerRef} className={className}>
      {prefix || ''}{displayValue}{suffix || ''}
    </span>
  );
};
