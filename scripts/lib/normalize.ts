/**
 * Normalisation and validation for imported healthcare records.
 *
 * Pure functions with no database or network access, so the rules can be
 * tested directly. The importer calls these before anything touches Postgres:
 * a record that fails validation is flagged for review, never silently
 * inserted and never silently "fixed".
 */

export type Ownership = "GOVERNMENT" | "PRIVATE" | "TRUST_OR_NGO" | "UNKNOWN";

export interface RawHospital {
  name: string;
  address?: string | null;
  phone?: string | null;
  type?: string | null;
}

export interface NormalizedHospital {
  slug: string;
  name: string;
  address: string | null;
  area: string | null;
  pincode: string | null;
  phone: string | null;
  ownership: Ownership;
}

export interface ValidationIssue {
  field: string;
  reason: string;
  value: string | null;
}

export interface NormalizeResult {
  record: NormalizedHospital;
  issues: ValidationIssue[];
}

/** Stable, collision-resistant slug used as the upsert key. */
export function slugify(name: string): string {
  return name
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Chennai landline numbers appear in the district directory both with and
 * without the 044 STD code. We normalise to +91-44-XXXXXXXX only when the
 * number is unambiguous, and flag anything else rather than guessing.
 */
export function normalizePhone(raw: string | null | undefined): {
  phone: string | null;
  issue: ValidationIssue | null;
} {
  if (!raw) {
    return {
      phone: null,
      issue: { field: "phone", reason: "No phone number published", value: null },
    };
  }

  const digits = raw.replace(/[^\d]/g, "");

  // 044 + 8-digit subscriber number.
  if (/^044\d{8}$/.test(digits)) {
    return { phone: `+91-44-${digits.slice(3)}`, issue: null };
  }

  // Bare 8-digit Chennai landline: the 044 code is implied by the directory
  // being a Chennai district directory, so this is a safe expansion.
  if (/^\d{8}$/.test(digits)) {
    return { phone: `+91-44-${digits}`, issue: null };
  }

  // 10-digit mobile.
  if (/^[6-9]\d{9}$/.test(digits)) {
    return { phone: `+91-${digits}`, issue: null };
  }

  return {
    phone: null,
    issue: {
      field: "phone",
      reason: `Phone number "${raw}" does not match a recognised Indian format; not stored rather than stored wrong`,
      value: raw,
    },
  };
}

/** Six-digit Indian PIN, extracted from the address only when unambiguous. */
export function extractPincode(address: string | null | undefined): {
  pincode: string | null;
  issue: ValidationIssue | null;
} {
  if (!address) {
    return {
      pincode: null,
      issue: { field: "pincode", reason: "No address published", value: null },
    };
  }

  // Chennai PINs are 600xxx. Allow an optional space, as printed.
  const matches = [...address.matchAll(/\b(6\s?0\s?0\s?\d{3})\b/g)].map((m) =>
    m[1].replace(/\s/g, ""),
  );

  if (matches.length === 1) return { pincode: matches[0], issue: null };

  if (matches.length > 1) {
    return {
      pincode: null,
      issue: {
        field: "pincode",
        reason: "Address contains more than one candidate PIN code",
        value: address,
      },
    };
  }

  // Some entries print a short form such as "Chennai - 31" or "Chennai - 47".
  const short = /Chennai\s*[-–]\s*(\d{1,2})\b/i.exec(address);
  if (short) {
    return {
      pincode: null,
      issue: {
        field: "pincode",
        reason: `Address uses the abbreviated form "Chennai - ${short[1]}"; the full PIN was not expanded because the mapping is not published in the source`,
        value: address,
      },
    };
  }

  return {
    pincode: null,
    issue: { field: "pincode", reason: "No PIN code found in address", value: address },
  };
}

/**
 * Locality, taken only from the address as published. Chennai addresses put
 * the area before the city, so we take the segment before the one containing
 * "Chennai". Anything less certain is left null.
 */
export function extractArea(address: string | null | undefined): string | null {
  if (!address) return null;

  const parts = address.split(",").map((p) => p.trim()).filter(Boolean);
  const cityIndex = parts.findIndex((p) => /chennai/i.test(p));
  if (cityIndex <= 0) return null;

  const candidate = parts[cityIndex - 1];
  // Reject street/number fragments — those are not localities.
  if (/^\d/.test(candidate) || /road|street|salai|lane|avenue/i.test(candidate)) {
    return null;
  }
  return candidate;
}

export function normalizeOwnership(type: string | null | undefined): {
  ownership: Ownership;
  issue: ValidationIssue | null;
} {
  if (!type) {
    return {
      ownership: "UNKNOWN",
      issue: {
        field: "ownership",
        reason: "Source did not publish a Govt/Pvt classification for this record",
        value: null,
      },
    };
  }
  if (/govt|government/i.test(type)) return { ownership: "GOVERNMENT", issue: null };
  if (/pvt|private/i.test(type)) return { ownership: "PRIVATE", issue: null };
  return {
    ownership: "UNKNOWN",
    issue: {
      field: "ownership",
      reason: `Unrecognised classification "${type}"`,
      value: type,
    },
  };
}

export function normalizeHospital(raw: RawHospital): NormalizeResult {
  const issues: ValidationIssue[] = [];

  const name = raw.name.replace(/\s+/g, " ").trim();
  if (!name) {
    issues.push({ field: "name", reason: "Empty hospital name", value: null });
  }

  const address = raw.address?.replace(/\s+/g, " ").trim() || null;
  if (!address) {
    issues.push({ field: "address", reason: "No address published", value: null });
  }

  const { phone, issue: phoneIssue } = normalizePhone(raw.phone);
  if (phoneIssue) issues.push(phoneIssue);

  const { pincode, issue: pinIssue } = extractPincode(address);
  if (pinIssue) issues.push(pinIssue);

  const { ownership, issue: ownIssue } = normalizeOwnership(raw.type);
  if (ownIssue) issues.push(ownIssue);

  return {
    record: {
      slug: slugify(name),
      name,
      address,
      area: extractArea(address),
      pincode,
      phone,
      ownership,
    },
    issues,
  };
}

/**
 * Duplicate detection.
 *
 * Same slug is a certain duplicate. Beyond that we only flag *candidates* for
 * a human to judge — automatically merging two hospitals that merely share a
 * name prefix would silently destroy a distinct branch, which the brief
 * explicitly warns against.
 */
export function findDuplicateCandidates(
  records: NormalizedHospital[],
): { a: string; b: string; reason: string }[] {
  const pairs: { a: string; b: string; reason: string }[] = [];

  for (let i = 0; i < records.length; i++) {
    for (let j = i + 1; j < records.length; j++) {
      const a = records[i];
      const b = records[j];

      if (a.slug === b.slug) {
        pairs.push({ a: a.name, b: b.name, reason: "Identical slug" });
        continue;
      }
      if (a.phone && a.phone === b.phone) {
        pairs.push({
          a: a.name,
          b: b.name,
          reason: `Share phone ${a.phone} — may be one hospital listed twice, or two branches on one switchboard`,
        });
      }
    }
  }

  return pairs;
}
