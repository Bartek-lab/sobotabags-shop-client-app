import Link from "next/link";
import { Logo } from "@/components/shared/logo";

const COLUMNS = [
  {
    title: "Kolekcja",
    links: [
      { href: "/products?category=women", label: "Torby damskie" },
      { href: "/products?category=men", label: "Torby męskie" },
      { href: "/products", label: "Wszystkie produkty" },
    ],
  },
  {
    title: "Obsługa klienta",
    links: [
      { href: "/account", label: "Moje konto" },
      { href: "/cart", label: "Koszyk" },
      { href: "/login", label: "Logowanie" },
    ],
  },
  {
    title: "Marka",
    links: [
      { href: "/o-mnie", label: "O mnie" },
      { href: "/contact", label: "Napisz do nas" },
      { href: "/contact", label: "Zamówienia indywidualne" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-3 lg:col-span-2">
            <Logo showWordmark={false} markClassName="h-9" />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Ręcznie robione torby skórzane premium, projektowane i szyte w Polsce z poszanowaniem
              tradycyjnego rzemiosła.
            </p>
          </div>
          {COLUMNS.map((column) => (
            <div key={column.title} className="space-y-3">
              <h3 className="text-sm font-medium tracking-wide">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, index) => (
                  <li key={`${link.href}-${index}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} KS. Wszelkie prawa zastrzeżone.</p>
          <p>Wykonane ręcznie w Polsce.</p>
        </div>
      </div>
    </footer>
  );
}
