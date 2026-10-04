"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = React.useState(0);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-muted">
        <Image
          src={images[active]}
          alt={name}
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover sepia-[.18] saturate-[.85] contrast-[1.03]"
        />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={image}
            onClick={() => setActive(index)}
            className={cn(
              "relative aspect-square overflow-hidden rounded-sm bg-muted ring-1 ring-transparent transition",
              active === index ? "ring-foreground" : "hover:ring-border"
            )}
            aria-label={`Zdjęcie ${index + 1} produktu ${name}`}
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="120px"
              className="object-cover sepia-[.18] saturate-[.85] contrast-[1.03]"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
