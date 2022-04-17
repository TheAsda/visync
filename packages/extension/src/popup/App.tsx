import { Logo } from '../common/Logo';
import { Container } from './components/Container';
import { CreateRoomForm } from './components/CreateRoomForm';
import { JoinRoomForm } from './components/JoinRoomForm';
import { Loader } from './components/Loader';
import { RoomInfo } from './components/RoomInfo';
import { GlobalStyles } from './globalStyles';
import { useRoom } from './hooks/useRoom';

export const App = () => {
  const { room, isLoading, createRoom, joinRoom, leaveRoom } = useRoom();

  return (
    <Container>
      <GlobalStyles />
      {isLoading ? (
        <Loader />
      ) : room === null ? (
        <section>
          <CreateRoomForm onCreate={createRoom} />
          <JoinRoomForm onJoin={joinRoom} />
        </section>
      ) : (
        <RoomInfo room={room} onLeave={leaveRoom} />
      )}
    </Container>
  );
};
