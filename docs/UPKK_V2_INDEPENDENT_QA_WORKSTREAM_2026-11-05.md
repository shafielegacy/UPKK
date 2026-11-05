# UPKK V2 — Independent QA Workstream (5 November 2026)

**Scope:** Read-only code audit + next QA test matrix independent of founder's unsettled RM50/RM100 registration policy.  
**Branch:** `feature/native-ebayar-12bulan-qa`  
**Baseline:** `2169ed2b06e34882deff91151faf1232b158054a`  
**Status:** Audit findings only. No runtime test performed in this audit. **NO-GO LIVE.**

## Verified by source inspection

1. `NativeEbayar.gs` `nePaymentYear_` excludes 2026 months earlier than December and future billing months using Kuala Lumpur clock. `submitNativeEbayar` additionally blocks 2026 submission until the founder decision, so **Dec 2026 submission is not yet testable as an actual transaction**.
2. Parent monthly submission requires an authenticated guardian session and owned, approved child, validates an eligible period and amount, checks an existing PENDING/SELESAI record under a script lock, saves a private evidence file, and appends a PENDING transaction in `NATIVE_EBAYAR`.
3. `decideNativeEbayarAdmin` requires Admin authentication, script lock, unique request ID, PENDING status, exact amount on approval, and rejects a second SELESAI record for the same child/month/year. Rejection requires a reason. Receipt fields M and Q are not generated during this step.
4. The existing Part 8A record reports **15/15 isolated mock tests PASS**, not real GAS BACKUP integration. There is no basis to upgrade these to production PASS.
5. `AdminV2.gs` and `NativeEbayar.gs` enforce QA spreadsheet IDs and flags. Deploying these files directly to the official workbook will fail closed; an explicitly reviewed environment configuration is required.
6. **Monthly AutoCrat receipt job is not implemented**. Approval alone is not proof of a PDF or an email.
7. `AdminV2.gs` checks Admin identity against a workbook PASSWORD field; this deserves a separate authentication/security review before LIVE. No credential values were copied into this report.

## Targeted follow-up tests (safe and policy-independent)

| ID | Area | Test | Current status |
|---|---|---|---|
| A1 | Admin access | Non-admin/expired token cannot list or decide payment | Mock PASS in Part 8A; actual GAS NOT VERIFIED |
| A2 | Integrity | Invalid amount, duplicate approval, stale decision, duplicated request ID | Mock PASS in Part 8A; actual GAS NOT VERIFIED |
| A3 | Parent ownership | Parent A cannot quote/submit/retrieve Parent B child | NOT VERIFIED |
| A4 | Period gate | Nov 2026 and future-month submissions rejected | CODE VERIFIED; runtime NOT VERIFIED |
| A5 | Concurrency | Two simultaneous submissions/approvals cannot settle same child-month twice | NOT VERIFIED |
| A6 | Private files | JPEG/PNG/PDF validation; no cross-parent slip/PDF visibility | CODE PARTIAL; real Drive NOT VERIFIED |
| A7 | Error recovery | Drive created but sheet append fails; retry behaviour and orphan file handling | NOT VERIFIED |
| A8 | Admin UI | Browser QA for pending/approve/reject and status refresh in copied GAS /dev | NOT VERIFIED |
| R1 | Monthly receipt | Stable serial assignment once per settled child-month-year | NOT IMPLEMENTED |
| R2 | Monthly AutoCrat | Generate PDF only after SELESAI, store private link, avoid duplicate merge/email | NOT IMPLEMENTED |
| R3 | Retry | Failed merge retries without changing serial; failures visible separately | NOT IMPLEMENTED |
| R4 | Registration AutoCrat | Controlled BACKUP time trigger (eligible + ineligible row), dedup email | NOT VERIFIED |

## Specific design warnings

- Distinguish payment state (`PENDING`, `SELESAI`, `REJECTED`) from PDF generation state (`menunggu`, `siap`, `gagal`); do not claim receipt ready when Admin merely approves.
- Current pending write creates a Drive file before append. Its catch block deliberately returns an uncertain-write warning if append/flush began. Test reconciliation, and do not instruct parents to resubmit until reconciliation is complete.
- Never mark the registration-credit month SELESAI by guessing from the registration timestamp or total payment amount; its allocation is **HOLD** until founder confirmation.
- Before implementation, define receipt serial scope, storage columns, AutoCrat conditions, and safe failure reprocessing without re-merging V1 historical receipts.
- Verify owner-controlled workbook formulas, 2026 legacy month tabs, and V1 receipt series remain unchanged.

## Work sequence

1. Keep registration fee allocation policy **HOLD** and retain current QA guards.
2. Design monthly receipt ledger/idempotent serial + state machine with fake Sheets/Drive/AutoCrat adapter. No triggers and no real recipients.
3. Implement mock-only receipt tests; require zero duplicate serial/PDF/email on retries.
4. Run security negative tests for Admin and guardian isolation.
5. Only with a separately authorised BACKUP QA session, run real GAS /dev Admin, Drive permissions and controlled AutoCrat trigger smoke tests.
6. Reconcile all findings into release checklist; request founder policy signoff before touching registration-credit logic or permitting December submissions.

## Safety and completion

**Performed:** repository-source inspection and QA planning only.  
**Not performed:** local execution, real GAS/Drive/Sheets interaction, trigger changes, deployment, PR, merge, or LIVE mutation.  
**Decision:** HOLD deployment; preserve `master`, production GAS, production Sheets and existing AutoCrat.
