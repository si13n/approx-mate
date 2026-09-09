import { Currency } from "../types";
import { DEFAULT_EXCHANGE_RATES } from "../config/exchangeRates";

export const RATES: Record<string, number> = DEFAULT_EXCHANGE_RATES;
export const SYM: Record<Currency, string> = { USD: "$", EUR: "€", PLN: "" };
export const SUF: Record<Currency, string> = { USD: "", EUR: "", PLN: " PLN" };

export function fmt(amount: number, currency: Currency, dec = 0): string {
  const n = Math.round(amount * 10 ** dec) / 10 ** dec;
  return `${SYM[currency]}${n.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec })}${SUF[currency]}`;
}

export function fromPLN(amount: number, to: Currency, rates: Record<string, number> = RATES): number {
  return amount / (rates[`${to}_PLN`] ?? 1);
}

export function toPLN(a: number, from: Currency, rates: Record<string, number> = RATES): number {
  return a * (rates[`${from}_PLN`] ?? 1);
}
