import Image from "next/image";
import Link from "next/link";
import { Accessibility, ArrowRight, MapPin, Megaphone, Popcorn, Ticket } from "lucide-react";
import { cinema, films, programmingDays, services, upcoming } from "@/lib/data";
import { rangeLabel } from "@/lib/format";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { FilmCard } from "@/components/FilmCard";
import { ScheduleBoard } from "@/components/ScheduleBoard";
import { SectionHeading } from "@/components/SectionHeading";
import { PriceCards } from "@/components/PriceCards";
import { Reveal } from "@/components/Reveal";
import { Poster } from "@/components/Poster";

const serviceIcons = { accessibility: Accessibility, popcorn: Popcorn, ticket: Ticket, megaphone: Megaphone };

export default function Home() {
  const days = programmingDays();

  return (
    <>
      <Hero films={films} weekLabel={rangeLabel(days)} />

      <Marquee items={films.map((f) => f.title)} />

      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <SectionHeading
          eyebrow="In programmazione"
          title={<>Questa settimana <em className="text-gold">in sala</em></>}
          action={
            <Link href="/programmazione" className="group inline-flex items-center gap-2 text-sm font-semibold hover:text-gold">
              Tutta la programmazione <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>
          }
        />
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 min-[480px]:grid-cols-2 lg:grid-cols-4">
          {films.map((film, i) => (
            <Reveal key={film.slug} delay={i * 0.08}>
              <FilmCard film={film} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-28 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <SectionHeading eyebrow="Orari" title="Scegli il giorno, scegli il film.">
              Spettacolo unico per ogni film. Tocca un orario per prenotare il tuo posto in sala.
            </SectionHeading>
            <Reveal>
              <ScheduleBoard films={films} days={days} />
            </Reveal>
          </div>
          <div>
            <SectionHeading eyebrow="Tariffe" title="Biglietti" />
            <PriceCards compact />
            <Reveal className="mt-4">
              <Link href="/tariffe" className="group inline-flex items-center gap-2 text-sm font-semibold hover:text-gold">
                Carte e agevolazioni accettate <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-28 sm:px-6">
        <SectionHeading
          eyebrow="Prossimamente"
          title="La stagione che stiamo preparando per voi"
          action={
            <Link href="/prossimamente" className="group inline-flex items-center gap-2 text-sm font-semibold hover:text-gold">
              Scopri di più <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>
          }
        />
        <div className="grid gap-6 md:grid-cols-3">
          {upcoming.map((u, i) => (
            <Reveal key={u.slug} delay={i * 0.1}>
              <Link href="/prossimamente" className="group block overflow-hidden rounded-3xl border border-line bg-panel">
                <div className="relative aspect-[16/10] overflow-hidden text-[18px]">
                  <Poster title={u.title} palette={u.palette} label={u.kind} className="!aspect-auto h-full !rounded-none transition duration-700 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-gold">{u.period}</p>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{u.description}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-28 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-line">
          <Image src="/images/scuola.jpg" alt="Studenti di Cinema & Scuola sul palco del Cine Teatro Andrisani" fill className="object-cover" sizes="(min-width: 1280px) 1280px, 100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/20" />
          <Reveal className="relative max-w-xl p-8 sm:p-14">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Cinema & Scuola · 21ª edizione</p>
            <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
              Vivere il cinema, <em>tra sogno e realtà.</em>
            </h2>
            <p className="mt-5 leading-relaxed text-cream/80">
              Dal 1999 il progetto di educazione all&apos;immagine per le scuole di ogni ordine e grado, abbinato al
              Giffoni Film Festival. I ragazzi più meritevoli partono come giurati.
            </p>
            <Link href="/cinema-e-scuola" className="mt-8 inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3 font-semibold text-ink transition hover:bg-gold">
              Scopri il progetto <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-28 sm:px-6">
        <SectionHeading eyebrow="Servizi" title="Il valore aggiunto del Cine Teatro" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => {
            const Icon = serviceIcons[s.icon];
            return (
              <Reveal key={s.title} delay={i * 0.08}>
                <div className="group h-full rounded-3xl border border-line bg-panel p-6 transition hover:-translate-y-1 hover:border-gold/40">
                  <div className="grid size-12 place-items-center rounded-2xl bg-gold/10 text-gold transition group-hover:bg-gold group-hover:text-ink">
                    <Icon className="size-6" />
                  </div>
                  <p className="mt-5 font-display text-xl">{s.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-28 sm:px-6">
        <Reveal className="grid items-center gap-8 rounded-[2rem] bg-gradient-to-br from-azure/30 via-panel to-panel p-8 sm:p-12 md:grid-cols-[1fr_auto]">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              <MapPin className="size-4" /> {cinema.city}
            </p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">Ci vediamo in sala.</h2>
            <p className="mt-3 text-muted">{cinema.address}, {cinema.city} ({cinema.province}) · {cinema.phone}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contatti" className="rounded-full border border-line px-6 py-3.5 font-semibold transition hover:border-cream">
              Come arrivare
            </Link>
            <Link href="/prenota" className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 font-semibold text-ink transition hover:scale-[1.03]">
              <Ticket className="size-5" /> Prenota ora
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
