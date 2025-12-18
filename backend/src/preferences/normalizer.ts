import { z } from 'zod'
import { callLlmJson, type LlmMessage } from '../ai/llm-client.js'

export const PreferencesInputSchema = z.object({
  destination: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  durationDays: z.number().int().positive().optional(),
  travelers: z.object({ adults: z.number().int().min(1), children: z.number().int().min(0) }),
  budgetTotalEur: z.number().int().min(0),
  tripStyle: z.enum(['relaxed','balanced','fast']),
  interests: z.array(z.string()),
  constraints: z.array(z.string()),
  notes: z.string().optional()
}).refine(v => !!(v.startDate && v.endDate) || !!v.durationDays, {
  message: 'Provide startDate+endDate OR durationDays'
})

export const PreferencesNormalizedSchema = z.object({
  destination: z.object({ raw: z.string(), city: z.string().optional(), region: z.string().optional(), country: z.string().optional() }),
  dates: z.object({ startDate: z.string().optional(), endDate: z.string().optional(), durationDays: z.number().int().positive() }),
  travelers: z.object({ adults: z.number().int().min(1), children: z.number().int().min(0), total: z.number().int().min(1) }),
  budget: z.object({
    totalEur: z.number().int().min(0),
    perDayEur: z.number().int().min(0),
    breakdown: z.object({ lodgingPct: z.number().min(0).max(100), foodPct: z.number().min(0).max(100), activitiesPct: z.number().min(0).max(100), transportPct: z.number().min(0).max(100) })
  }),
  tripStyle: z.enum(['relaxed','balanced','fast']),
  interests: z.array(z.string()),
  constraints: z.array(z.string()),
  assumptions: z.array(z.string()),
  warnings: z.array(z.string())
})

export async function normalizePreferences(input: z.infer<typeof PreferencesInputSchema>) {
  const system: LlmMessage = {
    role: 'system',
    content: [
      'Sei un assistente che normalizza preferenze di viaggio.',
      'Non inventare date: se manca durationDays ma start/end sono presenti, calcola la durata; se manca end ma è presente durationDays, calcola end.',
      'Budget breakdown deve sommare circa 100% (tolleranza ±5%).',
      'Riporta warnings e assumptions se i dati sono incompleti o ambigui.',
      'Rispondi SOLO con JSON conforme allo schema.'
    ].join(' ')
  }
  const user: LlmMessage = { role: 'user', content: JSON.stringify(input) }
  const out = await callLlmJson([
    system,
    { role: 'system', content: 'Restituisci SOLO JSON valido conforme a PreferencesNormalizedSchema.' },
    user
  ], PreferencesNormalizedSchema)
  return out
}
