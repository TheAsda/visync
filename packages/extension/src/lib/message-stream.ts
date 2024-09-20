import { nanoid } from 'nanoid';
import { filter, fromEventPattern, map, shareReplay, tap } from 'rxjs';
import { runtime$, RuntimeEvent } from './runtime-stream';

type MessageStreamEvent<Message = unknown> = {
  name: string;
  message: Message;
  __type: 'message-stream-event';
};

type SubEvent = MessageStreamEvent<'SUB'>;

export type CreateStreamOptions<Message> = {};

const messageStream$ = runtime$.pipe(
  filter((event): event is RuntimeEvent<MessageStreamEvent> =>
    isMessageStreamEvent(event.message)
  )
);

export const createMessageStream = <Message = unknown>(
  name: string,
  options?: CreateStreamOptions<Message>
) => {
  const stream$ = messageStream$.pipe(
    filter(({ message }) => message.name === name),
    map(({ message }) => message.message as Message),
    tap({
      subscribe: () =>
        chrome.runtime.sendMessage({
          name,
          message: 'SUB',
          __type: 'message-stream-event',
        } satisfies SubEvent),
    }),
    shareReplay(1)
  );

  const subscribeToStream = (callback: (message: Message) => void) => {
    return stream$.subscribe(callback).unsubscribe;
  };

  const subscribeToSub = (callback: () => void) => {
    return messageStream$
      .pipe(
        filter(({ message }) => message.name === name),
        filter(({ message }) => message.message === 'SUB')
      )
      .subscribe(callback).unsubscribe;
  };

  /** Used to send message to stream from background */
  const sendToStream = (message: Message, tabId?: number) => {
    const streamEvent: MessageStreamEvent<Message> = {
      name,
      message: message,
      __type: 'message-stream-event',
    };

    //TODO: figure out
    // if (tabId) {
    //   chrome.tabs.sendMessage(tabId, streamEvent);
    // } else {
    chrome.runtime.sendMessage(streamEvent);
    // }
  };

  return [subscribeToStream, sendToStream, subscribeToSub] as const;
};

function isMessageStreamEvent(message: unknown): message is MessageStreamEvent {
  return (
    typeof message === 'object' &&
    message !== null &&
    '__type' in message &&
    message.__type === 'message-stream-event'
  );
}
