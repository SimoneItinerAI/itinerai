import Redis from 'ioredis';
import type { Redis as RedisType } from 'ioredis';
import NodeCache from 'node-cache';
import { env } from '../utils/env.js';

export class Cache {
  private redis?: RedisType | any;
  private memory = new NodeCache();

  constructor() {
    if (env.REDIS_URL) this.redis = new (Redis as any)(env.REDIS_URL);
  }

  async get(key: string) {
    if (this.redis) {
      const v = await this.redis.get(key);
      return v ? JSON.parse(v) : null;
    }
    return this.memory.get(key) || null;
  }

  async set(key: string, value: any, ttlSeconds: number) {
    if (this.redis) return this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    this.memory.set(key, value, ttlSeconds);
  }

  async del(key: string) {
    if (this.redis) return this.redis.del(key);
    this.memory.del(key);
  }
}
