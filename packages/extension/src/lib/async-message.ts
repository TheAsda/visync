import { filter, Observable, tap } from 'rxjs';

type AsyncCommandResponse<Response> =
  | {
      error: string;
    }
  | Response;

type AsyncCommandRequest<Request = unknown> = {
  name: string;
  payload: Request;
};

const runtime$ = new Observable<{
  message: AsyncCommandRequest;
  sender: chrome.runtime.MessageSender;
  sendResponse: (response?: any) => void;
}>((subscriber) => {
  const handler = (
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => {
    subscriber.next({ message, sender, sendResponse });
    return true;
  };
  chrome.runtime.onMessage.addListener(handler);
  return () => {
    chrome.runtime.onMessage.removeListener(handler);
  };
});

type AsyncCommandHandler<Request, Response> = (
  request: Request
) => Promise<Response>;

const registeredNames = new Set<string>();

export function createAsyncCommand<Request, Response>(name: string) {
  if (registeredNames.has(name)) {
    throw new Error(`Command ${name} already registered`);
  }
  registeredNames.add(name);

  const sendCommand = (request: Request) => {
    return new Promise<Response>((resolve, reject) => {
      chrome.runtime.sendMessage(
        { name, payload: request } satisfies AsyncCommandRequest<Request>,
        (response: AsyncCommandResponse<Response>) => {
          if (isErrorResponse(response)) {
            reject(response.error);
          } else {
            resolve(response);
          }
        }
      );
    });
  };

  const handleCommand = (handler: AsyncCommandHandler<Request, Response>) => {
    return runtime$
      .pipe(filter(({ message }) => message.name === name))
      .subscribe(({ message, sendResponse }) => {
        handler(message.payload as Request)
          .then((res) => sendResponse(res))
          .catch((err) => sendResponse({ error: err.message }));
      }).unsubscribe;
  };

  return [sendCommand, handleCommand] as const;
}

function isErrorResponse(response: unknown): response is { error: string } {
  return (
    typeof response === 'object' && response !== null && 'error' in response
  );
}
