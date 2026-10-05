"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

import type { Order } from "@/types";
import { useAuthStore } from "@/lib/auth";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderHistory } from "@/components/account/order-history";
import { AddressBook } from "@/components/account/address-book";

export function AccountView({ orders }: { orders: Order[] }) {
  const { user, isReady } = useRequireAuth("/login");
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  async function handleLogout() {
    await logout();
    toast.success("Wylogowano pomyślnie.");
    router.push("/");
  }

  if (!isReady || !user) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section className="flex flex-col items-start justify-between gap-6 rounded-sm border border-border p-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Avatar className="size-14">
            <AvatarFallback className="bg-secondary text-base">
              <UserIcon className="size-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-display text-lg">{user.fullName}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleLogout}>
          <LogOut className="size-4" />
          Wyloguj się
        </Button>
      </section>

      <Separator />

      <section className="space-y-5">
        <h2 className="font-display text-xl">Adresy</h2>
        <AddressBook />
      </section>

      <Separator />

      <section className="space-y-5">
        <h2 className="font-display text-xl">Historia zamówień</h2>
        <OrderHistory orders={orders} />
      </section>
    </div>
  );
}
