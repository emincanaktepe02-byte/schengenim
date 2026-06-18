"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { href: "#appointments", label: "Randevu Paylaşımları" },
  { href: "#flights", label: "Uygun Uçuşlar" },
  { href: "#guide", label: "Ülke Rehberi" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 px-5 flex items-center justify-between transition-all duration-500 ${
        scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/5" : "bg-transparent"
      }`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {!logoError ? (
            <Image
              src="/logo.png"
              alt="SchengenPass"
              width={28}
              height={28}
              className="object-contain"
              onError={() => setLogoError(true)}
              priority
            />
          ) : (
            <div className="w-7 h-7 rounded-full border border-white/30 flex items-center justify-center">
              <span className="text-[10px] font-medium text-white">S</span>
            </div>
          )}
          <span className="font-light text-white tracking-tight text-base">
            Schengen<span className="font-medium">Pass</span>
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-[3px] opacity-40">
          <span className="w-[1.5px] h-3 bg-white rounded-full" />
          <span className="w-[1.5px] h-3 bg-white rounded-full" />
          <span className="w-[1.5px] h-3 bg-white rounded-full" />
        </div>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-sm text-white/60 hover:text-white transition-colors font-light tracking-tight"
          >
            {l.label}
          </Link>
        ))}
      </div>

      {/* Ücretsiz badge */}
      <div className="hidden md:flex items-center gap-2 border border-white/10 rounded-full px-3 py-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
        <span className="text-xs text-white/50 font-light">Ücretsiz</span>
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden text-white/70 hover:text-white"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-black/95 backdrop-blur-md border-b border-white/10 p-6 flex flex-col gap-4 md:hidden">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-white/70 hover:text-white text-sm font-light"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
