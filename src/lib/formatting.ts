import { Currency } from "../types";

export const RATES: Record<string, number> = { PLN_PLN: 1, USD_PLN: 3.85, EUR_PLN: 4.25 };
export const RATES_UPDATED_AT = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
export const SYM: Record<Currency, string> = { USD: "$", EUR: "€", PLN: "" };
export const SUF: Record<Currency, string> = { USD: "", EUR: "", PLN: " PLN" };

export function fmt(amount: number, currency: Currency, dec = 0): string {
  const n = Math.round(amount * 10 ** dec) / 10 ** dec;
  return `${SYM[currency]}${n.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec })}${SUF[currency]}`;
}

export function fromPLN(amount: number, to: Currency): number {
  return amount / (RATES[`${to}_PLN`] ?? 1);
}

export function toPLN(a: number, from: Currency): number {
  return a * (RATES[`${from}_PLN`] ?? 1);
}
