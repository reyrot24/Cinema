import type { Metadata } from "next";
import { films, findShowtime, getFilm } from "@/lib/data";
import { BookingWizard } from "@/components/booking/BookingWizard";

export const metadata: Metadata = { title: "Prenota un posto" };

export default async function PrenotaPage({ searchParams }: PageProps<"/prenota">) {
  const params = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

  const match = findShowtime(one(params.spettacolo) ?? "");
  const film = match?.film ?? getFilm(one(params.film) ?? "");

  return (
    <section className="relative mx-auto max-w-7xl px-4 pb-10 pt-32 sm:px-6">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">Prenotazione online</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">
          Il tuo posto, <em className="text-gold">senza fila.</em>
        </h1>
        <div className="mt-10">
          <BookingWizard key={`${film?.slug}-${match?.show.id}`} films={films} initialFilm={film?.slug} initialShow={match?.show.id} />
        </div>
      </div>
    </section>
  );
}
