"use client";

import { useEffect, useRef } from "react";

type Actor = "cyclist" | "backpacker" | "photographer";

const ACTORS: Record<Actor, { layer: string; sprite: string; moving: string }> = {
  cyclist: { layer: ".bike-ride-layer", sprite: ".bike-rider__sprite", moving: "ride" },
  backpacker: { layer: ".backpack-walk-layer", sprite: ".mini-hiker__sprite", moving: "walk" },
  photographer: { layer: ".photo-drop-layer", sprite: ".mini-photographer__sprite", moving: "" },
};

// The first actor in each pair opens; the second replies.
const EXCHANGES: { pair: [Actor, Actor]; lines: [string, string][] }[] = [
  {
    pair: ["cyclist", "backpacker"],
    lines: [
      ["Get outta the way!!", "Calm down Neel"],
      ["On your left!!", "-_-"],
      ["Beep beep!!", "You don't even have a bell"],
      ["Strava segment, move!!", "It's a hiking trail…"],
      ["Coming in hot!!", "Nobody asked for a KOM"],
      ["Draft behind me!", "I'm literally walking"],
      ["Zone 2, baby!", "That's clearly zone 5"],
      ["Lycra coming through!", "Put some pants on Neel"],
      ["Can't stop, won't stop!", "Your coffee stop says otherwise"],
      ["Race you to the tree!", "I have a 40L pack on"],
      ["Watch the wheel!!", "Watch the attitude"],
      ["Out of the bike lane!", "This is a meadow"],
    ],
  },
  {
    pair: ["cyclist", "photographer"],
    lines: [
      ["Get outta the way!!", "-_-"],
      ["Coming through!!", "You ruined my shot"],
      ["Take my photo!!", "Too blurry, come back"],
      ["Get my good side!", "Which one?"],
      ["Motion blur incoming!", "I'll call it art"],
      ["Did you get that?!", "Only your back wheel"],
      ["Make me look fast!", "The camera can't lie Neel"],
      ["Outta the frame!!", "You were never in it"],
      ["Tag me in that!", "It's on film, be patient"],
      ["Photo finish!!", "Nobody's racing you"],
    ],
  },
  {
    pair: ["backpacker", "photographer"],
    lines: [
      ["Hey Neel!", "Hmm, hello me"],
      ["Nice light today", "Golden hour's in 40"],
      ["Want a photo together?", "I only shoot landscapes"],
      ["Hey stranger!", "We share a face"],
      ["Did you pack the snacks?", "You're the backpacker"],
      ["You look familiar", "Hmm, hello me"],
      ["Seen any good views?", "Just you, weirdly"],
      ["Is this trail marked?", "It's a meadow Neel"],
      ["Heading to Yosemite", "Bring me back a sunset"],
      ["One for the gram?", "Only on film"],
      ["Nice camera!", "Nice… backpack"],
      ["Which way's camp?", "Follow the fog"],
    ],
  },
];

const OPENER_MS = 1700;
const REPLY_DELAY_MS = 650;
const REPLY_MS = 1800;
const EXCHANGE_COOLDOWN_MS = 5000;
const LEAD_SECONDS = 2.2;
const MIN_CLOSING_SPEED = 20;
const REARM_DISTANCE = 120;
const CHAT_CHANCE = 0.65;
// Keep in sync with .meadow-chatter__line[data-leaving] in globals.css.
const EXIT_MS = 240;

type Bubble = { node: HTMLSpanElement; actor: Actor; partner: Actor; until: number };

export function MeadowChatter() {
  const layerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const scene = layer?.closest<HTMLElement>(".hero-meadow");
    if (!layer || !scene) return;
    const touch = window.matchMedia("(hover: none), (pointer: coarse)");
    const lastGap = new Map<string, { gap: number; at: number }>();
    let lastExchange = -Infinity;
    const lastLine = new Map<string, number>();
    const spoken = new Set<string>();
    const timers = new Set<number>();
    let bubbles: Bubble[] = [];
    let frame = 0;

    const locate = (actor: Actor) => {
      const { layer: layerSelector, sprite, moving } = ACTORS[actor];
      const actorLayer = scene.querySelector<HTMLElement>(layerSelector);
      const phase = actorLayer?.dataset.phase ?? "idle";
      if (!actorLayer || phase === "idle" || phase === "spawn" || phase === "drop") return null;
      const rect = actorLayer.querySelector(sprite)?.getBoundingClientRect();
      if (!rect?.width) return null;
      return { x: rect.left + rect.width / 2, half: rect.width / 2, top: rect.top, moving: moving !== "" && phase === moving };
    };

    const say = (actor: Actor, partner: Actor, text: string, duration: number) => {
      bubbles.find((bubble) => bubble.actor === actor)?.node.remove();
      bubbles = bubbles.filter((bubble) => bubble.actor !== actor);
      const node = document.createElement("span");
      node.className = "meadow-chatter__line";
      node.dataset.actor = actor;
      const characters = Array.from(`“${text}”`);
      node.style.setProperty("--letter-count", String(characters.length));
      characters.forEach((character, index) => {
        const letter = document.createElement("span");
        letter.className = "meadow-chatter__letter";
        letter.style.setProperty("--letter-index", String(index));
        letter.textContent = character;
        node.append(letter);
      });
      layer.append(node);
      bubbles.push({ node, actor, partner, until: performance.now() + duration });
      cancelAnimationFrame(frame);
      place(performance.now());
    };

    const place = (now: number) => {
      const bounds = scene.getBoundingClientRect();
      const scale = bounds.width / scene.offsetWidth || 1;
      bubbles = bubbles.filter((bubble) => {
        const self = locate(bubble.actor);
        if (!self) {
          bubble.node.remove();
          return false;
        }
        if (now > bubble.until + EXIT_MS + 40) {
          bubble.node.remove();
          return false;
        }
        if (now > bubble.until) bubble.node.dataset.leaving = "true";
        // Lean each line away from its partner so the pair never overlaps.
        const partner = locate(bubble.partner);
        let side = partner && partner.x > self.x ? "left" : "right";
        const x = (self.x - bounds.left) / scale;
        // Flip toward the partner rather than run off the edge of the screen.
        const width = bubble.node.offsetWidth;
        if (side === "right" && x - 12 + width > scene.offsetWidth - 8) side = "left";
        else if (side === "left" && x + 12 - width < 8) side = "right";
        bubble.node.dataset.side = side;
        bubble.node.style.transform = `translate3d(${x.toFixed(1)}px, ${((self.top - bounds.top) / scale - 6).toFixed(1)}px, 0)`;
        return true;
      });
      frame = bubbles.length ? requestAnimationFrame(place) : 0;
    };

    const watch = window.setInterval(() => {
      if (touch.matches || scene.dataset.sceneVisible === "false" || document.hidden) return;
      const now = performance.now();
      for (const { pair: [first, second], lines } of EXCHANGES) {
        const key = `${first}:${second}`;
        const a = locate(first);
        const b = locate(second);
        if (!a || !b || (!a.moving && !b.moving)) {
          lastGap.delete(key);
          spoken.delete(key);
          continue;
        }
        // Measure between sprite edges: they "meet" when the figures touch, not when centers align.
        const gap = Math.abs(a.x - b.x) - a.half - b.half;
        const previous = lastGap.get(key);
        lastGap.set(key, { gap, at: now });
        if (!previous) continue;
        const closingSpeed = (previous.gap - gap) / Math.max(0.001, (now - previous.at) / 1000);
        if (closingSpeed < 0 && gap > REARM_DISTANCE) spoken.delete(key);
        if (spoken.has(key)) continue;
        // Open early enough that the reply has finished typing before they touch.
        if (closingSpeed < MIN_CLOSING_SPEED || gap <= 0 || gap > closingSpeed * LEAD_SECONDS) continue;
        spoken.add(key);
        // One exchange at a time across the whole meadow.
        if (now - lastExchange < EXCHANGE_COOLDOWN_MS) continue;
        if (Math.random() > CHAT_CHANCE) continue;
        lastExchange = now;
        let index = Math.floor(Math.random() * lines.length);
        if (index === lastLine.get(key)) index = (index + 1) % lines.length;
        lastLine.set(key, index);
        const [opener, reply] = lines[index];
        say(first, second, opener, OPENER_MS);
        const timer = window.setTimeout(() => { timers.delete(timer); say(second, first, reply, REPLY_MS); }, REPLY_DELAY_MS);
        timers.add(timer);
      }
    }, 60);

    return () => {
      window.clearInterval(watch);
      cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
      bubbles.forEach((bubble) => bubble.node.remove());
    };
  }, []);

  return <span ref={layerRef} className="meadow-chatter" aria-hidden="true" />;
}
