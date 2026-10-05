"use client";

import * as React from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { createAddress, deleteAddress, getAddresses, updateAddress } from "@/lib/addresses";
import type { Address, AddressInput } from "@/types";
import { AddressFields, emptyAddress } from "@/components/checkout/address-fields";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export function AddressBook() {
  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Address | null>(null);
  const [form, setForm] = React.useState<Partial<AddressInput>>(emptyAddress());
  const [saving, setSaving] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      setAddresses(await getAddresses());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Nie udało się wczytać adresów.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(emptyAddress());
    setDialogOpen(true);
  }

  function openEdit(address: Address) {
    setEditing(address);
    setForm(address);
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.firstName || !form.lastName || !form.line1 || !form.city || !form.postalCode) {
      toast.error("Uzupełnij wymagane pola adresu.");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateAddress(editing.id, form as AddressInput);
      } else {
        await createAddress(form as AddressInput);
      }
      toast.success("Adres zapisany");
      setDialogOpen(false);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Nie udało się zapisać adresu.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteAddress(id);
      toast.success("Adres usunięty");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Nie udało się usunąć adresu.");
    }
  }

  if (loading) return <Skeleton className="h-32 w-full" />;

  return (
    <div className="space-y-4">
      {addresses.length === 0 ? (
        <p className="text-sm text-muted-foreground">Brak zapisanych adresów.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {addresses.map((a) => (
            <div key={a.id} className="space-y-2 rounded-sm border border-border p-4 text-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">
                    {a.firstName} {a.lastName}
                  </p>
                  {a.label && <p className="text-xs text-muted-foreground">{a.label}</p>}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="size-7" onClick={() => openEdit(a)}>
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-7" onClick={() => handleDelete(a.id)}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground">
                {a.line1}
                {a.line2 ? `, ${a.line2}` : ""}
                <br />
                {a.postalCode} {a.city}
              </p>
              <div className="flex gap-1.5">
                {a.isDefaultShipping && (
                  <span className="rounded-sm bg-secondary px-1.5 py-0.5 text-xs">domyślny dostawa</span>
                )}
                {a.isDefaultBilling && (
                  <span className="rounded-sm bg-secondary px-1.5 py-0.5 text-xs">domyślny faktura</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger
          render={
            <Button variant="outline" size="sm" className="gap-2" onClick={openCreate}>
              <Plus className="size-3.5" />
              Dodaj adres
            </Button>
          }
        />
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edytuj adres" : "Nowy adres"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <AddressFields value={form} onChange={setForm} />
            <div className="flex items-center gap-2">
              <Checkbox
                id="addr-default-shipping"
                checked={!!form.isDefaultShipping}
                onCheckedChange={(v) => setForm({ ...form, isDefaultShipping: !!v })}
              />
              <Label htmlFor="addr-default-shipping" className="font-normal">
                Domyślny adres dostawy
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="addr-default-billing"
                checked={!!form.isDefaultBilling}
                onCheckedChange={(v) => setForm({ ...form, isDefaultBilling: !!v })}
              />
              <Label htmlFor="addr-default-billing" className="font-normal">
                Domyślny adres do faktury
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              Zapisz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
