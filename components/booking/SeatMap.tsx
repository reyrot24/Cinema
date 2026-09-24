"use client";

import { motion } from "framer-motion";
import { Accessibility } from "lucide-react";
import { ACCESSIBLE, layout } from "@/lib/seats";

type Props = {
  taken: Set<string>;
  selected: string[];
  onToggle: (id: string) => void;
  loading?: boolean;
};

export function SeatMap({ taken, selected, onToggle, loading }: Props) {
  return (
    <div>
      {/* schermo */}
      <div className="relative mx-auto mb-10 max-w-lg">
        <div className="h-2 rounded-[50%] bg-gradient-to-r from-transparent via-cream to-transparent shadow-[0_10px_60px_10px] shadow-gold/30" />
        <div className="pointer-events-none absolute inset-x-8 top-2 h-24 bg-gradient-to-b from-cream/10 to-transparent [clip-path:polygon(0_0,100%_0,85%_100%,15%_100%)]" />
        <p className="mt-3 text-center text-[10px] uppercase tracking-[0.5em] text-muted">Schermo</p>
      </div>

      <div className={`overflow-x-auto pb-2 transition-opacity ${loading ? "opacity-40" : ""}`}>
        <div className="mx-auto flex w-max flex-col gap-1.5 px-2">
          {layout.map((row) => {
            const half = row.length / 2;
            const label = row[0].row;
            return (
              <div key={label} className="flex items-center gap-1 sm:gap-1.5">
                <span className="w-5 text-center text-[11px] font-semibold text-muted">{label}</span>
                {/* le file corte vengono centrate */}
                {row.length < 14 && <span className="w-6 sm:w-8" />}
                {row.map((seat, i) => {
                  const isTaken = taken.has(seat.id);
                  const isSelected = selected.includes(seat.id);
                  const isAccessible = ACCESSIBLE.has(seat.id);
                  return (
                    <div key={seat.id} className={`flex ${i === half ? "ml-4 sm:ml-8" : ""}`}>
                      <motion.button
                        type="button"
                        disabled={isTaken}
                        onClick={() => onToggle(seat.id)}
                        whileTap={isTaken ? undefined : { scale: 0.85 }}
                        animate={isSelected ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                        transition={{ duration: 0.3 }}
                        aria-label={`Fila ${seat.row} posto ${seat.number}${isTaken ? ", occupato" : ""}${isAccessible ? ", accessibile" : ""}`}
                        aria-pressed={isSelected}
                        className={`relative grid size-6 place-items-center rounded-t-lg rounded-b-sm text-[9px] font-semibold transition-colors sm:size-8 sm:text-[10px] ${
                          isTaken
                            ? "cursor-not-allowed bg-white/[.04] text-transparent"
                            : isSelected
                              ? "bg-gold text-ink shadow-[0_0_16px_-2px] shadow-gold"
                              : isAccessible
                                ? "bg-azure/60 text-cream hover:bg-azure"
                                : "bg-white/25 text-transparent hover:bg-white/45 hover:text-cream"
                        }`}
                      >
                        {isAccessible && !isSelected && !isTaken ? <Accessibility className="size-3.5" /> : seat.number}
                        {isTaken && <span className="absolute inset-1.5 rounded-full border border-white/10" />}
                      </motion.button>
                    </div>
                  );
                })}
                {row.length < 14 && <span className="w-6 sm:w-8" />}
                <span className="w-5 text-center text-[11px] font-semibold text-muted">{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted">
        <Legend className="bg-white/25" label="Libero" />
        <Legend className="bg-gold" label="Selezionato" />
        <Legend className="bg-white/[.04] ring-1 ring-white/10" label="Occupato" />
        <Legend className="bg-azure/60" label="Accessibile" />
      </div>
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`size-4 rounded-t-md rounded-b-sm ${className}`} />
      {label}
    </span>
  );
}
