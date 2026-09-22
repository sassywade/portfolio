import type { Metadata } from "next";
import { SiteHeader } from "../site-header";
import { PhotographyGallery } from "./photography-gallery";
import styles from "./photography.module.css";

export const metadata: Metadata = { title: "Photography — Neel Saswade" };

export default function PhotographyPage() {
  return (
    <main className={`site-shell photography-page ${styles.page}`}>
      <SiteHeader current="photo" />
      <section className={styles.content} aria-label="Photo gallery">
        <PhotographyGallery />
      </section>
    </main>
  );
}
