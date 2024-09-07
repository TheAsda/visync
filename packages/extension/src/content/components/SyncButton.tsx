import { useEffect } from 'react';
import { bind } from '@react-rxjs/core';
import { map, startWith } from 'rxjs';
import { sendCommand } from '../../messageStreams/command';
import { isSynced$ } from '../../messageStreams/isSynced';
import { notification$ } from '../../messageStreams/notification';
import DisabledLogo from '../assets/DisabledLogo.svg';
import PlayLogo from '../assets/PlayLogo.svg';
import StopLogo from '../assets/StopLogo.svg';
import styles from './SyncButton.css';

const [useIsSynced] = bind(
  isSynced$.pipe(map(({ message }) => message)),
  false
);
const [useIsTabSynced] = bind(
  notification$.pipe(
    map(({ message }) => message),
    map((message) => (message.type === 'sync-started' ? true : false))
  ),
  false
);

const startSync = (videoSelector: string) => {
  sendCommand({ type: 'start-sync', payload: { videoSelector } });
};
const stopSync = () => {
  sendCommand({ type: 'stop-sync' });
};

export interface SyncButtonProps {
  videoSelector: string | (() => string);
}

export const SyncButton = (props: SyncButtonProps) => {
  const { videoSelector } = props;

  useEffect(() => {
    sendCommand({ type: 'get-status' });
  }, []);

  const isSynced = useIsSynced();
  const isTabSynced = useIsTabSynced();
  const isDisabled = isSynced && !isTabSynced;

  const onClick = () => {
    if (isSynced) {
      stopSync();
    } else {
      startSync(
        typeof videoSelector === 'function' ? videoSelector() : videoSelector
      );
    }
  };

  return (
    <>
      <button className="sync-button" disabled={isDisabled} onClick={onClick}>
        {isDisabled ? (
          <DisabledLogo className="sync-button__icon" />
        ) : isSynced ? (
          <StopLogo className="sync-button__icon" />
        ) : (
          <PlayLogo className="sync-button__icon" />
        )}
      </button>
      <style>{styles}</style>
    </>
  );
};
