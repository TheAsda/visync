import { createMessageStream } from '../lib/message-stream';
import { ClientSettings } from '../types/settings';

export const [settings$, sendSettings] =
  createMessageStream<ClientSettings>('settings');
