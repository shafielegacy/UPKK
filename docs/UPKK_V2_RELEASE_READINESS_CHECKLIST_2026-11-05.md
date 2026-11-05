# UPKK V2 — Release Readiness Checklist
> **UPDATE / latest owner QA checkpoint (5 Nov 2026):** Newer than the original planning snapshot below. In GAS BACKUP, user verified **November registration RM50-only**, OTP, Admin approval, AutoCrat time-trigger PDF+email for one test row, authenticated registration receipt lookup, and clickable Nov enrolment card. Current **owner-directed QA** allows blank enrolment end date and Dec+ fee quote RM100 with same-month RM50 credit. The older 4 Nov founder note retains an unresolved Dec/Jan allocation and Dec-31 admissions cutoff; these must be reconciled **with Ustaz in writing before LIVE**. Admin decision browser dialogs were replaced with Premium V2 modal on the QA branch; real click QA pending. **Monthly end-to-end, actual monthly AutoCrat, permission boundary, migration/rollback remain BLOCKING. QA-only monthly serial ledger, read-only AutoCrat preflight and authenticated retrieval source files already exist, but real Google runtime integration is NOT VERIFIED. Overall NO-GO.** See [milestone report](UPKK_V2_MILESTONE_NATIVE_EDAFTAR_2026-11-05.md).  
> **This addendum supersedes only the dated QA status/owner-working assumptions, not the historical text or the outstanding security/finance gates.**

**Prepared:** 5 November 2026  
**Status:** PLANNING / READ-ONLY RELEASE PREPARATION. **NO GO-LIVE AUTHORISATION.**  
**Repo:** `shafielegacy/UPKK`  
**QA branch:** `feature/native-ebayar-12bulan-qa`  
**Target:** readiness for new package from December 2026, subject to owner approval and gates. **No promised deployment date.**

> **Additional QA update (5 Nov, later session):** Admin Premium V2 `Sahkan` and `Tolak` dialogs visually PASS in GAS BACKUP. Admin dummy rejection persisted correctly as `REJECTED 2027` with reason and without a new receipt — BACKUP PASS. New read-only `Semak Status Resit (QA)` Admin control exists in GitHub `index.html`, but no monthly transaction is present and real GAS/browser functionality is NOT VERIFIED. `NATIVE_EBAYAR` on BACKUP currently has A:Q header only, no paid rows, and R:U monthly receipt metadata not yet prepared. QA-only receipt ledger/preflight/retrieval source files do exist on branch and must be separately copied into BACKUP before testing; actual monthly AutoCrat merge remains NOT IMPLEMENTED. See milestone report. **NO-GO LIVE.**

> **Latest ledger QA (5 Nov, subsequent phase):** Owner confirmed R:U receipt metadata headers were created correctly in GAS BACKUP, with no monthly transactions yet. QA branch now contains Admin-only read-only `auditMonthlyReceiptReadinessQa` and a corresponding UI audit control; mocked cases include empty ledger, unsettled status, settled-without-serial, UNCERTAIN, inconsistent READY, missing headers and denied Admin. **Backend/browser GAS audit execution is NOT VERIFIED. No monthly PDF/trigger/email was generated.** See [milestone section 7](UPKK_V2_MILESTONE_NATIVE_EDAFTAR_2026-11-05.md). **NO-GO LIVE.**

## Non-negotiable project boundaries
- [ ] **Preserve the proven V1 flow**: parent login → select child → 12 month cards → status modal → Bayar Sekarang; premium V2 visual design.
- [ ] Preserve all existing 2026 historical data, Google Form responses and receipts, including repeat MyKid in old V1 + one active V2 re-enrolment. No deletion/blanket overwrite of old rows.
- [ ] **One official Google Sheets workbook** for production, separate BACKUP for QA; do not introduce separate per-year workbooks or twelve new monthly transaction tabs.
- [ ] Keep `DAFTAR UPKK` legacy formula owners F/K/L and historical monthly tabs intact, with verified 2027-specific audit/intake columns. `NATIVE_EBAYAR` is the year-aware transaction tab in the same workbook.
- [ ] All QA changes remain isolated until owner explicitly authorises migration and a rollback plan is checked. No developer action against LIVE during this planning exercise.
- [ ] Do not commit credentials, private sheet IDs in public config where avoidable, OTP/PIN, Bot tokens or financial/child PII into GitHub or test reports.

## A. Business policy gates — BLOCKING
- [ ] **Written answer from Ustaz Shafie:** does RM50 first-month component of the RM100 registration settle **Dec 2026 or Jan 2027** when enrolment occurs in Dec 2026? The package begins Dec 2026 and all participants owe RM50 per month, but the credit allocation question is still **unresolved**.
- [ ] Clarify the rule for registration made **before** Dec 2026 and after 1 Jan 2027 (exception admissions only); document any edge cases explicitly rather than inferring from registration date.
- [ ] Implement exactly one monthly credit for the paid RM50, linked to the registration transaction, and prevent an additional monthly charge/receipt for the same payment. Do not retroactively alter historical V1 receipt numbering.
- [ ] Registration receipt displays **RM50 registration + RM50 for the Ustaz-approved month**, total RM100, while keeping the existing green/gold AutoCrat template. Earlier receipts remain unchanged.
- [x] Owner-confirmed basic intake: Year 3/4/5, each 30 Fizikal + 20 Online; ordinary sign-up until 31 Dec 2026, re-enrolment required for all; initial RM100.

## B. Product functionality
- [x] Native eDaftar RM100, OTP, private slip and Admin approval verified in copied GAS/Sheets at least once; approved row 106 had receipt `UPKK-2026-0004`.
- [x] Returning pupil preserved V1 history while a separate V2 enrolment was accepted; parent dashboard displayed child once in owner QA screenshot.
- [x] Parent-facing remaining seats showed 30/20 for T3 and T4, 29/20 for T5; **UI/basic count PASS only**.
- [ ] Verify full physical/online quota boundary 30/20 and two concurrent parents competing for final seat, with synthetic test data; server lock is the authority.
- [ ] Review orphaned/old QA rows lacking AE:AG classification before any production capacity calculation. Do not mistake synthetic BACKUP counts for official availability.
- [x] Registration AutoCrat PDF RM100 and separate parent 'Resit Pendaftaran' button demonstrated in owner QA screenshots; user accepted as PASS/LOCK.
- [ ] Verify PDF access control and actual guardian Google Drive permissions for distinct guardian accounts; never make receipt files public merely to bypass permissions.
- [x] Admin Native monthly review section displayed; Part 8A mock suite **15/15 PASS**, including duplicate settled-payment bug fix.
- [ ] **Real** Native monthly parent PENDING → Admin approve/reject → dashboard status update, repeat/rejected resubmission controls, and reconciliation with authorised month. Dec 2026 stays blocked pending Ustaz; future 2027 payments must not be opened early.
- [ ] Confirm copied GAS BACKUP uses latest patched `NativeEbayar.gs` (duplicate settled-payment guard `i!==index-1`) before real QA.
- [ ] Ensure `SELESAI` means verified funds; PDF receipt has its own `menunggu / siap / gagal` state. Never imply the PDF exists at approval time.

## C. AutoCrat registration and monthly receipts — BLOCKING
- [x] Registration AutoCrat **manual merge** and merge conditions (`APPROVED 2027`, `V2_NO_RESIT NOT NULL`) accepted as QA PASS by owner.
- [ ] Validate job mapping against final production data, **merge status skip**, output columns, stored PDF link, template variable replacements, and safe output folder permission.
- [ ] Run a **controlled time-trigger QA** in BACKUP (minimum displayed schedule: one hour), with one eligible synthetic row, and verify no repeated merge or duplicate email for already processed rows. Document both eligible and ineligible outcomes.
- [ ] Review AutoCrat **To/CC/BCC** mapping: template `<<Email address>>` reads each row. Never activate with real-recipient addresses during broad QA; confirm current sender, no-reply support and actual authorised recipients before production.
- [ ] Registration and monthly AutoCrat jobs must be distinct, with unambiguous merge conditions and separate identifiers. **Monthly AutoCrat job not yet implemented.**
- [ ] Prepare immutable monthly receipt serial allocation, PDF output URL, retrieval inside selected child/month context, retry without changing number, and no double merge/email.
- [ ] Decide controlled support/recovery action for failed AutoCrat runs without accidentally rerunning every past V1/V2 document.
- [ ] Trigger enablement is a separate, explicit LIVE release action after full QA; never assume GAS writing to Sheets fires Google Form/onEdit triggers.

## D. Security / privacy / access — BLOCKING
- [ ] Audit server-side Admin permissions, session expiry, malicious parameter input, repeated decisions, stale tokens, and non-admin denial for every V2 write/read. Existing login uses workbook-backed credentials; assess rate limiting and recovery before LIVE.
- [ ] Audit guardian authentication (email + last 6 phone digits), sibling selection and MyKid ownership on all native endpoints; check impersonation/brute-force exposure and require security signoff for production use.
- [ ] **Do not publish private slip, MyKid, PDF, email or financial data via JSONP/doGet or unrestricted Drive sharing.** Keep sensitive operations behind authenticated `google.script.run`.
- [ ] Verify file validation (JPEG/PNG/PDF, 3 MB, MIME + signature), maximum lengths, private Drive folder access and no unintentional cross-parent download.
- [ ] Confirm QA-only guards that hard-code BACKUP IDs/flags in `NativeEbayar.gs`, `AdminV2.gs` and related modules have an explicit safe **production configuration plan**. A copy-paste to LIVE while QA-only guards remain will fail closed; **never weaken/remove protections by broad search-and-replace**.
- [ ] Verify script owner/execution identity, GAS deployment access, secret properties, Editor privileges, Google Drive sharing and any Form/AutoCrat scopes.
- [ ] Verify yearly transition dates, timezone `Asia/Kuala_Lumpur`, registration deadline 31 Dec 2026 and no accidental opening of 2027 future months.
- [ ] Confirm no credentials, parent details, payment slips or full MyKid appear in client logs, public repository, notifications or screenshots.

## E. Data and configuration migration — BLOCKING
- [ ] Owner confirms exact official production workbook and GAS project; record verified IDs in private operator runbook, **not** a new public repo hard-code or user-visible release note.
- [ ] Take timestamped backup of **official workbook + GAS source/config + AutoCrat job settings/templates/triggers** before any production changes. Verify backup opens and covers relevant legacy monthly tabs and the V2 additions.
- [ ] Compare source/destination tab names, headers, protected formulas, number formats, conditional formatting, dashboard lookups and AutoCrat output columns. Never overwrite populated legacy columns.
- [ ] Verify production private Google Drive folders for registration/eBayar slips and PDF results; separate folders and least-privilege access as necessary.
- [ ] Inventory Script Properties including enrolment enable flag, email-test guard, Admin/Native eBayar flags, approved 2027 fees and folder IDs; explicitly design environment-specific values rather than copying BACKUP properties.
- [ ] Agree date/time and operational downtime/communication, plus named owner/Admin person to approve deployment.
- [ ] Copy reviewed code only after QA → owner signoff → monitored production release. Preserve ability to switch production portal to prior stable code.

## F. Pilot → go/no-go → rollback
- [ ] Pilot with controlled eligible synthetic/test guardian and separate Admin identity; test registration, rejection, re-registration, cap count, payment PENDING/APPROVED/REJECTED, partial/failed uploads, receipts, permissions and browser mobile/desktop.
- [ ] Test negative cases: duplicate MyKid V2, stale OTP, forged token, wrong guardian, duplicate payment, repeated approval, full class, future month, race conditions, missing/bad Drive file, expired session, AutoCrat failure, email failure.
- [ ] **GO only if:** founder month-credit rule is documented; all critical security/finance checks PASS; registration/monthly receipt chain and guard conditions demonstrated; backups tested; named owner gives approval.
- [ ] **NO-GO if:** any amount/period ambiguity, duplicate financial posting, incorrect year/month, parent cross-data access, missing rollback proof, or unverified critical AutoCrat behaviour.
- [ ] On release: confirm portal URL, active GAS revision, spreadsheet ID, timestamps, test receipt link and error notifications. Keep logging limited and private.
- [ ] Rollback plan: disable new V2 submissions/admin approval first, stop V2 AutoCrat trigger(s), restore prior stable GAS version/portal routing, preserve newly collected transactional evidence, then reconcile safely from backup. **Never blindly overwrite LIVE workbook with an older backup** and destroy new submissions.
- [ ] Write down any rollback-trigger decision, person approving it, timeline and reconciliation steps; run read-only spot checks on V1 after rollback.

## G. Optional enhancements — NOT blockers
- [ ] Telegram A+B: one bot → Syafie Legacy AJK group for operations, private developer DM for technical faults; private Script Properties, minimal detail, nonblocking dispatch. **Planning only.**
- [ ] `ACTIVITY_LOG` for Admin setting changes, registration/payment events and notifications; preserve data minimisation and no leaked MyKid.
- [ ] Ordinary after-deadline admission exception UI/2028+ scope: future owner decision; not to be improvised to meet December launch.

## At-a-glance current gate status
| Area | Status |
|---|---|
| Registration / re-enrolment owner QA | PARTIAL PASS |
| Parent-facing seat counts UI | UI QA PASS; boundary/race NOT VERIFIED |
| Registration PDF + dashboard access | Owner QA PASS; broader permission review NOT VERIFIED |
| Monthly Admin approval | 15/15 mock PASS; actual GAS transaction NOT VERIFIED |
| First-month credit | **HOLD — Ustaz Shafie** |
| Monthly AutoCrat PDF/receipts | **NOT IMPLEMENTED** |
| Time-trigger automation and email dedup | **NOT VERIFIED** |
| Security, production migration, rollback test | **NOT VERIFIED** |
| **Overall release decision** | **NO-GO / NOT YET APPROVED** |

**Document purpose:** checklist for upcoming QA/release review. It is not an instruction to make changes to LIVE. Keep `master`, LIVE GAS, LIVE spreadsheet, AutoCrat production jobs and existing triggers unchanged until a separate explicit release approval.
