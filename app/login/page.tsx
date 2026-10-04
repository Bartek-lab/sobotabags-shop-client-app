import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Logowanie | KS",
};

export default function LoginPage() {
  return (
    <AuthShell title="Zaloguj się" description="Wprowadź dane, aby uzyskać dostęp do swojego konta.">
      <LoginForm />
    </AuthShell>
  );
}
