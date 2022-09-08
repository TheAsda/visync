import { LeaveRoomRequest } from 'visync-contracts';
import { getUrl } from '../../url';
import { handleError } from '../mapResponse';

export const leaveRoom = async (
  roomId: string,
  clientId: string
): Promise<void> => {
  const body: LeaveRoomRequest = {
    clientId: clientId,
  };
  await fetch(getUrl(`/rooms/${roomId}/leave`), {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(handleError);
};
