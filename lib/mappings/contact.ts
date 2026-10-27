import type { RawContactOut } from "@/lib/api/contact";
import type { ContactInput } from "@/types";

export function toContactPayload(input: ContactInput) {
  return {
    name: input.name,
    email: input.email,
    phone: input.phone || undefined,
    topic: input.topic,
    message: input.message,
  };
}

export function mapContactResult(raw: RawContactOut): { ticketId: string } {
  return { ticketId: raw.ticket_id };
}
