import { useState } from 'react';
import useSWRMutation from 'swr/mutation';
import { createRoom, joinRoom } from '../commands/roomOperations';
import { Button } from './Button';
import { ErrorMessage } from './ErrorMessage';
import { Input } from './Input';
import './RoomActions.css';

export const RoomActions = () => {
  return (
    <div className="room-actions">
      <CreateRoomButton />
      <JoinRoomForm />
    </div>
  );
};

const CreateRoomButton = () => {
  const { trigger, error, isMutating } = useSWRMutation(
    'room-id',
    () => createRoom(),
    { populateCache: (roomId) => roomId, revalidate: false }
  );

  return (
    <>
      <Button onClick={() => trigger()} isLoading={isMutating}>
        Create Room
      </Button>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </>
  );
};

const JoinRoomForm = () => {
  const [roomId, setRoomId] = useState('');
  const { trigger, isMutating, error } = useSWRMutation(
    'room-id',
    (_, { arg }: { arg: string }) => joinRoom(arg),
    { populateCache: (roomId) => roomId, revalidate: false }
  );

  return (
    <form
      className="join-form"
      onSubmit={(e) => {
        e.preventDefault();
        trigger(roomId);
      }}
    >
      <Input
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Room"
      />
      <Button
        type="submit"
        disabled={roomId.length === 0}
        isLoading={isMutating}
      >
        Join Room
      </Button>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </form>
  );
};
