import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  children,
  action,
}: {
  eyebrow: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-2xl">
        <p className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          <span className="h-px w-8 bg-gold" />
          {eyebrow}
        </p>
        <h2 className="font-display text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl">{title}</h2>
        {children && <p className="mt-4 text-muted leading-relaxed">{children}</p>}
      </div>
      {action}
    </Reveal>
  );
}
