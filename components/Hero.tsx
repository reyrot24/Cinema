"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CalendarDays, Ticket } from "lucide-react";
import type { Film } from "@/lib/data";
import { longDate } from "@/lib/format";
import { Poster } from "./Poster";

const DURATION = 7000;

export function Hero({ films, weekLabel }: { films: Film[]; weekLabel: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const film = films[index];

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % films.length), DURATION);
    return () => clearTimeout(t);
  }, [index, paused, films.length]);

  const [a, b] = film.palette;

  return (
    <section
      className="relative isolate min-h-[100svh] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ambient color from the current film */}
      <AnimatePresence>
        <motion.div
          key={film.slug}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 -z-10"
          style={{
            background: `radial-gradient(60% 70% at 75% 40%, ${b}40 0%, transparent 60%), radial-gradient(50% 60% at 10% 90%, ${a}66 0%, transparent 70%)`,
          }}
        />
      </AnimatePresence>
      {/* projector beam */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[140%] w-[70%] -translate-x-1/2 animate-flicker opacity-40"
        style={{
          background: "conic-gradient(from 180deg at 50% 0%, transparent 160deg, rgba(255,230,170,.18) 180deg, transparent 200deg)",
        }}
      />
      <div className="grain absolute inset-0 -z-10" />

      <div className="mx-auto grid grid-cols-1 min-h-[100svh] max-w-7xl items-center gap-12 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-3 py-1.5 text-xs uppercase tracking-[0.25em] text-cream/80 backdrop-blur"
          >
            <span className="size-1.5 animate-pulse rounded-full bg-gold" />
            In sala · {weekLabel}
          </motion.p>

          <AnimatePresence mode="wait">
            <motion.div
              key={film.slug}
              initial="hidden"
              animate="show"
              exit="exit"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.08 } },
                exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
              }}
            >
              <motion.p
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                className="text-sm uppercase tracking-[0.3em] text-muted"
              >
                {film.genre}
                {film.badge && <span className="ml-3 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-ink">{film.badge}</span>}
              </motion.p>
              <motion.h1
                variants={{ hidden: { opacity: 0, y: 40, filter: "blur(8px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)" } }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="mt-3 font-poster text-[clamp(4rem,12vw,9.5rem)] uppercase leading-[0.85] tracking-wide"
              >
                {film.title}
              </motion.h1>
              {film.subtitle && (
                <motion.p
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                  className="mt-2 font-display text-2xl italic sm:text-3xl"
                  style={{ color: b }}
                >
                  {film.subtitle}
                </motion.p>
              )}
              <motion.p
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                className="mt-6 max-w-xl leading-relaxed text-cream/75 line-clamp-3"
              >
                {film.plot}
              </motion.p>
              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                className="mt-6 flex flex-wrap gap-2"
              >
                {film.showtimes.slice(0, 4).map((s) => (
                  <Link
                    key={s.id}
                    href={`/prenota?spettacolo=${s.id}`}
                    className="group flex items-center gap-2 rounded-full border border-line bg-white/5 px-3 py-1.5 text-sm backdrop-blur transition hover:border-gold hover:bg-gold hover:text-ink"
                  >
                    <CalendarDays className="size-3.5 opacity-60" />
                    {longDate(s.date).split(" ").slice(0, 2).join(" ")}
                    <span className="font-semibold">{s.time}</span>
                  </Link>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={`/prenota?film=${film.slug}`}
              className="group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 font-semibold text-ink shadow-[0_0_40px_-8px] shadow-gold/60 transition hover:scale-[1.03]"
            >
              <Ticket className="size-5" /> Prenota il posto
            </Link>
            <Link
              href={`/film/${film.slug}`}
              className="group inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 font-semibold transition hover:border-cream"
            >
              Scheda film <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-12 flex gap-2">
            {films.map((f, i) => (
              <button
                key={f.slug}
                onClick={() => setIndex(i)}
                aria-label={`Mostra ${f.title}`}
                className="relative h-1 w-12 overflow-hidden rounded-full bg-white/15"
              >
                {i === index && (
                  <motion.span
                    key={`${f.slug}-${paused}`}
                    className="absolute inset-y-0 left-0 bg-gold"
                    initial={{ width: paused ? "100%" : "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: paused ? 0 : DURATION / 1000, ease: "linear" }}
                  />
                )}
                {i < index && <span className="absolute inset-0 bg-cream/50" />}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mx-auto hidden w-full max-w-sm [perspective:1200px] lg:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={film.slug}
              initial={{ opacity: 0, rotateY: -25, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, rotateY: -8, x: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: 20, x: -40, scale: 0.95 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-[22px]"
            >
              <Poster
                title={film.title}
                subtitle={film.subtitle}
                palette={film.palette}
                badge={film.badge}
                className="shadow-[0_40px_120px_-20px_rgba(0,0,0,.9)] ring-1 ring-white/10"
              />
            </motion.div>
          </AnimatePresence>
          <div
            className="absolute -bottom-10 left-1/2 -z-10 h-24 w-3/4 -translate-x-1/2 rounded-full blur-3xl"
            style={{ background: b, opacity: 0.35 }}
          />
        </div>
      </div>
    </section>
  );
}
