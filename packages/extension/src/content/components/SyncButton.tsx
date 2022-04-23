import { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { renderToString } from 'react-dom/server';

export interface SyncButtonProps {
  video: HTMLVideoElement;
}

export const SyncButton = (props: SyncButtonProps) => {
  const [position, setPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);

  useEffect(() => {
    const updatePosition = () => {
      const { top, left, width } = props.video.getBoundingClientRect();
      console.log(props.video.getBoundingClientRect());

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
    resizeObserver.observe(props.video);
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      console.log('Unmount!!!');
      
      resizeObserver.disconnect();
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, []);

  if (position === null) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        right: position.right,
        top: position.top,
        width: 50,
        height: 50,
        background: 'red',
      }}
    ></div>
  );
};
