import { createGlobalStyles, glob } from 'goober/global';
import { theme } from './theme';

glob(
  "@import url('https://fonts.googleapis.com/css2?family=Mulish&display=swap');"
);

export const GlobalStyles = createGlobalStyles({
  '*, *::before, *::after': {
    boxSizing: 'border-box',
  },
  'html,body,#root': {
    width: '400px',
    height: '300px',
    fontSize: theme.font.size.base,
    fontFamily: theme.font.family,
    lineHeight: '1.5',
  },
  'img, picture, video, canvas, svg': {
    display: 'block',
    maxWidth: '100%',
  },
  'input, button, textarea, select': {
    font: 'inherit',
  },
  'p, h1, h2, h3, h4, h5, h6': {
    overflowWrap: 'break-word',
  },
  '*': {
    color: theme.colors.text,
    margin: 0,
  },
});
