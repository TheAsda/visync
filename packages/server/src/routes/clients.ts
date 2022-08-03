import type { FastifyPluginAsync } from 'fastify';
import { ClientStatus, Room } from 'visync-contracts';
import { socketExists } from '../store/clientSocket';
import { getRoomByClientId } from '../store/rooms';

export const clientsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/clients/:clientId/register', async (request, reply) => {
    const { clientId } = request.params as { clientId: string };
    
  });

  fastify.get('/clients/:clientId/status', async (request, reply) => {
    const { clientId } = request.params as { clientId: string };

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
