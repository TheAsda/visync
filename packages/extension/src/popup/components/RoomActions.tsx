import { styled } from 'goober';
import { FormEventHandler, useState } from 'react';
import { theme } from '../../common/theme';
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

const JoinForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: theme.spacing.md,
});

export interface RoomActionsProps {
  onCreate: () => void;
  onJoin: (roomId: string) => void;
}

export const RoomActions = (props: RoomActionsProps) => {
  const [roomId, setRoomId] = useState('');

  const handleJoinForm: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (roomId.length === 0) {
      return;
    }
    props.onJoin(roomId);
  };

  return (
    <Container>
      <Button onClick={props.onCreate} type="button">
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
