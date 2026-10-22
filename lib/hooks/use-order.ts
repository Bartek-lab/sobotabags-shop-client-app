import * as React from "react";

import { getMyOrder, submitWithdrawal } from "@/lib/orders";
import type { OrderDetail } from "@/types";

/**
 * A single order's detail + the "Odstąp od umowy" withdrawal action
 * (mandatory digital withdrawal function, EU Directive 2023/2673). Submitting
 * only records the declaration and cancels the order server-side -- refund
 * and restock are still manual, see shop-api/app/services/order_service.py.
 */
export function useOrder(orderId: string) {
  const [order, setOrder] = React.useState<OrderDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [withdrawing, setWithdrawing] = React.useState(false);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    try {
      setOrder(await getMyOrder(orderId));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się wczytać zamówienia.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const withdraw = React.useCallback(
    async (reason: string | null) => {
      setWithdrawing(true);
      try {
        await submitWithdrawal(orderId, reason);
        await refresh();
      } finally {
        setWithdrawing(false);
      }
    },
    [orderId, refresh]
  );

  return { order, loading, error, refresh, withdraw, withdrawing };
}
