import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Ustaw nowe hasło | KS",
};

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Ustaw nowe hasło" description="Wprowadź nowe hasło do swojego konta.">
      <ResetPasswordForm />
    </AuthShell>
  );
}
