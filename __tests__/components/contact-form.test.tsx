import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockSubmitContactForm = vi.fn();
vi.mock("@/lib/contact", () => ({
  submitContactForm: (...args: unknown[]) => mockSubmitContactForm(...args),
}));

const mockToastSuccess = vi.fn();
vi.mock("sonner", () => ({
  toast: { success: (...args: unknown[]) => mockToastSuccess(...args), error: vi.fn() },
}));

import { ContactForm } from "@/components/contact/contact-form";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ContactForm", () => {
  it("submits the filled-in fields and shows a success toast with the ticket id", async () => {
    mockSubmitContactForm.mockResolvedValue({ ticketId: "ticket-99" });
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("Imię i nazwisko"), "Jan Kowalski");
    await user.type(screen.getByLabelText("Adres e-mail"), "jan@example.com");
    await user.type(screen.getByLabelText("Wiadomość"), "Pytanie o dostępność koloru.");
    await user.click(screen.getByRole("button", { name: /wyślij wiadomość/i }));

    await waitFor(() =>
      expect(mockSubmitContactForm).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Jan Kowalski",
          email: "jan@example.com",
          message: "Pytanie o dostępność koloru.",
          topic: "zamowienie-indywidualne",
        }),
      ),
    );
    await waitFor(() =>
      expect(mockToastSuccess).toHaveBeenCalledWith(
        "Wiadomość wysłana!",
        expect.objectContaining({ description: expect.stringContaining("ticket-99") }),
      ),
    );
  });

  it("shows the error message and does not toast on failure, and re-enables the submit button", async () => {
    mockSubmitContactForm.mockRejectedValue(new Error("Wypełnij wszystkie wymagane pola."));
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("Imię i nazwisko"), "Jan Kowalski");
    await user.type(screen.getByLabelText("Adres e-mail"), "jan@example.com");
    await user.type(screen.getByLabelText("Wiadomość"), "x");
    const submitButton = screen.getByRole("button", { name: /wyślij wiadomość/i });
    await user.click(submitButton);

    expect(await screen.findByText("Wypełnij wszystkie wymagane pola.")).toBeInTheDocument();
    expect(mockToastSuccess).not.toHaveBeenCalled();
    await waitFor(() => expect(submitButton).toBeEnabled());
  });
});
