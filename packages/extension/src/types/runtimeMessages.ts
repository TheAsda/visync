type RuntimeMessage<T, P = void> = {
  type: T;
} & (P extends void ? {} : { payload: P });

export type RuntimeRequest =
  | RuntimeMessage<'get-client'>
  | RuntimeMessage<'create-room'>
  | RuntimeMessage<'join-room', { roomId: string }>
  | RuntimeMessage<'leave-room'>
  | RuntimeMessage<'initialize'>
  | RuntimeMessage<'get-room'>
  | RuntimeMessage<'start-sync'>
  | RuntimeMessage<'play'>
  | RuntimeMessage<'pause'>
  | RuntimeMessage<'rewind', { time: number }>
  | RuntimeMessage<'stop-sync'>
  | RuntimeMessage<'ping'>;

export type ContentMessage =
  | RuntimeMessage<'client', { clientId: string; isInRoom: boolean }>
  | RuntimeMessage<'play'>
  | RuntimeMessage<'pause'>
  | RuntimeMessage<'rewind', { time: number }>;
