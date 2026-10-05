import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const plnFormatter = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
  maximumFractionDigits: 0,
})

export function formatPrice(price: number) {
  return plnFormatter.format(price)
}

/** api-shop returns amounts in minor units (grosze), matching the DB's
 * money_amount domain -- this is the one place that conversion happens,
 * so call sites can't forget the /100 and silently show 100x the price. */
export function formatMinorUnits(amount: number) {
  return formatPrice(amount / 100)
}
