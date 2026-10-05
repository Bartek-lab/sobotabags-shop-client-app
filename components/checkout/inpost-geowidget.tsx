"use client";

import * as React from "react";
import { MapPin, TriangleAlert } from "lucide-react";

import type { PickupPoint } from "@/types";

const GEOWIDGET_TOKEN = process.env.NEXT_PUBLIC_INPOST_GEOWIDGET_TOKEN;

// InPost's Geowidget is a custom element (<inpost-geowidget>) that only
// exists once their SDK script has loaded -- TypeScript doesn't know about
// it, so this narrows `unknown` to a DOM Element rather than using `any`.
type PointSelectEvent = CustomEvent<{
  name: string;
  address?: { line1?: string; line2?: string };
}>;

// NOT YET VERIFIED against InPost's current Geowidget docs -- this is built
// to the last known script URL / custom-element shape
// (geowidget.easypack24.net + <inpost-geowidget>), but InPost has changed
// this API across versions before. Confirm against
// https://geowidget.easypack24.net/ docs once a real token is available,
// before relying on this in production.
const SDK_SRC = "https://geowidget.easypack24.net/js/sdk-for-javascript.js";
const SDK_CSS = "https://geowidget.easypack24.net/css/easypack.css";

export function InPostGeowidget({
  onSelect,
}: {
  onSelect: (point: Pick<PickupPoint, "pointName" | "pointAddress">) => void;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!GEOWIDGET_TOKEN) return;

    if (!document.querySelector(`link[href="${SDK_CSS}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = SDK_CSS;
      document.head.appendChild(link);
    }

    const existing = document.querySelector(`script[src="${SDK_SRC}"]`);
    if (existing) {
      setLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = SDK_SRC;
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
  }, []);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || !loaded) return;
    const handler = (event: Event) => {
      const detail = (event as PointSelectEvent).detail;
      if (!detail) return;
      const addr = detail.address;
      onSelect({
        pointName: detail.name,
        pointAddress: addr ? [addr.line1, addr.line2].filter(Boolean).join(", ") : null,
      });
    };
    el.addEventListener("point-select", handler);
    return () => el.removeEventListener("point-select", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  if (!GEOWIDGET_TOKEN) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-sm border border-dashed border-border bg-muted/40 p-8 text-center">
        <TriangleAlert className="size-6 text-muted-foreground" strokeWidth={1.5} />
        <p className="text-sm font-medium">Widget paczkomatów InPost nie jest jeszcze skonfigurowany</p>
        <p className="text-xs text-muted-foreground">
          Brakuje NEXT_PUBLIC_INPOST_GEOWIDGET_TOKEN w .env.local.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="size-4" />
        Wybierz paczkomat na mapie
      </div>
      <div
        ref={containerRef}
        className="h-[420px] w-full overflow-hidden rounded-sm border border-border"
      >
        {loaded && (
          // @ts-expect-error -- custom element, see containerRef comment above
          <inpost-geowidget token={GEOWIDGET_TOKEN} language="pl" config="parcelcollect" />
        )}
      </div>
    </div>
  );
}
