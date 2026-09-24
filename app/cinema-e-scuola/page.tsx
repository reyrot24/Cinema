import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = { title: "Cinema & Scuola" };

const steps = [
  { n: "01", title: "Visione", text: "In orario curricolare gli studenti di ogni ordine e grado vedono tre film, preparati da schede informative con spunti di riflessione." },
  { n: "02", title: "Cineforum", text: "Dopo la proiezione, un dibattito in sala tra alunni, docenti e moderatore del Cine Teatro favorisce una crescita culturale e critica." },
  { n: "03", title: "Elaborati", text: "In classe i ragazzi completano il percorso con elaborati scritti. I docenti scelgono l'alunno più meritevole di ogni istituto." },
  { n: "04", title: "Selezione finale", text: "In sala una commissione del Giffoni sottopone i finalisti a un'ulteriore prova. A tutti vengono rilasciati attestati di merito." },
  { n: "05", title: "Giurati a Giffoni", text: "Per circa dieci giorni i vincitori sono protagonisti del festival: visioni, incontri, interviste, dibattiti e concerti." },
];

export default function ScuolaPage() {
  return (
    <>
      <PageHero eyebrow="Cinema & Scuola · 21ª edizione" title={<>Vivere il cinema <em className="text-gold">tra sogno e realtà</em></>}>
        Progetti di educazione all&apos;immagine rivolti a tutte le scuole, abbinati al Giffoni Film Festival. Per scolaresche dai 6 ai 18 anni; il concorso è aperto ai ragazzi dai 9 ai 18 anni.
      </PageHero>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="relative aspect-[16/8] overflow-hidden rounded-[2rem] border border-line">
          <Image src="/images/scuola.jpg" alt="I ragazzi di Cinema & Scuola sul palco del Cine Teatro" fill className="object-cover" sizes="100vw" priority />
        </Reveal>

        <div className="mt-20 grid gap-12 lg:grid-cols-2">
          <Reveal className="space-y-5 leading-relaxed text-cream/80">
            <p className="font-display text-2xl text-cream">Il cinema ha rappresentato per il XX secolo la principale modalità espressiva di tutti i movimenti culturali: le nuove generazioni devono confrontarsi con esso.</p>
            <p>La sezione Cinema e Scuola, realizzata in collaborazione con gli enti capofila nella promozione del cinema, propone percorsi sull&apos;educazione all&apos;immagine e sul linguaggio cinematografico. Affiancando formatori ed esperti ai docenti, sviluppa creatività e senso critico e insegna a decodificare il linguaggio dei mass media.</p>
            <p>Il progetto nasce nel 1999 con pochi istituti, sui film selezionati dal Dipartimento Cinema di Agiscuola Nazionale con il patrocinio del Ministero della Pubblica Istruzione. Dal 2003 prende il nome “Vivere il cinema tra sogno e realtà” ed è abbinato al concorso Giffoni Film Festival.</p>
          </Reveal>
          <Reveal delay={0.1} className="relative overflow-hidden rounded-[2rem] border border-line">
            <Image src="/images/giffoni.jpg" alt="I giurati di Montescaglioso al Giffoni Film Festival" width={1024} height={768} className="h-full w-full object-cover" />
            <blockquote className="absolute inset-x-4 bottom-4 rounded-2xl bg-ink/80 p-5 backdrop-blur">
              <p className="font-display text-lg italic">«Di tutti i festival del cinema, quello di Giffoni è il più necessario.»</p>
              <footer className="mt-2 text-xs uppercase tracking-widest text-gold">François Truffaut, 1982</footer>
            </blockquote>
          </Reveal>
        </div>

        <h2 className="mt-24 font-display text-4xl">Il percorso</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-5">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <li className="h-full rounded-3xl border border-line bg-panel p-6">
                <span className="font-poster text-5xl text-gold">{s.n}</span>
                <p className="mt-3 font-display text-xl">{s.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>
    </>
  );
}
