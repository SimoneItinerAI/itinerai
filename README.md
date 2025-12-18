# ItinerAI

Piattaforma AI per la pianificazione di viaggi. Inserisci destinazione, date e preferenze; ottieni 2-3 itinerari completi e personalizzabili.

## Stack Tecnologico
- `React 18` + `TypeScript`
- `Vite`
- `TailwindCSS`
- `React Router`
- `Supabase` (SDK pronto, integrazione avanzata prevista)

## Avvio Locale
- `npm install`
- `npm run dev`
- Apri `http://localhost:5173`

## Build Produzione
- `npm run build`
- `npm run preview`

## Routing
- `/` Homepage
- `/create` Creazione itinerario
- `/itineraries` Lista itinerari
- `/itinerary/:id` Dettaglio itinerario

## Deploy
- Piattaforma: `Vercel`
- Redirect `www.itinerai.travel` → `itinerai.travel` via `vercel.json`
- `cleanUrls` attivo per URL senza `.html`

## Configurazione Produzione (itinerai.travel / www.itinerai.travel)

### Frontend (Vercel)
- Imposta `VITE_API_URL` nelle Environment Variables del progetto frontend con l'URL pubblico del backend, includendo `/api` (es. `https://api.itinerai.travel/api`).
- In alternativa, se il backend è sullo stesso dominio, lascia `VITE_API_URL` vuoto e configura un proxy su Vercel per inoltrare `/api/*` al backend.

### Backend (host pubblico)
- Variabili richieste:
  - `OPENAI_API_KEY` (solo server)
  - `ALLOWED_ORIGINS="https://itinerai.travel,https://www.itinerai.travel"`
  - `JWT_SECRET`, `DATABASE_URL`, `REDIS_URL` (se usati)
- Health: `GET /api/health` → `{ ok: true }`
- CORS: consente solo gli host in `ALLOWED_ORIGINS`.

### Endpoints AI
- `POST /api/preferences`: normalizza preferenze (Zod + OpenAI, JSON strict), caching su input.
- `POST /api/search/aggregate`: deeplink Booking/GetYourGuide per allowed URLs.
- `POST /api/itineraries/generate`: accetta `search_results` e usa SOLO bookingUrl reali.

### Esempi payload
```json
// /api/preferences
{
  "destination": "Roma",
  "startDate": "2025-03-10",
  "endDate": "2025-03-14",
  "travelers": { "adults": 2, "children": 0 },
  "budgetTotalEur": 1000,
  "tripStyle": "balanced",
  "interests": ["Musei","Cucina"],
  "constraints": []
}
```
```json
// /api/itineraries/generate
{
  "destination": "Roma",
  "start_date": "2025-03-10",
  "end_date": "2025-03-14",
  "travelers_count": 2,
  "budget": "medio",
  "pace": "equilibrato",
  "interests": ["Musei","Cucina"],
  "constraints": {},
  "search_results": [{"id":"hotel-search","title":"Hotel • Roma","category":"hotel","bookingUrl":"https://www.booking.com/..."}]
}
```

### Checklist di verifica
- Frontend
  - `VITE_API_URL` impostata (o proxy `/api/*`)
  - Hard refresh e Service Worker invalidato se necessario
- Backend
  - `OPENAI_API_KEY` presente
  - `ALLOWED_ORIGINS` include apex e www
  - Health OK e endpoints operativi
- Sicurezza/Performance
  - CORS senza errori, rate limit attivo
  - Risposte JSON con schema strict
  - Log pino-http attivi senza dati sensibili

## Collegamento a GitHub
1. Crea un repository su GitHub (es. `itinerai.travel`)
2. Imposta il remote e fai push:
   - `git init`
   - `git add .`
   - `git commit -m "chore: initial commit"`
   - `git branch -M main`
   - `git remote add origin https://github.com/<org_o_username>/itinerai.travel.git`
   - `git push -u origin main`

## Collegamento Vercel ↔ GitHub
- In Vercel: Project → Settings → Git → Link a Git Repository
- Seleziona il repo GitHub e abilita deploy automatici su `main`

## Env
- Usa `VITE_` per variabili lato frontend.
- Non committare segreti; mantienili in `.env.local`.
