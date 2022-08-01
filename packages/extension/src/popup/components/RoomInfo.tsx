import { useData } from '../hooks/useData';
import { Button } from './Button';
import CopyIcon from '../assets/CopyIcon.svg';
import RoomIcon from '../assets/RoomIcon.svg';
import CheckIcon from '../assets/CheckIcon.svg';
import { useEffect, useRef, useState } from 'react';
import './RoomInfo.css';

export const RoomInfo = () => {
  const { room, leaveRoom, isSynced } = useData();
  const [showCheck, setShowCheck] = useState(false);
  const timeoutRef = useRef<number>();

  const copyRoomId = () => {
    if (!room) {
      return;
    }
    navigator.clipboard.writeText(room.roomId);
    setShowCheck(true);
  };

  useEffect(() => {
    if (showCheck) {
      timeoutRef.current = setTimeout(
        () => setShowCheck(false),
        2000
      ) as unknown as number;
    }

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [showCheck]);

  return (
    <div className="room-info">
      <div className="room-info__info">
        <p className="room-info__text">Room: {room?.roomId}</p>
        <div className="room-info__count-box">
          <RoomIcon />
          <p className="room-info__count">{room?.clientsCount}</p>
        </div>
        <Button
          className="room-info__copy-button"
          aria-label="Copy to clipboard"
          onClick={copyRoomId}
        >
          {showCheck ? <CheckIcon /> : <CopyIcon />}
        </Button>
      </div>
      <p className="room-info__text">{isSynced ? 'Synced' : 'Not Synced'}</p>
      <Button type="button" onClick={leaveRoom}>
        Leave Room
      </Button>
    </div>
  );
};
