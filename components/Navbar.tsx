"use client";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/calculator", label: "Calculator" },
  { href: "/education", label: "Learn" },
  { href: "/download", label: "Download" },
  { href: "/dashboard", label: "My Tracker" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-brand-100">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold text-brand-700">
          <span className="text-2xl">⛄</span> Snowball Coach
        </Link>

        <button
          className="md:hidden p-2 text-brand-700"
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>

        <ul className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-brand-800 hover:text-brand-600 font-medium">
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/login" className="btn-secondary !py-2 !px-4 !text-base">
              Sign in
            </Link>
          </li>
        </ul>
      </nav>

      {open && (
        <ul className="md:hidden border-t border-brand-100 px-6 py-4 space-y-3 bg-white">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setOpen(false)} className="block py-2 text-brand-800 font-medium">
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/login" onClick={() => setOpen(false)} className="btn-secondary !py-2 !px-4 !text-base inline-flex">
              Sign in
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}
