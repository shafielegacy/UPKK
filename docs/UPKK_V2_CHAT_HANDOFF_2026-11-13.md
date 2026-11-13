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
