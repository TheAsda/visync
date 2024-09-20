import { filter, Observable, tap } from 'rxjs';
import { runtime$, RuntimeEvent } from './runtime-stream';

type AsyncCommandResponse<Response> =
  | {
      error: string;
    }
  | Response;

type AsyncCommandRequest<Request = unknown> = {
  name: string;
  payload: Request;
  __type: 'async-command-request';
};

const asyncCommand$ = runtime$.pipe(
  filter((event): event is RuntimeEvent<AsyncCommandRequest> =>
    isAsyncCommandRequest(event.message)
  )
);

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
      const commandRequest: AsyncCommandRequest<Request> = {
        name,
        payload: request,
        __type: 'async-command-request',
      };
      chrome.runtime.sendMessage(
        commandRequest,
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
    return asyncCommand$
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

function isAsyncCommandRequest(
  message: unknown
): message is AsyncCommandRequest {
  return (
    typeof message === 'object' &&
    message !== null &&
    '__type' in message &&
    message.__type === 'async-command-request'
  );
}
