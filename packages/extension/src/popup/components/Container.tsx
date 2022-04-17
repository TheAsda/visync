import { styled } from 'goober';
import { theme } from '../../common/theme';

export const Container = styled('div')({
  width: '100%',
  height: '100%',
  background: theme.colors.background,
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
});
