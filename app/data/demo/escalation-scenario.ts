/**
 * DEMO DATA — NOT FOR REAL-WORLD USE.
 *
 * Invented hospitals, invented coordinates, invented facility and insurance
 * records. None of it describes any real hospital, and none of it may be used
 * to decide where anyone goes.
 *
 * It exists for one reason: the real dataset has no facility inventory and no
 * coordinates, so the escalation ranking cannot be seen working on real
 * records. This scenario exercises the full algorithm — facility match,
 * insurance match, distance, urgency, verification — so the behaviour is
 * inspectable and demonstrable.
 *
 * It is reachable only by explicitly choosing the demo scenario, is badged
 * DEMO DATA on every row, and is never mixed into the real hospital list.
 */

import type { FacilityId, FacilityStatus } from "@/app/data/facilities";
import { DEMO_PROVENANCE, type Provenance } from "@/app/data/provenance";
import type { GeoPoint } from "@/app/lib/escalation";

export interface DemoScenarioHospital {
  id: string;
  name: string;
  area: string;
  coordinates: GeoPoint;
  emergencyCapable: boolean | null;
  /** Insurer ids this demo record lists. Invented. */
  demoInsurerIds: string[];
  facilities: { facilityId: FacilityId; status: FacilityStatus }[];
}

const DEMO: Provenance = {
  ...DEMO_PROVENANCE,
  note: "DEMO DATA — NOT FOR REAL-WORLD USE. This hospital does not exist and these facilities are invented.",
};

export const DEMO_PROVENANCE_FOR_SCENARIO = DEMO;

/** The user's assumed starting point for the demo, near the first hospital. */
export const DEMO_ORIGIN: GeoPoint = { lat: 13.0102, lng: 80.2205 };

export const DEMO_SCENARIO_HOSPITALS: DemoScenarioHospital[] = [
  {
    // The "current hospital": close, insurance works, but no ICU recorded.
    id: "demo-a-city-clinic",
    name: "Demo City Clinic",
    area: "Demo Adyar",
    coordinates: { lat: 13.0121, lng: 80.2231 },
    emergencyCapable: true,
    demoInsurerIds: ["demo-a"],
    facilities: [
      { facilityId: "emergency-department", status: "available" },
      { facilityId: "icu", status: "not-available" },
      { facilityId: "laboratory", status: "available" },
      { facilityId: "ct-scan", status: "not-available" },
    ],
  },
  {
    // The strongest alternative: has the facility AND the insurance.
    id: "demo-b-multispecialty",
    name: "Demo B Multispecialty Hospital",
    area: "Demo Velachery",
    coordinates: { lat: 13.0561, lng: 80.2489 },
    emergencyCapable: true,
    demoInsurerIds: ["demo-a", "demo-b"],
    facilities: [
      { facilityId: "icu", status: "available" },
      { facilityId: "emergency-department", status: "available" },
      { facilityId: "ventilator", status: "available" },
      { facilityId: "ct-scan", status: "available" },
      { facilityId: "operation-theatre", status: "available" },
      { facilityId: "blood-bank", status: "available" },
    ],
  },
  {
    // Closer than B and has the facility, but insurance is unverified.
    id: "demo-c-care-centre",
    name: "Demo C Care Centre",
    area: "Demo Guindy",
    coordinates: { lat: 13.0301, lng: 80.2312 },
    emergencyCapable: true,
    demoInsurerIds: [],
    facilities: [
      { facilityId: "icu", status: "available" },
      { facilityId: "emergency-department", status: "available" },
      { facilityId: "ventilator", status: "available" },
    ],
  },
  {
    // Nearest of all, but nothing about the facility is known.
    id: "demo-d-neighbourhood",
    name: "Demo D Neighbourhood Hospital",
    area: "Demo Adyar",
    coordinates: { lat: 13.0119, lng: 80.2199 },
    emergencyCapable: null,
    demoInsurerIds: ["demo-a"],
    facilities: [{ facilityId: "laboratory", status: "available" }],
  },
  {
    // Far, well equipped: shows distance being traded against capability.
    id: "demo-e-institute",
    name: "Demo E Institute of Critical Care",
    area: "Demo Anna Nagar",
    coordinates: { lat: 13.0878, lng: 80.2107 },
    emergencyCapable: true,
    demoInsurerIds: ["demo-b"],
    facilities: [
      { facilityId: "icu", status: "available" },
      { facilityId: "picu", status: "available" },
      { facilityId: "nicu", status: "available" },
      { facilityId: "emergency-department", status: "available" },
      { facilityId: "trauma-centre", status: "available" },
      { facilityId: "ventilator", status: "available" },
      { facilityId: "operation-theatre", status: "available" },
      { facilityId: "blood-bank", status: "available" },
      { facilityId: "ct-scan", status: "available" },
      { facilityId: "mri", status: "available" },
    ],
  },
];

export function demoFacilityStatus(
  hospital: DemoScenarioHospital,
  facilityId: FacilityId,
): FacilityStatus {
  return (
    hospital.facilities.find((f) => f.facilityId === facilityId)?.status ??
    "unknown"
  );
}
