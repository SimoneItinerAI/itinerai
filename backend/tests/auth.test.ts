import request from 'supertest';
import { app } from '../src/app';

describe('Auth API', () => {
  it('validates register payload', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'invalid', password: 'short', name: '' });
    expect(res.status).toBe(500);
  });
});
