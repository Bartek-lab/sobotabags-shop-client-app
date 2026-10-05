"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth";

// Runs once, high in the tree: resolves the real Supabase session on first
// load and subscribes to subsequent auth state changes. Renders nothing --
// this is wiring, not UI.
export function AuthInitializer() {
  useEffect(() => {
    useAuthStore.getState().init();
  }, []);
  return null;
}
