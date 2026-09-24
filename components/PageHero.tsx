import { Reveal } from "./Reveal";

export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden pb-14 pt-36 sm:pt-44">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-gold">{eyebrow}</p>
          <h1 className="max-w-4xl font-display text-5xl leading-[0.95] tracking-tight text-balance sm:text-7xl">{title}</h1>
          {children && <div className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{children}</div>}
        </Reveal>
      </div>
    </section>
  );
}
