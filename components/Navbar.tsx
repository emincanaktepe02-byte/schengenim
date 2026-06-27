"use client";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { COUNTRY_PAGES } from "@/lib/countryPages";

const NAV_LINKS = [
  { href: "/#appointments", label: "Randevular" },
  { href: "/#flights",      label: "Uçuşlar"    },
  { href: "/#guide",        label: "Rehber"      },
  { href: "/#blog",         label: "Blog"        },
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [dropdown,  setDropdown]  = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#111111]/92 backdrop-blur-md border-b border-white/8"
          : "bg-transparent"
      }`}
      style={{ fontFamily: "Inter, 'General Sans', sans-serif" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-white text-sm font-semibold tracking-wide">
            schengenim
            <span style={{ color: "#d7ffc2" }}>.com</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[13px] text-white/60 hover:text-white transition-colors font-medium tracking-wide"
            >
              {l.label}
            </Link>
          ))}

          {/* Countries dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdown(!dropdown)}
              className="flex items-center gap-1 text-[13px] text-white/60 hover:text-white transition-colors font-medium tracking-wide"
            >
              Ülkeler
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${dropdown ? "rotate-180" : ""}`}
              />
            </button>

            {dropdown && (
              <div
                className="absolute right-0 top-full mt-2 w-52 overflow-hidden"
                style={{
                  background: "#fffef0",
                  border: "1px solid rgba(0,68,73,0.10)",
                  borderRadius: "24px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <div className="p-2">
                  {COUNTRY_PAGES.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/ulkeler/${c.slug}`}
                      onClick={() => setDropdown(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-[14px] text-sm text-[#004449]/60 hover:text-[#004449] hover:bg-[#d7ffc2]/50 transition-all"
                    >
                      <span className="text-lg">{c.flag}</span>
                      <div>
                        <p className="text-xs font-semibold leading-tight">{c.name}</p>
                        <p className="text-[10px] text-[#004449]/35 font-medium">{c.heroCity}</p>
                      </div>
                    </Link>
                  ))}
                  <div className="border-t mt-2 pt-2" style={{ borderColor: "rgba(0,68,73,0.08)" }}>
                    <Link
                      href="/ulkeler"
                      onClick={() => setDropdown(false)}
                      className="flex items-center justify-center text-xs text-[#483cff]/70 hover:text-[#483cff] py-2 transition-colors font-semibold"
                    >
                      Tüm Ülkeler →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Primary CTA */}
          <Link
            href="#guide"
            className="px-5 py-2 rounded-[900px] bg-[#483cff] text-white text-[12px] font-semibold tracking-[0.06em] hover:bg-[#3b31e0] transition-colors"
            style={{ boxShadow: "0 2px 8px rgba(72,60,255,0.22)" }}
          >
            Rehbere Git
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white/60 hover:text-white transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-b px-6 py-5 flex flex-col gap-1"
          style={{ background: "#fffef0", borderColor: "rgba(0,68,73,0.08)" }}
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-[#004449]/60 hover:text-[#004449] transition-colors font-medium py-2"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="border-t mt-2 pt-3" style={{ borderColor: "rgba(0,68,73,0.08)" }}>
            <p className="text-[10px] text-[#004449]/30 uppercase tracking-wider font-semibold mb-2">
              Ülke Rehberleri
            </p>
            {COUNTRY_PAGES.map((c) => (
              <Link
                key={c.slug}
                href={`/ulkeler/${c.slug}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-sm text-[#004449]/55 hover:text-[#004449] transition-colors"
              >
                <span>{c.flag}</span>
                <span className="font-medium">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
