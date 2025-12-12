import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { env } from '../utils/env.js';

export class AuthService {
  private prisma?: PrismaClient;
  private memory?: Map<string, { id: string; email: string; password_hash: string; name: string }>;

  constructor() {
    if (env.DATABASE_URL) {
      this.prisma = new PrismaClient();
    } else {
      this.memory = new Map();
    }
  }

  async register(data: { email: string; password: string; name: string }) {
    const hash = await bcrypt.hash(data.password, 10);
    if (this.prisma) {
      const user = await this.prisma.user.create({ data: { email: data.email, password_hash: hash, name: data.name } });
      const token = jwt.sign({ sub: user.id }, env.JWT_SECRET, { expiresIn: '7d' });
      return { user: { id: user.id, email: user.email, name: user.name }, access_token: token };
    }
    if (!this.memory) throw new Error('Memory store not initialized');
    if (this.memory.has(data.email)) throw Object.assign(new Error('Email already registered'), { status: 409 });
    const id = randomUUID();
    const memUser = { id, email: data.email, password_hash: hash, name: data.name };
    this.memory.set(data.email, memUser);
    const token = jwt.sign({ sub: id }, env.JWT_SECRET, { expiresIn: '7d' });
    return { user: { id, email: data.email, name: data.name }, access_token: token };
  }

  async login(email: string, password: string) {
    if (this.prisma) {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
      const ok = await bcrypt.compare(password, user.password_hash);
      if (!ok) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
      const token = jwt.sign({ sub: user.id }, env.JWT_SECRET, { expiresIn: '7d' });
      return { user: { id: user.id, email: user.email, name: user.name }, access_token: token };
    }
    if (!this.memory) throw new Error('Memory store not initialized');
    const memUser = this.memory.get(email);
    if (!memUser) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    const ok = await bcrypt.compare(password, memUser.password_hash);
    if (!ok) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    const token = jwt.sign({ sub: memUser.id }, env.JWT_SECRET, { expiresIn: '7d' });
    return { user: { id: memUser.id, email: memUser.email, name: memUser.name }, access_token: token };
  }
}
