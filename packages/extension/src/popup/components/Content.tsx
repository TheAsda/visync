import { bind, Subscribe } from '@react-rxjs/core';
import { map } from 'rxjs';
import { roomId$ } from '../../messageStreams/roomId';
import { getStatusOnSubscribe } from '../lib/getOnSubscribe';
import { Loader } from './Loader';
import { RoomActions } from './RoomActions';
import { RoomInfo } from './RoomInfo';

const [useRoomId] = bind(
  roomId$.pipe(
    getStatusOnSubscribe,
    map(({ message }) => message)
  )
);

export const Content = () => {
  const roomId = useRoomId();

  return (
    <div className="content">
      <Subscribe fallback={<Loader loadingText="Loading room" />}>
        {roomId ? <RoomInfo /> : <RoomActions />}
      </Subscribe>
    </div>
  );
};
