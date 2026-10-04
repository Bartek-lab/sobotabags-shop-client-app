"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("fullName") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      await register({ fullName, email, password });
      toast.success("Konto zostało utworzone!");
      router.push("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się zarejestrować.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="fullName">Imię i nazwisko</Label>
        <Input id="fullName" name="fullName" type="text" placeholder="Jan Kowalski" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Adres e-mail</Label>
        <Input id="email" name="email" type="email" placeholder="jan.kowalski@example.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Hasło</Label>
        <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={6} />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading && <Loader2 className="size-4 animate-spin" />}
        Zarejestruj się
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Masz już konto?{" "}
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Zaloguj się
        </Link>
      </p>
    </form>
  );
}
