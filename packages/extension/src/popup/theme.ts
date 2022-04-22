import { createContext, useContext } from 'react';

const colors = {
  background: '#0F102F',
  primary: '#6F37D2',
  green: '#009B72',
  red: '#AC192C',
  text: '#D9F0FF',
};

const spacing = {
  sm: '0.5rem',
  md: '0.7rem',
};

const font = {
  family: "'Mulish', sans-serif",
  size: {
    base: '20px',
  },
};

export const theme = {
  colors,
  spacing,
  font,
};

type PopupTheme = typeof theme;

declare module 'goober' {
  export interface DefaultTheme extends PopupTheme {}
}

const ThemeContext = createContext(theme);

export const ThemeProvider = ThemeContext.Provider;
export const useTheme = () => useContext(ThemeContext);
