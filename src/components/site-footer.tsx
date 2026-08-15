"use client";

import { useState } from "react";
import { DeveloperContactDialog } from "@/components/developer-contact-dialog";
import { RemarksDialog } from "@/components/remarks-dialog";

export function SiteFooter() {
  const [contactOpen, setContactOpen] = useState(false);
  const [remarksOpen, setRemarksOpen] = useState(false);

  return (
    <footer className="border-t border-foreground/10 bg-background px-4 py-8 text-center sm:px-6 lg:px-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/50">
        &copy; 2026 All Rights Reserved
      </p>
      <div className="mt-3 flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em]">
        <button
          type="button"
          onClick={() => setContactOpen(true)}
          className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:text-foreground"
        >
          Contact the Developer
        </button>
        <span className="text-foreground/30">&middot;</span>
        <button
          type="button"
          onClick={() => setRemarksOpen(true)}
          className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:text-foreground"
        >
          Remarks
        </button>
      </div>

      <DeveloperContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
      <RemarksDialog open={remarksOpen} onClose={() => setRemarksOpen(false)} />
    </footer>
  );
}

export default SiteFooter;
