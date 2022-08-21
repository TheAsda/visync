import { combineLatestWith, map, Observable, Subject } from 'rxjs';

export const statusTrigger$ = new Subject<void>();

export const withStatusTrigger = <T>(
  observable: Observable<T>
): Observable<T> =>
  observable.pipe(
    combineLatestWith(statusTrigger$),
    map(([value]) => value)
  );

export const trigger = () => statusTrigger$.next();
