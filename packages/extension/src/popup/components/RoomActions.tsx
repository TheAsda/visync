import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormEventHandler, useState } from 'react';
import { Client } from '../../types/client';
import { queryKeys } from '../lib/queryKeys';
import { createRoom } from '../lib/runtime/createRoom';
import { joinRoom } from '../lib/runtime/joinRoom';
import { Button } from './Button';
import { ErrorMessage } from './ErrorMessage';
import { Input } from './Input';
import { Loader } from './Loader';
import './RoomActions.css';

export const RoomActions = () => {
  const [roomId, setRoomId] = useState('');
  const queryClient = useQueryClient();
  const {
    mutate: create,
    status: createStatus,
    error: createError,
  } = useMutation(createRoom, {
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
  const {
    mutate: join,
    status: joinStatus,
    error: joinError,
  } = useMutation(() => joinRoom(roomId), {
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
      <ErrorMessage>
        {createError instanceof Error ? createError.message : null}
      </ErrorMessage>
      <form className="join-form" onSubmit={handleJoinForm}>
        <Input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Room"
        />
        <Button type="submit" disabled={roomId.length === 0}>
          Join Room
        </Button>
        <ErrorMessage>
          {joinError instanceof Error ? joinError.message : null}
        </ErrorMessage>
      </form>
    </div>
  );
};
