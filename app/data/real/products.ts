/**
 * REAL health insurance products, from the IRDAI Health Insurance Products
 * database. Collected 2026-08-27 from https://irdai.gov.in/health-insurance-products
 *
 * Each record was read directly from the regulator's own table, and only kept
 * when the policy document IRDAI hosts is named after the same UIN — a
 * self-consistency check, because a few rows in that table link to a document
 * belonging to a different product.
 *
 * WHAT IS NOT HERE, ON PURPOSE: sum insured, room rent limits, waiting periods,
 * co-payment, exclusions. Those live in the policy wording, they are revised,
 * and copying them into an app is how people end up relying on a stale figure.
 * Every record links to the actual policy document instead.
 *
 * A product being approved by IRDAI means the regulator cleared it to be sold.
 * It does not mean it is currently on sale, that it suits you, or that any
 * hospital accepts it.
 */

import type { Provenance } from "@/app/data/provenance";

export const IRDAI_COLLECTED_ON = "2026-08-27";

export type InsurerId =
  | "star-health"
  | "niva-bupa"
  | "manipalcigna"
  | "aditya-birla-health"
  | "care-health"
  | "hdfc-ergo"
  | "bajaj-allianz"
  | "icici-lombard"
  | "navi-general"
  | "national-insurance";

export interface Insurer {
  id: InsurerId;
  /** As IRDAI publishes it. Spellings vary between rows; this is canonical. */
  name: string;
  /** Standalone health insurer, or a general insurer that also sells health. */
  category: "Standalone health insurer" | "General insurer";
}

export const INSURERS: Record<InsurerId, Insurer> = {
  "star-health": {
    id: "star-health",
    name: "Star Health & Allied Insurance Co. Ltd.",
    category: "Standalone health insurer",
  },
  "niva-bupa": {
    id: "niva-bupa",
    name: "Niva Bupa Health Insurance Co. Ltd.",
    category: "Standalone health insurer",
  },
  manipalcigna: {
    id: "manipalcigna",
    name: "ManipalCigna Health Insurance Co. Ltd.",
    category: "Standalone health insurer",
  },
  "aditya-birla-health": {
    id: "aditya-birla-health",
    name: "Aditya Birla Health Insurance Co. Ltd.",
    category: "Standalone health insurer",
  },
  "care-health": {
    id: "care-health",
    name: "Care Health Insurance Ltd.",
    category: "Standalone health insurer",
  },
  "hdfc-ergo": {
    id: "hdfc-ergo",
    name: "HDFC ERGO General Insurance Co. Ltd.",
    category: "General insurer",
  },
  "bajaj-allianz": {
    id: "bajaj-allianz",
    name: "Bajaj Allianz General Insurance Co. Ltd.",
    category: "General insurer",
  },
  "icici-lombard": {
    id: "icici-lombard",
    name: "ICICI Lombard GIC Ltd.",
    category: "General insurer",
  },
  "navi-general": {
    id: "navi-general",
    name: "Navi General Insurance Ltd.",
    category: "General insurer",
  },
  "national-insurance": {
    id: "national-insurance",
    name: "National Insurance Co. Ltd.",
    category: "General insurer",
  },
};

export interface InsuranceProduct {
  id: string;
  insurerId: InsurerId;
  /** Product name exactly as IRDAI publishes it. */
  productName: string;
  /** Unique Identification Number allotted by IRDAI. */
  uin: string;
  /** IRDAI's own "Type of Product" label. Null where we did not capture it. */
  irdaiProductTypeLabel: string | null;
  /** IRDAI's recorded date of approval, as published (DD-MM-YYYY). */
  approvalDate: string;
  /** Financial year of the filing, as published. Null where not captured. */
  financialYear: string | null;
  /** The policy document IRDAI hosts for this UIN. */
  policyDocumentUrl: string;
  provenance: Provenance;
}

function irdai(uin: string): Provenance {
  return {
    status: "verified",
    sourceId: "irdai-health-products",
    sourceUrl: "https://irdai.gov.in/health-insurance-products",
    lastVerified: IRDAI_COLLECTED_ON,
    note: `Read from IRDAI's Health Insurance Products table. The policy document IRDAI hosts for this record is named after ${uin}, matching the UIN in the same row.`,
  };
}

interface Seed {
  id: string;
  insurerId: InsurerId;
  productName: string;
  uin: string;
  irdaiProductTypeLabel: string | null;
  approvalDate: string;
  financialYear: string | null;
  policyDocumentUrl: string;
}

const SEEDS: Seed[] = [
  {
    id: "star-comprehensive-insurance-policy",
    insurerId: "star-health",
    productName: "Star Comprehensive Insurance Policy",
    uin: "SHAHLIP22028V072122",
    irdaiProductTypeLabel: "Revision",
    approvalDate: "31-05-2021",
    financialYear: "2021-2022",
    policyDocumentUrl:
      "https://irdai.gov.in/documents/37343/931203/SHAHLIP22028V072122_HEALTH2050.pdf/70aade12-d528-1155-a8b7-c03d2cfecd15",
  },
  {
    id: "family-health-optima-insurance-plan",
    insurerId: "star-health",
    productName: "Family Health Optima Insurance Plan",
    uin: "SHAHLIP22030V062122",
    irdaiProductTypeLabel: null,
    approvalDate: "31-05-2021",
    financialYear: null,
    policyDocumentUrl:
      "https://irdai.gov.in/documents/37343/931203/SHAHLIP22030V062122_HEALTH2052.pdf/1656a56f-10ec-f930-2175-146470c26773",
  },
  {
    id: "arogya-sanjeevani-star-health",
    insurerId: "star-health",
    productName: "Arogya Sanjeevani Policy, Star Health and Allied Insurance Co Ltd.",
    uin: "SHAHLIP22027V032122",
    irdaiProductTypeLabel: "Revision",
    approvalDate: "31-05-2021",
    financialYear: null,
    policyDocumentUrl:
      "https://irdai.gov.in/documents/37343/931203/SHAHLIP22027V032122_HEALTH2049.pdf/f4d863fa-cd41-e55d-d747-d2ff2d88d060",
  },
  {
    id: "arogya-sanjeevani-niva-bupa",
    insurerId: "niva-bupa",
    productName: "Arogya Sanjeevani, Niva Bupa Health Insurance Co. Ltd.",
    uin: "NBHHLIP22151V012122",
    irdaiProductTypeLabel: "Revision",
    approvalDate: "24-08-2021",
    financialYear: null,
    policyDocumentUrl:
      "https://irdai.gov.in/documents/37343/931203/NBHHLIP22151V012122_HEALTH2134.pdf/ddc465e4-2012-c8bf-c582-7463e0c75c74",
  },
  {
    id: "manipalcigna-prohealth-insurance",
    insurerId: "manipalcigna",
    productName: "ManipalCigna ProHealth Insurance",
    uin: "MCIHLIP22211V062122",
    irdaiProductTypeLabel: null,
    approvalDate: "11-02-2022",
    financialYear: null,
    policyDocumentUrl:
      "https://irdai.gov.in/documents/37343/931203/MCIHLIP22211V062122.pdf/b3a179da-4a2e-b4f2-27db-11779ec9a3cf",
  },
  {
    id: "manipalcigna-prohealth-prime",
    insurerId: "manipalcigna",
    productName: "ManipalCigna ProHealth Prime",
    uin: "MCIHLIP22224V012122",
    irdaiProductTypeLabel: null,
    approvalDate: "09-03-2022",
    financialYear: null,
    policyDocumentUrl:
      "https://irdai.gov.in/documents/37343/931203/MCIHLIP22224V012122.pdf/6cf0a1af-1bc8-0c09-531a-671e15963135",
  },
  {
    id: "activ-health",
    insurerId: "aditya-birla-health",
    productName: "Activ Health",
    uin: "ADIHLIP21574V032021",
    irdaiProductTypeLabel: "Revision",
    approvalDate: "01-08-2021",
    financialYear: "2020-2021",
    policyDocumentUrl:
      "https://irdai.gov.in/documents/37343/931203/ADIHLIP21574V032021_2020-2021.pdf/0b0783bb-0000-9a96-54b3-729f4cc5974d",
  },
  {
    id: "care-freedom",
    insurerId: "care-health",
    productName: "Care Freedom",
    uin: "RHIHLIP21519V022021",
    irdaiProductTypeLabel: null,
    approvalDate: "30-09-2020",
    financialYear: null,
    policyDocumentUrl:
      "https://irdai.gov.in/documents/37343/931203/RHIHLIP21519V022021_2020-2021.pdf/312ebe2a-6229-6754-48bf-bf7aea1c8931",
  },
  {
    id: "my-optima-secure",
    insurerId: "hdfc-ergo",
    productName: "my: Optima Secure",
    uin: "HDFHLIP21016V012122",
    irdaiProductTypeLabel: "Individual",
    approvalDate: "12-05-2021",
    financialYear: "2021-2022",
    policyDocumentUrl:
      "https://irdai.gov.in/documents/37343/931203/HDFHLIP21016V012122_HEALTH2015.pdf/4fbd60f7-de9c-ab82-13ff-1d71b1458e4a",
  },
  {
    id: "easy-health",
    insurerId: "hdfc-ergo",
    productName: "Easy Health",
    uin: "HDFHLIP23024V072223",
    irdaiProductTypeLabel: "Revision",
    approvalDate: "20-05-2022",
    financialYear: "2022-2023",
    policyDocumentUrl:
      "https://irdai.gov.in/documents/37343/931203/HDFHLIP23024V072223.pdf/4bb864b2-c358-cde0-9230-9ae57c2097cd",
  },
  {
    id: "health-guard",
    insurerId: "bajaj-allianz",
    productName: "Health Guard",
    uin: "BAJHLIP21227V042021",
    irdaiProductTypeLabel: "Revision",
    approvalDate: "09-07-2020",
    financialYear: "2020-2021",
    policyDocumentUrl:
      "https://irdai.gov.in/documents/37343/931203/BAJHLIP21227V042021_2020-2021.pdf/64022b8d-b6cc-2e14-1951-4078c1044501",
  },
  {
    id: "global-health-care",
    insurerId: "bajaj-allianz",
    productName: "Global Health Care",
    uin: "BAJHLIP23020V012223",
    irdaiProductTypeLabel: "Individual",
    approvalDate: "06-05-2022",
    financialYear: "2022-2023",
    policyDocumentUrl:
      "https://irdai.gov.in/documents/37343/931203/BAJHLIP23020V012223.pdf/fc18c97a-baf7-336e-bd80-e637b32dcb7d",
  },
  {
    id: "golden-shield",
    insurerId: "icici-lombard",
    productName: "Golden Shield",
    uin: "ICIHLIP22012V012223",
    irdaiProductTypeLabel: "Individual",
    approvalDate: "12-04-2022",
    financialYear: "2022-2023",
    policyDocumentUrl:
      "https://irdai.gov.in/documents/37343/931203/ICIHLIP22012V012223.pdf/d258f1bb-a90d-5f13-c8bb-c0317ffae28b",
  },
  {
    id: "navi-smart-health",
    insurerId: "navi-general",
    productName: "Navi Smart Health",
    uin: "NAVHLIP23003V012223",
    irdaiProductTypeLabel: "Individual",
    approvalDate: "01-04-2022",
    financialYear: "2022-2023",
    policyDocumentUrl:
      "https://irdai.gov.in/documents/37343/931203/NAVHLIP23003V012223.pdf/9577514a-6bf3-b51e-5a54-5e7f050e2550",
  },
  {
    id: "national-mediclaim-policy",
    insurerId: "national-insurance",
    productName: "National Mediclaim Policy",
    uin: "NICHLIP21049V032021",
    irdaiProductTypeLabel: null,
    approvalDate: "06-05-2020",
    financialYear: null,
    policyDocumentUrl:
      "https://irdai.gov.in/documents/37343/931203/NICHLIP21049V032021_2020-2021.pdf/e25e5c70-844d-c6b7-088d-e1ce3261de34",
  },
  {
    id: "national-senior-citizen-mediclaim-policy",
    insurerId: "national-insurance",
    productName: "National Senior Citizen Mediclaim Policy",
    uin: "NICHLIP21083V022021",
    irdaiProductTypeLabel: null,
    approvalDate: "07-09-2020",
    financialYear: null,
    policyDocumentUrl:
      "https://irdai.gov.in/documents/37343/931203/NICHLIP21083V022021_2020-2021.pdf/5b930ff3-569a-b0e4-327b-e8b8af8d0469",
  },
];

export const REAL_PRODUCTS: InsuranceProduct[] = SEEDS.map((seed) => ({
  ...seed,
  provenance: irdai(seed.uin),
}));

export function insurerFor(product: InsuranceProduct): Insurer {
  return INSURERS[product.insurerId];
}
