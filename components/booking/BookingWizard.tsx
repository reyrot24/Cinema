"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowLeft, ArrowRight, Check, Loader2, Minus, Plus, Ticket } from "lucide-react";
import type { Film, TicketTypeId } from "@/lib/data";
import { dayNumber, euro, longDate, monthShort, shortWeekday } from "@/lib/format";
import { MAX_SEATS_PER_BOOKING, TOTAL_SEATS } from "@/lib/seats";
import { availableTicketTypes, computeTotal } from "@/lib/pricing";
import { Poster } from "../Poster";
import { SeatMap } from "./SeatMap";

const STEPS = ["Film", "Spettacolo", "Posti", "Dati"] as const;

type Props = {
  films: Film[];
  initialFilm?: string;
  initialShow?: string;
};

export function BookingWizard({ films, initialFilm, initialShow }: Props) {
  const router = useRouter();
  const [filmSlug, setFilmSlug] = useState(initialFilm);
  const [showId, setShowId] = useState(initialShow);
  const [step, setStep] = useState(initialShow ? 2 : initialFilm ? 1 : 0);
  const [direction, setDirection] = useState(1);

  const [seatData, setSeatData] = useState<{ showId?: string; taken: Set<string> }>({ taken: new Set() });
  const taken = seatData.taken;
  const loadingSeats = !!showId && seatData.showId !== showId;
  const [seats, setSeats] = useState<string[]>([]);
  // biglietti non interi: l'intero copre sempre i posti restanti
  const [discounted, setDiscounted] = useState<Partial<Record<TicketTypeId, number>>>({});

  const [form, setForm] = useState({ name: "", email: "", phone: "", privacy: false });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const film = films.find((f) => f.slug === filmSlug);
  const show = film?.showtimes.find((s) => s.id === showId);

  const loadSeats = useCallback(async (id: string) => {
    const res = await fetch(`/api/seats?showtime=${encodeURIComponent(id)}`, { cache: "no-store" });
    const data = await res.json();
    const set = new Set<string>(data.taken ?? []);
    setSeatData({ showId: id, taken: set });
    return set;
  }, []);

  useEffect(() => {
    if (!showId) return;
    let cancelled = false;
    fetch(`/api/seats?showtime=${encodeURIComponent(showId)}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setSeatData({ showId, taken: new Set<string>(data.taken ?? []) });
      })
      .catch(() => !cancelled && setError("Impossibile caricare la sala. Riprova."));
    return () => {
      cancelled = true;
    };
  }, [showId]);

  const ticketOptions = show ? availableTicketTypes(show.date) : [];
  const discountedCount = Object.values(discounted).reduce((a, b) => a + (b ?? 0), 0);
  const tickets = useMemo(
    () => ({ ...discounted, intero: seats.length - discountedCount }),
    [discounted, seats.length, discountedCount],
  );
  const total = film && show ? computeTotal(film, show.date, tickets)?.total ?? 0 : 0;

  function go(to: number) {
    setDirection(to > step ? 1 : -1);
    setError(null);
    setStep(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function chooseFilm(slug: string) {
    if (slug !== filmSlug) {
      setShowId(undefined);
      setSeats([]);
      setDiscounted({});
    }
    setFilmSlug(slug);
    go(1);
  }

  function chooseShow(id: string) {
    if (id !== showId) {
      setSeats([]);
      setDiscounted({});
    }
    setShowId(id);
    go(2);
  }

  function toggleSeat(id: string) {
    setError(null);
    if (seats.includes(id)) {
      const next = seats.filter((s) => s !== id);
      setSeats(next);
      shrinkDiscounted(next.length);
      return;
    }
    if (seats.length >= MAX_SEATS_PER_BOOKING) {
      setError(`Puoi prenotare al massimo ${MAX_SEATS_PER_BOOKING} posti per volta.`);
      return;
    }
    setSeats([...seats, id].sort(seatOrder));
  }

  function shrinkDiscounted(max: number) {
    setDiscounted((d) => {
      let excess = Object.values(d).reduce((a, b) => a + (b ?? 0), 0) - max;
      if (excess <= 0) return d;
      const next = { ...d };
      for (const key of ["giovani", "ridotto"] as TicketTypeId[]) {
        const take = Math.min(next[key] ?? 0, excess);
        next[key] = (next[key] ?? 0) - take;
        excess -= take;
      }
      return next;
    });
  }

  function changeTicket(id: TicketTypeId, delta: number) {
    if (id === "intero") return;
    setDiscounted((d) => {
      const value = (d[id] ?? 0) + delta;
      if (value < 0 || discountedCount + delta > seats.length) return d;
      return { ...d, [id]: value };
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!show) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showtimeId: show.id,
          seats,
          tickets,
          name: form.name,
          email: form.email,
          phone: form.phone,
        }),
      });
      const data = await res.json();
      if (res.status === 409) {
        await loadSeats(show.id);
        setSeats((cur) => cur.filter((s) => !data.seats?.includes(s)));
        shrinkDiscounted(seats.length - (data.seats?.length ?? 0));
        setDirection(-1);
        setStep(2);
        setError(`I posti ${data.seats.join(", ")} sono appena stati prenotati da qualcun altro. Scegline altri.`);
        return;
      }
      if (!res.ok) {
        setError(data.error ?? "Qualcosa è andato storto. Riprova.");
        return;
      }
      router.push(`/biglietto/${data.code}`);
    } catch {
      setError("Connessione non riuscita. Riprova.");
    } finally {
      setSubmitting(false);
    }
  }

  const canNext = [!!film, !!show, seats.length > 0, true][step];
  const free = TOTAL_SEATS - taken.size;

  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_340px]">
      <div className="min-w-0">
        <Stepper step={step} onJump={(i) => i < step && go(i)} />

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 flex items-start gap-3 overflow-hidden rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200"
              role="alert"
            >
              <AlertCircle className="size-5 shrink-0" /> {error}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="relative mt-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 0 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {films.map((f) => (
                    <button
                      key={f.slug}
                      onClick={() => chooseFilm(f.slug)}
                      className="group text-left text-[13px]"
                    >
                      <Poster
                        title={f.title}
                        subtitle={f.subtitle}
                        palette={f.palette}
                        badge={f.badge}
                        className={`ring-2 transition duration-300 group-hover:-translate-y-1 ${
                          f.slug === filmSlug ? "ring-gold" : "ring-transparent group-hover:ring-white/30"
                        }`}
                      />
                      <p className="mt-3 text-sm font-semibold">{f.title}</p>
                      <p className="text-xs text-muted">{f.showtimes.length} spettacoli</p>
                    </button>
                  ))}
                </div>
              )}

              {step === 1 && film && (
                <div>
                  <h2 className="font-display text-3xl">Quando vuoi venire?</h2>
                  <p className="mt-1 text-muted">{film.title}{film.subtitle && ` · ${film.subtitle}`}</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {film.showtimes.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => chooseShow(s.id)}
                        className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                          s.id === showId ? "border-gold bg-gold/10" : "border-line bg-panel hover:border-white/30"
                        }`}
                      >
                        <span className="grid w-14 shrink-0 place-items-center rounded-xl bg-ink py-2 text-center">
                          <span className="text-[10px] uppercase tracking-widest text-muted">{shortWeekday(s.date)}</span>
                          <span className="font-display text-2xl leading-none">{dayNumber(s.date)}</span>
                          <span className="text-[10px] uppercase text-muted">{monthShort(s.date)}</span>
                        </span>
                        <span className="flex-1">
                          <span className="block text-sm text-muted">{longDate(s.date)}</span>
                          <span className="font-poster text-4xl tracking-wide text-gold">{s.time}</span>
                        </span>
                        <ArrowRight className="size-5 text-muted transition group-hover:translate-x-1 group-hover:text-cream" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && show && film && (
                <div>
                  <div className="flex flex-wrap items-end justify-between gap-2">
                    <div>
                      <h2 className="font-display text-3xl">Scegli i tuoi posti</h2>
                      <p className="mt-1 text-muted">
                        {longDate(show.date)} · ore {show.time}
                      </p>
                    </div>
                    <p className="text-sm text-muted">
                      {loadingSeats ? "Carico la sala…" : `${free} posti liberi su ${TOTAL_SEATS}`}
                    </p>
                  </div>
                  <div className="mt-8 rounded-3xl border border-line bg-panel/60 p-4 sm:p-8">
                    <SeatMap taken={taken} selected={seats} onToggle={toggleSeat} loading={loadingSeats} />
                  </div>

                  {seats.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                      <h3 className="font-display text-2xl">Tipologia biglietti</h3>
                      <div className="mt-4 space-y-2">
                        {ticketOptions.map((t) => {
                          const qty = tickets[t.id] ?? 0;
                          return (
                            <div key={t.id} className="flex items-center gap-4 rounded-2xl border border-line bg-panel p-4">
                              <div className="flex-1">
                                <p className="font-semibold">
                                  {t.label} <span className="ml-1 text-gold">{euro(t.price)}</span>
                                </p>
                                <p className="text-xs text-muted">
                                  {t.id === "intero" ? "Assegnato automaticamente ai posti restanti" : t.description}
                                </p>
                              </div>
                              {t.id === "intero" ? (
                                <span className="w-24 text-center font-poster text-3xl">{qty}</span>
                              ) : (
                                <div className="flex w-24 items-center justify-between">
                                  <QtyButton onClick={() => changeTicket(t.id, -1)} disabled={qty === 0} label={`Rimuovi ${t.label}`}>
                                    <Minus className="size-4" />
                                  </QtyButton>
                                  <span className="font-poster text-3xl">{qty}</span>
                                  <QtyButton onClick={() => changeTicket(t.id, 1)} disabled={discountedCount >= seats.length} label={`Aggiungi ${t.label}`}>
                                    <Plus className="size-4" />
                                  </QtyButton>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {step === 3 && show && (
                <form id="booking-form" onSubmit={submit} className="space-y-5">
                  <div>
                    <h2 className="font-display text-3xl">I tuoi dati</h2>
                    <p className="mt-1 text-muted">Ti servono per ritirare i biglietti in cassa.</p>
                  </div>
                  <Field label="Nome e cognome" autoComplete="name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required minLength={2} />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Email" type="email" autoComplete="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
                    <Field label="Telefono" type="tel" autoComplete="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required pattern="[+\d][\d\s]{5,}" />
                  </div>
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
                    <input
                      type="checkbox"
                      required
                      checked={form.privacy}
                      onChange={(e) => setForm({ ...form, privacy: e.target.checked })}
                      className="mt-0.5 size-4 accent-[var(--color-gold)]"
                    />
                    Acconsento al trattamento dei dati personali ai soli fini della prenotazione.
                  </label>
                  <div className="rounded-2xl border border-dashed border-line p-4 text-sm text-muted">
                    <p className="font-semibold text-cream">Pagamento in cassa</p>
                    I posti restano riservati fino a 15 minuti prima dell&apos;inizio. In cassa puoi pagare anche con Carta
                    della Cultura, Carta Docente e Carta del Merito.
                  </div>
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {step > 0 && (
          <div className="mt-10 flex items-center justify-between gap-3 border-t border-line pt-6">
            <button onClick={() => go(step - 1)} className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm text-muted transition hover:text-cream">
              <ArrowLeft className="size-4" /> Indietro
            </button>
            {step < 3 ? (
              <button
                onClick={() => go(step + 1)}
                disabled={!canNext}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-ink transition enabled:hover:scale-[1.03] disabled:opacity-30"
              >
                Continua <ArrowRight className="size-4" />
              </button>
            ) : (
              <button
                type="submit"
                form="booking-form"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-ink transition enabled:hover:scale-[1.03] disabled:opacity-60"
              >
                {submitting ? <Loader2 className="size-4 animate-spin" /> : <Ticket className="size-4" />}
                Conferma prenotazione
              </button>
            )}
          </div>
        )}
      </div>

      <Summary film={film} show={show} seats={seats} tickets={tickets} total={total} />
    </div>
  );
}

function seatOrder(a: string, b: string) {
  return a[0] === b[0] ? Number(a.slice(1)) - Number(b.slice(1)) : a.localeCompare(b);
}

function Stepper({ step, onJump }: { step: number; onJump: (i: number) => void }) {
  return (
    <ol className="flex items-center gap-2">
      {STEPS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <button
              onClick={() => onJump(i)}
              disabled={!done}
              className="flex items-center gap-2 text-sm disabled:cursor-default"
            >
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold transition ${
                  active ? "bg-gold text-ink" : done ? "bg-cream text-ink" : "border border-line text-muted"
                }`}
              >
                {done ? <Check className="size-4" /> : i + 1}
              </span>
              <span className={`hidden sm:inline ${active ? "text-cream" : "text-muted"}`}>{label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <span className="relative h-px flex-1 bg-line">
                <motion.span
                  className="absolute inset-y-0 left-0 bg-gold"
                  initial={false}
                  animate={{ width: done ? "100%" : "0%" }}
                  transition={{ duration: 0.4 }}
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Summary({
  film,
  show,
  seats,
  tickets,
  total,
}: {
  film?: Film;
  show?: Film["showtimes"][number];
  seats: string[];
  tickets: Partial<Record<TicketTypeId, number>>;
  total: number;
}) {
  return (
    <aside className="lg:sticky lg:top-28">
      <div className="overflow-hidden rounded-3xl border border-line bg-panel">
        {film ? (
          <div className="flex gap-4 p-5">
            <div className="w-20 shrink-0 text-[7px]">
              <Poster title={film.title} palette={film.palette} label="" className="!rounded-lg" />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-widest text-muted">{film.genre}</p>
              <p className="font-display text-xl leading-tight">{film.title}</p>
              {film.subtitle && <p className="text-sm text-muted">{film.subtitle}</p>}
            </div>
          </div>
        ) : (
          <p className="p-5 text-sm text-muted">Scegli un film per iniziare.</p>
        )}

        <div className="relative border-t border-dashed border-line">
          <span className="absolute -left-3 -top-3 size-6 rounded-full bg-ink" />
          <span className="absolute -right-3 -top-3 size-6 rounded-full bg-ink" />
        </div>

        <dl className="space-y-3 p-5 text-sm">
          <Row label="Data">{show ? longDate(show.date) : "—"}</Row>
          <Row label="Orario">{show ? show.time : "—"}</Row>
          <Row label="Posti">
            {seats.length ? (
              <span className="flex flex-wrap justify-end gap-1">
                <AnimatePresence>
                  {seats.map((s) => (
                    <motion.span
                      key={s}
                      layout
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="rounded-md bg-gold/15 px-1.5 py-0.5 text-xs font-semibold text-gold"
                    >
                      {s}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </span>
            ) : (
              "—"
            )}
          </Row>
          {seats.length > 0 &&
            Object.entries(tickets)
              .filter(([, q]) => q)
              .map(([id, q]) => (
                <Row key={id} label={id === "giovani" ? "Carta Giovani" : id.charAt(0).toUpperCase() + id.slice(1)}>
                  × {q}
                </Row>
              ))}
        </dl>
        <div className="flex items-baseline justify-between border-t border-line bg-ink/40 p-5">
          <span className="text-sm text-muted">Totale da pagare in cassa</span>
          <motion.span key={total} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-poster text-4xl text-gold">
            {euro(total)}
          </motion.span>
        </div>
      </div>
    </aside>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}

function QtyButton({ children, label, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid size-8 place-items-center rounded-full border border-line transition enabled:hover:border-gold enabled:hover:text-gold disabled:opacity-30"
      {...props}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> & { label: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-line bg-panel px-4 py-3.5 outline-none transition placeholder:text-muted/50 focus:border-gold focus:ring-4 focus:ring-gold/10"
        {...props}
      />
    </label>
  );
}
