/**
 * What we actually know about which facilities each real hospital has.
 *
 * WHICH IS ALMOST NOTHING, AND THAT IS THE POINT.
 *
 * The CMCHIS empanelled hospital list — our source for these 25 hospitals —
 * publishes names, districts and ownership. It does not publish facilities. We
 * have not obtained a facility inventory from any official source.
 *
 * So every facility on every hospital is `unknown`, with one exception: where
 * a hospital's own website confirmed emergency care, that is recorded as
 * `available` for the emergency department. Everything else stays unknown.
 *
 * The temptation here is to fill this in from a directory or a hospital's
 * marketing page. We do not, because "this hospital has an ICU" is exactly the
 * kind of claim someone might act on at 2am, and a stale or scraped answer is
 * worse than an honest "we don't know".
 */

import type { FacilityId, FacilityStatus } from "@/app/data/facilities";
import { unknown, type Provenance } from "@/app/data/provenance";
import { REAL_HOSPITALS } from "@/app/data/real/hospitals";

export interface HospitalFacility {
  hospitalId: string;
  facilityId: FacilityId;
  status: FacilityStatus;
  provenance: Provenance;
}

/**
 * Derived rather than hand-written, so it can never drift from the emergency
 * data on the hospital records themselves.
 */
export const REAL_HOSPITAL_FACILITIES: HospitalFacility[] = REAL_HOSPITALS.flatMap(
  (hospital) => {
    if (hospital.emergency.value !== true) return [];

    return [
      {
        hospitalId: hospital.id,
        facilityId: "emergency-department" as FacilityId,
        status: "available" as FacilityStatus,
        provenance: hospital.emergency.provenance,
      },
    ];
  },
);

/** The provenance attached to a facility nobody has checked. */
const NOT_CHECKED = unknown<never>(
  "No official source we have read publishes facility information for this hospital. Unknown means unchecked, not unavailable.",
).provenance;

/**
 * The status of one facility at one hospital.
 *
 * Absence from the records is `unknown`, never `not-available`. Callers must
 * not special-case a missing record into a negative answer.
 */
export function facilityStatusFor(
  hospitalId: string,
  facilityId: FacilityId,
  records: HospitalFacility[] = REAL_HOSPITAL_FACILITIES,
): HospitalFacility {
  const found = records.find(
    (record) =>
      record.hospitalId === hospitalId && record.facilityId === facilityId,
  );

  return (
    found ?? {
      hospitalId,
      facilityId,
      status: "unknown",
      provenance: NOT_CHECKED,
    }
  );
}

/** How many facilities we have positively verified at a hospital. */
export function verifiedFacilityCount(
  hospitalId: string,
  records: HospitalFacility[] = REAL_HOSPITAL_FACILITIES,
): number {
  return records.filter(
    (record) => record.hospitalId === hospitalId && record.status === "available",
  ).length;
}
