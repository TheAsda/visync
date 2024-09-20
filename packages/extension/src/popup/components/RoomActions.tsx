import { useState } from 'react';
import useSWRMutation from 'swr/mutation';
import { createRoom } from '../../messageStreams/roomOperations';
import { Button } from './Button';
import { ErrorMessage } from './ErrorMessage';
import './RoomActions.css';

export const RoomActions = () => {
  const [roomId, setRoomId] = useState('');

  // const handleJoinForm: FormEventHandler<HTMLFormElement> = (e) => {
  //   e.preventDefault();
  //   const messageId = joinRoom(roomId);
  //   setMessageId(messageId);
  //   latestActionRef.current = 'join';
  // };

  // const create = () => {
  //   const messageId = createRoom();
  //   setMessageId(messageId);
  //   latestActionRef.current = 'create';
  // };

  return (
    <div className="room-actions">
      <CreateRoomButton />
      {/* <form className="join-form" onSubmit={handleJoinForm}>
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
      </form> */}
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
