import { keyframes, styled } from 'goober';
import LogoLoader from '../assets/LogoLoader.svg';

const spin = keyframes`
0% {
  transform: rotate(0deg) scale(1);
}
50% {
  transform: rotate(180deg) scale(0.8);
}
100% {
  transform: rotate(360deg) scale(1);
}
`;

const Image = styled(LogoLoader)({
  animation: `${spin} 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite reverse`,
  width: '70px',
});

const Center = styled('div')({
  width: '100%',
  height: '100%',
  display: 'grid',
  placeItems: 'center',
});

export const Loader = () => {
  return (
    <Center>
      <Image />
    </Center>
  );
};
