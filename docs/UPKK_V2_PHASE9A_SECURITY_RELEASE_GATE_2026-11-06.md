# UPKK V2 — Phase 9A Security Hardening and Monday Registration Release Gate

> **CURRENT POLICY SOURCE:** [UPKK V2 CURRENT TRUTH (6 Nov)](UPKK_V2_CURRENT_TRUTH_2026-11-06.md). Yuran telah disahkan pemilik; jangan ulang HOLD/Founder confirmation bagi perkara RM50 Nov / RM100 Dis+ / kredit yuran bulan pertama. Security QA, backup dan rollback kekal release blockers. Patch 9A Admin legacy reads telah ditulis pada QA branch (Code.gs + index.html) tetapi runtime /dev belum diuji.


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

## Phase 9A QA code update

Four legacy Admin read functions in `Code.gs` now use the existing Admin V2 session check. The GAS-mode client in `index.html` supplies that token for these calls. Static source read-back confirmed all four entry checks and matching client forwarding. This is an incremental QA-source change only; no GAS deploy or runtime tests have been done. Guardian legacy reads and other entry points still require hardening before public release.

QA commits: `64fa94c` (server), `6055ba6` (frontend). Monday 9 November registration release remains conditional on security, policy, and rollback sign-off.

## Phase 9A follow-up — guardian read hardening (QA source)

Patch commits: `e65091a` (`Code.gs`), `1d79980` (`index.html`).

- `login()` now issues an ephemeral QA guardian token after the existing email + last-six-phone-digit parent authentication succeeds. The token is held only in browser memory and a 2-hour server cache. It is **not** written to `localStorage`.
- Direct `getDashboard` reads require the server session, matching guardian email and a selected child name authorised by the login. Direct `getResit` requires the same session and email. Calls without a token, with a forged token, with an unrelated e-mail, or with an unowned child are intended to fail before workbook reads.
- GAS browser `gasCall` forwards the token for these two legacy reads. On GAS page refresh, saved browser role alone no longer restores the session; user must login again. This is a deliberate QA security trade-off, **not yet a validated UX result**.
- Existing Admin token requirements on four privileged reads remain in place.
- **STATIC read-back PASS** for token issuance, both guards, forwarding, no token persistence, cache TTL, and QA public API deny. **NO runtime GAS /dev test or browser regression yet.**
- Other direct callable legacy write/maintenance endpoints, old `submitBayaran`, `scanDuplikasiIC`, `setupAutoSyncTrigger` and all public auth/OTP routes require separate inventory and hardening. This patch is not comprehensive security approval.

**Release gate remains NO-GO:** copied GAS source must be updated cautiously one file at a time and real negative tests performed before publishing. Do not deploy to LIVE automatically.


## GAS BACKUP /dev owner-led runtime results — 6 Nov 2026, 16:53–17:02 MYT

**Scope:** Copied BACKUP GAS using QA branch `Code.gs` + `index.html`, manually saved by owner; no LIVE deploy.

| Test | Evidence | Verdict |
| --- | --- | --- |
| Admin login and dashboard on /dev | Owner observed dashboard | PASS (owner observation) |
| Admin `getAdminDashboard()` called without token | Execution log `{"success":false,"message":"Akses Admin tidak dibenarkan. Log masuk semula."}` | PASS |
| Guardian `getDashboard(...)` without token | Log `{"success":false,"message":"Ralat sistem: Sesi penjaga tidak sah. Log masuk semula."}` | PASS |
| Guardian login and 12-month dashboard on /dev | Owner observed dashboard | PASS (owner observation) |
| F5 refresh while guardian logged in | Owner observed return to login | PASS (owner observation) |
| Cross-child access using synthetic QA session with child A, request child B | Log `{"success":false,"message":"Ralat sistem: Rekod anak bukan milik penjaga ini."}` | PASS (synthetic guard test only) |
| Legacy `getResit('dummy@example.com','NOV')` without token | Execution log at 17:02 MYT `{"success":false,"message":"Ralat sistem: Sesi penjaga tidak sah. Log masuk semula."}` | PASS |

**7/7 performed tests PASS, but not full Security 9A sign-off.** Cross-child test uses a synthetic token, not two independently authenticated guardians. No evidence here of forged/expired token testing, real cross-guardian test, complete callable-entrypoint inventory, sensitive Drive URL ACLs, new-registration end-to-end regression after patch, quota concurrency, or production rollback. These remain pending.

The owner temporarily added QA test functions in BACKUP `Code.gs` to log return values. Remove these temporary functions during controlled cleanup after tests; do not execute triggers/merges. No LIVE changes were authorised.

## Follow-up QA trigger safety lock — 6 November 2026

Source audit found that `setupEbayarTrigger()` and `deleteAutoSyncTrigger()` could create/delete triggers without an Admin session. QA branch `Code.gs` now fails closed at function entry for both (commit `97131ba`). This is a safety guard on QA source only and must be copied to BACKUP GAS before asserting runtime protection; no trigger was executed or changed. Other legacy callable functions, particularly `scanDuplikasiIC()` and `getAdminEmails()`, still require review. No full-release sign-off yet.

## 7 November 2026 — duplicate scan BACKUP /dev runtime QA

The owner copied both matching QA files into GAS BACKUP and ran two read-only checks:

- **PASS (owner-observed)** — Admin signed in on BACKUP `/dev`, invoked the duplicate MyKid scan from the dashboard, and received duplicate-row results. Do not store names, IC/MyKid numbers, or row-level child data in this report.
- **PASS (execution log at 09:52 MYT)** — the temporary test helper called `scanDuplikasiIC()` without a token; returned `{"success":false,"message":"Akses Admin tidak dibenarkan. Log masuk semula."}`.

The nine performed Security 9A checks now pass (seven recorded in the prior section, plus the two above). This is a narrowly scoped result and **not** full release approval; other callable helpers, cross-guardian integration, production controls and rollback remain pending. The temporary `testSecurity9A_ScanNoToken_QA()` helper should be removed from BACKUP GAS after testing. No LIVE deployment or trigger execution was authorised.

## 7 November 2026 09:56 MYT — Admin email no-token QA

Owner installed QA `Code.gs` into GAS BACKUP and executed temporary function `testSecurity9A_AdminEmailsNoToken_QA()` calling `getAdminEmails()` without a token. Execution log at 09:56:11 MYT returned `{"success":false,"message":"Akses Admin tidak dibenarkan. Log masuk semula."}`. Verdict: **PASS for denial without token**. This brings the previously documented performed checks to **10/10 PASS**; it does **not** establish positive-path Admin authorisation or internal notification regression. QA source commit `ede499d` retains a protected public function with an internal private helper. No LIVE activity. Remove the temporary test function in BACKUP after this check.
