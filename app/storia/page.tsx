import type { Metadata } from "next";
import { history } from "@/lib/data";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = { title: "La Storia" };

export default function StoriaPage() {
  return (
    <>
      <PageHero eyebrow="La Storia siamo noi" title={<>La storia del cinema italiano <em className="text-gold">attraverso una sala.</em></>}>
        La cronistoria delle fasi più significative della gestione della sala cinematografica della famiglia Disabato.
      </PageHero>
      <section className="mx-auto max-w-4xl px-4 sm:px-6">
        <ol className="relative border-l border-line pl-8 sm:pl-12">
          {history.map((h, i) => (
            <Reveal key={h.period} delay={i * 0.05} className="relative pb-16 last:pb-0">
              <li>
                <span className="absolute -left-[41px] top-1 grid size-5 place-items-center rounded-full bg-ink ring-1 ring-gold sm:-left-[57px]">
                  <span className="size-2 rounded-full bg-gold" />
                </span>
                <p className="font-poster text-4xl tracking-wide text-gold">{h.period}</p>
                <h2 className="mt-1 font-display text-3xl">{h.title}</h2>
                <p className="mt-3 leading-relaxed text-muted">{h.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>
    </>
  );
}
