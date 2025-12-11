import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ItineraryService } from '../services/itinerary.service.js';

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

export default router;
