# UPKK V2 — Phase 9A Security Hardening and Monday Registration Release Gate

**Audit date:** Friday, 6 November 2026 (MYT)  
**Requested public registration target:** Monday, 9 November 2026  
**Repository:** `shafielegacy/UPKK`  
**Branch:** `feature/v2-admin-settings-minimal-qa`  
**Status:** READ-ONLY SOURCE AUDIT COMPLETED; SECURITY PATCH / RUNTIME QA NOT YET PASS. **NO-GO until blocking checks pass.**

## Product decision for Monday

Prioritise **registration-only public opening** so returning and new pupils can enrol for session 2027. Keep the existing familiar Premium V2 workflow. Native monthly payment must remain calendar-gated (not silently opened in November). A registration-only release is **conditional**, not an authorisation to deploy unsafe code or to alter LIVE/V1.

## Current source findings (verified from QA branch)

1. `Code.gs` `_handleApi` disables legacy public action routing in the copied QA spreadsheet only. That gate covers `doGet?action=...` and `doPost` there; it does **not** authenticate direct `google.script.run` calls.
2. `getAdminDashboard()`, `getSenaraiMuridDaftar(carian,status)`, `getSenaraiByuran(bulan,status,carian)`, and `getTiadaBayarDanKonsisten()` have no server-side Admin token check at entry. These expose or aggregate pupils and payment information. **BLOCKER**.
3. `getDashboard(email,namaMurid,tarikhDaftar,requestedYear)` and `getResit(email,bulan)` accept client-provided identity arguments with no verified parent session/child ownership at entry. **BLOCKER**.
4. `index.html` calls these legacy functions through dynamic `gasCall` / `google.script.run[fn](...args)` in GAS mode. It also offers a GitHub Pages external API path; neither a UI login flag nor localStorage role is sufficient authorisation.
5. `AdminV2.gs` already issues a short-lived Admin token and validates it server-side using `upkkAdminV2Auth_`. `NativeEbayar.gs` uses a separate authenticated parent token with child ownership checks. These can be reused in reviewed V2 endpoints; do not invent another login service without necessity.
6. Current QA guards intentionally bind V2 privileged functions to BACKUP only. A production configuration must be reviewed; never remove guards by broad replacement.

## Minimal Phase 9A patch scope (QA branch only)

- Make every sensitive Admin read require a **server-validated Admin session**, including dashboard, enrolment list, monthly-payment list, and delinquency summary. Update corresponding browser calls to pass its session token; return a generic denied response for absent/expired/forged tokens.
- Make guardian dashboard and historical receipt reads require a **server-validated guardian session and owned-child match**, not only e-mail/name/date. Avoid exposing sensitive raw row diagnostics.
- Preserve 2026 V1 history and the existing parent UX. Keep the public QA legacy-action gate fail-closed; do not casually reactivate JSONP for old dashboards.
- Audit other publicly callable server entry points, including internal-appearing helpers exposed to `google.script.run`, and block unauthorised data access without breaking required enrolment/OTP endpoints.
- Add isolated synthetic tests for missing token, wrong role, expired token, cross-parent access, legitimate Admin and parent sessions, and regression of required UX. Real copied GAS `/dev` verification must follow mock tests.

## Registration-only GO conditions for 9 November

- **P1 security:** all sensitive direct callable endpoints verified inaccessible without a session, and Admin/parent boundaries pass negative tests in copied GAS.
- **P1 money/policy:** founder confirms written fee and first-month allocation rules; registration-only amount/receipt must be internally consistent and not charge the same month twice.
- **P1 operations:** approved production configuration, correct enrolment window and fee, verified class capacities and unique MyKid, private slip/PDF sharing, email destination, working Admin review; no fake QA data in LIVE.
- **P1 release safety:** recorded official workbook and GAS project, timestamped verified backups including legacy, config, AutoCrat templates/triggers, versioned deployment plan and tested rollback preserving any new registrations.
- **P1 owner acceptance:** explicit owner GO after final pilot on copied environment. Do not merge/deploy/publish automatically.

## Current decisions and evidence

- Manual monthly receipt and parent lazy-sync: verified 6 Nov for synthetic serial `0004`.
- Hourly AutoCrat processed synthetic receipts `0005` and `0006`: two PDF outputs, two `Emails Sent` logs, and owner inbox screenshots. Admin Sync changed both from `RESERVED` to `READY`. See `UPKK_V2_NATIVE_EBAYAR_RECEIPT_QA_2026-11-06.md` addendum.
- No repeat-hour duplicate e-mail test independently observed; owner reports confidence in AutoCrat's skip behaviour. Do not overstate test evidence.
- Registration OTP, application, approval, AutoCrat registration PDF and test parent dashboard are QA PASS in previous milestone; quota concurrency, cross-parent privacy and production readiness remain not verified.
- No source security fix, GAS deploy, spreadsheet edit, trigger change, LIVE edit or master merge was performed by this audit.

## Recommended work order

1. Secure direct GAS callable entry points (small auditable QA changes), then run negative security/regression tests.
2. Resolve founder month-credit instruction and verify registration-only fee text and controls.
3. Carry out copied GAS `/dev` pilot for registration and access boundaries, quota contention, PDF access; then prepare backup/deployment/rollback runbook.
4. Only after all critical gates PASS, request explicit permission for Monday LIVE release; otherwise use the existing safe V1 workflow temporarily rather than publish unsafe V2.
