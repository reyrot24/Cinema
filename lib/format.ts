function parse(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

const fmt = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("it-IT", { timeZone: "UTC", ...opts });

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "Venerdì 18 settembre" */
export const longDate = (date: string) =>
  cap(fmt({ weekday: "long", day: "numeric", month: "long" }).format(parse(date)));

/** "ven" */
export const shortWeekday = (date: string) =>
  fmt({ weekday: "short" }).format(parse(date)).replace(".", "");

export const dayNumber = (date: string) => parse(date).getUTCDate();

export const monthShort = (date: string) =>
  fmt({ month: "short" }).format(parse(date)).replace(".", "");

/** 0 = domenica … 6 = sabato */
export const weekday = (date: string) => parse(date).getUTCDay();

export const euro = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);

/** "18 – 23 settembre" */
export function rangeLabel(days: string[]) {
  if (!days.length) return "";
  const first = days[0];
  const last = days[days.length - 1];
  const month = fmt({ month: "long" });
  const sameMonth = first.slice(0, 7) === last.slice(0, 7);
  return sameMonth
    ? `${dayNumber(first)} – ${dayNumber(last)} ${month.format(parse(last))}`
    : `${dayNumber(first)} ${month.format(parse(first))} – ${dayNumber(last)} ${month.format(parse(last))}`;
}
