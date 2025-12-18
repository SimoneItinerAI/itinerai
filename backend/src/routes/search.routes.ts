import { Router, Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { buildBookingSearchUrl, buildGetYourGuideSearchUrl } from '../providers/link-builder.js'

const router = Router()

const InputSchema = z.object({
  destination: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  travelers: z.object({ adults: z.number().int().min(1), children: z.number().int().min(0) }).optional(),
  interests: z.array(z.string()).optional()
})

router.post('/aggregate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = InputSchema.parse(req.body)
    const hotelsUrl = buildBookingSearchUrl({
      destination: input.destination,
      startDate: input.startDate || '',
      endDate: input.endDate || '',
      adults: input.travelers?.adults || 2
    })
    const interests = (input.interests || []).slice(0, 6)
    const experiences = interests.map((cat, idx) => ({
      id: `exp-${idx}`,
      title: `${cat} • ${input.destination}`,
      category: 'experience',
      price: undefined,
      duration: '2-4h',
      location: input.destination,
      bookingUrl: buildGetYourGuideSearchUrl({ destination: input.destination, date: input.startDate, category: cat })
    }))
    const hotels = [{
      id: 'hotel-search',
      title: `Hotel • ${input.destination}`,
      category: 'hotel',
      price: undefined,
      duration: `${input.startDate || ''}→${input.endDate || ''}`,
      location: input.destination,
      bookingUrl: hotelsUrl
    }]
    res.json({ results: [...hotels, ...experiences] })
  } catch (e) { next(e) }
})

export default router
