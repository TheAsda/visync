import { FormEventHandler, useRef, useState } from 'react';
import { createRoom } from '../lib/runtime/createRoom';
import { joinRoom } from '../lib/runtime/joinRoom';
import { getMessageError } from '../lib/getErrorMessage';
import { Button } from './Button';
import { ErrorMessage } from './ErrorMessage';
import { Input } from './Input';
import './RoomActions.css';

const [useErrorMessage, setMessageId] = getMessageError();

export const RoomActions = () => {
  const [roomId, setRoomId] = useState('');
  const latestActionRef = useRef<'join' | 'create' | undefined>(undefined);
  const errorMessage = useErrorMessage();

  const handleJoinForm: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const messageId = joinRoom(roomId);
    setMessageId(messageId);
    latestActionRef.current = 'join';
  };

  const create = () => {
    const messageId = createRoom();
    setMessageId(messageId);
    latestActionRef.current = 'create';
  };

  return (
    <div className="room-actions">
      <Button onClick={create} type="button">
        Create Room
      </Button>
      {latestActionRef.current === 'create' && (
        <ErrorMessage>{errorMessage}</ErrorMessage>
      )}
      <form className="join-form" onSubmit={handleJoinForm}>
        <Input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Room"
        />
        <Button type="submit" disabled={roomId.length === 0}>
          Join Room
        </Button>
        {latestActionRef.current === 'join' && (
          <ErrorMessage>{errorMessage}</ErrorMessage>
        )}
      </form>
    </div>
  );
};
