import * as React from "react";

import { getMyOrders } from "@/lib/orders";
import type { Order } from "@/types";

export function useOrders() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    try {
      setOrders(await getMyOrders());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się wczytać zamówień.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  return { orders, loading, error, refresh };
}
