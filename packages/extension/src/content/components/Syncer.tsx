import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCanSync } from '../hooks/useCanSync';
import { useSettings } from '../hooks/useSettings';
import { useVideos } from '../hooks/useVideos';
import { SyncButton } from './SyncButton';

export const Syncer = () => {
  const videos = useVideos();
  const [syncingIndex, setSyncingIndex] = useState<number>();
  const canSync = useCanSync();
  const { isLoading, settings } = useSettings();

  if (videos.length === 0 || !canSync || isLoading) {
    return null;
  }

  return (
    <>
      {videos.map((v, i) => {
        if (v === null) {
          return null;
        }
        if (settings?.useForcedDisplaying) {
          return (
            <SyncButton
              key={i}
              video={v}
              disabled={syncingIndex !== undefined && syncingIndex !== i}
              onStartSync={() => setSyncingIndex(i)}
              onStopSync={() => setSyncingIndex(undefined)}
              style={{ zIndex: 10000 }}
            />
          );
        }
        return createPortal(
          <SyncButton
            video={v}
            disabled={syncingIndex !== undefined && syncingIndex !== i}
            onStartSync={() => setSyncingIndex(i)}
            onStopSync={() => setSyncingIndex(undefined)}
          />,
          v.parentElement!,
          i.toString()
        );
      })}
    </>
  );
};
