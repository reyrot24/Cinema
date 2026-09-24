import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, MapPin } from "lucide-react";
import { cinema, findShowtime, ticketTypes } from "@/lib/data";
import { getBooking } from "@/lib/bookings";
import { euro, longDate } from "@/lib/format";
import { Poster } from "@/components/Poster";
import { Reveal } from "@/components/Reveal";
import { PrintButton } from "@/components/PrintButton";

export const metadata: Metadata = { title: "La tua prenotazione", robots: { index: false } };

/** Codice a barre decorativo derivato dal codice di prenotazione */
function Barcode({ value }: { value: string }) {
  const bars = [...value.repeat(3)].flatMap((c) => {
    const n = c.charCodeAt(0);
    return [(n % 3) + 1, ((n >> 2) % 2) + 1];
  });
  return (
    <div className="flex h-14 items-stretch gap-[2px]" aria-hidden>
      {bars.map((w, i) => (
        <span key={i} className={i % 2 ? "bg-transparent" : "bg-ink"} style={{ width: w * 2 }} />
      ))}
    </div>
  );
}

export default async function BigliettoPage({ params }: PageProps<"/biglietto/[code]">) {
  const { code } = await params;
  const booking = await getBooking(code);
  if (!booking) notFound();
  const match = findShowtime(booking.showtimeId);
  if (!match) notFound();
  const { film, show } = match;

  return (
    <section className="mx-auto max-w-3xl px-4 pb-10 pt-32 sm:px-6">
      <Reveal className="text-center">
        <CheckCircle2 className="mx-auto size-14 text-gold" />
        <h1 className="mt-4 font-display text-4xl sm:text-5xl">Prenotazione confermata!</h1>
        <p className="mt-3 text-muted">
          Grazie {booking.name.split(" ")[0]}. Presenta il codice in cassa almeno 15 minuti prima dell&apos;inizio.
        </p>
      </Reveal>

      <Reveal delay={0.15} y={60} className="mt-12">
        <div className="overflow-hidden rounded-[2rem] bg-cream text-ink shadow-[0_40px_120px_-30px] shadow-gold/40 sm:flex">
          <div className="relative h-44 overflow-hidden text-[15px] sm:h-auto sm:w-56 sm:shrink-0">
            <Poster title={film.title} subtitle={film.subtitle} palette={film.palette} badge={film.badge} className="!aspect-auto h-full !rounded-none sm:!aspect-[2/3]" />
          </div>
          <div className="relative flex-1 p-6 sm:p-8">
            <span className="absolute -top-3 left-1/2 size-6 -translate-x-1/2 rounded-full bg-ink sm:-left-3 sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0" />
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-ink/50">{cinema.name}</p>
            <h2 className="mt-2 font-poster text-5xl uppercase leading-none">{film.title}</h2>
            {film.subtitle && <p className="font-display italic text-ink/70">{film.subtitle}</p>}

            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-widest text-ink/50">Data</dt>
                <dd className="font-semibold">{longDate(show.date)}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-widest text-ink/50">Ore</dt>
                <dd className="font-poster text-3xl leading-none">{show.time}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[10px] font-bold uppercase tracking-widest text-ink/50">Posti</dt>
                <dd className="mt-1 flex flex-wrap gap-1.5">
                  {booking.seats.map((s) => (
                    <span key={s} className="rounded-md bg-ink px-2 py-1 text-xs font-bold text-gold">{s}</span>
                  ))}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[10px] font-bold uppercase tracking-widest text-ink/50">Biglietti</dt>
                <dd>
                  {ticketTypes
                    .filter((t) => booking.tickets[t.id])
                    .map((t) => `${booking.tickets[t.id]} × ${t.label}`)
                    .join(" · ")}
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-col-reverse gap-5 border-t-2 sm:flex-row sm:items-end sm:justify-between border-dashed border-ink/15 pt-5">
              <div className="min-w-0 overflow-hidden">
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink/50">Codice</p>
                <p className="font-mono text-2xl font-bold tracking-wider">{booking.code}</p>
                <Barcode value={booking.code} />
              </div>
              <div className="sm:text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink/50">Da pagare in cassa</p>
                <p className="font-poster text-5xl leading-none">{euro(booking.total)}</p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.3} className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <PrintButton />
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(cinema.mapsQuery)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-semibold transition hover:border-cream print:hidden"
        >
          <MapPin className="size-4" /> Come arrivare
        </a>
        <Link href="/" className="rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink print:hidden">
          Torna alla home
        </Link>
      </Reveal>
    </section>
  );
}
