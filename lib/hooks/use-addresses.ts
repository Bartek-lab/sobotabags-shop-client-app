import * as React from "react";

import { createAddress, deleteAddress, getAddresses, updateAddress } from "@/lib/addresses";
import type { Address, AddressInput } from "@/types";

/**
 * Shared address-book data + mutations. `enabled` gates the initial fetch --
 * the checkout page only wants this once a customer is logged in, since
 * guests have no saved addresses to load.
 */
export function useAddresses(enabled: boolean = true) {
  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [loading, setLoading] = React.useState(enabled);
  const [error, setError] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    try {
      setAddresses(await getAddresses());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się wczytać adresów.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (enabled) refresh();
  }, [enabled, refresh]);

  const create = React.useCallback(
    async (input: AddressInput) => {
      const address = await createAddress(input);
      await refresh();
      return address;
    },
    [refresh]
  );

  const update = React.useCallback(
    async (id: string, input: AddressInput) => {
      const address = await updateAddress(id, input);
      await refresh();
      return address;
    },
    [refresh]
  );

  const remove = React.useCallback(
    async (id: string) => {
      await deleteAddress(id);
      await refresh();
    },
    [refresh]
  );

  return { addresses, loading, error, refresh, create, update, remove };
}
