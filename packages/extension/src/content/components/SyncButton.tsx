import { Logo } from '../../common/Logo';

export interface SyncButtonProps {
  onSync: () => void;
}

export const SyncButton = (props: SyncButtonProps) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        props.onSync();
      }}
      type="button"
      style={{
        appearance: 'none',
        border: 'none',
      }}
    >
      <Logo variant="start" shape="triangle" />
    </button>
  );
};
