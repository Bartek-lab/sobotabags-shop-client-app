import { create } from "zustand";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User } from "@/types";
import { createClient } from "@/lib/supabase/client";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
}

function mapUser(u: SupabaseUser): User {
  return {
    id: u.id,
    email: u.email ?? "",
    fullName: (u.user_metadata?.full_name as string | undefined) ?? "",
    createdAt: u.created_at,
  };
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  init: () => Promise<void>;
  login: (input: LoginInput) => Promise<User>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

// Deliberately NOT zustand/persist: Supabase's own client already persists
// the session itself (cookies via @supabase/ssr); a second, independent
// localStorage copy of `user` here would drift from it whenever a token
// expires or is revoked server-side with no way to notice. This store is a
// thin reactive mirror of Supabase's auth state, not its own source of truth.
export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isLoading: true,
  error: null,

  init: async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    set({ user: user ? mapUser(user) : null, isLoading: false });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ? mapUser(session.user) : null });
    });
  },

  login: async (input) => {
    set({ isLoading: true, error: null });
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword(input);
    if (error || !data.user) {
      const message = error?.message ?? "Nie udało się zalogować.";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
    const user = mapUser(data.user);
    set({ user, isLoading: false });
    return user;
  },

  register: async (input) => {
    set({ isLoading: true, error: null });
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: { data: { full_name: input.fullName } },
    });
    if (error) {
      set({ isLoading: false, error: error.message });
      throw new Error(error.message);
    }
    // If email confirmation is required on this project, signUp succeeds
    // but returns no session -- the user isn't actually logged in yet.
    set({ user: data.user && data.session ? mapUser(data.user) : null, isLoading: false });
  },

  logout: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
