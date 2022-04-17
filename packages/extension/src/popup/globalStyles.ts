import { createGlobalStyles, glob } from 'goober/global';
import { theme } from '../common/theme';

glob(
  "@import url('https://fonts.googleapis.com/css2?family=Mulish&display=swap');"
);

export const GlobalStyles = createGlobalStyles({
  'html,body,#root': {
    width: '400px',
    height: '300px',
    fontSize: theme.font.size.base,
    fontFamily: "'Mulish', sans-serif",
  },
  '*': {
    boxSizing: 'border-box',
    color: theme.colors.text,
    margin: 0,
  },
});
