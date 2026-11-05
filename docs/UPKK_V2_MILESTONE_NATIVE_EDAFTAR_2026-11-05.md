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
