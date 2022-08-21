import { sendClientId } from '../messageStreams/clientId';
import { command$ } from '../messageStreams/command';
import { sendIsSynced } from '../messageStreams/isSynced';
import { ping$ } from '../messageStreams/ping';
import { sendRoomId } from '../messageStreams/roomId';
import './contextMenu';
import { getTabId } from './lib/getTabId';
import { handleError } from './lib/handleError';
import { statusTrigger$, trigger, withStatusTrigger } from './statusTrigger';
import { clientId, roomActions, roomId$ } from './store/client';
import { isSynced$, startSyncing, stopSyncing } from './sync';

command$.subscribe(async ({ message: command, sender, messageId }) => {
  switch (command.type) {
    case 'start-sync': {
      startSyncing(getTabId(sender), command.payload.videoSelector);
      break;
    }
    case 'stop-sync': {
      stopSyncing();
      break;
    }
    case 'create-room': {
      try {
        await roomActions.create();
      } catch (err) {
        handleError(err, sender, messageId);
      }
      break;
    }
    case 'join-room': {
      try {
        await roomActions.join(command.payload.roomId);
      } catch (err) {
        handleError(err, sender, messageId);
      }
      break;
    }
    case 'leave-room': {
      try {
        await roomActions.leave();
      } catch (err) {
        handleError(err, sender, messageId);
      }
      break;
    }
    case 'save-settings': {
      // clientSettings$.next(command.payload);
      break;
    }
    case 'get-status': {
      trigger();
      break;
    }
  }
});

statusTrigger$.subscribe(async () => {
  sendClientId(await clientId);
});

// Send roomId to runtime when roomId changes
roomId$.pipe(withStatusTrigger).subscribe((roomId) => {
  sendRoomId(roomId);
});

// Update sync status when isSynced changes
isSynced$.pipe(withStatusTrigger).subscribe((isSynced) => {
  sendIsSynced(isSynced);
});

// // Update settings when client settings change
// clientSettings$.pipe(withStatusTrigger).subscribe((settings) => {
//   sendSettings(settings);
// });

ping$.subscribe(async () => {
  console.debug('Got ping');
});
