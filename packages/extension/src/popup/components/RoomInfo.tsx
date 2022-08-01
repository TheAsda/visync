import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import RoomIcon from '../assets/RoomIcon.svg';
import { queryKeys } from '../lib/queryKeys';
import { getStatus } from '../lib/runtime/getStatus';
import { leaveRoom } from '../lib/runtime/leaveRoom';
import { Button } from './Button';
import { CopyButton } from './CopyButton';
import { Loader } from './Loader';
import './RoomInfo.css';

export const RoomInfo = () => {
  const queryClient = useQueryClient();
  const { data: status, status: statusStatus } = useQuery(
    queryKeys.status,
    getStatus
  );
  const { mutate: leave, status: leaveStatus } = useMutation(leaveRoom, {
    onSuccess: (status) => {
      queryClient.setQueryData(queryKeys.status, status);
    },
  });

  const copyRoomId = () => {
    if (status?.room) {
      navigator.clipboard.writeText(status.room.roomId);
    }
  };

  if (statusStatus === 'loading') {
    return <Loader />;
  }

  if (!status?.room) {
    throw new Error('How did you get here?');
  }

  if (leaveStatus === 'loading') {
    return <Loader loadingText="Leaving" />;
  }

  return (
    <div className="room-info">
      <div className="room-info__info">
        <p className="room-info__text">Room: {status.room.roomId}</p>
        <div className="room-info__count-box">
          <RoomIcon />
          <p className="room-info__count">{status.room.clientsCount}</p>
        </div>
        <CopyButton
          className="room-info__copy-button"
          aria-label="Copy to clipboard"
          onClick={copyRoomId}
        />
      </div>
      <p className="room-info__text">
        {status.isSynced ? 'Synced' : 'Not Synced'}
      </p>
      <Button type="button" onClick={() => leave()}>
        Leave Room
      </Button>
    </div>
  );
};
