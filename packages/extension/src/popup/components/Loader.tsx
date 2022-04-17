import { keyframes, styled } from 'goober';
import { LogoBase } from '../../common/LogoBase';
import { theme } from '../../common/theme';

const spin = keyframes`
0% {
  transform: rotate(0deg);
}
50% {
  transform: rotate(360deg);
}
100% {
  transform: rotate(720deg);
}
`;

const SpinContainer = styled('div')({
  animation: `${spin} 2s cubic-bezier(0.4, 0, 0.2, 1) infinite reverse`,
  display: 'grid',
  placeItems: 'center',
  aspectRatio: '1 / 1',
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
      <SpinContainer>
        <LogoBase color={theme.colors.primary} />
      </SpinContainer>
    </Center>
  );
};
