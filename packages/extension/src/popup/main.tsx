import { createRoot } from 'react-dom/client';
import { App } from './App';
import { DataProvider } from './hooks/useData';
import './reset.css';
import './common.css';

const container = document.createElement('div');
container.id = 'root';
document.body.appendChild(container);
const root = createRoot(container!);
root.render(
  <DataProvider>
    <App />
  </DataProvider>
);
