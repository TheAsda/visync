import {
  catchError,
  filter,
  firstValueFrom,
  fromEvent,
  map,
  tap,
  timeout,
} from 'rxjs';
import { IS_CONTENT, IS_IFRAME } from './constants';
import { generateRandomId } from './randomId';

type WindowMessage<T> = {
  messageId: string;
  name: string;
  payload: T;
};

export type SendCommand<Request, Response> = (
  request: Request,
  iframe?: HTMLIFrameElement
) => Promise<Response>;
export type HandleCommand<Request, Response> = (
  handler: (request: Request) => Promise<Response>,
  iframe?: HTMLIFrameElement
) => () => void;

const message$ = fromEvent<MessageEvent>(window, 'message').pipe(
  map((e) => e.data),
  filter((message) => isWindowMessage(message))
);

const COMMAND_TIMEOUT = 2000;

export function createWindowCommand<Request = void, Response = void>(
  name: string
): [SendCommand<Request, Response>, HandleCommand<Request, Response>] {
  if (!IS_CONTENT) {
    throw new Error('Window command can only be created in content script');
  }
  const handleCommand: HandleCommand<Request, Response> = (handler, iframe) => {
    if (!IS_IFRAME && !iframe) {
      throw new Error(
        'Iframe must be specified for window event listening in main content script'
      );
    }
    const sub = message$
      .pipe(
        filter((message) => message.name === name),
        tap((message) => console.debug(`[Window] Handling message:`, message))
      )
      .subscribe(async (message) => {
        const response = await handler(message.payload as Request);
        const responseMessage: WindowMessage<Response> = {
          messageId: message.messageId,
          name: message.name,
          payload: response,
        };
        if (IS_IFRAME) {
          sendMessageToParent(responseMessage);
        } else {
          sendMessageToIframe(iframe!, responseMessage);
        }
      });
    return () => {
      sub.unsubscribe();
    };
  };
  const sendCommand: SendCommand<Request, Response> = (request, iframe) => {
    if (!IS_IFRAME && !iframe) {
      throw new Error(
        'To send message from the main content script you need to specify target iframe'
      );
    }
    const requestMessage: WindowMessage<Request> = {
      name,
      messageId: generateRandomId(),
      payload: request,
    };
    const response = firstValueFrom(
      message$.pipe(
        filter(
          (message): message is WindowMessage<Response> =>
            message.messageId === requestMessage.messageId
        ),
        tap((message) => console.debug(`[Window] Got response`, message)),
        map((message) => message.payload),
        timeout(COMMAND_TIMEOUT)
      )
    );
    if (IS_IFRAME) {
      sendMessageToParent(requestMessage);
    } else {
      sendMessageToIframe(iframe!, requestMessage);
    }
    return response;
  };
  return [sendCommand, handleCommand];
}

function sendMessageToIframe<T>(
  iframe: HTMLIFrameElement,
  message: WindowMessage<T>
) {
  if (!iframe.contentWindow) {
    throw new Error('Failed to post message to iframe');
  }
  iframe.contentWindow.postMessage(message, '*');
}

function sendMessageToParent<T>(message: WindowMessage<T>) {
  window.parent.postMessage(message, '*');
}

function isWindowMessage<T>(message: unknown): message is WindowMessage<T> {
  return typeof message === 'object' && message !== null && 'name' in message;
}
