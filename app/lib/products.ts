/**
 * Reads for insurance products.
 *
 * Two distinct datasets, never mixed in one list:
 *  - REAL products from the IRDAI database: facts and a link to the actual
 *    policy wording. No coverage figures, because we do not copy those.
 *  - DEMO policies: invented teaching examples that carry figures so the
 *    coverage estimator has something to work through.
 */

import { POLICIES, type Policy } from "@/app/data/demo/policies";
import {
  INSURERS,
  REAL_PRODUCTS,
  type Insurer,
  type InsuranceProduct,
  type InsurerId,
} from "@/app/data/real/products";

/* ------------------------------ real products ----------------------------- */

export interface ProductRecord extends InsuranceProduct {
  insurer: Insurer;
}

function withInsurer(product: InsuranceProduct): ProductRecord {
  return { ...product, insurer: INSURERS[product.insurerId] };
}

export type InsurerFilter = "any" | InsurerId;

export const INSURER_OPTIONS: { value: InsurerFilter; label: string }[] = [
  { value: "any", label: "All insurers" },
  ...Object.values(INSURERS)
    .sort((a, b) => a.name.localeCompare(b.name, "en"))
    .map((insurer) => ({ value: insurer.id as InsurerFilter, label: insurer.name })),
];

type SearchParams = Record<string, string | string[] | undefined>;

export function parseInsurerFilter(params: SearchParams): InsurerFilter {
  const raw = Array.isArray(params.insurer) ? params.insurer[0] : params.insurer;
  return raw && raw in INSURERS ? (raw as InsurerId) : "any";
}

export async function listProducts(
  insurer: InsurerFilter = "any",
): Promise<ProductRecord[]> {
  return REAL_PRODUCTS.filter(
    (product) => insurer === "any" || product.insurerId === insurer,
  )
    .map(withInsurer)
    .sort(
      (a, b) =>
        a.insurer.name.localeCompare(b.insurer.name, "en") ||
        a.productName.localeCompare(b.productName, "en"),
    );
}

export async function getProduct(id: string): Promise<ProductRecord | null> {
  const product = REAL_PRODUCTS.find((entry) => entry.id === id);
  return product ? withInsurer(product) : null;
}

export async function listProductIds(): Promise<string[]> {
  return REAL_PRODUCTS.map((product) => product.id);
}

export const TOTAL_REAL_PRODUCTS = REAL_PRODUCTS.length;
export const TOTAL_REAL_INSURERS = Object.keys(INSURERS).length;

/** How many records are missing IRDAI's product-type label, for transparency. */
export const PRODUCTS_MISSING_TYPE_LABEL = REAL_PRODUCTS.filter(
  (product) => product.irdaiProductTypeLabel === null,
).length;

/* ------------------------------ demo policies ----------------------------- */

export async function listDemoPolicies(): Promise<Policy[]> {
  return [...POLICIES].sort((a, b) => a.sumInsured - b.sumInsured);
}

export async function getDemoPolicy(id: string): Promise<Policy | null> {
  return POLICIES.find((policy) => policy.id === id) ?? null;
}

export async function listDemoPolicyIds(): Promise<string[]> {
  return POLICIES.map((policy) => policy.id);
}

export const TOTAL_DEMO_POLICIES = POLICIES.length;
