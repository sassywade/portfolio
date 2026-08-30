"use client";

import { useEffect, useState } from "react";

export function useMeadowLayerHost() {
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const frameHandle = window.requestAnimationFrame(() => {
      setHost(document.querySelector<HTMLElement>(".hero-meadow"));
    });

    return () => window.cancelAnimationFrame(frameHandle);
  }, []);

  return host;
}
