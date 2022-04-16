import { Room } from 'syncboii-contracts';

export interface RoomInfoProps {
  room: Room;
  onLeave: () => void;
}

export const RoomInfo = (props: RoomInfoProps) => {
  return (
    <section>
      <h1>Room ID: {props.room.roomId}</h1>
      <button onClick={props.onLeave}>Leave</button>
    </section>
  );
};
