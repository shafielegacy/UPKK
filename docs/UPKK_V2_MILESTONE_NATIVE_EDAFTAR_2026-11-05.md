# UPKK V2 — Milestone Native eDaftar & Fasa Seterusnya (5 November 2026)

**Status:** GAS BACKUP QA — *partial functional PASS; production NO-GO*.  
**Repository:** `shafielegacy/UPKK`  
**Branch:** `feature/v2-admin-settings-minimal-qa`  
**Production:** V1 LIVE and `master` remain out of scope. No deploy or migration authorised.

## 1. Owner-led real BACKUP observations

| Check | Evidence reported in hands-on QA | Result |
| --- | --- | --- |
| Admin policy ON/OFF/save/load | Owner tested switching and reloading | PASS (BACKUP) |
| November 2026 enrolment | Native eDaftar total **RM50 registration + RM0 first-month = RM50** | PASS (BACKUP) |
| E-mail OTP | Delivered and verification progressed to saved application | PASS user flow |
| Application write | New synthetic child saved as `PENDING 2027` | PASS |
| Admin approval | Record later showed `APPROVED 2027`; registration total RM50 | PASS |
| Registration AutoCrat | Row showed PDF created and e-mail sent by time trigger; receipt serial allocated | PASS for one sample only |
| Authenticated digital receipt | Owner opened registration PDF using parent's V2 receipt entry | PASS for test guardian |
| November card | Owner saw/used November registration card popup after replacing `index.html` | PASS UI click |
| 2026 December card blocked in November | Future month not actionable; consistent with current calendar guard | PASS as observed |
| Monthly transaction and PDF | No real monthly end-to-end approval + monthly AutoCrat performed | **NOT VERIFIED / full AutoCrat NOT IMPLEMENTED** |

Never publish synthetic row MyKid, phone, e-mail, receipt Drive links or OTP in public docs. Recorded receipts are BACKUP QA artifacts, not production evidence.

## 2. Approved UX and financial semantics

- Preserve proven parent journey: login → owned child → **12 month cards** → status popup → Bayar Sekarang. Preserve Premium V2 aesthetic. No multi-child/month checkbox wizard.
- November 2026 registration `RM50` is **seat reservation** only. November monthly tuition is **not due**. The November card can serve as *DAFTAR / RESIT PENDAFTARAN*, but must not increment the paid-month tally or create a monthly bill.
- December 2026 tuition `RM50` is a separate charge for November registrants.
- For later registration: current QA policy quotes `RM50 registration + RM50 first enrolment month = RM100`, and a confirmed credit must prevent charging that same month twice. This interpretation is currently **owner-directed for QA**, but reconcile the original founder discussion about December/January credit **in writing before production**. Do not rewrite the historical 4 Nov decision note.
- Admission ON and blank end date are deliberately retained in GAS BACKUP for testing; do not transfer these settings blindly to LIVE. End date / post-December admission policy requires fresh founder confirmation for production.
- Session/calendar terminology must be distinct: *registration 2026 / class session 2027*; parent can view year 2026 and 2027 separately.

## 3. What code already does

- `index.html` November QA card routes to `openResitModal() → doGetRegistrationReceiptUI()`.
- `NativeEbayar.gs` `getNativeRegistrationReceipt()` requires a guardian session, owned approved child, allocated receipt number, AutoCrat PDF merge complete; no public JSONP receipt fetch.
- `Code.gs` keeps Nov tuition `NA` and prevents 2026 pre-intake arrears; 2027 is a separate view.
- Native monthly eBayar backend has pending submissions and admin decisions, but **the QA-only monthly serial ledger (`MonthlyReceiptV2.gs`), read-only AutoCrat preflight (`MonthlyAutoCratV2.gs`) and authenticated retrieval (`NativeMonthlyReceiptV2.gs`) already exist**. They are not proof of a real monthly AutoCrat merge, generated PDF, delivery or successful end-to-end GAS test.

## 4. Next development: Admin modal polish + Native monthly QA

**Phase UI (QA only):**
- Replace browser `prompt()/confirm()` during Admin registration decisions and monthly payment approval/rejection with consistent Premium V2 modal.
- Confirm amount from slip; require reasons for rejections; preserve server-side validation. Block duplicate clicks while awaiting GAS.
- Retain existing decision API signatures and financial calculations. Do not touch old V1 approval.

**Phase eBayar (QA only):**
1. Review server-side date gates, duplicate payment rejection, fees, first-month credit, ownership and Admin authorisation against one or more test scenarios.
2. Prepare a controlled month-override strategy for tests **without modifying the real server clock** and without opening future-month payments to the public or LIVE; no live payment while the calendar gate is closed.
3. Test PENDING → approved/rejected → dashboard and duplicate/retry cases using synthetic records in BACKUP.
4. Integrate/test existing QA-only serial ledger, monthly preflight and authenticated retrieval with a separate, controlled monthly AutoCrat job (still missing); demonstrate actual PDF, email dedup, reconciliation, folder permissions and child+month access.
5. Complete security, quotas, cross-parent access, financial reconciliation, migration/rollback before requesting owner GO.

## 5. Outstanding release blockers

- Monthly eBayar end-to-end **NOT VERIFIED**.
- QA-only serial ledger/preflight/retrieval **CODE EXISTS, real GAS NOT VERIFIED**; monthly AutoCrat PDF/job, safe delivery and e-mail dedup **NOT IMPLEMENTED/NOT VERIFIED**.
- Cross-guardian and Drive permissions, OTP/security, quota boundary/race, simultaneous payment QA **NOT VERIFIED**.
- Founder written clarification of registration first-month credit and intake closure/exception policy **REQUIRES CONFIRMATION**.
- One official workbook migration, backup verification, property/trigger mapping and rollback drill **NOT VERIFIED**.

**Branch audit note:** Monthly 8B/8C/8D files pre-existed on QA (inherited from parallel workstream). Their isolated test reports do not constitute live Google QA. Browser Admin Premium V2 modal syntax passed static JS parse, not GAS runtime QA.\n\n**Decision: NO-GO for V2 LIVE today.** This document records actual QA progress without implying a released system.

## 6. Subsequent owner QA — Admin Premium V2 and monthly receipt preflight

**Owner's GAS BACKUP QA, 5 Nov 2026 (after original report):**

| Test | Observation | Result |
|---|---|---|
| Admin Sahkan dialog | Premium V2 modal opened for dummy PENDING row | **UI PASS** (not submit tested) |
| Admin Tolak dialog | Premium V2 modal with rejection reason field opened | **UI PASS** |
| Admin reject write | Dummy row became `REJECTED 2027`, legacy formula showed `DITOLAK 2027`, Admin/date/reason written, no new receipt | **BACKUP PASS** |
| Admin approval via new modal | Not submitted during this QA | **NOT VERIFIED** |
| Monthly payment transactions | BACKUP `NATIVE_EBAYAR` only had header A:Q on read-only inspection | **NO DATA / NOT VERIFIED** |
| Monthly receipt status | `index.html` now offers read-only `Semak Status Resit (QA)` for `SELESAI`, backed by `previewMonthlyAutoCratQa` | **STATIC JS PASS; BROWSER/GAS NOT VERIFIED** |

**Next steps:** In GAS BACKUP, ensure `MonthlyReceiptV2.gs`, `MonthlyAutoCratV2.gs` and `NativeMonthlyReceiptV2.gs` are actually copied from the same QA branch before trying the read-only monthly receipt preflight. Do not create synthetic settled transactions by pasting directly into the financial ledger; use controlled authenticated payment QA with a valid test period. Date gate must continue to refuse future periods, including Dec 2026 while current date is Nov 2026. Monthly AutoCrat real merge, trigger, PDF and email are still missing and require separate QA. No V1 LIVE, `master`, production Sheets or production AutoCrat touched.

**Latest QA code commit for this milestone:** `fd80a71dfbabb30d05748ce18a922c240dd6fadb` (Admin read-only receipt status UI).

## 7. Next phase — monthly transaction safety and read-only ledger audit

**Scope:** QA branch source changes only. Following the owner's successful header R:U setup in copied GAS BACKUP, operator confirmed columns `RECEIPT_STATE`, `RECEIPT_UPDATED_AT`, `RECEIPT_NOTE`, `RECEIPT_ATTEMPT` in `NATIVE_EBAYAR`. Admin interface displayed no monthly transactions, matching the BACKUP ledger inspection. **Header setup PASS; monthly end-to-end NOT VERIFIED.**

### Implemented on the QA branch

- `MonthlyAutoCratV2.gs`: new `auditMonthlyReceiptReadinessQa(token)` is **read-only, Admin-authenticated and BACKUP-guarded**. Reports aggregate status counts only, never child names, MyKid, guardian contacts, private URLs or request IDs. Checks metadata setup and duplicate/malformed serials via existing ledger validation, unsettled receipt metadata, incomplete serial allocation, inconsistent PDF states, and MERGING/UNCERTAIN reconciliation.
- `index.html`: new **Audit Ledger Resit Bulanan (QA)** Admin button calls the audit through authenticated `google.script.run` and displays totals. No mutating functions, receipt generation, e-mail or trigger is called.
- `ready` is **not a production-ready indicator**: it only flags consistency of available ledger data, with missing serials on settled transactions marked not ready. With zero payments, the audit can pass structurally while end-to-end finance/AutoCrat remain **NOT VERIFIED**.

### Deterministic isolated checks

Seven in-memory cases were executed against the fetched QA audit function and mocked GAS dependencies: empty ledger; PENDING only; SELESAI without serial; UNCERTAIN merge; READY without PDF; missing R:U; and denied Admin. Syntax parsing also passed for updated source and HTML script blocks. These tests do **not** validate Google Apps Script execution, session lifetime, Drive permissions, nor actual AutoCrat.

### Risk and release controls

- `nePaymentYear_` enforces calendar-month availability using `Asia/Kuala_Lumpur`. Nov 2026 cannot be paid natively; Dec 2026 may not open early. Do **not** change real system dates to bypass the gate.
- `submitNativeEbayar` checks guardian ownership and locks duplicate non-rejected periods; `decideNativeEbayarAdmin` checks Admin permission, verified amount, settled duplicate and PENDING decision state. Actual concurrent-GAS and malformed-input negative tests are still pending.
- Monthly serial ledger and read-only AutoCrat preflight exist; **actual monthly AutoCrat template, job, controlled merge, private PDF and e-mail dedup have NOT been implemented/verified**. No production GO.
- Never seed a `SELESAI` transaction directly into the BACKUP ledger simply to drive a success path. Real payment QA must use a valid open billing period and synthetic child.
- New changes are not automatically present in copied GAS BACKUP. Copy `MonthlyAutoCratV2.gs` and `index.html` from QA branch, one at a time, then run read-only Admin audit. **Do not run merge, reservation, reconcile or trigger functions for this test.**

## 8. AutoCrat V2 QA — verified PDF and reconciliation bridge (5 November 2026)

**Owner-led Google BACKUP evidence, not a production test:** Operator configured a separate manual AutoCrat job `UPKK V2 - RESIT BULANAN QA` using a QA Google Slides receipt template, `NATIVE_EBAYAR` merge source, PDF output, `STATUS = SELESAI` and `RECEIPT_STATE = RESERVED` conditions; email sharing and scheduled/form triggers disabled. The owner populated one **explicitly synthetic** test transaction. An actual manual AutoCrat merge populated V:Y with a Drive file ID and URL, filename `RESIT_UPKK_V2_UPKK-M-2026-0001`, and `PDF created` success message. The owner opened the output PDF. **PDF creation and file accessibility PASS for this QA test; content mapping and email delivery remain to be signed off.**

**Gap discovered:** Native monthly parent retrieval requires `MERGED_PDF_URL` in Q and `RECEIPT_STATE = READY` in R, but AutoCrat writes its own output to V:Y. Consequently, a successful merge alone does not make a native monthly receipt available to parents.

**Implemented QA bridge** (commit after manual test):
- `syncMonthlyAutoCratPdfQa(token,requestId)` in `MonthlyAutoCratV2.gs`, invoked exclusively from a confirming Admin button in `index.html` — **no AutoCrat rerun, PDF generation, or email**.
- Checks protected BACKUP environment, Admin auth, single `SELESAI` transaction and no duplicate settled child/month/year, global receipt serial uniqueness, expected V:Y AutoCrat job headers, valid AutoCrat success status, document ID matching Drive URL and `RESIT_UPKK_V2_<NO_RESIT>` output name, PDF MIME/not trashed and PRIVATE Drive sharing.
- Under `LockService`, copies the canonical existing PDF URL into Q and advances R to `READY`. Does not alter payment status, receipt number or attempt count. Repeated sync returns unchanged; inconsistent Q/R or a different PDF fails closed.
- **Google execution of sync not yet tested**. A synthetic parent email and MyKid in the manual ledger row cannot validate ownership or private file access on the real Parent Dashboard. Proper test needs an approved BACKUP child owned by a QA guardian; never relabel the existing synthetic PDF as a real payment.

### Pending before 8C can close
1. Copy latest `MonthlyAutoCratV2.gs` and `index.html` into GAS BACKUP one file per step, then use Admin to sync the existing synthetic PDF **once**. Confirm Q/R while V:Y remain unchanged and a second click returns unchanged.
2. Verify rendered PDF placeholders with the owner. Test a separate approved synthetic child and parent login through the existing authenticated monthly receipt flow.
3. Grant parent access only on an authenticated ownership-verified action and test with the intended QA account; PRIVATE Drive file may not be visible to arbitrary signed-in users.
4. If and when owner enables AutoCrat email delivery in QA, test a controlled permitted recipient and its no-duplicate behaviour. AutoCrat email is currently OFF; **email PASS cannot be claimed**.
5. Ensure production separation, registration policy reconciliation, legitimate billing in December 2026 and all previous release blockers before any LIVE authorisation.

**Release status: NO-GO LIVE.** This milestone only verifies manual QA PDF creation and provides a pending Google-tested bridge.
