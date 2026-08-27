# InsureGuide

Plain-English health insurance guidance for Chennai and Tamil Nadu.

People usually meet insurance information when they are stressed, confused, or
already standing at a hospital desk. InsureGuide's job is to explain what a
policy means and what to do next, without friction and without an account.

## The data rule this project is built around

Every record carries **where it came from** and **how far it can be trusted**.
There are four labels, and they are stored with the record, not applied by the
UI:

| Label | Means |
| --- | --- |
| `verified` | Checked against an official source on a stated date. |
| `source-provided` | From a named, linked source, not independently confirmed. |
| `not-verified` | Nobody has checked this, or we simply do not know. |
| `demo` | Invented for teaching. Describes nothing real. |

Two rules follow from this and are not negotiable:

**A missing fact is never filled in.** If a street address or an emergency
department could not be confirmed, the field stays `null` and renders as
"Not verified". Unknown never means "no".

**Product existence and hospital network status are separate facts.** A policy
being listed by IRDAI says nothing about whether a hospital accepts it. They
live in different modules (`real/products.ts` and `real/relationships.ts`) so
one can never be inferred from the other. A relationship is only recorded when
an official source establishes it — today that is government scheme
empanelment, and nothing else.

## Where the data comes from

| Source | Publisher | Used for |
| --- | --- | --- |
| [IRDAI Health Insurance Products](https://irdai.gov.in/health-insurance-products) | Insurance Regulatory and Development Authority of India | Product name, UIN, approval date, policy document |
| [CMCHIS empanelled hospital list](https://www.cmchistn.com/empanelment/hospital-list) | Government of Tamil Nadu | Which Chennai hospitals exist and are empanelled |
| Hospital official websites | The hospitals themselves | Emergency cover and official URLs, where confirmed |

Directories, review sites, aggregators and blogs are not used for factual
records.

Policy coverage figures — sum insured, room rent limits, waiting periods,
co-payment, exclusions — are **deliberately not copied** into this app. They
live in the policy wording and insurers revise them. Each product links to the
document IRDAI holds for that UIN instead.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build     # production build
npm run lint      # eslint
npx tsc --noEmit  # type check
```

## Routes

| Route | What it does |
| --- | --- |
| `/` | Home; the five things you can do |
| `/hospitals` | Real Chennai hospitals — filter by name, area, ownership, confirmed emergency |
| `/hospitals/[id]` | One hospital, field by field, each with its own source |
| `/insurance` | Real IRDAI-listed products |
| `/insurance/[id]` | One product: UIN, approval date, link to the policy wording |
| `/demo-policies` | Invented teaching examples, badged DEMO DATA |
| `/demo-policies/[id]` | One worked example, with figures the estimator can use |
| `/understand-policy` | What the terms mean; policy upload is not built yet |
| `/coverage-estimator` | Illustrative calculator for what a policy might pay |
| `/claims` | Cashless and reimbursement claims, step by step |
| `/hospital-help` | Urgent help at the hospital — not built yet |
| `/trust` | Sources, labels, and what remains unverified |

## How the code is organised

```
app/
  components/   Presentation only. No data access, no business rules.
  data/
    provenance.ts   The four labels, Provenance, and Fact<T>
    sources.ts      The registry of sources we are allowed to cite
    real/           Verified records: hospitals, products, relationships
    demo/           Invented teaching data, kept apart from real records
  lib/          Everything the UI is not allowed to know:
                  hospitals.ts  reading, filtering, joining relationships
                  products.ts   real products and demo policies
                  coverage.ts   estimator arithmetic (pure, no React)
                  format.ts     rupee and date formatting
```

**Pages never read `app/data` directly for lists.** They call `app/lib`, whose
read functions are `async` and take a query object even though the data is
currently a local array. Moving to a database or an API should mean changing
`app/lib` and nothing else.

**No record is displayed without its provenance.** `ProvenanceNote` and
`FactRow` render it, and `VerificationBadge` is the only place a status becomes
a visible label — so the same fact cannot read VERIFIED in a list and
NOT VERIFIED on a detail page.

## Conventions

- TypeScript throughout; `PageProps<'/route'>` for route params and search params.
- Tailwind v4. One focus treatment, `.focus-ring`, defined in `app/globals.css`.
- Server Components by default. The only client components are the coverage
  estimator and the header nav.
- Filters are plain `GET` forms, so they apply on Search, the URL is shareable,
  the back button works, and the page still functions without JavaScript.

## Honesty rules

These are product requirements, not style preferences:

- Nothing is marked verified because it looks plausible.
- The app never says a hospital accepts an insurer, that treatment will be
  cashless, or that a claim will be approved.
- Estimates are described as estimates, with their assumptions shown.
- Features that are not built say so plainly rather than being mocked up.
- Invented data is labelled DEMO DATA on every screen it appears on.
