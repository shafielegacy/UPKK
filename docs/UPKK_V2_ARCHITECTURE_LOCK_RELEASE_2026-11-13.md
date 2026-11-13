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
