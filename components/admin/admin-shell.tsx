"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Package, ShoppingCart, LogOut } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/lib/auth";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/admin/products", label: "Produkty", icon: Package },
  { href: "/admin/orders", label: "Zamówienia", icon: ShoppingCart },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, isReady } = useRequireAuth("/login", (user) => user.role === "admin", "/");
  const logout = useAuthStore((state) => state.logout);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    toast.success("Wylogowano pomyślnie.");
    router.push("/login");
  }

  if (!isReady || !user) {
    return (
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <aside className="hidden w-56 shrink-0 flex-col gap-1 lg:flex">
        <div className="mb-6 flex items-center gap-2">
          <Logo />
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-secondary-foreground">
            Admin
          </span>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                  active
                    ? "bg-secondary font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-3 border-t border-border pt-4">
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          <Button variant="outline" size="sm" className="w-full gap-2" onClick={handleLogout}>
            <LogOut className="size-3.5" />
            Wyloguj się
          </Button>
        </div>
      </aside>

      <div className="min-w-0 flex-1 space-y-6">
        <nav className="flex gap-1 border-b border-border pb-3 lg:hidden">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm",
                  active ? "bg-secondary font-medium text-foreground" : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Icon className="size-4" />
                {link.label}
              </Link>
            );
          })}
          <Button variant="ghost" size="sm" className="ml-auto gap-2" onClick={handleLogout}>
            <LogOut className="size-3.5" />
          </Button>
        </nav>

        {children}
      </div>
    </div>
  );
}
