/* eslint-disable @next/next/no-img-element */

type Activity = "photography" | "cycling" | "backpacking";

export function MeadowActivityIcon({ activity }: { activity: Activity }) {
  const base = `/collectibles/glass-square-v1/${activity}`;
  return (
    <>
      <img className="meadow-activity__rest" src={`${base}-96.webp`} width={48} height={48} alt="" draggable={false} />
      <img className="meadow-activity__selected" src={`${base}-selected-96.webp`} width={48} height={48} alt="" draggable={false} />
      <img className={`meadow-activity__hover meadow-activity__hover--${activity}`} src={`${base}-hover-v1.png`} width={48} height={48} alt="" draggable={false} />
    </>
  );
}
