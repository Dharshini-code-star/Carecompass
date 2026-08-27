/**
 * Deterministic formatting helpers.
 *
 * These deliberately avoid `Intl` so that a value rendered on the server and
 * re-rendered on the client always produces the same string, whatever locale
 * or ICU build the two happen to have.
 */

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Formats whole rupees using Indian digit grouping: 1234567 -> "₹12,34,567". */
export function formatInr(value: number): string {
  if (!Number.isFinite(value)) return "—";

  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  const digits = String(Math.abs(rounded));

  if (digits.length <= 3) return `${sign}₹${digits}`;

  const lastThree = digits.slice(-3);
  const rest = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");

  return `${sign}₹${rest},${lastThree}`;
}

/** Formats an ISO date (YYYY-MM-DD) as "14 Mar 2026". Returns null if unparseable. */
export function formatIsoDate(iso: string): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return null;

  const [, year, month, day] = match;
  const monthName = MONTHS[Number(month) - 1];
  if (!monthName) return null;

  return `${Number(day)} ${monthName} ${year}`;
}
