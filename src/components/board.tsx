import { useEffect, useState } from "react";
import { useMachine, type Power } from "@/lib/machine";

const LAMPS = [
  { id: "lime", label: "Lime", className: "bg-lime" },
  { id: "coral", label: "Coral", className: "bg-coral" },
  { id: "sky", label: "Sky", className: "bg-sky" },
] as const;

const ART: Record<Power, { src: string; alt: string }> = {
  idle: {
    src: "/jetson/mark.jpg",
    alt: "Jetson logo, a small green computer with one camera and a pin smile",
  },
  boot: {
    src: "/jetson/wave.jpg",
    alt: "Jetson waving, pink blue and yellow wires out",
  },
  infer: {
    src: "/jetson/scan.jpg",
    alt: "Jetson inferring, a ring lit around the camera",
  },
  down: {
    src: "/jetson/sleepy.jpg",
    alt: "Jetson powered down, camera shutter low, wires slack",
  },
};

export function Board() {
  const power = useMachine((state) => state.power);
  const note = useMachine((state) => state.note);
  const boot = useMachine((state) => state.boot);
  const infer = useMachine((state) => state.infer);
  const powerDown = useMachine((state) => state.powerDown);
  const [lamp, setLamp] = useState(0);
  const live = power === "boot" || power === "infer";

  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => setLamp((n) => (n + 1) % LAMPS.length), 480);
    return () => window.clearInterval(id);
  }, [live]);

  const art = ART[power];
  const glow = LAMPS[lamp];

  return (
    <div className="grid gap-5">
      <div className={`overflow-hidden rounded-board border-4 border-ink bg-ink ${live ? "hop" : ""}`}>
        <img src={art.src} alt={art.alt} className="aspect-square w-full object-cover" />
      </div>
      <div className="flex items-center gap-3">
        {LAMPS.map((item, index) => (
          <span
            key={item.id}
            aria-hidden="true"
            className={`h-4 w-4 rounded-full border-2 border-ink ${live && index === lamp ? item.className : "bg-sun"}`}
          />
        ))}
        <p className="m-0 font-mono text-sm text-ink">{live ? `${glow.label} lamp` : "Asleep"}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {power === "idle" || power === "down" ? (
          <button
            type="button"
            onClick={boot}
            className="min-h-12 rounded-full border-4 border-ink bg-coral px-6 font-sans text-lg text-ink"
          >
            Boot
          </button>
        ) : null}
        {power === "boot" ? (
          <button
            type="button"
            onClick={infer}
            className="min-h-12 rounded-full border-4 border-ink bg-lime px-6 font-sans text-lg text-ink"
          >
            Infer
          </button>
        ) : null}
        {power === "boot" || power === "infer" ? (
          <button
            type="button"
            onClick={powerDown}
            className="min-h-12 rounded-full border-4 border-ink bg-coral px-6 font-sans text-lg text-ink"
          >
            Power down
          </button>
        ) : null}
      </div>
      {note ? <p className="m-0 font-mono text-sm text-ink">{note}</p> : null}
    </div>
  );
}
