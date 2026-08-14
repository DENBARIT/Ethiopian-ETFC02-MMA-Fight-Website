import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Trashtalks",
  description: "Fighter callouts and fan trash talk for Adwa Fight Night — coming soon.",
};

export default function TrashtalksPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-6 text-center text-foreground">
      <span className="font-mono text-xs uppercase tracking-[0.35em] text-accent">
        Trashtalks
      </span>
      <h1 className="font-display text-4xl uppercase sm:text-5xl">Coming Soon</h1>
      <p className="max-w-md text-foreground/70">
        Callouts, call-outs and fan trash talk land here before fight night.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full border border-accent/40 px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-accent transition-colors hover:bg-accent/10"
      >
        Back to the card
      </Link>
    </main>
  );
}
