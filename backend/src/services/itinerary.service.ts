// Stack: Prisma for persistence. LLM via reusable client in src/ai/llm-client.ts. JSON validated with zod. Persisted in itinerary.itinerary_data.
import { PrismaClient } from '@prisma/client';
import { Cache } from './redisCache.js';
import { z } from 'zod';
import { callLlmJson } from '../ai/llm-client.js';

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

  async generateFromPreferences(input: {
    userId?: string;
    destination: string;
    start_date: string;
    end_date: string;
    travelers_count: number;
    travelers_type?: string;
    budget: 'economico' | 'medio' | 'comfort';
    pace: 'tranquillo' | 'equilibrato' | 'intenso';
    interests?: string[];
    constraints?: Record<string, unknown>;
    notes?: string;
  }) {
    const generationSchema = z.object({
      proposals: z.array(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        compatibility_score: z.number().min(0).max(1),
        estimated_budget: z.number(),
        duration: z.number().int(),
        days: z.array(z.object({
          day: z.number().int(),
          date: z.string(),
          activities: z.array(z.object({
            id: z.string(),
            name: z.string(),
            description: z.string().optional(),
            start_time: z.string().optional(),
            end_time: z.string().optional(),
            location: z.object({
              name: z.string().optional(),
              address: z.string().optional(),
              coordinates: z.object({ lat: z.number(), lng: z.number() }).optional()
            }),
            category: z.string().optional(),
            price: z.number().optional(),
            booking_url: z.string().url().optional()
          })),
          restaurants: z.array(z.object({
            id: z.string(),
            name: z.string(),
            cuisine: z.string().optional(),
            meal_type: z.enum(['breakfast','lunch','dinner']),
            time: z.string().optional(),
            location: z.object({
              name: z.string().optional(),
              address: z.string().optional(),
              coordinates: z.object({ lat: z.number(), lng: z.number() }).optional()
            }),
            price_range: z.string().optional(),
            booking_url: z.string().url().optional()
          })).optional(),
          accommodation: z.object({
            id: z.string(),
            name: z.string(),
            type: z.string(),
            location: z.object({
              name: z.string().optional(),
              address: z.string().optional(),
              coordinates: z.object({ lat: z.number(), lng: z.number() }).optional()
            }),
            price_per_night: z.number().optional(),
            booking_url: z.string().url().optional()
          }).optional(),
          notes: z.string().optional()
        }))
      })),
      confidence_score: z.number().min(0).max(1),
      generation_time: z.number()
    });

    const daysCount = Math.max(1, Math.ceil((new Date(input.end_date).getTime() - new Date(input.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1);

    const system: { role: 'system'; content: string } = {
      role: 'system',
      content: 'You are a travel planning assistant. Always answer with strict JSON matching the schema and realistic, bookable items.'
    };
    const prompt: { role: 'user'; content: string } = {
      role: 'user',
      content: JSON.stringify({
        destination: input.destination,
        start_date: input.start_date,
        end_date: input.end_date,
        days: daysCount,
        travelers_count: input.travelers_count,
        travelers_type: input.travelers_type,
        budget: input.budget,
        pace: input.pace,
        interests: input.interests || [],
        constraints: input.constraints || {},
        notes: input.notes || ''
      })
    };

    const result = await callLlmJson(
      [
        system,
        { role: 'system', content: 'Return itineraries in Italian language.' },
        { role: 'system', content: 'Schema: { proposals: Proposal[], confidence_score: number, generation_time: number }' },
        prompt
      ],
      generationSchema
    );

    const created = await this.prisma.itinerary.create({
      data: {
        user_id: input.userId,
        destination: input.destination,
        start_date: new Date(input.start_date),
        end_date: new Date(input.end_date),
        travelers_count: input.travelers_count,
        travelers_type: input.travelers_type,
        budget: input.budget,
        pace: input.pace,
        interests: (input.interests || []) as any,
        constraints: (input.constraints || {}) as any,
        itinerary_data: result as any,
        status: 'generated'
      }
    });
    await this.cache.del('itineraries:list');
    return created;
  }
}
