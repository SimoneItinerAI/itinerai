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
