import { styled } from 'goober';
import { theme } from '../../common/theme';

export const Button = styled('button')({
  background: theme.colors.primary,
  borderRadius: theme.spacing.sm,
  boxShadow: '1px 1px 4px 1px rgba(217, 240, 255, 0.25)',
  border: 'none',
  padding: theme.spacing.sm,
  fontSize: 'inherit',
  cursor: 'pointer',
  '&:hover': {
    filter: 'brightness(80%)',
  },
  '&:focus': {
    outline: `1px solid ${theme.colors.text}`,
  },
  '&:active': {
    filter: 'brightness(60%)',
  },
});
