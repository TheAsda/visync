import { bind } from '@react-rxjs/core';
import { map } from 'rxjs';
import { isSynced$ } from '../../messageStreams/isSynced';
import { roomId$ } from '../../messageStreams/roomId';
import RoomIcon from '../assets/RoomIcon.svg';
import { getStatusOnSubscribe } from '../lib/getOnSubscribe';
import { leaveRoom } from '../lib/runtime/leaveRoom';
import { getMessageError } from '../lib/getErrorMessage';
import { Button } from './Button';
import { CopyButton } from './CopyButton';
import './RoomInfo.css';
import { ErrorMessage } from './ErrorMessage';

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

const [useErrorMessage, setMessageId] = getMessageError();

export const RoomInfo = () => {
  const roomId = useRoomId();
  const isSynced = useIsSynced();
  const errorMessage = useErrorMessage();

  const copyRoomId = () => {
    roomId && navigator.clipboard.writeText(roomId);
  };

  const leave = () => {
    const messageId = leaveRoom();
    setMessageId(messageId);
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
      <Button type="button" onClick={leave}>
        Leave Room
      </Button>
      <ErrorMessage>{errorMessage}</ErrorMessage>
    </div>
  );
};
