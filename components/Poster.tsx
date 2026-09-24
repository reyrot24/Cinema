type Props = {
  title: string;
  subtitle?: string;
  palette: [string, string];
  badge?: string;
  label?: string;
  className?: string;
};

/**
 * Locandina generata: il sito originale non espone le locandine ufficiali,
 * quindi ogni titolo ha un'artwork tipografica basata sulla sua palette.
 */
export function Poster({ title, subtitle, palette: [a, b], badge, label = "Cine Teatro Andrisani", className = "" }: Props) {
  return (
    <div
      className={`grain relative isolate aspect-[2/3] overflow-hidden rounded-2xl ${className}`}
      style={{ background: `linear-gradient(160deg, ${a} 0%, #07080c 85%)` }}
    >
      <div
        className="absolute -right-1/4 -top-1/4 aspect-square w-[120%] rounded-full opacity-70 blur-2xl"
        style={{ background: `radial-gradient(circle, ${b} 0%, transparent 60%)` }}
      />
      <div className="absolute inset-0 opacity-30">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute left-1/2 top-[38%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border"
            style={{ width: `${40 + i * 28}%`, borderColor: b }}
          />
        ))}
      </div>
      <div
        className="absolute inset-x-0 bottom-0 h-2/3"
        style={{ background: "linear-gradient(to top, #07080c 10%, transparent)" }}
      />

      <div className="relative flex h-full flex-col justify-between p-[7%]">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[0.55em] uppercase tracking-[0.3em] text-white/60">{label}</span>
          {badge && (
            <span className="rounded-full bg-gold px-2 py-0.5 text-[0.55em] font-bold uppercase tracking-wider text-ink">
              {badge}
            </span>
          )}
        </div>
        <div>
          <p className="font-poster text-[2.6em] uppercase leading-[0.85] tracking-wide text-white text-balance">
            {title}
          </p>
          {subtitle && (
            <p className="mt-2 font-display text-[0.8em] italic" style={{ color: b }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
