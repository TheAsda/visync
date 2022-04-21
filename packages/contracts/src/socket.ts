type SocketMessage<T, P = void> = {
  type: T;
} & (P extends void ? {} : { payload: P });

export type SocketRequest =
  | SocketMessage<'register', { clientId: string }>
  | SocketMessage<'play', { clientId: string }>
  | SocketMessage<'pause', { clientId: string }>
  | SocketMessage<'rewind', { clientId: string; time: number }>
  | SocketMessage<'play-speed', { clientId: string; speed: number }>;

export type SocketResponse =
  | SocketMessage<'play'>
  | SocketMessage<'pause'>
  | SocketMessage<'rewind', { time: number }>
  | SocketMessage<'play-speed', { speed: number }>;
