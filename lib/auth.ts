import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

/**
 * Mock authentication standing in for Supabase Auth.
 *
 * `mockSignIn` / `mockSignUp` / `mockSignOut` simulate the network round trip
 * of `supabase.auth.signInWithPassword`, `supabase.auth.signUp` and
 * `supabase.auth.signOut`. When Supabase is wired up, only the bodies of
 * these three functions need to change — the zustand store and every
 * component using `useAuthStore` stay the same.
 *
 * Role is mocked too: signing in with an email containing "admin" (e.g.
 * admin@ksobota.pl) grants the `admin` role, gating access to `/admin`.
 * Real role checks will come from the Supabase `profiles` table later.
 */

const MOCK_USER: User = {
  id: "user_1",
  email: "jan.kowalski@example.com",
  fullName: "Jan Kowalski",
  role: "customer",
  createdAt: "2024-11-02T10:00:00.000Z",
};

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
}

function delay(ms = 700) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockSignIn(input: LoginInput): Promise<User> {
  await delay();
  if (!input.email || !input.password) {
    throw new Error("Podaj adres e-mail i hasło.");
  }
  const role = input.email.toLowerCase().includes("admin") ? "admin" : "customer";
  return { ...MOCK_USER, email: input.email, role };
}

export async function mockSignUp(input: RegisterInput): Promise<User> {
  await delay();
  if (!input.email || !input.password || !input.fullName) {
    throw new Error("Wypełnij wszystkie wymagane pola.");
  }
  return { ...MOCK_USER, email: input.email, fullName: input.fullName, role: "customer" };
}

export async function mockSignOut(): Promise<void> {
  await delay(200);
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (input: LoginInput) => Promise<User>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      login: async (input) => {
        set({ isLoading: true, error: null });
        try {
          const user = await mockSignIn(input);
          set({ user, isLoading: false });
          return user;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Nie udało się zalogować.";
          set({ isLoading: false, error: message });
          throw error;
        }
      },
      register: async (input) => {
        set({ isLoading: true, error: null });
        try {
          const user = await mockSignUp(input);
          set({ user, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Nie udało się zarejestrować.";
          set({ isLoading: false, error: message });
          throw error;
        }
      },
      logout: async () => {
        await mockSignOut();
        set({ user: null });
      },
    }),
    {
      name: "ksobota-auth",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
