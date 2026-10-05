"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuthStore } from "@/lib/auth";
import { useCartStore } from "@/lib/cart";
import { getShippingMethods } from "@/lib/shipping";
import { getAddresses } from "@/lib/addresses";
import {
  createCheckoutSession,
  getPricingPreview,
  type CheckoutInput,
  type PricingPreview,
} from "@/lib/checkout";
import { formatMinorUnits } from "@/lib/utils";
import type { Address, AddressInput, ShippingMethod } from "@/types";
import { AddressFields, DEFAULT_COUNTRY_CODE, emptyAddress } from "@/components/checkout/address-fields";
import { ShippingMethodPicker } from "@/components/checkout/shipping-method-picker";
import { InPostGeowidget } from "@/components/checkout/inpost-geowidget";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeading } from "@/components/shared/section-heading";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const user = useAuthStore((state) => state.user);
  const register = useAuthStore((state) => state.register);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  React.useEffect(() => {
    if (mounted && items.length === 0) router.replace("/cart");
  }, [mounted, items, router]);

  const [methods, setMethods] = React.useState<ShippingMethod[]>([]);
  const [methodsLoading, setMethodsLoading] = React.useState(true);
  const [selectedMethodId, setSelectedMethodId] = React.useState<string | null>(null);

  React.useEffect(() => {
    getShippingMethods()
      .then((ms) => {
        setMethods(ms);
        if (ms.length) setSelectedMethodId(ms[0].id);
      })
      .catch(() => {})
      .finally(() => setMethodsLoading(false));
  }, []);

  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = React.useState<string>("new");
  const [addressForm, setAddressForm] = React.useState<Partial<AddressInput>>(emptyAddress());

  React.useEffect(() => {
    if (!user) return;
    getAddresses()
      .then((addrs) => {
        setAddresses(addrs);
        const def = addrs.find((a) => a.isDefaultShipping) ?? addrs[0];
        if (def) {
          setSelectedAddressId(def.id);
          setAddressForm(def);
        }
      })
      .catch(() => {});
  }, [user]);

  function selectSavedAddress(id: string | null) {
    if (!id) return;
    setSelectedAddressId(id);
    if (id === "new") {
      setAddressForm(emptyAddress());
      return;
    }
    const a = addresses.find((x) => x.id === id);
    if (a) setAddressForm(a);
  }

  const [pickupPoint, setPickupPoint] = React.useState<{ pointName: string; pointAddress: string | null } | null>(
    null
  );
  const [recipientFirstName, setRecipientFirstName] = React.useState("");
  const [recipientLastName, setRecipientLastName] = React.useState("");
  const [recipientPhone, setRecipientPhone] = React.useState("");

  const [email, setEmail] = React.useState("");
  const [createAccount, setCreateAccount] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const selectedMethod = methods.find((m) => m.id === selectedMethodId) ?? null;

  // Promo code / gift card: the input field updates as the customer types,
  // but pricing only re-queries once they click "Zastosuj" -- not on every
  // keystroke. The actual discount/total shown always comes from this
  // preview, which runs the exact same pricing logic the real checkout
  // uses (api-shop's _price_cart), so nothing shown here can drift from
  // what's actually charged.
  const [promoCodeInput, setPromoCodeInput] = React.useState("");
  const [appliedPromoCode, setAppliedPromoCode] = React.useState("");
  const [giftCardCodeInput, setGiftCardCodeInput] = React.useState("");
  const [appliedGiftCardCode, setAppliedGiftCardCode] = React.useState("");
  const [pricing, setPricing] = React.useState<PricingPreview | null>(null);
  const [pricingLoading, setPricingLoading] = React.useState(false);

  React.useEffect(() => {
    if (!selectedMethodId || items.length === 0) return;
    let cancelled = false;
    setPricingLoading(true);
    getPricingPreview({
      items, shippingMethodId: selectedMethodId,
      promoCode: appliedPromoCode || undefined, giftCardCode: appliedGiftCardCode || undefined,
    })
      .then((p) => {
        if (!cancelled) setPricing(p);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Nie udało się obliczyć ceny.");
      })
      .finally(() => {
        if (!cancelled) setPricingLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [items, selectedMethodId, appliedPromoCode, appliedGiftCardCode]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!selectedMethod) {
      setError("Wybierz metodę dostawy.");
      return;
    }
    if (!user && !email) {
      setError("Podaj adres e-mail.");
      return;
    }
    if (!user && createAccount && password.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków.");
      return;
    }

    setSubmitting(true);
    try {
      const pickup = selectedMethod.requiresPickupPoint
        ? (() => {
            if (!pickupPoint) throw new Error("Wybierz paczkomat na mapie.");
            if (!recipientFirstName || !recipientLastName) throw new Error("Podaj imię i nazwisko odbiorcy.");
            return {
              pointName: pickupPoint.pointName,
              pointAddress: pickupPoint.pointAddress,
              firstName: recipientFirstName,
              lastName: recipientLastName,
              phone: recipientPhone || null,
            };
          })()
        : null;

      if (!selectedMethod.requiresPickupPoint) {
        if (!addressForm.firstName || !addressForm.lastName || !addressForm.line1 || !addressForm.city || !addressForm.postalCode) {
          throw new Error("Uzupełnij adres dostawy.");
        }
      }

      // Create the account BEFORE the checkout session, not after: if this
      // project auto-confirms emails, register() hands back a real session
      // immediately, and api-shop's checkout endpoint picks up that bearer
      // token on the very next call -- so the order is already linked to the
      // new customer_id instead of landing as a guest order we'd have to
      // reconcile later.
      if (!user && createAccount) {
        const fullName = selectedMethod.requiresPickupPoint
          ? `${recipientFirstName} ${recipientLastName}`.trim()
          : `${addressForm.firstName ?? ""} ${addressForm.lastName ?? ""}`.trim();
        try {
          await register({ email, password, fullName });
        } catch (err) {
          throw new Error(err instanceof Error ? err.message : "Nie udało się założyć konta.");
        }
      }

      // Re-read the store directly rather than the `user` closed over at the
      // top of this component: a register() call above updates it via
      // zustand's set(), but this handler's local `user` reference won't see
      // that until the next render.
      const loggedIn = !!useAuthStore.getState().user;

      const input: CheckoutInput = {
        items,
        shippingMethodId: selectedMethod.id,
        email: loggedIn ? undefined : email,
        promoCode: appliedPromoCode || undefined,
        giftCardCode: appliedGiftCardCode || undefined,
      };
      if (pickup) input.pickupPoint = pickup;
      else input.address = { ...addressForm, countryCode: DEFAULT_COUNTRY_CODE } as AddressInput;

      const result = await createCheckoutSession(input);
      if (result.url) {
        window.location.href = result.url;
      } else if (result.orderNumber) {
        // A gift card covered the whole order -- already paid, no Stripe
        // redirect needed. The success page handles this via order_number
        // directly instead of polling a Stripe session.
        router.push(`/checkout/success?order_number=${result.orderNumber}`);
      } else {
        throw new Error("Nieoczekiwana odpowiedź serwera.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się przejść do płatności.");
      setSubmitting(false);
    }
  }

  if (!mounted || items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading title="Kasa" className="mb-10" />
      <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          {!user && (
            <section className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="checkout-email">Adres e-mail</Label>
                <Input
                  id="checkout-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jan.kowalski@example.com"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="checkout-create-account"
                  checked={createAccount}
                  onCheckedChange={(v) => setCreateAccount(!!v)}
                />
                <Label htmlFor="checkout-create-account" className="font-normal">
                  Chcę założyć konto, aby śledzić zamówienia
                </Label>
              </div>

              {createAccount && (
                <div className="space-y-2">
                  <Label htmlFor="checkout-password">Hasło</Label>
                  <Input
                    id="checkout-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={6}
                    required
                  />
                </div>
              )}
            </section>
          )}

          <section className="space-y-4">
            <h2 className="font-display text-lg">Dostawa</h2>
            {methodsLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <ShippingMethodPicker
                methods={methods}
                selectedId={selectedMethodId}
                onSelect={setSelectedMethodId}
                subtotal={subtotal}
              />
            )}
          </section>

          {selectedMethod?.requiresPickupPoint ? (
            <section className="space-y-4">
              <h2 className="font-display text-lg">Wybór paczkomatu</h2>
              <InPostGeowidget onSelect={setPickupPoint} />
              {pickupPoint && (
                <p className="text-sm text-muted-foreground">
                  Wybrany paczkomat: <span className="font-medium text-foreground">{pickupPoint.pointName}</span>
                  {pickupPoint.pointAddress ? ` (${pickupPoint.pointAddress})` : ""}
                </p>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="recipient-first-name">Imię odbiorcy</Label>
                  <Input
                    id="recipient-first-name"
                    value={recipientFirstName}
                    onChange={(e) => setRecipientFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient-last-name">Nazwisko odbiorcy</Label>
                  <Input
                    id="recipient-last-name"
                    value={recipientLastName}
                    onChange={(e) => setRecipientLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="recipient-phone">Telefon (np. +48123456789)</Label>
                  <Input
                    id="recipient-phone"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="+48123456789"
                  />
                </div>
              </div>
            </section>
          ) : (
            <section className="space-y-4">
              <h2 className="font-display text-lg">Adres dostawy</h2>
              {user && addresses.length > 0 && (
                <Select value={selectedAddressId} onValueChange={selectSavedAddress}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Wybierz zapisany adres" />
                  </SelectTrigger>
                  <SelectContent>
                    {addresses.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.label ? `${a.label} -- ` : ""}
                        {a.line1}, {a.city}
                      </SelectItem>
                    ))}
                    <SelectItem value="new">Nowy adres</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <AddressFields value={addressForm} onChange={setAddressForm} />
            </section>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-5 rounded-sm border border-border bg-card p-6">
            <h2 className="font-display text-lg">Podsumowanie</h2>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="promo-code">Kod rabatowy</Label>
                <div className="flex gap-2">
                  <Input
                    id="promo-code"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    placeholder="KOD10"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAppliedPromoCode(promoCodeInput.trim())}
                  >
                    Zastosuj
                  </Button>
                </div>
                {pricing?.promoError && <p className="text-xs text-destructive">{pricing.promoError}</p>}
                {pricing?.promoName && !pricing.promoError && (
                  <p className="text-xs text-muted-foreground">Zastosowano: {pricing.promoName}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="gift-card-code">Karta podarunkowa</Label>
                <div className="flex gap-2">
                  <Input
                    id="gift-card-code"
                    value={giftCardCodeInput}
                    onChange={(e) => setGiftCardCodeInput(e.target.value)}
                    placeholder="Kod karty"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAppliedGiftCardCode(giftCardCodeInput.trim())}
                  >
                    Zastosuj
                  </Button>
                </div>
                {pricing?.giftCardError && <p className="text-xs text-destructive">{pricing.giftCardError}</p>}
              </div>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Produkty</span>
                <span>{formatMinorUnits(pricing?.subtotalAmount ?? subtotal)}</span>
              </div>
              {pricing && pricing.discountAmount > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Rabat</span>
                  <span>-{formatMinorUnits(pricing.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Dostawa</span>
                <span>
                  {pricing ? (pricing.shippingAmount === 0 ? "Za darmo" : formatMinorUnits(pricing.shippingAmount)) : "--"}
                </span>
              </div>
              {pricing && pricing.giftCardAmount > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Karta podarunkowa</span>
                  <span>-{formatMinorUnits(pricing.giftCardAmount)}</span>
                </div>
              )}
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Do zapłaty</span>
              <span>{formatMinorUnits(pricing?.amountDue ?? subtotal)}</span>
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={submitting || pricingLoading}>
              {submitting && <Loader2 className="size-4 animate-spin" />}
              Zapłać
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Płatność kartą, BLIK, Apple Pay lub Google Pay -- bezpiecznie przez Stripe.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
