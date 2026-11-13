# UPKK SL V2 — Progress & Milestone (13 November 2026)

**Repository:** `shafielegacy/UPKK
**Status:** Closed Pilot UI Runtime PASS; **PUBLIC RELEASE HOLD**
**Evidence:** Owner PowerShell output + screenshot localhost on 13 Nov 2026. No full security audit or payment verification.

## Milestones confirmed

| Component | Status | Evidence / qualification |
|---|---|---|
| Admin Native OTP + original premium Admin dashboard | LOCAL RUNTIME PASS | Switch 2026/2027 without logout; Legacy data visible; 2027 QA data visible |
| Native GAS versioned deployment @6 | DEPLOYED previously | Pinned earlier deployments / Legacy V65 preserved; no further deployment authorised |
| Parent OTP email (one pilot) | CLOSED PILOT RUNTIME PASS | Email OTP delivered, verified and login succeeded; 30-minute token design; no token shared |
| Parent 2026 original premium dashboard | LOCAL RUNTIME PASS | Legacy 12 monthly cards, previous fee states and actions visible after OTP |
| Parent selector 2026/2027 | LOCAL RUNTIME PASS | One selector and in-dashboard switching observed after STEP87 |
| Parent Native 2027 APPROVED records | LOCAL RUNTIME PASS (QA DATA) | Approved Native dummy/test pupils visible after OTP; no general cross-parent authorisation proof |
| Parent 2027 child picker | LOCAL RUNTIME PASS | Selected Native test child displayed; multi-child switching not separately verified |
| Parent 2027 monthly visual cards | LOCAL UI PASS | 12 Jan–Dec 2027 cards labelled BELUM TERSEDIA; these are **not** validated payment statuses |
| STEP87 fixed QA installer | LOCAL INSTALL PASS | Backup `STEP87_BACKUP_20261113_212455` in frontend QA folder; no GAS/push |
| Native eBayar 2027 | OFF / NOT RELEASED | Monthly payment data backend contract is incomplete |
| Public Parent login / public eDaftar | OFF / HOLD | No public release authorisation |
| GitHub Pages production | NOT DEPLOYED by these steps | Local QA changes not yet reviewed against repo/diff |

## Current implementation

- Frontend QA workspace: `C:\Users\burnk\Downloads\UPKK_V2_UNIFIED_DASHBOARD_QA`.
- Native GAS local workspace: `C:\Users\burnk\Downloads\UPKK_PARENT_CLOSED_DEPLOY_READY`.
- Repo: `shafielegacy/UPKK`; verified native script ID and @6 endpoint on earlier checkpoint (avoid copying production credentials to Git).
- Parent OTP frontend config enabled **locally only**. Backend Script Property `UPKK_V2_PARENT_AUTH_ENABLED=true` by owner for PILOT; `UPKK_V2_PARENT_ACCESS_MODE=PILOT`; pilot email allowlist configured privately. **Do not publish pilot email, token, script secret or internal data in code/docs.**
- `UPKK_V2_PARENT_PUBLIC_LOGIN_ENABLED` false; public registration OFF; previous `UPKK_V2_PARENT_EXISTING_LOGIN_ENABLED` bridge OFF.
- Native parent response is constrained to guardian email + last-six digits phone, session `2027`, source `NATIVE`, status `APPROVED 2027`. Runtime proof of cross-guardian isolation still pending.
- Legacy 2026 retains historical fees, eBayar and receipts. Legacy V65 deployment not edited.
- 2027 `children[]` response provides `registrationPaid`, `firstMonthPaid`, `firstMonthStatus`, receipt number and student/class fields. It **does not provide** a month-by-month ledger or start-month mapping for a trusted 2027 monthly payment display.
- Monthly cards therefore show `BELUM TERSEDIA` and are informational/non-collecting. RM50 registration does not settle monthly tuition; do not double-count first-month tuition.
- Original premium layout retained; 2027 summary card layout is narrow and footer still says 2026 / v1.34 even when viewing 2027 (UI polish pending).

## Known risks / blockers before a public GitHub Pages release

1. **Closed-pilot gate is ON in a publicly reachable GAS deployment.** Keep allowlist mode; do not publish a frontend pointing to live Native @6 without an access-control and exposure review.
2. OTP token authorisation and cross-guardian isolation have **not** been independently verified against a different guardian account or negative-case authorisation.
3. Existing Legacy sign-in after OTP and any action/payment endpoints need review for token-bound access, safe session transitions, CSRF/cross-session issues and public exposure; screenshots alone do not prove secure authorisation.
4. Native 2027 monthly ledger / month mapping is not available to this frontend; payments and receipts must remain CLOSED.
5. Before publishing, inspect `git status`, selected branch and diff; remove pilot-only config/QA data, local backups, credentials, temporary scripts and unpublished endpoint flags from anything public.
6. Clarify UI summary layout and footer; ensure service worker/cache versioned deployment behaviour is correct.
7. Confirm a deliberate production release decision separately. **A push to a QA-only branch is not equivalent to production publishing.**

## Safety / controls

- No production GitHub Pages publish, merge or live V65 change from this checkpoint.
- No Google Forms, AutoCrat, official spreadsheet, triggers, payment actions or receipt generation touched.
- Do not turn on Native public eDaftar or public Parent login automatically.
- Keep QA dummy children and QA receipts out of the official public-facing product.
- Do not commit `.clasp.json`, Script Properties, auth secrets, login tokens, backup archives or real student data.

## Next minimal sequence

1. Read-only inspect local branch/status and candidate diff vs remote; stop on dirty unrelated files or wrong branch.
2. Record this checkpoint in QA documentation, not silently overwrite earlier milestone notes.
3. If owner specifically authorises a QA-branch push, stage **only reviewed and sanitised frontend/docs files** and push the QA branch; never assume that push deploys Pages.
4. Before a real production release, resolve authentication/isolation and safe gate semantics, then do focused release checks without repeating earlier functional QA.

**Documentation provenance:** derived from owner's outputs/screenshots; not a substitute for source review or complete production QA.
