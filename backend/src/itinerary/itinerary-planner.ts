import { z } from 'zod'
import { callLlmJson, type LlmMessage } from '../ai/llm-client.js'

export type GenerateItineraryInput = {
  userId?: string
  destination: string
  start_date: string
  end_date: string
  travelers_count: number
  travelers_type?: string
  budget: 'economico' | 'medio' | 'comfort'
  pace: 'tranquillo' | 'equilibrato' | 'intenso'
  interests?: string[]
  constraints?: Record<string, unknown>
  notes?: string
}

export const PlannedItemSchema = z.object({
  partOfDay: z.enum(['morning', 'afternoon', 'evening']).optional(),
  title: z.string(),
  description: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  type: z.enum(['activity', 'meal', 'free_time', 'accommodation']).default('activity'),
  category: z.string().optional()
})

export const PlannedDaySchema = z.object({
  date: z.string(),
  label: z.string(),
  items: z.array(PlannedItemSchema)
})

export const PlannedItinerarySchema = z.object({
  days: z.array(PlannedDaySchema)
})

export type PlannedItineraryJson = z.infer<typeof PlannedItinerarySchema>

export async function planItineraryWithOpenAi(input: GenerateItineraryInput): Promise<PlannedItineraryJson> {
  const system: LlmMessage = {
    role: 'system',
    content: [
      'Sei un pianificatore di viaggi esperto.',
      'Genera un itinerario realistico con massimo 3-4 attività al giorno,',
      'alternando attività intense e leggere, includendo pasti e momenti di relax.',
      'Utilizza orari plausibili e coerenza con budget e ritmo.',
      'Includi gemme nascoste e esperienze locali autentiche quando pertinenti.',
      'Adatta il piano a famiglie, coppie, solo traveler o amici in base ai dati.',
      'Rispondi SOLO con JSON conforme allo schema richiesto.'
    ].join(' ')
  }

  const user: LlmMessage = {
    role: 'user',
    content: JSON.stringify({
      destination: input.destination,
      startDate: input.start_date,
      endDate: input.end_date,
      travelers: input.travelers_count,
      travelersType: input.travelers_type,
      budgetLevel: input.budget,
      pace: input.pace,
      interests: input.interests || [],
      notes: input.notes || '',
      constraints: input.constraints || {}
    })
  }

  const result = await callLlmJson(
    [
      system,
      { role: 'system', content: 'Restituisci le descrizioni in lingua italiana.' },
      { role: 'system', content: 'Restituisci SOLO JSON valido conforme allo schema PlannedItinerarySchema.' },
      user
    ],
    PlannedItinerarySchema
  )

  return result as PlannedItineraryJson
}
