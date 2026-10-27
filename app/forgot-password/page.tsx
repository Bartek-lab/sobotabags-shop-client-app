import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Nie pamiętam hasła | KS",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Nie pamiętasz hasła?"
      description="Podaj adres e-mail, a wyślemy link do ustawienia nowego hasła."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
