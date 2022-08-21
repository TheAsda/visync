import { bind } from '@react-rxjs/core';
import { useEffect } from 'react';
import { map, startWith } from 'rxjs';
import { sendCommand } from '../../messageStreams/command';
import { isSynced$ } from '../../messageStreams/isSynced';
import { notification$ } from '../../messageStreams/notification';
import DisabledLogo from '../assets/DisabledLogo.svg';
import PlayLogo from '../assets/PlayLogo.svg';
import StopLogo from '../assets/StopLogo.svg';
import styles from './SyncButton.css';

export interface SyncButtonProps {
  onSyncStart?: () => void;
  onSyncStop?: () => void;
}

const [useIsSynced] = bind(isSynced$.pipe(map(({ message }) => message)));
const [useIsTabSynced] = bind(
  notification$.pipe(
    map(({ message }) => message),
    map((message) => (message.type === 'sync-started' ? true : false)),
    startWith(false)
  )
);

export const SyncButton = (props: SyncButtonProps) => {
  const { onSyncStart, onSyncStop } = props;

  useEffect(() => {
    sendCommand({ type: 'get-status' });
  }, []);

  const isSynced = useIsSynced();
  const isTabSynced = useIsTabSynced();
  const isDisabled = isSynced && !isTabSynced;

  return (
    <>
      <button
        className="sync-button"
        disabled={isDisabled}
        onClick={isSynced ? onSyncStop : onSyncStart}
      >
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
