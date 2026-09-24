"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Film } from "@/lib/data";
import { dayNumber, longDate, monthShort, shortWeekday } from "@/lib/format";

export function ScheduleBoard({ films, days }: { films: Film[]; days: string[] }) {
  const [day, setDay] = useState(days[0]);

  const rows = useMemo(
    () =>
      films
        .flatMap((film) => film.showtimes.filter((s) => s.date === day).map((show) => ({ film, show })))
        .sort((a, b) => a.show.time.localeCompare(b.show.time)),
    [films, day],
  );

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-panel/60 backdrop-blur">
      <div className="flex gap-2 overflow-x-auto border-b border-line p-3 [scrollbar-width:none]" role="tablist">
        {days.map((d) => {
          const active = d === day;
          return (
            <button
              key={d}
              role="tab"
              aria-selected={active}
              onClick={() => setDay(d)}
              className={`relative min-w-[72px] shrink-0 rounded-2xl px-3 py-2.5 text-center transition ${
                active ? "text-ink" : "text-cream/70 hover:bg-white/5"
              }`}
            >
              {active && (
                <motion.span layoutId="day-pill" className="absolute inset-0 -z-0 rounded-2xl bg-gold" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
              )}
              <span className="relative block text-[11px] uppercase tracking-widest">{shortWeekday(d)}</span>
              <span className="relative block font-display text-2xl leading-none">{dayNumber(d)}</span>
              <span className="relative block text-[10px] uppercase opacity-70">{monthShort(d)}</span>
            </button>
          );
        })}
      </div>

      <div className="p-3 sm:p-5">
        <p className="mb-3 px-2 text-sm text-muted">{longDate(day)}</p>
        <AnimatePresence mode="wait">
          <motion.ul
            key={day}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="divide-y divide-line"
          >
            {rows.map(({ film, show }) => (
              <li key={show.id}>
                <Link
                  href={`/prenota?spettacolo=${show.id}`}
                  className="group flex items-center gap-4 rounded-2xl px-2 py-4 transition hover:bg-white/[.04] sm:gap-6 sm:px-4"
                >
                  <span className="w-20 font-poster text-4xl tracking-wide text-gold sm:text-5xl">{show.time}</span>
                  <span
                    className="hidden size-12 shrink-0 rounded-xl sm:block"
                    style={{ background: `linear-gradient(135deg, ${film.palette[0]}, ${film.palette[1]})` }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-lg sm:text-xl">
                      {film.title}
                      {film.subtitle && <span className="text-muted"> · {film.subtitle}</span>}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-muted">
                      {film.genre} · {film.format} · Spettacolo unico
                    </span>
                  </span>
                  <span className="hidden items-center gap-1 rounded-full border border-line px-4 py-2 text-sm font-semibold transition group-hover:border-gold group-hover:bg-gold group-hover:text-ink sm:flex">
                    Prenota <ArrowUpRight className="size-4" />
                  </span>
                  <ArrowUpRight className="size-5 text-gold sm:hidden" />
                </Link>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </div>
  );
}
