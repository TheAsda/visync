import anyTest, { TestFn } from 'ava';
import { nanoid } from 'nanoid';
import {
  CreateRoomRequest,
  JoinRoomRequest,
  LeaveRoomRequest,
} from 'visync-contracts';
import server from '../src/server.js';

const test = anyTest as TestFn<{
  registerClient: () => Promise<string>;
}>;

test.beforeEach('Register user', async (t) => {
  const registerClient = async () => {
    const clientId = nanoid(6);
    await server.inject().put(`/clients/${clientId}`);
    return clientId;
  };
  t.context = { registerClient };
});

test('Create room', async (t) => {
  const roomId = nanoid(6);
  const clientId = await t.context.registerClient();
  const room = await server.knex.table('room').select('roomId')
  const response = await server
    .inject()
    .put(`/rooms/${roomId}`)
    .body({
      clientId,
    } as CreateRoomRequest);
  t.is(response.statusCode, 201);
  t.is(response.json().roomId, roomId);
});

test('Client does not exists on create', async (t) => {
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
  const clientId = await t.context.registerClient();
  await server
    .inject()
    .put(`/rooms/${roomId}`)
    .body({
      clientId,
    } as CreateRoomRequest);
  const clientId2 = await t.context.registerClient();
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
  const clientId = await t.context.registerClient();
  await server
    .inject()
    .put(`/rooms/${roomId}`)
    .body({
      clientId,
    } as CreateRoomRequest);
  const clientId2 = await t.context.registerClient();
  const response = await server
    .inject()
    .post(`/rooms/${roomId}/join`)
    .body({
      clientId: clientId2,
    } as JoinRoomRequest);
  t.is(response.statusCode, 200);
});

test('Client does not exists on join', async (t) => {
  const roomId = nanoid(6);
  const clientId = await t.context.registerClient();
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

test('Room does not exists on join', async (t) => {
  const roomId = nanoid(6);
  const clientId = await t.context.registerClient();
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
  const clientId = await t.context.registerClient();
  await server
    .inject()
    .put(`/rooms/${roomId}`)
    .body({
      clientId,
    } as CreateRoomRequest);
  const clientId2 = await t.context.registerClient();
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
  const clientId = await t.context.registerClient();
  await server
    .inject()
    .put(`/rooms/${roomId}`)
    .body({
      clientId,
    } as CreateRoomRequest);
  const roomId2 = nanoid(6);
  const clientId2 = await t.context.registerClient();
  await server
    .inject()
    .put(`/rooms/${roomId2}`)
    .body({
      clientId: clientId2,
    } as CreateRoomRequest);
  const clientId3 = await t.context.registerClient();
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
  const clientId = await t.context.registerClient();
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
});

test('Client does not exists on leave', async (t) => {
  const roomId = nanoid(6);
  const clientId = await t.context.registerClient();
  await server
    .inject()
    .put(`/rooms/${roomId}`)
    .body({
      clientId,
    } as CreateRoomRequest);
  const clientId2 = await t.context.registerClient();
  const response = await server
    .inject()
    .post(`/rooms/${roomId}/leave`)
    .body({
      clientId: clientId2,
    } as LeaveRoomRequest);
  t.is(response.statusCode, 400);
});

test('Room does not exists on leave', async (t) => {
  const roomId = nanoid(6);
  const clientId = await t.context.registerClient();
  const response = await server
    .inject()
    .post(`/rooms/${roomId}/leave`)
    .body({
      clientId,
    } as LeaveRoomRequest);
  t.is(response.statusCode, 404);
});
