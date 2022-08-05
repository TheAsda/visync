import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Client } from '../../types/client';
import RoomIcon from '../assets/RoomIcon.svg';
import { queryKeys } from '../lib/queryKeys';
import { getRoom } from '../lib/runtime/getRoom';
import { leaveRoom } from '../lib/runtime/leaveRoom';
import { Button } from './Button';
import { CopyButton } from './CopyButton';
import { Loader } from './Loader';
import './RoomInfo.css';

export const RoomInfo = () => {
  const queryClient = useQueryClient();
  const { data: room, status: roomStatus } = useQuery(queryKeys.room, getRoom);
  const { mutate: leave, status: leaveStatus } = useMutation(leaveRoom, {
    onSuccess: (room) => {
      queryClient.setQueryData(queryKeys.room, room);
      queryClient.setQueryData<Client>(queryKeys.client, (client) => {
        if (!client) {
          return;
        }
        return { ...client, roomId: room?.roomId };
      });
    },
  });

  const copyRoomId = () => {
    if (room) {
      navigator.clipboard.writeText(room.roomId);
    }
  };

  if (roomStatus === 'loading') {
    return <Loader />;
  }

  if (!room) {
    return null;
  }

  if (leaveStatus === 'loading') {
    return <Loader loadingText="Leaving" />;
  }

  return (
    <div className="room-info">
      <div className="room-info__info">
        <p className="room-info__text">Room: {room.roomId}</p>
        <div className="room-info__count-box">
          <RoomIcon />
          <p className="room-info__count">{0}</p>
        </div>
        <CopyButton
          className="room-info__copy-button"
          aria-label="Copy to clipboard"
          onClick={copyRoomId}
        />
      </div>
      <p className="room-info__text">{false ? 'Synced' : 'Not Synced'}</p>
      <Button type="button" onClick={() => leave()}>
        Leave Room
      </Button>
    </div>
  );
};
