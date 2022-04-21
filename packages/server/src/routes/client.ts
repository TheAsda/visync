import type { FastifyPluginAsync } from 'fastify';
import { ClientStatus } from 'syncboii-contracts';
import { socketExistsAndAlive } from '../store/clientSocket';
import { getRoomByClientId } from '../store/rooms';

export const clientRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/client/:id/status', async (request, reply) => {
    const { id: clientId } = request.params as { id: string };

    let isInRoom: boolean;
    let roomId: string | undefined = undefined;
    try {
      const room = getRoomByClientId(clientId);
      roomId = room.roomId;
      isInRoom = true;
    } catch {
      isInRoom = false;
    }

    const exists = await socketExistsAndAlive(clientId);

    const status: ClientStatus = {
      isInRoom,
      roomId,
      isSynced: exists,
    };

    reply.send(status);
  });
};
