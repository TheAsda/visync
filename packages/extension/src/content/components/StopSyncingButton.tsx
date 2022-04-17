import { Logo } from '../../common/Logo';

export interface StopSyncingButtonProps {
  onStop: () => void;
}

export const StopSyncingButton = (props: StopSyncingButtonProps) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        props.onStop();
      }}
      type="button"
      style={{
        appearance: 'none',
        border: 'none',
      }}
    >
      <Logo variant="stop" shape="square" />
    </button>
  );
};
