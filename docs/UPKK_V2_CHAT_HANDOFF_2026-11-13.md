# UPKK SL V2.0 — CHECKPOINT & HANDOFF CHAT BAHARU
**Tarikh:** Jumaat, 13 November 2026 (MYT)
**Status akhir:** LOCAL STAGING PASS · SCRIPT ID PASS · **NO CLASP PUSH / NO VERSION / NO DEPLOY**
**Dokumen ini MENGATASI cadangan flow login yang lebih lama.**

## 1. Architecture OWNER LOCK hingga release
- **Admin:** Satu login **Native OTP** sahaja. Setelah berjaya, paparkan **dashboard Admin premium asal** dengan data 2026; tukar pilihan sesi untuk memaparkan data 2027 **dalam dashboard yang sama**. Bukan login Admin kedua atau page Admin kedua. Data 2026 mesti disediakan melalui token-guarded, read-only Native backend, bukan panggilan Legacy tanpa kawalan.
- **Parent:** Kekalkan **borang login dan dashboard asal 2026** (e-mel + enam digit akhir telefon). Tambah rekod anak Native 2027 yang telah disahkan oleh backend pada dashboard yang sama. **Tiada OTP Parent tambahan**.
- Satu portal `index.html`, dua tab Log Masuk/eDaftar; selector 2026/2027 bukan pilihan login.
- **Jangan sentuh Legacy V65**, portal production Pages, workbook rasmi, Forms, AutoCrat, triggers, eBayar/resit sedia ada. Jangan buka intake awam tanpa owner GO.
- Jangan ulang dummy registrations, payments, OTP, audit atau suite QA lama. Semakan minimum yang benar-benar diperlukan sahaja.

## 2. Workspace tepat
- Repo: `shafielegacy/UPKK`.
- Branch frontend QA: `feature/v2-unified-dashboard-shell-qa`; latest documented commit sebelum checkpoint: `2984bad256de34cea9f0be9767fd510d768c4674` (this handoff is a later docs-only commit).
- Frontend QA folder laptop: `C:\Users\burnk\Downloads\UPKK_V2_UNIFIED_DASHBOARD_QA`. `localhost:8765` pernah digunakan; jangan anggap server masih running.
- GAS Native staging laptop: `C:\Users\burnk\Downloads\UPKK_PARENT_CLOSED_DEPLOY_READY`. **Folder ini bukan frontend repo**, dan bukan GAS Legacy.
- GAS Native **existing** Script ID: `1cXv2_u3cKgrqHsbFMf2d4fVHaoMirQTDx4_RNkaH27XOVY0048g3Mre_`; owner `upkksl@gmail.com`; CLI `--user upkk-release`.
- Rollback backup output: `C:\Users\burnk\Downloads\UPKK_V4_PRE_BRIDGE_ROLLBACK.zip`.
- Source bundle: `C:\Users\burnk\Downloads\UPKK_V4_SINGLE_ADMIN_OTP_QA_HANDOFF.zip`; local staging helper `UPKK_V4_STAGE_ONLY.ps1`.
- Legacy frontend baseline official `pages/frontend-v1.34`; **tidak merge/publish**.

## 3. Apa yang benar-benar telah dibuat dan disahkan
- Native Admin @2 OTP e-mail received, verified, 2027 dashboard visible with 3 **QA** applications / RM200 **QA**, before latest single-login patch. Ini **bukan** runtime verification final integration.
- Frontend QA telah diubah: Admin OTP → original Admin premium dashboard 2026 melalui token-guarded new route `getAdminLegacy2026ReadOnly`, data 2027 ditampilkan inline, tidak dua shell; old Legacy Admin password route/cache no longer bypass OTP. Parent original login kekal; additional Native 2027 data bridge `parent-existing-2027.js` is CLOSED. Extra Parent OTP module **not loaded**.
- CI run `43387389996` **SUCCESS** (source/static/syntax only): https://github.com/shafielegacy/UPKK/actions/runs/43387389996.
- 11 owner Native V4 files were packaged into QA handoff with 2 additional bridge files, narrow route updates, SHA manifest/offline tests. They are **candidate source**, not deployed.
- Owner ran local helper. Exact reported output: **`PASS: Four Native GAS QA bridge source files staged in the existing project.`**, **`ROLLBACK BACKUP: C:\Users\burnk\Downloads\UPKK_V4_PRE_BRIDGE_ROLLBACK.zip`**, **`STOP: NO clasp push, NO new version and NO deployment performed.`**
- Owner next ran `clasp status --user upkk-release`: 13 **tracked** files = `AdminOtpV2.js`, `AdminV2.js`, `appsscript.json`, `NativeAdminLegacy2026ReadOnly.js`, `NativeCore.js`, `NativeEdaftar.js`, `NativeParentExistingLogin2027.js`, `NativeSchema.js`, `PagesAdminV2Production.js`, `PagesEdaftar.js`, `ParentAuthV2.js`, `ParentPagesV2.js`, `UnifiedParent2027.js`.
- 2 **untracked**: `.clasp.json` and `ParentAuthV2.before-public.patch.bak`. Do not delete/change casually. Note `.clasp.json` is needed for local clasp Script binding, not an item to push.
- Owner read `.clasp.json` and explicitly confirmed **`PASS: Native GAS Script ID betul`**. No Google modification took place yet.

## 4. Safety gates / NOT VERIFIED
- **NOT YET** `clasp push`, version creation, new deployment, endpoint swap, Google Apps Script runtime checks, joined 2026/2027 authorised data test, Parent guardian-to-child isolation, or public release.
- Existing versioned deployments @1/@2/@3/@4 are pinned; do NOT overwrite them. Use a **new version / new deployment** only after safety review and owner authority. Never overwrite Legacy V65.
- Parent Native `UPKK_V2_PARENT_EXISTING_LOGIN_ENABLED` remains OFF by default; frontend `parent-existing-2027-config.js enabled:false`. Separate Parent Auth and public eDaftar remain OFF. Any enablement requires controlled verification and owner GO.
- Legacy official records/financial data must never be treated as the 3 QA applications/RM200.
- Merely seeing static CI PASS is **not** release GO. Do not claim “boleh digunakan tanpa masalah” before end-to-end verification.

## 5. Next exact step in new chat
Start by reading this checkpoint and `docs/UPKK_V2_ARCHITECTURE_LOCK_RELEASE_2026-11-13.md`. Owner already verified local staged files and exact Script ID; **DO NOT ask to repeat those checks**.

Next: minimal **read-only pre-push diff/review** of the FOUR staged source files against the uploaded Native V4 source baseline and QA manifest/bridge contract (particularly server-side OTP auth on 2026 read route, Parent email+last6 binding, flags, access to correct workbook, no exposure of sensitive 2026 data via unguarded public actions). Do not confuse `Code.gs` Legacy in GitHub with Native deploy code.

After review, provide **ONE command at a time**; request explicit approval before first `clasp push` and deployment changes, because those alter existing GAS HEAD. Prefer new pinned deployment, preserve all old versions. Then align QA frontend URL and do only *minimum* authenticated smoke checks. Parent bridge must remain OFF until controlled pilot; public eDaftar OFF until owner decides.

**STOP CONDITION:** If any uncertainty about auth, workbook, branch or deployment, do not push. Tell owner precise blocker, not another speculative login workflow.


## OWNER AMENDMENT — 13 NOVEMBER 2026 — UNIFIED OTP

Status: OWNER-APPROVED ARCHITECTURE; QA STATIC PASS; PRODUCTION NO-GO.

This amendment supersedes earlier instructions that excluded Unified Parent OTP.

Final owner-approved architecture:
- One premium UPKK Syafie Legacy portal/dashboard.
- One Native Admin OTP authentication flow.
- One Unified Parent OTP authentication flow.
- Session selection for Legacy 2026 and Native 2027 within the same parent portal.
- Preserve Legacy 2026 login compatibility, child records, monthly payments, receipt retrieval, and historical data.
- Native eBayar 2027 and public eDaftar 2027 remain CLOSED until separately authorised.

QA checkpoint STEP160:
- Unified Parent OTP frontend integration and static JavaScript syntax: PASS.
- OTP-to-Legacy identity checks and cached-session protections: installed in QA sandbox.
- Parent OTP frontend configuration: enabled=false.
- Backend token ownership, cross-parent isolation, authenticated browser runtime, and deployment: NOT VERIFIED.
- Static PASS is not production or security approval.
- No commit, push, clasp push, merge completion, or deployment authorised.
- Isolated Git merge remains uncommitted.
- STEP143_PRE_PARENT_OTP_PATCH is a local backup and must not be staged.

Next release gates:
1. Review frontend authentication guards and possible Legacy session/data exposure.
2. Verify backend token-to-parent and child-record ownership enforcement.
3. Perform minimal authorised runtime/security verification.
4. Obtain explicit Owner GO before enabling public services or deploying.

Milestone date: 2026-11-13 (Asia/Kuala_Lumpur).

## STEP163 — LEGACY LOGIN CONTRACT CHECKPOINT

Date: 2026-11-13
Scope: Isolated QA sandbox; read-only inspection of Legacy Code.gs.

Confirmed in QA source:
- login(email, telefon) is defined at Code.gs line 424.
- Email is trimmed and normalised to lowercase.
- Parent login matches email and the final six telephone digits.
- Successful Parent response includes role=parent, email=emailNorm and anak[].
- Unified Parent OTP frontend guard expects the same normalised email format.
- No Legacy Code.gs modification is required by this contract check.

Limitations:
- Actual deployed V65 source equivalence: NOT VERIFIED.
- OTP backend token ownership and child-level isolation: NOT VERIFIED.
- Browser/runtime authentication: NOT VERIFIED.
- Frontend matching does not replace server-side authorisation.
- Parent OTP remains enabled=false; public release remains NO-GO.
- No commit, push, merge completion, GAS update or deployment authorised.

## STEP166 — FINAL STAGED QA DIFF CHECKPOINT

Date: 2026-11-13
Workspace: UPKK_V2_MERGE_SANDBOX_20261113
Base HEAD: d293b99
MERGE_HEAD: d260379
Merge status: unresolved conflicts = 0; merge remains uncommitted.

Verified:
- 11 files staged.
- index.html meaningful diff ignoring line endings: +53 / -67.
- Parent OTP identity guards staged.
- Staged whitespace check: PASS.
- STEP143_PRE_PARENT_OTP_PATCH excluded from staging.
- Unified Parent OTP frontend configuration remains OFF.
- JavaScript static syntax and integration checks: PASS.

RELEASE BLOCKERS:
- Server-side OTP token-to-parent and child-record ownership: NOT VERIFIED.
- Legacy V65 deployed-source equivalence: NOT VERIFIED.
- Authenticated runtime and cross-parent isolation: NOT VERIFIED.
- Legacy 2026 browser regression: NOT VERIFIED.
- Native eBayar 2027 and public eDaftar 2027 remain CLOSED.

FINAL STATUS: QA STATIC PASS / SECURITY NOT VERIFIED / PRODUCTION NO-GO.
Do not commit, push, complete merge, enable OTP or deploy without separate Owner authorisation.

## STEP172 — PARENT EXISTING LOGIN BYPASS REVIEW

Date: 2026-11-13
Scope: Read-only source review of isolated Native GAS backend.

Findings:
- NativeCore.js still routes pagesParentExistingLogin.
- NativeParentExistingLogin2027.js permits email + last-six-phone-digit authentication without OTP when its server-side feature gate is enabled.
- The route has a separate server-side property: UPKK_V2_PARENT_EXISTING_LOGIN_ENABLED.
- The frontend parent-existing-2027-config.js is enabled=false.
- Actual deployed backend property value: NOT VERIFIED.
- No evidence that the bypass is currently active.
- If enabled, the route could expose approved Native 2027 records without Unified Parent OTP.

Required before public Unified Parent OTP release:
- Verify UPKK_V2_PARENT_EXISTING_LOGIN_ENABLED is false in the actual Native GAS deployment.
- Do not rely on frontend enabled=false as a backend security control.
- Confirm Native OTP deployment, token ownership and cross-parent isolation.
- Retain Legacy 2026 functions and data unchanged.

Status: QA SOURCE REVIEW COMPLETE; DEPLOYMENT SECURITY NOT VERIFIED; PRODUCTION NO-GO.
No GAS property, source, trigger, deployment, Git commit or push changes authorised.
## Milestone 14 November 2026 - Dual Parent OTP Runtime

- Native GAS Unified Dashboard Bridge updated to Version 7.
- Parent A and Parent B OTP authentication succeeded in localhost QA.
- Unified Parent Dashboard 2026/2027 session switching succeeded.
- Parent B displayed its own approved Native 2027 records.
- Parent B showed no verified Legacy 2026 records.
- UI-level cross-parent separation observed; adversarial token isolation NOT VERIFIED.
- Parent OTP frontend enabled for QA PILOT only.
- Native GAS access remains PILOT, not PUBLIC.
- Legacy V65 and production Pages unchanged.

## Release follow-up

- Investigate Native 2027 full RM100 payment allocation and December 2026 tuition card. Confirm first_month_key and prevent duplicate charges before enabling public Native eBayar.
- Fix 2027 dashboard payment summary overflow and other UI layout issues.
- Finalise secure public access, registration/payment gates and production rollback before public release.
- Do not repeat previously successful Parent A/B OTP tests unnecessarily.