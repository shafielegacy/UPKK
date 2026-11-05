# UPKK V2 — Part 8E Security & Integration QA — 5 Nov 2026

**Repository:** `shafielegacy/UPKK`  
**Branch:** `feature/native-ebayar-12bulan-qa`  
**Baseline:** `b33903bec7592da1976701f2e028c4f2e1dc14e0`  
**Decision:** **NO-GO LIVE — critical legacy API exposure remains a release blocker**. This report is based on source inspection and mock execution; no real Google API or browser tests.

## Critical finding: unauthenticated legacy API actions

The branch's `Code.gs` public `doGet?action=...` and `doPost` route calls `_handleApi()` directly. Before the QA mitigation, `_handleApi` exposed:
- `getAdminDashboard` and `getSenaraiMuridDaftar` without an Admin token.
- `getDashboard` using email/name/date arguments without a server-side guardian session.
- `getResit` based on email/month.
- `testResit` returning raw row data from a caller-selected worksheet and row (potential personal data).
- Public `syncMuridToForms` and other maintenance actions without API authorisation.

### Reproduction (fake data ONLY)

Extracted the actual `_handleApi` function from baseline `Code.gs` and called `getAdminDashboard`, `getSenaraiMuridDaftar`, `getDashboard`, and `testResit` with fake handlers/sheets and no credentials. **All four returned synthetic sensitive data**. This establishes a code-path vulnerability, not proof that a particular LIVE URL is publicly reachable.

### Temporary QA-only mitigation

Inserted a fail-closed gate at the start of `_handleApi` that denies **all legacy public API actions** when the configured spreadsheet matches `NE_QA_SPREADSHEET_` (the copied QA BACKUP workbook). It returns a generic QA denial via `apiOutput_` before reaching any handler.

**9/9 mock checks PASS**: login, dashboard, Admin dashboard, pupil list, receipt lookup, diagnostic row, form sync, submit and unknown action. Zero handler/sheet side effects in the mock. Two `index.html` inline scripts, `Code.gs` and `NativeMonthlyReceiptV2.gs` pass JavaScript syntax parsing.

Test file: `tests/part8e-legacy-api-qa.test.js`, runnable in local Node checkout with `node tests/part8e-legacy-api-qa.test.js`.

**Compatibility note:** This intentionally disables GitHub Pages -> public GET/JSONP calls *against copied QA GAS*; QA should use the GAS /dev page and direct `google.script.run`. It is NOT a production migration strategy. `master` and V1 LIVE were not changed.

## Outstanding serious privacy/authentication gaps

1. GAS HTML Service `google.script.run` can invoke exported server functions by name. The QA-only `_handleApi` gate does **not** make the existing `getAdminDashboard`, `getSenaraiMuridDaftar`, `getDashboard` or `getResit` server functions safe on their own. Each sensitive entry point needs real server-side session/role and child ownership verification before LIVE, and internal helper exposure must be reviewed.
2. Legacy production/master still has the original public API; changing its design requires separate compatibility/security migration, and cannot be silently patched or deployed in this QA phase.
3. `NativeMonthlyReceiptV2.gs` mock access checks previously passed 19/19, but real Drive sharing, per-parent permission, correct PDF/content association and HTML browser flow remain NOT VERIFIED.
4. Existing `NATIVE_EBAYAR` payout, duplicate prevention, AutoCrat job/delivery, real concurrency, recovery/rollback and registration credit policy remain release blockers.
5. Fail-closed QA gate is conditional on `NE_QA_SPREADSHEET_` being present. Production must use explicit, reviewed environment policy; never remove QA protections with broad search-and-replace.

## Next safe QA plan

- Security redesign plan for Legacy public endpoints, preserving necessary V1 user journeys while requiring identity and privileges.
- Add authenticated server-side V2 status retrieval, avoiding name/email-only lookup and removing raw internal helper exposure.
- Test direct `google.script.run` privilege escalation and cross-parent access, not just JSONP.
- Test end-to-end in authorised copied GAS/Sheets BACKUP with synthetic guardians and a separate Admin. No real parents or production trigger.
- Revisit founder first-month credit policy before enabling payments or mail.

**Safety:** no `master` edit, PR, merge, production GAS/Sheets/Drive mutation, AutoCrat, trigger, email or deployment. Current QA source only.
