# UPKK SL V2.0 — ARCHITECTURE LOCK (OWNER FINAL)
**Tarikh:** 13 November 2026 (MYT)  
**Status:** LOCK — kekal hingga release; ubah hanya atas arahan eksplisit pemilik.

## Produk akhir yang diminta pemilik
1. **Admin: SATU cara login rasmi, Native OTP.** Setelah OTP sah, terus masuk dashboard Admin sedia ada yang premium (layout/sidebar asal), dengan maklumat rasmi 2026 dan pilihan untuk memaparkan 2027 dalam dashboard yang SAMA. Tiada login Admin Legacy tambahan untuk menukar sesi. Tidak guna dua halaman Admin.
2. **Parent: jangan ubah login atau dashboard Parent asal.** Kekalkan login Legacy sedia ada dan paparkan rekod anak 2026 dan 2027 apabila pemetaan identiti penjaga telah disahkan secara server-side. Tidak tambah Parent OTP/login baru, tidak tunjuk data 2027 berdasar e-mel semata-mata.
3. **Satu portal:** `index.html`, dua tab asal `Log Masuk` / `eDaftar`. Pemilih `Sesi 2026 / Sesi 2027` ialah filter paparan, bukan pautan ke login lain.
4. **Preserve production:** pinned Legacy V65, Pages rasmi, data 2026, Forms, eBayar/resit rasmi, Native production configurations, dan seluruh rekod sedia ada tidak diubah dalam QA work.
5. **Public release gate:** Parent 2027 dan public eDaftar masih OFF sehingga akses sah, kesiapsiagaan penerimaan dan kelulusan pemilik. Tiada penghantaran dummy, OTP berulang atau QA berlebihan.

## Fakta backend yang disahkan
- Source Legacy `Code.gs` yang diberikan pemilik mempunyai `login(email,telefon)`, `getAdminDashboard()` dan public API action `getAdminDashboard` yang tidak menerima token Admin. **Jangan menggunakan action ini dari frontend OTP sebagai pintasan autorisasi.** Source ini bukan bukti deployed pinned V65 sama versinya.
- Native @2 Admin OTP dan list Admin 2027 berjaya browser-verified pada localhost dengan 3 rekod QA dan RM200 QA (bukan hasil rasmi). Native token tidak memberi sesi Legacy secara automatik.
- Source QA terkini masih mempunyai dua aliran pengesahan Admin (Legacy credential serta Native OTP). Penambahan selector/OTP overlay sebelum ini ialah pembaikan sementara, **tidak memenuhi architecture akhir**. Jangan menggelarnya release-ready.
- Parent Native V4 frontend `enabled:false`; jangan enable supaya tidak ubah login Parent.
- 19 static PASS serta CI SUCCESS memeriksa struktur, BUKAN bukti hak akses gabungan yang selamat.

## Satu blocker wajib — secure auth bridge
Perlu implement secara additive dalam **Native backend yang sama** suatu read-only Admin 2026 summary/list endpoint yang memeriksa token sesi Admin OTP 2027 pada pelayan sebelum membuka data 2026 (dengan permission Google yang sah kepada workbook rasmi), bukan memanggil Legacy `getAdminDashboard` dari frontend tanpa kawalan. Simpan Legacy V65 pinned tidak diubah. Tentukan dengan jelas spreadsheet ID, access scope, bentuk respons minimum dan role/token verification; jangan membuat perubahan Google sehingga diluluskan. Perlu QA keselamatan minimum ke atas cross-role access.

Bagi Parent, keperluan data 2027 mestilah dihubungkan kepada identiti dan anak yang benar-benar disahkan oleh server selepas login asal, tanpa menggunakan data Parent Legacy di localStorage sebagai satu-satunya bukti. **Ini juga release blocker**; jangan memintasnya dengan unauthenticated query.

## Immediate work plan (minimal, no broad QA)
1. Freeze architecture + remove confusing session-login UX from QA candidate; no public merge.
2. Prepare/read-only review of Native token validation contract and 2026 read-only bridge; separately review guardian mapping.
3. Implement only secure bridge into existing Native project after permission/owner GO, then wire Admin ONE OTP to original Admin dashboard and Parent original login unchanged.
4. One limited acceptance smoke check per role + rollback; publish only after GO.

## Owner communication
**Jangan minta pengguna mengulang ujian 2026, OTP, dummy pendaftaran, pembayaran atau sepuluh QA.** Ringkaskan status sebenar, kerja yang siap, halangan real dan next satu tindakan. Jangan klaim sudah release selagi belum.


## Implementation progress — Native V4 owner source received (13 November 2026)
- Owner uploaded complete 11-file Native V4 source ZIP. Verified source `NativeCore.js` has the same official workbook binding as owner-supplied Legacy `Code.gs`.
- Prepared independent 14-file **CLOSED QA handoff** `UPKK_V4_SINGLE_ADMIN_OTP_QA_HANDOFF.zip` (original 11 source files, additive `NativeAdminLegacy2026ReadOnly.js`, narrow `PagesAdminV2Production.js` route update, README/manifest). No deployment. Bridge `getAdminLegacy2026ReadOnly(token)` reuses server-side `upkkAdminV2Auth_` and the existing production admin gates; copies Legacy 2026 read-calculation logic without write actions. Synthetic offline checks verify valid/invalid token, OFF gate and source syntax; **Google runtime NOT VERIFIED**.
- Frontend QA `admin-2027.js`: single Admin OTP choice in existing main login surface; after OTP, new token-bound legacy 2026 request is used to render original Admin dashboard and Native records are inserted **inline** inside the original dashboard (not a second shell). Original Parent login is unchanged; `parent-2027-config.js enabled:false`.
- **Critical:** the new backend route does not exist in deployed GAS @2/@4 yet. No version/deploy/push performed. Any browser test against existing pinned Native deployment will therefore fail to load Legacy 2026 through OTP, until a separately authorised new Native version is safely deployed. Never overwrite pinned V65 or Native @2/@4.
- Parent-only 2027 guardian login through unchanged existing form remains a separate blocker (server-side identity verification and 2027 child lookup). Do not expose Native 2027 data using browser localStorage as authority.
- Production/public GO remains **NO-GO**. Do not present static CI PASS as end-to-end release verification.


## Full QA source checkpoint — same login, two sessions (13 Nov 2026)
- Native V4 owner ZIP received (11 files). Created an **isolated backend handoff ZIP**, with read-only Admin Legacy 2026 bridge, read-only Parent 2027 existing-login bridge, two narrow route changes, SHA manifest and offline tests. It is NOT pushed, versioned or deployed.
- Admin frontend now routes the single Native Admin OTP to original 2026 Admin dashboard via **server-verified token**; 2027 records are shown inline on choosing session 2027. Legacy Admin password logins and cached Legacy Admin sessions in QA are redirected/denied before dashboard display, preventing a second authorised Admin login path. No new Admin portal.
- Parent original e-mail + last-six-phone input and Legacy 2026 success path stay. Additive Native 2027 approved records display in same Parent dashboard; Native-only 2027 families can use same existing form through a server-verifying fallback. The new bridge stays **OFF** by default on server `UPKK_V2_PARENT_EXISTING_LOGIN_ENABLED` and frontend `parent-existing-2027-config.js enabled:false`. Separate Parent OTP remains OFF.
- Existing Native GAS pinned deployments, Legacy V65, Pages official branch and Google sheets untouched. No public eDaftar activation.
- Offline bridge checks: Admin invalid-token/valid-token/OFF gate PASS, Parent invalid-credentials/APPROVED-only/OFF gate PASS; syntax PASS. Latest QA CI checks frontend sources and explicit gates. **None of these is actual GAS runtime or public readiness.**
- **Release condition:** push only reviewed backend sources to existing Native GAS, create a NEW pinned version/deployment (do not overwrite old version), enable the explicit Parent bridge on a controlled pilot only after access review, set frontend endpoint to new deployment URL, one minimal Admin OTP + Parent 2027 identity smoke, then approve Pages merge and open registration separately. A production GO is NOT yet issued.


## Deliverables — owner handoff (13 Nov 2026)
- `UPKK_V4_SINGLE_ADMIN_OTP_QA_HANDOFF.zip`: 17 entries total (13 GAS source files, README, manifest, 2 offline JS test files). SHA-256 `c2d87ec2b103822d3d6a6f2abdd542d5808ce8606853349876960f0bcc76c128`. All manifest entries verified.
- `UPKK_V4_STAGE_ONLY.ps1`: safe *local* staging helper. Before copying, asserts original `.clasp.json` Script ID matches existing Native Script, both changed source files still match uploaded owner baseline hashes, every ZIP source entry matches manifest SHA-256, and new bridge files do not exist. Creates a single rollback ZIP, stages only 4 source files in the same Native folder, cleans temporary files. **Never invokes clasp, Google APIs, deploy, commit or push.**
- Frontend QA latest CI: https://github.com/shafielegacy/UPKK/actions/runs/43387389996 — completed `success`. Admin OTP required; stale Legacy admin login/session cannot bypass it; Parent old-form UI preserved; separate Parent OTP module excluded from `index.html`.
- Pending: Native GAS staging/install, new versioned deployment and endpoint alignment. New Parent 2027 bridge remains disabled; official Pages not merged. No user-side repeated QA requested.
