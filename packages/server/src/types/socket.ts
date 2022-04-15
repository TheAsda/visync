import { ClientId } from './clientId';

type SocketMessage<T, P = void> = {
  type: T;
} & (P extends void ? {} : { payload: P });

export type SocketRequest =
  | SocketMessage<'register', { clientId: ClientId }>
  | SocketMessage<'play', { clientId: ClientId }>
  | SocketMessage<'pause', { clientId: ClientId }>
  | SocketMessage<'rewind', { clientId: ClientId; time: number }>;

export type SocketResponse =
  | SocketMessage<'play'>
  | SocketMessage<'pause'>
  | SocketMessage<'rewind', { time: number }>;
