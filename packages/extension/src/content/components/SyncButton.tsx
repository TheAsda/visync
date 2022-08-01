import { clsx } from 'clsx';
import {
  ComponentPropsWithoutRef,
  MouseEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react';
import ReactShadowRoot from 'react-shadow-root';
import DisabledLogoSvg from '../assets/DisabledLogo.svg';
import PlayLogoSvg from '../assets/PlayLogo.svg';
import StopLogoSvg from '../assets/StopLogo.svg';
import { useSync } from '../hooks/useSync';
import { useVisibleTimeout } from '../hooks/useVisibleTimeout';
import styles from './SyncButton.css';

type Position = {
  top: number;
  right: number;
};

export interface SyncButtonProps extends ComponentPropsWithoutRef<'button'> {
  video: HTMLVideoElement;
  disabled: boolean;
  onStartSync: () => void;
  onStopSync: () => void;
}

export const SyncButton = (props: SyncButtonProps) => {
  const { video, disabled, onStartSync, onStopSync, ...buttonProps } = props;
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

      const right = document.body.scrollWidth - (left + width);
      setPosition({
        top,
        right,
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
    <div>
      <ReactShadowRoot>
        <style>{styles}</style>
        <button
          onClick={clickHandler}
          onMouseEnter={makeVisible}
          onMouseLeave={startVisibleTimeout}
          disabled={disabled}
          {...buttonProps}
          className={clsx(buttonProps.className, 'vi-sync-button', {
            'vi-sync-button--hidden': !isVisible,
          })}
          style={{
            top: position.top + 'px',
            right: position.right + 'px',
            ...buttonProps.style,
          }}
        >
          {disabled ? (
            <DisabledLogoSvg />
          ) : isSyncing ? (
            <StopLogoSvg />
          ) : (
            <PlayLogoSvg />
          )}
        </button>
      </ReactShadowRoot>
    </div>
  );
};
