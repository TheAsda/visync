import { createMessageStream } from '../lib/runtime';
import { ClientSettings } from '../types/settings';

export const [settings$, sendSettings] =
  createMessageStream<ClientSettings>('settings');
