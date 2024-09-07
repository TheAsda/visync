import { Observable, tap } from 'rxjs';
import { sendCommand } from '../../messageStreams/command';

export const getStatusOnSubscribe = <T>(
  observable: Observable<T>
): Observable<T> =>
  observable.pipe(
    tap({ subscribe: () => sendCommand({ type: 'get-status' }) })
  );
