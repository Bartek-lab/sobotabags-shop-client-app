import { postContact } from "@/lib/api/contact";
import { mapContactResult, toContactPayload } from "@/lib/mappings/contact";
import type { ContactInput } from "@/types";

export type { ContactTopic, ContactInput } from "@/types";

export async function submitContactForm(input: ContactInput): Promise<{ ticketId: string }> {
  if (!input.name || !input.email || !input.message) {
    throw new Error("Wypełnij wszystkie wymagane pola.");
  }
  const raw = await postContact(toContactPayload(input));
  return mapContactResult(raw);
}
