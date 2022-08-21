import { bind } from '@react-rxjs/core';
import { map } from 'rxjs';
import { isSynced$ } from '../../messageStreams/isSynced';
import { roomId$ } from '../../messageStreams/roomId';
import RoomIcon from '../assets/RoomIcon.svg';
import { getStatusOnSubscribe } from '../lib/getOnSubscribe';
import { leaveRoom } from '../lib/runtime/leaveRoom';
import { Button } from './Button';
import { CopyButton } from './CopyButton';
import './RoomInfo.css';

const [useRoomId] = bind(
  roomId$.pipe(
    getStatusOnSubscribe,
    map(({ message }) => message)
  )
);
const [useIsSynced] = bind(
  isSynced$.pipe(
    getStatusOnSubscribe,
    map(({ message }) => message)
  )
);

export const RoomInfo = () => {
  const roomId = useRoomId();
  const isSynced = useIsSynced();

  const copyRoomId = () => {
    roomId && navigator.clipboard.writeText(roomId);
  };

  return (
    <div className="room-info">
      <div className="room-info__info">
        <p className="room-info__text">Room: {roomId}</p>
        <div className="room-info__count-box">
          <RoomIcon />
          <p className="room-info__count">{1}</p>
        </div>
        <CopyButton
          className="room-info__copy-button"
          aria-label="Copy to clipboard"
          onClick={copyRoomId}
        />
      </div>
      <p className="room-info__text">{isSynced ? 'Synced' : 'Not Synced'}</p>
      <Button type="button" onClick={leaveRoom}>
        Leave Room
      </Button>
      {/* <ErrorMessage>
        {leaveError instanceof Error ? leaveError.message : null}
      </ErrorMessage> */}
    </div>
  );
};
