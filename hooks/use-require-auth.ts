"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth";
import type { User } from "@/types";

/**
 * Guards a client view behind auth, optionally requiring more than "logged
 * in" (e.g. a role check via `allow`). Waits for the persisted auth store to
 * hydrate (`mounted`) before redirecting, so a logged-in user isn't briefly
 * bounced to `redirectTo` on refresh.
 *
 * A logged-in user who fails `allow` is sent to `unauthorizedRedirectTo`
 * (defaults to `redirectTo`) rather than back to the login form.
 */
export function useRequireAuth(
  redirectTo: string,
  allow?: (user: User) => boolean,
  unauthorizedRedirectTo: string = redirectTo
): { user: User | null; isReady: boolean } {
  const [mounted, setMounted] = React.useState(false);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const authorized = !!user && (!allow || allow(user));

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!mounted) return;
    if (!user) {
      router.replace(redirectTo);
    } else if (!authorized) {
      router.replace(unauthorizedRedirectTo);
    }
  }, [mounted, user, authorized, router, redirectTo, unauthorizedRedirectTo]);

  return { user, isReady: mounted && authorized };
}
