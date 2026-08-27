/**
 * Claim guidance content.
 *
 * This is general information about how health insurance claims are usually
 * handled in India. It is not tied to any insurer, and it is not a guarantee:
 * timelines, forms and document lists vary by insurer and by policy, and the
 * wording in your own policy is what governs your claim.
 */

export interface ClaimStep {
  title: string;
  detail: string;
}

export interface ClaimStage {
  stage: string;
  steps: ClaimStep[];
}

export interface ClaimRoute {
  id: string;
  name: string;
  summary: string;
  bestFor: string;
  moneyFlow: string;
  stages: ClaimStage[];
}

export const CLAIM_ROUTES: ClaimRoute[] = [
  {
    id: "cashless",
    name: "Cashless claim",
    summary:
      "The insurer settles the covered part of the bill directly with the hospital, so you pay only what is not covered.",
    bestFor:
      "Treatment at a hospital your insurer already has an arrangement with.",
    moneyFlow: "You pay only the uncovered part, at discharge.",
    stages: [
      {
        stage: "Before admission",
        steps: [
          {
            title: "Check the hospital is in network for your policy",
            detail:
              "Cashless only works at hospitals your insurer has an arrangement with, and lists change. Confirm with the insurer or your TPA rather than relying on signage at the hospital.",
          },
          {
            title: "Go to the hospital's insurance or TPA desk",
            detail:
              "Every network hospital has one. They complete the medical part of the pre-authorisation form; you complete the policy part.",
          },
          {
            title: "Send pre-authorisation in good time",
            detail:
              "For planned treatment insurers usually want a few days' notice. For an emergency, it is normally sent within 24 hours of admission. Check the window your own policy sets.",
          },
        ],
      },
      {
        stage: "During the hospital stay",
        steps: [
          {
            title: "Read the approval, including the amount",
            detail:
              "Approval often comes for less than was requested and can be raised later as treatment continues. Ask the desk for a copy of every approval letter.",
          },
          {
            title: "Check the room against your room rent limit",
            detail:
              "If you take a costlier room than the policy allows, many policies also reduce other treatment charges in the same proportion — which can cost far more than the room upgrade itself.",
          },
          {
            title: "Keep every bill and report anyway",
            detail:
              "If the cashless request is declined partway through, the claim becomes a reimbursement claim and you will need the original documents.",
          },
        ],
      },
      {
        stage: "At discharge",
        steps: [
          {
            title: "Expect to pay the uncovered part yourself",
            detail:
              "Non-medical items, consumables and anything above the approved amount are settled by you at the counter before you leave.",
          },
          {
            title: "Collect the settlement breakdown",
            detail:
              "Ask for the final bill, the discharge summary, and the statement showing what the insurer paid, what was disallowed, and why.",
          },
        ],
      },
    ],
  },
  {
    id: "reimbursement",
    name: "Reimbursement claim",
    summary:
      "You pay the hospital yourself and then claim the covered part back from the insurer afterwards.",
    bestFor:
      "Treatment outside the network, or when cashless was not approved in time.",
    moneyFlow: "You pay the full bill first, and are repaid later.",
    stages: [
      {
        stage: "Before admission",
        steps: [
          {
            title: "Tell your insurer anyway",
            detail:
              "Most policies require you to inform the insurer within a set window even when you are paying yourself — often within 24 hours for an emergency, and before a planned admission. Missing it is a common reason claims are rejected.",
          },
          {
            title: "Ask what documents they will want",
            detail:
              "Getting the list at the start is far easier than going back to the hospital weeks later for a document you did not know you needed.",
          },
        ],
      },
      {
        stage: "During the hospital stay",
        steps: [
          {
            title: "Ask for itemised bills, not a lump sum",
            detail:
              "Insurers assess line by line. A single total with no breakdown will usually be sent back for details.",
          },
          {
            title: "Keep everything in one place",
            detail:
              "Prescriptions, pharmacy bills, test reports and payment receipts all form part of the claim, including the small ones.",
          },
        ],
      },
      {
        stage: "At discharge",
        steps: [
          {
            title: "Collect the originals before you leave",
            detail:
              "The discharge summary, itemised final bill, payment receipts, investigation reports, and for any implant its invoice and sticker. Hospitals can be slow to reissue these later.",
          },
        ],
      },
      {
        stage: "After discharge",
        steps: [
          {
            title: "Submit within the policy's time limit",
            detail:
              "Policies set a deadline for submitting a reimbursement claim after discharge — commonly a few weeks. Check yours, because a late claim can be declined on that ground alone.",
          },
          {
            title: "Answer queries quickly",
            detail:
              "Insurers often come back asking for one more document. Claims usually stall at this step rather than being refused outright.",
          },
          {
            title: "If part of it is rejected, ask for the reason in writing",
            detail:
              "You can ask the insurer to reconsider, and every insurer is required to have a grievance process you can escalate to.",
          },
        ],
      },
    ],
  },
];

export const COMMON_DOCUMENTS: string[] = [
  "Completed claim form, signed",
  "Policy number, and a copy of the policy if asked",
  "Government photo ID of the patient",
  "The doctor's advice for admission",
  "Discharge summary",
  "Itemised final bill",
  "Payment receipts",
  "Investigation and test reports",
  "Prescriptions and pharmacy bills",
  "Invoice and sticker for any implant used",
  "Police report, for an accident, where the hospital or insurer asks for one",
  "Bank details for the payment",
];

export const THINGS_TO_VERIFY: string[] = [
  "Whether the hospital is in network for your specific policy, not just for the insurer",
  "Your room rent limit, before you accept a room",
  "Whether the waiting period for your condition has finished",
  "Whether your procedure has its own sub-limit",
  "Your co-payment percentage, if the policy has one",
  "Which items on the bill count as non-medical and are never paid",
  "The deadlines for informing the insurer and for submitting the claim",
];

export interface ClaimMistake {
  mistake: string;
  why: string;
}

export const COMMON_MISTAKES: ClaimMistake[] = [
  {
    mistake: "Assuming a hospital is in network because it is well known",
    why: "Network status is per insurer and changes over time. Confirm it for your policy before admission if you can.",
  },
  {
    mistake: "Taking a better room than the policy allows",
    why: "Beyond the room charge itself, many policies then cut other treatment charges in the same proportion.",
  },
  {
    mistake: "Missing the window for informing the insurer",
    why: "Late intimation is one of the most common grounds for rejecting an otherwise valid claim.",
  },
  {
    mistake: "Handing over all original documents without keeping copies",
    why: "You may need them again if the claim is queried, or if a second policy also has to be claimed against.",
  },
  {
    mistake: "Treating a cashless approval as the final amount",
    why: "The approved figure can change during treatment, and the balance is yours to pay at discharge.",
  },
  {
    mistake: "Not declaring an existing condition when buying the policy",
    why: "It is a frequent reason claims are refused years later, when the policy is otherwise perfectly valid.",
  },
];
