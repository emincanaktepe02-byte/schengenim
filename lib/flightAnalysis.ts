import type { CheapFlightDeal } from "./types";

const ORIGINS = [
  { code: "IST", city: "İstanbul" },
  { code: "SAW", city: "İstanbul (SAW)" },
  { code: "ESB", city: "Ankara" },
  { code: "ADB", city: "İzmir" },
];

// All Schengen country destinations with Turkish city names
const DESTINATIONS = [
  { code: "ATH", city: "Atina" },        // Yunanistan
  { code: "AMS", city: "Amsterdam" },     // Hollanda
  { code: "BCN", city: "Barselona" },     // İspanya (alternatif)
  { code: "CDG", city: "Paris" },         // Fransa
  { code: "FCO", city: "Roma" },          // İtalya
  { code: "MXP", city: "Milano" },        // İtalya (alternatif)
  { code: "MAD", city: "Madrid" },        // İspanya
  { code: "VIE", city: "Viyana" },        // Avusturya
  { code: "ZRH", city: "Zürih" },         // İsviçre
  { code: "MUC", city: "Münih" },         // Almanya (alternatif)
  { code: "BER", city: "Berlin" },        // Almanya
  { code: "FRA", city: "Frankfurt" },     // Almanya (ana)
  { code: "PRG", city: "Prag" },          // Çekya
  { code: "WAW", city: "Varşova" },       // Polonya
  { code: "KRK", city: "Kraków" },        // Polonya (alternatif)
  { code: "BRU", city: "Brüksel" },       // Belçika
  { code: "LIS", city: "Lizbon" },        // Portekiz
  { code: "CPH", city: "Kopenhag" },      // Danimarka
  { code: "OSL", city: "Oslo" },          // Norveç
  { code: "ARN", city: "Stockholm" },     // İsveç
  { code: "HEL", city: "Helsinki" },      // Finlandiya
  { code: "BUD", city: "Budapeşte" },     // Macaristan
  { code: "BTS", city: "Bratislava" },    // Slovakya
  { code: "TLL", city: "Tallinn" },       // Estonya
  { code: "RIX", city: "Riga" },          // Letonya
  { code: "VNO", city: "Vilnius" },       // Litvanya
  { code: "LJU", city: "Ljubljana" },     // Slovenya
  { code: "ZAG", city: "Zagreb" },        // Hırvatistan
  { code: "DBV", city: "Dubrovnik" },     // Hırvatistan (alternatif)
  { code: "SOF", city: "Sofya" },         // Bulgaristan
  { code: "OTP", city: "Bükreş" },        // Romanya
  { code: "MLA", city: "Malta" },         // Malta
  { code: "LUX", city: "Lüksemburg" },    // Lüksemburg
  { code: "KEF", city: "Reykjavik" },     // İzlanda
];

// Returns next N months as "YYYY-MM" strings
function nextMonths(n: number): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return months;
}

interface DailyPrice {
  date: string;
  price: number;
  airline?: string;
}

async function fetchMonthPrices(
  origin: string,
  destination: string,
  month: string,
  token: string
): Promise<DailyPrice[]> {
  const url =
    `https://api.travelpayouts.com/v2/prices/month-matrix` +
    `?origin=${origin}&destination=${destination}&month=${month}` +
    `&currency=try&show_to_affiliates=true&token=${token}`;

  const res = await fetch(url, {
    next: { revalidate: 86400 }, // cache 24h
  });

  if (!res.ok) return [];

  const json = await res.json();
  if (!json.success || !json.data) return [];

  // Response: { data: { "2026-07-01": { price, airline, ... }, ... } }
  return Object.entries(json.data as Record<string, { price?: number; airline?: string }>)
    .map(([date, info]) => ({
      date,
      price: info.price ?? 0,
      airline: info.airline,
    }))
    .filter((d) => d.price > 0);
}

function groupByWeek(prices: DailyPrice[]): Map<string, DailyPrice[]> {
  const weeks = new Map<string, DailyPrice[]>();
  for (const p of prices) {
    const d = new Date(p.date);
    // ISO week Monday
    const day = d.getDay() || 7;
    const monday = new Date(d);
    monday.setDate(d.getDate() - (day - 1));
    const key = monday.toISOString().split("T")[0];
    if (!weeks.has(key)) weeks.set(key, []);
    weeks.get(key)!.push(p);
  }
  return weeks;
}

export async function detectCheapFlights(token: string): Promise<CheapFlightDeal[]> {
  const months = nextMonths(6);
  const deals: CheapFlightDeal[] = [];

  for (const origin of ORIGINS) {
    for (const dest of DESTINATIONS) {
      // Skip same-region pairs that rarely have deals (optional)
      const allDailyPrices: DailyPrice[] = [];

      for (const month of months) {
        const prices = await fetchMonthPrices(origin.code, dest.code, month, token);
        allDailyPrices.push(...prices);
      }

      if (allDailyPrices.length < 8) continue;

      // 6-month average
      const sixMonthAvg =
        allDailyPrices.reduce((s, p) => s + p.price, 0) / allDailyPrices.length;

      // Group into weeks, find weekly minimum
      const weeks = groupByWeek(allDailyPrices);

      for (const [weekStart, weekPrices] of weeks) {
        const minEntry = weekPrices.reduce((a, b) => (a.price < b.price ? a : b));
        const savingsPercent = Math.round((1 - minEntry.price / sixMonthAvg) * 100);

        if (savingsPercent >= 40) {
          deals.push({
            origin: origin.code,
            originCity: origin.city,
            destination: dest.code,
            destinationCity: dest.city,
            departDate: weekStart,
            price: minEntry.price,
            currency: "TRY",
            sixMonthAvg: Math.round(sixMonthAvg),
            savingsPercent,
            airline: minEntry.airline,
            bookingLink: `https://www.skyscanner.com.tr/transport/flights/${origin.code.toLowerCase()}/${dest.code.toLowerCase()}/${weekStart.replace(/-/g, "")}/`,
          });
        }
      }
    }
  }

  // Sort by savings, cap at 40 results
  return deals.sort((a, b) => b.savingsPercent - a.savingsPercent).slice(0, 40);
}
