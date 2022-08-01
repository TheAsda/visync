import { ClientSettings } from './settings';
import type { LogRequest } from 'visync-contracts';
import { Status } from './status';

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
  | RuntimeMessage<'update-settings', ClientSettings>
  | RuntimeMessage<'log', LogRequest>;

export type RuntimeResponse =
  | RuntimeMessage<'status', Status>
  | RuntimeMessage<'play'>
  | RuntimeMessage<'pause'>
  | RuntimeMessage<'rewind', { time: number }>
  | RuntimeMessage<'play-speed', { speed: number }>
  | RuntimeMessage<'settings', ClientSettings>;
