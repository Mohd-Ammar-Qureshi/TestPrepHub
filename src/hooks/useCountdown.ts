import {useCallback, useEffect, useRef, useState} from 'react';

/**
 * Counts down from totalSeconds using a start timestamp, so the time stays
 * correct even if the app is briefly in the background. Calls onExpire once.
 */
export function useCountdown(totalSeconds: number, onExpire: () => void) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const startRef = useRef(Date.now());
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
      const left = Math.max(0, totalSeconds - elapsed);
      setRemaining(left);
      if (left === 0 && !expiredRef.current) {
        expiredRef.current = true;
        clearInterval(id);
        onExpireRef.current();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [totalSeconds]);

  const getElapsedSeconds = useCallback(
    () =>
      Math.min(
        totalSeconds,
        Math.floor((Date.now() - startRef.current) / 1000),
      ),
    [totalSeconds],
  );

  return {remaining, getElapsedSeconds};
}
