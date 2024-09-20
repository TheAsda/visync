import { Observable, tap } from 'rxjs';
import { sendCommand } from '../../messageStreams/command';

export const callOnSubscribe =
  (callback: () => void) =>
  <T>(observable: Observable<T>): Observable<T> =>
    observable.pipe(tap({ subscribe: callback }));
