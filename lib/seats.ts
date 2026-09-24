// Pianta della sala, condivisa tra client e server.

export const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "L", "M"];
export const SEATS_PER_SIDE = 7;
/** Posti riservati a persone con disabilità (fila A, ai lati del corridoio) */
export const ACCESSIBLE = new Set(["A7", "A8"]);

export type Seat = { id: string; row: string; number: number };

export const layout: Seat[][] = ROWS.map((row, r) => {
  // le prime file sono leggermente più corte, come in una sala a ventaglio
  const perSide = r < 2 ? SEATS_PER_SIDE - 1 : SEATS_PER_SIDE;
  const seats: Seat[] = [];
  for (let n = 1; n <= perSide * 2; n++) seats.push({ id: `${row}${n}`, row, number: n });
  return seats;
});

export const ALL_SEATS = new Set(layout.flat().map((s) => s.id));
export const TOTAL_SEATS = ALL_SEATS.size;
export const MAX_SEATS_PER_BOOKING = 8;

/**
 * Posti già venduti al botteghino, generati in modo deterministico per ogni spettacolo
 * così la sala non appare mai vuota nella demo.
 */
export function boxOfficeSeats(showtimeId: string): string[] {
  let h = 2166136261;
  for (const c of showtimeId) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const rand = () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
  const taken: string[] = [];
  for (const seat of layout.flat()) {
    if (ACCESSIBLE.has(seat.id)) continue;
    // più affollato al centro della sala
    const rowIdx = ROWS.indexOf(seat.row);
    const density = rowIdx >= 3 && rowIdx <= 7 ? 0.32 : 0.14;
    if (rand() < density) taken.push(seat.id);
  }
  return taken;
}
