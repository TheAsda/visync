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
    >
      Sync
    </button>
  );
};
