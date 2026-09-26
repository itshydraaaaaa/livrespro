import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: string;
  className?: string;
}

/**
 * Animated number counter that counts up into view once when scrolled into viewport.
 * Respects prefers-reduced-motion.
 */
export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    // Check for reduced motion preference
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayValue(value);
      return;
    }

    if (!isInView) return;

    // Parse numerical target and suffix/prefix
    // Examples: '100+' -> num: 100, suffix: '+'
    // '50' -> num: 50, suffix: ''
    // '10–11' -> special range, animate smoothly
    // '30+' -> num: 30, suffix: '+'
    // '10K+' -> num: 10, suffix: 'K+'
    // '95%+' -> num: 95, suffix: '%+'
    const match = value.match(/^(\d+)(.*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const targetNum = parseInt(match[1], 10);
    const suffix = match[2];
    const duration = 1400; // ms
    const startTime = performance.now();

    let animationFrameId: number;

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo curve: 1 - Math.pow(2, -10 * progress)
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentCount = Math.round(targetNum * ease);

      setDisplayValue(`${currentCount}${suffix}`);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, value]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}
