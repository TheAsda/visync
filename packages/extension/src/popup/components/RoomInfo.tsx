import { styled } from 'goober';
import { Room } from 'syncboii-contracts';
import { Button } from './Button';
import { CopyIcon } from './CopyIcon';
import { RoomIcon } from './RoomIcon';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'stretch',
  height: '100%',
  padding: '1rem 0',
  margin: '0 3rem',
});

const Room = styled('p')({
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

export interface RoomInfoProps {
  room: Room;
  onLeave: () => void;
}

export const RoomInfo = (props: RoomInfoProps) => {
  const copyRoomId = () => {
    navigator.clipboard.writeText(props.room.roomId);
  };

  return (
    <Container>
      <Row>
        <Room>Room: {props.room.roomId}</Room>
        <RoomCountBox>
          <RoomIcon />
          <RoomCount>{props.room.clientIds.length}</RoomCount>
        </RoomCountBox>
        <CopyButton aria-label="Copy to clipboard" onClick={copyRoomId}>
          <CopyIcon />
        </CopyButton>
      </Row>
      <Button type="button" onClick={props.onLeave}>
        Leave Room
      </Button>
    </Container>
  );
};
