/**
 * Prebuild script: fetches cheap Schengen flight deals from Travelpayouts API
 * (which provides Skyscanner-affiliate pricing data) and writes them to
 * content/flights.json so the site always reflects the latest deals.
 *
 * Run automatically via `npm run build` or `npm run dev` (see package.json).
 * Requires TRAVELPAYOUTS_TOKEN env var; writes an empty array if not set.
 */

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../content/flights.json");

const token = process.env.TRAVELPAYOUTS_TOKEN;

if (!token) {
  console.log("⚠  TRAVELPAYOUTS_TOKEN not set — skipping flight fetch, writing []");
  writeFileSync(OUT, "[]", "utf-8");
  process.exit(0);
}

const ORIGINS = [
  { code: "IST", city: "İstanbul" },
  { code: "SAW", city: "İstanbul (SAW)" },
  { code: "ESB", city: "Ankara" },
  { code: "ADB", city: "İzmir" },
];

const DESTINATIONS = [
  { code: "ATH", city: "Atina", country: "Yunanistan" },
  { code: "AMS", city: "Amsterdam", country: "Hollanda" },
  { code: "CDG", city: "Paris", country: "Fransa" },
  { code: "FCO", city: "Roma", country: "İtalya" },
  { code: "MAD", city: "Madrid", country: "İspanya" },
  { code: "BCN", city: "Barselona", country: "İspanya" },
  { code: "VIE", city: "Viyana", country: "Avusturya" },
  { code: "ZRH", city: "Zürih", country: "İsviçre" },
  { code: "BER", city: "Berlin", country: "Almanya" },
  { code: "MUC", city: "Münih", country: "Almanya" },
  { code: "PRG", city: "Prag", country: "Çekya" },
  { code: "WAW", city: "Varşova", country: "Polonya" },
  { code: "BRU", city: "Brüksel", country: "Belçika" },
  { code: "LIS", city: "Lizbon", country: "Portekiz" },
  { code: "CPH", city: "Kopenhag", country: "Danimarka" },
  { code: "OSL", city: "Oslo", country: "Norveç" },
  { code: "ARN", city: "Stockholm", country: "İsveç" },
  { code: "HEL", city: "Helsinki", country: "Finlandiya" },
  { code: "BUD", city: "Budapeşte", country: "Macaristan" },
  { code: "BTS", city: "Bratislava", country: "Slovakya" },
  { code: "TLL", city: "Tallinn", country: "Estonya" },
  { code: "RIX", city: "Riga", country: "Letonya" },
  { code: "VNO", city: "Vilnius", country: "Litvanya" },
  { code: "LJU", city: "Ljubljana", country: "Slovenya" },
  { code: "ZAG", city: "Zagreb", country: "Hırvatistan" },
  { code: "SOF", city: "Sofya", country: "Bulgaristan" },
  { code: "OTP", city: "Bükreş", country: "Romanya" },
  { code: "MLA", city: "Malta", country: "Malta" },
];

function nextMonths(n) {
  const months = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return months;
}

async function fetchMonthPrices(origin, destination, month) {
  const url =
    `https://api.travelpayouts.com/v2/prices/month-matrix` +
    `?origin=${origin}&destination=${destination}&month=${month}` +
    `&currency=try&show_to_affiliates=true&token=${token}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const json = await res.json();
    if (!json.success || !json.data) return [];
    return Object.entries(json.data)
      .map(([date, info]) => ({ date, price: info.price ?? 0, airline: info.airline }))
      .filter((d) => d.price > 0);
  } catch {
    return [];
  }
}

function groupByWeek(prices) {
  const weeks = new Map();
  for (const p of prices) {
    const d = new Date(p.date);
    const day = d.getDay() || 7;
    const monday = new Date(d);
    monday.setDate(d.getDate() - (day - 1));
    const key = monday.toISOString().split("T")[0];
    if (!weeks.has(key)) weeks.set(key, []);
    weeks.get(key).push(p);
  }
  return weeks;
}

console.log("✈  Fetching Schengen flight deals from Travelpayouts (Skyscanner affiliate)...");
const months = nextMonths(6);
const deals = [];

for (const origin of ORIGINS) {
  for (const dest of DESTINATIONS) {
    const allPrices = [];
    for (const month of months) {
      const prices = await fetchMonthPrices(origin.code, dest.code, month);
      allPrices.push(...prices);
    }
    if (allPrices.length < 8) continue;

    const avg = allPrices.reduce((s, p) => s + p.price, 0) / allPrices.length;
    const weeks = groupByWeek(allPrices);

    for (const [weekStart, weekPrices] of weeks) {
      const min = weekPrices.reduce((a, b) => (a.price < b.price ? a : b));
      const savings = Math.round((1 - min.price / avg) * 100);
      if (savings >= 35) {
        deals.push({
          id: `${origin.code}-${dest.code}-${weekStart}`,
          origin: origin.code,
          originCity: origin.city,
          destination: dest.code,
          destinationCity: dest.city,
          destinationCountry: dest.country,
          departDate: weekStart,
          price: min.price,
          currency: "TRY",
          sixMonthAvg: Math.round(avg),
          savingsPercent: savings,
          airline: min.airline ?? null,
          bookingLink: `https://www.skyscanner.com.tr/transport/flights/${origin.code.toLowerCase()}/${dest.code.toLowerCase()}/${weekStart.replace(/-/g, "")}/`,
        });
      }
    }
  }
}

const sorted = deals.sort((a, b) => b.savingsPercent - a.savingsPercent).slice(0, 48);
writeFileSync(OUT, JSON.stringify(sorted, null, 2), "utf-8");
console.log(`✅  Wrote ${sorted.length} deals to content/flights.json`);
