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

export function LoginForm() {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      const user = await login({ email, password });
      toast.success("Witaj z powrotem!");
      router.push(user.role === "admin" ? "/admin/products" : "/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się zalogować.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Adres e-mail</Label>
        <Input id="email" name="email" type="email" placeholder="jan.kowalski@example.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Hasło</Label>
        <Input id="password" name="password" type="password" placeholder="••••••••" required />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading && <Loader2 className="size-4 animate-spin" />}
        Zaloguj się
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Nie masz jeszcze konta?{" "}
        <Link href="/register" className="font-medium text-foreground hover:underline">
          Zarejestruj się
        </Link>
      </p>
    </form>
  );
}
