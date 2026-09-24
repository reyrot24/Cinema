import { getBooking } from "@/lib/bookings";

export async function GET(_request: Request, ctx: RouteContext<"/api/bookings/[code]">) {
  const { code } = await ctx.params;
  const booking = await getBooking(code);
  if (!booking) return Response.json({ error: "Prenotazione non trovata" }, { status: 404 });
  // niente dati di contatto: il codice da solo non deve esporli
  const { code: c, showtimeId, seats, tickets, total, createdAt } = booking;
  return Response.json({ code: c, showtimeId, seats, tickets, total, createdAt });
}
