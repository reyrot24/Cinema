import Link from "next/link";

export default function NotFound() {
  return (
    <section className="grid min-h-[70vh] place-items-center px-4 pt-24 text-center">
      <div>
        <p className="font-poster text-[10rem] leading-none text-gold">404</p>
        <h1 className="font-display text-3xl">Questa scena è stata tagliata.</h1>
        <p className="mt-3 text-muted">La pagina che cerchi non esiste o la prenotazione non è stata trovata.</p>
        <Link href="/" className="mt-8 inline-block rounded-full bg-gold px-6 py-3 font-semibold text-ink">Torna alla home</Link>
      </div>
    </section>
  );
}
