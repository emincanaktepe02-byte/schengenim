"use client";
import { motion } from "framer-motion";
import { Plane, AlertCircle, ExternalLink, Clock } from "lucide-react";
import type { Flight } from "@/lib/types";
import flightsData from "@/content/flights.json";
import { formatTimeAgo } from "@/lib/data";

const flights = flightsData as Flight[];

const INSPIRATION_SOURCES = [
  { label: "@gokdenizgok", href: "https://www.instagram.com/gokdenizgok" },
  { label: "@ucuzarota", href: "https://www.instagram.com/ucuzarota" },
  { label: "@ucuza.ucak", href: "https://www.instagram.com/ucuza.ucak" },
  { label: "ucuzaucak.net", href: "https://ucuzaucak.net" },
];

function FlightCard({ flight, index }: { flight: Flight; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="bg-[#202020] border border-white/5 rounded-[10px] p-6 hover:border-white/10 transition-colors flex flex-col gap-4"
    >
      {/* Route + Price */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-light text-white/80">
          <Plane size={14} className="text-white/30 shrink-0" />
          <span>{flight.origin}</span>
          <span className="text-white/20">→</span>
          <span>{flight.destination}</span>
        </div>
        <span className="text-lg font-medium text-white tracking-tight shrink-0">
          {flight.price}
        </span>
      </div>

      {/* Airline + Date */}
      <div className="flex items-center gap-3 text-xs text-white/40 font-light">
        <span>{flight.airline}</span>
        <span className="text-white/15">·</span>
        <span>{flight.date}</span>
      </div>

      {/* Note */}
      {flight.note && (
        <p className="text-xs text-white/35 font-light leading-relaxed italic border-l border-white/10 pl-3">
          "{flight.note}"
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-[10px] text-white/20">
          <Clock size={10} />
          <span>{formatTimeAgo(flight.postedAt)}</span>
        </div>
        {flight.sourceUrl ? (
          <a
            href={flight.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white/60 transition-colors"
          >
            <span>{flight.sourceLabel ?? "Kaynak"}</span>
            <ExternalLink size={9} />
          </a>
        ) : flight.sourceLabel ? (
          <span className="text-[10px] text-white/20">{flight.sourceLabel}</span>
        ) : null}
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-20 border border-dashed border-white/10 rounded-[10px]"
    >
      <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-4">
        <Plane size={20} className="text-white/20" />
      </div>
      <p className="text-white/30 text-sm font-light">Henüz uçuş fırsatı yok.</p>
      <p className="text-white/15 text-xs font-light mt-1">Yakında güncelleniyor.</p>
    </motion.div>
  );
}

export default function FlightsSection() {
  return (
    <section id="flights" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div>
            <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 mb-5">
              <Plane size={11} className="text-white/40" />
              <span className="text-xs text-white/40 font-light tracking-wider uppercase">
                Uygun Uçuşlar
              </span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-light text-white tracking-tight leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Uygun Fiyatlı
              <br />
              <span className="italic">Uçuş Fırsatları</span>
            </h2>
            <p className="text-white/35 font-light text-sm mt-3 max-w-md leading-relaxed">
              Avrupa'ya uygun bilet fırsatları. İlgili paylaşımlarda kaynak hesaba atıf verilir.
            </p>
          </div>

          {/* Inspiration sources */}
          <div className="shrink-0">
            <p className="text-[10px] text-white/20 uppercase tracking-wider mb-2">
              Takip ettiğimiz kaynaklar
            </p>
            <div className="flex flex-wrap gap-2">
              {INSPIRATION_SOURCES.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] text-white/30 border border-white/8 rounded-full px-2.5 py-1 hover:text-white/60 hover:border-white/20 transition-colors"
                >
                  {s.label}
                  <ExternalLink size={9} />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-start gap-2.5 bg-white/[0.03] border border-white/8 rounded-lg px-4 py-3 mb-8 max-w-2xl"
        >
          <AlertCircle size={14} className="text-white/30 shrink-0 mt-0.5" />
          <p className="text-xs text-white/30 font-light leading-relaxed">
            Fiyatlar değişkendir ve stok tükenmesi nedeniyle güncel olmayabilir. Satın almadan önce
            havayolu veya kaynak siteden doğrulayın. SchengenPass, bilet satışı yapmaz.
          </p>
        </motion.div>

        {/* Content */}
        {flights.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {flights.map((flight, i) => (
              <FlightCard key={flight.id} flight={flight} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
