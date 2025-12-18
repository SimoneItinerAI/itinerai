import { Router, Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { Cache } from '../services/redisCache.js'
import { normalizePreferences, PreferencesInputSchema, PreferencesNormalizedSchema } from '../preferences/normalizer.js'
import { createHash } from 'crypto'

const router = Router()
const cache = new Cache()

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = PreferencesInputSchema.parse(req.body)
    const key = 'prefs:' + createHash('sha256').update(JSON.stringify(input)).digest('hex')
    const cached = await cache.get(key)
    if (cached) return res.json(cached)
    const normalized = await normalizePreferences(input)
    const parsed = PreferencesNormalizedSchema.safeParse(normalized)
    const payload = parsed.success ? parsed.data : normalized
    await cache.set(key, payload, 300)
    res.json(payload)
  } catch (e) {
    next(e)
  }
})

export default router
