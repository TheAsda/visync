import { ClientSettings } from './settings';
import { Client } from './client';
import { Room } from 'visync-contracts';

export type RuntimeMessage<T, P = void> = {
  type: T;
} & (P extends void ? {} : { payload: P });

export type RuntimeRequest =
  | RuntimeMessage<'client'>
  | RuntimeMessage<'room'> 
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
  | RuntimeMessage<'client', Client>
  | RuntimeMessage<'room', Room | null>
  | RuntimeMessage<'play'>
  | RuntimeMessage<'pause'>
  | RuntimeMessage<'rewind', { time: number }>
  | RuntimeMessage<'play-speed', { speed: number }>
  | RuntimeMessage<'settings', ClientSettings>;
