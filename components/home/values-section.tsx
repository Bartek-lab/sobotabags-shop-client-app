import { Hand, Leaf, MapPin } from "lucide-react";

const VALUES = [
  {
    icon: Hand,
    title: "Ręczne rzemiosło",
    description: "Każda torba jest szyta ręcznie przez doświadczonych rzemieślników, etap po etapie.",
  },
  {
    icon: Leaf,
    title: "Skóra naturalna",
    description: "Wybieramy wyłącznie naturalną skórę licową, garbowaną roślinnie tam, gdzie to możliwe.",
  },
  {
    icon: MapPin,
    title: "Wyprodukowano w Polsce",
    description: "Cały proces produkcji odbywa się w naszej pracowni — od kroju, po ostatni ścieg.",
  },
];

export function ValuesSection() {
  return (
    <section className="border-y border-border bg-secondary/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:grid-cols-3 sm:px-6 lg:px-8">
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
