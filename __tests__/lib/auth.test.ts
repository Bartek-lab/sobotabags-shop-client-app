import { beforeEach, describe, expect, it, vi } from "vitest";

const mockSupabase = {
  auth: {
    getUser: vi.fn(),
    onAuthStateChange: vi.fn(),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn(),
  },
};

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => mockSupabase,
}));

import { useAuthStore } from "@/lib/auth";

function supabaseUser(overrides: Record<string, unknown> = {}) {
  return {
    id: "user-1",
    email: "jan@example.com",
    created_at: "2026-01-01T00:00:00Z",
    user_metadata: { full_name: "Jan Kowalski" },
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  useAuthStore.setState({ user: null, isLoading: true, error: null });
});

describe("useAuthStore.login", () => {
  it("maps the Supabase user onto the store on success", async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: supabaseUser() },
      error: null,
    });

    const result = await useAuthStore.getState().login({ email: "jan@example.com", password: "secret" });

    expect(result).toEqual({
      id: "user-1",
      email: "jan@example.com",
      fullName: "Jan Kowalski",
      createdAt: "2026-01-01T00:00:00Z",
    });
    expect(useAuthStore.getState().user).toEqual(result);
    expect(useAuthStore.getState().isLoading).toBe(false);
    expect(useAuthStore.getState().error).toBeNull();
  });

  it("falls back to an empty fullName/email when Supabase doesn't provide them", async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: supabaseUser({ email: undefined, user_metadata: {} }) },
      error: null,
    });

    const result = await useAuthStore.getState().login({ email: "jan@example.com", password: "secret" });
    expect(result.email).toBe("");
    expect(result.fullName).toBe("");
  });

  it("throws and sets error on a Supabase error response", async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: "Invalid login credentials" },
    });

    await expect(
      useAuthStore.getState().login({ email: "jan@example.com", password: "wrong" }),
    ).rejects.toThrow("Invalid login credentials");
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().error).toBe("Invalid login credentials");
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it("throws a sensible default message when Supabase gives no error but also no user", async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({ data: { user: null }, error: null });
    await expect(
      useAuthStore.getState().login({ email: "jan@example.com", password: "x" }),
    ).rejects.toThrow("Nie udało się zalogować.");
  });
});

describe("useAuthStore.register", () => {
  it("logs the user in immediately when signUp returns a session (no email confirmation required)", async () => {
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: supabaseUser(), session: { access_token: "t" } },
      error: null,
    });

    await useAuthStore.getState().register({ email: "jan@example.com", password: "secret", fullName: "Jan Kowalski" });
    expect(useAuthStore.getState().user).not.toBeNull();
  });

  it("leaves the user logged out when signUp succeeds but returns no session (email confirmation pending)", async () => {
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: supabaseUser(), session: null },
      error: null,
    });

    await useAuthStore.getState().register({ email: "jan@example.com", password: "secret", fullName: "Jan Kowalski" });
    expect(useAuthStore.getState().user).toBeNull();
  });

  it("throws and sets error on failure", async () => {
    mockSupabase.auth.signUp.mockResolvedValue({ data: {}, error: { message: "Email already registered" } });
    await expect(
      useAuthStore.getState().register({ email: "jan@example.com", password: "secret", fullName: "Jan Kowalski" }),
    ).rejects.toThrow("Email already registered");
  });
});

describe("useAuthStore.logout", () => {
  it("clears the user", async () => {
    useAuthStore.setState({ user: { id: "1", email: "a@a.com", fullName: "A", createdAt: "" } });
    mockSupabase.auth.signOut.mockResolvedValue({ error: null });
    await useAuthStore.getState().logout();
    expect(useAuthStore.getState().user).toBeNull();
  });
});

describe("useAuthStore.requestPasswordReset", () => {
  it("throws on a Supabase error", async () => {
    mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({ error: { message: "boom" } });
    await expect(useAuthStore.getState().requestPasswordReset("jan@example.com")).rejects.toThrow("boom");
  });

  it("resolves without throwing on success (never reveals whether the email exists)", async () => {
    mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({ error: null });
    await expect(useAuthStore.getState().requestPasswordReset("jan@example.com")).resolves.toBeUndefined();
  });
});

describe("useAuthStore.updatePassword", () => {
  it("throws on a Supabase error", async () => {
    mockSupabase.auth.updateUser.mockResolvedValue({ error: { message: "Password too short" } });
    await expect(useAuthStore.getState().updatePassword("abc")).rejects.toThrow("Password too short");
  });

  it("resolves on success", async () => {
    mockSupabase.auth.updateUser.mockResolvedValue({ error: null });
    await expect(useAuthStore.getState().updatePassword("a-good-password")).resolves.toBeUndefined();
  });
});
