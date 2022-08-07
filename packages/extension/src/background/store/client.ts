import { AxiosError } from 'axios';
import { nanoid } from 'nanoid';
import { BehaviorSubject } from 'rxjs';
import { Client } from 'visync-contracts';
import { getClientId } from '../clientId';
import { fetcher } from '../fetcher';
import { createRoom } from '../lib/fetch/createRoom';
import { joinRoom } from '../lib/fetch/joinRoom';
import { leaveRoom } from '../lib/fetch/leaveRoom';

class ClientStore {
  private _clientId: string | undefined;
  private roomSubject: BehaviorSubject<string | undefined>;

  constructor() {
    this.roomSubject = new BehaviorSubject<string | undefined>(undefined);
    this.initialize();
  }

  get roomId$() {
    return this.roomSubject.asObservable();
  }

  async initialize() {
    this._clientId = await getClientId();
    try {
      const client = await fetcher
        .get(`/clients/${this._clientId}`)
        .then((res) => {
          return res.data as Client;
        });
      this.roomSubject.next(client.roomId);
    } catch (e) {
      const err = e as AxiosError;
      if (err.response?.status === 404) {
        await fetcher.put(`/clients/${this._clientId}`, {});
      }
    }
  }

  get roomId() {
    return this.roomSubject.getValue();
  }

  get clientId(): string {
    if (!this._clientId) {
      throw new Error('Client ID is not set');
    }
    return this._clientId;
  }

  async createRoom() {
    if (this.roomId) {
      throw new Error('Client is already in a room');
    }
    const roomId = nanoid(6);
    const room = await createRoom(roomId, this.clientId);
    this.roomSubject.next(room.roomId);
    return room;
  }

  async joinRoom(roomId: string) {
    if (this.roomId) {
      throw new Error('Client is already in a room');
    }
    const room = await joinRoom(roomId, this.clientId);
    this.roomSubject.next(room.roomId);
    return room;
  }

  async leaveRoom() {
    if (!this.roomId) {
      throw new Error('Client is not in a room');
    }
    await leaveRoom(this.roomId, this.clientId);
    this.roomSubject.next(undefined);
  }
}

export const clientStore = new ClientStore();
