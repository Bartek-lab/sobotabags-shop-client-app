"use client";

import * as React from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { mockSubmitContactForm, type ContactTopic } from "@/lib/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TOPIC_OPTIONS: { value: ContactTopic; label: string }[] = [
  { value: "zamowienie-indywidualne", label: "Zamówienie indywidualne" },
  { value: "pytanie-o-produkt", label: "Pytanie o produkt" },
  { value: "zamowienie-i-dostawa", label: "Zamówienie i dostawa" },
  { value: "inne", label: "Inne" },
];

export function ContactForm() {
  const [topic, setTopic] = React.useState<ContactTopic>("zamowienie-indywidualne");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);

    setIsSubmitting(true);
    try {
      const { ticketId } = await mockSubmitContactForm({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        topic,
        message: String(formData.get("message") ?? ""),
      });
      toast.success("Wiadomość wysłana!", {
        description: `Numer zgłoszenia: ${ticketId}. Odpowiemy w ciągu 1-2 dni roboczych.`,
      });
      formRef.current?.reset();
      setTopic("zamowienie-indywidualne");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się wysłać wiadomości.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 rounded-sm border border-border bg-card p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Imię i nazwisko</Label>
          <Input id="name" name="name" type="text" placeholder="Jan Kowalski" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Adres e-mail</Label>
          <Input id="email" name="email" type="email" placeholder="jan.kowalski@example.com" required />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon (opcjonalnie)</Label>
          <Input id="phone" name="phone" type="tel" placeholder="+48 600 000 000" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="topic">Temat</Label>
          <Select value={topic} onValueChange={(value) => setTopic(value as ContactTopic)}>
            <SelectTrigger id="topic" className="w-full">
              <SelectValue placeholder="Wybierz temat" />
            </SelectTrigger>
            <SelectContent>
              {TOPIC_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Wiadomość</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Opisz swoją wizję torby — materiał, kolor, wymiary, dodatkowe życzenia..."
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        Wyślij wiadomość
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Formularz demonstracyjny — wiadomości nie są jeszcze wysyłane na żaden adres e-mail.
      </p>
    </form>
  );
}
