/**
 * POST /api/hospitals/escalate
 *
 * The programmatic surface for facility escalation. The page itself is a
 * server component that calls `runEscalation` directly — that is the existing
 * convention and it keeps the flow shareable and JavaScript-free — so this
 * route exists for callers outside the app rather than for our own UI.
 *
 * It returns the same explainable structure the UI renders: every hospital
 * carries the reasons for its placement, and nothing is reported as available
 * or compatible unless a source says so.
 */

import { NextResponse } from "next/server";

import { isFacilityId } from "@/app/data/facilities";
import {
  parseEscalationQuery,
  runEscalation,
} from "@/app/lib/hospital-escalation";

interface EscalateBody {
  facility?: string;
  urgency?: string;
  coverage?: string;
  current?: string;
  radius?: number | string;
  dataset?: string;
}

export async function POST(request: Request) {
  let body: EscalateBody;

  try {
    body = (await request.json()) as EscalateBody;
  } catch {
    return NextResponse.json(
      { error: "Request body must be JSON." },
      { status: 400 },
    );
  }

  if (!body.facility || !isFacilityId(body.facility)) {
    return NextResponse.json(
      {
        error:
          "A known facility id is required. Fetch the catalogue from /api/facilities.",
      },
      { status: 400 },
    );
  }

  const query = parseEscalationQuery({
    facility: body.facility,
    urgency: body.urgency,
    coverage: body.coverage,
    current: body.current,
    radius: body.radius === undefined ? undefined : String(body.radius),
    dataset: body.dataset,
  });

  const result = await runEscalation(query);

  return NextResponse.json({
    query: {
      dataset: query.dataset,
      facility: query.facilityId,
      facilityName: result.facilityName,
      urgency: query.urgency,
      maxRadiusKm: query.maxRadiusKm,
      currentHospitalId: query.currentHospitalId,
    },
    currentHospital: result.currentHospital,
    currentStatus: result.currentStatus,
    assessment: result.assessment,
    alternatives: result.alternatives.map((alternative) => ({
      hospitalId: alternative.hospitalId,
      name: alternative.name,
      area: alternative.area,
      facilityStatus: alternative.facilityStatus,
      insurance: alternative.insurance,
      distanceKm: alternative.distanceKm,
      tier: alternative.tier,
      score: Number(alternative.score.toFixed(4)),
      reasons: alternative.reasons,
    })),
    safety: result.safety,
    disclaimer:
      "Information support only. Not medical advice, and not a statement that any hospital will admit or treat any individual.",
  });
}
