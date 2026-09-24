"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Clock } from "lucide-react";
import type { Film } from "@/lib/data";
import { shortWeekday, dayNumber } from "@/lib/format";
import { Poster } from "./Poster";

export function FilmCard({ film }: { film: Film }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 });
  const glareX = useTransform(mx, (v) => `${v * 100}%`);
  const glareY = useTransform(my, (v) => `${v * 100}%`);
  const glare = useTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,.18), transparent 50%)`,
  );

  return (
    <div className="group [perspective:1000px]">
      <Link href={`/film/${film.slug}`} className="block">
        <motion.div
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            mx.set((e.clientX - r.left) / r.width);
            my.set((e.clientY - r.top) / r.height);
          }}
          onPointerLeave={() => {
            mx.set(0.5);
            my.set(0.5);
          }}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative text-[15px] sm:text-[17px]"
        >
          <Poster
            title={film.title}
            subtitle={film.subtitle}
            palette={film.palette}
            badge={film.badge}
            className="shadow-2xl ring-1 ring-white/10 transition-shadow duration-500 group-hover:shadow-[0_30px_80px_-20px] group-hover:shadow-black"
          />
          <motion.div className="pointer-events-none absolute inset-0 rounded-2xl" style={{ background: glare }} />
        </motion.div>
      </Link>
      <div className="mt-4">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">{film.genre}</p>
        <Link href={`/film/${film.slug}`} className="mt-1 block font-display text-xl transition group-hover:text-gold">
          {film.title}
          {film.subtitle && <span className="text-muted"> — {film.subtitle}</span>}
        </Link>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {film.showtimes.map((s) => (
            <Link
              key={s.id}
              href={`/prenota?spettacolo=${s.id}`}
              className="flex items-center gap-1.5 rounded-lg border border-line px-2 py-1 text-xs transition hover:border-gold hover:bg-gold hover:text-ink"
            >
              <span className="uppercase text-muted group-hover:text-inherit">{shortWeekday(s.date)} {dayNumber(s.date)}</span>
              <Clock className="size-3 opacity-50" />
              <span className="font-semibold">{s.time}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
