import { setup } from 'goober';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { Syncer } from './components/Syncer';

setup(createElement);
const reactContainer = document.createElement('visync-container');
document.body.appendChild(reactContainer);
const root = createRoot(reactContainer);
root.render(<Syncer />);
