# UPKK SL V2 — Checkpoint LIVE eDaftar & Admin Approval (14 November 2026)

**Masa checkpoint:** 14 November 2026, petang (MYT).  
**Sumber:** Ujian pemilik melalui browser, bacaan READ-ONLY Google Sheets rasmi dan source yang diberikan pemilik.  
**Status keseluruhan:** eDaftar awam/OTP/submit RM50 & RM100 terbukti berfungsi; **kelulusan Admin untuk rekod baharu BELUM PASS** kerana percubaan semasa terhenti oleh had OTP sebelum ujian V10.

## Keputusan operasi dan larangan

- **HENTI perubahan kod, script properties, cache/kuota, deployment, data spreadsheet dan ujian dummy** sehingga keputusan pemilik seterusnya. Pemilik menolak reset OTP / patch tambahan buat masa sekarang.
- Jangan cipta projek, deployment, salinan QA atau fail ujian tambahan. Jangan usik Legacy V65, Forms, AutoCrat, receipt dan data 2026. Jangan buat klik approve berulang ketika status belum jelas.
- Semua nombor versi di bawah ialah *deployment Native GAS yang sama*, bukan Legacy V65.
- Branch GitHub Pages aktif: `pages/frontend-v1.34`. Branch QA integrasi berasingan: `feature/v2-unified-dashboard-shell-qa`. Jangan merge keseluruhan QA branch ke portal LIVE.

## Milestone 14 November — yang terbukti

1. Native GAS V7: `getNativeEdaftarAvailability` asalnya `enabled:false, intakeOpen:false`. Properties pengambilan dibuka dengan owner GO, termasuk `UPKK_V2_POLICY_2027.registrationOpen=true`. Semakan POST READ-ONLY menjadi `success:true, enabled:true, intakeOpen:true, feeReady:true`.
2. Public `edaftar-config.js` di branch GitHub Pages diaktifkan dan disambung kepada Native GAS existing Unified Dashboard Bridge endpoint `https://script.google.com/macros/s/AKfycbx6L0BEEdk5xz3wKIrIk9yhnms0GojmK7eBkw6bNmVfOS5dipXiowr6qadmBrayt2WW/exec`. GitHub Pages release workflow untuk pengaktifan telah Success (run 43568334933).
3. Native GAS V8: patch quote November mengembalikan `daftar:50, bulanan:50, total:100, firstMonth:'2026-12'`. Browser membuktikan dropdown **RM50 pendaftaran sahaja / RM100 penuh** tersedia. Hanya Admin boleh mengesahkan bayaran, bukan submit borang.
4. Pemilik menguji borang sebenar: e-mel -> OTP -> submit berjaya; MyKid duplicate ditolak menurut ujian pemilik. Spreadsheet rasmi `1pHzToTNZBBvER7zk9XyQUwdl2f_XXDdpX-fEFml_UJg`, tab `NATIVE_EDAFTAR_2027` (gid 1882734011), menunjukkan:
   - Baris 5: `PENDING 2027`, `REGISTRATION_ONLY`, yuran daftar 50, yuran bulan pertama 50, jumlah tanggungan 100, `first_month_key` papar `2026-12`, belum ada bayaran disahkan.
   - Baris 6: `PENDING 2027`, `FULL`, pecahan snapshot yang sama, belum ada bayaran disahkan.
   - Tiada rekod tambahan akibat duplicate ditemui dalam bacaan setakat baris 20. Penolakan duplicate ialah laporan pengguna, bukan bukti log server.
   - Baris 2–4 ialah rekod QA sebelumnya berstatus APPROVED; baris 4 FULL 100 pernah menunjukkan `registration_paid=50`, `first_month_paid=50`, `first_month_status=SELESAI`. Bukti lama tidak menggantikan ujian approve rekod baharu.
5. Mod pembelajaran: pemilik melaporkan dropdown sementara tersekat; selepas Ctrl+Shift+R ia pulih, pilihan Fizikal dan Online tersedia. Kod frontend meminta semakan seat semula pada focus dan sementara disable pilihan; **pembetulan kekal belum diterbitkan/terbukti**. Jangan wajibkan hard refresh untuk parent; audit pasca-stabilisasi, bukan sekarang.
6. Paparan Admin `RM0.00` telah dibetulkan di `admin-2027.js` commit `145350d`, status PENDING kini papar jangkaan pilihan RM50/RM100, bukan amaun paid. Screenshot pemilik mengesahkan perubahan visual.
7. Native Admin V9: pembetulan `String(record[1])` bagi sesi 2027. Namun kelulusan masih memulangkan `Permohonan bukan PENDING 2027` kerana frontend Admin menggunakan GAS endpoint berbeza (stale `admin-2027-config.js`). Endpoint diselaraskan ke Unified Bridge active dengan commit `b153022d` pada Pages branch. Selepas pengguna clear cache, ralat bertukar ke `Bulan pertama tidak sah` (bukti pembetulan route berkesan).
8. Sel `S5:S6` pada sheet ialah Google Sheets DATE serial `46357` (dipaparkan `2026-12` melalui format `yyyy-m`), bukan teks. Native GAS V10 patch membaca `Date` menggunakan `Utilities.formatDate(...,'Asia/Kuala_Lumpur','yyyy-MM')`; owner screenshot mengesahkan **deployment V10 berjaya updated**, URL deployment sama. **Kelulusan sebenar V10 belum diuji**: OTP Admin mencapai rate limit semasa login.

## Had OTP Admin (disahkan daripada source `AdminOtpV2.gs` pemilik)

- Min 90 saat antara OTP berjaya direkod; apabila counter mencapai 5, permintaan ditolak.
- Cache `upkk:v2:otpreq:<digest>` TTL 3600 saat dari request OTP berjaya terakhir; jadi block maksimum hingga lebih kurang satu jam dari request kelima (tidak dihitung semula oleh request ditolak).
- OTP sah 600 saat; sesi Admin 1800 saat; had aplikasi 30 permintaan Admin sehari; MailApp mempunyai syarat remaining quota >20.
- Error `Had permintaan OTP dicapai. Cuba kemudian.` ialah dari aplikasi, bukannya bukti Google quota exhausted. **Jangan reset cache atau ubah limiter tanpa kebenaran baru**.

## Status pada penghentian dan tindakan minimum apabila akses OTP pulih

- Public eDaftar dibuka untuk sesi 2027; backend quote RM50/RM100 dan borang sebenar PASS. **Jangan anggap pengesahan pembayaran production siap**.
- Baris 5 dan 6 masih PENDING pada bacaan terakhir; status belum diperiksa lagi selepas halangan OTP. Jangan edit status manual.
- Bila OTP pulih, gunakan deployment Native GAS **V10 yang sama**, login Admin sekali, refresh list, kemudian **sahkan hanya baris 6 / FULL RM100 sekali sahaja** selepas semak slip sebenar. Jika ralat, ambil mesej tepat dan STOP; jangan ulang klik.
- Selepas itu semak READ-ONLY baris 6: `status_native=APPROVED 2027`, `actual_verified_amount=100`, `registration_paid=50`, `first_month_paid=50`, `first_month_status=SELESAI`, nombor resit Native unik, `record_version` bertambah, dan tiada caj berganda. Hanya apabila PASS, nilai kesan pada kad DIS 2026. Jangan ubah kad/receipts sebelum tahu sama ada ia membaca Native data.
- RM50 (baris 5) belum perlu disahkan; tangguhkan sehingga RM100 benar-benar lulus.
- Sahkan dahulu status versi Pages/current deployment jika ada isu cache, tetapi jangan buat code/deploy change automatik.

## Seni bina dan polisi OWNER

- Satu portal; Admin satu OTP Native, dashboard premium Legacy 2026 + selector 2027 dalam dashboard sama; Parent kekal login e-mel + enam digit akhir telefon, dashboard asal + rekod 2027 server-authorised; **Parent OTP bukan pendekatan akhir yang diluluskan**. Iterasi Parent OTP PILOT yang pernah diuji bukan perubahan kepada lock produk akhir.
- Pemilik memilih pilihan RM50 atau RM100 mulai November 2026; RM100 ialah RM50 daftar + RM50 yuran Disember, status bulan pertama hanya selesai selepas Admin benar-benar mengesahkan RM100; jangan double-charge.
- Elakkan ulang QA yang telah PASS; hanya satu semakan approval yang tertangguh. Tiada kod/deployment/Spreadsheet/Legacy writes dibenarkan dalam checkpoint dokumentasi ini.

## Rujukan berterusan

- `docs/UPKK_V2_ARCHITECTURE_LOCK_RELEASE_2026-11-13.md` (QA branch; lock seni bina)
- `docs/UPKK_V2_CHAT_HANDOFF_2026-11-13.md` (QA branch; sejarah integrasi)
- `docs/UPKK_V2_RELEASE_CHECKPOINT_2026-11-12.md` (sejarah, bukan status semasa)

**Checkpoint 14 November ini mengatasi kenyataan “eDaftar masih CLOSED” dalam dokumentasi lama; ia tidak membatalkan lock seni bina akhir.**
