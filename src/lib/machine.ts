import { create } from "zustand";

export type Power = "idle" | "boot" | "infer" | "down";

type PinMode = "off" | "in" | "out" | "pwm";

export type Pin = {
  mode: PinMode;
  level: 0 | 1;
  duty: number;
  claimed: boolean;
};

type Machine = {
  power: Power;
  lastFlip: number;
  pins: Pin[];
  wires: [string, string, string];
  frame: string;
  frameCount: number;
  note: string;
  boot: () => void;
  infer: () => void;
  powerDown: () => void;
  pressPin: (pin: number) => void;
  clearHeader: () => void;
  send: (wire: 0 | 1 | 2, data: string) => void;
  see: (note: string) => Promise<void>;
};

const COOLDOWN_MS = 4000;

const blank = (): Pin => ({ mode: "off", level: 0, duty: 0, claimed: false });

function header(): Pin[] {
  return Array.from({ length: 41 }, blank);
}

function cooling(lastFlip: number): boolean {
  return Date.now() - lastFlip < COOLDOWN_MS;
}

function live(power: Power): boolean {
  return power === "boot" || power === "infer";
}

export const useMachine = create<Machine>((set, get) => ({
  power: "boot",
  lastFlip: 0,
  pins: header(),
  wires: ["", "", ""],
  frame: "",
  frameCount: 0,
  note: "",
  boot: () => {
    const { power, lastFlip } = get();
    if (power !== "idle" && power !== "down") {
      set({ note: "Already on." });
      return;
    }
    if (cooling(lastFlip)) {
      set({ note: "Cooling. Four seconds on this page, thirty on chain." });
      return;
    }
    set({ power: "boot", lastFlip: Date.now(), note: "Boot." });
  },
  infer: () => {
    const { power, lastFlip } = get();
    if (power !== "boot") {
      set({ note: "Infer only follows boot." });
      return;
    }
    if (cooling(lastFlip)) {
      set({ note: "Cooling. Four seconds on this page, thirty on chain." });
      return;
    }
    set({ power: "infer", lastFlip: Date.now(), note: "Infer. The eye is open." });
  },
  powerDown: () => {
    const { power, lastFlip } = get();
    if (power !== "boot" && power !== "infer") {
      set({ note: "Already down." });
      return;
    }
    if (cooling(lastFlip)) {
      set({ note: "Cooling. Four seconds on this page, thirty on chain." });
      return;
    }
    set({ power: "down", lastFlip: Date.now(), note: "Down. Clear the header if you want it empty." });
  },
  pressPin: (pin) => {
    const state = get();
    if (!live(state.power)) {
      set({ note: "Pins sleep until boot." });
      return;
    }
    if (pin < 1 || pin > 40) return;
    const pins = state.pins.slice();
    const row = { ...pins[pin] };
    if (!row.claimed) {
      const pwm = pin === 32 || pin === 33;
      row.claimed = true;
      row.mode = pwm ? "pwm" : "out";
      row.level = pwm ? 0 : 1;
      row.duty = pwm ? 1000 : 0;
      pins[pin] = row;
      set({ pins, note: pwm ? `Pin ${pin} pulsing.` : `Pin ${pin} high.` });
      return;
    }
    if (row.mode === "pwm") {
      row.duty = row.duty === 0 ? 500 : row.duty === 500 ? 1000 : 0;
      pins[pin] = row;
      set({ pins, note: `Pin ${pin} duty ${row.duty}.` });
      return;
    }
    row.level = row.level === 1 ? 0 : 1;
    pins[pin] = row;
    set({ pins, note: `Pin ${pin} ${row.level === 1 ? "high" : "low"}.` });
  },
  clearHeader: () => {
    const { power } = get();
    if (power !== "idle" && power !== "down") {
      set({ note: "Clear the header only while down." });
      return;
    }
    set({ pins: header(), note: "Header clear." });
  },
  send: (wire, data) => {
    const trimmed = data.trim();
    if (!trimmed) {
      set({ note: "A wire needs a signal." });
      return;
    }
    if (!live(get().power)) {
      set({ note: "Wires are quiet until boot." });
      return;
    }
    const wires = [...get().wires] as [string, string, string];
    wires[wire] = trimmed.slice(0, 42);
    const name = wire === 0 ? "Pink" : wire === 1 ? "Blue" : "Yellow";
    set({ wires, note: `${name} sent.` });
  },
  see: async (text) => {
    const trimmed = text.trim();
    if (!trimmed) {
      set({ note: "The eye needs a frame." });
      return;
    }
    if (get().power !== "infer") {
      set({ note: "The eye opens only while inferring." });
      return;
    }
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(trimmed));
    const hex = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
    set({ frame: hex, frameCount: get().frameCount + 1, note: "Frame kept as a hash." });
  },
}));
