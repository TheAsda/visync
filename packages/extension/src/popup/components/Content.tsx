import { styled } from 'goober';
import { useData } from '../hooks/useData';
import { Loader } from './Loader';
import { RoomActions } from './RoomActions';
import { RoomInfo } from './RoomInfo';

const Container = styled('section')({});

export const Content = () => {
  const { isLoading, room } = useData();

  if (isLoading) {
    return <Loader />;
  }

  return <Container>{!room ? <RoomActions /> : <RoomInfo />}</Container>;
};
