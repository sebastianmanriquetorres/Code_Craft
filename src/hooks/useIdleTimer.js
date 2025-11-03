import { useState, useEffect, useCallback, useRef } from 'react';

export const useIdleTimer = (onIdle, timeout = 1000 * 60 * 15) => {
  const [isIdle, setIsIdle] = useState(false);
  const timeoutId = useRef();

  const handleIdle = useCallback(() => {
    setIsIdle(true);
    onIdle();
  }, [onIdle]);

  const resetTimer = useCallback(() => {
    setIsIdle(false);
    clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(handleIdle, timeout);
  }, [handleIdle, timeout]);

  useEffect(() => {
    resetTimer();
    
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    
    const handleActivity = () => resetTimer();

    events.forEach(event => window.addEventListener(event, handleActivity));

    return () => {
      clearTimeout(timeoutId.current);
      events.forEach(event => window.removeEventListener(event, handleActivity));
    };
  }, [resetTimer]);

  return isIdle;
};