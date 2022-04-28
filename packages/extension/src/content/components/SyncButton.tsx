import { styled } from 'goober';
import { MouseEventHandler, useCallback, useEffect, useState } from 'react';
import DisabledLogoSvg from '../assets/DisabledLogo.svg';
import PlayLogoSvg from '../assets/PlayLogo.svg';
import StopLogoSvg from '../assets/StopLogo.svg';
import { useSync } from '../hooks/useSync';
import { useVisibleTimeout } from '../hooks/useVisibleTimeout';

type Position = {
  top: number;
  right: number;
};

const size = '100px';

const Button = styled('div')({
  position: 'fixed',
  width: size,
  height: size,
  background: 'transparent',
  cursor: 'pointer',
  transform: 'scale(0.9)',
  transition: 'transform 0.2s ease, opacity 0.7s ease-out',
  '&:hover': {
    transform: 'scale(1)',
  },
});

export interface SyncButtonProps {
  video: HTMLVideoElement;
  disabled: boolean;
  onStartSync: () => void;
  onStopSync: () => void;
}

export const SyncButton = (props: SyncButtonProps) => {
  const { video, disabled, onStartSync, onStopSync } = props;
  const [position, setPosition] = useState<Position | null>(null);
  const { isSyncing, startSyncing, stopSyncing } = useSync({ disabled, video });
  const { isVisible, makeVisible, startVisibleTimeout } = useVisibleTimeout();

  useEffect(() => {
    const updatePosition = () => {
      const { top, left, width } = video.getBoundingClientRect();

      if (top < 0) {
        setPosition(null);
        return;
      }
      setPosition({
        top,
        right: document.body.scrollWidth - (left + width),
      });
    };

    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(video);
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, []);

  const clickHandler: MouseEventHandler = useCallback(
    (e) => {
      e.stopPropagation();
      if (disabled) {
        return;
      }
      if (isSyncing) {
        stopSyncing();
        onStopSync();
      } else {
        startSyncing();
        onStartSync();
      }
    },
    [disabled, isSyncing]
  );

  if (position === null) {
    return null;
  }

  return (
    <Button
      style={{
        top: position.top + 'px',
        right: position.right + 'px',
        cursor: disabled ? 'not-allowed' : undefined,
        opacity: isVisible ? 1 : 0,
        zIndex: 10000,
      }}
      onClick={clickHandler}
      onMouseEnter={makeVisible}
      onMouseLeave={startVisibleTimeout}
    >
      {disabled ? (
        <DisabledLogoSvg />
      ) : isSyncing ? (
        <StopLogoSvg />
      ) : (
        <PlayLogoSvg />
      )}
    </Button>
  );
};
