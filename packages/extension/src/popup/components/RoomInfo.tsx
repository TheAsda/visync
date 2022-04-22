import { styled } from 'goober';
import { useData } from '../hooks/useData';
import { Button } from './Button';
import copyIcon from '../assets/CopyIcon.svg';
import roomIcon from '../assets/RoomIcon.svg';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'stretch',
  height: '100%',
  padding: '1rem 0',
  margin: '0 3rem',
});

const Text = styled('p')({
  fontSize: '1.2rem',
});

const Row = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  gap: '0.8rem',
  alignItems: 'center',
});

const RoomCountBox = styled('div')({
  aspectRatio: '1 / 1',
  width: '1.5rem',
  height: '1.5rem',
  position: 'relative',
});

const RoomCount = styled('p')({
  position: 'absolute',
  textAlign: 'center',
  bottom: 0,
  left: 0,
  right: 0,
});

const CopyButton = styled(Button)({
  width: '2rem',
  height: '2rem',
  padding: '0.2rem',
});

export const RoomInfo = () => {
  const { room, leaveRoom, isSynced } = useData();

  const copyRoomId = () => {
    if (!room) {
      return;
    }
    navigator.clipboard.writeText(room.roomId);
  };

  return (
    <Container>
      <Row>
        <Text>Room: {room?.roomId}</Text>
        <RoomCountBox>
          <img src={roomIcon} />
          <RoomCount>{room?.clientsCount}</RoomCount>
        </RoomCountBox>
        <CopyButton aria-label="Copy to clipboard" onClick={copyRoomId}>
          <img src={copyIcon} />
        </CopyButton>
      </Row>
      <Text>{isSynced ? 'Synced' : 'Not Synced'}</Text>
      <Button type="button" onClick={leaveRoom}>
        Leave Room
      </Button>
    </Container>
  );
};
