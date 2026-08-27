/**
 * DEMO INSURERS.
 *
 * These are not real insurance companies. They exist so the prototype can show
 * how hospital listings and policies relate to each other without naming any
 * real insurer, which would imply information we have not verified.
 */

export type DemoInsurerId = "demo-a" | "demo-b" | "demo-c";

export interface Insurer {
  id: DemoInsurerId;
  name: string;
}

export const INSURERS: Insurer[] = [
  { id: "demo-a", name: "Demo Health Insurance A" },
  { id: "demo-b", name: "Demo Health Insurance B" },
  { id: "demo-c", name: "Demo Health Insurance C" },
];

export function insurerName(id: DemoInsurerId): string {
  return INSURERS.find((insurer) => insurer.id === id)?.name ?? "Unknown insurer";
}
