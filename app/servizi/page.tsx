import type { Metadata } from "next";
import { Accessibility, Megaphone, Popcorn, ShieldCheck, Ticket } from "lucide-react";
import { services } from "@/lib/data";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = { title: "Servizi" };

const icons = { accessibility: Accessibility, popcorn: Popcorn, ticket: Ticket, megaphone: Megaphone };

export default function ServiziPage() {
  return (
    <>
      <PageHero eyebrow="Servizi" title={<>Il valore aggiunto <em className="text-gold">del Cine Teatro</em></>}>
        Una struttura polifunzionale e tecnologicamente avanzata che unisce qualità di proiezione, audio e comfort a servizi pensati per le persone.
      </PageHero>
      <section className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2">
        {services.map((s, i) => {
          const Icon = icons[s.icon];
          return (
            <Reveal key={s.title} delay={i * 0.06}>
              <div className="group relative h-full overflow-hidden rounded-[2rem] border border-line bg-panel p-8 sm:p-10">
                <Icon className="absolute -right-6 -top-6 size-40 text-white/[.03] transition duration-700 group-hover:rotate-12 group-hover:text-gold/10" />
                <div className="grid size-14 place-items-center rounded-2xl bg-gold text-ink"><Icon className="size-7" /></div>
                <h2 className="mt-6 font-display text-3xl">{s.title}</h2>
                <p className="mt-3 max-w-md leading-relaxed text-muted">{s.text}</p>
              </div>
            </Reveal>
          );
        })}
        <Reveal className="md:col-span-2">
          <p className="flex items-center gap-3 rounded-2xl border border-dashed border-line p-5 text-sm text-muted">
            <ShieldCheck className="size-5 text-gold" /> Trasparenza: il Cine Teatro adempie a quanto richiesto dal D.L. n° 91/2013 art. 9 com. 2.
          </p>
        </Reveal>
      </section>
    </>
  );
}
