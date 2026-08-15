"use client";

import { Modal } from "@/components/modal";

interface RemarksDialogProps {
  open: boolean;
  onClose: () => void;
}

export function RemarksDialog({ open, onClose }: RemarksDialogProps) {
  return (
    <Modal open={open} onClose={onClose} ariaLabel="Remarks" className="max-w-md text-left">
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
        A Note From The Developer
      </span>
      <h3 className="mt-1.5 font-display text-2xl uppercase leading-none text-foreground">
        Remarks
      </h3>

      <div className="mt-5 space-y-4 text-pretty text-sm leading-relaxed text-foreground/80">
        <p>
          This project was built out of personal motivation, and most of the images used are
          gathered from social media. If you can provide better photos, they&rsquo;re welcome for
          use on the site.
        </p>
        <p>
          The intention behind this website is to showcase my skills and to connect with others —
          it isn&rsquo;t intended for any kind of ticketing. For tickets, please contact the event
          organizers directly.
        </p>
      </div>
    </Modal>
  );
}

export default RemarksDialog;
