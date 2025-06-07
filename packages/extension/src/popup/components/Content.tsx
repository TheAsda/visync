import { Subscribe } from '@react-rxjs/core';
import useSWR from 'swr';
import { getRoomId } from '../commands/roomId';
import { Loader } from './Loader';
import { RoomActions } from './RoomActions';
import { RoomInfo } from './RoomInfo';

export const Content = () => {
  const { data: roomId } = useSWR('room-id', getRoomId, { suspense: true });

  return (
    <div className="content">
      <Subscribe fallback={<Loader loadingText="Loading room" />}>
        {roomId ? <RoomInfo roomId={roomId} /> : <RoomActions />}
      </Subscribe>
    </div>
  );
};
