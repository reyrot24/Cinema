// Contenuti del Cine Teatro N. Andrisani.
// Per aggiornare la programmazione settimanale modifica solo `films` e `upcoming`.

export const cinema = {
  name: "Cine Teatro N. Andrisani",
  shortName: "Andrisani",
  address: "Via Bellini, 6",
  city: "Montescaglioso",
  province: "Matera",
  country: "Italia",
  phone: "+39 0835 208046",
  phoneHref: "tel:+390835208046",
  emails: ["info@cineteatroandrisani.it", "cineteatroandrisani@libero.it"],
  social: {
    facebook: "https://www.facebook.com/cinemaandrisanimontescaglioso/",
    twitter: "https://twitter.com/CinemaAndrisani",
  },
  mapsQuery: "Cine Teatro Andrisani, Via Bellini 6, Montescaglioso MT",
} as const;

export type Showtime = {
  id: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  /** HH:mm */
  time: string;
};

export type Film = {
  slug: string;
  title: string;
  subtitle?: string;
  genre: string;
  format: "2D" | "3D";
  badge?: string;
  note?: string;
  plot: string;
  /** Two colors used to generate the poster artwork */
  palette: [string, string];
  showtimes: Showtime[];
};

function shows(slug: string, list: [string, string][]): Showtime[] {
  return list.map(([date, time]) => ({
    id: `${slug}_${date}_${time.replace(":", "")}`,
    date,
    time,
  }));
}

export const films: Film[] = [
  {
    slug: "i-figli-della-scimmia",
    title: "I Figli della Scimmia",
    subtitle: "In anteprima",
    genre: "Drammatico",
    format: "2D",
    badge: "Anteprima",
    note: "Al termine della proiezione l'attore Riccardo Scamarcio saluterà il pubblico presente in sala. È consigliata la prenotazione.",
    plot: "Dario è padre di un bambino disabile, al quale dedica ogni cura e attenzione, ed ha un bellissimo rapporto con il figlio adolescente di suo fratello. Nel crescente legame con il nipote ritrova il figlio che avrebbe voluto avere, e assume il ruolo del padre che avrebbe potuto essere. Un gioco di proiezioni e desideri inespressi che finirà per incrinare l'equilibrio interiore di Dario e travolgere l'intera famiglia.",
    palette: ["#7c2d12", "#f59e0b"],
    showtimes: shows("i-figli-della-scimmia", [["2026-09-22", "18:00"]]),
  },
  {
    slug: "mutiny",
    title: "Mutiny",
    subtitle: "Inverti la rotta",
    genre: "Azione",
    format: "2D",
    plot: "Cole Reed, poliziotto e veterano delle forze speciali britanniche, riconvertito a Bangkok nella sicurezza privata, si ritrova accusato dell'omicidio di un magnate del trasporto marittimo che era chiamato a proteggere. Ricercato dalla polizia tailandese si imbarca sotto falsa identità su un cargo della compagnia del miliardario, comprendendo molto presto che tutti (o quasi) quelli che lo hanno incastrato sono a bordo. Un equipaggio corrotto che dovrà fare i conti con la sua collera.",
    palette: ["#0f172a", "#dc2626"],
    showtimes: shows("mutiny", [
      ["2026-09-18", "20:30"],
      ["2026-09-19", "20:30"],
      ["2026-09-20", "20:30"],
      ["2026-09-21", "21:00"],
      ["2026-09-23", "21:00"],
    ]),
  },
  {
    slug: "paw-patrol-missione-dinosauri",
    title: "Paw Patrol",
    subtitle: "Missione Dinosauri",
    genre: "Animazione · Famiglia",
    format: "2D",
    plot: "La nave dove sta viaggiando la Paw Patrol viene sorpresa da una tempesta che li costringe a naufragare su una misteriosa isola tropicale popolata da dinosauri. Qui incontrano Rex, un cucciolo rimasto bloccato sull'isola da molto tempo, che grazie alla sua esperienza li guida a interagire con la fauna preistorica. Nel frattempo, il sindaco Humdinger vuole sfruttare le risorse naturali dell'isola e avvia una serie di scavi che provocano il risveglio di un gigantesco vulcano rimasto inattivo per secoli.",
    palette: ["#1d4ed8", "#22d3ee"],
    showtimes: shows("paw-patrol-missione-dinosauri", [
      ["2026-09-18", "18:30"],
      ["2026-09-19", "18:30"],
      ["2026-09-20", "18:30"],
    ]),
  },
  {
    slug: "tutto-ultimo-live-a-tor-vergata",
    title: "Tutto Ultimo",
    subtitle: "Live a Tor Vergata",
    genre: "Evento · Concerto",
    format: "2D",
    badge: "Evento",
    plot: "Il film ripercorre le immagini dal vivo della storica serata del 4 luglio 2026 a Tor Vergata: il concerto più grande mai realizzato in Italia, con cui Ultimo ha riunito 250.000 spettatori.",
    palette: ["#4c1d95", "#ec4899"],
    showtimes: shows("tutto-ultimo-live-a-tor-vergata", [
      ["2026-09-22", "21:30"],
      ["2026-09-23", "18:00"],
    ]),
  },
];

export type Upcoming = {
  slug: string;
  title: string;
  kind: string;
  period: string;
  description: string;
  palette: [string, string];
};

export const upcoming: Upcoming[] = [
  {
    slug: "cinema-e-scuola",
    title: "Cinema & Scuola",
    kind: "Concorso · 21ª edizione",
    period: "Anno scolastico 2026/27",
    description:
      "“Vivere il cinema tra sogno e realtà”, abbinato al Giffoni Experience. Tre film in orario curricolare, cineforum in sala e selezione finale: i ragazzi più meritevoli diventano giurati al Giffoni Film Festival.",
    palette: ["#065f46", "#facc15"],
  },
  {
    slug: "sguardi-d-autore",
    title: "Sguardi d'Autore",
    kind: "Rassegna",
    period: "Nuova stagione",
    description:
      "Il meglio della cinematografia nazionale e internazionale, selezionato per chi ama il cinema d'autore.",
    palette: ["#111827", "#e5e7eb"],
  },
  {
    slug: "rassegna-teatrale",
    title: "Il Teatro va dalla gente",
    kind: "Rassegna teatrale",
    period: "Stagione in allestimento",
    description:
      "Un ricco cartellone di spettacoli per scuole e famiglie, dalla scuola primaria alle superiori. Il palcoscenico si anima di storie che fanno riflettere.",
    palette: ["#7f1d1d", "#fb7185"],
  },
];

export const prices = {
  full: 7,
  reduced: 5,
  supplement3D: 2,
};

export const ticketTypes = [
  {
    id: "intero",
    label: "Intero",
    price: prices.full,
    description: "Biglietto standard",
  },
  {
    id: "ridotto",
    label: "Ridotto",
    price: prices.reduced,
    description: "Bambini da 3 a 10 anni e over 65",
  },
  {
    id: "giovani",
    label: "Carta Giovani",
    price: prices.reduced,
    description: "Carta Giovani Nazionale · solo martedì e mercoledì",
    weekdays: [2, 3],
  },
] as const;

export type TicketTypeId = (typeof ticketTypes)[number]["id"];

export const paymentCards = [
  { name: "Carta della Cultura", note: "Accettata in cassa" },
  { name: "Carta Docente", note: "Accettata in cassa" },
  { name: "Carta del Merito", note: "Accettata in cassa" },
  {
    name: "Carta Giovani Nazionale",
    note: "Ingresso ridotto il martedì e il mercoledì",
  },
];

export const services = [
  {
    title: "Accessibilità",
    text: "L'accessibilità per le persone con disabilità è una priorità dello staff fin dall'ingresso. Il personale accompagna ciascuno alla piena fruizione dei servizi in sala.",
    icon: "accessibility",
  },
  {
    title: "Piccola ristorazione",
    text: "All'interno e in una struttura adiacente: snack, stuzzicherie, bibite analcoliche e alcoliche.",
    icon: "popcorn",
  },
  {
    title: "Prenotazione online",
    text: "Entra al cinema senza fare la fila al botteghino: prenota il tuo posto comodamente da casa.",
    icon: "ticket",
  },
  {
    title: "Spazi promozionali",
    text: "Il Cine Teatro promuove le imprese locali con spot audio-video negli intervalli, spazi web, cartellonistica e materiali stampati.",
    icon: "megaphone",
  },
] as const;

export const history = [
  {
    period: "1957 – 1970",
    title: "Il Cinema Comunale e l'Arena",
    text: "La famiglia Disabato gestisce il Cinema Comunale, oggi Sala del Capitolo dell'Abbazia Benedettina, con l'annessa sede estiva: l'Arena. I posti salgono fino a 500, lo schermo si ingrandisce e arriva il rinomato proiettore FEDI.",
  },
  {
    period: "Dal 1999",
    title: "Cinema & Scuola",
    text: "Nasce il progetto con pochi istituti che visionano i film selezionati da Agiscuola Nazionale, con il patrocinio del Ministero della Pubblica Istruzione.",
  },
  {
    period: "Dal 2003",
    title: "Vivere il cinema tra sogno e realtà",
    text: "La rassegna diventa concorso abbinato al Giffoni Film Festival: i ragazzi diventano parte attiva e i più meritevoli partono come giurati.",
  },
  {
    period: "Oggi",
    title: "Una sala polifunzionale",
    text: "Cinema, teatro ed eventi con registi e protagonisti in sala: l'incontro diventa confronto. Qualità di proiezione, audio e comfort, con servizi pensati per le persone.",
  },
];

export function getFilm(slug: string) {
  return films.find((f) => f.slug === slug);
}

export function findShowtime(id: string) {
  for (const film of films) {
    const show = film.showtimes.find((s) => s.id === id);
    if (show) return { film, show };
  }
  return undefined;
}

/** All programming dates, sorted */
export function programmingDays() {
  const days = new Set<string>();
  films.forEach((f) => f.showtimes.forEach((s) => days.add(s.date)));
  return [...days].sort();
}
