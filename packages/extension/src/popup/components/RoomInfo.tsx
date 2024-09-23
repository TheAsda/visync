import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { getRoomInfo } from '../commands/roomInfo';
import { leaveRoom } from '../commands/roomOperations';
import RoomIcon from '../assets/RoomIcon.svg';
import { Button } from './Button';
import { CopyButton } from './CopyButton';
import { ErrorMessage } from './ErrorMessage';
import './RoomInfo.css';
import { VideoSelector } from './VideoSelector';

export interface RoomInfoProps {
  roomId: string;
}

export const RoomInfo = (props: RoomInfoProps) => {
  const { roomId } = props;

  const {
    data: roomInfo,
    isLoading,
    error,
  } = useSWR(['room', roomId], ([_, roomId]) => getRoomInfo(roomId));

  const { isMutating, trigger } = useSWRMutation(
    'room-id',
    () => leaveRoom(roomId),
    {
      populateCache: () => undefined,
    }
  );

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
  };

  return (
    <div className="room-info">
      <div className="room-info__info">
        <p className="room-info__text">Room: {roomId}</p>
        <div className="room-info__count-box">
          <RoomIcon />
          <p className="room-info__count">{roomInfo?.clients.length}</p>
        </div>
        <CopyButton
          className="room-info__copy-button"
          aria-label="Copy to clipboard"
          onClick={copyRoomId}
        />
      </div>
      {/* <p className="room-info__text">{isSynced ? 'Synced' : 'Not Synced'}</p> */}
      <Button type="button" onClick={() => trigger()} isLoading={isMutating}>
        Leave Room
      </Button>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <VideoSelector />
    </div>
  );
};
