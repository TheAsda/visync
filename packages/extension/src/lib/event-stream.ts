import { nanoid } from 'nanoid';
import { filter, fromEventPattern, map, shareReplay, tap } from 'rxjs';
import { runtime$, RuntimeEvent } from './runtime-stream';

type StreamEvent<Event = unknown> = {
  name: string;
  event: Event;
  __type: 'stream-event';
};

type SubEvent = StreamEvent<'SUB'>;

export type CreateEventStreamOptions<Message> = {};

const messageStream$ = runtime$.pipe(
  filter((event): event is RuntimeEvent<StreamEvent> =>
    isMessageStreamEvent(event.message)
  )
);

export const createEventStream = <Event = unknown>(
  name: string,
  options?: CreateEventStreamOptions<Event>
) => {
  const notifySub = () => {
    const subEvent: SubEvent = {
      name,
      event: 'SUB',
      __type: 'stream-event',
    };
    chrome.runtime.sendMessage(subEvent);
  };

  const stream$ = messageStream$.pipe(
    filter(({ message }) => message.name === name),
    map(({ message }) => message.event as Event),
    tap({
      subscribe: notifySub,
    }),
    shareReplay(1)
  );

  const subscribeToStream = (callback: (message: Event) => void) => {
    return stream$.subscribe(callback).unsubscribe;
  };

  const onSubscription = (callback: () => void) => {
    return messageStream$
      .pipe(
        filter(({ message }) => message.name === name),
        filter(({ message }) => message.event === 'SUB')
      )
      .subscribe(callback).unsubscribe;
  };

  /** Used to send message to stream from background */
  const sendToStream = (message: Event, tabId?: number) => {
    const streamEvent: StreamEvent<Event> = {
      name,
      event: message,
      __type: 'stream-event',
    };

    //TODO: figure out
    // if (tabId) {
    //   chrome.tabs.sendMessage(tabId, streamEvent);
    // } else {
    chrome.runtime.sendMessage(streamEvent);
    // }
  };

  return [subscribeToStream, sendToStream, onSubscription] as const;
};

function isMessageStreamEvent(message: unknown): message is StreamEvent {
  return (
    typeof message === 'object' &&
    message !== null &&
    '__type' in message &&
    message.__type === 'message-stream-event'
  );
}
