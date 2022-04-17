import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { logger } from '../../logger';
import { ContentMessage, RuntimeRequest } from '../../types/runtimeMessages';
import { usePing } from '../hooks/usePing';
import { StopSyncingButton } from './StopSyncingButton';
import { SyncButton } from './SyncButton';

const minRewindDelta = 3;
const hideDelay = 2000;

export interface SyncerProps {
  video: HTMLVideoElement;
}

export const Syncer = (props: SyncerProps) => {
  const [canSync, setCanSync] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const ignoreNextEventRef = useRef(false);
  const ignoreRewindEventRef = useRef(false);
  const previousTimeRef = useRef<number>();
  const [isVisible, setIsVisible] = useState(true);
  const visibleTimeoutRef = useRef<number>();

  usePing(isSyncing);

  useEffect(() => {
    const initializeRequest: RuntimeRequest = {
      type: 'initialize',
    };
    chrome.runtime.sendMessage(JSON.stringify(initializeRequest));
    const request: RuntimeRequest = {
      type: 'get-client',
    };
    chrome.runtime.sendMessage(JSON.stringify(request), (data) => {
      const message = JSON.parse(data) as ContentMessage;
      if (message.type === 'client') {
        setCanSync(message.payload.isInRoom);
      }
    });
    chrome.runtime.onMessage.addListener((data) => {
      const message = JSON.parse(data) as ContentMessage;
      if (message.type === 'client') {
        setCanSync(message.payload.isInRoom);
      }
    });
  });

  const playCallback = useCallback(() => {
    if (ignoreNextEventRef.current) {
      ignoreNextEventRef.current = false;
      return;
    }
    const request: RuntimeRequest = {
      type: 'play',
    };
    chrome.runtime.sendMessage(JSON.stringify(request));
  }, []);

  const pauseCallback = useCallback(() => {
    if (ignoreNextEventRef.current) {
      ignoreNextEventRef.current = false;
      return;
    }
    const request: RuntimeRequest = {
      type: 'pause',
    };
    chrome.runtime.sendMessage(JSON.stringify(request));
  }, []);

  const rewindCallback = useCallback(() => {
    if (ignoreRewindEventRef.current) {
      ignoreRewindEventRef.current = false;
      return;
    }
    const time = props.video.currentTime;
    if (previousTimeRef.current === undefined) {
      previousTimeRef.current = time;
    }
    if (Math.abs(time - previousTimeRef.current) < minRewindDelta) {
      previousTimeRef.current = time;
      return;
    }
    previousTimeRef.current = time;
    const request: RuntimeRequest = {
      type: 'rewind',
      payload: { time },
    };
    chrome.runtime.sendMessage(JSON.stringify(request));
  }, [props.video]);

  const runtimeListener = useCallback(
    (data: string) => {
      const message = JSON.parse(data) as ContentMessage;
      switch (message.type) {
        case 'play': {
          if (!props.video.paused) {
            logger.info('Video is already playing');
            return;
          }
          ignoreNextEventRef.current = true;
          props.video.play();
          break;
        }
        case 'pause': {
          if (props.video.paused) {
            logger.info('Video is already paused');
            return;
          }
          ignoreNextEventRef.current = true;
          props.video.pause();
          break;
        }
        case 'rewind': {
          ignoreRewindEventRef.current = true;
          props.video.currentTime = message.payload.time;
          break;
        }
      }
    },
    [props.video]
  );

  const startSyncing = () => {
    setIsSyncing(true);
    const request: RuntimeRequest = {
      type: 'start-sync',
    };
    chrome.runtime.sendMessage(JSON.stringify(request), () => {
      props.video.addEventListener('play', playCallback);
      props.video.addEventListener('pause', pauseCallback);
      props.video.addEventListener('timeupdate', rewindCallback);
    });
    chrome.runtime.onMessage.addListener(runtimeListener);
  };

  const stopSyncing = () => {
    setIsSyncing(false);
    chrome.runtime.onMessage.removeListener(runtimeListener);
    props.video.removeEventListener('play', playCallback);
    props.video.removeEventListener('pause', pauseCallback);
    props.video.removeEventListener('timeupdate', rewindCallback);
    const request: RuntimeRequest = {
      type: 'stop-sync',
    };
    chrome.runtime.sendMessage(JSON.stringify(request));
  };

  useEffect(() => {
    if (canSync === false) {
      stopSyncing();
    } else {
      setIsVisible(true);
    }
  }, [canSync]);

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

  useEffect(() => {
    if (isVisible) {
      startVisibleTimeout();
    }
  }, [isVisible]);

  if (!canSync) {
    return null;
  }

  return (
    <div
      style={{
        width: '100px',
        height: '100px',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.7s ease-out',
      }}
      onMouseEnter={() => {
        stopVisibleTimeout();
        setIsVisible(true);
      }}
      onMouseLeave={() => {
        startVisibleTimeout();
      }}
    >
      {!isSyncing ? (
        <SyncButton onSync={startSyncing} />
      ) : (
        <StopSyncingButton onStop={stopSyncing} />
      )}
    </div>
  );
};
