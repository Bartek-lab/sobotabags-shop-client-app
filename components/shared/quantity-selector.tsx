"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 10,
}: {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center rounded-sm border border-border">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-none"
        disabled={quantity <= min}
        onClick={() => onChange(Math.max(min, quantity - 1))}
        aria-label="Zmniejsz ilość"
      >
        <Minus className="size-3.5" />
      </Button>
      <span className="w-10 text-center text-sm tabular-nums">{quantity}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-none"
        disabled={quantity >= max}
        onClick={() => onChange(Math.min(max, quantity + 1))}
        aria-label="Zwiększ ilość"
      >
        <Plus className="size-3.5" />
      </Button>
    </div>
  );
}
