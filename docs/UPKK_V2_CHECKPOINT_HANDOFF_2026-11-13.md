# UPKK V2 — Checkpoint & Handoff (13 November 2026)

**Status: QA STATIC PASS / RUNTIME & SECURITY NOT VERIFIED / PRODUCTION NO-GO**

## Owner-approved architecture
- One original premium dashboard for Kafa & UPKK Syafie Legacy.
- One Native Admin OTP and one Unified Parent OTP; one portal, session switch 2026/2027.
- Preserve Legacy 2026 login compatibility, child selection, eBayar, resits, history, data and V65 pinned deployment.
- Native eBayar 2027 and public Native eDaftar 2027 remain CLOSED until separate owner GO.
- This owner amendment supersedes earlier QA architecture text excluding Parent OTP.

## Current local work — NOT YET SAVED AS CODE TO GITHUB
- Main QA workspace: `C:\Users\burnk\Downloads\UPKK_V2_UNIFIED_DASHBOARD_QA`
- Isolated merge sandbox: `C:\Users\burnk\Downloads\UPKK_V2_MERGE_SANDBOX_20261113`
- Detached HEAD: `d293b99`, MERGE_HEAD: `d260379`.
- Merge conflicts resolved (0); merge remains **uncommitted**. Do not commit, merge, push, or deploy automatically.
- 11 files staged locally including frontend integration and two handoff MDs.
- Local backup: `STEP143_PRE_PARENT_OTP_PATCH/` (untracked, excluded from staging).
- Frontend Parent OTP integration connects login, logout, OTP identity binding, Legacy response identity check, session restore guard and 2026/2027 session switch.
- Static syntax/whitespace PASS (STEP160); staged meaningful `index.html` diff +53/-67 ignoring EOL (STEP166).
- Frontend config `parent-otp-unified-config.js` **enabled:false**.
- This GitHub checkpoint is a **documentation-only commit**. It is NOT a push of the local staged merge or code changes.

## Native GAS state verified by owner/screenshots
- Native GAS project: **UPKK SL – Native eDaftar 2027** (separate from Legacy V65).
- Active Web App URL matched frontend configured Parent OTP endpoint.
- Deployment **Version 6**, 13 Nov 2026 17:02; source review identified `NativeCore.gs` POST route `pagesParentV2` and `ParentAuthV2.gs` functions `requestParentV2Otp`, `verifyParentV2Otp`, `getUnifiedParentV2`, `logoutParentV2`.
- Script Properties reviewed: `UPKK_V2_PARENT_ACCESS_MODE=PILOT`, `UPKK_V2_PARENT_AUTH_ENABLED=true`; pilot e-mail configured.
- `UPKK_V2_PARENT_EXISTING_LOGIN_ENABLED=false` (screenshot supersedes earlier observation that property was missing).
- Public eDaftar gates shown OFF. `UPKK_V2_ADMIN_POST_ENABLED=true`.
- `clasp deployments` returned `The caller does not have permission`, therefore use authorised Apps Script UI for read-only deployment verification; do not change clasp identity casually.
- One screenshot exposed `UPKK_V2_PARENT_AUTH_SECRET`. Rotate before public use, without repeating or storing secret in GitHub/docs.

## Google Sheets verification (read-only via connected UPKKSL account)
Workbook displayed title: **DAFTAR KELAS UPKK BAHASA ARAB 2026 (Responses)**.
- `DAFTAR UPKK`: tab exists, grid 34 columns; source-required headers `Email address`, `NAMA MURID (SAMA SEPERTI MYKID)`, `NO. TELEFON` present. Column U header is blank.
- `NATIVE_EDAFTAR_2027`: tab exists, grid 33 columns; 18 required Native backend headers present.
- **Schema header check PASS only**; no edits, no Form submissions, no inspection of student records or cross-parent data.

## Backend source security review
- Pilot OTP uses one-time 6-digit code (10 min), attempt limits, opaque session token (30 min), and token-bound email plus last six phone digits in server CacheService.
- `getUnifiedParentV2` uses server token identity; `UnifiedParent2027` filters records by email + last six digits and excludes Native 2027 statuses other than `APPROVED 2027`.
- Existing-login bridge is a separate non-OTP path; its backend property is verified `false`. Frontend existing bridge also `enabled:false`.
- **Source review is not runtime security verification.** Cross-parent isolation, version equivalence for Legacy V65, authenticated browser behaviour and Legacy 2026 regression remain NOT VERIFIED.
- Verify no stale legacy response, session, UI action or cached user identity can bypass OTP before any activation.

## Release blockers and next minimum steps
1. Keep Parent frontend OTP OFF and Native eDaftar/eBayar 2027 CLOSED; do not touch Legacy production.
2. Do one narrowly scoped, owner-authorised pilot/runtime verification with non-sensitive test evidence; confirm backend token identity and cross-parent denial.
3. Review frontend compatibility in the isolated merge sandbox; avoid repeated broad audits and duplicate packages.
4. After verification, obtain **explicit owner authorisation** for the exact QA commit/push/merge/deployment, separately from production GO.
5. Do not stage local backup, private credentials, OTPs, student data or screenshots of secrets.

## Resume prompt for tomorrow
> Sambung UPKK V2 daripada checkpoint 13 November 2026. Baca dokumen ini dahulu. Aku mahu minimum steps, satu arahan sahaja setiap kali, tanpa audit atau ujian berulang. Guna satu merge sandbox QA sedia ada dan branch yang disahkan; jangan create folder/deployment baharu tanpa sebab. Confirm staged files and uncommitted merge; backend GAS V6 PILOT, Parent OTP frontend OFF; official spreadsheet headers PASS. Fokus dua blocker: minimum authorised pilot runtime/cross-parent safety verification dan Legacy 2026 regression. Jangan sentuh Legacy V65, spreadsheet rasmi, Forms, AutoCrat, triggers, production atau public flags. Jangan commit/push/deploy tanpa arahan spesifik untuk tindakan tersebut. Beri checkpoint ringkas dan release readiness yang tepat.

*Document-only checkpoint saved to remote QA branch on 13 Nov 2026. It does not include locally staged code.*
