export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-line bg-gold py-3 text-ink">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {[...row, ...row].map((t, i) => (
          <span key={i} className="flex items-center gap-10 font-poster text-2xl tracking-wider">
            {t}
            <span className="size-2 rounded-full bg-ink/60" />
          </span>
        ))}
      </div>
    </div>
  );
}
