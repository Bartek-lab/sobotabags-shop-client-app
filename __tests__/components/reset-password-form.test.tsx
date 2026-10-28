import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";

// Regression test for the stale-closure bug caught and fixed earlier this
// session: the PASSWORD_RECOVERY-wait timeout must read a `useRef` mirror
// of `ready`, not the `ready` state itself, or it always sees the value
// frozen at effect-setup time (false) and incorrectly declares the link
// invalid even after the recovery event has actually fired.

let authStateCallback: ((event: string) => void) | null = null;
const mockUnsubscribe = vi.fn();

const mockSupabase = {
  auth: {
    onAuthStateChange: vi.fn((cb: (event: string) => void) => {
      authStateCallback = cb;
      return { data: { subscription: { unsubscribe: mockUnsubscribe } } };
    }),
    getSession: vi.fn(() =>
      Promise.resolve({ data: { session: null as { access_token: string } | null } }),
    ),
  },
};

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => mockSupabase,
}));

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mockUpdatePassword = vi.fn();
vi.mock("@/lib/auth", () => ({
  useAuthStore: (selector: (s: { updatePassword: typeof mockUpdatePassword }) => unknown) =>
    selector({ updatePassword: mockUpdatePassword }),
}));

import { ResetPasswordForm } from "@/components/auth/reset-password-form";

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  authStateCallback = null;
});

afterEach(() => {
  vi.useRealTimers();
});

describe("ResetPasswordForm", () => {
  it("shows a loading skeleton before the recovery session lands, then the form once PASSWORD_RECOVERY fires -- even after the 3s timeout window", async () => {
    render(<ResetPasswordForm />);

    // Before the event fires: skeleton, no form fields.
    expect(screen.queryByLabelText("Nowe hasło")).not.toBeInTheDocument();

    // Fire PASSWORD_RECOVERY *after* some time has passed but before the
    // 3s cutoff -- this is the exact scenario the readyRef fix targets.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    act(() => {
      authStateCallback?.("PASSWORD_RECOVERY");
    });

    // Now let the original 3s timeout actually elapse.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2500);
    });

    // The bug this test locks in: with the stale-closure version, the
    // timeout callback closes over `ready === false` from effect setup and
    // flips linkInvalid to true regardless of the event having fired. With
    // the readyRef fix, it must NOT show the "link expired" message.
    expect(screen.queryByText(/link wygasł/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText("Nowe hasło")).toBeInTheDocument();
  });

  it("shows the expired-link message if PASSWORD_RECOVERY never fires within 3s", async () => {
    render(<ResetPasswordForm />);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3100);
    });
    expect(screen.getByText(/link wygasł/i)).toBeInTheDocument();
    expect(screen.queryByLabelText("Nowe hasło")).not.toBeInTheDocument();
  });

  it("does not show expired-link message once an existing session is found via getSession (page reload case)", async () => {
    mockSupabase.auth.getSession.mockResolvedValueOnce({ data: { session: { access_token: "x" } } });
    render(<ResetPasswordForm />);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3100);
    });
    expect(screen.queryByText(/link wygasł/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText("Nowe hasło")).toBeInTheDocument();
  });

  it("rejects submission when password and confirmPassword don't match, without calling updatePassword", async () => {
    vi.useRealTimers();
    const user = (await import("@testing-library/user-event")).default.setup();
    render(<ResetPasswordForm />);
    authStateCallback?.("PASSWORD_RECOVERY");
    await screen.findByLabelText("Nowe hasło");

    await user.type(screen.getByLabelText("Nowe hasło"), "password1");
    await user.type(screen.getByLabelText("Powtórz nowe hasło"), "password2");
    await user.click(screen.getByRole("button", { name: /zapisz nowe hasło/i }));

    expect(await screen.findByText("Hasła nie są identyczne.")).toBeInTheDocument();
    expect(mockUpdatePassword).not.toHaveBeenCalled();
  });

  it("calls updatePassword and redirects to /account on matching passwords", async () => {
    vi.useRealTimers();
    mockUpdatePassword.mockResolvedValue(undefined);
    const user = (await import("@testing-library/user-event")).default.setup();
    render(<ResetPasswordForm />);
    authStateCallback?.("PASSWORD_RECOVERY");
    await screen.findByLabelText("Nowe hasło");

    await user.type(screen.getByLabelText("Nowe hasło"), "password1");
    await user.type(screen.getByLabelText("Powtórz nowe hasło"), "password1");
    await user.click(screen.getByRole("button", { name: /zapisz nowe hasło/i }));

    await waitFor(() => expect(mockUpdatePassword).toHaveBeenCalledWith("password1"));
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/account"));
  });
});
