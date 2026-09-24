import { NextRequest } from "next/server";
import { findShowtime } from "@/lib/data";
import { takenSeats } from "@/lib/bookings";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("showtime") ?? "";
  if (!findShowtime(id)) {
    return Response.json({ error: "Spettacolo non trovato" }, { status: 404 });
  }
  return Response.json({ taken: await takenSeats(id) });
}
