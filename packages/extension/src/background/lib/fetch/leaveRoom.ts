import { LeaveRoomRequest } from 'visync-contracts';
import { fetcher } from '../../fetcher';

export const leaveRoom = async (
  roomId: string,
  clientId: string
): Promise<void> => {
  return fetcher.post(`/rooms/${roomId}/leave`, {
    clientId: clientId,
  } as LeaveRoomRequest);
};
