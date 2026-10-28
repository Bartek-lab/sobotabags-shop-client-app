import { afterEach, describe, expect, it, vi } from "vitest";
import { mapContactResult, toContactPayload } from "@/lib/mappings/contact";
import type { ContactInput } from "@/types";

vi.mock("@/lib/api/contact", () => ({
  postContact: vi.fn(),
}));

import { postContact } from "@/lib/api/contact";
import { submitContactForm } from "@/lib/contact";

function validInput(overrides: Partial<ContactInput> = {}): ContactInput {
  return {
    name: "Jan Kowalski",
    email: "jan@example.com",
    phone: "+48600000000",
    topic: "pytanie-o-produkt",
    message: "Czy mogę zamówić w innym kolorze?",
    ...overrides,
  };
}

describe("toContactPayload", () => {
  it("maps all fields through, omitting an empty phone rather than sending an empty string", () => {
    expect(toContactPayload(validInput({ phone: "" }))).toEqual({
      name: "Jan Kowalski",
      email: "jan@example.com",
      phone: undefined,
      topic: "pytanie-o-produkt",
      message: "Czy mogę zamówić w innym kolorze?",
    });
  });

  it("keeps a provided phone", () => {
    expect(toContactPayload(validInput()).phone).toBe("+48600000000");
  });
});

describe("mapContactResult", () => {
  it("maps the raw ticket_id to ticketId", () => {
    expect(mapContactResult({ ticket_id: "abc-123" })).toEqual({ ticketId: "abc-123" });
  });
});

describe("submitContactForm", () => {
  afterEach(() => {
    vi.mocked(postContact).mockReset();
  });

  it("rejects before calling the API when name is missing", async () => {
    await expect(submitContactForm(validInput({ name: "" }))).rejects.toThrow(
      "Wypełnij wszystkie wymagane pola.",
    );
    expect(postContact).not.toHaveBeenCalled();
  });

  it("rejects before calling the API when email is missing", async () => {
    await expect(submitContactForm(validInput({ email: "" }))).rejects.toThrow(
      "Wypełnij wszystkie wymagane pola.",
    );
    expect(postContact).not.toHaveBeenCalled();
  });

  it("rejects before calling the API when message is missing", async () => {
    await expect(submitContactForm(validInput({ message: "" }))).rejects.toThrow(
      "Wypełnij wszystkie wymagane pola.",
    );
    expect(postContact).not.toHaveBeenCalled();
  });

  it("does not require phone -- a missing phone alone doesn't block submission", async () => {
    vi.mocked(postContact).mockResolvedValue({ ticket_id: "t-1" });
    await expect(submitContactForm(validInput({ phone: "" }))).resolves.toEqual({ ticketId: "t-1" });
    expect(postContact).toHaveBeenCalledOnce();
  });

  it("submits the mapped payload and maps the response back on success", async () => {
    vi.mocked(postContact).mockResolvedValue({ ticket_id: "ticket-42" });
    const result = await submitContactForm(validInput());
    expect(postContact).toHaveBeenCalledWith({
      name: "Jan Kowalski",
      email: "jan@example.com",
      phone: "+48600000000",
      topic: "pytanie-o-produkt",
      message: "Czy mogę zamówić w innym kolorze?",
    });
    expect(result).toEqual({ ticketId: "ticket-42" });
  });

  it("propagates a backend failure instead of swallowing it", async () => {
    vi.mocked(postContact).mockRejectedValue(new Error("502"));
    await expect(submitContactForm(validInput())).rejects.toThrow("502");
  });
});
