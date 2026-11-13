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


## Parent Native unified dashboard — QA implementation checkpoint

- `parent-2027.js` renders the verified Native session inside existing `index.html#page-dashboard`, not in a second page or login panel. It uses server-issued Parent V4 OTP token; no browser storage or direct email-based dashboard lookup.
- `native-parent-shell-2027.css` gives 2027 a scoped emerald/gold sidebar and responsive card layout. Original Legacy Parent dashboard elements are hidden only during Native 2027 mode; their source and V65 behaviour are unchanged.
- `index.html` imports both Admin and Parent native shell styles and versioned QA scripts, while preserving exactly the same Log Masuk/eDaftar tabs, Legacy `doLogin()`, existing session router and `APP_VERSION='1.34'`.
- Parent 2027 shows only records returned by authenticated Native backend; 2026 items remain informational. The action for detailed 2026 yuran/resit returns to the **existing login** and requires Legacy authentication. This does **not** imply one OTP authenticates the Legacy backend.
- Logout clears token, the rendered Native record cards and returns to `page-login`. Refresh responses with an old token are ignored. Equivalent cleanup has been applied to Native Admin listing.
- GitHub remote static verification PASS for Native mounts, scoped styles, Legacy markers, and both public gates OFF. No authenticated/browser tests performed.
- **Next:** independently exercise QA browser flow (Admin OTP and Parent pilot), cross-identity safeguards, mobile layout, direct panel navigation and session expiry. Do not merge branch to Pages or enable public gate before owner acceptance.


## Release-hardening QA checkpoint — 13 November 2026

- Removed `?v2=1` redirect from `index.html` to standalone `v2-portal.html` on QA branch only. The existing Log Masuk/eDaftar tabs remain.
- Added explicit `Sesi 2026 — Log Masuk` return route to Native Admin 2027 sidebar. Native Admin session is logged out before using Legacy authentication; no token is treated as Legacy permission.
- Added token-identity guard to Native Admin approve/reject response handling to avoid updating UI after logout. Simplified Native Admin refresh-failure logout.
- Remote source verification PASS: redirect absent, original Legacy `doLogin()` present, both Native action routes present, both Native parent/eDaftar public config gates OFF.
- **Limitations:** No runtime browser QA or backend permission check, no genuine Parent pilot OTP, no cross-account access test, no actual public-release GO. No GAS/Sheets/Forms changes, and no merge or deploy.

**Latest QA code commit at time of this checkpoint:** `fb3b743d1fcd195cf88e4eee0539b73c2360bfab`.


## Login session collision hardening — 13 Nov 2026

- **Risk identified:** Legacy `index.html` restores `localStorage.upkk_session` on reload. A successfully authenticated Native OTP session could coexist with an already-stored Legacy session in the browser.
- **QA fix:** after successful Native Admin or Parent OTP and before rendering `#page-admin` / `#page-dashboard`, invoke the unchanged Legacy `doLogout()` to clear Legacy browser session state; only then keep the Native session token in volatile JS memory. This requires fresh Legacy authentication to return to 2026.
- **Native Admin:** now also refuses success responses without a `token`.
- **Verification:** remote source re-read confirms both modules call original `doLogout()` only after their respective OTP success, original Legacy login/logout code remains, no v2 standalone redirect, and public Parent/eDaftar configs remain `enabled:false`.
- **Unverified:** actual browser authentication, pending Legacy callback races, cross-account isolation, CSS on devices, GAS execution, and end-to-end 2027 intake. Treat branch as QA only; no merge or public activation.

**QA milestone source commit:** `9e1a2495ab796d99f9899b1ec26fad978dedbdf2`.


## PWA and static preflight checkpoint — 13 November 2026

- `sw.js` cache key updated in QA branch from `upkk-v1.34-native-ui-20261112` to `upkk-v2-unified-qa-20261113`, to identify the new PWA asset set upon a future authorised publish. Does **not** change production installed clients until merged and published.
- Added `tests/unified-dashboard-static.test.cjs` with 18 read-only source assertions for one portal, Legacy continuity, Native route/mount, token gating, stale response protection, CSS scope, two disabled public frontend gates and QA PWA cache. Run locally with `node tests/unified-dashboard-static.test.cjs` from the repo root.
- Remote GitHub re-read confirms cache key and test file exist; **Node test execution NOT VERIFIED**, browser and GAS runtime NOT VERIFIED. These assertions are not a substitute for runtime security testing.
- Remaining release blockers include verifying authenticated Admin/Parent flows on QA frontend, Legacy restoration races, strict token authorisation, genuine tenant guardian isolation, eDaftar release flags, financial processing, receipt/email delivery, and rollback.
- No change to official `pages/frontend-v1.34` branch or public GAS/Sheets and no launch authorisation.


## Executed GitHub Actions QA — verified success (13 Nov 2026)

- Added read-only GitHub Actions workflow `.github/workflows/v2-unified-dashboard-qa.yml` on **isolated QA branch only**.
- Run: https://github.com/shafielegacy/UPKK/actions/runs/43357153901
- Run ID: `43357153901`, source commit `07e535945a3095d58e65343dd5513b1bcd8a6119`.
- GitHub Actions API reported `status=completed`, `conclusion=success`. Individual job steps `Checkout QA source`, `Syntax - Admin Native` (`node --check`), `Syntax - Parent Native` (`node --check`) and `Static release preflight` (`node tests/unified-dashboard-static.test.cjs`) all reported `success`.
- The 18 static assertions execute locally in the job and do not make Google/GAS calls or submit records. No real users, payments, email or OTP tested.
- This is a **CI milestone, NOT public release GO**. Remaining critical tests: browser layout and navigation, genuine Native OTP with controlled account, Legacy session restore/authorisation, cross-parent access, Native 2027 receipt/payment confirmation, production safety and rollback.

**Public flags unchanged:** Parent login OFF, eDaftar OFF. No production merge, GAS or spreadsheet changes.
