import { beforeEach, describe, expect, it } from "vitest";
import { useCartStore } from "@/lib/cart";
import type { CartItem } from "@/types";

function item(overrides: Partial<CartItem> = {}): Omit<CartItem, "quantity"> {
  return {
    variantId: "variant-1",
    productSlug: "shopper-bea",
    productName: "Shopper Bea",
    sku: "BAG-001",
    imageUrl: null,
    price: 45000,
    optionsLabel: "Czarny / M",
    ...overrides,
  };
}

beforeEach(() => {
  useCartStore.setState({ items: [] });
});

describe("useCartStore", () => {
  it("adds a new item with the default quantity of 1", () => {
    useCartStore.getState().addItem(item());
    expect(useCartStore.getState().items).toEqual([{ ...item(), quantity: 1 }]);
  });

  it("adds a new item with an explicit quantity", () => {
    useCartStore.getState().addItem(item(), 3);
    expect(useCartStore.getState().items[0].quantity).toBe(3);
  });

  it("merges quantities when the same variant is added twice", () => {
    useCartStore.getState().addItem(item(), 2);
    useCartStore.getState().addItem(item(), 3);
    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(5);
  });

  it("keeps different variants of the same product as separate lines", () => {
    useCartStore.getState().addItem(item({ variantId: "variant-1", optionsLabel: "Czarny / M" }));
    useCartStore.getState().addItem(item({ variantId: "variant-2", optionsLabel: "Czarny / L" }));
    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it("removes an item by variantId", () => {
    useCartStore.getState().addItem(item({ variantId: "variant-1" }));
    useCartStore.getState().addItem(item({ variantId: "variant-2" }));
    useCartStore.getState().removeItem("variant-1");
    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].variantId).toBe("variant-2");
  });

  it("setQuantity updates the quantity of an existing line", () => {
    useCartStore.getState().addItem(item(), 1);
    useCartStore.getState().setQuantity("variant-1", 7);
    expect(useCartStore.getState().items[0].quantity).toBe(7);
  });

  it("setQuantity to 0 or below removes the line instead of leaving a zero-quantity item", () => {
    useCartStore.getState().addItem(item(), 1);
    useCartStore.getState().setQuantity("variant-1", 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("setQuantity on a variant not in the cart is a no-op, not a crash", () => {
    useCartStore.getState().addItem(item({ variantId: "variant-1" }), 1);
    useCartStore.getState().setQuantity("does-not-exist", 5);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  it("clear empties the cart", () => {
    useCartStore.getState().addItem(item());
    useCartStore.getState().clear();
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
