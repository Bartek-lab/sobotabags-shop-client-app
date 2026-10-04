import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  markClassName,
  showWordmark = true,
}: {
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
}) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className={cn(
          "logo-mark relative top-[2px] aspect-[290/512] h-6 shrink-0 transition-opacity group-hover:opacity-80",
          markClassName
        )}
      />
      <span className="sr-only">KS</span>
      {showWordmark && (
        <span aria-hidden className="font-display text-2xl leading-none tracking-tight">
          KS
        </span>
      )}
    </Link>
  );
}
