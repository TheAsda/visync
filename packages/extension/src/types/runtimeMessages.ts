import { ClientSettings } from './settings';

type RuntimeMessage<T, P = void> = {
  type: T;
} & (P extends void ? {} : { payload: P });

export type RuntimeRequest =
  | RuntimeMessage<'status'>
  | RuntimeMessage<'create-room'>
  | RuntimeMessage<'join-room', { roomId: string }>
  | RuntimeMessage<'leave-room'>
  | RuntimeMessage<'start-sync'>
  | RuntimeMessage<'play'>
  | RuntimeMessage<'pause'>
  | RuntimeMessage<'rewind', { time: number }>
  | RuntimeMessage<'play-speed', { speed: number }>
  | RuntimeMessage<'stop-sync'>
  | RuntimeMessage<'ping'>
  | RuntimeMessage<'settings'>
  | RuntimeMessage<'update-settings', ClientSettings>;

export type RuntimeResponse =
  | RuntimeMessage<
      'status',
      {
        clientId: string;
        room?: {
          roomId: string;
          clientsCount: number;
        };
        isSynced: boolean;
        tabIsSynced?: boolean;
      }
    >
  | RuntimeMessage<'play'>
  | RuntimeMessage<'pause'>
  | RuntimeMessage<'rewind', { time: number }>
  | RuntimeMessage<'play-speed', { speed: number }>
  | RuntimeMessage<'settings', ClientSettings>;
