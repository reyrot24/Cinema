"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Ticket, X } from "lucide-react";

const links = [
  { href: "/programmazione", label: "Programmazione" },
  { href: "/prossimamente", label: "Prossimamente" },
  { href: "/tariffe", label: "Tariffe" },
  { href: "/cinema-e-scuola", label: "Cinema & Scuola" },
  { href: "/storia", label: "La Storia" },
  { href: "/contatti", label: "Contatti" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // chiude il menu mobile al cambio pagina
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open ? "bg-ink/80 backdrop-blur-xl border-b border-line" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt=""
            width={40}
            height={40}
            className="transition-transform duration-500 group-hover:rotate-[20deg]"
            priority
          />
          <span className="leading-none">
            <span className="block font-display text-lg font-semibold tracking-tight">Andrisani</span>
            <span className="block text-[10px] uppercase tracking-[0.3em] text-muted">Cine Teatro</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`relative rounded-full px-3.5 py-2 text-sm transition-colors ${
                    active ? "text-ink" : "text-cream/75 hover:text-cream"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-gold"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/prenota"
            className="hidden items-center gap-2 rounded-full bg-cream px-4 py-2 text-sm font-semibold text-ink transition hover:bg-gold sm:flex"
          >
            <Ticket className="size-4" /> Prenota
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid size-10 place-items-center rounded-full border border-line lg:hidden"
            aria-label={open ? "Chiudi menu" : "Apri menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden lg:hidden"
          >
            <ul className="space-y-1 px-4 pb-6 pt-2">
              {[...links, { href: "/prenota", label: "Prenota un posto" }].map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ x: -16, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={l.href}
                    className={`block rounded-xl px-4 py-3 font-display text-2xl ${
                      pathname.startsWith(l.href) ? "bg-gold text-ink" : "text-cream"
                    }`}
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
