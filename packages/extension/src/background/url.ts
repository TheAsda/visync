export const serverProtocol = process.env.SERVER_PROTOCOL ?? 'http';
export const serverHostname = process.env.SERVER_HOSTNAME ?? '127.0.0.1';
export const serverPort = process.env.SERVER_PORT ?? 7001;
export const serverUrl = `${serverProtocol}://${serverHostname}:${serverPort}`;

export const getUrl = (path: string) => new URL(path, serverUrl);
