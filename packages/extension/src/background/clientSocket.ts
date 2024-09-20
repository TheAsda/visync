import { Treaty } from '@elysiajs/eden';
import { fromEventPattern, map } from 'rxjs';
import type { WebSocketEvent } from 'server/routes/socket';
import { apiClient } from './apiClient';

export const createClientSocket = (roomId: string, clientId: string) => {
  const socket = apiClient
    .rooms({ roomId })
    .socket.subscribe({ headers: { 'X-ClientId': clientId } });
  const messages$ = fromEventPattern<Treaty.WSEvent<'message', WebSocketEvent>>(
    (handler) => socket.addEventListener('message', handler),
    (handler) => socket.removeEventListener('message', handler)
  ).pipe(map(({ data }) => data));
  const send = (event: WebSocketEvent) => {
    socket.send(event);
  };
  return { messages$, send };
};
