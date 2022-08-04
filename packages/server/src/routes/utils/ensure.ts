import { preHandlerAsyncHookHandler, preHandlerHookHandler } from 'fastify';
import { clientExists } from '../../store/utils/client.js';
import { roomExists } from '../../store/utils/room.js';

export const ensureClientIdFromParams: preHandlerAsyncHookHandler = async (
  request,
  reply
) => {
  const { clientId } = request.params as { clientId: string };
  if (!(await clientExists(request.server.knex, clientId))) {
    reply
      .code(404)
      .send({
        error: `Client ${clientId} not found`,
      })
      .hijack();
    return;
  }
};

export const ensureRoomIdFromParams: preHandlerAsyncHookHandler = async (
  request,
  reply
) => {
  const { roomId } = request.params as { roomId: string };
  if (!(await roomExists(request.server.knex, roomId))) {
    reply
      .code(404)
      .send({
        error: `Room ${roomId} not found`,
      })
      .hijack();
    return;
  }
};

export const ensureClientIdFromBody: preHandlerAsyncHookHandler = async (
  request,
  reply
) => {
  const { clientId } = request.body as { clientId: string };
  if (!(await clientExists(request.server.knex, clientId))) {
    reply
      .code(400)
      .send({
        error: `Client ${clientId} does not exist`,
      })
      .hijack();
    return;
  }
};

export const ensureRoomIdFromBody: preHandlerAsyncHookHandler = async (
  request,
  reply
) => {
  const { roomId } = request.body as { roomId: string };
  if (!(await roomExists(request.server.knex, roomId))) {
    reply
      .code(400)
      .send({
        error: `Room ${roomId} does not exist`,
      })
      .hijack();
    return;
  }
};
