/**
 * GET /api/facilities
 *
 * The facility catalogue, so callers never hard-code the list. This is the
 * same array the picker and the ranking service read.
 */

import { NextResponse } from "next/server";

import { FACILITIES } from "@/app/data/facilities";

export async function GET() {
  return NextResponse.json({ facilities: FACILITIES });
}
