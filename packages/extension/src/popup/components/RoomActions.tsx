import { FormEventHandler, useState } from 'react';
import { useData } from '../hooks/useData';
import { Button } from './Button';
import { Input } from './Input';
import './RoomActions.css';

export const RoomActions = () => {
  const { createRoom, joinRoom } = useData();

  const [roomId, setRoomId] = useState('');

  const handleJoinForm: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (roomId.length === 0) {
      return;
    }
    joinRoom(roomId);
  };

  return (
    <div className="room-actions">
      <Button onClick={createRoom} type="button">
        Create Room
      </Button>
      <form className="join-form" onSubmit={handleJoinForm}>
        <Input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Room"
        />
        <Button type="submit">Join Room</Button>
      </form>
    </div>
  );
};
