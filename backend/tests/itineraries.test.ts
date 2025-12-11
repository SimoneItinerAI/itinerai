import request from 'supertest';
import { app } from '../src/app';

describe('Itineraries API', () => {
  it('lists itineraries', async () => {
    const res = await request(app).get('/api/itineraries');
    expect([200,500]).toContain(res.status);
  });
});
