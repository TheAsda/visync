import { Room } from './room';

type SocketMessage<T, P = void> = {
  type: T;
} & (P extends void ? { payload?: void } : { payload: P });

export type SocketRequest =
  | SocketMessage<'play'>
  | SocketMessage<'pause'>
  | SocketMessage<'rewind', { time: number }>
  | SocketMessage<'play-speed', { speed: number }>;

export type SocketResponse =
  | SocketMessage<'play'>
  | SocketMessage<'pause'>
  | SocketMessage<'rewind', { time: number }>
  | SocketMessage<'play-speed', { speed: number }>;
