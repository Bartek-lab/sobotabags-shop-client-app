import * as React from "react";

import { getShippingMethods } from "@/lib/shipping";
import type { ShippingMethod } from "@/types";

export function useShippingMethods() {
  const [methods, setMethods] = React.useState<ShippingMethod[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedMethodId, setSelectedMethodId] = React.useState<string | null>(null);

  React.useEffect(() => {
    getShippingMethods()
      .then((ms) => {
        setMethods(ms);
        if (ms.length) setSelectedMethodId(ms[0].id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { methods, loading, selectedMethodId, setSelectedMethodId };
}
