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

    const timeout = setTimeout(() => {
      if (gen !== generation.current) return;
      setDisplayed('');
      setDone(false);
      let i = 0;
      const interval = setInterval(() => {
        if (gen !== generation.current) {
          clearInterval(interval);
          return;
        }
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return (
    <span>
      {displayed}
      {!done && <span className="cursor">▌</span>}
    </span>
  );
}
