import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { boxOfficeSeats } from "./seats";
import type { TicketTypeId } from "./data";

export type Booking = {
  code: string;
  showtimeId: string;
  seats: string[];
  tickets: Partial<Record<TicketTypeId, number>>;
  total: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
};

// Archivio su file JSON: sufficiente per sviluppo e piccole installazioni.
// In produzione (serverless) sostituire con un database.
const FILE = path.join(process.cwd(), "data", "bookings.json");

let queue: Promise<unknown> = Promise.resolve();
/** Serializza le scritture per evitare doppie prenotazioni dello stesso posto */
function exclusive<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => {});
  return run;
}

async function readAll(): Promise<Booking[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    return [];
  }
}

async function writeAll(list: Booking[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(list, null, 2));
}

export async function takenSeats(showtimeId: string): Promise<string[]> {
  const list = await readAll();
  const booked = list.filter((b) => b.showtimeId === showtimeId).flatMap((b) => b.seats);
  return [...new Set([...boxOfficeSeats(showtimeId), ...booked])];
}

export async function getBooking(code: string) {
  const list = await readAll();
  return list.find((b) => b.code === code.toUpperCase());
}

export class SeatConflictError extends Error {
  constructor(public seats: string[]) {
    super("Alcuni posti non sono più disponibili");
  }
}

export function createBooking(data: Omit<Booking, "code" | "createdAt">) {
  return exclusive(async () => {
    const list = await readAll();
    const taken = new Set([
      ...boxOfficeSeats(data.showtimeId),
      ...list.filter((b) => b.showtimeId === data.showtimeId).flatMap((b) => b.seats),
    ]);
    const conflicts = data.seats.filter((s) => taken.has(s));
    if (conflicts.length) throw new SeatConflictError(conflicts);

    const booking: Booking = {
      ...data,
      code: "AND-" + randomBytes(3).toString("hex").toUpperCase(),
      createdAt: new Date().toISOString(),
    };
    list.push(booking);
    await writeAll(list);
    return booking;
  });
}
