import Image from "next/image";

// Pure CSS animation (see .marquee-track in globals.css) — no client JS
// needed, and the site's global prefers-reduced-motion rule already freezes
// it for users who ask for that.
export function SponsorsSection() {
  return (
    <section
      id="sponsors"
      className="scroll-mt-24 border-t border-foreground/10 bg-background px-4 py-12 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.35em] text-accent">
          ETFC 02 &middot; Sponsors
        </span>
        <h2 className="font-display text-4xl uppercase leading-[0.9] text-foreground sm:text-5xl">
          Our Partners
        </h2>
        <p className="max-w-md text-foreground/70">The crews powering fight night.</p>
      </div>

      <div className="relative mt-10 w-full overflow-hidden sm:mt-12">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent sm:w-24" />

        <div className="marquee-track flex w-max items-center">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              <div
                // Source strip is 1217x80; cropping the box to a 1217/72
                // ratio and anchoring the image to the bottom (object-bottom)
                // zooms in ~10% and trims that off the top edge only.
                className="relative aspect-[1217/72] h-12 shrink-0 sm:h-16"
              >
                <Image
                  src="/who-will-win/sponsors.png"
                  alt={copy === 0 ? "Event sponsors" : ""}
                  aria-hidden={copy === 1}
                  fill
                  sizes="(max-width: 640px) 55vw, 30rem"
                  className="object-cover object-bottom"
                />
              </div>

              {/* Trace line filling the gap between loop copies — appears
                  after every copy (including the last) so the seam reads
                  the same at the wrap-around point as everywhere else. */}
              <span
                aria-hidden
                className="mx-6 flex shrink-0 items-center gap-1 text-accent/50 sm:mx-10"
              >
                <span className="size-1 shrink-0 rounded-full bg-current" />
                <span className="h-px w-8 bg-current sm:w-14" />
                <span className="size-1 shrink-0 rounded-full bg-current" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SponsorsSection;
