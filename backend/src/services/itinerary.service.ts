import { PrismaClient } from '@prisma/client';
import { Cache } from './redisCache.js';

export class ItineraryService {
  private prisma = new PrismaClient();
  private cache = new Cache();

  async list() {
    const key = 'itineraries:list';
    const cached = await this.cache.get(key);
    if (cached) return cached;
    const items = await this.prisma.itinerary.findMany({ orderBy: { created_at: 'desc' } });
    await this.cache.set(key, items, 60);
    return items;
  }

  async create(data: any) {
    const item = await this.prisma.itinerary.create({ data: { ...data, status: 'draft' } });
    await this.cache.del('itineraries:list');
    return item;
  }

  async get(id: string) {
    const key = `itinerary:${id}`;
    const cached = await this.cache.get(key);
    if (cached) return cached;
    const item = await this.prisma.itinerary.findUnique({ where: { id } });
    if (item) await this.cache.set(key, item, 300);
    return item;
  }

  async update(id: string, data: any) {
    const item = await this.prisma.itinerary.update({ where: { id }, data });
    await this.cache.del(`itinerary:${id}`);
    await this.cache.del('itineraries:list');
    return item;
  }

  async remove(id: string) {
    await this.prisma.itinerary.delete({ where: { id } });
    await this.cache.del(`itinerary:${id}`);
    await this.cache.del('itineraries:list');
  }
}
