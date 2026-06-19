"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, AlertCircle, ExternalLink, Search,
  CheckCircle2, XCircle, CreditCard, MapPin,
  ArrowRight, Star, Lightbulb, ShieldAlert,
} from "lucide-react";
import { COUNTRIES } from "@/lib/data";
import type { CenterOperator } from "@/lib/types";

// ── Operator styling ──────────────────────────────────────────────────────────

const OPERATOR_STYLE: Record<CenterOperator, {
  border: string; badge: string; dot: string; filterActive: string;
}> = {
  "VFS Global": { border: "border-l-white/20", badge: "bg-white/5 border border-white/10 text-white/50", dot: "bg-white/30", filterActive: "bg-white/10 border-white/20 text-white/70" },
  "iData": { border: "border-l-violet-500/50", badge: "bg-violet-500/10 border border-violet-500/25 text-violet-300/80", dot: "bg-violet-400", filterActive: "bg-violet-500/15 border-violet-400/30 text-violet-300" },
  "Kosmos": { border: "border-l-blue-500/50", badge: "bg-blue-500/10 border border-blue-500/25 text-blue-300/80", dot: "bg-blue-400", filterActive: "bg-blue-500/15 border-blue-400/30 text-blue-300" },
  "BLS International": { border: "border-l-orange-500/50", badge: "bg-orange-500/10 border border-orange-500/25 text-orange-300/80", dot: "bg-orange-400", filterActive: "bg-orange-500/15 border-orange-400/30 text-orange-300" },
  "AS Visa Solutions": { border: "border-l-emerald-500/50", badge: "bg-emerald-500/10 border border-emerald-500/25 text-emerald-300/80", dot: "bg-emerald-400", filterActive: "bg-emerald-500/15 border-emerald-400/30 text-emerald-300" },
  "Konsolosluk": { border: "border-l-yellow-500/50", badge: "bg-yellow-500/10 border border-yellow-500/25 text-yellow-300/80", dot: "bg-yellow-400", filterActive: "bg-yellow-500/15 border-yellow-400/30 text-yellow-300" },
};

const OPERATOR_LABELS: Record<CenterOperator, string> = {
  "VFS Global": "VFS Global", "iData": "iDATA", "Kosmos": "Kosmos Vize",
  "BLS International": "BLS International", "AS Visa Solutions": "AS Visa Solutions", "Konsolosluk": "Konsolosluk",
};

function getDifficulty(avgWait: string) {
  const first = parseInt(avgWait.match(/\d+/)?.[0] ?? "30");
  if (first <= 20) return { label: "Kolay", color: "text-emerald-400", bars: [true, false, false] };
  if (first <= 40) return { label: "Orta", color: "text-yellow-400", bars: [true, true, false] };
  return { label: "Zorlu", color: "text-red-400", bars: [true, true, true] };
}

// ── Country card ──────────────────────────────────────────────────────────────

function CountryCard({ country, index }: { country: typeof COUNTRIES[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const style = OPERATOR_STYLE[country.centerOperator];
  const diff = getDifficulty(country.avgWait);
  const operatorLabel = OPERATOR_LABELS[country.centerOperator];
  const [g1, g2] = country.coverGradient;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
      className="rounded-2xl overflow-hidden border border-white/8 hover:border-white/15 transition-all duration-200"
    >
      {/* Card header with country gradient background */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${g1}35 0%, #111111 50%, ${g2}20 100%)`,
        }}
      >
        {/* Decorative large flag */}
        <span
          className="absolute right-4 bottom-2 text-8xl leading-none select-none pointer-events-none"
          style={{ opacity: 0.12, filter: "blur(1px)" }}
        >
          {country.flag}
        </span>

        <div className="relative z-10 p-6 pb-5">
          {/* Flag + name */}
          <div className="flex items-start gap-3 mb-4">
            <span className="text-4xl leading-none">{country.flag}</span>
            <div>
              <h3 className="text-xl font-semibold text-white leading-tight tracking-tight">
                {country.name}
              </h3>
              <p className="text-sm text-white/40 font-light mt-0.5">{country.popularCity}</p>
            </div>
          </div>

          {/* Chips */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className={`inline-flex items-center gap-1.5 text-[11px] rounded-full px-2.5 py-1 font-medium ${style.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
              {operatorLabel}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] bg-white/5 border border-white/10 rounded-full px-2.5 py-1 text-white/40">
              {country.processingTime}
            </span>
            <span className={`inline-flex items-center gap-1.5 text-[11px] rounded-full px-2.5 py-1 bg-white/5 border border-white/10 ${diff.color}`}>
              <span className="flex gap-0.5">
                {diff.bars.map((filled, i) => (
                  <span key={i} className={`block w-1 h-2.5 rounded-[2px] ${filled ? diff.color.replace("text-", "bg-") : "bg-white/10"}`} />
                ))}
              </span>
              {diff.label}
            </span>
            {country.cascadeFriendly && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-1 text-amber-400/80">
                <Star size={9} />
                Kaskad
              </span>
            )}
          </div>
        </div>

        {/* Expand indicator */}
        <div className="absolute bottom-4 right-5 z-10">
          <ChevronDown
            size={16}
            className={`text-white/25 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden bg-[#111111]"
          >
            <div className="px-6 py-5 space-y-5 border-t border-white/6">
              {/* Required documents */}
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-3 font-medium">
                  📋 Gerekli Belgeler
                </p>
                <div className="flex flex-wrap gap-2">
                  {country.requirements.map((req, i) => (
                    <span key={i} className="text-[11px] bg-white/[0.04] border border-white/8 rounded-full px-3 py-1 text-white/50">
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bank requirements */}
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-3 font-medium flex items-center gap-1.5">
                  <CreditCard size={10} />
                  Banka & Finansal Gereksinimler
                </p>
                <p className="text-[13px] text-white/55 font-light leading-relaxed">
                  {country.bankRequirements}
                </p>
              </div>

              {/* Rejection reasons */}
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-3 font-medium flex items-center gap-1.5">
                  <ShieldAlert size={10} />
                  Red Riskleri & Çözümleri
                </p>
                <ul className="space-y-2.5">
                  {country.rejectionReasons.map((reason, i) => {
                    const [risk, solution] = reason.includes("→") ? reason.split("→") : [reason, null];
                    return (
                      <li key={i} className="flex items-start gap-2.5">
                        <XCircle size={12} className="text-red-400/50 shrink-0 mt-0.5" />
                        <span className="text-[12px] text-white/45 font-light leading-relaxed">
                          <span className="text-white/60">{risk.trim()}</span>
                          {solution && (
                            <>
                              <ArrowRight size={10} className="inline mx-1 text-white/20" />
                              <span className="text-emerald-400/70">{solution.trim()}</span>
                            </>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Tips */}
              {country.tips.length > 0 && (
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider mb-3 font-medium flex items-center gap-1.5">
                    <Lightbulb size={10} />
                    İpuçları
                  </p>
                  <ul className="space-y-2">
                    {country.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12px] text-white/45 font-light leading-relaxed">
                        <CheckCircle2 size={11} className="text-white/20 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Centers */}
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2 font-medium flex items-center gap-1.5">
                  <MapPin size={10} />
                  Başvuru Merkezleri
                </p>
                <p className="text-[12px] text-white/40 font-light">{country.centers.join(" · ")}</p>
              </div>

              {/* Official link */}
              <div className={`flex items-start gap-2.5 rounded-xl px-4 py-3.5 border ${style.badge}`}>
                <AlertCircle size={13} className="shrink-0 mt-0.5 opacity-60" />
                <div className="flex-1">
                  <p className="text-[11px] font-light leading-relaxed opacity-70">
                    Bilgiler değişebilir. Başvuru öncesi resmi kaynaktan doğrulayın.
                  </p>
                  <a
                    href={country.centerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] mt-2 underline underline-offset-2 hover:opacity-90 transition-opacity"
                  >
                    {operatorLabel} — Resmi Başvuru Sayfası
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── CASCADE rule visual ───────────────────────────────────────────────────────

const CASCADE_STEPS = [
  { step: "1.", label: "İlk Başvuru", sub: "Tek/çift girişli", note: "Seyahat süresi kadar", color: "text-white/60" },
  { step: "2.", label: "1 Yıl Çok Girişli", sub: "İlk vizeni doğru kullandıysan", note: "Schengen'de serbestlik", color: "text-blue-400" },
  { step: "3.", label: "2 Yıl Çok Girişli", sub: "1 yıllık vizeni doğru kullandıysan", note: "Uzun vadeli planlama", color: "text-violet-400" },
  { step: "4.", label: "5 Yıl Çok Girişli", sub: "2 yıllık vizeni doğru kullandıysan", note: "Tam kaskad avantajı", color: "text-amber-400" },
];

const CASCADE_RULES = [
  "180 gün içinde en fazla 90 gün Schengen'de kalabilirsin",
  "Vize bitiş tarihini asla aşma — tek ihlal kaskadı sıfırlar",
  "Her seyahatten sonra çıkış belgelerini (boarding pass, damga) sakla",
  "İkinci başvuruda 'çok girişli vize talep ediyorum' yaz ve önceki vizeni göster",
  "Pasaport değişirse eski pasaportunu mutlaka yanında taşı",
];

const CASCADE_BEST_COUNTRIES = [
  { flag: "🇩🇪", name: "Almanya", note: "İDATA, 2. başvuruda 1 yıl vize verir" },
  { flag: "🇳🇱", name: "Hollanda", note: "VFS, kaskad kuralına uyumlu" },
  { flag: "🇦🇹", name: "Avusturya", note: "VFS, çok girişli konusunda esnek" },
  { flag: "🇫🇷", name: "Fransa", note: "VFS, düzenli seyahatte çok girişli" },
  { flag: "🇮🇹", name: "İtalya", note: "iDATA, kademeli yükseltme uygular" },
];

function CascadeSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-14 rounded-2xl border border-white/8 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500/8 to-violet-500/8 border-b border-white/6 px-8 py-6">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 mb-4">
          <span className="text-[10px] text-amber-400 font-medium uppercase tracking-wider">2024–2026 AB Vize Kodu</span>
        </div>
        <h3
          className="text-2xl md:text-3xl font-light text-white tracking-tight leading-tight mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Kaskad Kuralı
          <span className="italic ml-2">— Vize Kademeleme Sistemi</span>
        </h3>
        <p className="text-white/45 font-light text-sm leading-relaxed max-w-2xl">
          AB Vize Kodu Madde 24/2 uyarınca: Schengen vizeni kurallara uygun her kullanımda
          bir üst basamağa geçersin. Doğru kullanım = uzun süreli çok girişli vize.
        </p>
      </div>

      <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
        {/* Step progression */}
        <div>
          <p className="text-[11px] text-white/30 uppercase tracking-wider mb-5 font-medium">Kademeleme Basamakları</p>
          <div className="space-y-3">
            {CASCADE_STEPS.map((s, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex flex-col items-center shrink-0">
                  <span className={`text-lg font-bold ${s.color}`}>{s.step}</span>
                  {i < CASCADE_STEPS.length - 1 && (
                    <div className="w-px h-6 bg-white/8 mt-1" />
                  )}
                </div>
                <div className="pb-1">
                  <p className={`text-base font-semibold ${s.color} leading-tight`}>{s.label}</p>
                  <p className="text-[12px] text-white/35 font-light mt-0.5">{s.sub}</p>
                  <p className="text-[11px] text-white/20 mt-0.5">{s.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rules + best countries */}
        <div className="space-y-6">
          <div>
            <p className="text-[11px] text-white/30 uppercase tracking-wider mb-4 font-medium">Kaskadı Koruyan Kurallar</p>
            <ul className="space-y-2.5">
              {CASCADE_RULES.map((rule, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 size={13} className="text-emerald-400/60 shrink-0 mt-0.5" />
                  <span className="text-[13px] text-white/55 font-light leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] text-white/30 uppercase tracking-wider mb-4 font-medium">
              <Star size={10} className="inline mr-1 text-amber-400" />
              Kaskad İçin Önerilen Ülkeler
            </p>
            <div className="space-y-2">
              {CASCADE_BEST_COUNTRIES.map((c, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span className="text-lg">{c.flag}</span>
                  <div>
                    <span className="text-sm text-white/70 font-medium">{c.name}</span>
                    <span className="text-[11px] text-white/30 ml-2">{c.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── First-time Schengen applicant guide ───────────────────────────────────────

const FIRST_TIME_EASIEST = [
  { flag: "🇬🇷", name: "Yunanistan", why: "Kosmos Vize, 3-7 iş günü, hızlı randevu" },
  { flag: "🇲🇹", name: "Malta", why: "VFS, 7-10 iş günü, esnek belgeler" },
  { flag: "🇪🇪", name: "Estonya", why: "VFS, 5-10 iş günü, düşük red oranı" },
  { flag: "🇱🇻", name: "Letonya", why: "VFS, 7-10 iş günü, kolay randevu" },
  { flag: "🇸🇰", name: "Slovakya", why: "BLS, 7-10 iş günü, az kuyruk" },
  { flag: "🇭🇺", name: "Macaristan", why: "AS Visa, 7-10 iş günü, uygun maliyet" },
];

const FIRST_TIME_CHECKLIST = [
  { ok: true, item: "Pasaport — seyahat sonrası en az 3 ay geçerli" },
  { ok: true, item: "Son 3-6 aylık banka hesap özeti (ani büyük yatırım YOK)" },
  { ok: true, item: "Minimum bakiye: günlük 50-100€ × gün + konaklama + bilet" },
  { ok: true, item: "Aylık düzenli gelir görünür olmalı (maaş/fatura)" },
  { ok: true, item: "Otel/Airbnb rezervasyonu — kesinleştirilmiş (iade edilebilir)" },
  { ok: true, item: "Uçuş rezervasyonu — onaylı (bilet zorunlu değil, rezervasyon yeterli)" },
  { ok: true, item: "Seyahat sigortası — en az 30.000€ teminat, tüm Schengen geçerli" },
  { ok: true, item: "Türkiye bağ belgesi: iş sözleşmesi + tapu/kira sözleşmesi" },
  { ok: false, item: "Başvurudan hemen önce bankaya büyük para yatırma" },
  { ok: false, item: "Tatil günleri için belirsiz seyahat planı sunma" },
  { ok: false, item: "Eksik belgeyle randevu iptalini bekle ve düzelt" },
];

function FirstTimerSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-14 grid md:grid-cols-2 gap-6"
    >
      {/* İlk başvuru panel */}
      <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.03] overflow-hidden">
        <div className="px-6 py-5 border-b border-emerald-500/10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 mb-3">
            <span className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider">İlk Schengen Başvurusu</span>
          </div>
          <h3 className="text-xl font-semibold text-white/90 mb-1">Nereden Başlamalı?</h3>
          <p className="text-sm text-white/40 font-light leading-relaxed">
            İlk Schengen için randevu kolaylığı, hızlı işlem ve düşük red oranına sahip ülkeleri tercih et.
          </p>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <p className="text-[10px] text-white/25 uppercase tracking-wider mb-3">Önerilen Ülkeler (Kolaydan Zorluya)</p>
            <div className="space-y-2.5">
              {FIRST_TIME_EASIEST.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xl shrink-0">{c.flag}</span>
                  <div>
                    <span className="text-sm text-white/75 font-medium">{c.name}</span>
                    <p className="text-[11px] text-white/35 font-light">{c.why}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4">
            <p className="text-[12px] text-amber-300/70 font-light leading-relaxed">
              <span className="font-semibold text-amber-300/90">İpucu:</span> İlk vizende hedef ülkende en az
              3-4 gece konak planla. Kısa konaklamalar şüphe uyandırabilir.
            </p>
          </div>
        </div>
      </div>

      {/* Belge kontrol listesi */}
      <div className="rounded-2xl border border-white/8 bg-[#111111] overflow-hidden">
        <div className="px-6 py-5 border-b border-white/6">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-3">
            <span className="text-[10px] text-white/50 font-medium uppercase tracking-wider">Belge Kontrol Listesi</span>
          </div>
          <h3 className="text-xl font-semibold text-white/90 mb-1">Eksiksiz Başvuru</h3>
          <p className="text-sm text-white/40 font-light">Yeşil = yapmalısın · Kırmızı = yapma</p>
        </div>
        <div className="p-6">
          <ul className="space-y-2.5">
            {FIRST_TIME_CHECKLIST.map((c, i) => (
              <li key={i} className="flex items-start gap-2.5">
                {c.ok
                  ? <CheckCircle2 size={13} className="text-emerald-400/70 shrink-0 mt-0.5" />
                  : <XCircle size={13} className="text-red-400/70 shrink-0 mt-0.5" />
                }
                <span className={`text-[12px] font-light leading-relaxed ${c.ok ? "text-white/60" : "text-red-300/60"}`}>
                  {c.item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

// ── General Tips 2026 ─────────────────────────────────────────────────────────

const GENERAL_TIPS_2026 = [
  {
    emoji: "⏰",
    title: "Boş Randevular Gece Çıkar",
    tip: "İptal edilen rezervasyonlar genellikle sabah 08:00–09:00 ve gece 23:00–00:00'da sisteme döner. Bu saatlerde Kosmos, VFS ve iDATA portallarını kontrol et.",
  },
  {
    emoji: "💶",
    title: "2026 Vize Maliyeti ~120€",
    tip: "2026 itibarıyla vize ücreti 90€ + vize merkezi servis bedeli ~25-35€ = kişi başı yaklaşık 115-125€. Döviz kuru farkını hesaba kat.",
  },
  {
    emoji: "📅",
    title: "180 Gün Öncesinden Başvurabilirsin",
    tip: "Schengen vize başvurusu seyahat tarihinden en fazla 180 gün önce (en erken), 15 gün önce (en geç) yapılabilir. Popüler ülkeler için en erken tarihe randevu al.",
  },
  {
    emoji: "🇬🇷",
    title: "En Kolay Randevu: Yunanistan",
    tip: "2026'da Yunanistan özellikle Ekim–Mart döneminde randevu bulmayı en kolaylaştıran Schengen ülkesidir. Slovakya, Macaristan ve Estonya da erişilebilir seçenekler.",
  },
  {
    emoji: "🏙️",
    title: "Alternatif Şehir Dene",
    tip: "İstanbul merkezleri genellikle dolu. Ankara, İzmir, Bursa ve Antalya'daki vize merkezleri çoğunlukla daha erken slot sunar. Aynı ülke için farklı şehirlere bakabilirsin.",
  },
  {
    emoji: "📋",
    title: "Güçlü Türkiye Bağı = Ret Riskini Düşürür",
    tip: "Konsolosluklar için en önemli belge: Türkiye'de ne bıraktığın. İş sözleşmesi, tapu/kira, araç ruhsatı, SGK belgesi — bu belgeler vizeyi güçlendirir.",
  },
];

// ── Operator filter ───────────────────────────────────────────────────────────

const ALL_OPERATORS = ["Tümü", "VFS Global", "iData", "Kosmos", "BLS International", "AS Visa Solutions"] as const;
type Filter = typeof ALL_OPERATORS[number];

// ── Main component ────────────────────────────────────────────────────────────

export default function CountryGuide() {
  const [query, setQuery] = useState("");
  const [activeOperator, setActiveOperator] = useState<Filter>("Tümü");

  const filtered = COUNTRIES.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.popularCity.toLowerCase().includes(query.toLowerCase());
    const matchesOperator = activeOperator === "Tümü" || c.centerOperator === activeOperator;
    return matchesSearch && matchesOperator;
  });

  const counts = COUNTRIES.reduce<Record<string, number>>((acc, c) => {
    acc[c.centerOperator] = (acc[c.centerOperator] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section id="guide" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 mb-5">
            <span className="text-xs text-white/40 font-light tracking-wider uppercase">Ülke Rehberi</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2
                className="text-4xl md:text-5xl font-light text-white tracking-tight leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Schengen Başvuru
                <br />
                <span className="italic">Rehberi 2026</span>
              </h2>
              <p className="text-white/40 font-light text-base mt-4 max-w-lg leading-relaxed">
                {COUNTRIES.length} ülke · Kaskad kuralı · Banka gereksinimleri · Red riski analizi · VFS, iDATA, Kosmos, BLS, AS Visa Solutions
              </p>
            </div>
            <div className="relative shrink-0 w-full md:w-72">
              <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
              <input
                type="text"
                placeholder="Ülke ara..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/8 rounded-full pl-9 pr-4 py-3 text-sm text-white/60 font-light placeholder-white/20 outline-none focus:border-white/20 transition-colors"
              />
            </div>
          </div>
        </motion.div>

        {/* ── CASCADE RULE ── */}
        <CascadeSection />

        {/* ── FIRST-TIME / 2ND+ ── */}
        <FirstTimerSection />

        {/* ── 2026 General Tips ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb size={15} className="text-amber-400/50" />
            <span className="text-sm text-white/40 font-medium uppercase tracking-wider">2026 Genel İpuçları</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {GENERAL_TIPS_2026.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-[#161616] border border-white/8 rounded-2xl p-6 flex gap-4 hover:border-white/15 transition-colors"
              >
                <span className="text-3xl shrink-0 mt-0.5">{t.emoji}</span>
                <div>
                  <p className="text-base font-semibold text-white/80 mb-2">{t.title}</p>
                  <p className="text-sm text-white/40 font-light leading-relaxed">{t.tip}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Warning ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-start gap-3 bg-white/[0.02] border border-white/6 rounded-xl px-5 py-4 mb-10 max-w-3xl"
        >
          <AlertCircle size={14} className="text-white/25 shrink-0 mt-0.5" />
          <p className="text-sm text-white/30 font-light leading-relaxed">
            Bu rehberdeki bilgiler genel bilgilendirme amaçlıdır. Vize kuralları değişkendir —
            başvuru öncesi mutlaka ilgili konsolosluğun veya yetkili vize merkezinin resmi sitesini kontrol edin.
          </p>
        </motion.div>

        {/* ── Operator filter tabs ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {ALL_OPERATORS.map((op) => {
            const isActive = activeOperator === op;
            const count = op === "Tümü" ? COUNTRIES.length : (counts[op] ?? 0);
            const style = op !== "Tümü" ? OPERATOR_STYLE[op as CenterOperator] : null;
            return (
              <button
                key={op}
                onClick={() => setActiveOperator(op)}
                className={`inline-flex items-center gap-1.5 text-sm rounded-full px-4 py-2 border transition-all duration-150 ${
                  isActive
                    ? style ? style.filterActive : "bg-white/10 border-white/20 text-white/70"
                    : "bg-white/[0.03] border-white/8 text-white/35 hover:border-white/15 hover:text-white/55"
                }`}
              >
                {style && isActive && <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />}
                {op === "Tümü" ? "Tüm Ülkeler" : OPERATOR_LABELS[op as CenterOperator]}
                <span className={`text-xs ${isActive ? "opacity-70" : "opacity-40"}`}>({count})</span>
              </button>
            );
          })}
        </motion.div>

        {/* ── Country grid ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-white/8 rounded-2xl">
            <p className="text-white/25 text-sm font-light">"{query}" için sonuç bulunamadı.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((country, i) => (
              <CountryCard key={country.code} country={country} index={i} />
            ))}
          </div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center text-xs text-white/15 font-light"
        >
          {filtered.length} ülke gösteriliyor · İçerik elle küratörlenmiş ve güncel tutulmaktadır · Resmi kaynaklardan doğrulayın
        </motion.p>
      </div>
    </section>
  );
}
