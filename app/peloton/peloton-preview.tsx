"use client";

import { useVisitorBike, type VisitorBike } from "../visitor-bike";
import { DEFAULT_VISITOR_BIKE } from "../visitor-bike";
import { useSyncExternalStore } from "react";

const subscribeToMount = () => () => undefined;

const sampleBikes: VisitorBike[] = [
  { bikeName: "Sunday paper", riderName: "Maya", frame: "Vintage", wheels: "Alloy", tires: "Road tires", color: "butter", decal: "dots" },
  { bikeName: "Little thunder", riderName: "Jon", frame: "Time trial", wheels: "Carbon 60mm", tires: "High performance", color: "cobalt", decal: "star" },
  { bikeName: "The neighborhood", riderName: "Priya", frame: "Commuter", wheels: "Carbon 30mm", tires: "Commuter tires", color: "moss", decal: "check" },
];

function BikeCard({ bike, current = false }: { bike: VisitorBike; current?: boolean }) {
  return (
    <article className="peloton-card" data-current={current ? "true" : "false"}>
      <div className="peloton-card__bike">
        <span className="peloton-card__wheel peloton-card__wheel--one" /><span className="peloton-card__wheel peloton-card__wheel--two" />
        <span className="peloton-card__frame" style={{ backgroundColor: `var(--bike-${bike.color})` }} />
      </div>
      <div className="peloton-card__words"><h2>{bike.bikeName}</h2><p>Signed by {bike.riderName}</p><small>{bike.frame} · {bike.tires}</small></div>
    </article>
  );
}

export function PelotonPreview() {
  const [bike] = useVisitorBike();
  const isMounted = useSyncExternalStore(subscribeToMount, () => true, () => false);
  return (
    <main className="peloton-page">
      <section className="peloton-intro"><p className="page-kicker">Visitor bike · prototype</p><h1>The Peloton</h1><p>Every bike belongs to someone who stopped by. This preview is local for now; the public version will arrive with the real bike assets.</p></section>
      <section className="peloton-grid" aria-label="Visitor bikes">
        <BikeCard bike={isMounted ? bike : DEFAULT_VISITOR_BIKE} current />
        {sampleBikes.map((sample) => <BikeCard bike={sample} key={sample.bikeName} />)}
      </section>
    </main>
  );
}
