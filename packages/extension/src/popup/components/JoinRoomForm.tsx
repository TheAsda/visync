import { FormEventHandler, useState } from 'react';

export interface JoinRoomFormProps {
  onJoin: (link: string) => void;
}

export const JoinRoomForm = (props: JoinRoomFormProps) => {
  const [roomId, setRoomId] = useState('');

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    props.onJoin(roomId);
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Room ID"
      />
      <button>Join</button>
    </form>
  );
};
