"use client";

import type { AddressInput } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Country is fixed to PL, not an editable field -- the storefront is
// Poland-only by design (see docs/architecture.md), and the schema's
// generic country_code column exists for the admin side's multi-country
// tax config, not for this storefront to expose a country picker.
export const DEFAULT_COUNTRY_CODE = "PL";

export function AddressFields({
  value,
  onChange,
}: {
  value: Partial<AddressInput>;
  onChange: (next: Partial<AddressInput>) => void;
}) {
  const set = <K extends keyof AddressInput>(key: K, v: AddressInput[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="addr-first-name">Imię</Label>
        <Input
          id="addr-first-name"
          value={value.firstName ?? ""}
          onChange={(e) => set("firstName", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="addr-last-name">Nazwisko</Label>
        <Input
          id="addr-last-name"
          value={value.lastName ?? ""}
          onChange={(e) => set("lastName", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="addr-line1">Ulica i numer</Label>
        <Input
          id="addr-line1"
          value={value.line1 ?? ""}
          onChange={(e) => set("line1", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="addr-line2">Nr lokalu (opcjonalnie)</Label>
        <Input
          id="addr-line2"
          value={value.line2 ?? ""}
          onChange={(e) => set("line2", e.target.value || null)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="addr-postal">Kod pocztowy</Label>
        <Input
          id="addr-postal"
          value={value.postalCode ?? ""}
          onChange={(e) => set("postalCode", e.target.value)}
          placeholder="00-001"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="addr-city">Miasto</Label>
        <Input
          id="addr-city"
          value={value.city ?? ""}
          onChange={(e) => set("city", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="addr-phone">Telefon (np. +48123456789)</Label>
        <Input
          id="addr-phone"
          value={value.phone ?? ""}
          onChange={(e) => set("phone", e.target.value || null)}
          placeholder="+48123456789"
        />
      </div>
    </div>
  );
}

export function emptyAddress(): Partial<AddressInput> {
  return {
    firstName: "",
    lastName: "",
    line1: "",
    line2: null,
    city: "",
    region: null,
    postalCode: "",
    countryCode: DEFAULT_COUNTRY_CODE,
    phone: null,
    company: null,
    vatId: null,
    label: null,
    isDefaultShipping: false,
    isDefaultBilling: false,
  };
}
