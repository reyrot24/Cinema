import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Info, Ticket } from "lucide-react";
import { films, getFilm } from "@/lib/data";
import { longDate } from "@/lib/format";
import { Poster } from "@/components/Poster";
import { Reveal } from "@/components/Reveal";
import { FilmCard } from "@/components/FilmCard";

export function generateStaticParams() {
  return films.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: PageProps<"/film/[slug]">): Promise<Metadata> {
  const film = getFilm((await params).slug);
  return film ? { title: film.title, description: film.plot.slice(0, 160) } : {};
}

export default async function FilmPage({ params }: PageProps<"/film/[slug]">) {
  const film = getFilm((await params).slug);
  if (!film) notFound();
  const [a, b] = film.palette;
  const others = films.filter((f) => f.slug !== film.slug).slice(0, 3);

  return (
    <>
      <section className="relative isolate overflow-hidden pb-20 pt-32">
        <div className="absolute inset-0 -z-10" style={{ background: `radial-gradient(70% 80% at 80% 20%, ${b}33, transparent 60%), radial-gradient(60% 60% at 0% 100%, ${a}55, transparent 70%)` }} />
        <div className="grain absolute inset-0 -z-10" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Link href="/programmazione" className="inline-flex items-center gap-2 text-sm text-muted hover:text-cream">
            <ArrowLeft className="size-4" /> Programmazione
          </Link>
          <div className="mt-8 grid grid-cols-1 items-start gap-12 md:grid-cols-[340px_1fr]">
            <Reveal className="mx-auto w-full max-w-xs text-[21px] md:max-w-none">
              <Poster title={film.title} subtitle={film.subtitle} palette={film.palette} badge={film.badge} className="shadow-[0_40px_100px_-20px_rgba(0,0,0,.9)] ring-1 ring-white/10" />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">{film.genre} · {film.format}</p>
              <h1 className="mt-3 font-poster text-7xl uppercase leading-[0.85] tracking-wide sm:text-8xl">{film.title}</h1>
              {film.subtitle && <p className="mt-2 font-display text-3xl italic" style={{ color: b }}>{film.subtitle}</p>}
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-cream/80">{film.plot}</p>
              {film.note && (
                <p className="mt-6 flex max-w-2xl gap-3 rounded-2xl border border-gold/30 bg-gold/10 p-4 text-sm">
                  <Info className="size-5 shrink-0 text-gold" /> {film.note}
                </p>
              )}

              <div className="mt-10 rounded-3xl border border-line bg-panel/70 p-5 backdrop-blur">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold">Scegli uno spettacolo</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {film.showtimes.map((s) => (
                    <Link key={s.id} href={`/prenota?spettacolo=${s.id}`}
                      className="group flex items-center justify-between rounded-2xl border border-line px-4 py-3 transition hover:border-gold hover:bg-gold hover:text-ink">
                      <span className="flex items-center gap-3 text-sm"><CalendarDays className="size-4 opacity-60" />{longDate(s.date)}</span>
                      <span className="font-poster text-2xl tracking-wide">{s.time}</span>
                    </Link>
                  ))}
                </div>
                <Link href={`/prenota?film=${film.slug}`} className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-ink transition hover:scale-[1.03]">
                  <Ticket className="size-5" /> Prenota il posto
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mb-8 font-display text-3xl">Anche in sala</h2>
          <div className="grid grid-cols-1 gap-8 min-[480px]:grid-cols-2 lg:grid-cols-3">
            {others.map((f) => <FilmCard key={f.slug} film={f} />)}
          </div>
        </section>
      )}
    </>
  );
}
