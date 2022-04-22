import { styled } from 'goober';

export const Container = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  background: theme.colors.background,
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
}));
