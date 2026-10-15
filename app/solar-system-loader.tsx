"use client";

import { useEffect } from "react";
import type * as Three from "three";

declare global {
  interface Window {
    THREE?: typeof Three;
  }
}

/** Loads the legacy web component after React has mounted. */
export default function SolarSystemLoader() {
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const three = await import("three");
      if (cancelled) return;

      window.THREE = three;
      if (customElements.get("solar-system") || document.getElementById("solar-system-component")) return;

      const script = document.createElement("script");
      script.id = "solar-system-component";
      script.src = "/solar-system.js";
      script.async = true;
      document.head.appendChild(script);
    };

    void load();
    return () => { cancelled = true; };
  }, []);

  return null;
}
