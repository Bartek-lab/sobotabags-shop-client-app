import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "Polityka prywatności | KS",
  description: "Zasady przetwarzania danych osobowych Klientów sklepu internetowego KS.",
};

const EFFECTIVE_DATE = "7 października 2026 r.";

export default function PolitykaPrywatnosciPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Dokumenty" title="Polityka prywatności" className="mb-10" />

      <div className="space-y-10 text-base leading-relaxed text-muted-foreground">
        <p>Obowiązuje od {EFFECTIVE_DATE}.</p>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-medium text-foreground">§1. Administrator danych</h2>
          <p>
            Administratorem danych osobowych przetwarzanych w związku z korzystaniem ze sklepu internetowego
            KS jest Karolina Sobota, zamieszkała przy ul. Okrężnej 24, 63-200 Jarocin, adres e-mail:
            sobotabags@gmail.com (dalej: &bdquo;Administrator&rdquo;).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-medium text-foreground">
            §2. Jakie dane przetwarzamy i w jakim celu
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">Założenie i prowadzenie konta Klienta</strong> — adres
              e-mail oraz hasło (przechowywane w formie zaszyfrowanej przez dostawcę usług uwierzytelniania) —
              w celu umożliwienia logowania i zarządzania zamówieniami.
            </li>
            <li>
              <strong className="text-foreground">Realizacja zamówienia</strong> — imię, nazwisko, adres
              dostawy lub dane paczkomatu, numer telefonu, adres e-mail — w celu zawarcia i wykonania umowy
              sprzedaży, w tym dostarczenia Towaru.
            </li>
            <li>
              <strong className="text-foreground">Obsługa płatności</strong> — dane niezbędne do przeprowadzenia
              płatności, przetwarzane bezpośrednio przez operatora płatności Stripe; Administrator nie
              przechowuje numerów kart płatniczych.
            </li>
            <li>
              <strong className="text-foreground">Kontakt</strong> — dane podane w formularzu kontaktowym
              (imię, adres e-mail, treść wiadomości) — w celu udzielenia odpowiedzi na zapytanie, w tym
              dotyczące zamówień indywidualnych.
            </li>
            <li>
              <strong className="text-foreground">Rozpatrywanie reklamacji i odstąpień od umowy</strong> — dane
              podane w zgłoszeniu — w celu realizacji obowiązków wynikających z rękojmi oraz prawa odstąpienia
              od umowy.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-medium text-foreground">§3. Podstawy prawne przetwarzania</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>art. 6 ust. 1 lit. b RODO — przetwarzanie niezbędne do wykonania umowy (realizacja zamówień, obsługa konta);</li>
            <li>art. 6 ust. 1 lit. c RODO — przetwarzanie niezbędne do wypełnienia obowiązku prawnego (np. rozpatrzenie reklamacji, obowiązki podatkowe);</li>
            <li>art. 6 ust. 1 lit. f RODO — prawnie uzasadniony interes Administratora (np. dochodzenie roszczeń, zapobieganie nadużyciom);</li>
            <li>art. 6 ust. 1 lit. a RODO — zgoda (np. dobrowolne pliki cookies inne niż niezbędne, jeśli są stosowane).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-medium text-foreground">§4. Odbiorcy danych</h2>
          <p>Dane osobowe mogą być przekazywane następującym kategoriom odbiorców, wyłącznie w zakresie niezbędnym do realizacji wskazanych celów:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Supabase Inc. — dostawca infrastruktury bazodanowej, uwierzytelniania oraz przechowywania plików (zdjęcia produktów);</li>
            <li>Stripe, Inc. — operator płatności internetowych;</li>
            <li>Firmy kurierskie oraz InPost — w zakresie niezbędnym do dostarczenia przesyłki;</li>
            <li>Podmioty świadczące usługi hostingowe oraz wysyłki wiadomości e-mail niezbędnych do obsługi zamówień.</li>
          </ul>
          <p>
            Część z powyższych dostawców może przetwarzać dane na serwerach zlokalizowanych poza Europejskim
            Obszarem Gospodarczym. W takich przypadkach przekazanie danych odbywa się w oparciu o standardowe
            klauzule umowne zatwierdzone przez Komisję Europejską lub inny mechanizm zapewniający odpowiedni
            stopień ochrony danych.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-medium text-foreground">§5. Okres przechowywania danych</h2>
          <p>
            Dane związane z realizacją zamówienia przechowywane są przez okres niezbędny do wykonania umowy
            oraz przez okres przedawnienia roszczeń z niej wynikających, a w zakresie, w jakim przepisy prawa
            (np. podatkowe) wymagają dłuższego przechowywania — przez okres wynikający z tych przepisów. Dane
            konta Klienta przechowywane są do czasu jego usunięcia przez Klienta lub na jego żądanie.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-medium text-foreground">
            §6. Prawa osoby, której dane dotyczą
          </h2>
          <p>Każdej osobie, której dane dotyczą, przysługuje prawo do:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>dostępu do swoich danych oraz otrzymania ich kopii;</li>
            <li>sprostowania (poprawienia) danych;</li>
            <li>usunięcia danych (&bdquo;prawo do bycia zapomnianym&rdquo;), w zakresie w jakim nie koliduje to z obowiązkiem prawnym Administratora;</li>
            <li>ograniczenia przetwarzania danych;</li>
            <li>przenoszenia danych;</li>
            <li>wniesienia sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie Administratora;</li>
            <li>cofnięcia zgody w dowolnym momencie, bez wpływu na zgodność z prawem przetwarzania dokonanego przed jej cofnięciem;</li>
            <li>wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (UODO), ul. Stawki 2, 00-193 Warszawa.</li>
          </ul>
          <p>
            W celu realizacji powyższych praw prosimy o kontakt na adres e-mail: sobotabags@gmail.com.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-medium text-foreground">§7. Pliki cookies</h2>
          <p>
            Sklep wykorzystuje pliki cookies niezbędne do jego prawidłowego funkcjonowania, w tym
            utrzymania sesji logowania oraz zawartości koszyka zakupowego. Korzystanie z tych plików nie
            wymaga zgody Klienta, gdyż są one niezbędne do świadczenia usługi. Klient może samodzielnie
            zarządzać ustawieniami plików cookies w swojej przeglądarce internetowej, w tym je zablokować —
            może to jednak wpłynąć na poprawność działania Sklepu (np. uniemożliwić zalogowanie lub
            korzystanie z koszyka).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-medium text-foreground">§8. Bezpieczeństwo danych</h2>
          <p>
            Administrator stosuje odpowiednie środki techniczne i organizacyjne zapewniające bezpieczeństwo
            przetwarzanych danych osobowych, w tym szyfrowanie transmisji danych (protokół HTTPS) oraz
            ograniczenie dostępu do danych wyłącznie do osób i podmiotów upoważnionych.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-medium text-foreground">
            §9. Zmiany Polityki prywatności
          </h2>
          <p>
            Niniejsza Polityka prywatności może ulec zmianie, w szczególności w związku ze zmianą przepisów
            prawa lub sposobu funkcjonowania Sklepu. O istotnych zmianach Administrator poinformuje poprzez
            publikację zaktualizowanej treści wraz z datą jej wejścia w życie.
          </p>
        </section>
      </div>
    </div>
  );
}
