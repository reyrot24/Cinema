import { prices, ticketTypes, type Film, type TicketTypeId } from "./data";
import { weekday } from "./format";

export function availableTicketTypes(date: string) {
  const day = weekday(date);
  return ticketTypes.filter((t) => !("weekdays" in t) || (t.weekdays as readonly number[]).includes(day));
}

export function computeTotal(
  film: Film,
  date: string,
  tickets: Partial<Record<TicketTypeId, number>>,
) {
  const allowed = availableTicketTypes(date);
  let total = 0;
  let count = 0;
  for (const [id, qty] of Object.entries(tickets)) {
    if (!qty) continue;
    const type = allowed.find((t) => t.id === id);
    if (!type || !Number.isInteger(qty) || qty < 0) return null;
    total += qty * (type.price + (film.format === "3D" ? prices.supplement3D : 0));
    count += qty;
  }
  return { total, count };
}
