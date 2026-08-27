/**
 * The only way the UI reads hospitals.
 *
 * Reads are async and take a query object even though the data is currently a
 * local array, so moving to a database or an API changes this file and nothing
 * else. The joining of hospitals to their insurance relationships also happens
 * here — the two are stored separately and must stay that way.
 */

import {
  REAL_HOSPITALS,
  type Hospital,
  type Ownership,
} from "@/app/data/real/hospitals";
import {
  RELATIONSHIPS,
  SCHEMES,
  type InsuranceRelationship,
} from "@/app/data/real/relationships";

/** What a page actually renders: a hospital plus what we know about its cover. */
export interface HospitalRecord extends Hospital {
  relationships: InsuranceRelationship[];
}

export type OwnershipFilter = "any" | Ownership;
export type AreaFilter = "any" | string;

export interface HospitalQuery {
  /** Free-text match against the hospital name. */
  q: string;
  area: AreaFilter;
  ownership: OwnershipFilter;
  /** Only hospitals whose emergency cover we have actually confirmed. */
  emergencyConfirmedOnly: boolean;
}

export const DEFAULT_HOSPITAL_QUERY: HospitalQuery = {
  q: "",
  area: "any",
  ownership: "any",
  emergencyConfirmedOnly: false,
};

/** Areas actually present in the dataset, so the filter can never be empty. */
export const AREA_OPTIONS: { value: AreaFilter; label: string }[] = [
  { value: "any", label: "Anywhere in Chennai" },
  ...[
    ...new Set(
      REAL_HOSPITALS.map((hospital) => hospital.area.value).filter(
        (area): area is string => area !== null,
      ),
    ),
  ]
    .sort((a, b) => a.localeCompare(b, "en"))
    .map((area) => ({ value: area as AreaFilter, label: area })),
];

export const OWNERSHIP_OPTIONS: { value: OwnershipFilter; label: string }[] = [
  { value: "any", label: "Government or private" },
  { value: "government", label: "Government" },
  { value: "private", label: "Private" },
];

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Anything unrecognised falls back to the default, so a hand-edited URL is safe. */
export function parseHospitalQuery(params: SearchParams): HospitalQuery {
  const q = (firstValue(params.q) ?? "").slice(0, 80);
  const area = firstValue(params.area);
  const ownership = firstValue(params.ownership);

  return {
    q,
    area: AREA_OPTIONS.some((option) => option.value === area)
      ? (area as AreaFilter)
      : "any",
    ownership:
      ownership === "government" || ownership === "private"
        ? ownership
        : "any",
    emergencyConfirmedOnly: firstValue(params.emergency) === "1",
  };
}

export function isDefaultHospitalQuery(query: HospitalQuery): boolean {
  return (
    query.q.trim() === "" &&
    query.area === "any" &&
    query.ownership === "any" &&
    !query.emergencyConfirmedOnly
  );
}

/** Plain-English description of the filters in force, for the results summary. */
export function describeHospitalQuery(query: HospitalQuery): string[] {
  const parts: string[] = [];

  if (query.q.trim()) parts.push(`matching “${query.q.trim()}”`);
  if (query.area !== "any") parts.push(`in ${query.area}`);
  if (query.ownership !== "any") parts.push(query.ownership);
  if (query.emergencyConfirmedOnly) parts.push("with confirmed emergency care");

  return parts;
}

function withRelationships(hospital: Hospital): HospitalRecord {
  return {
    ...hospital,
    relationships: RELATIONSHIPS.filter(
      (relationship) => relationship.hospitalId === hospital.id,
    ),
  };
}

export async function listHospitals(
  query: HospitalQuery = DEFAULT_HOSPITAL_QUERY,
): Promise<HospitalRecord[]> {
  const needle = query.q.trim().toLowerCase();

  return REAL_HOSPITALS.filter((hospital) => {
    if (needle && !hospital.name.toLowerCase().includes(needle)) return false;
    if (query.area !== "any" && hospital.area.value !== query.area) return false;
    if (query.ownership !== "any" && hospital.ownership !== query.ownership) {
      return false;
    }
    if (query.emergencyConfirmedOnly && hospital.emergency.value !== true) {
      return false;
    }
    return true;
  })
    .sort((a, b) => a.name.localeCompare(b.name, "en"))
    .map(withRelationships);
}

export async function getHospital(id: string): Promise<HospitalRecord | null> {
  const hospital = REAL_HOSPITALS.find((entry) => entry.id === id);
  return hospital ? withRelationships(hospital) : null;
}

export async function listHospitalIds(): Promise<string[]> {
  return REAL_HOSPITALS.map((hospital) => hospital.id);
}

export const TOTAL_REAL_HOSPITALS = REAL_HOSPITALS.length;

export const HOSPITALS_WITH_CONFIRMED_EMERGENCY = REAL_HOSPITALS.filter(
  (hospital) => hospital.emergency.value === true,
).length;

export const HOSPITALS_WITH_OFFICIAL_WEBSITE = REAL_HOSPITALS.filter(
  (hospital) => hospital.officialWebsite.value !== null,
).length;

export { SCHEMES };
