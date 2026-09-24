import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard, Ticket } from "lucide-react";
import { paymentCards } from "@/lib/data";
import { PageHero } from "@/components/PageHero";
import { PriceCards } from "@/components/PriceCards";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = { title: "Tariffe" };

export default function TariffePage() {
  return (
    <>
      <PageHero eyebrow="Tariffe" title={<>Il cinema, <em className="text-gold">alla portata di tutti.</em></>}>
        Prezzi semplici e agevolazioni per bambini, over 65 e per chi usa le carte nazionali.
      </PageHero>
      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <PriceCards />

        <Reveal className="mt-20">
          <h2 className="font-display text-3xl">Al CTNA puoi utilizzare</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {paymentCards.map((c, i) => (
              <div key={c.name} className="flex items-center gap-4 rounded-2xl border border-line bg-panel p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-azure/20 font-poster text-xl text-gold">{i + 1}</span>
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-sm text-muted">{c.note}</p>
                </div>
                <CreditCard className="ml-auto size-5 text-muted" />
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-16 flex flex-col items-center gap-4 text-center">
          <p className="text-muted">Prenota online e ritira i biglietti in cassa, senza fila.</p>
          <Link href="/prenota" className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 font-semibold text-ink transition hover:scale-[1.03]">
            <Ticket className="size-5" /> Prenota un posto
          </Link>
        </Reveal>
      </section>
    </>
  );
}
