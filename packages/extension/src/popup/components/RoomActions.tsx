import { styled } from 'goober';
import { FormEventHandler, useState } from 'react';
import { useData } from '../hooks/useData';
import { Button } from './Button';
import { Input } from './Input';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'stretch',
  height: '100%',
  padding: '1rem 0',
  margin: '0 3rem',
});

const JoinForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: theme.spacing.md,
}));

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
    <Container>
      <Button onClick={createRoom} type="button">
        Create Room
      </Button>
      <JoinForm onSubmit={handleJoinForm}>
        <Input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Room"
        />
        <Button type="submit">Join Room</Button>
      </JoinForm>
    </Container>
  );
};
