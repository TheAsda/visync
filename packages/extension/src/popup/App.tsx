import { CreateRoomForm } from './components/CreateRoomForm';
import { JoinRoomForm } from './components/JoinRoomForm';
import { RoomInfo } from './components/RoomInfo';
import { useRoom } from './hooks/useRoom';

export const App = () => {
  const { room, isLoading, createRoom, joinRoom, leaveRoom } = useRoom();

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : room === null ? (
        <section>
          <CreateRoomForm onCreate={createRoom} />
          <JoinRoomForm onJoin={joinRoom} />
        </section>
      ) : (
        <RoomInfo room={room} onLeave={leaveRoom} />
      )}
    </div>
  );
};
