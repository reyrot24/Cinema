import { findShowtime } from "@/lib/data";
import { createBooking, SeatConflictError } from "@/lib/bookings";
import { ALL_SEATS, MAX_SEATS_PER_BOOKING } from "@/lib/seats";
import { computeTotal } from "@/lib/pricing";

const bad = (error: string, status = 400) => Response.json({ error }, { status });

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return bad("Richiesta non valida");
  }

  const { showtimeId, seats, tickets, name, email, phone } = body as {
    showtimeId: string;
    seats: string[];
    tickets: Record<string, number>;
    name: string;
    email: string;
    phone: string;
  };

  const match = findShowtime(String(showtimeId));
  if (!match) return bad("Spettacolo non trovato", 404);

  if (
    !Array.isArray(seats) ||
    seats.length === 0 ||
    seats.length > MAX_SEATS_PER_BOOKING ||
    new Set(seats).size !== seats.length ||
    !seats.every((s) => ALL_SEATS.has(s))
  ) {
    return bad("Selezione dei posti non valida");
  }

  const priced = tickets && typeof tickets === "object" ? computeTotal(match.film, match.show.date, tickets) : null;
  if (!priced) return bad("Tipologia di biglietto non disponibile per questo spettacolo");
  if (priced.count !== seats.length) {
    return bad("Il numero di biglietti non corrisponde ai posti scelti");
  }

  const cleanName = String(name ?? "").trim();
  const cleanEmail = String(email ?? "").trim();
  const cleanPhone = String(phone ?? "").trim();
  if (cleanName.length < 2) return bad("Inserisci nome e cognome");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return bad("Email non valida");
  if (!/^[+\d][\d\s]{5,}$/.test(cleanPhone)) return bad("Numero di telefono non valido");

  try {
    const booking = await createBooking({
      showtimeId: match.show.id,
      seats,
      tickets,
      total: priced.total,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
    });
    return Response.json({ code: booking.code }, { status: 201 });
  } catch (e) {
    if (e instanceof SeatConflictError) {
      return Response.json({ error: e.message, seats: e.seats }, { status: 409 });
    }
    throw e;
  }
}
