import { getMessage } from '@extend-chrome/messages';
import { Exception } from '../types/exception';
import { Room } from '../types/room';
import { RuntimeMessage } from '../types/runtimeMessages';

export type RoomRequest =
  | void
  | RuntimeMessage<'create-room'>
  | RuntimeMessage<'join-room', { roomId: string }>
  | RuntimeMessage<'leave-room'>;

const [_sendRoom, roomStream, waitForRoom] = getMessage<
  RoomRequest,
  Room | null | Exception
>('room', { async: true });

const sendRoom = async (request: RoomRequest) => {
  const result = await _sendRoom(request);
  if (result && 'message' in result) {
    throw new Error(result.message);
  }
  return result;
};

export { sendRoom, roomStream, waitForRoom };
