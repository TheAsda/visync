import DisabledLogo from '../assets/DisabledLogo.svg';
import PlayLogo from '../assets/PlayLogo.svg';
import StopLogo from '../assets/StopLogo.svg';
import styles from './SyncButton.css';

export interface SyncButtonProps {
  onSyncStart?: () => void;
  onSyncStop?: () => void;
  isSynced: boolean;
  isDisabled: boolean;
}

export const SyncButton = (props: SyncButtonProps) => {
  const { onSyncStart, onSyncStop, isDisabled, isSynced } = props;

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
