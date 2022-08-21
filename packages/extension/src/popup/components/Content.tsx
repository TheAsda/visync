import { bind } from '@react-rxjs/core';
import { map } from 'rxjs';
import { roomId$ } from '../../messageStreams/roomId';
import { getStatusOnSubscribe } from '../lib/getOnSubscribe';
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
    <div className="content">{roomId ? <RoomInfo /> : <RoomActions />}</div>
  );
};
