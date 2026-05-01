import { useState, useEffect, useRef } from 'react';

interface Props {
  text: string;
  speed?: number;
  delay?: number;
}

function prefersStableText() {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(max-width: 800px), (pointer: coarse), (prefers-reduced-motion: reduce)').matches;
}

export default function TypeWriter({ text, speed = 50, delay = 300 }: Props) {
  const useReveal = prefersStableText();
  const [displayed, setDisplayed] = useState(() => useReveal ? text : '');
  const [done, setDone] = useState(() => useReveal);
  const generation = useRef(0);

  useEffect(() => {
    generation.current += 1;
    const gen = generation.current;
    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    if (useReveal) {
      const stableTextId = setTimeout(() => {
        if (cancelled || gen !== generation.current) return;
        setDisplayed(text);
        setDone(true);
      }, 0);
      return () => {
        cancelled = true;
        clearTimeout(stableTextId);
      };
    }

    const timeoutId = setTimeout(() => {
      if (cancelled || gen !== generation.current) return;

      setDisplayed('');
      setDone(false);

      let i = 0;
      intervalId = setInterval(() => {
        if (cancelled || gen !== generation.current) {
          if (intervalId) clearInterval(intervalId);
          return;
        }

        i++;
        setDisplayed(text.slice(0, i));

        if (i >= text.length) {
          if (intervalId) clearInterval(intervalId);
          setDone(true);
        }
      }, speed);
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, delay, useReveal]);

  return (
    <span className={useReveal ? 'typewriter-reveal' : undefined}>
      {displayed}
      {!done && <span className="cursor">▌</span>}
    </span>
  );
}
