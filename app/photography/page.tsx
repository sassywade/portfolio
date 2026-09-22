import type { Metadata } from "next";
import { SiteHeader } from "../site-header";
import { PhotographyGallery } from "./photography-gallery";
import styles from "./photography.module.css";

export const metadata: Metadata = { title: "Photography — Neel Saswade" };

export default function PhotographyPage() {
  return (
    <main className={`site-shell ${styles.page}`}>
      <SiteHeader current="photo" />
      <section className={styles.content} aria-labelledby="photography-title">
        <h1 id="photography-title">Photography</h1>
        <PhotographyGallery />
      </section>
    </main>
  );
}
