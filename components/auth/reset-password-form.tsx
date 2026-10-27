"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export function ResetPasswordForm() {
  const updatePassword = useAuthStore((state) => state.updatePassword);
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Supabase's client SDK exchanges the reset link's URL fragment into a
  // temporary "recovery" session automatically on load (detectSessionInUrl,
  // on by default) -- this just waits for that to actually land before
  // allowing the form to submit, and shows a clear error if the link was
  // invalid or already used, rather than letting the user fill out the
  // form only to have updateUser() fail at the end with no context.
  const [ready, setReady] = React.useState(false);
  const [linkInvalid, setLinkInvalid] = React.useState(false);

  const readyRef = React.useRef(false);

  React.useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        readyRef.current = true;
        setReady(true);
      }
    });

    // If the event already fired before this listener was attached (or
    // this is a page reload with an existing recovery session), a plain
    // session check covers it.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        readyRef.current = true;
        setReady(true);
      }
    });

    // readyRef (not the `ready` state) is what this reads -- a plain state
    // dependency here would just be the value from whichever render set up
    // this effect, stale by the time this callback actually runs.
    const timeout = setTimeout(() => {
      if (!readyRef.current) setLinkInvalid(true);
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setError("Hasła nie są identyczne.");
      return;
    }

    setIsSubmitting(true);
    try {
      await updatePassword(password);
      toast.success("Hasło zostało zmienione.");
      router.push("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się zmienić hasła.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (linkInvalid) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Ten link wygasł lub został już użyty. Poproś o nowy link na stronie{" "}
        <a href="/forgot-password" className="font-medium text-foreground hover:underline">
          odzyskiwania hasła
        </a>
        .
      </p>
    );
  }

  if (!ready) {
    return <Skeleton className="h-40 w-full" />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="password">Nowe hasło</Label>
        <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={6} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Powtórz nowe hasło</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          required
          minLength={6}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        Zapisz nowe hasło
      </Button>
    </form>
  );
}
