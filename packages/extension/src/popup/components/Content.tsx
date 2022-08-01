import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import { getStatus } from '../lib/runtime/getStatus';
import { Loader } from './Loader';
import { RoomActions } from './RoomActions';
import { RoomInfo } from './RoomInfo';

export const Content = () => {
  const { data: status, status: statusStatus } = useQuery(
    queryKeys.status,
    getStatus
  );

  if (statusStatus === 'loading') {
    return <Loader />;
  }

  const isInRoom = status?.room !== undefined;

  return (
    <div className="content">{isInRoom ? <RoomInfo /> : <RoomActions />}</div>
  );
};
