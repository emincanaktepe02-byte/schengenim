"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plane, AlertCircle, ExternalLink, TrendingDown, Search } from "lucide-react";
import type { CheapFlightDeal } from "@/lib/types";
import autoDeals from "@/content/flights.json";

// ── Static Schengen Skyscanner search data ──────────────────────────────────

const ORIGINS = [
  { code: "IST", label: "İstanbul (IST)", city: "İstanbul" },
  { code: "SAW", label: "Sabiha Gökçen (SAW)", city: "İstanbul (SAW)" },
  { code: "ESB", label: "Ankara (ESB)", city: "Ankara" },
  { code: "ADB", label: "İzmir (ADB)", city: "İzmir" },
] as const;

const SCHENGEN_ROUTES = [
  { code: "ATH", city: "Atina", country: "Yunanistan", flag: "🇬🇷" },
  { code: "CDG", city: "Paris", country: "Fransa", flag: "🇫🇷" },
  { code: "FCO", city: "Roma", country: "İtalya", flag: "🇮🇹" },
  { code: "MAD", city: "Madrid", country: "İspanya", flag: "🇪🇸" },
  { code: "BCN", city: "Barselona", country: "İspanya", flag: "🇪🇸" },
  { code: "AMS", city: "Amsterdam", country: "Hollanda", flag: "🇳🇱" },
  { code: "BER", city: "Berlin", country: "Almanya", flag: "🇩🇪" },
  { code: "VIE", city: "Viyana", country: "Avusturya", flag: "🇦🇹" },
  { code: "PRG", city: "Prag", country: "Çekya", flag: "🇨🇿" },
  { code: "BUD", city: "Budapeşte", country: "Macaristan", flag: "🇭🇺" },
  { code: "LIS", city: "Lizbon", country: "Portekiz", flag: "🇵🇹" },
  { code: "ZRH", city: "Zürih", country: "İsviçre", flag: "🇨🇭" },
  { code: "ARN", city: "Stockholm", country: "İsveç", flag: "🇸🇪" },
  { code: "OSL", city: "Oslo", country: "Norveç", flag: "🇳🇴" },
  { code: "CPH", city: "Kopenhag", country: "Danimarka", flag: "🇩🇰" },
  { code: "HEL", city: "Helsinki", country: "Finlandiya", flag: "🇫🇮" },
  { code: "BRU", city: "Brüksel", country: "Belçika", flag: "🇧🇪" },
  { code: "WAW", city: "Varşova", country: "Polonya", flag: "🇵🇱" },
  { code: "BTS", city: "Bratislava", country: "Slovakya", flag: "🇸🇰" },
  { code: "TLL", city: "Tallinn", country: "Estonya", flag: "🇪🇪" },
  { code: "RIX", city: "Riga", country: "Letonya", flag: "🇱🇻" },
  { code: "SOF", city: "Sofya", country: "Bulgaristan", flag: "🇧🇬" },
  { code: "MLA", city: "Malta", country: "Malta", flag: "🇲🇹" },
  { code: "ZAG", city: "Zagreb", country: "Hırvatistan", flag: "🇭🇷" },
  { code: "OTP", city: "Bükreş", country: "Romanya", flag: "🇷🇴" },
  { code: "LJU", city: "Ljubljana", country: "Slovenya", flag: "🇸🇮" },
  { code: "VNO", city: "Vilnius", country: "Litvanya", flag: "🇱🇹" },
];

type OriginCode = typeof ORIGINS[number]["code"];

function skyscannerUrl(from: string, to: string) {
  return `https://www.skyscanner.com.tr/transport/flights/${from.toLowerCase()}/${to.toLowerCase()}/`;
}

// ── Deal card (auto-detected from build-time fetch) ─────────────────────────

function DealCard({ deal, index }: { deal: CheapFlightDeal & { destinationCountry?: string }; index: number }) {
  const weekDate = new Date(deal.departDate).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.05, 0.3) }}
      className="bg-[#141414] border border-white/8 rounded-2xl p-5 hover:border-white/18 transition-all duration-200 flex flex-col gap-4 relative overflow-hidden"
    >
      <div className="absolute top-4 right-4 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
        <TrendingDown size={9} className="text-emerald-400" />
        <span className="text-[10px] text-emerald-400 font-semibold">%{deal.savingsPercent} ucuz</span>
      </div>

      <div className="flex items-center gap-2 text-sm font-light text-white/80 pr-16">
        <Plane size={13} className="text-white/30 shrink-0" />
        <span className="text-white/60">{deal.originCity}</span>
        <span className="text-white/20">→</span>
        <span className="font-medium text-white">{deal.destinationCity}</span>
      </div>

      <div>
        <div className="text-2xl font-semibold text-white tracking-tight">
          {deal.price.toLocaleString("tr-TR")} ₺
        </div>
        <div className="text-[11px] text-white/25 font-light mt-1">
          6 aylık ort. {deal.sixMonthAvg.toLocaleString("tr-TR")} ₺ · {weekDate} haftası
        </div>
      </div>

      {deal.airline && (
        <p className="text-xs text-white/35 font-light">{deal.airline}</p>
      )}

      <a
        href={deal.bookingLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/30 hover:bg-white/5 rounded-full px-4 py-2 transition-all w-fit"
      >
        Skyscanner'da İncele
        <ExternalLink size={11} />
      </a>
    </motion.div>
  );
}

// ── Skyscanner route card (static search fallback) ──────────────────────────

function RouteCard({ route, origin, index }: {
  route: typeof SCHENGEN_ROUTES[0];
  origin: OriginCode;
  index: number;
}) {
  return (
    <motion.a
      href={skyscannerUrl(origin, route.code)}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.03, 0.25) }}
      className="group bg-[#141414] border border-white/6 rounded-xl p-4 hover:border-white/20 hover:bg-[#1a1a1a] transition-all duration-150 flex items-center justify-between gap-3"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl leading-none">{route.flag}</span>
        <div>
          <div className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{route.city}</div>
          <div className="text-[11px] text-white/30 font-light">{route.country}</div>
        </div>
      </div>
      <div className="flex items-center gap-1 text-[11px] text-white/25 group-hover:text-white/60 transition-colors shrink-0">
        <Search size={10} />
        <span>Ara</span>
      </div>
    </motion.a>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function FlightsSection() {
  const [activeOrigin, setActiveOrigin] = useState<OriginCode>("IST");
  const deals = autoDeals as (CheapFlightDeal & { destinationCountry?: string })[];
  const hasDeals = deals.length > 0;

  return (
    <section id="flights" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 mb-5">
            <Plane size={11} className="text-white/40" />
            <span className="text-xs text-white/40 font-light tracking-wider uppercase">Schengen Uçuşları</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2
                className="text-3xl md:text-4xl font-light text-white tracking-tight leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Uygun Fiyatlı
                <br />
                <span className="italic">Schengen Uçuşları</span>
              </h2>
              <p className="text-white/35 font-light text-sm mt-3 max-w-lg leading-relaxed">
                IST, SAW, ESB ve ADB kalkışlı 27+ Schengen ülkesine bilet fiyatlarını Skyscanner&apos;dan takip et.
                {hasDeals && ` ${deals.length} adet ucuz fırsat tespit edildi.`}
              </p>
            </div>
            <a
              href="https://www.skyscanner.com.tr/ucak-bileti"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/30 rounded-full px-5 py-2.5 transition-all shrink-0"
            >
              Skyscanner&apos;da Tüm Uçuşlar
              <ExternalLink size={13} />
            </a>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-start gap-2.5 bg-white/[0.02] border border-white/8 rounded-xl px-4 py-3 mb-10 max-w-2xl"
        >
          <AlertCircle size={13} className="text-white/25 shrink-0 mt-0.5" />
          <p className="text-xs text-white/30 font-light leading-relaxed">
            Fiyatlar sürekli değişkendir. Satın almadan önce Skyscanner&apos;dan doğrulayın.
            SchengenPass bilet satışı yapmaz, Skyscanner bağlantıları sunar.
          </p>
        </motion.div>

        {/* ── Auto-detected deals (from build-time fetch) ── */}
        {hasDeals && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <TrendingDown size={14} className="text-emerald-400" />
              <span className="text-xs text-white/50 font-light uppercase tracking-wider">
                Tespit Edilen Fırsatlar — 6 Aylık Ortalamanın %35+ Altı
              </span>
              <span className="text-[10px] text-white/20 border border-white/10 rounded-full px-2 py-0.5 ml-1">
                {deals.length} fırsat
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {deals.map((deal, i) => (
                <DealCard
                  key={`${deal.origin}-${deal.destination}-${deal.departDate}`}
                  deal={deal}
                  index={i}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Skyscanner search by origin ── */}
        <div>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Search size={13} className="text-white/30" />
              <span className="text-xs text-white/40 font-light uppercase tracking-wider">
                Kalkış Noktasına Göre Ara
              </span>
            </div>
            {/* Origin tabs */}
            <div className="flex gap-2 flex-wrap">
              {ORIGINS.map((o) => (
                <button
                  key={o.code}
                  onClick={() => setActiveOrigin(o.code)}
                  className={`text-xs rounded-full px-3.5 py-1.5 border transition-all duration-150 ${
                    activeOrigin === o.code
                      ? "bg-white/10 border-white/25 text-white"
                      : "bg-white/[0.03] border-white/8 text-white/35 hover:border-white/18 hover:text-white/60"
                  }`}
                >
                  {o.code}
                  <span className="hidden sm:inline text-white/40 ml-1">· {o.city}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {SCHENGEN_ROUTES.map((route, i) => (
              <RouteCard key={route.code} route={route} origin={activeOrigin} index={i} />
            ))}
          </div>

          <p className="mt-5 text-[11px] text-white/20 font-light">
            Seçilen kalkış → hedef için Skyscanner&apos;da esnek tarih araması açılır.
          </p>
        </div>
      </div>
    </section>
  );
}
