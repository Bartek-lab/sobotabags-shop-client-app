import { Mail, MapPin, Palette, Phone, Ruler, Sparkles } from "lucide-react";

const STEPS = [
  {
    icon: Sparkles,
    title: "Opisz swoją wizję",
    description: "Napisz do nas, jaką torbę masz na myśli — formę, przeznaczenie, inspiracje.",
  },
  {
    icon: Palette,
    title: "Wybierz skórę i kolor",
    description: "Dopasujemy gatunek skóry, barwę i okucia do Twoich potrzeb i budżetu.",
  },
  {
    icon: Ruler,
    title: "Ustal wymiary i detale",
    description: "Indywidualne wymiary, dodatkowe kieszenie, grawer lub monogram — to wszystko jest możliwe.",
  },
  {
    icon: Mail,
    title: "Wycena i realizacja",
    description: "Otrzymasz wycenę oraz termin realizacji. Torba szyta jest ręcznie w 2-4 tygodnie.",
  },
];

export function CustomOrderInfo() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-leather">Projekty na zamówienie</p>
        <h2 className="font-display text-2xl">Jak zamówić indywidualny projekt</h2>
        <p className="leading-relaxed text-muted-foreground">
          Oprócz produktów z kolekcji, tworzymy torby projektowane od podstaw pod konkretną osobę — wybrany
          rodzaj skóry, kolor, wymiary, a nawet personalizowany grawer. Napisz do nas, a wspólnie zaprojektujemy
          torbę, która powstanie wyłącznie dla Ciebie.
        </p>
      </div>

      <ol className="space-y-6">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex gap-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-secondary/50 text-sm font-medium">
              {index + 1}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <step.icon className="size-4 text-leather" strokeWidth={1.5} />
                <h3 className="text-sm font-medium">{step.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="space-y-3 border-t border-border pt-6">
        <h3 className="text-sm font-medium">Dane kontaktowe</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <Mail className="size-4 text-leather" strokeWidth={1.5} />
            kontakt@ksobota.pl
          </li>
          <li className="flex items-center gap-2">
            <Phone className="size-4 text-leather" strokeWidth={1.5} />
            +48 600 000 000
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="size-4 text-leather" strokeWidth={1.5} />
            Pracownia KS, ul. Skórzana 12, Kraków
          </li>
        </ul>
      </div>
    </div>
  );
}
