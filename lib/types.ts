export type CenterOperator = "VFS Global" | "BLS International" | "Kosmos" | "iData" | "AS Visa Solutions" | "Konsolosluk";

export interface Country {
  code: string;
  name: string;
  flag: string;
  popularCity: string;
  destinationCode: string;
  centers: string[];
  centerOperator: CenterOperator;
  centerUrl: string;
  visible: boolean;
  tips: string[];
  requirements: string[];
  processingTime: string;
  avgWait: string;
  bankRequirements: string;
  rejectionReasons: string[];
  coverGradient: [string, string];
  cascadeFriendly?: boolean;
}

export interface Appointment {
  id: string;
  country: string;
  flag: string;
  center: string;
  appointmentDate: string;
  source?: string;
  note?: string;
  sharedAt: string;
  screenshotUrl?: string;
}

export interface Flight {
  id: string;
  origin: string;
  destination: string;
  date: string;
  price: string;
  airline: string;
  sourceLabel?: string;
  sourceUrl?: string;
  note?: string;
  postedAt: string;
}

export interface CheapFlightDeal {
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  departDate: string;
  price: number;
  currency: "TRY";
  sixMonthAvg: number;
  savingsPercent: number;
  airline?: string;
  bookingLink: string;
}
