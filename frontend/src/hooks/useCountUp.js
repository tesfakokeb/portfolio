import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number from 0 to `end` once `start` becomes true.
 * Uses requestAnimationFrame with an ease-out curve.
 */
export function useCountUp(end, { start = false, duration = 1600 } = {}) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!start || startedRef.current) return;
    startedRef.current = true;

    const startTime = performance.now();
    const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuint(progress);
      setValue(Math.round(eased * end));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [start, end, duration]);

  return value;
}
