"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { useAuthStore } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const requestPasswordReset = useAuthStore((state) => state.requestPasswordReset);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [sent, setSent] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");

    setIsLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się wysłać wiadomości.");
    } finally {
      setIsLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="space-y-5 text-center">
        <p className="text-sm text-muted-foreground">
          Jeśli to konto istnieje, wysłaliśmy na podany adres e-mail link do ustawienia nowego hasła.
        </p>
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Wróć do logowania
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Adres e-mail</Label>
        <Input id="email" name="email" type="email" placeholder="jan.kowalski@example.com" required />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading && <Loader2 className="size-4 animate-spin" />}
        Wyślij link
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Wróć do logowania
        </Link>
      </p>
    </form>
  );
}
