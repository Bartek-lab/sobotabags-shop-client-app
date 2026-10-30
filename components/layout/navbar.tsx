"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, ShoppingBag, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuthStore } from "@/lib/auth";
import { useCartCount } from "@/lib/cart";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/products", label: "Sklep" },
  { href: "/o-mnie", label: "O mnie" },
  { href: "/contact", label: "Kontakt" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const cartCount = useCartCount();
  const [open, setOpen] = React.useState(false);

  async function handleLogout() {
    await logout();
    toast.success("Wylogowano pomyślnie.");
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Logo showWordmark={false} markClassName="h-9" />
          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "text-sm tracking-wide text-muted-foreground transition-colors hover:text-foreground",
                  pathname === link.href.split("?")[0] && "text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" className="hidden gap-2 sm:flex">
                    <UserIcon className="size-[18px]" />
                    <span className="text-sm">{user.fullName.split(" ")[0]}</span>
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <p className="text-sm font-medium">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={<Link href="/account">Moje konto</Link>} />
                  <DropdownMenuItem onClick={handleLogout}>Wyloguj się</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              className="hidden sm:inline-flex"
              render={<Link href="/login">Zaloguj się</Link>}
            />
          )}

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            render={
              <Link href="/cart" aria-label="Koszyk">
                <ShoppingBag className="size-[18px]" />
                {cartCount > 0 && (
                  <span className="absolute right-0.5 top-0.5 flex size-4 items-center justify-center rounded-full bg-leather text-[10px] font-medium text-leather-foreground">
                    {cartCount}
                  </span>
                )}
              </Link>
            }
          />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
                  <Menu className="size-5" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-display text-xl">KS</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-2 py-2.5 text-sm text-foreground/90 hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="my-2 border-t border-border" />
                {user ? (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setOpen(false)}
                      className="rounded-md px-2 py-2.5 text-sm hover:bg-muted"
                    >
                      Moje konto
                    </Link>
                    <button
                      onClick={() => {
                        setOpen(false);
                        handleLogout();
                      }}
                      className="rounded-md px-2 py-2.5 text-left text-sm hover:bg-muted"
                    >
                      Wyloguj się
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="rounded-md px-2 py-2.5 text-sm hover:bg-muted"
                    >
                      Zaloguj się
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setOpen(false)}
                      className="rounded-md px-2 py-2.5 text-sm hover:bg-muted"
                    >
                      Zarejestruj się
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
