import { sendClientId } from '../messageStreams/clientId';
import { command$ } from '../messageStreams/command';
import { sendIsSynced } from '../messageStreams/isSynced';
import { ping$ } from '../messageStreams/ping';
import { sendRoomId } from '../messageStreams/roomId';
import './contextMenu';
import { statusTrigger$, trigger, withStatusTrigger } from './statusTrigger';
import { clientId, roomActions, roomId$ } from './store/client';
import { isSynced$, startSyncing, stopSyncing } from './sync';

command$.subscribe(({ message: command, sender }) => {
  switch (command.type) {
    case 'start-sync': {
      if (!sender.tab?.id) {
        throw new Error('Sender is not a tab');
      }
      startSyncing(sender.tab.id, command.payload.videoSelector);
      break;
    }
    case 'stop-sync': {
      stopSyncing();
      break;
    }
    case 'create-room': {
      roomActions.create();
      break;
    }
    case 'join-room': {
      roomActions.join(command.payload.roomId);
      break;
    }
    case 'leave-room': {
      roomActions.leave();
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
