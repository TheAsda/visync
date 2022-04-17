export const serverHostname = '95.165.104.170';
export const serverPort = 7000;
export const serverUrl = `http://${serverHostname}:${serverPort}`;

export const fetcher = <R = void, B = void>(
  endpoint: string,
  body?: B
): Promise<R> => {
  const url = new URL(endpoint, serverUrl).toString();
  const headers: Record<string, string> = body
    ? { 'Content-Type': 'application/json' }
    : {};
  const method = body ? 'POST' : 'GET';

  return fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  }).then(async (res) => {
    if (!res.ok) {
      throw new Error('Request was not successful');
    }
    try {
      return await res.json();
    } catch (err) {
      return;
    }
  });
};
