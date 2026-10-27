import { apiShopJson } from "@/lib/api/client";

export interface RawContactOut {
  ticket_id: string;
}

export async function postContact(payload: Record<string, unknown>): Promise<RawContactOut> {
  return apiShopJson<RawContactOut>("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
