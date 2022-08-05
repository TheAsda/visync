import { getMessage } from '@extend-chrome/messages';
import { Client } from '../types/client';

export const [sendClient, clientStream, waitForClient] = getMessage<
  void,
  Client
>('client', { async: true });
