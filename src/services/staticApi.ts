type Itinerary = {
  id: string
  destination: string
  start_date: string
  end_date: string
  travelers_count: number
  travelers_type?: string
  budget: string
  pace: string
  interests?: string[]
  constraints?: Record<string, unknown>
  itinerary_data?: any
  status?: string
  created_at?: string
  updated_at?: string
}

const KEY = 'itinerai:itineraries'

function readAll(): Itinerary[] {
  const raw = localStorage.getItem(KEY)
  if (!raw) return []
  try { return JSON.parse(raw) } catch { return [] }
}
function writeAll(items: Itinerary[]) {
  localStorage.setItem(KEY, JSON.stringify(items))
}
function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}
function dateRange(start: string, end: string) {
  const s = new Date(start)
  const e = new Date(end)
  const days: string[] = []
  for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
    days.push(d.toISOString().slice(0,10))
  }
  return days
}

export const staticApi = {
  list(): Itinerary[] {
    return readAll()
  },
  get(id: string): Itinerary | undefined {
    return readAll().find(i => i.id === id)
  },
  create(data: Partial<Itinerary>): Itinerary {
    const items = readAll()
    const now = new Date().toISOString()
    const created: Itinerary = {
      id: uid(),
      destination: data.destination || '',
      start_date: data.start_date || now.slice(0,10),
      end_date: data.end_date || now.slice(0,10),
      travelers_count: data.travelers_count || 1,
      travelers_type: data.travelers_type,
      budget: data.budget || 'medio',
      pace: data.pace || 'equilibrato',
      interests: data.interests || [],
      constraints: data.constraints || {},
      itinerary_data: data.itinerary_data || {},
      status: data.status || 'draft',
      created_at: now,
      updated_at: now
    }
    items.unshift(created)
    writeAll(items)
    return created
  },
  update(id: string, data: Partial<Itinerary>): Itinerary | undefined {
    const items = readAll()
    const idx = items.findIndex(i => i.id === id)
    if (idx === -1) return undefined
    const updated = { ...items[idx], ...data, updated_at: new Date().toISOString() }
    items[idx] = updated
    writeAll(items)
    return updated
  },
  remove(id: string) {
    writeAll(readAll().filter(i => i.id !== id))
  },
  generate(payload: {
    destination: string
    start_date: string
    end_date: string
    travelers_count: number
    travelers_type?: string
    budget: 'economico'|'medio'|'comfort'
    pace: 'tranquillo'|'equilibrato'|'intenso'
    interests?: string[]
    constraints?: Record<string, unknown>
    notes?: string
  }): Itinerary {
    const days = dateRange(payload.start_date, payload.end_date)
    const proposals = [
      {
        id: uid(),
        title: `Itinerario ${payload.destination} equilibrato`,
        description: `Proposta basata su preferenze: ${payload.interests?.join(', ') || 'N/D'}`,
        compatibility_score: 0.7,
        estimated_budget: payload.budget === 'economico' ? 80 : payload.budget === 'medio' ? 150 : 250,
        duration: days.length,
        days: days.map((date, i) => ({
          day: i + 1,
          date,
          activities: [
            { id: uid(), name: 'Visita centro storico', description: 'Passeggiata', start_time: '10:00', end_time: '12:00', location: { name: payload.destination }, category: 'sightseeing' }
          ],
          restaurants: [
            { id: uid(), name: 'Trattoria locale', cuisine: 'Italiana', meal_type: 'lunch', time: '13:00', location: { name: payload.destination }, price_range: '€€' }
          ],
          notes: 'Giornata pianificata'
        }))
      }
    ]
    const item = staticApi.create({
      destination: payload.destination,
      start_date: payload.start_date,
      end_date: payload.end_date,
      travelers_count: payload.travelers_count,
      travelers_type: payload.travelers_type,
      budget: payload.budget,
      pace: payload.pace,
      interests: payload.interests,
      constraints: payload.constraints,
      itinerary_data: { proposals, confidence_score: 0.7, generation_time: 1.2 },
      status: 'generated'
    })
    return item
  }
}
