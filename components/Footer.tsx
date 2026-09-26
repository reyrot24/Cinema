import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { cinema } from "@/lib/data";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-line bg-night">
      <div className="film-strip h-3.5 bg-gold/90" />
      <div className="mx-auto grid grid-cols-1 max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="" width={48} height={48} />
            <p className="font-display text-2xl">{cinema.name}</p>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Cinema, teatro ed eventi a Montescaglioso. La storia del cinema raccontata dalla sala della
            famiglia Disabato, dal 1957.
          </p>
          <div className="mt-6 flex gap-2">
            <a href={cinema.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"
              className="grid size-10 place-items-center rounded-full border border-line transition hover:border-gold hover:text-gold">
              <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden><path d="M14 8.5V6.8c0-.8.5-1 .9-1H17V2.1L14.1 2C10.9 2 10.2 4.4 10.2 6v2.5H8v3.9h2.2V22H14v-9.6h2.8l.4-3.9H14z" /></svg>
            </a>
            <a href={cinema.social.twitter} target="_blank" rel="noreferrer" aria-label="X (Twitter)"
              className="grid size-10 place-items-center rounded-full border border-line transition hover:border-gold hover:text-gold">
              <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden><path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z" /></svg>
            </a>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Esplora</p>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            {[
              ["/programmazione", "Programmazione"],
              ["/prossimamente", "Prossimamente"],
              ["/tariffe", "Tariffe"],
              ["/prenota", "Prenota un posto"],
              ["/cinema-e-scuola", "Cinema & Scuola"],
              ["/servizi", "Servizi"],
              ["/storia", "La Storia"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="transition hover:text-gold">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Dove siamo</p>
          <ul className="mt-4 space-y-3 text-sm text-cream/80">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-muted" />
              <span>{cinema.address}<br />{cinema.city} ({cinema.province})</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-muted" />
              <a href={cinema.phoneHref} className="hover:text-gold">{cinema.phone}</a>
            </li>
            {cinema.emails.map((e) => (
              <li key={e} className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-muted" />
                <a href={`mailto:${e}`} className="break-all hover:text-gold">{e}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line px-4 py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} {cinema.name} · Via Bellini 6, Montescaglioso · Trasparenza ai sensi del D.L. n° 91/2013 art. 9 c. 2
      </div>
    </footer>
  );
}
