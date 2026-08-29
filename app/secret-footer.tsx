"use client";

import { useState } from "react";

const messages = [
  "You found the corner where unused ideas come to stretch.",
  "This site is 42% portfolio and 58% moving things two pixels to the left.",
  "The case studies are mockups for now. The feelings are real.",
];

export function SecretFooter() {
  const [isOpen, setIsOpen] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  return (
    <div className={`secret-footer ${isOpen ? "is-open" : ""}`}>
      <button
        className="secret-footer__trigger"
        type="button"
        aria-expanded={isOpen}
        aria-controls="secret-footer-panel"
        onClick={() => setIsOpen((open) => !open)}
        data-cuelume-toggle="toggle"
      >
        <span>psst… there might be one more thing down here</span>
        <span aria-hidden="true">✳</span>
      </button>
      <div className="secret-footer__panel" id="secret-footer-panel" aria-hidden={!isOpen}>
        <div>
          <p className="eyebrow">Secret footer / unlocked</p>
          <h2>Woah! You found the <em>tiny</em> secret footer.</h2>
          <p>{messages[messageIndex]}</p>
        </div>
        <div className="secret-footer__actions">
          <button
            type="button"
            onClick={() => setMessageIndex((index) => (index + 1) % messages.length)}
            data-cuelume-toggle="pulse"
          >
            another one ↻
          </button>
          <button type="button" onClick={() => setIsOpen(false)} data-cuelume-toggle="page">
            close ×
          </button>
        </div>
      </div>
    </div>
  );
}
