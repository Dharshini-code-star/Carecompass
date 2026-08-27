/**
 * Tests for the escalation ranking logic.
 *
 * Run with:  npm test
 *
 * These use Node's built-in test runner and its TypeScript type stripping, so
 * the project gains no test-runner dependency. That is possible only because
 * `escalation.ts` is pure and its cross-module imports are `import type`,
 * which is erased at runtime.
 */

import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
  assessCurrentHospital,
  distanceKmBetween,
  rankCandidates,
  safetyNotice,
  WEIGHTS,
  type Candidate,
  type Urgency,
} from "./escalation.ts";

function candidate(overrides: Partial<Candidate> = {}): Candidate {
  return {
    hospitalId: "h",
    name: "Hospital",
    area: null,
    facilityStatus: "unknown",
    facilityTrust: "not-verified",
    insurance: "unknown",
    insuranceTrust: "not-verified",
    distanceKm: 5,
    verifiedFacilityCount: 0,
    emergencyCapable: null,
    isCurrentHospital: false,
    ...overrides,
  };
}

const OPTS = { urgency: "high" as Urgency, facilityName: "ICU" };

describe("1. current hospital has the required facility", () => {
  test("no escalation is offered", () => {
    const result = assessCurrentHospital("available", "ICU", "Hospital A");

    assert.equal(result.outcome, "facility-available");
    assert.equal(result.offerEscalation, false);
    assert.match(result.headline, /appears to be available/);
  });
});

describe("2. current hospital does not have the required facility", () => {
  test("escalation is offered and hospitals with the facility are surfaced", () => {
    const assessment = assessCurrentHospital(
      "not-available",
      "ICU",
      "Hospital A",
    );
    assert.equal(assessment.outcome, "facility-not-available");
    assert.equal(assessment.offerEscalation, true);

    const ranked = rankCandidates(
      [
        candidate({ hospitalId: "a", name: "A", facilityStatus: "not-available" }),
        candidate({ hospitalId: "b", name: "B", facilityStatus: "available" }),
      ],
      OPTS,
    );

    assert.equal(ranked[0].hospitalId, "b");
    assert.equal(ranked[0].tier, 1);
  });
});

describe("3. facility status is unknown", () => {
  test("unknown is never reported as unavailable", () => {
    const result = assessCurrentHospital("unknown", "ICU", "Hospital A");

    assert.equal(result.outcome, "facility-unknown");
    assert.notEqual(result.outcome, "facility-not-available");
    assert.match(result.headline, /could not verify/i);
    assert.match(result.detail, /does not mean the facility is missing/i);
    // The user may still search, but nothing has been concluded for them.
    assert.equal(result.offerEscalation, true);
  });

  test("unknown outranks a recorded absence and scores above zero", () => {
    const ranked = rankCandidates(
      [
        candidate({ hospitalId: "no", name: "No", facilityStatus: "not-available" }),
        candidate({ hospitalId: "unk", name: "Unk", facilityStatus: "unknown" }),
      ],
      OPTS,
    );

    assert.equal(ranked[0].hospitalId, "unk");
    assert.equal(ranked[0].tier, 2);
    assert.ok(ranked[0].components.facility > 0);
    assert.equal(ranked[1].components.facility, 0);
  });

  test("an unknown distance is not treated as far, and is never filtered out", () => {
    const ranked = rankCandidates(
      [candidate({ hospitalId: "far", distanceKm: null })],
      { ...OPTS, maxRadiusKm: 5 },
    );

    assert.equal(ranked.length, 1, "unknown distance must survive a radius filter");
    assert.ok(ranked[0].components.distance > 0);
    assert.ok(ranked[0].components.distance < 1);
  });
});

describe("4. alternative has the facility but insurance is unknown", () => {
  test("it still appears, carrying an explicit insurance warning", () => {
    const ranked = rankCandidates(
      [
        candidate({
          hospitalId: "c",
          name: "C",
          facilityStatus: "available",
          insurance: "unknown",
        }),
      ],
      OPTS,
    );

    assert.equal(ranked.length, 1);

    const insurance = ranked[0].reasons.find((r) => r.kind === "insurance");
    assert.ok(insurance, "an insurance reason must be present");
    assert.equal(insurance.tone, "caution");
    assert.match(insurance.text, /could not be verified/i);

    // Unknown must never be scored as if it were compatible.
    assert.ok(ranked[0].components.insurance < 1);
  });
});

describe("5. alternative has facility, insurance and a reasonable distance", () => {
  test("it ranks top", () => {
    const ranked = rankCandidates(
      [
        candidate({ hospitalId: "weak", name: "Weak", facilityStatus: "unknown" }),
        candidate({
          hospitalId: "strong",
          name: "Strong",
          facilityStatus: "available",
          facilityTrust: "verified",
          insurance: "compatible",
          insuranceTrust: "verified",
          distanceKm: 6,
          emergencyCapable: true,
          verifiedFacilityCount: 5,
        }),
      ],
      OPTS,
    );

    assert.equal(ranked[0].hospitalId, "strong");
    assert.ok(ranked[0].score > ranked[1].score);
  });
});

describe("6. nearest hospital lacks the facility, a farther one has it", () => {
  test("the farther hospital with the facility ranks higher", () => {
    const ranked = rankCandidates(
      [
        candidate({
          hospitalId: "near",
          name: "Near",
          distanceKm: 2,
          facilityStatus: "not-available",
          insurance: "compatible",
          insuranceTrust: "verified",
          emergencyCapable: true,
          verifiedFacilityCount: 8,
        }),
        candidate({
          hospitalId: "far",
          name: "Far",
          distanceKm: 6,
          facilityStatus: "available",
          insurance: "compatible",
        }),
      ],
      OPTS,
    );

    assert.equal(ranked[0].hospitalId, "far");
    assert.equal(ranked[0].tier, 1);
    assert.equal(ranked[1].tier, 3);
  });

  test("this holds even when the nearer hospital is better on every other axis", () => {
    for (const urgency of ["critical", "high", "normal"] as Urgency[]) {
      const ranked = rankCandidates(
        [
          candidate({
            hospitalId: "near",
            name: "Near",
            distanceKm: 0.5,
            facilityStatus: "not-available",
            facilityTrust: "verified",
            insurance: "compatible",
            insuranceTrust: "verified",
            emergencyCapable: true,
            verifiedFacilityCount: 12,
          }),
          candidate({
            hospitalId: "far",
            name: "Far",
            distanceKm: 40,
            facilityStatus: "available",
            insurance: "not-compatible",
            emergencyCapable: false,
          }),
        ],
        { ...OPTS, urgency },
      );

      assert.equal(
        ranked[0].hospitalId,
        "far",
        `facility availability must dominate at ${urgency} urgency`,
      );
    }
  });
});

describe("7. critical urgency", () => {
  test("travel time and capability carry more weight, insurance carries least", () => {
    const critical = WEIGHTS.critical;

    assert.ok(critical.distance > WEIGHTS.high.distance);
    assert.ok(critical.distance > WEIGHTS.normal.distance);
    assert.ok(critical.capability > WEIGHTS.high.capability);

    // Cost must not outrank capability when someone is in trouble.
    assert.ok(critical.insurance < WEIGHTS.high.insurance);
    assert.ok(critical.insurance < WEIGHTS.normal.insurance);
    assert.equal(
      Math.min(...Object.values(critical)),
      critical.insurance,
      "insurance must be the smallest weight at critical urgency",
    );
  });

  test("within the same tier, the emergency-capable hospital wins at critical", () => {
    const candidates = [
      candidate({
        hospitalId: "plain",
        name: "Plain",
        facilityStatus: "available",
        distanceKm: 4,
        emergencyCapable: null,
        insurance: "compatible",
        insuranceTrust: "verified",
      }),
      candidate({
        hospitalId: "emergency",
        name: "Emergency",
        facilityStatus: "available",
        distanceKm: 4,
        emergencyCapable: true,
        verifiedFacilityCount: 6,
        insurance: "unknown",
      }),
    ];

    const atCritical = rankCandidates(candidates, { ...OPTS, urgency: "critical" });
    assert.equal(atCritical[0].hospitalId, "emergency");

    // At normal urgency the verified insurance match is allowed to win instead.
    const atNormal = rankCandidates(candidates, { ...OPTS, urgency: "normal" });
    assert.equal(atNormal[0].hospitalId, "plain");
  });

  test("every weight set sums to one, so scores stay comparable", () => {
    for (const urgency of ["critical", "high", "normal"] as Urgency[]) {
      const total = Object.values(WEIGHTS[urgency]).reduce((a, b) => a + b, 0);
      assert.ok(Math.abs(total - 1) < 1e-9, `${urgency} weights must sum to 1`);
    }
  });
});

describe("safety and framing", () => {
  test("the critical notice points at emergency services, not at us", () => {
    const notice = safetyNotice("critical");
    assert.match(notice, /emergency medical services/i);
    assert.match(notice, /not medical advice/i);
  });

  test("no generated wording ever instructs someone to switch hospital", () => {
    const ranked = rankCandidates(
      [candidate({ facilityStatus: "available", insurance: "compatible" })],
      OPTS,
    );

    const prose = [
      ...ranked.flatMap((r) => r.reasons.map((reason) => reason.text)),
      safetyNotice("critical"),
      safetyNotice("normal"),
      assessCurrentHospital("not-available", "ICU", "A").detail,
      assessCurrentHospital("unknown", "ICU", "A").detail,
    ].join(" ");

    assert.doesNotMatch(prose, /you should (switch|move|go to|transfer)/i);
    assert.doesNotMatch(prose, /\bmust go\b/i);
    // Facility claims stay hedged to what the data supports.
    assert.doesNotMatch(prose, /this hospital has an? ICU/i);
  });
});

describe("distance", () => {
  test("great-circle distance is plausible for two Chennai points", () => {
    const adyar = { lat: 13.0012, lng: 80.2565 };
    const annaNagar = { lat: 13.0878, lng: 80.2107 };
    const km = distanceKmBetween(adyar, annaNagar);

    assert.ok(km !== null);
    assert.ok(km > 9 && km < 12, `expected roughly 10 km, got ${km}`);
  });

  test("a missing point yields null rather than a guess", () => {
    assert.equal(distanceKmBetween(null, { lat: 13, lng: 80 }), null);
    assert.equal(distanceKmBetween({ lat: 13, lng: 80 }, null), null);
  });
});
