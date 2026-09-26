import type { Metadata } from "next";
import { Mail, MapPin, Navigation, Phone } from "lucide-react";
import { cinema } from "@/lib/data";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = { title: "Contatti e dove siamo" };

export default function ContattiPage() {
  const q = encodeURIComponent(cinema.mapsQuery);
  return (
    <>
      <PageHero eyebrow="Contatti · Dove siamo" title={<>Vieni a <em className="text-gold">trovarci.</em></>}>
        Cerca la strada più facile per raggiungerci, oppure scrivici per informazioni su programmazione, scuole ed eventi.
      </PageHero>
      <section className="mx-auto grid grid-cols-1 max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
        <Reveal className="space-y-3">
          {[
            { icon: MapPin, label: "Indirizzo", value: `${cinema.address}, ${cinema.city} (${cinema.province})`, href: `https://www.google.com/maps/search/?api=1&query=${q}` },
            { icon: Phone, label: "Telefono", value: cinema.phone, href: cinema.phoneHref },
            ...cinema.emails.map((e) => ({ icon: Mail, label: "Email", value: e, href: `mailto:${e}` })),
          ].map(({ icon: Icon, label, value, href }) => (
            <a key={value} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-line bg-panel p-5 transition hover:border-gold">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-gold/10 text-gold transition group-hover:bg-gold group-hover:text-ink"><Icon className="size-5" /></span>
              <span className="min-w-0">
                <span className="block text-xs uppercase tracking-widest text-muted">{label}</span>
                <span className="block break-all font-semibold">{value}</span>
              </span>
            </a>
          ))}
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${q}`} target="_blank" rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 font-semibold text-ink transition hover:scale-[1.03]">
            <Navigation className="size-5" /> Indicazioni stradali
          </a>
        </Reveal>
        <Reveal delay={0.1} className="min-h-[420px] overflow-hidden rounded-[2rem] border border-line">
          <iframe
            title="Mappa del Cine Teatro Andrisani"
            src={`https://www.google.com/maps?q=${q}&output=embed`}
            className="h-full min-h-[420px] w-full grayscale invert-[.9] hue-rotate-180"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
      </section>
    </>
  );
}
