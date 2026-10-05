import { createClient } from "@/lib/supabase/client";

const API_URL = process.env.NEXT_PUBLIC_API_SHOP_URL;

// Attaches the Supabase access token when a session exists; every endpoint
// that actually requires it enforces that server-side (get_current_customer
// vs get_current_customer_optional in api-shop) -- this just doesn't bother
// sending a header when there's nothing to send.
export async function apiShopFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      ...init.headers,
    },
  });
}

export async function apiShopJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await apiShopFetch(path, init);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ?? `Request failed (HTTP ${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}
