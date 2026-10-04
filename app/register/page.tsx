import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Rejestracja | KS",
};

export default function RegisterPage() {
  return (
    <AuthShell title="Utwórz konto" description="Dołącz do KS, by śledzić zamówienia i zapisywać ulubione produkty.">
      <RegisterForm />
    </AuthShell>
  );
}
