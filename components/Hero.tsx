"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const PHOTOS = [
  { src: "/Iskocya.jpg",         alt: "İskoçya manzarası"      },
  { src: "/Sunset-Barcelona.jpg",alt: "Barcelona gün batımı"   },
  { src: "/Oslo-Opera.jpg",      alt: "Oslo Opera Binası"      },
  { src: "/Colosseum-Italy.jpg", alt: "Colosseum, İtalya"      },
  { src: "/Paris2.jpg",          alt: "Paris, Fransa"          },
  { src: "/Amsterdam2.jpg",      alt: "Amsterdam, Hollanda"    },
  { src: "/Venedik.jpg",         alt: "Venedik, İtalya"        },
  { src: "/Prag.jpg",            alt: "Prag, Çekya"            },
  { src: "/Kopenhag.jpg",        alt: "Kopenhag, Danimarka"    },
];

const INTERVAL = 5000;

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % PHOTOS.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [next, paused]);

  return (
    <section
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
      aria-label="Ana Sayfa Hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >

      {/* ── SLIDESHOW BACKGROUND ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1.0 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.4, ease: "easeInOut" },
            scale:   { duration: INTERVAL / 1000 + 1.4, ease: "linear" },
          }}
        >
          <Image
            src={PHOTOS[index].src}
            alt={PHOTOS[index].alt}
            fill
            className="object-cover object-center"
            priority={index === 0}
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* ── OVERLAY (gradient, dark bottom for legibility) ── */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.28) 50%, rgba(0,0,0,0.68) 100%)",
        }}
      />

      {/* ── CONTENT ── */}
      <div
        className="relative z-[2] text-center px-6 max-w-3xl mx-auto flex flex-col items-center gap-6 select-none"
        style={{ fontFamily: "Inter, 'General Sans', sans-serif" }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.55 }}
          className="inline-flex items-center gap-2 bg-[#d7ffc2]/90 text-[#004449] text-[11px] font-semibold tracking-[0.14em] uppercase px-4 py-2 rounded-full backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#004449] animate-pulse" />
          Türkiye&apos;nin Schengen Vize Rehberi · 2026
        </motion.div>

        {/* Display headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.65 }}
          className="font-semibold leading-[1.06] text-white"
          style={{
            fontSize: "clamp(2.8rem, 7vw, 5.2rem)",
            letterSpacing: "0.04em",
            textShadow: "0 2px 20px rgba(0,0,0,0.4)",
          }}
        >
          Artık{" "}
          <span style={{ color: "#d7ffc2" }}>Schengen</span>
          <span style={{ color: "#483cff" }}>im</span>{" "}
          <span style={{ fontWeight: 400, fontStyle: "italic", opacity: 0.75 }}>var.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44, duration: 0.6 }}
          className="text-[17px] text-white/70 font-normal leading-relaxed max-w-lg"
          style={{ letterSpacing: "0.02em", textShadow: "0 1px 8px rgba(0,0,0,0.35)" }}
        >
          26 ülke vize rehberi · Topluluk randevuları · Anlık uçuş fırsatları
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.56, duration: 0.55 }}
          className="flex flex-wrap justify-center gap-3 pt-1"
        >
          <Link
            href="#guide"
            className="px-8 py-3.5 rounded-[900px] bg-[#483cff] text-white text-[13px] font-semibold tracking-[0.06em] transition-colors hover:bg-[#3b31e0]"
            style={{ boxShadow: "0 4px 24px rgba(72,60,255,0.45)" }}
          >
            Ülke Rehberi →
          </Link>
          <Link
            href="#flights"
            className="px-8 py-3.5 rounded-[900px] border border-white/40 text-white text-[13px] font-semibold tracking-[0.06em] transition-all hover:border-white/80 hover:bg-white/10 backdrop-blur-sm"
          >
            ✈ Uçuş Fırsatları
          </Link>
        </motion.div>
      </div>

      {/* ── PHOTO DOTS ── */}
      <div className="absolute bottom-8 left-0 right-0 z-[2] flex justify-center gap-2">
        {PHOTOS.map((p, i) => (
          <button
            key={p.src}
            onClick={() => setIndex(i)}
            aria-label={p.alt}
            className="transition-all duration-300"
            style={{
              width:  i === index ? "24px" : "6px",
              height: "6px",
              borderRadius: "9999px",
              background: i === index ? "#ffffff" : "rgba(255,255,255,0.35)",
            }}
          />
        ))}
      </div>

      {/* ── PROGRESS BAR ── */}
      {!paused && (
        <motion.div
          key={`bar-${index}`}
          className="absolute bottom-0 left-0 z-[3] h-[2px] bg-white/60"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: INTERVAL / 1000, ease: "linear" }}
        />
      )}

    </section>
  );
}
