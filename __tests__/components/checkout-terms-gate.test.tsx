import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Regression/compliance test for the mandatory Regulamin-acceptance
// checkbox added this session (a legal requirement, not just UX) -- locks
// in that checkout cannot proceed to payment without it, regardless of
// everything else being filled in correctly.

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

const mockUser = vi.fn(() => null);
vi.mock("@/lib/auth", () => ({
  useAuthStore: Object.assign(
    (selector: (s: { user: unknown; register: unknown }) => unknown) =>
      selector({ user: mockUser(), register: vi.fn() }),
    { getState: () => ({ user: mockUser() }) },
  ),
}));

vi.mock("@/lib/cart", () => ({
  useCartStore: (selector: (s: { items: unknown[] }) => unknown) =>
    selector({
      items: [
        {
          variantId: "v1",
          productSlug: "shopper-bea",
          productName: "Shopper Bea",
          sku: "BAG-001",
          imageUrl: null,
          price: 45000,
          optionsLabel: "Czarny / M",
          quantity: 1,
        },
      ],
    }),
}));

vi.mock("@/lib/hooks/use-shipping-methods", () => ({
  useShippingMethods: () => ({
    methods: [
      {
        id: "method-courier",
        code: "courier",
        carrierCode: "inpost",
        name: "Kurier InPost",
        requiresPickupPoint: false,
        priceAmount: 1500,
        freeAboveAmount: null,
      },
    ],
    loading: false,
    selectedMethodId: "method-courier",
    setSelectedMethodId: vi.fn(),
  }),
}));

vi.mock("@/lib/hooks/use-addresses", () => ({
  useAddresses: () => ({ addresses: [], loading: false, error: null, refresh: vi.fn(), create: vi.fn(), update: vi.fn(), remove: vi.fn() }),
}));

vi.mock("@/lib/hooks/use-pricing-preview", () => ({
  usePricingPreview: () => ({ pricing: null, loading: false, error: null }),
}));

const mockCreateCheckoutSession = vi.fn();
vi.mock("@/lib/checkout", () => ({
  createCheckoutSession: (...args: unknown[]) => mockCreateCheckoutSession(...args),
}));

import CheckoutPage from "@/app/checkout/page";

async function fillRequiredFieldsExceptTerms(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Adres e-mail"), "jan@example.com");
  await user.type(screen.getByLabelText("Imię"), "Jan");
  await user.type(screen.getByLabelText("Nazwisko"), "Kowalski");
  await user.type(screen.getByLabelText("Ulica i numer"), "Testowa 1");
  await user.type(screen.getByLabelText("Miasto"), "Poznań");
  await user.type(screen.getByLabelText(/kod pocztowy/i), "60-000");
}

beforeEach(() => {
  vi.clearAllMocks();
  mockUser.mockReturnValue(null);
});

describe("CheckoutPage -- mandatory terms acceptance", () => {
  it("keeps the submit button disabled until the Regulamin checkbox is checked, even with every other field filled", async () => {
    const user = userEvent.setup();
    render(<CheckoutPage />);

    const submitButton = screen.getByRole("button", { name: "Zapłać" });
    expect(submitButton).toBeDisabled();

    await fillRequiredFieldsExceptTerms(user);
    // All other required fields are now filled -- the button must still be
    // disabled, since only the terms checkbox gates it at this point.
    expect(submitButton).toBeDisabled();

    await user.click(screen.getByRole("checkbox", { name: /akceptuję/i }));
    expect(submitButton).toBeEnabled();
  });

  it("the handleSubmit validation also rejects an unaccepted-terms submit directly (defense in depth, not just the disabled attribute)", async () => {
    const user = userEvent.setup();
    render(<CheckoutPage />);

    await fillRequiredFieldsExceptTerms(user);
    const submitButton = screen.getByRole("button", { name: "Zapłać" });
    // Bypass the disabled attribute the way a submit-on-Enter in some
    // browsers or a stale DOM snapshot could -- dispatch the form's submit
    // event directly rather than relying on the button's disabled state.
    const form = submitButton.closest("form")!;
    const { fireEvent } = await import("@testing-library/react");
    fireEvent.submit(form);

    expect(
      await screen.findByText("Aby złożyć zamówienie, musisz zaakceptować Regulamin."),
    ).toBeInTheDocument();
    expect(mockCreateCheckoutSession).not.toHaveBeenCalled();
  });

  it("proceeds to createCheckoutSession once terms are accepted and every other required field is filled", async () => {
    mockCreateCheckoutSession.mockResolvedValue({ url: "https://checkout.stripe.com/session123" });
    const user = userEvent.setup();
    render(<CheckoutPage />);

    await fillRequiredFieldsExceptTerms(user);
    await user.click(screen.getByRole("checkbox", { name: /akceptuję/i }));
    await user.click(screen.getByRole("button", { name: "Zapłać" }));

    await waitFor(() => expect(mockCreateCheckoutSession).toHaveBeenCalledTimes(1));
  });
});
