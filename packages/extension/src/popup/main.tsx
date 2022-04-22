import { createRoot } from 'react-dom/client';
import { App } from './App';
import { setup } from 'goober';
import { createElement } from 'react';
import { ThemeProvider, useTheme } from './theme';
import { DataProvider } from './hooks/useData';
import { GlobalStyles } from './globalStyles';

setup(createElement, undefined, useTheme);
const container = document.createElement('div');
container.id = 'root';
document.body.appendChild(container);
const root = createRoot(container!);
root.render(
  <ThemeProvider>
    <GlobalStyles />
    <DataProvider>
      <App />
    </DataProvider>
  </ThemeProvider>
);
