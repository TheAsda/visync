import { styled } from 'goober';
import { theme } from '../../common/theme';

export const Input = styled('input')({
  appearance: 'none',
  background: 'transparent',
  fontSize: 'inherit',
  color: 'inherit',
  boxShadow: '1px 1px 4px 1px rgba(217, 240, 255, 0.25)',
  borderRadius: theme.spacing.sm,
  border: 'none',
  padding: theme.spacing.sm,
  '&:hover': {
    outline: `1px solid ${theme.colors.text}`,
  },
});
