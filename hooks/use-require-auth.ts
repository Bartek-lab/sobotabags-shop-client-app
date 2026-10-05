"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth";
import type { User } from "@/types";

/**
 * Guards a client view behind auth. Waits for the real Supabase session
 * check (`isLoading`, set by `useAuthStore`'s `init()`) before redirecting,
 * so a logged-in user isn't briefly bounced to `redirectTo` while the
 * session is still being resolved on first load.
 *
 * No role/permission check here -- this app has no admin concept anymore
 * (real admin lives in a separate app), so "logged in" is the only gate.
 */
export function useRequireAuth(redirectTo: string): { user: User | null; isReady: boolean } {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.replace(redirectTo);
    }
  }, [isLoading, user, router, redirectTo]);

  return { user, isReady: !isLoading && !!user };
}
