import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormEventHandler, useState } from 'react';
import { queryKeys } from '../lib/queryKeys';
import { createRoom } from '../lib/runtime/createRoom';
import { joinRoom } from '../lib/runtime/joinRoom';
import { Button } from './Button';
import { Input } from './Input';
import { Loader } from './Loader';
import './RoomActions.css';

export const RoomActions = () => {
  const [roomId, setRoomId] = useState('');
  const queryClient = useQueryClient();
  const { mutate: create, status: createStatus } = useMutation(createRoom, {
    onSuccess: (status) => {
      queryClient.setQueryData(queryKeys.status, status);
    },
  });
  const { mutate: join, status: joinStatus } = useMutation(
    () => joinRoom(roomId),
    {
      onSuccess: (status) => {
        queryClient.setQueryData(queryKeys.status, status);
      },
    }
  );

  const handleJoinForm: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    join();
  };

  if (createStatus === 'loading') {
    return <Loader loadingText="Creating room..." />;
  }

  if (joinStatus === 'loading') {
    return <Loader loadingText="Joining room..." />;
  }

  return (
    <div className="room-actions">
      <Button onClick={() => create()} type="button">
        Create Room
      </Button>
      <form className="join-form" onSubmit={handleJoinForm}>
        <Input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Room"
        />
        <Button type="submit" disabled={roomId.length === 0}>
          Join Room
        </Button>
      </form>
    </div>
  );
};
