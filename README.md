# Cine Teatro N. Andrisani — sito web

Remake moderno di https://salamusica.wixsite.com/cineteatroandrisani in Next.js 16 (App Router), Tailwind CSS 4 e Framer Motion.

```bash
npm install
npm run dev      # http://localhost:3000
```

## Aggiornare la programmazione

Tutti i contenuti sono in `lib/data.ts`:

- `films`: film in sala, con trama, palette della locandina e spettacoli (`["2026-09-18", "20:30"]`)
- `upcoming`: sezione Prossimamente
- `prices` / `ticketTypes`: tariffe (Intero €7, Ridotto €5, Carta Giovani mar/mer, 3D +€2)

## Prenotazioni

- `/prenota` è il flusso guidato: film → spettacolo → posti → dati. Si paga in cassa.
- `app/api/seats` restituisce i posti occupati; `app/api/bookings` crea la prenotazione e rifiuta i posti già presi (409).
- Le prenotazioni sono salvate in `data/bookings.json` (`lib/bookings.ts`). Va bene in locale o su un server Node;
  su hosting serverless (es. Vercel) il filesystem non è persistente: sostituire con un database.
- La pianta della sala è in `lib/seats.ts`. `boxOfficeSeats()` simula i posti venduti al botteghino per la demo:
  rimuovila quando colleghi i dati reali.
