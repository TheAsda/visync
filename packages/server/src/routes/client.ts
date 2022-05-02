import type { FastifyPluginAsync } from 'fastify';
import { ClientStatus, Room } from 'visync-contracts';
import { socketExists } from '../store/clientSocket';
import { getRoomByClientId } from '../store/rooms';

export const clientRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/client/:id/status', async (request, reply) => {
    const { id: clientId } = request.params as { id: string };

    let room: Room | undefined = undefined;
    try {
      room = getRoomByClientId(clientId);
    } catch {
      // Do nothing
    }

    const exists = await socketExists(clientId);

    const status: ClientStatus = {
      room: room,
      isSynced: exists,
    };

    reply.send(status);
  });
};
