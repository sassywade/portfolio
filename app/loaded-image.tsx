"use client";

import Image from "next/image";
import type { ComponentProps } from "react";

/* Marks an image once its pixels are ready so CSS can fade it in instead of letting it pop.
   Cached images are marked before first paint, so repeat visits skip the fade entirely. */
export function LoadedImage(props: ComponentProps<typeof Image>) {
  return (
    <Image
      {...props}
      ref={(node) => {
        if (node?.complete && node.naturalWidth > 0) node.dataset.loaded = "true";
      }}
      onLoad={(event) => {
        event.currentTarget.dataset.loaded = "true";
        props.onLoad?.(event);
      }}
    />
  );
}
