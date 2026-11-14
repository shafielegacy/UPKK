# UPKK SL V2 — Checkpoint LIVE eDaftar & Admin Approval (14 November 2026)

**Masa checkpoint:** 14 November 2026, petang (MYT).  
**Sumber:** Ujian pemilik melalui browser, bacaan READ-ONLY Google Sheets rasmi dan source yang diberikan pemilik.  
**Status keseluruhan:** eDaftar awam/OTP/submit RM50 & RM100 terbukti berfungsi; **kelulusan Admin untuk rekod baharu BELUM PASS** kerana percubaan semasa terhenti oleh had OTP sebelum ujian V10.

## MILESTONE LIVE — 14 November 2026: Admin V12 + AutoCrat hourly trigger PASS

> **UPDATE TERKINI; mengatasi seksyen checkpoint terdahulu yang menyatakan kelulusan Admin / AutoCrat masih belum disahkan.** Semua ujian menggunakan borang sebenar, GAS production Native, dan spreadsheet rasmi tetapi rekod *dummy* milik pemilik; bukan simulasi setempat atau bukti pendaftaran ibu bapa umum. Bacaan spreadsheet adalah READ-ONLY.

### Pengesahan bayaran dan resit Native (owner, GAS V12)

- Pemilik melaporkan GAS existing deployment dikemas kini ke **Version 12 pada 14 Nov 2026 17:09 MYT**, deployment ID tidak berubah. Legacy V65 tidak disentuh.
- Bacaan `NATIVE_EDAFTAR_2027` selepas approval mengesahkan **kedua-dua rekod dummy APPROVED 2027**:

| Rekod | Pilihan | Amaun disahkan | Registration paid | First month paid | Disember 2026 | Native receipt |
|---|---|---:|---:|---:|---|---|
| SAYA ANAK TEST 1 | REGISTRATION_ONLY | RM50 | RM50 | RM0 | BELUM BAYAR | `UPKK-N-2027-0002` |
| SAYA ANAK TEST 2 | FULL | RM100 | RM50 | RM50 | SELESAI | `UPKK-N-2027-0001` |

- Kedua-dua resit production unik antara rekod disemak. Rekod pernah berada pada baris 5–6 semasa ujian; bacaan terbaru hanya memulangkan dua rekod tersebut selepas header. **Jangan bergantung pada nombor baris lama** untuk tindakan selepas ini. Rekod QA lama pernah menggunakan awalan `QA-`; jangan edit/padam tanpa arahan pemilik.
- Punca & pembetulan route approval sebelum V12: sesi 2027 numerik vs teks; frontend Admin endpoint tidak sepadan; `first_month_key` ialah tarikh Sheets; perbandingan status kolum M; generator nombor resit production menolak rekod QA berawalan `QA-`. Setiap pembetulan adalah sejarah deployment, **jangan ulang lagi**.

### AutoCrat pada tab Native 2027 — PASS daripada spreadsheet LIVE

- Pemeriksaan READ-ONLY kolum **AC:AF** menunjukkan untuk **kedua-dua rekod**: Merged Doc ID tersedia, Merged Doc URL tersedia, Link to merged Doc tersedia, dan Document Merge Status mengandungi:
  `Document successfully created; Document successfully merged; PDF created; Emails Sent`.
- Log yang direkod bagi kedua-duanya: **Run via time trigger** sebagai `upkksl@gmail.com`, dengan timestamp pada log AutoCrat `Nov 14, 2026 4:37 AM`. Jangan infer bahawa ini masa semasa Malaysia; ikut nilai log sebagaimana direkod.
- Penerima `To` pada **kedua-dua log** ialah e-mel ujian pemilik; CC serta BCC tambahan turut muncul di log. **Sahkan senarai penerima/privasi sebelum edaran kepada ibu bapa sebenar**. Alamat pihak ketiga tidak disalin ke fail milestone ini.
- Status **PASS** merujuk kepada log creation, merge, PDF dan `Emails Sent` pada spreadsheet; **bukan** pengesahan visual kandungan PDF atau penerimaan inbox semua penerima. Jangan menghantar semula resit/e-mel yang sudah tercatat tanpa keperluan sah.
- Legacy 2026 juga disahkan terus berfungsi: tab `UPKK NOV 2026` mempunyai tujuh bayaran RM40, status SELESAI, resit `001`–`007`, dan log AutoCrat PDF/Emails Sent pada setiap satu (semakan READ-ONLY). Legacy V65 tidak disentuh.

### Milestone dan baki kerja

- **PASS LIVE:** public eDaftar 2027 -> OTP e-mel -> submit slip -> penolakan duplicate menurut ujian pemilik -> rekod PENDING -> Admin OTP -> approve RM50/RM100 -> pecahan/disember -> nombor resit Native -> AutoCrat time trigger PDF/Emails Sent.
- **Belum diverifikasi:** kandungan visual PDF, actual inbox delivery kepada semua penerima, konfigurasi recipients untuk kegunaan awam, kad DIS 2026 pada dashboard Parent, dan pematuhan seni bina akhir Parent/Admin unified (dokumen lock 13 Nov). Jangan tukar Parent OTP PILOT menjadi polisi produk akhir tanpa owner GO.
- **Fasa selepas ini: kerja UI sahaja** dengan skop yang dipersetujui pemilik. Kekalkan login, backend, split fees, data, trigger, Autocrat, Legacy V65, dan deployment GAS V12. Buat branch/QA yang sesuai untuk UI, jangan ubah portal LIVE tanpa izin khusus; elak pendaftaran dummy baharu.


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


## OWNER LOCK — Paparan Parent Sesi 2027 (14 Nov 2026)

- Dashboard Parent V1 dan pemilih sesi 2026/2027 dikekalkan; Admin V1/V2 **HOLD**.
- Tarikh daftar sebenar datang daripada tab `NATIVE_EDAFTAR_2027.created_at`; bulan mula kelas/yuran pertama daripada `first_month_key`. Jangan hard-code November/Disember untuk semua murid.
- Bulan pendaftaran berbeza dengan bulan pertama: tunjuk berasingan; jika bulan sama, **satukan menjadi satu kad bulan** dengan butiran yuran daftar dan yuran pertama.
- Bagi peristiwa dalam tahun 2027, semat ke kad Jan–Dis 2027 yang berkaitan supaya tiada kad pendaftaran berganda. Bagi peristiwa 2026, letak dalam bahagian Permulaan Sesi sebelum kad Jan–Dis 2027.
- `registration_paid`, `first_month_paid` dan `first_month_status` mesti ikut rekod backend, bukan simpulan berdasarkan RM100 sahaja. `BELUM TERSEDIA` bukan tunggakan atau `BELUM BAYAR`.
- Frontend `parent-existing-2027.js` sudah ditambah logik dinamik (commit `ba60c740`). **Kontrak belum lengkap pada LIVE:** `pagesParentExistingLogin` semasa hanya memulangkan studentName, classYear, mode, registrationPaid, firstMonthPaid, firstMonthStatus, receiptNumber. Backend mesti menambah dua medan sah `createdAt` dan `firstMonthKey` kepada respons yang telah disahkan, tanpa membuka data PII tambahan dan tanpa ubah Legacy. Selagi tiada dua medan ini, UI akan memaparkan tarikh/bulan sebagai belum tersedia dan tidak boleh dianggap end-to-end PASS.
- Perubahan yang melibatkan Native GAS V12 memerlukan semakan dan owner GO tersendiri; **tiada GAS push, version, deploy, sheet write atau AutoCrat edit** dibuat oleh perubahan frontend ini.


## MILESTONE LIVE — Parent 2027 Dynamic Intake PASS (14 Nov 2026, malam MYT)

**UPDATE TERKINI — menggantikan penanda belum siap di seksyen sebelumnya untuk paparan Parent.**
- Pemilik menyimpan pindaan **dua fail Native GAS sedia ada**: `UnifiedParent2027.gs` memulangkan `createdAt` daripada `created_at` dan `firstMonthKey` daripada `first_month_key`; `NativeParentExistingLogin2027.gs` memetakan dua medan tersebut dalam respons approved 2027 sahaja. Pengekalan verifikasi e-mel + enam digit akhir telefon; tiada Parent OTP, pembukaan PENDING/REJECTED atau pendedahan MyKid/alamat.
- Pemilik menunjukkan screenshot **"Deployment successfully updated"**, **Native GAS Version 13, 14 November 2026 jam 20:08 MYT**, dengan **deployment ID sedia ada** (bukan projek/deployment baharu). Ini pengesahan owner dari UI deployment, bukan pemeriksaan independent deploy log.
- Screenshot dashboard LIVE pemilik untuk **SAYA ANAK TEST 1** membuktikan: **November 2026 — DAFTAR PADA 14/11/2026, RM50 diterima**; **Disember 2026 — YURAN BULAN PERTAMA BELUM BAYAR, RM0 dibayar**; 12 kad Januari–Disember 2027 kekal `BELUM TERSEDIA`. Pemilik mengesahkan "mantap". Ini **PASS untuk paparan TEST 1 sahaja**; jangan dakwa klik TEST 2 / aliran bayaran sudah diuji.
- Polisi UI OWNER LOCK: tarikh daftar dan `first_month_key` menentukan bulan, bukan November/Disember hard-code; jika daftar dan mula kelas bulan sama, kad digabung; peristiwa 2027 disemat ke grid Jan–Dis 2027 tanpa duplikasi. `BELUM TERSEDIA` bukan tunggakan. Frontend commit `ba60c740`, cache PWA `062c5d1e`, dokumentasi awal `c82ea71c`.
- **Admin premium V1/V2: HOLD atas arahan owner.** Legacy V65, spreadsheet rasmi, Forms, AutoCrat, data pembayaran dan resit tidak diubah oleh kerja frontend ini.
- Catatan: seksyen awal yang menyebut Native V10/V12, approved belum PASS, atau kad Disember belum tersedia adalah **catatan sejarah**, bukan status terkini.

### NEXT OWNER APPROVED SCOPE — Native eBayar monthly activation (BELUM IMPLEMENT)

- Pemilik menerima cadangan supaya **setiap 1 haribulan**, kad yuran **bulan berkenaan** yang telah dibuka dan masih `BELUM BAYAR` boleh diklik untuk menuju aliran **Native eBayar** bagi **anak dipilih, sesi 2027, kunci bulan `YYYY-MM`** yang betul.
- Sebelum 1 haribulan bulan itu, **jangan buka pembayaran lebih awal**; `SELESAI` tidak boleh membawa ke bayar sekali lagi; `BELUM TERSEDIA` bukan automatik `BELUM BAYAR`. Yuran pertama Disember 2026 untuk TEST 1 ialah baki RM50; TEST 2 FULL RM100 telah melunaskan yuran pertama, **jangan caj kali kedua**.
- **Mesti ada server-side enforcement** tarikh Malaysia (Asia/Kuala_Lumpur), status/kelayakan bulan, pemilikan anak dan amaun; menyahaktifkan klik dalam browser sahaja **bukan kawalan pembayaran**. Aktivasi pada 1hb merujuk awal bulan kalendar setempat, bukan arahan untuk scheduler menulis ke spreadsheet atau menandakan semua murid tertunggak.
- Tindakan minimum selepas milestone: **audit READ-ONLY** route/page Native eBayar, data dan kontrak monthly ledger, mekanisme anti-duplikasi/idempotency dan bulan semasa; laporkan jurang sebelum sebarang pengaktifan atau deployment. Pada checkpoint ini **tiada kod eBayar diubah, tiada transaksi/ujian bayaran baharu, tiada trigger atau data diubah**.


## PRIORITI 1 — Audit READ-ONLY Native eBayar (14 November 2026, malam)

**Tujuan:** guna semula modul yang pernah diuji; **bukan** menyambung Legacy eBayar, mengaktifkan transaksi atau mengubah backend LIVE secara terus.

### Bukti sumber dan lokasi

- Native eBayar QA asal memang wujud di `feature/native-ebayar-12bulan-qa/NativeEbayar.gs` (18,101 aksara). Fungsi sedia ada: `loginNativeEbayar`, `getNativeEbayarQuote`, `submitNativeEbayar`, `listNativeEbayarAdmin`, `decideNativeEbayarAdmin`.
- Referensi SPKM `shafielegacy/SPKM/Code.js` mempunyai `getNativeEbayarStudentLookup`, `validateNativeEbayarSubmissionV2_`, `preflightNativeEbayarSubmission`, `submitNativeEbayarPayment`, serta pengesahan semula dan kawalan bayaran pendua. Kod SPKM **rujukan rekabentuk sahaja**, tidak boleh copy kontrak ID/tahun/ledger SPKM ke UPKK.
- `NATIVE_EBAYAR` dengan 25 kolum wujud di BACKUP `1aY5rHWYL3-K8IMGcVQNWS9uyahEwwLHdaVMag8YwYoo` (6 rekod QA `SELESAI`, resit `UPKK-M-2026-0001` hingga `0006`) **dan** workbook rasmi `1pHzToTNZBBvER7zk9XyQUwdl2f_XXDdpX-fEFml_UJg` (**0 rekod transaksi** setakat bacaan). Jangan memindahkan 6 rekod QA ke rasmi secara automatik.
- Folder Drive yang dipilih owner: **Native Resit UPKKSL**, ID `1Whg2nIgt2mQSVloY_TtAy5cMAstcvEgO`. Metadata Drive menunjukkan folder sebenar dimiliki `upkksl@gmail.com`, tidak ada permission anyone pada senarai yang dipulangkan. **Tujuan folder ialah resit Native**, bukan semestinya folder bukti slip pindahan bank; pastikan dua destinasi tidak tersalah guna dan jangan expose permission folder. Belum diset sebagai Script Property.

### Kesesuaian dan jurang kritikal

1. `neGuard_` QA memaksa `SPREADSHEET_ID` = ID **BACKUP 03 Nov**, bergantung `UPKK_NATIVE_EBAYAR_QA_ENABLED`. Jangan menukar ID/flag secara terus untuk menembusi gate QA; perlu kontrak/gate production baharu yang jelas, default OFF.
2. `loginNativeEbayar` dan `neChild_` QA bergantung `TAB.DAFTAR`, `STATUS_PERMOHONAN`, identiti MyKid dan token GAS lama, sedangkan Native GAS V13 memakai `NATIVE_EDAFTAR_2027`, `APPROVED 2027`, parent login e-mel + 6 digit akhir telefon dan POST di GitHub Pages. Pilih adapter server-side yang tidak percaya identiti/ID anak daripada browser sahaja. Kekalkan child authorisation dan rate limit.
3. `nePaymentYear_` QA **sudah menguatkuasakan** `yyyy-MM <=` tarikh Malaysia (`Asia/Kuala_Lumpur`), bermula Dis 2026; tidak perlu trigger harian/cron untuk membuka kad 1hb. Tambah backend status per-bulan yang disahkan supaya frontend membolehkan kad hanya apabila eligible; quote/submit mesti mengulangi gate server-side.
4. `submitNativeEbayar` QA secara keras **menolak semua bayaran tahun 2026** walaupun `nePaymentYear_` membenarkan Disember — bertentangan dengan polisi semasa. Jangan buang guard tanpa mengesahkan quote dan first-month credit dari `NATIVE_EDAFTAR_2027` supaya murid yang sudah bayar penuh RM100 tidak dicaj kali kedua; murid RM50 daftar sahaja masih berhutang RM50 yuran pertama.
5. `neSheet_` QA boleh cipta tab apabila `create=true`; production `NATIVE_EBAYAR` **sedia ada**. Production adapter perlu fail-closed pada schema mismatch, **tiada auto create/alter**, append hanya selepas owner GO dan lock/idempotency.
6. `submitNativeEbayar` QA menggunakan DriveApp + base64 untuk bukti bayaran, `google.script.run`; Pages perlu route POST yang berautentikasi dan terikat kepada anak, bukan GET/JSONP/credential/token di URL. Folder **bukti bayaran** mesti diluluskan secara berasingan daripada folder **resit PDF**. Semakan jenis fail, had saiz, signature perlu dikekalkan.
7. `decideNativeEbayarAdmin` QA menolak duplicate `SELESAI`, tapi receipt allocation/PDF/AutoCrat adalah fasa berasingan. Jangan automatik menggunakan AutoCrat QA atau menandakan PDF/Emails Sent tanpa bukti. Admin unified masih HOLD; perlu laluan keputusan bayaran yang serasi dengan token Admin V13 apabila sampai fasa itu.
8. `openEBayarForm()` pada `index.html` Pages semasa membuka Google Form **Legacy**; kad Native 2027 **mesti tidak** memanggil fungsi tersebut.
9. **Belum terbukti**: route POST GAS V13 menerima Native eBayar, skema ledger produksi yang lengkap dengan dedup di sisi server, penulisan receipt/AutoCrat produksi atau aliran eBayar Parent end-to-end. Jangan label Native eBayar production-ready.

### Urutan minima pelaksanaan yang dikunci

- **Step A (READ-ONLY dahulu):** periksa `NativeCore.gs` / router POST Native V13 dan mekanisme sesi Parent yang sedia ada, untuk tentukan adapter eBayar paling kecil.
- **Step B (isolated source):** tambah kalkulasi eligibility `YYYY-MM` di backend read-only dahulu; sumber pembayaran ialah gabungan `NATIVE_EDAFTAR_2027` (credit first month) dan `NATIVE_EBAYAR` (monthly ledger). Frontend kad `SELESAI` / `PENDING` / `BELUM BAYAR` / `BELUM TERSEDIA` ikut server. 
- **Step C (approval terhad):** hanya selepas auth, schema, no-double-charge, slip folder, receipt folder, Admin verification dan rollback ditentukan, sediakan submit + Admin approval di isolated QA. Bukan auto-deploy LIVE.
- **Step D:** QA sintetik sahaja dan owner GO untuk release; simpan deploy ID sama jika diluluskan. Legacy V65, Forms, AutoCrat lama dan data rasmi tidak dipinda dalam audit.

**Status checkpoint:** Audit source QA, SPKM dan metadata folder/sheet READ-ONLY selesai. Production Native eBayar **BELUM AKTIF**. Tiada transaksi, fail resit atau data ditulis.


## IMPLEMENTATION CHECKPOINT — Native eBayar Parent UI (14 Nov 2026, malam)

- Owner explicitly chose **same Native GAS project, no extra QA deployment/environment/dummy registration**. Existing Native GAS V13 saved `NativeEbayar2027.gs` (production-additive default OFF), `NativeCore.gs` route `pagesNativeEbayar`, and `NativeParentExistingLogin2027.gs` response field `applicationId`. These were saved manually by owner; **not independently verified as deployed**. No GAS push/deployment/Script Property change performed in this step.
- Frontend `parent-existing-2027.js` updated **on existing `pages/frontend-v1.34` branch** (commits `c407201d`, `b39db55d`), no second portal/file. PWA cache refreshed commit `ff6c245c`.
- Parent dashboard still shows 2026/2027 selector; non-2027 parents do not get Native buttons. For a previously APPROVED 2027 child and a month that has begun in `Asia/Kuala_Lumpur`, offer **Semak / bayar yuran**. Nothing is offered for future months, already-paid first month or missing `applicationId`.
- Clicking opens an embedded modal (not Legacy `openEBayarForm`); Parent re-enters last six phone digits (not stored), route `pagesNativeEbayar` RPC `quote` authorises child/period/amount on server; only if `canSubmit=true` show month-specific proof upload (JPEG/PNG/PDF <=3MB), payment method and date. Submitting goes to RPC `submit`. Server rechecks eligibility under lock; no unsafe GET/JSONP or credential in URL.
- Frontend currently offers navigation on browser-calculated Malaysia date; **the true payment gate must remain on GAS server**. Backend production flag `UPKK_NATIVE_EBAYAR_PRODUCTION_ENABLED` defaults OFF. Therefore **no submissions will succeed** until owner deliberately configures proof folder, deploys updated GAS and enables the flag. No 2026-12 transaction is allowed before 1 December 2026 server time.
- Existing AutoCrat hourly merge rule owner-LOCK: `APPROVED_BY is not null`; only successful Admin APPROVE sets `STATUS=SELESAI` and `APPROVED_BY`, REJECT/PENDING leave it empty. Do not change AutoCrat job.
- **Remaining before enable:** confirm dedicated PRIVATE *proof upload* folder ID (different from resit output folder `Native Resit UPKKSL` ID `1Whg2nIgt2mQSVloY_TtAy5cMAstcvEgO`), ensure `UPKK_V2_FEES_2027.bulanan` is configured, connect front-end Admin list/decide UI to Native eBayar action (backend has the RPC), review permissions/scopes and update existing GAS deployment only with owner GO. Existing eDaftar flow must not be modified.
- Status: **UI code integrated into GitHub**, JS syntax checked; **end-to-end Native eBayar NOT ACTIVE / NOT VERIFIED**. No fake registration, payment, workbook writes or extra QA undertaken.


## V14 production deployment checkpoint — 14 November 2026, 22:00 MYT

- Owner showed Apps Script screenshot: **Existing Native GAS Web App deployment successfully updated to Version 14** on 14 Nov 2026 at 22:00. No second deployment/URL.
- Owner confirmed `UPKK_NATIVE_EBAYAR_PROOF_FOLDER_ID=1fCfYaSZYQ9YKvBs6iCkprWnyqTTy6Lex`; Drive verified folder **Bukti Bayaran Native**, inside parent **Native Resit UPKKSL**; owned by `upkksl@gmail.com`. Receipt destination remains separate.
- Existing fee policy `UPKK_V2_FEES_2027={"session":"2027","daftar":50,"bulanan":50}`; keep unchanged. `UPKK_NATIVE_EBAYAR_PRODUCTION_ENABLED` property **does not exist** as of owner report, therefore default OFF.
- `NativeEbayar2027.gs` provided for manual addition to same GAS project; user confirmed saved. Source re-opened for 14 Nov review: POST RPC signatures `quote(email,pin,applicationId,monthKey)`, `submit(email,pin,applicationId,monthKey,paymentDate,method,proof)`, `adminList(token)`, `adminDecide(token,requestId,decision,amount,reason)`. Syntax passed (Node JS parser). It enforces server-side date minimum `2026-12`, first-month settled credit, LockService duplicate prevention, exact live spreadsheet/header, and APPROVED_BY only on approval.
- Existing parent frontend `parent-existing-2027.js` and existing Admin OTP frontend `admin-2027.js` wired to these RPCs in same portal; Admin commit `1d6faf31`, portal script version `8ed31875`, cache key `1194bef3`.
- **Still not independently verified:** actual deployed GAS V14 source/permissions, that GitHub Pages is serving the same frontend branch at public URL, real Parent/Admin RPC end-to-end, or AutoCrat receipt output. Avoid claiming live payment ready without verification. Do not use dummy registration/payment, extra QA project/deployment, or mutate official sheets.
- Next owner-controlled decision: confirm public Pages version, then explicitly enable `UPKK_NATIVE_EBAYAR_PRODUCTION_ENABLED=true` in same Native GAS Script Properties when ready; no backend redeploy is required for Script Property changes. Never activate before confirming UI/binding.


---

## MILESTONE CONFIRMED — Native eBayar V14 LIVE connectivity and Parent status (14 November 2026, evening)

> **This is the latest checkpoint and supersedes the earlier OFF / NOT ACTIVE statements above.** Those earlier sections are retained as chronological history; do not treat them as the current runtime status.

### Owner-observed evidence (screenshots, 14 Nov 2026)

1. **Native GAS Web App deployment V14** — Apps Script confirmation: "Deployment successfully updated", Version 14 dated **14 Nov 2026 at 22:00 MYT**. Updated the *existing* deployment; no separate deploy URL.
2. **Public GitHub Pages Admin OTP dashboard** — screenshot showed original registration list with 2 approved Native 2027 records, summary 2 applications / 0 pending / RM150 confirmed registration/first-month payments, and **Bayaran Bulanan · Native eBayar 2027** section in the **same** Admin dashboard.
3. **Native eBayar Admin API reachable** — following owner activation of the production property and click on **Muat Semula Bayaran Bulanan**, screenshot showed **0** pending monthly payments, **"Senarai bayaran bulanan dikemas kini."** and **"Tiada bukti bayaran bulanan menunggu pengesahan."** This supports the Admin `adminList` POST connection at that moment. The exact Script Property value was not separately captured; success is consistent with the gate being enabled. Do not state the property was independently read by an assistant.
4. **Parent 2027 dashboard from public portal**, using existing parent login and session selector, showed both approved children correctly, with the same login / one dashboard:
   - `SAYA ANAK TEST 1`: Nov 2026 registration RM50, December 2026 first month **BELUM BAYAR**, first-month paid RM0, registration receipt number visible, November registration date 14/11/2026.
   - `SAYA ANAK TEST 2`: Nov 2026 registration RM50, December 2026 first month **SELESAI**, first-month paid RM50, registration receipt number visible, November registration date 14/11/2026.
   - Child picker works. 2026/2027 session selector present. No pay button shown for December on 14 November, consistent with opening at **00:00 MYT 1 December 2026**.
5. **The two existing TEST 1/TEST 2 records predate this checkpoint.** No new dummy registration or payment was performed for this milestone.

### Configuration kept

- One portal: `https://shafielegacy.github.io/UPKK/`; frontend changes committed in `pages/frontend-v1.34`.
- One existing Native GAS deployment (V14); no new deployment ID; existing eDaftar URL remains valid.
- Official Native spreadsheet remains unchanged by this milestone; `NATIVE_EDAFTAR_2027` and `NATIVE_EBAYAR` are independent ledgers. **0 pending monthly payments** is an Admin-reported state, not proof of successful submission.
- Fee property **unchanged**: `UPKK_V2_FEES_2027={"session":"2027","daftar":50,"bulanan":50}`.
- Payment proof folder: `UPKK_NATIVE_EBAYAR_PROOF_FOLDER_ID=1fCfYaSZYQ9YKvBs6iCkprWnyqTTy6Lex` (Drive folder **Bukti Bayaran Native**). Existing hourly AutoCrat receipt output folder remains **Native Resit UPKKSL**.
- Native payment activation was requested and Admin connection confirmed by UI. Keep server-side eligibility and child ownership checks, duplicate prevention, and **APPROVED_BY is not null** AutoCrat merge gate. Keep Legacy 2026, registration AutoCrat, official 2026 records, forms, and data untouched.
- Admin consolidation into the original Premium V1 dashboard remains **HOLD** under previous owner directive; this checkpoint covers the current Native 2027 OTP dashboard, not a completed final unified premium dashboard.

### Assessment and honest remaining gaps

**Confirmed:** V14 deployment update; correct Parent session/child displays; correct paid/unpaid December first-month snapshots; Admin monthly list API connection and zero PENDING; public Pages contains the monthly section; no evidence of an interruption to existing registration in the observed screenshots.

**Not yet confirmed:** successful upload of a *real* Parent proof; correct write to `NATIVE_EBAYAR`, first-month credit and idempotency in an actual transaction; Admin `adminDecide` live approval/rejection and `APPROVED_BY` semantics; AutoCrat monthly receipt generation/delivery; Parent display of a newly approved monthly payment; real behaviour on 1 Dec 2026. Do **not** describe the whole payment-to-receipt journey as production-verified.

### Next priority — minimal, no new QA

1. **Freeze stable V14**: do not change eDaftar, Legacy, Sheets, AutoCrat, GAS deployment or GitHub Pages without a specific new requirement. Owner directive: **NO MORE QA environments, duplicate projects, dummy registrations/payments or repeated tests**.
2. **First real Parent monthly payment on or after 1 Dec 2026**: Parent uses existing 2027 dashboard, chooses approved child/month, obtains server quote, uploads genuine proof (only real transaction). First-month prior payment (TEST 2) must block duplicate.
3. Admin reviews genuine payment under same OTP dashboard, approves/rejects based on proof, then checks ledger status / `APPROVED_BY` and hourly AutoCrat output **once**. Investigate only if actual transaction fails; preserve evidence and avoid re-submitting blindly after uncertain response.
4. **Later, separate owner approval** for final premium unified Admin V1/2027 dashboard (currently HOLD), UI polish, and optional removal/archival of the two historical test records—never delete production rows without explicit GO.

### GitHub milestone references

- Frontend Parent eBayar: `c407201d` + PIN fix `b39db55d`
- Admin eBayar section: `1d6faf31`
- Portal asset version: `8ed31875`; service-worker refresh: `1194bef3`
- V14 documentation checkpoint: `1a7dad27`
- This milestone update is documentation-only; **no source, data or deployments modified**.


## 14 November 2026 — Premium Admin V2 integration resumed (owner GO)

- One Admin Native OTP, one original premium dashboard shell `#page-admin`, session selector 2026 / 2027. No new portal, GAS project, QA deployment, or dummy transaction.
- The existing frontend `admin-2027.js` now requests 2026 dashboard data with the OTP session token via `getAdminLegacy2026ReadOnly`, and renders metrics, month cards and chart in the original dashboard. 2027 registration approvals and monthly eBayar remain inside the same dashboard.
- The old Admin login response and cached Legacy Admin session in `index.html` are redirected to the Native OTP flow rather than accepted as an Admin session. Parent login unchanged.
- The Legacy 2026 functions that still call endpoints without Native token (Murid, Senarai Bayaran, Sync Murid and shortcuts) are temporarily unavailable from this OTP view. Historical 2026 metrics are **read-only**. Do not describe all original Admin functions as migrated.
- GitHub updates: `234331b3`, `3c55ac98`, `36ffe349`, and PWA cache `a49144e1`. Syntax checks passed. Authenticated runtime and actual 2026 bridge response **NOT VERIFIED**.
- No GAS V14, Legacy V65, official sheet, AutoCrat, registration or payment modification in this integration. Next: one Admin OTP browser check of premium 2026 view and 2027 selector, without QA transactions. If it fails, inspect the Admin frontend changes without changing backend or existing eBayar.


## 14 Nov 2026 — Admin Premium one-menu-one-view navigation

Owner explicitly confirmed the Premium 2026 dashboard had recovered (102 pupils, RM19,000 in the owner screenshot) and 2027 selector displayed Native registration/payment panels. Requested cleaner sidebar where each view is independent.

**In-place Pages frontend changes** on `pages/frontend-v1.34`:
- `admin-2027.js` now organises original premium DOM into six views per session: Dashboard Utama, Status Bulanan, Kutipan per Bulan, Pengurusan Murid, Senarai Bayaran, Scan Duplikat MyKid. Only the selected panel is visible. Same Admin OTP, same page and 2026/2027 selector.
- 2026 dashboard keeps OTP-guarded read-only summary, month status grid and chart, each in its own view. Historical payment entries are presented read-only under Senarai Bayaran. Other Legacy management/scanning actions remain visibly unavailable pending authorised backend routes; **no unauthenticated Legacy operation is re-enabled**.
- 2027 Dashboard Utama retains summary metrics; Pengurusan Murid uses existing registration Admin listing and approval controls; Senarai Bayaran uses original Native eBayar Admin approval panel. Status Bulanan / Kutipan per Bulan state clearly that a complete Native 2027 monthly ledger view/chart is not yet implemented. No new computed or fictitious financial figures.
- `index.html` styles emerald-gold responsive sidebar nav and independent panels. Updated JS asset query and PWA cache.
- GitHub commits: `cce793bf` (navigation), `97adc0d6` (CSS), `b65de71c` (2027 collection placeholder), `37a400f3` (PWA cache).
- JS parser passed for updated Admin source. **Browser visual/authenticated checks NOT YET VERIFIED** for this change. Owner should check once; no repetitive QA environments, dummy registration, payment or OTP cycles.
- No modifications to Native GAS V14, Legacy V65, Google Sheets, eDaftar, eBayar backend, AutoCrat or parent frontend.


## Premium Glass UI — Phase 1 approved and implemented (14 Nov 2026)

Owner approved the TikTok-inspired glassmorphism visual direction for UPKK SL Premium Admin V2. The illustrated mockups are **design references, not live screenshots or actual UPKK figures**. Implemented a CSS-only, Admin-scoped foundation in the existing `index.html` of branch `pages/frontend-v1.34`.

- Shared emerald/gold/ivory design tokens, layered low-contrast background, translucent stat/chart/month cards, soft gold highlights, consistent rounding/shadows and renewed sidebar active-state.
- Applies to both 2026 and 2027 Admin panels without changing their one-menu-one-view routing. Parent HTML and Native GAS are unchanged.
- Subtle `backdrop-filter` only on larger screens and only when supported; legible translucent fallbacks on mobile; dark mode retains its prior styles. Keyboard focus contrast retained.
- Visual-only CSS: no API calls, registration/payment/receipt logic changes, artificial data, numeric animations, authentication changes, or new libraries.
- GitHub commits: `eb230ba6` (Phase 1 CSS), `5402a2df` (PWA cache). UI in a real logged-in browser is **not independently verified**; owner should inspect once in the existing portal. No new QA environment or dummy transaction.
- **Next visual phases** (separately scoped): Phase 2 login/transition/modal motion; Phase 3 charts and count-up using real figures only; Phase 4 mobile performance. Do not implement them as part of Phase 1.


## Premium Motion UI — Phase 2 (14 Nov 2026)

Owner approved Phase 2 after Phase 1 Glass CSS. Changes on existing `pages/frontend-v1.34` branch, frontend only:

- Login: one-time entrance motion for existing brand logo, heading and login card; lightweight fade/slide on login/eDaftar tab switch. Labels and authentication flow unchanged.
- Original Admin Premium V2: subtle fade/slide for selected menu panel; active sidebar gold focus and hover states without affecting one-panel routing.
- Existing Parent/Legacy HTML modal surfaces receive a glassy emerald/ivory/gold style and subtle entrance; **no replacement of native `window.confirm`/`window.prompt`** for approval/rejection of registration or monthly payments. All financial confirmation semantics unchanged. Toast/loading styles refreshed.
- No added CSS/JS libraries, animation framework, external API, backend endpoint, session storage, fake data, number rolling or mutation of GAS V14/Sheets/AutoCrat.
- Respects `prefers-reduced-motion: reduce`; visual CSS falls back to static content and original interactions. Lightweight effects; motion is not a loading/authentication prerequisite.
- GitHub: `3f1df545` (Phase 2 motion CSS), `21f81d15` (PWA cache). Parser/brace checks and main inline JavaScript syntax pass. **Real-device visuals not yet independently verified**.
- Owner reported Admin OTP rate limit reached during previous checks; do not relax/bypass OTP for cosmetic verification. Login motion itself can be viewed without OTP. After cooldown, only inspect existing panel views; no dummy transactions or repeat test cycles.
- Future separate scope: custom accessible financial confirmation dialogs only after behavioural/keyboard/focus review; number rolling/charts is Phase 3 and must use real data.


## Parent Premium Glass — Phase 1 and 2 (14 November 2026)

Owner explicitly requested that both Premium Glass phases already applied to Admin should also apply to the original **Parent dashboard**, without losing existing UX or native payments.

- Parent 2026: scoped `#page-dashboard` glass design tokens and translucent action/status/summary/month cards; emerald-gold child header and focus styles. One-time lightweight entrance effect for key dashboard elements, subtle hover effects; safe static fallbacks.
- Parent 2027: `parent-existing-2027.js` existing injected stylesheet extended for student details, first-month/registration cards, 12 month status cards, and Native eBayar modal glass styling. Its authentication, child/session verification, server quote/submit flow, calendar gates and financial controls **unchanged**.
- The Phase 2 login entrance and generic Parent/Legacy modal refinements are reused. Both Parent sessions retain their existing layouts/selection mechanisms, one portal, and confirmed payment statuses; no mock-up figures are inserted.
- CSS supports reduced motion; expensive blur only on desktop with support and no reduced-transparency preference. No new frameworks, external asset downloads, Script Properties or backend writes.
- Pages commits: `a621080b` (2026 Parent CSS), `7ed54e1e` (2027 Parent CSS), `27d1a274` (versioned Parent script), `a8196907` (PWA cache).
- JS syntax validation for edited Parent module passed; final mobile/browser rendering has **not yet been verified**. No GAS deployment, Sheets, AutoCrat, Parent authentication or Native eBayar changes.


## Security hardening checkpoint — 15 November 2026 (owner GO)

**Scope:** Frontend GitHub Pages `pages/frontend-v1.34` only. Approved objective is raising security to ≥9/10, but **9/10 is NOT attained or verified**. No GAS V14/V65, Sheets, Forms, AutoCrat, OTP limits, payments or triggers changed. The 2026 and 2027 Premium Glass UI remains intact.

**Implemented:**

1. `index.html`: removed 17 production console messages, including raw login response, parent/child names, login address, dashboard data and backend fetch URL diagnostics. Commits `74af3273`, `a7231f41`.
2. `sw.js`: fetch interceptor now only handles exact same-origin paths in the explicit static `urlsToCache` allowlist with **no query parameters**; API/GAS/cross-origin requests are no longer cached or intercepted. Checks `Cache-Control: private/no-store`, successful basic responses only; previous old-version caches are deleted on service worker activation. Commit `c2d62a81`.
3. `index.html`: removed persistent Parent `upkk_session` writes and clears historical persistent copy on page load. Parent tab session uses `sessionStorage` with 30-minute expiry, checked at restore; expired/malformed copies discarded, logout cleans both stores. Child switching retains the same-tab flow. Commits `3d3fdae5`, `d0247cea`. **Parent will need to log in again once after this update**; closing browser tab and expiration can also require re-login. This is a client-side retention improvement, **not a cryptographically authenticated server session**.
4. Parser check: main `index.html` JavaScript, `sw.js`, `admin-2027.js` and `parent-existing-2027.js` syntax PASS. Static checks: no console logging in these files, no persistent `upkk_session` writes in index, and SW allowlist present. Browser, live OTP login, network behaviour and actual cached response validation **NOT VERIFIED**.

**Unresolved release-blocking/high-priority findings:**

- Legacy `gasApiFetch` still sends Parent email and 6-digit telephone credential through GET URL and can fall back to JSONP; `submitBayaran` can put request data in URL, depending on Legacy endpoint. **Do not shut this off in the frontend alone** or Parent Legacy 2026 login/payment may break. Need server-side authenticated POST replacement in a safe isolated Native bridge, verified for correct 2026/2027 access, before cutting over Legacy public GET/JSONP. **No change made to V65 deployment**.
- Existing Parent Legacy backend requests still require verification of server-side ownership checks, admin method authorisation and old GAS deployment exposure. Restrict public data reads/writes after evidence is obtained; avoid production data migrations.
- Parent tab session still contains an in-memory/temporary copy of the user record; further minimise fields and use an opaque, server-validated session when backend supports it. Tab storage and TTL alone do not protect against XSS or backend impersonation.
- Full security rating remains **provisional** (previous audit 5/10); this hardening is helpful but insufficient to claim 9/10, and a read-only deploy/config audit plus controlled authenticated tests are required. No real parent registration, dummy payments, OTP bypass or repeated login tests permitted.

**Next safe work sequence:** read-only verify Legacy source and pinned deployment exposure; prepare documented server-side POST + authorisation bridge design and exact rollout/rollback before deploying. Preserve production and all existing Parent/Native flows until equivalent authenticated replacement is ready.


**Additional local source inspection:** The supplied `Code.gs` Legacy source has a `doGet`/`doPost` `_handleApi` switch with `getAdminDashboard`, `syncMuridToForms`, `testResit`, `scanDuplikasiIC`, and payment actions without an explicit per-action token/role check in that routing switch. Treat as a **critical conditional deployment exposure**: file contents alone do NOT establish which exact pinned V65 deployment version currently runs or whether upstream access restrictions mitigate it. No live endpoint probes were made. The replacement must enforce role and ownership **server-side** on each operation. Never attempt to prove this with real pupils' data, public exploit requests, or dummy transactions.


## Legacy 2026 security migration plan — router-level source review (15 Nov 2026)

**Assessment source:** owner-supplied original `Code.gs`, inspected READ-ONLY on 15 Nov. Its `doGet` routes `?action=...` to `_handleApi`; `doPost` also calls the same router. The router switch does not exhibit a session/role/owner guard before each action. It permits optional JavaScript callback wrapping (JSONP). **Pinned V65 deployed source/access settings remain NOT VERIFIED.** The following is therefore a *conditional source-code risk*, not a claim that the live deployment is exploitable.

### Route decision matrix (for an isolated server-authenticated replacement)

| Legacy action | Source behaviour | Minimum required replacement control | Old public GET/JSONP |
|---|---|---|---|
| `login` | Email plus six-digit phone credential; also checks a legacy Admin credential path | POST only; Parent identity verification, uniform errors, rate limiting and session issue; Admin uses Native OTP only | Retire after migration |
| `getDashboard` | Reads pupil and payment status using caller-supplied identifying fields | POST; authenticated Parent session and server-side child ownership and session 2026 scoping | Retire after migration |
| `getResit` | Returns monthly receipt link using caller-supplied email/month | POST; Parent session, exact child/month ownership and approved receipt status; no arbitrary file URL lookup | Retire after migration |
| `submitBayaran` | Appends a 2026 monthly payment row with supplied email/child, and row status `SELESAI` | **NO-GO until separate writer review**; server session and ownership, immutable fee/month policy, amount/file validation, dedup/lock, pending review semantics and AutoCrat compatibility | Do not cut over blindly |
| `getAdminDashboard` | Returns 2026 admin summary | Native OTP admin token/role check; read-only data minimisation | Disable public exposure after replacement verified |
| `getSenaraiByuran`, `getSenaraiMuridDaftar`, `getTiadaBayarDanKonsisten`, `scanDuplikasiIC` | Returns admin/reporting data | Native OTP, admin role verification and minimum necessary fields; MyKid masking | Disable public exposure after replacement verified |
| `syncMuridToForms`, `kemasFormEbayar` | Can alter Forms/sync state | Authenticated Admin with separate explicit action approval, audit trail, anti-repeat and protected trigger/form constraints | Must not be callable publicly |
| `testResit` | Returns arbitrary tab/row values by caller parameters | **Remove from all production public routers**; diagnostics only in isolated authorised maintenance, with redacted test data | Must not be callable publicly |

### Locked migration contract

1. **Preserve original:** never edit pinned V65 or 2026 workbook, Forms, AutoCrat, existing receipts/fees/rows, triggers, Script Properties, or deployments in this planning step. No live writes, dummy registration or payments.
2. **Confirm deployed reality READ-ONLY:** compare the original source to the actually pinned deployment's version/access settings and look for any separately active endpoints. A source file is not proof of the deployed version.
3. **Isolated bridge design:** reuse the existing approved Native GAS project/endpoint only when its owner and deployment binding are verified; do not introduce a second portal. Use HTTPS POST `text/plain` JSON for browser compatibility and a strict RPC allowlist. Reject unknown/unintended methods. **POST alone is not authentication**.
4. **Authentication:** one Native Admin OTP flow; Parent retains the existing email + six-digit phone experience (no added Parent OTP). After Parent verification issue a random short-lived opaque server-side session. Server must derive which children/sessions can be read; never trust front-end email, child name, row ID, session, amount or role on its own. Enforce TTL, explicit logout/revocation, rate limits and same-Parent checks.
5. **2026 isolation:** default read-only access to 2026. 2027 additions live on their separate Native data paths. Do not merge schema or write data in 2026 through the bridge. Any future 2026 writer is a separate reviewed and owner-approved change.
6. **No sensitive URL:** no credentials, application ID, token, receipt URL or pupil data in GET query, JSONP callback or access logs. Public GET/JSONP can be retired only after the authenticated replacement works and old external consumers are inventoried.
7. **Release gates (all required):** static checks, permission-matrix review, isolated synthetic negative tests (cross-parent, cross-child, unauthorized admin, expired/replayed token, unexpected RPC, cross-year), one specifically authorised controlled live read, and owner confirmation that original 2026 dashboard/receipt/Parent access still work. No write smoke tests against official 2026 workbook.
8. **Rollback:** keep original deployment/version pinned and the last verified frontend commit; revert only the new frontend switch if a safe bridge route fails. Rollback must NOT re-enable a vulnerable public endpoint or turn on any disabled writer without separate owner approval.
9. **Rating discipline:** the project's earlier provisional 5/10 is **not** raised to 9/10 by plans or static syntax checks. Real deployment and authorisation evidence are mandatory.

**Current state:** route review and design plan complete; no Native GAS source change, deployment change, Google account action, endpoint probing, or authenticated transaction. Bridge implementation and production switch remain **NO-GO pending exact deployed source/account verification and authorisation coverage**.
