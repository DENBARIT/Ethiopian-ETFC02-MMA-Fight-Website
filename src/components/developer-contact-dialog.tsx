"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Modal } from "@/components/modal";

const BANK_NUMBER = "1000530264924";

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.554V9h3.565v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.089-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="m4 6.5 8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 12.6 20 4.5l-3 15-5.3-4-2.6 2.5-.4-4 9.6-8.6L6 13.3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CoffeeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M17 10.5h1.5a2.5 2.5 0 0 1 0 5H17" stroke="currentColor" strokeWidth="1.7" />
      <path d="M7.5 3c-.5 1 .5 1.3 0 2.5M11.5 3c-.5 1 .5 1.3 0 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="9" y="9" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m4 12 6 6 10-13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/leulgebremariam", Icon: LinkedInIcon },
  { label: "GitHub", href: "https://github.com/DENBARIT", Icon: GitHubIcon },
  { label: "Email", href: "mailto:leulethiopia05@gmail.com", Icon: EmailIcon },
  { label: "Telegram", href: "https://t.me/lamanchian", Icon: TelegramIcon },
  { label: "Phone", href: "tel:+251900648457", Icon: PhoneIcon },
];

interface DeveloperContactDialogProps {
  open: boolean;
  onClose: () => void;
}

export function DeveloperContactDialog({ open, onClose }: DeveloperContactDialogProps) {
  const [showBank, setShowBank] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting for this open
    setShowBank(false);
    setCopied(false);
  }, [open]);

  const copyBankNumber = () => {
    navigator.clipboard
      .writeText(BANK_NUMBER)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => {});
  };

  return (
    <Modal open={open} onClose={onClose} ariaLabel="Contact the developer" className="max-w-sm text-center">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto size-24 overflow-hidden rounded-full border-2 border-accent shadow-lg shadow-black/40 sm:size-28"
      >
        <Image
          src="/developer/photo.jpg"
          alt="Leul Gebremariam"
          width={224}
          height={224}
          sizes="(max-width: 640px) 96px, 112px"
          className="h-full w-full object-cover"
        />
      </motion.div>

      <h3 className="mt-4 font-display text-2xl uppercase leading-none text-foreground">
        Leul Gebremariam
      </h3>
      <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
        Built This Site
      </p>

      <p className="mt-4 text-pretty text-sm text-foreground/75">
        Do you have a business that needs a personal website, branding showcase, or a system
        built? You can contact me.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-2.5 sm:gap-3">
        {LINKS.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-foreground/15 py-3 text-foreground/80 transition-colors hover:border-accent hover:text-accent"
          >
            <Icon />
            <span className="font-mono text-[8px] uppercase tracking-wide">{label}</span>
          </a>
        ))}
      </div>

      <div className="mt-3">
        <AnimatePresence mode="wait" initial={false}>
          {!showBank ? (
            <motion.button
              key="cta"
              type="button"
              onClick={() => setShowBank(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-90"
            >
              <CoffeeIcon />
              Buy me a coffee
            </motion.button>
          ) : (
            <motion.div
              key="bank"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between gap-2 rounded-full border border-accent/40 bg-accent/10 py-2.5 pl-4 pr-2"
            >
              <span className="truncate font-mono text-sm tracking-wider text-accent">
                {BANK_NUMBER}
              </span>
              <button
                type="button"
                onClick={copyBankNumber}
                aria-label="Copy account number"
                className="flex shrink-0 items-center gap-1 rounded-full bg-accent/20 px-2.5 py-1.5 text-accent transition-colors hover:bg-accent hover:text-background"
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}

export default DeveloperContactDialog;
