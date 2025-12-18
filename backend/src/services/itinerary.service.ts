// Stack: Prisma for persistence. LLM via reusable client in src/ai/llm-client.ts. JSON validated with zod. Persisted in itinerary.itinerary_data.
import { PrismaClient } from '@prisma/client';
import { Cache } from './redisCache.js';
import { z } from 'zod';
import { planItineraryWithOpenAi, PlannedItinerarySchema, type GenerateItineraryInput } from '../itinerary/itinerary-planner.js';
import { buildBookingSearchUrl, buildGetYourGuideSearchUrl } from '../providers/link-builder.js';
import { env } from '../utils/env.js';
import { randomUUID } from 'crypto';

export class ItineraryService {
  private prisma?: PrismaClient;
  private cache = new Cache();
  private memory?: {
    itineraries: Map<string, any>;
    days: Map<string, any>;
    items: Map<string, any>;
  };

  private ensureMemory() {
    if (!this.memory) {
      this.memory = { itineraries: new Map(), days: new Map(), items: new Map() };
    }
  }

  constructor() {
    if (env.DATABASE_URL) {
      this.prisma = new PrismaClient();
    } else {
      this.ensureMemory();
    }
  }

  async list() {
    const key = 'itineraries:list';
    const cached = await this.cache.get(key);
    if (cached) return cached;
    if (this.prisma) {
      try {
        const items = await this.prisma.itinerary.findMany({ orderBy: { created_at: 'desc' } });
        await this.cache.set(key, items, 60);
        return items;
      } catch {
        this.prisma = undefined;
        this.ensureMemory();
      }
    }
    const items = Array.from(this.memory!.itineraries.values()).sort((a, b) => (b.created_at as number) - (a.created_at as number));
    await this.cache.set(key, items, 60);
    return items;
  }

  async create(data: any) {
    if (this.prisma) {
      try {
        const item = await this.prisma.itinerary.create({ data: { ...data, status: 'draft' } });
        await this.cache.del('itineraries:list');
        return item;
      } catch {
        this.prisma = undefined;
        this.ensureMemory();
      }
    }
    const id = randomUUID();
    const now = Date.now();
    const item = { id, ...data, status: 'draft', created_at: now, updated_at: now };
    this.memory!.itineraries.set(id, item);
    await this.cache.del('itineraries:list');
    return item;
  }

  async get(id: string) {
    const key = `itinerary:${id}`;
    const cached = await this.cache.get(key);
    if (cached) return cached;
    if (this.prisma) {
      try {
        const item = await this.prisma.itinerary.findUnique({ where: { id } });
        if (item) await this.cache.set(key, item, 300);
        return item;
      } catch {
        this.prisma = undefined;
        this.ensureMemory();
      }
    }
    const item = this.memory!.itineraries.get(id) || null;
    if (item) await this.cache.set(key, item, 300);
    return item;
  }

  async update(id: string, data: any) {
    if (this.prisma) {
      try {
        const item = await this.prisma.itinerary.update({ where: { id }, data });
        await this.cache.del(`itinerary:${id}`);
        await this.cache.del('itineraries:list');
        return item;
      } catch {
        this.prisma = undefined;
        this.ensureMemory();
      }
    }
    const current = this.memory!.itineraries.get(id);
    if (!current) return null as any;
    const updated = { ...current, ...data, updated_at: Date.now() };
    this.memory!.itineraries.set(id, updated);
    await this.cache.del(`itinerary:${id}`);
    await this.cache.del('itineraries:list');
    return updated;
  }

  async remove(id: string) {
    if (this.prisma) {
      try {
        await this.prisma.itinerary.delete({ where: { id } });
        await this.cache.del(`itinerary:${id}`);
        await this.cache.del('itineraries:list');
        return;
      } catch {
        this.prisma = undefined;
        this.ensureMemory();
      }
    }
    this.memory!.itineraries.delete(id);
    Array.from(this.memory!.days.values()).forEach(d => { if (d.itinerary_id === id) this.memory!.days.delete(d.id); });
    Array.from(this.memory!.items.values()).forEach(i => { if (i.itinerary_id === id) this.memory!.items.delete(i.id); });
    await this.cache.del(`itinerary:${id}`);
    await this.cache.del('itineraries:list');
  }

  async generateFromPreferences(input: GenerateItineraryInput, opts?: { searchResults?: Array<{ id: string; title: string; category: string; bookingUrl: string }> }) {
    const key = 'itgen:' + JSON.stringify({ input, search: (opts?.searchResults || []).map(r => r.id) })
    const cachedPlan = await this.cache.get(key)
    const planned = cachedPlan || await planItineraryWithOpenAi(input)
    if (!cachedPlan) await this.cache.set(key, planned, 600)
    const plannedParsed = PlannedItinerarySchema.safeParse(planned)
    const makeDateRange = (start: string, end: string) => {
      const s = new Date(start)
      const e = new Date(end)
      const out: string[] = []
      const d = new Date(s)
      while (d <= e) {
        out.push(new Date(d).toISOString().slice(0,10))
        d.setDate(d.getDate() + 1)
      }
      if (!out.length) out.push(new Date(s).toISOString().slice(0,10))
      return out
    }
    let planDays: Array<any> = plannedParsed.success
      ? plannedParsed.data.days
      : Array.isArray((planned as any)?.days) ? (planned as any).days : []
    if (!Array.isArray(planDays) || planDays.length === 0) {
      const dates = makeDateRange(input.start_date, input.end_date)
      planDays = dates.map((date, i) => ({ date, label: `Giorno ${i + 1}`, items: [] }))
    }
    let itinerary: any
    if (this.prisma) {
      try {
        itinerary = await this.prisma.itinerary.create({
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
            itinerary_data: (plannedParsed.success ? plannedParsed.data : planned) as any,
            status: 'generated'
          }
        })
      } catch {
        this.prisma = undefined;
        this.ensureMemory();
      }
    }
    if (!itinerary) {
      const now = Date.now()
      const id = randomUUID()
      itinerary = {
        id,
        user_id: input.userId,
        destination: input.destination,
        start_date: input.start_date,
        end_date: input.end_date,
        travelers_count: input.travelers_count,
        travelers_type: input.travelers_type,
        budget: input.budget,
        pace: input.pace,
        interests: (input.interests || []) as any,
        constraints: (input.constraints || {}) as any,
        itinerary_data: (plannedParsed.success ? plannedParsed.data : planned) as any,
        status: 'generated',
        created_at: now,
        updated_at: now
      }
      this.memory!.itineraries.set(id, itinerary)
    }

    const daysCreated = []
    const itemsCreated = []
    for (let i = 0; i < planDays.length; i++) {
      const dayPlan = planDays[i]
      let dayRecord: any
      if (this.prisma) {
        try {
          dayRecord = await this.prisma.itineraryDay.create({
            data: {
              itinerary_id: itinerary.id,
              date: new Date(dayPlan.date),
              label: dayPlan.label || `Giorno ${i + 1}`,
              order: i + 1
            }
          })
        } catch {
          this.prisma = undefined;
          this.ensureMemory();
        }
      }
      if (!dayRecord) {
        dayRecord = {
          id: randomUUID(),
          itinerary_id: itinerary.id,
          date: dayPlan.date,
          label: dayPlan.label || `Giorno ${i + 1}`,
          order: i + 1,
          created_at: Date.now(),
          updated_at: Date.now()
        }
        this.memory!.days.set(dayRecord.id, dayRecord)
      }
      daysCreated.push(dayRecord)
      let order = 1

      // Add accommodation suggestion at trip start
      if (i === 0) {
        const bookingUrl = buildBookingSearchUrl({
          destination: input.destination,
          startDate: input.start_date,
          endDate: input.end_date,
          adults: input.travelers_count
        })
        let accItem: any
        if (this.prisma) {
          try {
            accItem = await this.prisma.itineraryItem.create({
              data: {
                itinerary_id: itinerary.id,
                day_id: dayRecord.id,
                type: 'accommodation',
                title: 'Scegli l’alloggio',
                description: 'Trova e prenota l’hotel per il tuo soggiorno',
                source_type: 'ai',
                external_provider: 'booking',
                external_product_id: bookingUrl,
                order
              }
            })
          } catch {
            this.prisma = undefined;
            this.ensureMemory();
          }
        }
        if (!accItem) {
          accItem = {
            id: randomUUID(),
            itinerary_id: itinerary.id,
            day_id: dayRecord.id,
            type: 'accommodation',
            title: 'Scegli l’alloggio',
            description: 'Trova e prenota l’hotel per il tuo soggiorno',
            source_type: 'ai',
            external_provider: 'booking',
            external_product_id: bookingUrl,
            order,
            created_at: Date.now(),
            updated_at: Date.now()
          }
          this.memory!.items.set(accItem.id, accItem)
        }
        itemsCreated.push(accItem)
        order++
      }

      const itemsArray = Array.isArray(dayPlan.items) ? dayPlan.items : []
      for (const item of itemsArray) {
        const type = item.type
        let external_provider: string | undefined
        let external_product_id: string | undefined
        if (opts?.searchResults?.length) {
          const match = opts.searchResults.find(r => {
            const cat = (item.category || type)
            return (r.category === 'experience' && type === 'activity')
              || (r.category === 'hotel' && type === 'accommodation')
              || (r.category?.toLowerCase?.() === cat?.toLowerCase?.())
          })
          if (match) {
            external_product_id = match.bookingUrl
            external_provider = match.bookingUrl.includes('getyourguide') ? 'getyourguide' : (match.bookingUrl.includes('booking') ? 'booking' : 'external')
          }
        }
        if (!external_product_id) {
          if (type === 'activity') {
            external_provider = 'getyourguide'
            external_product_id = buildGetYourGuideSearchUrl({ destination: input.destination, date: dayPlan.date, category: item.category })
          } else if (type === 'accommodation') {
            external_provider = 'booking'
            external_product_id = buildBookingSearchUrl({ destination: input.destination, startDate: input.start_date, endDate: input.end_date, adults: input.travelers_count })
          }
        }
        let created: any
        if (this.prisma) {
          try {
            created = await this.prisma.itineraryItem.create({
              data: {
                itinerary_id: itinerary.id,
                day_id: dayRecord.id,
                type: type,
                title: item.title,
                description: item.description,
                start_time: item.startTime,
                end_time: item.endTime,
                source_type: 'ai',
                external_provider,
                external_product_id,
                order
              }
            })
          } catch {
            this.prisma = undefined;
            this.ensureMemory();
          }
        }
        if (!created) {
          created = {
            id: randomUUID(),
            itinerary_id: itinerary.id,
            day_id: dayRecord.id,
            type: type,
            title: item.title,
            description: item.description,
            start_time: item.startTime,
            end_time: item.endTime,
            source_type: 'ai',
            external_provider,
            external_product_id,
            order,
            created_at: Date.now(),
            updated_at: Date.now()
          }
          this.memory!.items.set(created.id, created)
        }
        itemsCreated.push(created)
        order++
      }
    }

    await this.cache.del('itineraries:list')
    return {
      itinerary,
      days: daysCreated,
      items: itemsCreated.map(i => ({
        ...i,
        externalProvider: i.external_provider || undefined,
        externalUrl: i.external_product_id || undefined
      }))
    }
  }

  async refineItinerary(params: { id: string; instructions: string }) {
    let base: any
    if (this.prisma) {
      try {
        base = await this.prisma.itinerary.findUnique({ where: { id: params.id } })
      } catch {
        this.prisma = undefined
        this.ensureMemory()
      }
    }
    if (!base) base = this.memory!.itineraries.get(params.id)
    if (!base) throw Object.assign(new Error('Itinerario non trovato'), { status: 404 })
    const input: GenerateItineraryInput = {
      userId: base.user_id || undefined,
      destination: base.destination,
      start_date: (base.start_date instanceof Date ? base.start_date.toISOString().slice(0,10) : String(base.start_date)),
      end_date: (base.end_date instanceof Date ? base.end_date.toISOString().slice(0,10) : String(base.end_date)),
      travelers_count: base.travelers_count,
      travelers_type: base.travelers_type || undefined,
      budget: (base.budget as any) || 'medio',
      pace: (base.pace as any) || 'equilibrato',
      interests: Array.isArray(base.interests) ? (base.interests as any) : [],
      constraints: { ...(base.constraints as any || {}), refine_instructions: params.instructions },
      notes: params.instructions
    }
    const planned = await planItineraryWithOpenAi(input)
    const makeDateRange = (start: string, end: string) => {
      const s = new Date(start)
      const e = new Date(end)
      const out: string[] = []
      const d = new Date(s)
      while (d <= e) {
        out.push(new Date(d).toISOString().slice(0,10))
        d.setDate(d.getDate() + 1)
      }
      if (!out.length) out.push(new Date(s).toISOString().slice(0,10))
      return out
    }
    const parsed = PlannedItinerarySchema.safeParse(planned)
    let planDays: Array<any> = parsed.success
      ? parsed.data.days
      : Array.isArray((planned as any)?.days) ? (planned as any).days : []
    if (!Array.isArray(planDays) || planDays.length === 0) {
      const dates = makeDateRange(input.start_date, input.end_date)
      planDays = dates.map((date, i) => ({ date, label: `Giorno ${i + 1}`, items: [] }))
    }

    if (this.prisma) {
      try {
        await this.prisma.$transaction([
          this.prisma.itineraryDay.deleteMany({ where: { itinerary_id: base.id } }),
          this.prisma.itineraryItem.deleteMany({ where: { itinerary_id: base.id } })
        ])
      } catch {
        this.prisma = undefined
        this.ensureMemory()
        Array.from(this.memory!.days.values()).forEach(d => { if (d.itinerary_id === base.id) this.memory!.days.delete(d.id) })
        Array.from(this.memory!.items.values()).forEach(i => { if (i.itinerary_id === base.id) this.memory!.items.delete(i.id) })
      }
    } else {
      Array.from(this.memory!.days.values()).forEach(d => { if (d.itinerary_id === base.id) this.memory!.days.delete(d.id) })
      Array.from(this.memory!.items.values()).forEach(i => { if (i.itinerary_id === base.id) this.memory!.items.delete(i.id) })
    }

    const daysCreated = []
    const itemsCreated = []
    for (let i = 0; i < planDays.length; i++) {
      const dayPlan = planDays[i]
      let dayRecord: any
      if (this.prisma) {
        try {
          dayRecord = await this.prisma.itineraryDay.create({
            data: {
              itinerary_id: base.id,
              date: new Date(dayPlan.date),
              label: dayPlan.label || `Giorno ${i + 1}`,
              order: i + 1
            }
          })
        } catch {
          this.prisma = undefined
          this.ensureMemory()
        }
      }
      if (!dayRecord) {
        dayRecord = {
          id: randomUUID(),
          itinerary_id: base.id,
          date: dayPlan.date,
          label: dayPlan.label || `Giorno ${i + 1}`,
          order: i + 1,
          created_at: Date.now(),
          updated_at: Date.now()
        }
        this.memory!.days.set(dayRecord.id, dayRecord)
      }
      daysCreated.push(dayRecord)
      let order = 1

      if (i === 0) {
        const bookingUrl = buildBookingSearchUrl({
          destination: base.destination,
          startDate: input.start_date,
          endDate: input.end_date,
          adults: base.travelers_count
        })
        let accItem: any
        if (this.prisma) {
          try {
            accItem = await this.prisma.itineraryItem.create({
              data: {
                itinerary_id: base.id,
                day_id: dayRecord.id,
                type: 'accommodation',
                title: 'Scegli l’alloggio',
                description: 'Trova e prenota l’hotel per il tuo soggiorno',
                source_type: 'ai',
                external_provider: 'booking',
                external_product_id: bookingUrl,
                order
              }
            })
          } catch {
            this.prisma = undefined
            this.ensureMemory()
          }
        }
        if (!accItem) {
          accItem = {
            id: randomUUID(),
            itinerary_id: base.id,
            day_id: dayRecord.id,
            type: 'accommodation',
            title: 'Scegli l’alloggio',
            description: 'Trova e prenota l’hotel per il tuo soggiorno',
            source_type: 'ai',
            external_provider: 'booking',
            external_product_id: bookingUrl,
            order,
            created_at: Date.now(),
            updated_at: Date.now()
          }
          this.memory!.items.set(accItem.id, accItem)
        }
        itemsCreated.push(accItem)
        order++
      }

      const itemsArray = Array.isArray(planDays[i].items) ? planDays[i].items : []
      for (const item of itemsArray) {
        const type = item.type
        let external_provider: string | undefined
        let external_product_id: string | undefined
        if (type === 'activity') {
          external_provider = 'getyourguide'
          external_product_id = buildGetYourGuideSearchUrl({
            destination: base.destination,
            date: dayPlan.date,
            category: item.category
          })
        }
        if (type === 'accommodation') {
          external_provider = 'booking'
          external_product_id = buildBookingSearchUrl({
            destination: base.destination,
            startDate: input.start_date,
            endDate: input.end_date,
            adults: base.travelers_count
          })
        }
        let created: any
        if (this.prisma) {
          try {
            created = await this.prisma.itineraryItem.create({
              data: {
                itinerary_id: base.id,
                day_id: dayRecord.id,
                type: type,
                title: item.title,
                description: item.description,
                start_time: item.startTime,
                end_time: item.endTime,
                source_type: 'ai',
                external_provider,
                external_product_id,
                order
              }
            })
          } catch {
            this.prisma = undefined
            this.ensureMemory()
          }
        }
        if (!created) {
          created = {
            id: randomUUID(),
            itinerary_id: base.id,
            day_id: dayRecord.id,
            type: type,
            title: item.title,
            description: item.description,
            start_time: item.startTime,
            end_time: item.endTime,
            source_type: 'ai',
            external_provider,
            external_product_id,
            order,
            created_at: Date.now(),
            updated_at: Date.now()
          }
          this.memory!.items.set(created.id, created)
        }
        itemsCreated.push(created)
        order++
      }
    }

    let updated: any
    if (this.prisma) {
      try {
        updated = await this.prisma.itinerary.update({
          where: { id: base.id },
          data: { itinerary_data: planned as any, status: 'generated' }
        })
      } catch {
        this.prisma = undefined
        this.ensureMemory()
      }
    }
    if (!updated) {
      updated = { ...base, itinerary_data: planned as any, status: 'generated', updated_at: Date.now() }
      this.memory!.itineraries.set(base.id, updated)
    }
    await this.cache.del(`itinerary:${base.id}`)
    await this.cache.del('itineraries:list')
    return {
      itinerary: updated,
      days: daysCreated,
      items: itemsCreated.map(i => ({
        ...i,
        externalProvider: i.external_provider || undefined,
        externalUrl: i.external_product_id || undefined
      }))
    }
  }
}
