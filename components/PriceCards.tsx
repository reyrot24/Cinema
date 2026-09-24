import { prices, ticketTypes } from "@/lib/data";
import { euro } from "@/lib/format";
import { Reveal } from "./Reveal";

export function PriceCards({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-3"}`}>
      {ticketTypes.map((t, i) => (
        <Reveal key={t.id} delay={i * 0.08}>
          <div
            className={`relative h-full overflow-hidden rounded-3xl border ${compact ? "p-5" : "p-6"} ${
              i === 0 ? "border-gold/40 bg-gold text-ink" : "border-line bg-panel"
            }`}
          >
            <p className={`text-xs uppercase tracking-[0.25em] ${i === 0 ? "text-ink/70" : "text-muted"}`}>{t.label}</p>
            <p className={`font-poster leading-none ${compact ? "mt-1 text-5xl" : "mt-3 text-7xl"}`}>{euro(t.price)}</p>
            <p className={`${compact ? "mt-2" : "mt-4"} text-sm ${i === 0 ? "text-ink/80" : "text-muted"}`}>{t.description}</p>
            <div
              className={`absolute -right-6 -top-6 size-24 rounded-full border-[10px] border-dashed ${
                i === 0 ? "border-ink/10" : "border-white/5"
              }`}
            />
          </div>
        </Reveal>
      ))}
      <Reveal className={compact ? "" : "sm:col-span-3"} delay={0.2}>
        <p className="rounded-2xl border border-dashed border-line px-5 py-4 text-sm text-muted">
          <span className="font-semibold text-cream">Film in 3D:</span> supplemento di {euro(prices.supplement3D)} su ogni
          biglietto.
        </p>
      </Reveal>
    </div>
  );
}
