import { map, share, Subject, switchMap } from 'rxjs';
import makeWebSocketObservable from 'rxjs-websockets';
import { SocketRequest } from 'visync-contracts';
import { serverUrl } from './url';

const address = serverUrl.replace('http', 'ws');

export const createClientSocket = (roomId: string, clientId: string) => {
  const socketAddress = `${address}/rooms/${roomId}/socket?clientId=${clientId}`;
  const socket$ = makeWebSocketObservable<string>(socketAddress);
  const socketInput$ = new Subject<SocketRequest>();
  const messages$ = socket$.pipe(
    switchMap((getResponses) => {
      return getResponses(
        socketInput$.pipe(map((request) => JSON.stringify(request)))
      );
    }),
    share()
  );
  return {
    socketInput$,
    messages$,
  };
};
