"use client";

import { formatMinorUnits } from "@/lib/utils";
import type { ShippingMethod } from "@/types";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function ShippingMethodPicker({
  methods,
  selectedId,
  onSelect,
  subtotal,
}: {
  methods: ShippingMethod[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** Minor units -- used only to show "za darmo" when this order already clears a method's threshold. */
  subtotal: number;
}) {
  return (
    <RadioGroup value={selectedId ?? undefined} onValueChange={onSelect} className="gap-3">
      {methods.map((method) => {
        const free = method.freeAboveAmount != null && subtotal >= method.freeAboveAmount;
        return (
          <Label
            key={method.id}
            htmlFor={`ship-${method.id}`}
            className="flex cursor-pointer items-center justify-between gap-4 rounded-sm border border-border p-4 has-data-checked:border-foreground"
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem id={`ship-${method.id}`} value={method.id} />
              <span className="text-sm font-medium">{method.name}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {free ? "Za darmo" : formatMinorUnits(method.priceAmount)}
            </span>
          </Label>
        );
      })}
    </RadioGroup>
  );
}
