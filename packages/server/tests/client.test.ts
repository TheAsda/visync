import test from 'ava';
import { nanoid } from 'nanoid';
import server from '../src/server.js';

test('Register client', async (t) => {
  const clientId = nanoid(6);
  const response = await server.inject().put(`/clients/${clientId}`);
  t.is(response.statusCode, 201);
  t.is(response.json().clientId, clientId);
});

test('Client already exists', async (t) => {
  const clientId = nanoid(6);
  await server.inject().put(`/clients/${clientId}`);
  const response = await server.inject().put(`/clients/${clientId}`);
  t.is(response.statusCode, 400);
});

test('Get client', async (t) => {
  const clientId = nanoid(6);
  await server.inject().put(`/clients/${clientId}`);
  const response = await server.inject().get(`/clients/${clientId}`);
  t.is(response.statusCode, 200);
  t.is(response.json().clientId, clientId);
});

test('Client not found', async (t) => {
  const clientId = nanoid(6);
  const response = await server.inject().get(`/clients/${clientId}`);
  t.is(response.statusCode, 404);
});
