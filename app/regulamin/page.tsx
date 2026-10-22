import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "Regulamin sklepu | KS",
  description: "Regulamin sklepu internetowego KS — zasady składania zamówień, płatności, dostawy oraz prawo odstąpienia od umowy.",
};

const EFFECTIVE_DATE = "7 października 2026 r.";

export default function RegulaminPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Dokumenty" title="Regulamin sklepu internetowego KS" className="mb-10" />

      <div className="space-y-10 text-base leading-relaxed text-muted-foreground">
        <p>Obowiązuje od {EFFECTIVE_DATE}.</p>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-medium text-foreground">§1. Postanowienia ogólne</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              Sklep internetowy KS (dalej: &bdquo;Sklep&rdquo;) działa pod adresem internetowym, pod którym
              dostępna jest niniejsza strona, i umożliwia dokonywanie zakupów ręcznie wykonanych toreb
              skórzanych oraz powiązanych produktów.
            </li>
            <li>
              Sprzedawcą i podmiotem prowadzącym Sklep jest Karolina Sobota, zamieszkała przy ul. Okrężnej 24,
              63-200 Jarocin, adres e-mail do kontaktu: sobotabags@gmail.com (dalej: &bdquo;Sprzedawca&rdquo;).
            </li>
            <li>
              Sprzedaż prowadzona jest w ramach działalności nierejestrowanej w rozumieniu art. 5 ustawy z dnia
              6 marca 2018 r. – Prawo przedsiębiorców. Sprzedawca korzysta ze zwolnienia podmiotowego z podatku
              od towarów i usług (VAT).
            </li>
            <li>
              Niniejszy Regulamin określa zasady korzystania ze Sklepu, zawierania umów sprzedaży na odległość,
              płatności, dostawy towarów, prawa odstąpienia od umowy oraz tryb postępowania reklamacyjnego.
            </li>
            <li>
              Regulamin jest udostępniony nieodpłatnie za pośrednictwem Sklepu w formie umożliwiającej jego
              pozyskanie, odtwarzanie i utrwalenie (w tym wydrukowanie) w każdym czasie.
            </li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-medium text-foreground">§2. Definicje</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li><strong className="text-foreground">Konsument</strong> — osoba fizyczna dokonująca ze Sprzedawcą czynności prawnej niezwiązanej bezpośrednio z jej działalnością gospodarczą lub zawodową.</li>
            <li><strong className="text-foreground">Klient</strong> — każda osoba korzystająca ze Sklepu, w tym Konsument.</li>
            <li><strong className="text-foreground">Towar</strong> — produkt prezentowany w Sklepie i dostępny do zakupu w ramach bieżącej oferty (produkt katalogowy).</li>
            <li><strong className="text-foreground">Zamówienie indywidualne</strong> — towar wykonywany na specjalne zamówienie Klienta, według jego indywidualnych wytycznych (np. wymiarów, koloru skóry, grawerunku), ustalanych odrębnie drogą kontaktu wskazaną w Sklepie, a nie poprzez standardowy koszyk zakupowy.</li>
            <li><strong className="text-foreground">Umowa sprzedaży</strong> — umowa sprzedaży Towaru zawierana na odległość między Klientem a Sprzedawcą za pośrednictwem Sklepu.</li>
            <li><strong className="text-foreground">Dzień roboczy</strong> — dzień od poniedziałku do piątku, z wyłączeniem dni ustawowo wolnych od pracy.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-medium text-foreground">§3. Warunki korzystania ze Sklepu</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              Do korzystania ze Sklepu niezbędne jest urządzenie z dostępem do Internetu oraz przeglądarka
              internetowa obsługująca JavaScript i pliki cookies.
            </li>
            <li>
              Zakupów w Sklepie można dokonywać zarówno po założeniu konta Klienta, jak i bez rejestracji
              (&bdquo;zakup jako gość&rdquo;).
            </li>
            <li>
              Klient zobowiązany jest do podawania danych zgodnych z prawdą oraz do korzystania ze Sklepu w
              sposób zgodny z prawem i dobrymi obyczajami.
            </li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-medium text-foreground">§4. Składanie i realizacja zamówień</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              Zamówienia składane są poprzez dodanie wybranego Towaru do koszyka, a następnie wypełnienie
              formularza zamówienia (dane kontaktowe, adres dostawy lub wskazanie paczkomatu, wybór sposobu
              dostawy i płatności) oraz jego potwierdzenie przyciskiem kończącym proces składania zamówienia.
            </li>
            <li>
              Umowa sprzedaży zostaje zawarta z chwilą potwierdzenia przez Sprzedawcę przyjęcia zamówienia do
              realizacji, co następuje automatycznie po zaksięgowaniu płatności.
            </li>
            <li>
              Sprzedawca przesyła Klientowi potwierdzenie zawarcia Umowy sprzedaży na trwałym nośniku (wiadomość
              e-mail) najpóźniej w momencie dostarczenia Towaru.
            </li>
            <li>
              Informacje o Towarach prezentowane w Sklepie nie stanowią oferty w rozumieniu Kodeksu cywilnego,
              lecz zaproszenie do zawarcia umowy.
            </li>
            <li>
              Zamówienia indywidualne ustalane są odrębnie — zakres, cena i termin realizacji są każdorazowo
              potwierdzane z Klientem przed przyjęciem zamówienia do realizacji.
            </li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-medium text-foreground">§5. Ceny i płatności</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>Ceny Towarów podawane są w złotych polskich (PLN) i są cenami końcowymi.</li>
            <li>
              Płatności obsługiwane są za pośrednictwem operatora płatności Stripe i obejmują płatność kartą
              płatniczą, BLIK, Apple Pay oraz Google Pay. Sprzedawca nie ma dostępu do pełnych danych karty
              płatniczej Klienta — są one przetwarzane bezpośrednio przez Stripe.
            </li>
            <li>
              Realizacja zamówienia rozpoczyna się po otrzymaniu przez Sprzedawcę potwierdzenia poprawnie
              dokonanej płatności, z wyjątkiem zamówień opłaconych w całości kodem karty podarunkowej.
            </li>
            <li>
              Do ceny Towaru może zostać doliczony koszt dostawy, którego wysokość Klient widzi przed
              ostatecznym złożeniem zamówienia.
            </li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-medium text-foreground">§6. Dostawa</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              Dostawa Towarów odbywa się na terytorium wskazane w Sklepie, za pośrednictwem kuriera lub do
              wskazanego przez Klienta paczkomatu (InPost) — zgodnie z wyborem dokonanym podczas składania
              zamówienia.
            </li>
            <li>Koszt i orientacyjny czas dostawy wskazywane są Klientowi przed złożeniem zamówienia.</li>
            <li>
              Czas realizacji zamówienia (przygotowania Towaru do wysyłki) wskazany jest w opisie Towaru lub
              przekazywany Klientowi indywidualnie w przypadku Zamówień indywidualnych.
            </li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 id="prawo-odstapienia" className="font-display text-xl font-medium text-foreground scroll-mt-24">
            §7. Prawo odstąpienia od umowy
          </h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              Konsument, który zawarł ze Sprzedawcą umowę na odległość, może w terminie 14 dni odstąpić od niej
              bez podawania przyczyny i bez ponoszenia kosztów, z zastrzeżeniem ust. 6 poniżej.
            </li>
            <li>
              Bieg terminu do odstąpienia od umowy rozpoczyna się od dnia, w którym Konsument objął Towar w
              posiadanie (lub w którym uczyniła to wskazana przez niego osoba trzecia inna niż przewoźnik).
            </li>
            <li>
              Aby odstąpić od umowy, Konsument składa Sprzedawcy jednoznaczne oświadczenie o odstąpieniu —
              drogą elektroniczną na adres sobotabags@gmail.com lub pisemnie na adres wskazany w §1 ust. 2. Do
              zachowania terminu wystarczy wysłanie oświadczenia przed jego upływem. Konsument może (lecz nie
              musi) skorzystać ze wzoru formularza zamieszczonego w §8 poniżej.
            </li>
            <li>
              Sprzedawca niezwłocznie, nie później niż w terminie 14 dni od dnia otrzymania oświadczenia o
              odstąpieniu, zwraca Konsumentowi wszystkie otrzymane płatności, w tym koszt najtańszego zwykłego
              sposobu dostawy oferowanego przez Sprzedawcę. Zwrot następuje przy użyciu tego samego sposobu
              płatności, którego użył Konsument, chyba że wyraźnie zgodził się on na inny sposób zwrotu.
            </li>
            <li>
              Sprzedawca może wstrzymać się ze zwrotem płatności do chwili otrzymania Towaru z powrotem lub do
              chwili dostarczenia dowodu jego odesłania, w zależności od tego, które zdarzenie nastąpi
              wcześniej. Konsument zobowiązany jest odesłać Towar niezwłocznie, nie później niż w terminie 14
              dni od dnia złożenia oświadczenia o odstąpieniu. Konsument ponosi bezpośrednie koszty zwrotu
              Towaru.
            </li>
            <li>
              Prawo odstąpienia od umowy nie przysługuje w odniesieniu do Zamówień indywidualnych — tj. Towarów
              nieprefabrykowanych, wyprodukowanych według specyfikacji Konsumenta lub służących zaspokojeniu
              jego zindywidualizowanych potrzeb (art. 38 pkt 3 ustawy o prawach konsumenta). Wyłączenie to nie
              dotyczy standardowych Towarów katalogowych zakupionych przez koszyk Sklepu, nawet jeśli zostały
              wykonane ręcznie.
            </li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-medium text-foreground">
            §8. Wzór formularza odstąpienia od umowy
          </h2>
          <p>
            (formularz ten należy wypełnić i odesłać tylko w przypadku chęci odstąpienia od umowy — jego użycie
            jest dobrowolne)
          </p>
          <div className="rounded-sm border border-border bg-secondary/40 p-5 text-sm">
            <p>Adresat: Karolina Sobota, ul. Okrężna 24, 63-200 Jarocin, sobotabags@gmail.com</p>
            <p className="mt-3">
              Ja/My (*) niniejszym informuję/informujemy (*) o moim/naszym odstąpieniu od umowy sprzedaży
              następującego/ych Towaru/ów (*):
            </p>
            <p className="mt-3">— Data zawarcia umowy / odbioru (*): ………………………………</p>
            <p>— Numer zamówienia: ………………………………</p>
            <p>— Imię i nazwisko Konsumenta: ………………………………</p>
            <p>— Adres Konsumenta: ………………………………</p>
            <p className="mt-3">— Podpis Konsumenta (tylko jeżeli formularz przesyłany jest w wersji papierowej): ………………………………</p>
            <p>— Data: ………………………………</p>
            <p className="mt-3 text-xs text-muted-foreground">(*) Niepotrzebne skreślić.</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-medium text-foreground">§9. Reklamacje</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              Sprzedawca odpowiada wobec Konsumenta z tytułu rękojmi za wady na zasadach określonych w art.
              556 i następnych Kodeksu cywilnego, przez okres 2 lat od dnia wydania Towaru.
            </li>
            <li>
              Reklamację należy zgłosić drogą elektroniczną na adres sobotabags@gmail.com, opisując wadę
              Towaru oraz żądanie Konsumenta (naprawa, wymiana, obniżenie ceny lub odstąpienie od umowy).
            </li>
            <li>Sprzedawca ustosunkuje się do reklamacji w terminie 14 dni od jej otrzymania.</li>
            <li>
              Jeżeli reklamacja jest uzasadniona, koszty związane z odesłaniem reklamowanego Towaru ponosi
              Sprzedawca.
            </li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-medium text-foreground">§10. Dane osobowe</h2>
          <p>
            Zasady przetwarzania danych osobowych Klientów opisane są w odrębnym dokumencie —{" "}
            <a href="/polityka-prywatnosci" className="text-foreground underline underline-offset-4">
              Polityce prywatności
            </a>
            , stanowiącej integralne uzupełnienie niniejszego Regulaminu.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-medium text-foreground">
            §11. Pozasądowe sposoby rozpatrywania reklamacji i dochodzenia roszczeń
          </h2>
          <p>
            Konsument uprawniony jest do zwrócenia się o pomoc do miejskiego lub powiatowego rzecznika
            konsumentów, Wojewódzkiego Inspektoratu Inspekcji Handlowej właściwego dla siedziby Sprzedawcy, lub
            organizacji pozarządowej zajmującej się ochroną konsumentów. Szczegółowe informacje o pozasądowych
            sposobach rozstrzygania sporów dostępne są na stronie Urzędu Ochrony Konkurencji i Konsumentów
            (uokik.gov.pl).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-medium text-foreground">§12. Postanowienia końcowe</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają przepisy prawa polskiego, w tym Kodeksu cywilnego oraz ustawy o prawach konsumenta.</li>
            <li>Sprzedawca zastrzega sobie prawo do zmiany Regulaminu z ważnych przyczyn (np. zmiana przepisów prawa, zmiana sposobów płatności lub dostawy). Zmiany nie dotyczą zamówień złożonych przed ich wejściem w życie.</li>
            <li>Regulamin wchodzi w życie z dniem {EFFECTIVE_DATE}</li>
          </ol>
        </section>
      </div>
    </div>
  );
}
