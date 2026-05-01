import { useState, useEffect, useRef } from 'react';

interface Props {
  text: string;
  speed?: number;
  delay?: number;
}

export default function TypeWriter({ text, speed = 50, delay = 300 }: Props) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const generation = useRef(0);

  useEffect(() => {
    generation.current += 1;
    const gen = generation.current;
    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    setDisplayed('');
    setDone(false);

    const timeoutId = setTimeout(() => {
      if (cancelled || gen !== generation.current) return;

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
  }, [text, speed, delay]);

  return (
    <span>
      {displayed}
      {!done && <span className="cursor">▌</span>}
    </span>
  );
}
