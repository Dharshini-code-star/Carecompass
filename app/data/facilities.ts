/**
 * The catalogue of hospital facilities a user can ask about.
 *
 * Deliberately a single source of truth: the picker, the escalation service and
 * the comparison table all read this list, so a facility is never hard-coded in
 * a component. Replacing this array with a database table means changing this
 * file and the repository that reads it — nothing else.
 */

export type FacilityId =
  | "icu"
  | "emergency-department"
  | "trauma-centre"
  | "operation-theatre"
  | "ventilator"
  | "nicu"
  | "picu"
  | "blood-bank"
  | "platelet-support"
  | "dialysis"
  | "cardiology"
  | "neurology"
  | "nephrology"
  | "oncology"
  | "ct-scan"
  | "mri"
  | "laboratory"
  | "ambulance";

export type FacilityCategory =
  | "Critical care"
  | "Specialty care"
  | "Diagnostics"
  | "Support services";

export interface Facility {
  id: FacilityId;
  name: string;
  category: FacilityCategory;
  /**
   * Whether this facility is one that tends to matter when someone is in an
   * emergency. Used only to weight ranking under CRITICAL urgency — it is not
   * a clinical judgement about any individual's situation.
   */
  emergencyRelevant: boolean;
  /** Plain-English description, shown under the picker. */
  description: string;
}

export const FACILITIES: Facility[] = [
  {
    id: "icu",
    name: "ICU",
    category: "Critical care",
    emergencyRelevant: true,
    description:
      "Intensive care unit, for patients who need continuous monitoring and support.",
  },
  {
    id: "emergency-department",
    name: "Emergency department",
    category: "Critical care",
    emergencyRelevant: true,
    description: "A department that accepts and treats emergency admissions.",
  },
  {
    id: "trauma-centre",
    name: "Trauma centre",
    category: "Critical care",
    emergencyRelevant: true,
    description:
      "Equipped to handle major injuries, usually from accidents or falls.",
  },
  {
    id: "operation-theatre",
    name: "Operation theatre",
    category: "Critical care",
    emergencyRelevant: true,
    description: "Facilities for surgical procedures.",
  },
  {
    id: "ventilator",
    name: "Ventilator support",
    category: "Critical care",
    emergencyRelevant: true,
    description: "Machines that support or take over a patient's breathing.",
  },
  {
    id: "nicu",
    name: "NICU",
    category: "Critical care",
    emergencyRelevant: true,
    description: "Neonatal intensive care, for newborn babies who need it.",
  },
  {
    id: "picu",
    name: "PICU",
    category: "Critical care",
    emergencyRelevant: true,
    description: "Paediatric intensive care, for children who need it.",
  },
  {
    id: "cardiology",
    name: "Cardiology",
    category: "Specialty care",
    emergencyRelevant: true,
    description: "Diagnosis and treatment of heart conditions.",
  },
  {
    id: "neurology",
    name: "Neurology",
    category: "Specialty care",
    emergencyRelevant: true,
    description: "Diagnosis and treatment of brain and nervous system conditions.",
  },
  {
    id: "nephrology",
    name: "Nephrology",
    category: "Specialty care",
    emergencyRelevant: false,
    description: "Diagnosis and treatment of kidney conditions.",
  },
  {
    id: "oncology",
    name: "Oncology",
    category: "Specialty care",
    emergencyRelevant: false,
    description: "Diagnosis and treatment of cancer.",
  },
  {
    id: "dialysis",
    name: "Dialysis",
    category: "Specialty care",
    emergencyRelevant: true,
    description: "Treatment that filters the blood when kidneys cannot.",
  },
  {
    id: "blood-bank",
    name: "Blood bank",
    category: "Support services",
    emergencyRelevant: true,
    description: "On-site store of blood for transfusion.",
  },
  {
    id: "platelet-support",
    name: "Platelet support",
    category: "Support services",
    emergencyRelevant: true,
    description:
      "Availability of platelets, which some conditions and treatments require.",
  },
  {
    id: "ambulance",
    name: "Ambulance service",
    category: "Support services",
    emergencyRelevant: true,
    description: "Patient transport operated by or arranged through the hospital.",
  },
  {
    id: "laboratory",
    name: "Laboratory",
    category: "Diagnostics",
    emergencyRelevant: false,
    description: "On-site testing of blood and other samples.",
  },
  {
    id: "ct-scan",
    name: "CT scan",
    category: "Diagnostics",
    emergencyRelevant: true,
    description: "Computed tomography imaging.",
  },
  {
    id: "mri",
    name: "MRI",
    category: "Diagnostics",
    emergencyRelevant: false,
    description: "Magnetic resonance imaging.",
  },
];

export const FACILITY_CATEGORIES: FacilityCategory[] = [
  "Critical care",
  "Specialty care",
  "Diagnostics",
  "Support services",
];

export function getFacility(id: string): Facility | undefined {
  return FACILITIES.find((facility) => facility.id === id);
}

export function isFacilityId(value: string): value is FacilityId {
  return FACILITIES.some((facility) => facility.id === value);
}

/**
 * Whether a hospital has a facility.
 *
 * The three states are not interchangeable, and the difference between
 * `not-available` and `unknown` is the single most important distinction in
 * this feature. A hospital not appearing in a list is `unknown`, never
 * `not-available` — saying "this hospital does not have an ICU" when nobody
 * checked would be a fabrication with real consequences.
 */
export type FacilityStatus = "available" | "not-available" | "unknown";

export const FACILITY_STATUS_LABELS: Record<FacilityStatus, string> = {
  available: "Available",
  "not-available": "Not available",
  unknown: "Could not be verified",
};
