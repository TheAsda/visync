import { styled } from 'goober';
import { useRoom } from '../hooks/useRoom';
import { Loader } from './Loader';
import { RoomActions } from './RoomActions';
import { RoomInfo } from './RoomInfo';

const Container = styled('section')({});

export const Content = () => {
  const { isLoading, room, leaveRoom, createRoom, joinRoom } = useRoom();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Container>
      {room === null ? (
        <RoomActions onCreate={createRoom} onJoin={joinRoom} />
      ) : (
        <RoomInfo room={room} onLeave={leaveRoom} />
      )}
    </Container>
  );
};
