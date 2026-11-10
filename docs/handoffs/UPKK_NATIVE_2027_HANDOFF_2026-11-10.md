# UPKK SL Native eDaftar 2027 — Handoff 10 November 2026

**Status:** CLOSED / NO-GO for pilot writes or public launch. **Scope:** Documentation checkpoint only; no code changes or release action from this commit.

## What was completed tonight

1. Created a **separate** Google Apps Script project `UPKK SL - Native eDaftar 2027` for registration-only. The original V65 Legacy project and QA03 backend are distinct and must not be overwritten.
2. Confirmed CLASP identity `upkksl@gmail.com` with named profile `--user upkk-release`. Default laptop CLASP identity was `itumelaka@gmail.com`; never use it for UPKK operations.
3. Extracted **release candidate** to local `C:\Users\burnk\Downloads\UPKK_NATIVE_2027_RELEASE_CANDIDATE`, linked its own `.clasp.json` to the new Native project, and pushed 5 GAS files: `AdminV2.js`, `NativeCore.js`, `NativeEdaftar.js`, `PagesEdaftar.js`, `appsscript.json`. `RELEASE_README.md` was not pushed.
4. Deployed the new Native backend as an Apps Script Web App in **CLOSED PILOT** configuration (execute as owner, access Anyone). **HTTP POST closed-gate smoke PASS**: `{"success":false,"message":"Pendaftaran belum dibuka kepada umum."}`. A direct editor invocation of `doPost` completed without exception but is *not* an end-to-end test.
5. Set properties in the new project only: `UPKK_PAGES_EDAFTAR_MODE=PRODUCTION`; workbook binding points to the existing official **UPKK RASMI** workbook; `UPKK_PAGES_EDAFTAR_PUBLIC_ENABLED=false`; `UPKK_PAGES_EDAFTAR_PILOT_ENABLED=false`; `UPKK_NATIVE_EDAFTAR_ENABLED=false`; `UPKK_PAGES_EDAFTAR_ADMIN_ENABLED=false`; pilot email allowlist is set to the owner QA mailbox. Fee config `UPKK_V2_FEES_2027={"session":"2027","daftar":50,"bulanan":50}`; policy `UPKK_V2_POLICY_2027={"session":"2027","classStart":"2026-12-01","registrationStart":"2026-11-01","registrationEnd":"","registrationOpen":false}`.
6. Prepared a dedicated Google Drive **UPKK SL - Slip Pendaftaran 2027** folder, owner-only and **Restricted** in screenshot. Set `UPKK_NATIVE_EDAFTAR_SLIP_FOLDER_ID` in the new project's properties; actual GAS write permission has not been exercised.
7. Investigated write flow: OTP ticket, duplicates, quota, sheet header/formula guards, private slip upload, setting `PENDING 2027` before fields, and a durable `UPKK_PAGES_EDAFTAR_WRITE_HOLD` circuit breaker. `LockService.getScriptLock()` does **not** serialize independent Google Forms or Legacy GAS writers.
8. Prepared **Payment Intent Patch (review ZIP only, not deployed)** to preserve the parent's `REGISTRATION_ONLY` versus `FULL` selection in `AH:V2_PAYMENT_OPTION`, without abusing `J:BAYARAN` (which records Admin-confirmed actual payment). Its Admin logic must be reviewed and tested before adoption.
9. **Live read-only spreadsheet verification** through the UPKKSL connected account: official workbook `DAFTAR UPKK` has 34 columns **A:AH**, `AG1=V2_JENIS_DAFTAR`, **`AH1=V2_PAYMENT_OPTION`**, `AH2:AH3` blank. No schema edit was necessary.

## Confirmed scope and exclusions

- Existing **Legacy 2026** (V65 pinned, Forms, payment/receipt flow, parent login) MUST remain operational, unmodified and isolated.
- Native **eDaftar 2027 only** is release scope; Native eBayar 2027, unified parent dashboard/login and public Admin V2 readiness are **not verified or released**.
- The prior QA end-to-end submission, OTP and QA AutoCrat were already tested on BACKUP 07; these do **not** establish production runtime approval.
- Production official spreadsheet contains Legacy and future Native rows; never point the Native production endpoint to QA BACKUP 07.
- November 2026 enrolment: RM50 registration; first December tuition RM50 separately. December 2026 onward: RM50 registration + RM50 first-month tuition, optionally RM50 registration first or RM100 together; confirmation must not double-charge. Policy is agreed, but production accounting end-to-end is **not verified**.
- Brand: **Kafa & UPKK Syafie Legacy**, not old SRA Paya Rumput branding.

## Blockers and what must NOT be claimed

- **Payment Intent Patch is NOT installed** in the GAS Native deployment. Only the earlier 5-file release candidate was pushed. Check patch contents, align Admin functionality, then obtain explicit permission before any production push.
- **Concurrent writers risk unresolved**: Legacy Google Forms/GAS and new Native may append or fill rows in the same official `DAFTAR UPKK` sheet. A Native script lock does not protect external writers. Determine a safely isolated append/merge strategy or operational serialization **without shutting down Legacy**.
- Pilot limited write test to UPKK RASMI is **NOT APPROVED/NOT RUN**. `registrationOpen=false` in policy; Native, Pilot, Public and Admin flags remain false as last owner-reported.
- No proven production OTP send, slip upload, eDaftar row write, Admin approval, AutoCrat receipt generation, RM100 payment reconciliation, or cross-writer correctness.
- The Web App's **Anyone** availability is not the same as public enrolment; the POST gate is currently confirmed closed.
- **No changes were made to Google Sheets** in tonight's read-only AH check.

## Tomorrow — shortest safe continuation

1. Reconfirm the Native project's four OFF flags, `registrationOpen=false`, and `WRITE_HOLD` state **read-only**; never clear a hold without reconciling any partial submission.
2. Review the Payment Intent Patch versus the previously pushed release candidate; validate AH header (already read-only PASS); examine Admin approval and receipt semantics. Keep patch **undepoyed** while concurrent-writer risk exists.
3. Resolve coexistence of Native and Legacy writers on official sheet; identify exact atomicity/serialization plan and rollback preserving Legacy traffic. A spreadsheet write or schema edit requires separate owner approval.
4. Prepare a controlled pilot with allowlisted email and an explicitly authorised test plan only after gates pass; no real pupil data without need.
5. After a verified pilot and explicit owner **GO**, update the GitHub Pages eDaftar frontend endpoint and open enrolment in a *separate* release action. Never publish the QA03 endpoint.

## Local working artifacts (on user's ROG Flow)

- Frontend QA: `C:\Users\burnk\OneDrive\Documents-assets\UPKK-Part7D-QA`; active local branch reported as `work/v2-premium-native-integration`; **not published**.
- Backend QA03: `C:\Users\burnk\OneDrive\Documents-assets\UPKK\V135_QA_INSTALL_20261109\PROJECT` — `.clasp.json` points to QA03; **do not repoint**.
- Native GAS production RC: `C:\Users\burnk\Downloads\UPKK_NATIVE_2027_RELEASE_CANDIDATE` — `.clasp.json` points to *new* Native GAS project.
- Patch review ZIP: `C:\Users\burnk\Downloads\UPKK_NATIVE_2027_PAYMENT_INTENT_PATCH_REVIEW.zip` — **NOT deployed**.
- Git workspace `master` was reported behind remote with modified files: never blindly `git pull`, `commit` or `push` from that path.
- `clasp push` from the wrong directory can overwrite QA03. Always inspect `.clasp.json` and use `--user upkk-release`.

## Checkpoint classification

| Item | Status |
|---|---|
| CLASP profile + target script | PASS |
| Five-file Native RC upload | PASS |
| Closed Web App POST | PASS |
| Official AH header live-read | PASS |
| Payment Intent Patch | READY FOR REVIEW ONLY |
| Concurrent writer isolation | BLOCKED |
| Pilot production writes | NOT RUN |
| Frontend live integration / public launch | NO-GO |

**GitHub commit purpose:** preserve a reproducible handoff. No source code, production branch, production data or deployment changed by this documentation commit.
