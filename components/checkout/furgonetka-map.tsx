"use client";

import * as React from "react";
import { MapPin, TriangleAlert } from "lucide-react";

import type { PickupPoint } from "@/types";
import { Button } from "@/components/ui/button";

const API_KEY = process.env.NEXT_PUBLIC_FURGONETKA_API_KEY;
const SDK_SRC = "https://furgonetka.pl/js/dist/map/map.js";

// InPost only -- lockers we ship ourselves through InPost's own consumer
// app using the same point code this widget returns. Furgonetka is used
// purely as the point-picker here; we never call their label-creation API,
// so no OAuth/WebAPI connection is needed, ever -- just this domain-scoped
// widget key. Poczta Polska is a plain address-courier method instead, no
// pickup-point map involved.
const COURIER_SERVICES = ["inpost"];

// Furgonetka's map library attaches itself to window.Furgonetka -- not
// something TypeScript knows about, so this is a minimal shape covering only
// what we actually call. Confirmed live: point.name is a human-readable
// string with the locker code and full address already combined, e.g.
// "KAXI01BAPP - Przemysłowa 10, 87-840 Kaliska" -- that's why pointAddress
// is left null below, the address is already inside pointName.
type FurgonetkaPoint = {
  code: string;
  name: string;
  type: string;
  country_code: string;
};

declare global {
  interface Window {
    Furgonetka?: {
      Map: new (options: {
        apiKey: string;
        courierServices: string[];
        callback: (point: FurgonetkaPoint) => void;
        closeModalCallback?: () => void;
      }) => { show: () => void };
    };
  }
}

export function FurgonetkaMap({
  onSelect,
}: {
  onSelect: (point: Pick<PickupPoint, "pointName" | "pointAddress">) => void;
}) {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!API_KEY) return;
    if (window.Furgonetka) {
      setLoaded(true);
      return;
    }
    const existing = document.querySelector(`script[src="${SDK_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => setLoaded(true));
      return;
    }
    const script = document.createElement("script");
    script.src = SDK_SRC;
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
  }, []);

  function openMap() {
    if (!window.Furgonetka || !API_KEY) return;
    new window.Furgonetka.Map({
      apiKey: API_KEY,
      courierServices: COURIER_SERVICES,
      callback: (point) => {
        onSelect({ pointName: point.name ?? point.code, pointAddress: null });
      },
    }).show();
  }

  if (!API_KEY) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-sm border border-dashed border-border bg-muted/40 p-8 text-center">
        <TriangleAlert className="size-6 text-muted-foreground" strokeWidth={1.5} />
        <p className="text-sm font-medium">Wybór paczkomatu nie jest jeszcze skonfigurowany</p>
        <p className="text-xs text-muted-foreground">
          Brakuje NEXT_PUBLIC_FURGONETKA_API_KEY w .env.local.
        </p>
      </div>
    );
  }

  return (
    <Button type="button" variant="outline" className="gap-2" onClick={openMap} disabled={!loaded}>
      <MapPin className="size-4" />
      Wybierz paczkomat na mapie
    </Button>
  );
}
