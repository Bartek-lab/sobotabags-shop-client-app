import type { AvailabilityStatus, Product, ProductCategory, SortOption } from "@/types";

/**
 * Mock product catalogue standing in for a future Supabase `products` table.
 * Every exported function here is already `async`, mirroring the shape of a
 * Supabase query (`supabase.from("products").select(...)`). When the real
 * database is wired up, only the bodies below need to change — every call
 * site already does `await getX()`.
 */

/**
 * We don't have real product photography yet, so each product's gallery is a
 * set of on-brand placeholder tiles: real leather-grain crops from the studio
 * photos, tinted to the product's primary color and marked with a bag glyph.
 * `product-gallery.tsx` / `product-card.tsx` label these as a visualization
 * — swap this for actual photo URLs once they exist.
 */
const COLOR_SWATCH_SLUG: Record<string, string> = {
  Koniak: "koniak",
  Czarny: "czarny",
  "Ciemny brąz": "ciemny-braz",
  Beżowy: "bezowy",
  Bordowy: "bordowy",
};

function gallery(colors: string[], count: number): string[] {
  const slug = COLOR_SWATCH_SLUG[colors[0]] ?? "koniak";
  const main = `/assets/products/${slug}-main.jpg`;
  const detail = `/assets/products/${slug}-detail.jpg`;
  return Array.from({ length: count }, (_, i) => (i % 2 === 0 ? main : detail));
}

export const CATEGORY_LABEL: Record<ProductCategory, string> = {
  women: "Damskie",
  men: "Męskie",
};

/** `product.category` is nullable (unisex/uncategorized); this fills in the display fallback. */
export function getCategoryLabel(category: ProductCategory | null): string {
  return category ? CATEGORY_LABEL[category] : "Uniseks";
}

export const AVAILABILITY_LABEL: Record<AvailabilityStatus, string> = {
  in_stock: "Dostępny od ręki",
  made_to_order: "Na zamówienie",
  unavailable: "Niedostępny",
};

export const AVAILABILITY_VARIANT: Record<AvailabilityStatus, "default" | "secondary" | "outline" | "destructive"> = {
  in_stock: "secondary",
  made_to_order: "outline",
  unavailable: "destructive",
};

const PRODUCT_BASE: Omit<Product, "images">[] = [
  {
    id: "torebka-wiktoria",
    slug: "torebka-wiktoria",
    name: "Torebka Wiktoria",
    category: "women",
    price: 899,
    material: "skóra naturalna licowa, garbowana roślinnie",
    colors: ["Koniak", "Czarny", "Ciemny brąz"],
    shortDescription: "Klasyczna torba na ramię z miękkiej skóry licowej.",
    description:
      "Wiktoria to kwintesencja klasyki — torba na ramię uszyta z jednego kawałka miękkiej, naturalnej skóry licowej garbowanej roślinnie. Przestronne wnętrze z kieszenią na zamek i organizerem na drobiazgi sprawia, że towarzyszy równie dobrze w biurze, co podczas wieczornego wyjścia. Każdy egzemplarz jest szyty ręcznie w naszej pracowni w Polsce, dzięki czemu lekko różni się usłojeniem skóry — to znak, że trzymasz w rękach prawdziwe rzemiosło, nie masową produkcję.",
    featured: true,
    stock: 6,
    availability: "in_stock",
    createdAt: "2025-03-12T10:00:00.000Z",
  },
  {
    id: "torebka-antonina",
    slug: "torebka-antonina",
    name: "Torebka Antonina",
    category: "women",
    price: 749,
    material: "skóra naturalna nubukowana",
    colors: ["Beżowy", "Czarny"],
    shortDescription: "Kompaktowy shopper na każdy dzień.",
    description:
      "Antonina to mniejszy shopper o czystych liniach, stworzony dla kobiet, które cenią minimalizm bez kompromisów w jakości. Delikatnie nubukowana skóra przyjemnie się starzeje, nabierając z czasem głębszej, bardziej szlachetnej barwy. Dwa uchwyty oraz odpinany pasek na ramię pozwalają nosić ją w zależności od nastroju — w ręku, na zgięciu ramienia lub crossbody.",
    featured: true,
    stock: 9,
    availability: "in_stock",
    createdAt: "2025-04-02T10:00:00.000Z",
  },
  {
    id: "kuferek-helena",
    slug: "kuferek-helena",
    name: "Kuferek Helena",
    category: "women",
    price: 1199,
    material: "skóra naturalna licowa, wykończenie woskiem",
    colors: ["Czarny", "Bordowy"],
    shortDescription: "Wieczorowy kuferek o rzemieślniczym wykończeniu.",
    description:
      "Helena to mała forma o wielkim charakterze — sztywny kuferek z woskowanej skóry, ze szczotkowanym mosiężnym okuciem i jedwabną podszewką. Twarda konstrukcja chroni zawartość, a smukły pasek na długim łańcuszku pozwala nosić go swobodnie przewieszony przez ramię. Projekt powstał z myślą o wieczorowych wyjściach, w których liczy się detal.",
    featured: true,
    stock: 0,
    availability: "made_to_order",
    leadTimeDays: 7,
    createdAt: "2025-02-18T10:00:00.000Z",
  },
  {
    id: "shopper-zofia",
    slug: "shopper-zofia",
    name: "Shopper Zofia",
    category: "women",
    price: 1099,
    material: "skóra naturalna licowa",
    colors: ["Koniak", "Beżowy", "Czarny"],
    shortDescription: "Pojemna torba typu tote na codzienne wyzwania.",
    description:
      "Zofia powstała dla kobiet w nieustannym ruchu. Pojemne wnętrze swobodnie pomieści laptopa 14\", notes i niezbędniki na cały dzień, a wzmocnione, ręcznie szyte uchwyty gwarantują wieloletnią trwałość. Wewnętrzna kieszeń na zamek i dodatkowa kosmetyczka w komplecie dopełniają funkcjonalność tej torby.",
    featured: false,
    stock: 4,
    availability: "in_stock",
    createdAt: "2025-01-22T10:00:00.000Z",
  },
  {
    id: "listonoszka-marta",
    slug: "listonoszka-marta",
    name: "Listonoszka Marta",
    category: "women",
    price: 599,
    material: "skóra naturalna licowa",
    colors: ["Czarny", "Ciemny brąz", "Koniak"],
    shortDescription: "Lekka torba crossbody na drobiazgi.",
    description:
      "Marta to najlżejsza propozycja w naszej kolekcji — kompaktowa listonoszka idealna na telefon, portfel i kosmetyczkę. Regulowany, długi pasek pozwala nosić ją crossbody, odciążając ramiona podczas długich dni w mieście. Mimo niewielkich rozmiarów, wnętrze zostało starannie zaprojektowane z trzema oddzielnymi przegródkami.",
    featured: false,
    stock: 5,
    availability: "in_stock",
    createdAt: "2025-05-08T10:00:00.000Z",
  },
  {
    id: "teczka-konrad",
    slug: "teczka-konrad",
    name: "Teczka Konrad",
    category: "men",
    price: 1499,
    material: "skóra naturalna licowa, garbowana roślinnie",
    colors: ["Ciemny brąz", "Czarny"],
    shortDescription: "Biznesowa teczka na laptopa i dokumenty.",
    description:
      "Konrad to flagowa teczka naszej męskiej kolekcji — uszyta z pełnoziarnistej skóry licowej, z usztywnioną konstrukcją, która zachowuje formę przez lata. Wewnątrz znajdziesz oddzielną przegrodę na laptopa do 15\", organizer na dokumenty oraz kieszenie na akcesoria. Mosiężne zamki i ręcznie szyte krawędzie podkreślają rzemieślniczy charakter teczki, który doceni każdy, kto traktuje detale poważnie.",
    featured: true,
    stock: 5,
    availability: "in_stock",
    createdAt: "2025-03-30T10:00:00.000Z",
  },
  {
    id: "torba-na-laptopa-adrian",
    slug: "torba-na-laptopa-adrian",
    name: "Torba na laptopa Adrian",
    category: "men",
    price: 1099,
    material: "skóra naturalna licowa",
    colors: ["Koniak", "Czarny"],
    shortDescription: "Codzienna torba na laptopa o wojskowej trwałości.",
    description:
      "Adrian łączy formę klasycznej torby roboczej ze współczesną funkcjonalnością. Usztywniona przegroda chroni laptopa do 15\", a dodatkowe kieszenie pozwalają sprawnie rozdzielić kable, dokumenty i akcesoria podróżne. Regulowany pasek na ramię oraz solidne, ręcznie nitowane uchwyty czynią ją towarzyszem na lata codziennych dojazdów do pracy.",
    featured: true,
    stock: 5,
    availability: "in_stock",
    createdAt: "2025-02-10T10:00:00.000Z",
  },
  {
    id: "listonoszka-filip",
    slug: "listonoszka-filip",
    name: "Listonoszka Filip",
    category: "men",
    price: 899,
    material: "skóra naturalna nubukowana",
    colors: ["Ciemny brąz", "Czarny"],
    shortDescription: "Torba messenger na tablet i niezbędniki.",
    description:
      "Filip to torba messenger zaprojektowana dla mężczyzn poszukujących równowagi między elegancją i swobodą. Klapa zamykana na pasek ze sprzączką chroni zawartość, a wewnętrzny podział pozwala wygodnie rozmieścić tablet, notatnik i drobiazgi. Skóra nubukowana z czasem nabiera głębszej, bardziej osobistej patyny.",
    featured: false,
    stock: 5,
    availability: "in_stock",
    createdAt: "2025-04-19T10:00:00.000Z",
  },
  {
    id: "saszetka-bartosz",
    slug: "saszetka-bartosz",
    name: "Saszetka Bartosz",
    category: "men",
    price: 299,
    material: "skóra naturalna licowa",
    colors: ["Czarny", "Ciemny brąz", "Koniak"],
    shortDescription: "Mała saszetka na pas lub crossbody.",
    description:
      "Bartosz to niewielka saszetka, w której zmieścisz telefon, karty i klucze, nie zabierając ze sobą całej torby. Regulowany pasek pozwala nosić ją na pasie lub crossbody, a miękka skóra licowa starzeje się z gracją, nabierając charakteru przy każdym użyciu.",
    featured: false,
    stock: 5,
    availability: "in_stock",
    createdAt: "2025-05-15T10:00:00.000Z",
  },
  {
    id: "plecak-marcel",
    slug: "plecak-marcel",
    name: "Plecak Marcel",
    category: "men",
    price: 1299,
    material: "skóra naturalna licowa, garbowana roślinnie",
    colors: ["Ciemny brąz", "Czarny"],
    shortDescription: "Skórzany plecak na laptopa i podróże.",
    description:
      "Marcel to skórzany plecak stworzony dla mężczyzn, którzy nie chcą wybierać między elegancją a wygodą. Usztywniony grzbiet i wyściełana przegroda chronią laptopa do 15\", a system ściągaczy pozwala kontrolować objętość plecaka w zależności od dnia. Skóra licowa garbowana roślinnie z czasem nabiera głębszego, bardziej szlachetnego odcienia.",
    featured: false,
    stock: 5,
    availability: "in_stock",
    createdAt: "2025-01-05T10:00:00.000Z",
  },
];

export const PRODUCTS: Product[] = PRODUCT_BASE.map((product) => ({
  ...product,
  images: gallery(product.colors, 4),
}));

export const PRICE_BOUNDS = {
  min: Math.min(...PRODUCTS.map((p) => p.price)),
  max: Math.max(...PRODUCTS.map((p) => p.price)),
};

export async function getAllProducts(): Promise<Product[]> {
  return PRODUCTS;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return PRODUCTS.find((product) => product.id === id);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return PRODUCTS.filter((product) => product.featured).slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  return PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit);
}

export interface ProductFilters {
  category?: ProductCategory | "all";
  minPrice?: number;
  maxPrice?: number;
}

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "newest":
      return sorted.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    default:
      return sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  return products.filter((product) => {
    if (filters.category && filters.category !== "all" && product.category !== filters.category) {
      return false;
    }
    if (filters.minPrice != null && product.price < filters.minPrice) return false;
    if (filters.maxPrice != null && product.price > filters.maxPrice) return false;
    return true;
  });
}

export async function getFilteredProducts(
  filters: ProductFilters = {},
  sort: SortOption = "featured"
): Promise<Product[]> {
  return sortProducts(filterProducts(PRODUCTS, filters), sort);
}
