import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/header";

export const Route = createFileRoute("/how")({ component: How });

const STEPS = [
  {
    bg: "bg-coral",
    src: "/jetson/how-coin.jpg",
    title: "Hold it",
    body: "Holding Jetson is the coin. There is no claim, no fee, and no vault. The bus does not look at your balance.",
    alt: "The little computer beside a blank coin",
  },
  {
    bg: "bg-sun",
    src: "/jetson/wave.jpg",
    title: "Boot",
    body: "Anyone can flip the board. Idle, boot, infer, power down. On the chain there are thirty seconds between flips. The buttons on the home page are a rehearsal. They are faster, and they do not send a transaction.",
    alt: "Jetson waving, lamps on",
  },
  {
    bg: "bg-sky",
    src: "/jetson/how-pins.jpg",
    title: "Pins",
    body: "Forty pins. Only 32 and 33 pulse. Three wires: pink, blue, yellow. They carry a signal, not a coin. The board has to be on.",
    alt: "Pin mouth with pink, blue, and yellow wires",
  },
  {
    bg: "bg-lime",
    src: "/jetson/how-eye.jpg",
    title: "Eye",
    body: "The eye opens only while the board is inferring. It stores a hash of a frame, not a price. One hash a minute.",
    alt: "Jetson with a ring around the camera",
  },
];

function How() {
  return (
    <main className="min-h-dvh bg-sun text-ink">
      <SiteHeader />

      <section className="border-b-4 border-ink px-5 py-10 sm:px-8">
        <p className="m-0 font-mono text-sm tracking-widest uppercase">How</p>
        <h1 className="m-0 mt-3 max-w-3xl text-5xl leading-none sm:text-7xl">
          Hold the coin. Play the machine. They are not the same job.
        </h1>
      </section>

      {STEPS.map((step) => (
        <section key={step.title} className={`grid border-b-4 border-ink lg:grid-cols-2 ${step.bg}`}>
          <img src={step.src} alt={step.alt} className="aspect-square w-full border-b-4 border-ink object-cover lg:border-r-4 lg:border-b-0" />
          <div className="grid content-center gap-4 px-5 py-10 sm:px-8">
            <h2 className="m-0 text-5xl leading-none">{step.title}</h2>
            <p className="m-0 max-w-xl text-xl leading-snug">{step.body}</p>
          </div>
        </section>
      ))}

      <section className="grid gap-4 px-5 py-12 sm:px-8">
        <h2 className="m-0 max-w-3xl text-5xl leading-none">If you hold Jetson</h2>
        <p className="m-0 max-w-2xl text-xl leading-snug">
          You hold it. That is the part. You do not have to press anything to keep it.
        </p>
        <p className="m-0 max-w-2xl text-xl leading-snug">
          If you want to play, you do not need the coin. Open Bus. Press boot, then infer. After that you can take a pin, send a wire, or give the eye a hash. The buttons there are a rehearsal. They do not send a transaction.
        </p>
        <p className="m-0 max-w-2xl text-xl leading-snug">
          Seat, bind, and lock are not a holder’s job. Those stay with the wallet that deployed the bus. The coin address is the coral bar on the home page.
        </p>
        <Link to="/" className="w-fit font-sans text-lg underline">
          Back to the machine
        </Link>
      </section>
    </main>
  );
}
