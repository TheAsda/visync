import { createRoot } from 'react-dom/client';
import { Syncer } from './components/Syncer';

const reactContainer = document.createElement('visync-container');
document.body.appendChild(reactContainer);
const root = createRoot(reactContainer);
root.render(<Syncer />);
