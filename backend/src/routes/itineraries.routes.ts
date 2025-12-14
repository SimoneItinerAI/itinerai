// Stack: Express API under /api (see app.ts). Prisma as DB client. Auth via JWT Bearer. Entrypoint for AI generation: POST /api/itineraries/generate.
import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ItineraryService } from '../services/itinerary.service.js';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';

const router = Router();
const service = new ItineraryService();

const createSchema = z.object({
  destination: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  travelers_count: z.number().int().min(1),
  budget: z.enum(['economico','medio','comfort']),
  pace: z.enum(['tranquillo','equilibrato','intenso']),
  interests: z.array(z.string()).optional(),
  notes: z.string().optional()
});

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try { res.json(await service.list()); } catch (e) { next(e); }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createSchema.parse(req.body);
    const created = await service.create(data);
    res.status(201).json(created);
  } catch (e) { next(e); }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await service.get(req.params.id)); } catch (e) { next(e); }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await service.update(req.params.id, req.body)); } catch (e) { next(e); }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try { await service.remove(req.params.id); res.status(204).end(); } catch (e) { next(e); }
});

router.post('/generate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = createSchema.extend({
      travelers_type: z.string().optional(),
      constraints: z.record(z.string(), z.any()).optional()
    }).parse(req.body);
    let userId: string | undefined;
    const auth = req.headers.authorization;
    if (auth?.startsWith('Bearer ')) {
      try {
        const token = auth.substring(7);
        const decoded = jwt.verify(token, env.JWT_SECRET) as { sub?: string };
        userId = decoded.sub;
      } catch {}
    }
    const created = await service.generateFromPreferences({ ...payload, userId });
    res.status(201).json(created);
  } catch (e) { next(e); }
});

export default router;
