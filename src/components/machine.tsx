import { useState } from "react";
import { useMachine } from "@/lib/machine";

const WIRES = [
  { index: 0 as const, name: "Pink", className: "bg-coral" },
  { index: 1 as const, name: "Blue", className: "bg-sky" },
  { index: 2 as const, name: "Yellow", className: "bg-sun" },
];

const MODULES = [
  { slot: "0", name: "Boot", body: "Idle, boot, infer, down. Anyone can flip it." },
  { slot: "1", name: "Pins", body: "Forty headers. Pulse only on 32 and 33." },
  { slot: "2", name: "Eye", body: "A frame hash. Opens only while inferring." },
  { slot: "3", name: "Harness", body: "Pink, blue, yellow. Bytes, not coins." },
  { slot: "4", name: "Bay", body: "Six empty bays for the next module." },
];

export function Machine() {
  const pins = useMachine((state) => state.pins);
  const wires = useMachine((state) => state.wires);
  const frame = useMachine((state) => state.frame);
  const frameCount = useMachine((state) => state.frameCount);
  const power = useMachine((state) => state.power);
  const pressPin = useMachine((state) => state.pressPin);
  const clearHeader = useMachine((state) => state.clearHeader);
  const send = useMachine((state) => state.send);
  const see = useMachine((state) => state.see);
  const [drafts, setDrafts] = useState(["", "", ""]);
  const [eye, setEye] = useState("");

  return (
    <section className="grid gap-6 border-y-4 border-ink bg-sun px-5 py-8 sm:px-8">
      <div className="mx-auto grid w-full max-w-5xl gap-2">
        <h2 className="m-0 font-mono text-sm tracking-widest uppercase">The bus</h2>
        <p className="m-0 max-w-2xl text-xl leading-snug">
          One carrier, five modules. This page is a rehearsal of the contracts. It does not take a fee, and the coin slot stays empty.
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {MODULES.map((mod) => (
          <article key={mod.slot} className="rounded-board border-4 border-ink p-4">
            <p className="m-0 font-mono text-sm">{mod.slot}</p>
            <h3 className="m-0 mt-1 text-2xl">{mod.name}</h3>
            <p className="m-0 mt-2 text-base leading-snug">{mod.body}</p>
          </article>
        ))}
      </div>

      <div className="mx-auto grid w-full max-w-5xl gap-4">
        <div className="flex items-end justify-between gap-3">
          <h3 className="m-0 text-3xl">Pins</h3>
          <button
            type="button"
            onClick={clearHeader}
            className="min-h-12 rounded-full border-4 border-ink bg-sun px-4 font-sans text-base text-ink"
          >
            Clear header
          </button>
        </div>
        <div className="grid grid-cols-8 gap-1">
          {pins.slice(1).map((pin, index) => {
            const number = index + 1;
            const pwm = number === 32 || number === 33;
            const hot = pin.claimed && (pin.mode === "pwm" ? pin.duty > 0 : pin.level === 1);
            return (
              <button
                key={number}
                type="button"
                onClick={() => pressPin(number)}
                aria-label={`Pin ${number}${pwm ? ", pulse" : ""}`}
                className={`min-h-11 rounded-md border-2 border-ink font-mono text-sm text-ink ${
                  hot ? "bg-lime" : pwm ? "bg-sky" : "bg-sun"
                }`}
              >
                {number}
              </button>
            );
          })}
        </div>
        <p className="m-0 font-mono text-sm">Sky pins pulse. Power is {power}.</p>
      </div>

      <div className="mx-auto grid w-full max-w-5xl gap-4 lg:grid-cols-2">
        <div className="grid gap-3">
          <h3 className="m-0 text-3xl">Wires</h3>
          {WIRES.map((wire) => (
            <form
              key={wire.name}
              className="flex flex-wrap items-center gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                send(wire.index, drafts[wire.index]);
              }}
            >
              <span className={`inline-flex min-h-11 min-w-20 items-center justify-center rounded-full border-4 border-ink px-3 font-sans ${wire.className}`}>
                {wire.name}
              </span>
              <input
                value={drafts[wire.index]}
                onChange={(event) => {
                  const next = [...drafts];
                  next[wire.index] = event.target.value;
                  setDrafts(next);
                }}
                maxLength={42}
                aria-label={`${wire.name} signal`}
                className="min-h-12 min-w-0 flex-1 rounded-full border-4 border-ink bg-sun px-4 font-mono text-sm text-ink"
              />
              <button type="submit" className="min-h-12 rounded-full border-4 border-ink bg-lime px-4 font-sans text-base text-ink">
                Send
              </button>
              {wires[wire.index] ? <p className="m-0 w-full font-mono text-sm">{wires[wire.index]}</p> : null}
            </form>
          ))}
        </div>
        <form
          className="grid content-start gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            void see(eye);
          }}
        >
          <h3 className="m-0 text-3xl">Eye</h3>
          <input
            value={eye}
            onChange={(event) => setEye(event.target.value)}
            maxLength={80}
            aria-label="Frame note"
            placeholder="A frame, not a price"
            className="min-h-12 rounded-full border-4 border-ink bg-sun px-4 font-mono text-sm text-ink placeholder:text-ink/50"
          />
          <button type="submit" className="min-h-12 w-fit rounded-full border-4 border-ink bg-sky px-5 font-sans text-base text-ink">
            See
          </button>
          <p className="m-0 font-mono text-sm break-all">
            {frameCount > 0 ? `${frameCount} · ${frame.slice(0, 16)}` : "No frame yet."}
          </p>
        </form>
      </div>
    </section>
  );
}
