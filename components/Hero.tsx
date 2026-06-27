"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section className="bg-[#fffef0] pt-16 overflow-hidden" aria-label="Ana Sayfa Hero">

      {/* ── TEXT BLOCK ── */}
      <motion.div
        className="max-w-[1200px] mx-auto px-6 pt-20 pb-10 flex flex-col items-center text-center gap-6"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: EASE }}
        style={{ fontFamily: "Inter, 'General Sans', sans-serif" }}
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#d7ffc2] text-[#004449] text-[11px] font-semibold tracking-[0.14em] uppercase px-4 py-2 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#004449] animate-pulse" />
          Türkiye&apos;nin Schengen Vize Rehberi · 2026
        </div>

        {/* Display headline */}
        <h1
          className="font-semibold leading-[1.06] text-[#004449] max-w-2xl"
          style={{
            fontSize: "clamp(2.6rem, 6.5vw, 5rem)",
            letterSpacing: "0.04em",
          }}
        >
          Artık{" "}
          <span>
            Schengen<span style={{ color: "#483cff" }}>im</span>
          </span>{" "}
          <span style={{ color: "rgba(0,68,73,0.40)", fontWeight: 400, fontStyle: "italic" }}>
            var.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-[18px] text-[#004449]/55 font-normal leading-relaxed max-w-xl"
          style={{ letterSpacing: "0.02em" }}
        >
          26 Schengen ülkesi için vize rehberi, topluluk randevuları ve anlık uçuş fırsatları.{" "}
          <span className="text-[#004449]/80 font-medium">Tamamen ücretsiz.</span>
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap justify-center gap-3 pt-1">
          <Link
            href="#guide"
            className="px-8 py-3.5 rounded-[900px] bg-[#483cff] text-white text-[13px] font-semibold tracking-[0.06em] transition-colors hover:bg-[#3b31e0]"
            style={{ boxShadow: "0 4px 20px rgba(72,60,255,0.28)" }}
          >
            Ülke Rehberi →
          </Link>
          <Link
            href="#flights"
            className="px-8 py-3.5 rounded-[900px] border border-[#004449]/25 text-[#004449] text-[13px] font-semibold tracking-[0.06em] transition-all hover:border-[#004449]/55 hover:bg-[#004449]/5"
          >
            ✈ Uçuş Fırsatları
          </Link>
        </div>
      </motion.div>

      {/* ── LANDSCAPE PHOTO ── */}
      <motion.div
        className="max-w-[1200px] mx-auto px-6 pb-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
      >
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: "16/7", borderRadius: "24px 24px 0 0" }}
        >
          <Image
            src="/Iskocya.jpg"
            alt="Avrupa manzarası"
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
          />

          {/* Subtle gradient at bottom for transition to dark sections */}
          <div
            className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(17,17,17,0.65))" }}
          />

          {/* Stats overlaid on photo */}
          <div className="absolute bottom-0 inset-x-0 px-8 pb-7 flex gap-10">
            {[
              { n: "26",        l: "ülke rehberi"   },
              { n: "Ücretsiz",  l: "her zaman"      },
              { n: "CASCADE",   l: "vize kademeleme" },
            ].map((s) => (
              <div key={s.n} className="text-white">
                <p className="font-semibold text-sm" style={{ fontFamily: "Inter" }}>{s.n}</p>
                <p className="text-white/55 text-[11px] font-medium tracking-wide mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

    </section>
  );
}
