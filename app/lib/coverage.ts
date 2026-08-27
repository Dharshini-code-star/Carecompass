/**
 * Illustrative coverage maths.
 *
 * A pure module with no React in it, so the arithmetic can be reasoned about
 * (and later tested) on its own.
 *
 * The order below is the one most Indian health policies follow, and the UI
 * states it openly because policies do vary:
 *
 *   hospital bill
 *     -> room-rent limit (with proportionate deduction on other charges)
 *     -> deductible
 *     -> co-payment
 *     -> capped at the sum insured
 *
 * Everything is kept in whole rupees so the figures shown to the user always
 * reconcile exactly.
 */

export interface CoverageInput {
  bill: number;
  sumInsured: number;
  deductible: number;
  coPaymentPercent: number;
  nights: number;
  roomRatePerNight: number;
  roomRentLimitPerNight: number;
}

export interface CoverageStep {
  id: string;
  label: string;
  explanation: string;
  /** Rupees this step removes from the claim. Zero for the opening line. */
  reduction: number;
  /** The claim value after this step. */
  runningTotal: number;
}

export interface CoverageEstimate {
  steps: CoverageStep[];
  /** What the policy might pay, on these assumptions. */
  insurerPays: number;
  /** What would be left for the patient. */
  youPay: number;
  /** Things the user should know about how this estimate was produced. */
  notes: string[];
}

/** Beyond ten crore an entry is almost certainly a typo. */
const MAX_AMOUNT = 100000000;
const MAX_NIGHTS = 365;

export function estimateCoverage(input: CoverageInput): CoverageEstimate {
  const bill = Math.round(input.bill);
  const steps: CoverageStep[] = [];
  const notes: string[] = [];

  let running = bill;

  steps.push({
    id: "bill",
    label: "Hospital bill",
    explanation: "The total amount billed by the hospital.",
    reduction: 0,
    runningTotal: running,
  });

  const roomFieldsGiven = [
    input.nights,
    input.roomRatePerNight,
    input.roomRentLimitPerNight,
  ].filter((value) => value > 0).length;

  const roomRentUsable =
    input.nights > 0 &&
    input.roomRatePerNight > 0 &&
    input.roomRentLimitPerNight > 0;

  if (roomRentUsable && input.roomRatePerNight > input.roomRentLimitPerNight) {
    const roomCharges = Math.min(
      Math.round(input.roomRatePerNight * input.nights),
      bill,
    );
    const otherCharges = bill - roomCharges;
    const ratio = input.roomRentLimitPerNight / input.roomRatePerNight;

    // Scaling the actual room charge by the ratio gives limit x nights in the
    // ordinary case, and stays correct when `roomCharges` had to be clamped to
    // the bill because the room figures entered exceed the bill itself.
    const eligibleRoom = Math.round(roomCharges * ratio);
    const payableOther = Math.round(otherCharges * ratio);
    const after = eligibleRoom + payableOther;

    steps.push({
      id: "room-rent",
      label: "Room-rent limit applied",
      explanation:
        "Your room costs more per day than the policy allows, so the room charge is capped. Many policies then reduce the other treatment charges in the same proportion — here that is " +
        Math.round(ratio * 100) +
        "% of them.",
      reduction: running - after,
      runningTotal: after,
    });

    running = after;

    if (Math.round(input.roomRatePerNight * input.nights) > bill) {
      notes.push(
        "The room charges you entered come to more than the total bill. Check those numbers — this estimate treats the bill as the true total.",
      );
    }
  } else if (roomFieldsGiven > 0 && !roomRentUsable) {
    notes.push(
      "The room-rent step was skipped. It needs all three room fields: nights, room cost per night, and the policy's room limit per night.",
    );
  } else if (roomRentUsable) {
    notes.push(
      "Your room cost is within the policy's room limit, so no room-rent deduction was applied.",
    );
  }

  if (input.deductible > 0) {
    const deducted = Math.min(Math.round(input.deductible), running);
    const after = running - deducted;

    steps.push({
      id: "deductible",
      label: "Deductible",
      explanation:
        "The amount you pay yourself before the policy pays anything at all.",
      reduction: deducted,
      runningTotal: after,
    });

    running = after;
  }

  if (input.coPaymentPercent > 0) {
    const share = Math.round((running * input.coPaymentPercent) / 100);
    const after = running - share;

    steps.push({
      id: "co-payment",
      label: "Co-payment of " + input.coPaymentPercent + "%",
      explanation:
        "Your fixed share of the approved claim. It applies even when the claim is approved in full.",
      reduction: share,
      runningTotal: after,
    });

    running = after;
  }

  const sumInsured = Math.round(input.sumInsured);

  if (running > sumInsured) {
    const capped = running - sumInsured;

    steps.push({
      id: "sum-insured",
      label: "Capped at the sum insured",
      explanation:
        "The policy will not pay more than the sum insured in a policy year.",
      reduction: capped,
      runningTotal: sumInsured,
    });

    running = sumInsured;
  }

  const insurerPays = Math.max(0, running);

  return {
    steps,
    insurerPays,
    youPay: Math.max(0, bill - insurerPays),
    notes,
  };
}

/* ------------------------------ input parsing ----------------------------- */

export type CoverageField = keyof CoverageInput;

export type RawCoverageInput = Record<CoverageField, string>;

export type CoverageErrors = Partial<Record<CoverageField, string>>;

export interface CoverageValidation {
  errors: CoverageErrors;
  /** Present only when the required fields are filled and nothing is invalid. */
  input: CoverageInput | null;
}

export const EMPTY_COVERAGE_INPUT: RawCoverageInput = {
  bill: "",
  sumInsured: "",
  deductible: "",
  coPaymentPercent: "",
  nights: "",
  roomRatePerNight: "",
  roomRentLimitPerNight: "",
};

/** Accepts "5,00,000", "500000" and a pasted rupee sign alike. */
function parseNumber(raw: string): number | null {
  const cleaned = raw.replace(/[₹,\s]/g, "");
  if (cleaned === "") return null;

  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

interface FieldRule {
  required?: boolean;
  min?: number;
  max?: number;
  integer?: boolean;
  rangeMessage?: string;
}

const RULES: Record<CoverageField, FieldRule> = {
  bill: { required: true, min: 0, max: MAX_AMOUNT },
  sumInsured: {
    required: true,
    min: 1,
    max: MAX_AMOUNT,
    rangeMessage: "The sum insured must be more than zero.",
  },
  deductible: { min: 0, max: MAX_AMOUNT },
  coPaymentPercent: {
    min: 0,
    max: 100,
    rangeMessage: "Enter a co-payment between 0 and 100 percent.",
  },
  nights: {
    min: 0,
    max: MAX_NIGHTS,
    integer: true,
    rangeMessage: "Enter a whole number of nights, up to 365.",
  },
  roomRatePerNight: { min: 0, max: MAX_AMOUNT },
  roomRentLimitPerNight: { min: 0, max: MAX_AMOUNT },
};

export function validateCoverage(raw: RawCoverageInput): CoverageValidation {
  const errors: CoverageErrors = {};
  const values = {} as CoverageInput;
  let missingRequired = false;

  for (const field of Object.keys(RULES) as CoverageField[]) {
    const rule = RULES[field];
    const parsed = parseNumber(raw[field]);

    if (parsed === null) {
      if (rule.required) missingRequired = true;
      values[field] = 0;
      continue;
    }

    if (Number.isNaN(parsed)) {
      errors[field] = "Enter numbers only, without letters or symbols.";
      continue;
    }

    if (rule.min !== undefined && parsed < rule.min) {
      errors[field] = rule.rangeMessage ?? "This cannot be a negative amount.";
      continue;
    }

    if (rule.max !== undefined && parsed > rule.max) {
      errors[field] =
        rule.rangeMessage ?? "That figure looks too large — please check it.";
      continue;
    }

    if (rule.integer && !Number.isInteger(parsed)) {
      errors[field] = rule.rangeMessage ?? "Enter a whole number.";
      continue;
    }

    values[field] = parsed;
  }

  return {
    errors,
    input:
      Object.keys(errors).length > 0 || missingRequired ? null : values,
  };
}
