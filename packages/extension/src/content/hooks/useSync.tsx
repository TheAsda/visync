import { useCallback, useEffect, useRef, useState } from 'react';
import { logger } from '../../runtimeLogger';
import { RuntimeRequest, RuntimeResponse } from '../../types/runtimeMessages';
import { usePing } from './usePing';

const minRewindDelta = 3;

export interface UseSyncProps {
  video: HTMLVideoElement;
  disabled: boolean;
}

export const useSync = (props: UseSyncProps) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const isSyncingRef = useRef(isSyncing);
  isSyncingRef.current = isSyncing;
  const ignoreNextEventRef = useRef(false);
  const ignoreRewindEventRef = useRef(false);
  const ignoreRateEventRef = useRef(false);
  const previousTimeRef = useRef<number>();

  usePing(isSyncing);

  const playCallback = useCallback(() => {
    if (ignoreNextEventRef.current) {
      logger.debug('Ignoring play event');
      ignoreNextEventRef.current = false;
      return;
    }
    logger.debug('Play');
    const request: RuntimeRequest = {
      type: 'play',
    };
    chrome.runtime.sendMessage(JSON.stringify(request));
  }, []);

  const pauseCallback = useCallback(() => {
    if (ignoreNextEventRef.current) {
      logger.debug('Ignoring pause event');
      ignoreNextEventRef.current = false;
      return;
    }
    logger.debug('Pause');
    const request: RuntimeRequest = {
      type: 'pause',
    };
    chrome.runtime.sendMessage(JSON.stringify(request));
  }, []);

  const rewindCallback = useCallback(() => {
    if (ignoreRewindEventRef.current) {
      logger.debug('Ignoring rewind event');
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
    logger.debug(`Rewind to ${time}`);
    const request: RuntimeRequest = {
      type: 'rewind',
      payload: { time },
    };
    chrome.runtime.sendMessage(JSON.stringify(request));
  }, [props.video]);

  const rateCallback = useCallback(() => {
    if (ignoreRateEventRef.current) {
      logger.debug('Ignoring play speed event');
      ignoreRateEventRef.current = false;
      return;
    }
    logger.debug(`Update play speed to ${props.video.playbackRate}`);
    const request: RuntimeRequest = {
      type: 'play-speed',
      payload: { speed: props.video.playbackRate },
    };
    chrome.runtime.sendMessage(JSON.stringify(request));
  }, []);

  const runtimeListener = useCallback(
    (data: string) => {
      const message = JSON.parse(data) as RuntimeResponse;
      logger.debug(`Got runtime message: ${data}`);
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
        case 'play-speed': {
          ignoreRateEventRef.current = true;
          props.video.playbackRate = message.payload.speed;
          break;
        }
      }
    },
    [props.video]
  );

  const startSyncing = useCallback(() => {
    logger.info('Start syncing');
    setIsSyncing(true);
    const request: RuntimeRequest = {
      type: 'start-sync',
    };
    chrome.runtime.sendMessage(JSON.stringify(request), () => {
      props.video.addEventListener('play', playCallback);
      props.video.addEventListener('pause', pauseCallback);
      props.video.addEventListener('timeupdate', rewindCallback);
      props.video.addEventListener('ratechange', rateCallback);
    });
    chrome.runtime.onMessage.addListener(runtimeListener);
  }, []);

  const stopSyncing = useCallback(() => {
    logger.info('Stop syncing');
    chrome.runtime.onMessage.removeListener(runtimeListener);
    props.video.removeEventListener('play', playCallback);
    props.video.removeEventListener('pause', pauseCallback);
    props.video.removeEventListener('timeupdate', rewindCallback);
    props.video.removeEventListener('ratechange', rateCallback);

    if (isSyncingRef.current) {
      setIsSyncing(false);
      const request: RuntimeRequest = {
        type: 'stop-sync',
      };
      chrome.runtime.sendMessage(JSON.stringify(request));
    }
  }, []);

  useEffect(() => {
    if (props.disabled) {
      stopSyncing();
    }
  }, [props.disabled]);

  useEffect(() => {
    () => {
      stopSyncing();
    };
  }, []);

  return {
    isSyncing,
    startSyncing,
    stopSyncing,
  };
};
