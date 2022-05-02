import { setup } from 'goober';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { logger } from '../runtimeLogger';
import { Syncer } from './components/Syncer';

setup(createElement);
const reactContainer = document.createElement('visync-container');
document.body.appendChild(reactContainer);
logger.debug('Created syncer container');
const root = createRoot(reactContainer);
root.render(<Syncer />);
logger.debug('Rendered syncer into container');
