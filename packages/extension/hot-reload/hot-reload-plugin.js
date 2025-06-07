import { readFileSync } from 'fs';

const isDev = process.argv.includes('--watch');

const hotReloadScript = readFileSync('./hot-reload/hot-reload.js', 'utf8');

export function hotReloadPlugin() {
  let indexPath;

  if (isDev) {
    startWebSocket((_ws) => {
      globalThis.ws = _ws;
    });
  }

  return {
    name: 'hot-reload-plugin',
    buildStart(options) {
      indexPath = Array.isArray(options.input)
        ? options.input[0]
        : options.input[Object.keys(options.input)[0]];
      indexPath = normalizePath(indexPath);
    },
    transform(code, id) {
      if (!isDev) {
        return;
      }
      if (normalizePath(id).endsWith(indexPath)) {
        return {
          code: code + '\n' + hotReloadScript,
        };
      }
    },
    closeBundle() {
      if (!isDev) {
        return;
      }
      setTimeout(async () => {
        if (globalThis.ws) {
          console.log('Reloading extension');
          globalThis.ws.send('file-change');
        }
      }, 500);
    },
  };
}

function startWebSocket(callback) {
  if (globalThis.server) {
    return;
  }
  globalThis.server = Bun.serve({
    fetch(req, server) {
      if (server.upgrade(req)) {
        return;
      }
      return new Response('Upgrade failed', { status: 500 });
    },
    port: 8080,
    websocket: {
      message(message) {},
      open(ws) {
        console.log('Hot reload web socket opened');
        callback(ws);
      },
    },
  });
}

function normalizePath(path) {
  return path.replace(/\\/g, '/').replace(/^\/+/, '').replace(/\/+$/, '');
}
