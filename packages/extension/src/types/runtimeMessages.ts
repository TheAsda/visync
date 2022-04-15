type RuntimeMessage<T, P = void> = {
  type: T;
} & (P extends void ? {} : { payload: P });

export type RuntimeRequest =
  | RuntimeMessage<'create-room', { link: string }>
  | RuntimeMessage<'join-room', { roomId: string }>
  | RuntimeMessage<'leave-room'>
  | RuntimeMessage<'get-room'>
  | RuntimeMessage<'start-sync'>
  | RuntimeMessage<'play'>
  | RuntimeMessage<'pause'>
  | RuntimeMessage<'stop-sync'>
  | RuntimeMessage<'ping'>;
