import { useData } from '../hooks/useData';
import { Loader } from './Loader';
import { RoomActions } from './RoomActions';
import { RoomInfo } from './RoomInfo';

export const Content = () => {
  const { isLoading, room } = useData();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="content">{!room ? <RoomActions /> : <RoomInfo />}</div>
  );
};
