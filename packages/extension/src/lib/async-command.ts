import { filter, Observable, tap } from 'rxjs';
import { runtime$, RuntimeMessage } from './runtime-stream';

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
  filter((event): event is RuntimeMessage<AsyncCommandRequest> =>
    isAsyncCommandRequest(event.message)
  )
);

type AsyncCommandHandler<Request, Response> = (
  request: Request
) => Promise<Response>;

const registeredNames = new Set<string>();

export interface CreateAsyncCommandOptions {
  /** If true then command will call the content script in active tab */
  activeTab?: boolean;
}

export function createAsyncCommand<Request = void, Response = void>(
  name: string,
  options: CreateAsyncCommandOptions = {}
) {
  const { activeTab = false } = options;
  if (registeredNames.has(name)) {
    throw new Error(`Command ${name} already registered`);
  }
  registeredNames.add(name);

  const sendCommand = (request: Request): Promise<Response> => {
    const commandRequest: AsyncCommandRequest<Request> = {
      name,
      payload: request,
      __type: 'async-command-request',
    };
    if (activeTab) {
      return sendMessageToActiveTab(commandRequest);
    }
    return sendMessage(commandRequest);
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

function sendMessage<Request, Response>(request: AsyncCommandRequest<Request>) {
  return new Promise<Response>((resolve, reject) => {
    chrome.runtime.sendMessage(
      request,
      (response: AsyncCommandResponse<Response>) => {
        if (isErrorResponse(response)) {
          reject(response.error);
        } else {
          resolve(response);
        }
      }
    );
  });
}

function sendMessageToActiveTab<Request, Response>(
  request: AsyncCommandRequest<Request>
) {
  return new Promise<Response>((resolve, reject) => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        reject('No active tab found');
        return;
      }
      chrome.tabs.sendMessage(
        tabs[0].id!,
        request,
        (response: AsyncCommandResponse<Response>) => {
          if (isErrorResponse(response)) {
            reject(response.error);
          } else {
            resolve(response);
          }
        }
      );
    });
  });
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
