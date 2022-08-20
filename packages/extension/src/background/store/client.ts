import { AxiosError } from 'axios';
import { nanoid } from 'nanoid';
import { BehaviorSubject, from } from 'rxjs';
import { Client } from 'visync-contracts';
import { getClientId } from '../clientId';
import { fetcher } from '../fetcher';
import { createRoom } from '../lib/fetch/createRoom';
import { joinRoom } from '../lib/fetch/joinRoom';
import { leaveRoom } from '../lib/fetch/leaveRoom';

export const clientId = await getClientId();
export const roomId$ = new BehaviorSubject<string | undefined>(undefined);

try {
  const client = await fetcher.get(`/clients/${clientId}`).then((res) => {
    return res.data as Client;
  });
  roomId$.next(client.roomId);
} catch (e) {
  const err = e as AxiosError;
  if (err.response?.status === 404) {
    await fetcher.put(`/clients/${clientId}`);
  }
}

export const roomActions = {
  create: async () => {
    if (roomId$.getValue()) {
      throw new Error('Already in a room');
    }
    const roomId = nanoid(6);
    const room = await createRoom(roomId, clientId);
    roomId$.next(room.roomId);
  },
  join: async (roomId: string) => {
    if (roomId$.getValue()) {
      throw new Error('Already in a room');
    }
    const room = await joinRoom(roomId, clientId);
    roomId$.next(room.roomId);
  },
  leave: async () => {
    const roomId = roomId$.getValue();
    if (!roomId) {
      throw new Error('Not in a room');
    }
    await leaveRoom(roomId, clientId);
    roomId$.next(undefined);
  },
};
