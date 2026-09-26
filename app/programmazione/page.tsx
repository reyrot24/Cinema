import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Info, Ticket } from "lucide-react";
import { films, programmingDays } from "@/lib/data";
import { longDate, rangeLabel } from "@/lib/format";
import { PageHero } from "@/components/PageHero";
import { Poster } from "@/components/Poster";
import { Reveal } from "@/components/Reveal";
import { ScheduleBoard } from "@/components/ScheduleBoard";

export const metadata: Metadata = { title: "Programmazione" };

export default function ProgrammazionePage() {
  const days = programmingDays();
  return (
    <>
      <PageHero eyebrow={`In programmazione · ${rangeLabel(days)}`} title={<>Cosa c&apos;è <em className="text-gold">in sala</em></>}>
        Trame, date e orari di tutti i film della settimana. Ogni proiezione è a spettacolo unico: prenota per essere sicuro del tuo posto.
      </PageHero>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <ScheduleBoard films={films} days={days} />
        </Reveal>
      </section>

      <section className="mx-auto mt-24 max-w-7xl space-y-24 px-4 sm:px-6">
        {films.map((film, i) => (
          <article key={film.slug} id={film.slug} className="grid grid-cols-1 scroll-mt-28 items-start gap-10 md:grid-cols-[320px_1fr]">
            <Reveal className={`text-[20px] md:sticky md:top-28 ${i % 2 ? "md:order-2" : ""}`}>
              <Link href={`/film/${film.slug}`}>
                <Poster title={film.title} subtitle={film.subtitle} palette={film.palette} badge={film.badge} className="shadow-2xl ring-1 ring-white/10 transition hover:-rotate-1 hover:scale-[1.02]" />
              </Link>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-xs uppercase tracking-[0.25em] text-muted">{film.genre} · {film.format}</p>
              <h2 className="mt-2 font-poster text-6xl uppercase leading-none tracking-wide sm:text-7xl">{film.title}</h2>
              {film.subtitle && <p className="mt-1 font-display text-2xl italic" style={{ color: film.palette[1] }}>{film.subtitle}</p>}
              <h3 className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-gold">La trama</h3>
              <p className="mt-3 max-w-2xl leading-relaxed text-cream/80">{film.plot}</p>
              {film.note && (
                <p className="mt-6 flex max-w-2xl gap-3 rounded-2xl border border-gold/30 bg-gold/10 p-4 text-sm">
                  <Info className="size-5 shrink-0 text-gold" /> {film.note}
                </p>
              )}
              <h3 className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-gold">Spettacoli</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {film.showtimes.map((s) => (
                  <li key={s.id}>
                    <Link href={`/prenota?spettacolo=${s.id}`} className="group flex items-center justify-between rounded-2xl border border-line bg-panel px-4 py-3 transition hover:border-gold">
                      <span className="flex items-center gap-3 text-sm">
                        <CalendarDays className="size-4 text-muted" /> {longDate(s.date)}
                      </span>
                      <span className="flex items-center gap-2 font-poster text-2xl tracking-wide text-gold">
                        {s.time}
                        <Ticket className="size-4 text-cream opacity-0 transition group-hover:opacity-100" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </article>
        ))}
      </section>
    </>
  );
}
