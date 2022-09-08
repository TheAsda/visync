import { nanoid } from 'nanoid';
import { BehaviorSubject } from 'rxjs';
import { Client } from 'visync-contracts';
import { getClientId } from '../clientId';
import { createRoom } from '../lib/fetch/createRoom';
import { joinRoom } from '../lib/fetch/joinRoom';
import { leaveRoom } from '../lib/fetch/leaveRoom';
import { getUrl } from '../url';

export const clientId = getClientId();
export const roomId$ = new BehaviorSubject<string | undefined>(undefined);

clientId.then((clientId) =>
  fetch(getUrl(`/clients/${clientId}`))
    .then(async (res) => {
      if (res.status === 404) {
        await fetch(getUrl(`/clients/${clientId}`), { method: 'PUT' });
        return;
      }
      const client: Client = await res.json();
      roomId$.next(client.roomId);
    })
    .catch((err) => {
      console.log(err);
    })
);

export const roomActions = {
  create: async () => {
    if (roomId$.getValue()) {
      throw new Error('Already in a room');
    }
    const roomId = nanoid(6);
    const room = await createRoom(roomId, await clientId);
    roomId$.next(room.roomId);
  },
  join: async (roomId: string) => {
    if (roomId$.getValue()) {
      throw new Error('Already in a room');
    }
    const room = await joinRoom(roomId, await clientId);
    roomId$.next(room.roomId);
  },
  leave: async () => {
    const roomId = roomId$.getValue();
    if (!roomId) {
      throw new Error('Not in a room');
    }
    await leaveRoom(roomId, await clientId);
    roomId$.next(undefined);
  },
};
