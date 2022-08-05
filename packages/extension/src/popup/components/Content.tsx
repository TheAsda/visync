import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import { getClient } from '../lib/runtime/getClient';
import { Loader } from './Loader';
import { RoomActions } from './RoomActions';
import { RoomInfo } from './RoomInfo';

export const Content = () => {
  const { data: client, status: clientStatus } = useQuery(
    queryKeys.client,
    getClient
  );

  if (clientStatus === 'loading') {
    return <Loader />;
  }

  const isInRoom = client?.roomId !== undefined;

  return (
    <div className="content">{isInRoom ? <RoomInfo /> : <RoomActions />}</div>
  );
};
