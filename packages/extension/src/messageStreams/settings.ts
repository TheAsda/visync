import { createEventStream } from '../lib/event-stream';
import { ClientSettings } from '../types/settings';

export const [settings$, sendSettings] =
  createEventStream<ClientSettings>('settings');
