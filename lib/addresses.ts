import { deleteAddressById, fetchAddresses, postAddress, putAddress } from "@/lib/api/addresses";
import { mapAddress, toAddressPayload } from "@/lib/mappings/addresses";
import type { Address, AddressInput } from "@/types";

export async function getAddresses(): Promise<Address[]> {
  const raw = await fetchAddresses();
  return raw.map(mapAddress);
}

export async function createAddress(input: AddressInput): Promise<Address> {
  const raw = await postAddress(toAddressPayload(input));
  return mapAddress(raw);
}

export async function updateAddress(id: string, input: AddressInput): Promise<Address> {
  const raw = await putAddress(id, toAddressPayload(input));
  return mapAddress(raw);
}

export async function deleteAddress(id: string): Promise<void> {
  await deleteAddressById(id);
}
