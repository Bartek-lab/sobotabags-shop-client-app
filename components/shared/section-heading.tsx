import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl space-y-3", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-leather">{eyebrow}</p>
      )}
      <h2 className="font-display text-3xl font-medium tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {description && <p className="text-muted-foreground leading-relaxed">{description}</p>}
    </div>
  );
}
