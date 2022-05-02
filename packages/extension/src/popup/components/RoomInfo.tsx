import { styled } from 'goober';
import { useData } from '../hooks/useData';
import { Button } from './Button';
import CopyIcon from '../assets/CopyIcon.svg';
import RoomIcon from '../assets/RoomIcon.svg';
import CheckIcon from '../assets/CheckIcon.svg';
import { useEffect, useRef, useState } from 'react';
import { logger } from '../../runtimeLogger';

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
  textAlign: 'center',
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
  fontSize: '0.9rem',
});

const CopyButton = styled(Button)({
  width: '2rem',
  height: '2rem',
  padding: '0.2rem',
});

export const RoomInfo = () => {
  const { room, leaveRoom, isSynced } = useData();
  const [showCheck, setShowCheck] = useState(false);
  const timeoutRef = useRef<number>();

  const copyRoomId = () => {
    if (!room) {
      return;
    }
    logger.debug(`Copy ${room.roomId} to clipboard`);
    navigator.clipboard.writeText(room.roomId);
    setShowCheck(true);
  };

  useEffect(() => {
    if (showCheck) {
      timeoutRef.current = setTimeout(
        () => setShowCheck(false),
        2000
      ) as unknown as number;
    }

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [showCheck]);

  return (
    <Container>
      <Row>
        <Text>Room: {room?.roomId}</Text>
        <RoomCountBox>
          <RoomIcon />
          <RoomCount>{room?.clientsCount}</RoomCount>
        </RoomCountBox>
        <CopyButton aria-label="Copy to clipboard" onClick={copyRoomId}>
          {showCheck ? <CheckIcon /> : <CopyIcon />}
        </CopyButton>
      </Row>
      <Text>{isSynced ? 'Synced' : 'Not Synced'}</Text>
      <Button type="button" onClick={leaveRoom}>
        Leave Room
      </Button>
    </Container>
  );
};
