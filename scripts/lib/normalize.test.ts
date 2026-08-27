/**
 * Tests for the import pipeline's normalisation and validation rules.
 *
 * These matter more than usual: every rule here is a decision about when we
 * are allowed to transform real healthcare data, and when we must refuse and
 * flag it instead.
 */

import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
  extractArea,
  extractPincode,
  findDuplicateCandidates,
  normalizeHospital,
  normalizeOwnership,
  normalizePhone,
  slugify,
  type NormalizedHospital,
} from "./normalize.ts";

describe("phone normalisation", () => {
  test("expands a bare Chennai landline", () => {
    assert.equal(normalizePhone("26641777").phone, "+91-44-26641777");
  });

  test("keeps an explicit 044 number", () => {
    assert.equal(normalizePhone("044-28290200").phone, "+91-44-28290200");
  });

  test("handles a mobile number", () => {
    assert.equal(normalizePhone("9840012345").phone, "+91-9840012345");
  });

  test("refuses to store an unrecognised number, and says why", () => {
    const { phone, issue } = normalizePhone("1234");
    assert.equal(phone, null, "a malformed number must not be stored");
    assert.match(issue!.reason, /does not match a recognised/i);
  });

  test("a missing number is an issue, not a crash", () => {
    const { phone, issue } = normalizePhone(null);
    assert.equal(phone, null);
    assert.equal(issue!.field, "phone");
  });
});

describe("pincode extraction", () => {
  test("extracts a spaced Chennai PIN", () => {
    assert.equal(extractPincode("NO. 21, Greams Lane, Chennai - 600 006").pincode, "600006");
  });

  test("extracts an unspaced PIN", () => {
    assert.equal(extractPincode("Park Town, Chennai-600003").pincode, "600003");
  });

  test("refuses to guess when the source abbreviates the PIN", () => {
    const { pincode, issue } = extractPincode("McNichols Road, Chetpet, Chennai - 31");
    assert.equal(pincode, null, "abbreviated PINs must not be expanded");
    assert.match(issue!.reason, /abbreviated form/i);
  });

  test("refuses when the address is ambiguous", () => {
    const { pincode, issue } = extractPincode("Chennai - 600 006 and Chennai - 600 020");
    assert.equal(pincode, null);
    assert.match(issue!.reason, /more than one/i);
  });
});

describe("area extraction", () => {
  test("takes the locality preceding the city", () => {
    assert.equal(
      extractArea("No. 52, 1st Main Road, Gandhi Nagar, Adyar, Chennai - 600 020"),
      "Adyar",
    );
  });

  test("does not mistake a street for a locality", () => {
    assert.equal(extractArea("Cemetry Road, Chennai - 600 013"), null);
  });

  test("returns null rather than guessing when there is no comma structure", () => {
    assert.equal(extractArea("Porur, Chennai"), "Porur");
    assert.equal(extractArea("Chennai"), null);
  });
});

describe("ownership", () => {
  test("maps the district portal's vocabulary", () => {
    assert.equal(normalizeOwnership("Govt Hospital").ownership, "GOVERNMENT");
    assert.equal(normalizeOwnership("Pvt Hospital").ownership, "PRIVATE");
  });

  test("an unclassified record is UNKNOWN and flagged, never assumed private", () => {
    const { ownership, issue } = normalizeOwnership(null);
    assert.equal(ownership, "UNKNOWN");
    assert.ok(issue, "a missing classification must raise an issue");
  });
});

describe("whole-record normalisation", () => {
  test("a complete record produces no issues", () => {
    const { record, issues } = normalizeHospital({
      name: "Fortis Malar Hospital",
      address: "No. 52, 1st Main Road, Gandhi Nagar, Adyar, Chennai - 600 020",
      phone: "044-42892222",
      type: "Pvt Hospital",
    });

    assert.equal(record.slug, "fortis-malar-hospital");
    assert.equal(record.pincode, "600020");
    assert.equal(record.area, "Adyar");
    assert.equal(record.ownership, "PRIVATE");
    assert.deepEqual(issues, []);
  });

  test("an incomplete record still imports, carrying its issues", () => {
    const { record, issues } = normalizeHospital({
      name: "Dr. Mehtas Hospital",
      address: "No. 2, McNichols Road, 3rd Lane, Chetpet, Chennai - 31",
      phone: "42271001",
      type: null,
    });

    assert.equal(record.ownership, "UNKNOWN");
    assert.equal(record.pincode, null);
    // Two known gaps: the abbreviated PIN and the missing classification.
    assert.equal(issues.length, 2);
    assert.ok(issues.some((i) => i.field === "pincode"));
    assert.ok(issues.some((i) => i.field === "ownership"));
  });
});

describe("duplicate detection", () => {
  const base: NormalizedHospital = {
    slug: "x",
    name: "X",
    address: null,
    area: null,
    pincode: null,
    phone: null,
    ownership: "UNKNOWN",
  };

  test("identical slugs are flagged", () => {
    const pairs = findDuplicateCandidates([
      { ...base, slug: "apollo", name: "Apollo" },
      { ...base, slug: "apollo", name: "Apollo Hospital" },
    ]);
    assert.equal(pairs.length, 1);
    assert.match(pairs[0].reason, /Identical slug/);
  });

  test("branches of one group are NOT merged automatically", () => {
    const pairs = findDuplicateCandidates([
      { ...base, slug: "apollo-greams-road", name: "Apollo Hospital Greams Road" },
      { ...base, slug: "apollo-vanagaram", name: "Apollo Hospital Vanagaram" },
    ]);
    assert.equal(pairs.length, 0, "separate branches must survive as separate rows");
  });
});

describe("slugify", () => {
  test("is stable and url-safe", () => {
    assert.equal(slugify("R.S.R.M. Lying - In Hospital"), "r-s-r-m-lying-in-hospital");
    assert.equal(slugify("Govt Multi Super Speciality Hospital"), "govt-multi-super-speciality-hospital");
  });
});
