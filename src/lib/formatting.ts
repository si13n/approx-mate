import { Currency } from "../types";
import { TAX_2026 } from "../config/tax/2026";

export const RATES: Record<string, number> = {
  PLN_PLN: TAX_2026.exchangeRates.PLN_PLN,
  USD_PLN: TAX_2026.exchangeRates.USD_PLN,
  EUR_PLN: TAX_2026.exchangeRates.EUR_PLN,
};
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
