# UPKK SL V2.0 — Unified Dashboard Shell QA (13 Nov 2026)

**Architecture LOCK:** one `index.html` portal with only Log Masuk/eDaftar tabs; one dashboard shell per role, session selector 2026/2027. Do not create another login page or GAS project.

## Baseline
- Source branch: `pages/frontend-v1.34`, commit `a735956cdc0d6366f691a0e26feac883ea06209b`
- Isolated implementation branch: `feature/v2-unified-dashboard-shell-qa`
- Legacy dashboard: `index.html#page-admin`; Legacy parent: `index.html#page-dashboard`
- Native admin currently renders inside `#lcp-login` in `admin-2027.js`.
- Native parent remains OFF; `parent-2027-config.js` points to versioned Native @4.
- `edaftar-config.js` remains OFF. No runtime release validation yet.

## Release-safe implementation contract
1. Keep the **same** existing dashboard shell and visual system (sidebar, green/gold cards, responsive layout) for Admin and Parent.
2. Native Admin OTP stays server-authenticated; do not equate Legacy `S.user.role` with a Native token. On valid Native token, show session 2027 inside Admin shell; Legacy data/actions must not render under Native-only auth.
3. Legacy Admin retains `loadAdminDashboard`, `switchAdminTab`, sync, receipts, and all 2026 actions unchanged. A user with only Native Admin token cannot invoke Legacy actions through the new UI.
4. Native 2027 uses `listAdminV2`, `decideAdminV2Application`, and Native UUID via protected backend only. Preserve approved policy RM50 registration / RM100 with first month; no duplicate charges.
5. For Parent 2026, original V65 dashboard is authoritative for payment/receipts. Native Parent 2027 OTP permits only verified guardian records (email + last 6 digits) and APPROVED 2027 records. Don't claim shared credentials authenticate both sessions.
6. Session switches require valid backend authorization for the destination session; otherwise show a clear re-authentication prompt **in the existing login tab**, not a second page.
7. Distinguish `QA-` milestone records from actual revenue in the Native Admin interface until data is classified.
8. Keep feature gates OFF and do not enable public eDaftar or perform dummy submissions/payment tests.
9. Do not change Legacy V65, official spreadsheet rows, Forms, AutoCrat, triggers or versioned GAS deployments.
10. Do not merge/publish this QA branch without owner-reviewed browser checks: Legacy login Parent/Admin, Native OTP Admin/Parent, cross-account isolation, route permissions, mobile layout, session logout, eDaftar readiness, template/email recipients, rollback.

## UI acceptance criteria
- Top-level exactly two tabs: Log Masuk, eDaftar.
- Admin dashboard visually reuses 2026 shell, with a clear 2026/2027 session selector and Native stats/actions only after Native OTP.
- Parent dashboard uses the existing premium shell and session selector, but never recalculates Legacy receipts from Native data.
- No other user-facing login route linked from main portal.
- Animations remain post-release TODO.

## Implementation checkpoint — 13 Nov 2026

QA branch only (not Pages live):
- `admin-2027.js`: after verified Admin Native OTP, mount/display the Native Admin dashboard within existing `#page-admin`. Native session changes `native-2027-active` mode; logout returns to the existing login page.
- `native-admin-shell-2027.css`: scoped premium emerald/gold sidebar and responsive cards. Legacy admin header, tabs, and content are hidden **only** while Native mode is active.
- `index.html`: imports QA CSS and cache-busted Admin JS; original Legacy `doLogin()`, Legacy Admin tabs and `APP_VERSION='1.34'` remain.
- Static remote file verification PASS for mount, mode switch, route, unchanged Legacy login, Native Parent OFF and public eDaftar OFF.
- No GAS/Sheets/Forms/AutoCrat changes; no GitHub Pages source branch update, merge, or public deployment.

**Remaining blockers:** browser QA of OTP→shell→logout, parent unified shell, cross-session authorisation, mobile styles, production data vs QA totals, Native public eDaftar readiness and owner GO. This is not a GO-LIVE certificate.

**Status:** Native Admin shell implemented in isolated QA branch and static-verified; browser and release QA pending. Public release NOT authorised.
