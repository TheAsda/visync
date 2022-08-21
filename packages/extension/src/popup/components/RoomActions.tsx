import { FormEventHandler, useState } from 'react';
import { sendCommand } from '../../messageStreams/command';
import { createRoom } from '../lib/runtime/createRoom';
import { joinRoom } from '../lib/runtime/joinRoom';
import { Button } from './Button';
import { ErrorMessage } from './ErrorMessage';
import { Input } from './Input';
import { Loader } from './Loader';
import './RoomActions.css';

export const RoomActions = () => {
  const [roomId, setRoomId] = useState('');

  const handleJoinForm: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    joinRoom(roomId);
  };

  return (
    <div className="room-actions">
      <Button onClick={createRoom} type="button">
        Create Room
      </Button>
      {/* <ErrorMessage>
        {createError instanceof Error ? createError.message : null}
      </ErrorMessage> */}
      <form className="join-form" onSubmit={handleJoinForm}>
        <Input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Room"
        />
        <Button type="submit" disabled={roomId.length === 0}>
          Join Room
        </Button>
        {/* <ErrorMessage>
          {joinError instanceof Error ? joinError.message : null}
        </ErrorMessage> */}
      </form>
    </div>
  );
};
