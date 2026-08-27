/**
 * Plain-English explanations of the terms that decide how much a health
 * insurance claim actually pays. These describe how the terms are generally
 * used in India; your own policy wording always takes precedence.
 */

export interface GlossaryTerm {
  id: string;
  term: string;
  /** One sentence a person with no insurance background can follow. */
  plainEnglish: string;
  whyItMatters: string;
  example: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    id: "sum-insured",
    term: "Sum insured",
    plainEnglish:
      "The most your policy will pay in a policy year, added up across all claims.",
    whyItMatters:
      "It is the ceiling on everything else. Once it is used up, you pay the rest yourself until the policy renews.",
    example:
      "With a sum insured of ₹5,00,000, a ₹6,00,000 bill leaves at least ₹1,00,000 for you to pay.",
  },
  {
    id: "room-rent-limit",
    term: "Room rent limit",
    plainEnglish:
      "The most your policy will pay per day for your hospital room.",
    whyItMatters:
      "This is the term that surprises people most. If you take a costlier room, many policies also cut other treatment charges in the same proportion — so a small room upgrade can reduce the whole claim.",
    example:
      "If your limit is ₹5,000 a day and you take a ₹10,000 room, the policy may pay only half of many other charges too.",
  },
  {
    id: "co-payment",
    term: "Co-payment",
    plainEnglish:
      "A fixed share of every approved claim that you pay, written as a percentage.",
    whyItMatters:
      "It applies even when the claim is fully approved and you are well inside your sum insured. It is common on senior citizen plans.",
    example:
      "With a 20% co-payment on an approved claim of ₹1,00,000, you pay ₹20,000 and the insurer pays ₹80,000.",
  },
  {
    id: "deductible",
    term: "Deductible",
    plainEnglish:
      "An amount you pay first, before the policy starts paying anything at all.",
    whyItMatters:
      "Top-up policies are built around a large deductible, so they only help with bills above that figure. Small bills are entirely yours.",
    example:
      "With a ₹5,00,000 deductible, a ₹4,00,000 bill is paid entirely by you. The policy only helps beyond ₹5,00,000.",
  },
  {
    id: "waiting-period",
    term: "Waiting period",
    plainEnglish:
      "A stretch of time after buying the policy during which certain treatment is not covered.",
    whyItMatters:
      "A perfectly valid policy can still decline a claim simply because the waiting period for that condition has not finished.",
    example:
      "A 36-month waiting period on conditions you already had means a claim for one of them in year two would usually be declined.",
  },
  {
    id: "pre-existing-condition",
    term: "Pre-existing condition",
    plainEnglish:
      "A health condition you already had before the policy started.",
    whyItMatters:
      "These carry the longest waiting periods, and not disclosing one when you buy the policy is a common reason claims are rejected later.",
    example:
      "Diabetes diagnosed before you bought the policy is normally treated as pre-existing.",
  },
  {
    id: "exclusions",
    term: "Exclusions",
    plainEnglish:
      "Treatments and costs the policy never pays for, however the claim is made.",
    whyItMatters:
      "Exclusions are absolute. No waiting period passes and no approval process changes them.",
    example:
      "Cosmetic treatment and most outpatient consultations are commonly excluded.",
  },
  {
    id: "sub-limits",
    term: "Sub-limits",
    plainEnglish:
      "Caps on particular items inside the policy, separate from the overall sum insured.",
    whyItMatters:
      "A large sum insured does not help if the specific procedure you need has its own much smaller cap.",
    example:
      "A policy with a ₹5,00,000 sum insured may still cap cataract surgery at ₹40,000 per eye.",
  },
  {
    id: "network-hospital",
    term: "Network hospital",
    plainEnglish:
      "A hospital that has an arrangement with your insurer to settle bills directly.",
    whyItMatters:
      "Cashless treatment is normally only possible at a network hospital. Elsewhere you usually pay first and claim reimbursement afterwards.",
    example:
      "The same insurer can be in-network at one hospital in your area and not at the one next door.",
  },
];

export function getGlossaryTerm(id: string): GlossaryTerm | undefined {
  return GLOSSARY.find((entry) => entry.id === id);
}
