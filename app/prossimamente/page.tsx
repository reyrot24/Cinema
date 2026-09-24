import type { Metadata } from "next";
import { Bell } from "lucide-react";
import { cinema, upcoming } from "@/lib/data";
import { PageHero } from "@/components/PageHero";
import { Poster } from "@/components/Poster";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = { title: "Prossimamente" };

export default function ProssimamentePage() {
  return (
    <>
      <PageHero eyebrow="Prossimamente" title={<>La programmazione che stiamo <em className="text-gold">selezionando per voi</em></>}>
        Ecco cosa vedremo prossimamente al Cine Teatro N. Andrisani di Montescaglioso: rassegne, teatro e i progetti per le scuole.
      </PageHero>
      <section className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6">
        {upcoming.map((u, i) => (
          <Reveal key={u.slug} delay={i * 0.05}>
            <article className="group grid overflow-hidden rounded-[2rem] border border-line bg-panel md:grid-cols-[280px_1fr]">
              <div className="text-[18px]">
                <Poster title={u.title} palette={u.palette} label={u.kind} className="!rounded-none transition duration-700 group-hover:scale-[1.03]" />
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-12">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{u.kind} · {u.period}</p>
                <h2 className="mt-3 font-display text-4xl">{u.title}</h2>
                <p className="mt-4 max-w-2xl leading-relaxed text-muted">{u.description}</p>
              </div>
            </article>
          </Reveal>
        ))}
        <Reveal>
          <div className="flex flex-col items-start gap-4 rounded-[2rem] border border-dashed border-line p-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-3 text-cream/80"><Bell className="size-5 text-gold" /> I nuovi titoli vengono annunciati ogni settimana sui nostri canali social.</p>
            <a href={cinema.social.facebook} target="_blank" rel="noreferrer" className="rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-gold">
              Seguici su Facebook
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
