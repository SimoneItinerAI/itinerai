## Scelta Tecnologia
- Framework: React 18 + TypeScript
- Stato globale: Redux Toolkit + RTK Query (per dati remoti e cache)
- Routing: React Router (route-based code splitting)
- UI: TailwindCSS + set di componenti riutilizzabili (Button, Card, Modal, Form, Input, Select, Table, Tabs)
- i18n: react-i18next (supporto multi-lingua)
- Test: Jest + React Testing Library (unit/integration)
- Build: Vite

## Struttura Progetto
- `src/app/` bootstrap app, provider Redux, i18n, theme
- `src/routes/` definizione rotte e layout protetti
- `src/store/` slices RTK (auth, dashboard, booking, ui)
- `src/services/` client API (RTK Query + fetch/axios), websocket/SSE per real-time
- `src/components/ui/` libreria UI accessibile e riutilizzabile
- `src/features/` pagine e moduli per domini (auth, dashboard, booking)
- `src/assets/`, `src/lib/` utilità (validators, formatters)
- `src/i18n/` risorse lingua (it, en) e init
- `tests/` unit/integration per componenti e flussi

## Routing Client-side
- Rotte pubbliche: `/login`, `/register`, `/forgot-password`
- Rotte protette (AuthGuard): `/dashboard`, `/booking`, `/booking/:id`
- Layout principale: `Sidebar + Header + Content` su rotte protette
- Code-splitting: `lazy()` per pagine; `Suspense` con skeleton

## Stato Globale (Redux)
- `authSlice`: utente, token JWT, stato sessione, refresh
- `dashboardSlice`: widget, metriche, preferenze layout
- `bookingSlice`: bozza prenotazione, risorse, calendario, pagamento
- `uiSlice`: snackbar/toast, modali, loading globali
- RTK Query: `api` base + endpoints (`auth`, `itineraries/bookings`, `stats`) con cache, re-fetch e invalidazione

## Servizi API
- Base URL: `http://localhost:4000/api`
- Interceptor: allega JWT, gestisce 401 (logout/refresh)
- Endpoints:
  - Auth: `POST /auth/login`, `POST /auth/register`, `POST /auth/forgot` (mock/da allineare backend)
  - Booking: CRUD prenotazioni (riuso itineraries inizialmente), disponibilità risorse, pagamento
  - Dashboard: stats, stream real-time via SSE/WebSocket (mock iniziale)

## Autenticazione e Autorizzazione
- Persistenza token sicura (memory + cookie HttpOnly se disponibile; fallback localStorage con scadenza)
- AuthGuard sul router; Redirect a `/login` se non autenticati
- Ruoli (estendibile): utente/base → gating sulle azioni e viste
- Logout e refresh token (se backend lo supporta; altrimenti re-login)

## Libreria UI
- Componenti accessibili (WAI-ARIA): focus management, ruoli, etichette
- Design system: palette, spaziatura, tipografia (Tailwind tokens)
- Pattern: controlli form (Input, Select, DatePicker), feedback (Alert, Toast), layout (Grid, Flex)
- Theming light/dark

## Pagine e Requisiti
### Pagina di Autenticazione
- Login: validazione email/password, errori e feedback, pulsante “mostra password”
- Registrazione: campi obbligatori, conferma password, errori lato server
- Recupero password: invio email, step verifica e conferma (mock iniziale + endpoint futuro)
- Integrazione JWT: salvataggio token, stato loggato, reindirizzo

### Dashboard Principale
- Layout responsive: Sidebar, Header con utente, area contenuti
- Widget:
  - Dati in tempo reale (mock SSE/WebSocket → aggiornamento slice)
  - Statistiche chiave (conteggi, grafici semplici)
  - Azioni rapide (crea prenotazione, modifica profilo)
- Sezioni per funzionalità (prenotazioni, profilo, impostazioni)
- Auto-aggiornamenti stato (polling/stream)

### Pagina di Prenotazione
- Form completo: destinazione, date, persone, budget, preferenze
- Calendario interattivo (DateRange picker)
- Selezione risorse disponibili (lista/filtri)
- Riepilogo e conferma
- Pagamento: integrazione Stripe (checkout) inizialmente in sandbox

## Performance
- Lazy loading per pagine e widget
- Code splitting per rotte e moduli pesanti
- Memoization e selettori RTK per ridurre re-render
- Prefetch RTK Query per transizioni di pagina

## Accessibilità (WCAG AA)
- Contrasto colori, focus visibile, navigazione da tastiera
- Etichette e descrizioni per controlli form
- Annunci ARIA per errori e cambi di stato

## Multi-lingua
- i18n: dizionari `it` e `en`
- Switch lingua in header; persistenza preferenza
- Traduzione testi statici e messaggi di errore

## Errori e Loading States
- Loader globali e placeholders
- Error boundary per pagine; retry su fetch
- Notifiche coerenti (toast/snackbar)

## Test
- Unit: componenti UI, validator, slice
- Integration: flussi login, creazione prenotazione, dashboard dati
- Mocks API con MSW (Mock Service Worker)

## Documentazione
- README con architettura, flussi, dipendenze e comandi
- Commenti JSDoc sui servizi
- Diagrammi semplici (mermaid) per flussi auth e booking

## Deploy Produzione
- Dockerfile frontend (Nginx serving build Vite)
- CI/CD GitHub Actions: lint, test, build, publish artefatti; opzionale deploy su Vercel/Render
- Variabili ambiente per base URL API e chiavi Stripe (non commit di segreti)

## Allineamento Backend
- Riuso itineraries come “prenotazioni” iniziali; aggiunta endpoint `forgot-password` e `payments` in step successivo
- Protezione rotte backend con JWT (AuthGuard) per dati utente

Confermi che procediamo con questa implementazione? Al via, creerò le cartelle, i provider e le pagine, integrando Redux Toolkit, RTK Query, routing protetto, i18n, test e pipeline di deploy.