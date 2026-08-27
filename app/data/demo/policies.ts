/**
 * DEMO POLICIES — teaching examples, not real products.
 *
 * These are kept alongside the real IRDAI product records on purpose. Real
 * products are shown as facts plus a link to the actual policy wording; we do
 * not copy their figures. These invented policies carry figures so the coverage
 * estimator has something to work through, and so the shape of a policy can be
 * explained. They are badged DEMO DATA everywhere they appear.
 *
 * ORIGINAL NOTE:
 * DEMO POLICIES.
 *
 * These are invented products from invented insurers. The numbers, waiting
 * periods and exclusions are illustrative: they show the *shape* of a real
 * health policy so people can learn to read one. They are not quotes, not
 * offers, and not descriptions of any real product.
 */

import type { DemoInsurerId } from "@/app/data/demo/insurers";
import { DEMO_PROVENANCE, type WithProvenance } from "@/app/data/provenance";
import { formatInr } from "@/app/lib/format";

export const POLICY_TYPES = [
  "Individual",
  "Family floater",
  "Senior citizen",
  "Top-up",
] as const;

export type PolicyType = (typeof POLICY_TYPES)[number];

export type ClaimType = "Cashless and reimbursement" | "Reimbursement only";

/**
 * How the policy limits the room you can be admitted to. Modelled as a union
 * because the limit is expressed differently by different products, and the
 * coverage estimator needs the actual per-day rupee figure where one exists.
 */
export type RoomRentRule =
  | { kind: "no-limit"; description: string }
  | { kind: "percent-of-sum-insured"; percent: number }
  | { kind: "fixed-per-day"; amountPerDay: number }
  | { kind: "category"; description: string };

export interface WaitingPeriod {
  label: string;
  duration: string;
}

export interface Policy extends WithProvenance {
  id: string;
  name: string;
  insurerId: DemoInsurerId;
  type: PolicyType;
  /** Rupees. */
  sumInsured: number;
  roomRent: RoomRentRule;
  /** Percentage of the approved claim the policyholder pays. 0 means none. */
  coPaymentPercent: number;
  /** Rupees the policyholder pays before the policy pays anything. 0 means none. */
  deductible: number;
  claimType: ClaimType;
  waitingPeriods: WaitingPeriod[];
  exclusions: string[];
}

const COMMON_EXCLUSIONS = [
  "Cosmetic or aesthetic treatment, unless needed after an accident",
  "Dental treatment, unless needed after an accident",
  "Outpatient consultations and tests that do not lead to hospital admission",
  "Non-medical items such as gloves, admission kits and attendant charges",
];

export const POLICIES: Policy[] = [
  {
    id: "demo-secure-individual",
    name: "Demo Secure Individual Plan",
    insurerId: "demo-a",
    type: "Individual",
    sumInsured: 500000,
    roomRent: { kind: "percent-of-sum-insured", percent: 1 },
    coPaymentPercent: 0,
    deductible: 0,
    claimType: "Cashless and reimbursement",
    waitingPeriods: [
      { label: "Any illness after buying the policy", duration: "30 days" },
      { label: "Conditions you already had", duration: "36 months" },
      { label: "Listed illnesses and procedures", duration: "24 months" },
      { label: "Maternity", duration: "Not covered" },
    ],
    exclusions: [...COMMON_EXCLUSIONS],
    provenance: DEMO_PROVENANCE,
  },
  {
    id: "demo-family-shield-floater",
    name: "Demo Family Shield Floater",
    insurerId: "demo-a",
    type: "Family floater",
    sumInsured: 1000000,
    roomRent: {
      kind: "no-limit",
      description: "Any single private room, with no per-day cap",
    },
    coPaymentPercent: 0,
    deductible: 0,
    claimType: "Cashless and reimbursement",
    waitingPeriods: [
      { label: "Any illness after buying the policy", duration: "30 days" },
      { label: "Conditions you already had", duration: "36 months" },
      { label: "Listed illnesses and procedures", duration: "24 months" },
      { label: "Maternity", duration: "24 months" },
    ],
    exclusions: [...COMMON_EXCLUSIONS],
    provenance: DEMO_PROVENANCE,
  },
  {
    id: "demo-value-care",
    name: "Demo Value Care Plan",
    insurerId: "demo-b",
    type: "Individual",
    sumInsured: 300000,
    roomRent: { kind: "fixed-per-day", amountPerDay: 3000 },
    coPaymentPercent: 10,
    deductible: 0,
    claimType: "Cashless and reimbursement",
    waitingPeriods: [
      { label: "Any illness after buying the policy", duration: "30 days" },
      { label: "Conditions you already had", duration: "48 months" },
      { label: "Listed illnesses and procedures", duration: "24 months" },
      { label: "Maternity", duration: "Not covered" },
    ],
    exclusions: [
      ...COMMON_EXCLUSIONS,
      "Treatment taken outside India",
    ],
    provenance: DEMO_PROVENANCE,
  },
  {
    id: "demo-senior-assure",
    name: "Demo Senior Assure Plan",
    insurerId: "demo-b",
    type: "Senior citizen",
    sumInsured: 500000,
    roomRent: { kind: "percent-of-sum-insured", percent: 1 },
    coPaymentPercent: 20,
    deductible: 0,
    claimType: "Cashless and reimbursement",
    waitingPeriods: [
      { label: "Any illness after buying the policy", duration: "30 days" },
      { label: "Conditions you already had", duration: "24 months" },
      { label: "Listed illnesses and procedures", duration: "24 months" },
      { label: "Maternity", duration: "Not covered" },
    ],
    exclusions: [
      ...COMMON_EXCLUSIONS,
      "Treatment for conditions listed as permanently excluded in the policy schedule",
    ],
    provenance: DEMO_PROVENANCE,
  },
  {
    id: "demo-top-up-plus",
    name: "Demo Top-Up Plus",
    insurerId: "demo-c",
    type: "Top-up",
    sumInsured: 2000000,
    roomRent: {
      kind: "no-limit",
      description: "Any single private room, with no per-day cap",
    },
    coPaymentPercent: 0,
    deductible: 500000,
    claimType: "Reimbursement only",
    waitingPeriods: [
      { label: "Any illness after buying the policy", duration: "30 days" },
      { label: "Conditions you already had", duration: "36 months" },
      { label: "Listed illnesses and procedures", duration: "24 months" },
      { label: "Maternity", duration: "Not covered" },
    ],
    exclusions: [
      ...COMMON_EXCLUSIONS,
      "Any amount below the deductible, which you or another policy must pay first",
    ],
    provenance: DEMO_PROVENANCE,
  },
  {
    id: "demo-essential-cover",
    name: "Demo Essential Cover",
    insurerId: "demo-c",
    type: "Individual",
    sumInsured: 200000,
    roomRent: {
      kind: "category",
      description: "Shared room only; a private room is not covered",
    },
    coPaymentPercent: 0,
    deductible: 0,
    claimType: "Cashless and reimbursement",
    waitingPeriods: [
      { label: "Any illness after buying the policy", duration: "30 days" },
      { label: "Conditions you already had", duration: "48 months" },
      { label: "Listed illnesses and procedures", duration: "24 months" },
      { label: "Maternity", duration: "Not covered" },
    ],
    exclusions: [...COMMON_EXCLUSIONS, "Treatment taken outside India"],
    provenance: DEMO_PROVENANCE,
  },
];

/** The room-rent rule in one short human sentence. */
export function describeRoomRent(policy: Policy): string {
  const perDay = roomRentPerDay(policy);

  switch (policy.roomRent.kind) {
    case "no-limit":
    case "category":
      return policy.roomRent.description;
    case "percent-of-sum-insured":
      return `${policy.roomRent.percent}% of the sum insured per day${
        perDay === null ? "" : ` (${formatInr(perDay)} a day)`
      }`;
    case "fixed-per-day":
      return `Up to ${formatInr(policy.roomRent.amountPerDay)} a day`;
  }
}

/**
 * The room-rent cap as rupees per day, where the policy expresses one.
 * Returns null when the policy sets no rupee figure.
 */
export function roomRentPerDay(policy: Policy): number | null {
  switch (policy.roomRent.kind) {
    case "percent-of-sum-insured":
      return Math.round((policy.sumInsured * policy.roomRent.percent) / 100);
    case "fixed-per-day":
      return policy.roomRent.amountPerDay;
    case "no-limit":
    case "category":
      return null;
  }
}
