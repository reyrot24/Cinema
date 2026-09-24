import type { Metadata } from "next";
import { Bebas_Neue, Fraunces, Manrope } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});
const bebas = Bebas_Neue({ variable: "--font-bebas", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: {
    default: "Cine Teatro N. Andrisani · Montescaglioso",
    template: "%s · Cine Teatro Andrisani",
  },
  description:
    "Programmazione, orari, prezzi e prenotazione online del Cine Teatro N. Andrisani di Montescaglioso (MT). Cinema, teatro, eventi e Cinema & Scuola.",
  icons: { icon: "/images/logo.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${manrope.variable} ${fraunces.variable} ${bebas.variable}`}>
      <body className="min-h-dvh flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
