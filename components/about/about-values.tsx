import { Clock, HeartHandshake, Scissors } from "lucide-react";

const VALUES = [
  {
    icon: Scissors,
    title: "Precyzja kroju",
    description: "Każdy element kroję i mierzę ręcznie — bez szablonów maszynowych i bez skrótów.",
  },
  {
    icon: Clock,
    title: "Czas i cierpliwość",
    description: "Jedna torba powstaje przez kilka do kilkunastu dni. Nie przyspieszam procesu kosztem jakości.",
  },
  {
    icon: HeartHandshake,
    title: "Indywidualne podejście",
    description: "Rozmawiam z każdą osobą, dla której szyję — torba ma pasować do życia, nie odwrotnie.",
  },
];

export function AboutValues() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid gap-10 sm:grid-cols-3">
        {VALUES.map((value) => (
          <div key={value.title} className="space-y-3">
            <value.icon className="size-6 text-leather" strokeWidth={1.5} />
            <h3 className="font-display text-lg">{value.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{value.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
