import { useCallback, useEffect, useRef, useState } from 'react';

const hideDelay = 2000;

export const useVisibleTimeout = () => {
  const [isVisible, setIsVisible] = useState(true);
  const visibleTimeoutRef = useRef<number>();

  const startVisibleTimeout = useCallback(() => {
    if (visibleTimeoutRef.current) {
      clearTimeout(visibleTimeoutRef.current);
    }
    visibleTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, hideDelay) as unknown as number;
  }, []);

  const stopVisibleTimeout = useCallback(() => {
    clearTimeout(visibleTimeoutRef.current);
    visibleTimeoutRef.current = undefined;
  }, []);

  const makeVisible = useCallback(() => {
    stopVisibleTimeout();
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (isVisible) {
      startVisibleTimeout();
    }
  }, [isVisible]);

  return {
    isVisible,
    makeVisible,
    startVisibleTimeout,
  };
};
