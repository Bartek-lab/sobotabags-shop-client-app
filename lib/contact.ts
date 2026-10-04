/**
 * Mock contact form submission, standing in for a future Supabase insert
 * into a `contact_messages` table (or an Edge Function that forwards the
 * message by email). The function is already async so the form component
 * won't need to change once it's wired up to a real backend.
 */

export type ContactTopic = "zamowienie-indywidualne" | "pytanie-o-produkt" | "zamowienie-i-dostawa" | "inne";

export interface ContactInput {
  name: string;
  email: string;
  phone?: string;
  topic: ContactTopic;
  message: string;
}

function delay(ms = 800) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockSubmitContactForm(input: ContactInput): Promise<{ ticketId: string }> {
  await delay();
  if (!input.name || !input.email || !input.message) {
    throw new Error("Wypełnij wszystkie wymagane pola.");
  }
  return { ticketId: `WIAD-${Math.floor(10000 + Math.random() * 90000)}` };
}
