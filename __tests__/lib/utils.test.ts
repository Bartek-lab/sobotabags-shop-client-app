import { describe, expect, it } from "vitest";
import { formatMinorUnits, formatPrice } from "@/lib/utils";

// Intl's pl-PL currency formatter uses a non-breaking space (U+00A0)
// between the number and "zł", not a regular space -- expected values are
// built from the formatter itself rather than hand-typed literals, so the
// test can't silently drift from whatever character Intl actually uses.
const pln = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
  maximumFractionDigits: 0,
});

describe("formatPrice", () => {
  it("formats a whole PLN amount", () => {
    expect(formatPrice(100)).toBe(pln.format(100));
  });

  it("rounds to the nearest zloty (maximumFractionDigits: 0)", () => {
    expect(formatPrice(100.5)).toBe(pln.format(101));
    expect(formatPrice(100.4)).toBe(pln.format(100));
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe(pln.format(0));
  });
});

describe("formatMinorUnits", () => {
  // api-shop returns amounts in grosze (minor units) -- this is the one
  // conversion point, so a silent /100 regression here would show every
  // price at 100x on the storefront. Exactly the "silent regression costs
  // real money" class of bug this session's own TODO flagged as highest value.
  it("divides by 100 before formatting", () => {
    expect(formatMinorUnits(10000)).toBe(pln.format(100));
  });

  it("rounds sub-zloty amounts the same way formatPrice does", () => {
    // 10050 grosze = 100.50 PLN -> rounds to 101 zł given maximumFractionDigits: 0
    expect(formatMinorUnits(10050)).toBe(pln.format(101));
    expect(formatMinorUnits(10049)).toBe(pln.format(100));
  });

  it("handles zero", () => {
    expect(formatMinorUnits(0)).toBe(pln.format(0));
  });

  it("handles large amounts without losing precision", () => {
    expect(formatMinorUnits(123456789)).toBe(formatPrice(1234567.89));
  });
});
