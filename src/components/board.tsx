import { useEffect, useState } from "react";

const LAMPS = [
  { id: "lime", label: "Lime", className: "bg-lime" },
  { id: "coral", label: "Coral", className: "bg-coral" },
  { id: "sky", label: "Sky", className: "bg-sky" },
] as const;

export function Board() {
  const [live, setLive] = useState(true);
  const [lamp, setLamp] = useState(0);

  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => setLamp((n) => (n + 1) % LAMPS.length), 480);
    return () => window.clearInterval(id);
  }, [live]);

  const glow = LAMPS[lamp];

  return (
    <div className="grid gap-5">
      <div
        className={`overflow-hidden rounded-board border-4 border-ink bg-ink ${live ? "hop" : ""}`}
      >
        <img
          src={live ? "/jetson/boot.jpg" : "/jetson/idle.jpg"}
          alt={live ? "Jetson with its lamps lit, wires in the air" : "Jetson, a small green board with one camera eye"}
          className="aspect-square w-full object-cover"
        />
      </div>
      <div className="flex items-center gap-3">
        {LAMPS.map((item, index) => (
          <span
            key={item.id}
            aria-hidden="true"
            className={`h-4 w-4 rounded-full border-2 border-ink ${live && index === lamp ? item.className : "bg-sun"}`}
          />
        ))}
        <p className="m-0 font-mono text-sm text-ink">
          {live ? `${glow.label} lamp` : "Asleep"}
        </p>
      </div>
      <button
        type="button"
        onClick={() => setLive((value) => !value)}
        className="min-h-12 rounded-full border-4 border-ink bg-coral px-6 font-sans text-lg text-ink"
      >
        {live ? "Power down" : "Boot"}
      </button>
    </div>
  );
}
