import test from 'ava';
import { nanoid } from 'nanoid';
import {
  CreateRoomRequest,
  JoinRoomRequest,
  LeaveRoomRequest,
} from 'visync-contracts';
import server from '../src/server.js';

const registerClient = async () => {
  const clientId = nanoid(6);
  await server.inject().put(`/clients/${clientId}`);
  return clientId;
};

test('Create room', async (t) => {
  const roomId = nanoid(6);
  const clientId = await registerClient();
  const response = await server
    .inject()
    .put(`/rooms/${roomId}`)
    .body({
      clientId,
    } as CreateRoomRequest);
  t.is(response.statusCode, 201);
  t.is(response.json().roomId, roomId);
});

test('Room does not exist on create', async (t) => {
  const roomId = nanoid(6);
  const response = await server
    .inject()
    .put(`/rooms/${roomId}`)
    .body({
      clientId: nanoid(6),
    } as CreateRoomRequest);
  t.is(response.statusCode, 400);
});

test('Room already exists on create', async (t) => {
  const roomId = nanoid(6);
  const clientId = await registerClient();
  await server
    .inject()
    .put(`/rooms/${roomId}`)
    .body({
      clientId,
    } as CreateRoomRequest);
  const clientId2 = await registerClient();
  const response = await server
    .inject()
    .put(`/rooms/${roomId}`)
    .body({
      clientId: clientId2,
    } as CreateRoomRequest);
  t.is(response.statusCode, 400);
});

test('Join room', async (t) => {
  const roomId = nanoid(6);
  const clientId = await registerClient();
  await server
    .inject()
    .put(`/rooms/${roomId}`)
    .body({
      clientId,
    } as CreateRoomRequest);
  const clientId2 = await registerClient();
  const response = await server
    .inject()
    .post(`/rooms/${roomId}/join`)
    .body({
      clientId: clientId2,
    } as JoinRoomRequest);
  t.is(response.statusCode, 200);
});

test('Client does not exist on join', async (t) => {
  const roomId = nanoid(6);
  const clientId = await registerClient();
  await server
    .inject()
    .put(`/rooms/${roomId}`)
    .body({
      clientId,
    } as CreateRoomRequest);
  const response = await server
    .inject()
    .post(`/rooms/${roomId}/join`)
    .body({
      clientId: nanoid(6),
    } as JoinRoomRequest);
  t.is(response.statusCode, 400);
});

test('Room does not exist on join', async (t) => {
  const roomId = nanoid(6);
  const clientId = await registerClient();
  const response = await server
    .inject()
    .post(`/rooms/${roomId}/join`)
    .body({
      clientId,
    } as JoinRoomRequest);
  t.is(response.statusCode, 404);
});

test('Join room twice', async (t) => {
  const roomId = nanoid(6);
  const clientId = await registerClient();
  await server
    .inject()
    .put(`/rooms/${roomId}`)
    .body({
      clientId,
    } as CreateRoomRequest);
  const clientId2 = await registerClient();
  await server
    .inject()
    .post(`/rooms/${roomId}/join`)
    .body({
      clientId: clientId2,
    } as JoinRoomRequest);
  const response = await server
    .inject()
    .post(`/rooms/${roomId}/join`)
    .body({
      clientId: clientId2,
    } as JoinRoomRequest);
  t.is(response.statusCode, 400);
});

test('Already in another room on join', async (t) => {
  const roomId = nanoid(6);
  const clientId = await registerClient();
  await server
    .inject()
    .put(`/rooms/${roomId}`)
    .body({
      clientId,
    } as CreateRoomRequest);
  const roomId2 = nanoid(6);
  const clientId2 = await registerClient();
  await server
    .inject()
    .put(`/rooms/${roomId2}`)
    .body({
      clientId: clientId2,
    } as CreateRoomRequest);
  const clientId3 = await registerClient();
  await server
    .inject()
    .post(`/rooms/${roomId}/join`)
    .body({
      clientId: clientId3,
    } as JoinRoomRequest);
  const response = await server
    .inject()
    .post(`/rooms/${roomId2}/join`)
    .body({
      clientId: clientId3,
    } as JoinRoomRequest);
  t.is(response.statusCode, 400);
});

test('Leave room', async (t) => {
  const roomId = nanoid(6);
  const clientId = await registerClient();
  await server
    .inject()
    .put(`/rooms/${roomId}`)
    .body({
      clientId,
    } as CreateRoomRequest);
  const response = await server
    .inject()
    .post(`/rooms/${roomId}/leave`)
    .body({
      clientId,
    } as LeaveRoomRequest);
  t.is(response.statusCode, 204);
  const response2 = await server.inject().post(`/rooms/${roomId}`).body({
    clientId,
  });
  t.is(response2.statusCode, 404);
});

test('Client does not exist on leave', async (t) => {
  const roomId = nanoid(6);
  const clientId = await registerClient();
  await server
    .inject()
    .put(`/rooms/${roomId}`)
    .body({
      clientId,
    } as CreateRoomRequest);
  const clientId2 = await registerClient();
  const response = await server
    .inject()
    .post(`/rooms/${roomId}/leave`)
    .body({
      clientId: clientId2,
    } as LeaveRoomRequest);
  t.is(response.statusCode, 400);
});

test('Room does not exist on leave', async (t) => {
  const roomId = nanoid(6);
  const clientId = await registerClient();
  const response = await server
    .inject()
    .post(`/rooms/${roomId}/leave`)
    .body({
      clientId,
    } as LeaveRoomRequest);
  t.is(response.statusCode, 404);
});
