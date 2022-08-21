import { bind } from '@react-rxjs/core';
import { createSignal } from '@react-rxjs/utils';
import { filter, map, startWith, switchMap } from 'rxjs';
import { error$ } from '../../messageStreams/error';

export const getMessageError = () => {
  const [messageId$, setMessageId] = createSignal<string>();
  const [useErrorMessage] = bind(
    messageId$.pipe(
      switchMap((messageId) =>
        error$.pipe(filter((error) => error.message.messageId === messageId))
      ),
      map((error) => error.message.message),
      startWith(undefined)
    )
  );
  return [useErrorMessage, setMessageId] as const;
};
