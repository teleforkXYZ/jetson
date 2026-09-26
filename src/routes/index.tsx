import { createFileRoute } from "@tanstack/react-router";
import { Board } from "@/components/board";
import { Machine } from "@/components/machine";
import { site } from "@/lib/site";

export const Route = createFileRoute("/")({ component: Home });

const TICK =
  `$JETSON  ·  ${site.domain}  ·  ${site.multiple} ${site.pair}  ·  the little computer  ·  `;

const BOARDS = [
  { src: "/jetson/down.jpg", title: "Down", body: "Shutter closed. The header can clear." },
  { src: "/jetson/pins.jpg", title: "Pins", body: "The grin is a header. Two of them pulse." },
  { src: "/jetson/pwm.jpg", title: "Boot", body: "Lamps on. Arms are still just wire." },
  { src: "/jetson/csi.jpg", title: "Eye", body: "One camera, one ribbon." },
  { src: "/jetson/infer.jpg", title: "Infer", body: "The ring means the eye is recording." },
  { src: "/jetson/carrier.jpg", title: "Carrier", body: "Pink, blue, yellow, plugged in." },
];

function Home() {
  return (
    <main className="min-h-dvh bg-sun text-ink">
      <header className="flex items-center justify-between gap-4 border-b-4 border-ink px-5 py-4 sm:px-8">
        <p className="m-0 font-sans text-2xl">${site.ticker}</p>
        <p className="m-0 font-mono text-sm">{site.domain}</p>
      </header>

      <div className="overflow-hidden border-b-4 border-ink bg-lime">
        <p className="ticker m-0 w-max py-2 font-mono text-sm whitespace-nowrap">
          {TICK}
          {TICK}
        </p>
      </div>

      <section className="mx-auto grid max-w-5xl items-center gap-8 px-5 py-8 sm:px-8 sm:py-12 lg:grid-cols-2">
        <div className="grid gap-4">
          <p className="m-0 w-fit rounded-full bg-sky px-3 py-1 font-mono text-sm">
            {site.multiple} {site.pair}
          </p>
          <h1 className="m-0 text-6xl leading-none sm:text-8xl">{site.name}</h1>
          <p className="m-0 max-w-md text-2xl leading-snug">
            {site.line} One camera eye, a mouth of pins, arms made of wire.
          </p>
        </div>
        <Board />
      </section>

      <section className="grid gap-4 px-5 pb-8 sm:grid-cols-3 sm:px-8">
        <article className="rounded-board border-4 border-ink bg-lime p-5">
          <h2 className="m-0 text-3xl">One eye</h2>
          <p className="m-0 mt-2 text-lg leading-snug">It is a camera, not a face from a cartoon.</p>
        </article>
        <article className="rounded-board border-4 border-ink bg-coral p-5">
          <h2 className="m-0 text-3xl">Pins</h2>
          <p className="m-0 mt-2 text-lg leading-snug">The grin is a row of headers. Pull one and it still smiles.</p>
        </article>
        <article className="rounded-board border-4 border-ink bg-sky p-5">
          <h2 className="m-0 text-3xl">Wires</h2>
          <p className="m-0 mt-2 text-lg leading-snug">Pink, blue, yellow. That is the whole body.</p>
        </article>
      </section>

      <section className="grid gap-4 px-5 pb-8 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
        {BOARDS.map((board) => (
          <article key={board.title} className="overflow-hidden rounded-board border-4 border-ink bg-sun">
            <img src={board.src} alt="" className="aspect-square w-full object-cover" />
            <div className="grid gap-1 p-4">
              <h2 className="m-0 text-3xl">{board.title}</h2>
              <p className="m-0 text-lg leading-snug">{board.body}</p>
            </div>
          </article>
        ))}
      </section>

      <img
        src="/jetson/carrier.jpg"
        alt="Jetson carrier board, one camera, a pin header, and three wire arms"
        className="aspect-video w-full border-y-4 border-ink object-cover"
      />

      <Machine />

      <section className="mx-auto grid max-w-3xl gap-3 px-5 py-8 sm:px-8">
        <h2 className="m-0 font-mono text-sm tracking-widest uppercase">The record</h2>
        <p className="m-0 text-xl leading-snug">
          NVIDIA makes a small computer called Jetson. This page is the coin, paired {site.multiple} to {site.pair} on{" "}
          {site.pad}. It is not NVIDIA’s site.
        </p>
        <p className="m-0 font-mono text-sm break-all">LongX {site.vault}</p>
        <p className="m-0 text-lg">That address is the pair, not the coin.</p>
        <a href={site.pairUrl} className="w-fit font-sans text-lg underline">
          {site.pair} on {site.pad}
        </a>
        <div className="rounded-board border-4 border-ink p-4">
          <p className="m-0 font-mono text-sm tracking-widest uppercase">Contract</p>
          <p className="m-0 mt-2 font-mono text-lg">—</p>
          <p className="m-0 text-lg">No coin contract yet.</p>
        </div>
      </section>
    </main>
  );
}
