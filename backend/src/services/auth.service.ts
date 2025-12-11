import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';

export class AuthService {
  private prisma = new PrismaClient();

  async register(data: { email: string; password: string; name: string }) {
    const hash = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({ data: { email: data.email, password_hash: hash, name: data.name } });
    const token = jwt.sign({ sub: user.id }, env.JWT_SECRET, { expiresIn: '7d' });
    return { user: { id: user.id, email: user.email, name: user.name }, access_token: token };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    const token = jwt.sign({ sub: user.id }, env.JWT_SECRET, { expiresIn: '7d' });
    return { user: { id: user.id, email: user.email, name: user.name }, access_token: token };
  }
}
