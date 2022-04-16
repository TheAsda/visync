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
    >
      Stop syncing
    </button>
  );
};
