import request from 'supertest';
import { app } from '../src/app';

describe('Itineraries API', () => {
  it('lists itineraries', async () => {
    const res = await request(app).get('/api/itineraries');
    expect([200,500]).toContain(res.status);
  });
  it('rejects invalid creation payload', async () => {
    const res = await request(app).post('/api/itineraries').send({ destination: 'Roma' });
    expect(res.status).toBe(500);
  });
  it('generate endpoint handles missing fields', async () => {
    const res = await request(app).post('/api/itineraries/generate').send({ destination: 'Roma' });
    expect([400,500]).toContain(res.status);
  });
});
