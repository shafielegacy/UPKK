# UPKK V1 → V2 — Native eDaftar: Milestone & Laporan Ujian Google

## Dashboard Admin No. 6 — 17 November 2026 (MYT)

**Frontend `2.0-RC3-Admin-D6.1`** pada `pages/frontend-v1.34`. Cache PWA `upkk-v2-static-20261117-admin-d6-1`. Deployment Native sedia ada menggunakan **V26**.

- **Dashboard Utama.** Paparan jumlah permohonan, Diluluskan, Menunggu Semakan, Ditolak dan kutipan disahkan. Pecahan tahun dan mod mengira murid yang diluluskan.
- **Status Bulanan.** Jadual meliputi Disember 2026 hingga Disember 2027. Status Selesai, Dalam Semakan, Belum Bayar, Belum Bermula dan Tak Berkenaan mengikut bulan yuran murid. Bayaran bulan pertama yang disahkan semasa daftar sudah dikreditkan dalam bulan tersebut.
- **Kutipan per Bulan.** Graf menggunakan tarikh kelulusan dalam waktu Malaysia. Pecahan pendaftaran dan yuran bulanan dikira dalam sen. Yuran bulan pertama daripada pendaftaran dimasukkan sekali. Kutipan merangkumi bayaran yang disahkan.
- **Autorisasi.** `getAdminV2Dashboard2027` menggunakan router POST Native serta pengesahan token, tamat sesi dan allowlist Admin sedia ada. Agregat hanya membaca tab rasmi. V25 digunakan sebagai asas kod keluaran.
- **Ujian.** 13 semakan backend dan 7 semakan frontend lulus, termasuk semakan token, pecahan kutipan, bulan belum bermula dan padanan kod Parent P0.3.

| Bacaan rasmi semasa pengesahan (MYT) | Nilai |
| --- | --- |
| Permohonan · diluluskan · menunggu · ditolak | 28 · 28 · 0 · 0 |
| Tahun 3 · Tahun 4 · Tahun 5 | 4 · 6 · 18 |
| Fizikal · Online | 16 · 12 |
| Kutipan November 2026 · pendaftaran · yuran bulanan | RM1,950 · RM1,400 · RM550 |
| Yuran Disember 2026 · selesai · belum bermula · belum bayar | 11 · 17 · 0 |
| Transaksi Native eBayar semasa bacaan | 0 |

[Buka portal Admin LIVE](https://shafielegacy.github.io/UPKK/?admin=1)

### Paparan Status Bulanan Admin Sesi 2026 — `2.0-RC3-Admin-D6.2`

Tab **Status Bulanan · 2026** kini memaparkan 11 kad, dari Januari hingga November. Disember 2026 ialah bulan yuran pertama dalam **Status Bulanan · 2027**. Pembetulan terhad kepada paparan kad Admin 2026.

Cache PWA `upkk-v2-static-20261117-admin-d6-2`. Ujian terkawal mengesahkan 11 kad, paparan dan tindakan November, serta baris yuran Disember 2026 bagi Sesi 2027.

## Slip pendaftaran Parent sesi 2027 — 17 November 2026 (MYT)

**Frontend `2.0-RC3-Parent-P0.3`** pada `pages/frontend-v1.34`. Cache PWA `upkk-v2-static-20261117-parent-p0-3`. Deployment Native sedia ada menggunakan **V25**. Keluaran ini diterbitkan daripada komit [`40d41bb`](https://github.com/shafielegacy/UPKK/commit/40d41bb06edf349ded086ed17bb9dc5166a9e86c).

- **Pengesahan pemilik di LIVE.** Pada 17 November 2026, pemilik mengesahkan melalui tangkapan skrin bahawa butang **Lihat Slip Pendaftaran** muncul pada kad **November 2026** dalam bahagian **Permulaan Sesi** di dashboard Parent **Sesi 2027**. Kad **Disember 2026** memaparkan yuran bulan pertama sebagai **SELESAI**.
- **Cara buka slip.** Pilih **Sesi 2027**, sahkan PIN dan pilih murid. Tekan **Lihat Slip Pendaftaran** pada kad pendaftaran di **Permulaan Sesi**. Butang tersedia apabila AutoCrat sudah menjana PDF dan akaun Google penjaga berdaftar mempunyai akses kepada fail.
- **Akses PDF.** Akses Viewer bagi satu PDF sebenar telah disahkan untuk e-mel penjaga berdaftar. Fail ditetapkan sebagai **Restricted** dan notifikasi perkongsian dimatikan. Pengesahan pembukaan PDF menggunakan akaun penjaga menunggu ujian pengguna sebenar.
- V25 dibina daripada V24 dengan pindaan slip dalam `NativeParentExistingLogin2027`. Snapshot Apps Script HEAD dengan draf Admin dipulihkan dan disahkan sebelum pertukaran versi.
- Ujian terkawal meliputi padanan slip bagi murid yang dipilih, PDF tanpa akses penjaga, pengesahan semula PIN selepas refresh, 11 kad sesi 2026 dan bayaran bulan pertama pada sesi 2027.

## Dashboard Parent Jan–Nov 2026 — 17 November 2026 (MYT)

**Frontend `2.0-RC3-Parent-P0.2`** pada `pages/frontend-v1.34`. Cache PWA `upkk-v2-static-20261117-parent-p0-2`.

- **Parent sesi 2026.** Tajuk `Status Yuran Jan–Nov 2026` dan ringkasan `Selesai`, `Belum` serta `N/A` merujuk kepada 11 kad. Kad November kekal memaparkan status, amaun dan resit sedia ada. Resit Disember 2026 masih boleh dirujuk melalui Resit Digital.
- **Parent sesi 2027.** Ujian regresi meliputi pilihan sesi dan pengesahan PIN selepas refresh, paparan Disember 2026 yang sudah dibayar serta tarikh mula bayaran 1 Disember bagi bulan pertama yang masih belum dibayar. Grid Jan–Dis 2027 kekal 12 kad.
- **Penerimaan pemilik.** Pemilik mengesahkan akses dual-session dan pengesahan PIN sesi 2027 pada release `2.0-RC3-Parent-P0.1`.

## P0 Parent sesi 2027 — 17 November 2026 (MYT)

**Frontend `2.0-RC3-Parent-P0.1`** pada `pages/frontend-v1.34`. Cache PWA `upkk-v2-static-20261117-parent-p0-1`.

- **Punca selepas refresh.** Portal memulihkan sesi tab Legacy 2026. Keputusan semakan Native 2027 hanya wujud dalam memori dan hilang apabila halaman dimuat semula.
- **Login baharu.** Frontend terdahulu menyembunyikan pemilih sesi 2027 apabila semakan Native gagal. Respons penolakan, had percubaan dan masalah sambungan menghasilkan paparan yang sama. Ujian terkawal menghasilkan semula gejala ini. Punca percubaan LIVE untuk akaun terlibat belum disahkan.
- **Aliran Parent.** Selepas refresh, Parent boleh guna dashboard 2026 dan tekan **Sahkan sesi 2027** pada pemilih sesi. Pengesahan semula memerlukan enam digit terakhir telefon. Respons Native yang sah membuka dashboard 2027. PIN dihantar dalam body POST dan dibersihkan daripada input. Semakan baharu berlaku apabila Parent menghantar pengesahan.
- **Semakan release.** Chrome membaca respons penolakan JSON daripada kedua-dua endpoint LIVE dengan input kosong. Ujian Chrome terkawal meliputi Legacy sahaja, Native sahaja, pertukaran sesi dan refresh, PENDING/REJECTED, kegagalan sambungan, timeout dan had percubaan. Fixture RM100 menunjukkan RM50 pendaftaran, RM50 bulan pertama dan `SELESAI` untuk bulan yang dibayar. Grid Jan–Dis 2027 memaparkan 12 kad. Pemilik kemudian mengesahkan akses dual-session dan pengesahan PIN sesi 2027 dalam portal LIVE.
- **Skop.** Keluaran Pages meliputi pemilih sesi, pengangkutan login Parent, mesej ralat dan cache PWA. Ujian regresi Admin serta penyelarasan borang sedia ada lulus dengan data sintetik.

## Checkpoint penutupan malam — 16 November 2026 (MYT)

**Status:** Dokumentasi dan handoff sahaja; TIADA perubahan kod, GAS, deployment, trigger, Google Sheets, resit atau data melalui checkpoint ini. **Last verified frontend**: `2.0-RC3-Admin-G23.2` pada `pages/frontend-v1.34`; Native GAS **V24** ialah baseline yang telah disahkan untuk Admin Google popup. Work seterusnya *melaporkan* menerbitkan agregat read-only Dashboard sebagai **Native GAS V25** pada deployment asal sebelum usage limit tamat; **status versi deploy dan liputan kod V25 belum disahkan secara bebas di checkpoint ini**. Frontend belum menggunakan agregat; Dashboard Admin No. 6 masih **IN PROGRESS**.

### Penerimaan operasi LIVE oleh pemilik

- **eDaftar Parent 2027:** Google Sign-In, pengisian/penghantaran pendaftaran yang cepat, bukti bayaran dan paparan kejayaan dilaporkan **PASS**. Slip pendaftaran/PDF diperoleh, tetapi pemilik terpaksa menjalankan AutoCrat secara manual kerana menunggu job berkala yang mengambil masa sekitar **1 jam**.
- **Admin 2027:** Google login popup berjaya pada desktop dan Android; kelulusan beberapa permohonan sebenar telah dibuat oleh Admin/Ustaz, dan sekurang-kurangnya **satu** mesej Telegram `Pendaftaran Disahkan` berjaya diterima. Mesej bagi sebahagian kelulusan lain **tidak** masuk — jangan tandakan notifikasi sebagai 100% PASS.
- **Rekod rasmi:** semakan read-only pada tab `NATIVE_EDAFTAR_2027` malam ini menemui **24 APPROVED 2027, 0 PENDING**, dengan tarikh kelulusan. Ini snapshot semasa semakan, bukan angka kekal atau bukti penghantaran Telegram. Rekod approved tidak boleh diulang approve untuk menguji notifikasi.
- **Dashboard Parent:** selepas Admin meluluskan, Parent boleh login dan melihat dashboard masing-masing, termasuk akses sesi 2027. Kes khusus Parent yang turut mempunyai Legacy 2026: selepas **refresh** login masih aktif tetapi selector/paparan 2027 hilang dan tinggal dashboard 2026. Rekod murid dan penjaga telah dipadankan secara read-only pada kedua-dua tab; Native masih `APPROVED 2027`.
- **PWA update popup:** pemilik telah mengesahkan isu popup reload berulang **PASS/CLOSED** pada peranti yang diuji.
- **Native eBayar Disember:** kekalkan **1 Disember 2026** sebagai tarikh aktif yang dirancang. Bayaran bulan pertama yang telah diluluskan semasa daftar mesti dikreditkan, tanpa caj kedua. Tingkah laku LIVE pada 1 Disember **belum disahkan**.
- **Kes slip format:** satu kes upload ditolak oleh validasi signature; pemilik memilih **MONITOR / bukan release blocker** sementara tiada kes berulang dilaporkan.

### Repair dan pembaikan susulan (jangan laksana tanpa GO berasingan)

1. **P1 — Dashboard Admin No. 6:** diselesaikan pada 17 November 2026. Rujuk [milestone keluaran](#dashboard-admin-no-6--17-november-2026-myt).
2. **P0 — Parent dual-session refresh:** dibaiki dalam `2.0-RC3-Parent-P0.1`. Selector 2026/2027 dan pengesahan semula Native selepas refresh lulus dalam ujian Chrome terkawal. Pemilik mengesahkan akses dual-session dan pengesahan PIN sesi 2027.
3. **P1 — Buang butang sidebar `eBayar Yuran` Parent:** tangkap layar 16 Nov mengesahkan item sidebar redundan; kod `index.html` masih mengikatnya kepada `openEBayarForm()` (laluan form Legacy terus). **Buang/hide hanya entry sidebar** supaya Parent bayar melalui **kad bulan yang layak diklik**, dengan modal/form Legacy atau Native berdasarkan sesi dan pemeriksaan server. Jangan membuang kad bulan, mengaktifkan bulan awal, memintas kelulusan, atau mengubah eBayar. Nilai juga pintasan `Tindakan Pantas` supaya tidak memintas laluan kad, tetapi jangan ubah tanpa skop.
4. **P1 — Telegram Notification Reliability:** semak helper selepas kelulusan, sebab beberapa mesej approval tidak sampai walaupun semua rekod sudah `APPROVED`. Semak status API (termasuk 429), logging selamat, dedupe, dan retry **notifikasi sahaja**; jangan ulang penulisan rekod/approval atau menghantar berganda. Penyebab sebenar belum dibuktikan.
5. **P2 — Masa penjanaan slip AutoCrat:** pemilik menyatakan tunggu sekitar sejam lalu menjalankan AutoCrat secara manual untuk memperoleh slip. Semak masa proses, trigger sebenar, kuota dan risiko salinan PDF/e-mel berganda; cadang kaedah lebih pantas yang **idempotent** dengan status `PENDING`/dokumen, tanpa menukar trigger atau templat LIVE sebelum kelulusan.
6. **P2 — SEC26 dan Legacy:** backend authorisation/role, pemisahan data, resit Legacy 2026 dan access controls masih audit berasingan; tiada bypass fungsi Legacy.

**Peraturan sambung esok:** baca checkpoint ini + sumber frontend LIVE semasa; semak kewujudan/perlindungan V25 sebelum edit Dashboard No. 6; *read-only first*. Jangan ulang audit V23.2 Google popup atau cipta data ujian. Rekod pilihan kerja pemilik selepas semakan. Pastikan semua kod yang mengubah PWA menaikkan cache/version untuk pengguna sedia ada.

---

## Milestone LIVE — Admin Google Sign-In V23.2 (16 November 2026)

- Pada V23.1, Chrome Android menghantar pengguna ke GAS `/exec` selepas pemilihan akaun. Android membuka pautan itu dalam Google Drive dan memaparkan ralat halaman.
- Portal memulakan `initCodeClient` Google Identity Services dalam mod `popup`. Callback JavaScript menghantar kod melalui POST ke Native GAS. GAS menggunakan origin `https://shafielegacy.github.io`, klien OAuth production yang sama dan rahsia dalam Script Properties untuk menukar kod. [Panduan Google Identity Services](https://developers.google.com/identity/oauth2/web/guides/use-code-model)
- Cabaran Admin diikat pada pengesah dalam tab dan digunakan sekali sahaja. GAS menyemak tuntutan identiti Google termasuk `email_verified` dan allowlist sebelum mengeluarkan token sesi Admin. Panggilan `decideAdminV2Application` terus memerlukan sesi Admin yang sah.
- Native GAS V24 diterbitkan pada 20:37 MYT melalui deployment Native sedia ada. Sumber berubah dalam `AdminGoogleV23.gs` dan `PagesAdminV2Production.gs`. Frontend dan cache PWA dikemas kini ke G23.2 pada komit [`2a60d55`](https://github.com/shafielegacy/UPKK/commit/2a60d55003bd9712c1d4eb25f5027bc3596f245c).
- Semakan LIVE pada Chrome desktop membuka dashboard dalam tab portal asal. Senarai sesi 2027 dimuatkan dan log keluar berjaya. Pemilik mengesahkan dashboard Admin terbuka pada portal selepas memilih akaun Google dalam Chrome Android.
- Pengesahan SAHKAN dan TOLAK meliputi paparan butang dan semakan kebenaran pada backend.
- Callback V23.1 masih tersedia untuk percubaan yang bermula sebelum penerbitan G23.2.

Portal Admin LIVE [Log Masuk Admin](https://shafielegacy.github.io/UPKK/?admin=1)

## Checkpoint pemilik: Admin Google di telefon PASS + TODO aktif (16 November 2026)

**User acceptance terbaru:** pemilik mengesahkan selepas pembetulan V23.2 bahawa **Google Sign-In Admin boleh digunakan di telefon dan kembali ke dashboard portal GitHub Pages**. Insiden Android sebelum ini yang terhenti pada `script.google.com` / Google Drive **selesai untuk peranti yang diuji**. Source semasa: `2.0-RC3-Admin-G23.2`, Google Identity Services `ux_mode:'popup'`, commit rujukan `2a60d55003bd9712c1d4eb25f5027bc3596f245c`. Jangan anggap semua model Android/browser telah diuji.

**Had bukti:** kejayaan login dan paparan senarai permohonan tidak sama dengan bukti lengkap tindakan **Sahkan Bayaran**, rekod yuran, notifikasi selepas kelulusan atau resit. Semua kekal sebagai semakan operasi berasingan.

### TODO semasa — keutamaan selepas parent mula daftar LIVE

| Prioriti | Perkara | Status & kriteria selesai |
| --- | --- | --- |
| **P0** | **Aliran kelulusan Admin 2027** | **OPERASI PASS (16 Nov):** pemilik/Ustaz sudah meluluskan beberapa permohonan sebenar, rekod spreadsheet semuanya APPROVED dan sekurang-kurangnya satu Telegram kelulusan diterima. **Namun** keandalan penghantaran Telegram masih OPEN; semak resit/padanan jumlah secara berasingan. Jangan approve semula rekod hanya untuk ujian. |
| **P2** | **Ralat muat naik slip pada telefon** | **MONITOR:** hanya satu kes format fail tidak sepadan setakat laporan pemilik; bukan blocker LIVE. Jika berulang, semak MIME/signature JPEG/PNG/PDF dan proses tukar fail tanpa hilang borang, kekalkan had 3 MB dan perlindungan slip. |
| **P1** | **Paparan kejayaan Parent V22.3** | **PASS oleh pemilik:** Parent berjaya daftar dan menerima maklum balas kejayaan; status bayaran/kelulusan kekal berasingan. |
| **P0** | **Login Parent yang sudah diluluskan** | **PASS PEMILIK** pada `2.0-RC3-Parent-P0.1`. Parent dual-session boleh membuka dashboard 2026 dan sahkan semula akses 2027 dengan PIN selepas refresh. |
| **P1** | **Native eBayar & status 12 bulan sesi 2027** | **TUNGGU 1 DIS 2026 untuk pengesahan LIVE:** kad bulanan dirancang hidup ikut tarikh; RM50 pendaftaran sahaja memerlukan bulan pertama, RM100 (daftar+bulan mula) sudah kredit bulan tersebut. Jangan double charge atau paksa aktivasi awal. |
| **P1** | **Dashboard Admin sesi 2026/2027** | **SELESAI — NO. 6 (17 Nov 2026).** Dashboard Utama, Status Bulanan dan Kutipan per Bulan sesi 2027 tersedia dalam `2.0-RC3-Admin-D6.1` dan Native V26. Akses 2026 kekal read-only. |
| **P1** | **Popup kemas kini PWA berulang** | **PASS/CLOSED (pengesahan pemilik pada peranti diuji)** untuk V23.2. Setiap perubahan frontend berikutnya tetap perlu bump cache/version PWA. |
| **P1** | **Parent 2027 hilang selepas refresh (dual-session restore)** | **OPEN / BUG PAPARAN:** pemilik melaporkan Parent yang berdaftar dalam Legacy 2026 dan Native 2027 kekal login selepas refresh, tetapi sesi/pemilih 2027 hilang dan hanya dashboard 2026 dipaparkan. Semakan read-only mengesahkan murid dan penjaga yang sama wujud pada kedua-dua tab dan rekod Native berstatus `APPROVED 2027`. Punca kod yang kuat: `index.html` memulihkan `upkk_session` Legacy melalui `loadDashboard()` tetapi **tidak memanggil** `UPKKParentExistingV2.afterLegacyLogin()` pada restore; `parent-existing-2027.js` menyimpan `children`/`verified` dalam memori yang terpadam ketika reload. Reka semula pemulihan sesi 2027 melalui pengesahan server-side yang berautoriti atau re-auth yang jelas; **jangan** simpan PIN enam digit telefon, MyKid, bukti bayaran atau identiti sensitif dalam localStorage/query string. Kekalkan sesi 2026, pemilih 2026/2027, pilihan sesi asal apabila selamat, fungsi Parent dan keselamatan data. Pengesahan end-to-end selepas pembetulan belum dibuat. |
| **P1** | **Telegram Notification Reliability — kelulusan 2027** | **OPEN:** 24 APPROVED / 0 PENDING pada snapshot read-only 16 Nov, tetapi beberapa mesej kelulusan tidak diterima. Semak panggilan helper, HTTP/429, dedupe dan retry terkawal untuk notifikasi sahaja; kelulusan rekod bukan masalah. Jangan dedahkan token/chat ID atau buat approve semula. |
| **P1** | **Buang sidebar eBayar Yuran Parent** | **OPEN — UI repair:** entry pada sidebar memanggil `openEBayarForm()` terus dan mengelirukan laluan sesi. Buang entry sidebar sahaja; kekalkan 12 kad bulan dan buka pembayaran Legacy/Native hanya apabila kad layak diklik dengan semakan server. Jangan ubah bayaran atau aktifkan Disember sebelum waktunya. |
| **P1** | **Kad Disember 2026 — paparan Parent Legacy** | **SELESAI** dalam `2.0-RC3-Parent-P0.2`. Parent sesi 2026 memaparkan Jan–Nov dengan 11 kad dan ringkasan berdasarkan tempoh yang sama. Disember 2026 kekal dipaparkan dalam sesi akademik 2027 bagi murid yang berkaitan. |
| **P2** | **AutoCrat slip pendaftaran terlalu lambat** | **FUTURE IMPROVEMENT:** pemilik terpaksa menjalankan AutoCrat secara manual selepas menunggu lebih kurang sejam. Audit trigger sebenar/masa penjanaan, idempotency, kuota dan risiko PDF/e-mel pendua; cadang penjanaan lebih cepat tanpa mengubah trigger/templat LIVE sebelum GO. |
| **P2** | **Keselamatan dan compatibility keseluruhan** | **AUDIT BERASINGAN:** sahkan session/token/allowlist Admin V24, pengasingan data 2027, endpoint Legacy V65, akses resit dan hak penjaga. Jangan tutup endpoint Legacy atau mengganti fungsi sehingga keserasian 2026 dibuktikan dan pemilik memberi GO. |

**Keutamaan operasi:** fokus kelulusan permohonan yang sedang masuk dan ralat slip Parent dahulu; kemudian status Parent, eBayar, PWA dan hardening. Dokumentasi ini bukan arahan untuk menjalankan perubahan LIVE. Semua penulisan kod/deployment/data memerlukan skop dan kelulusan tersendiri.

---

## Milestone LIVE — Admin Google Sign-In V23.1 (16 November 2026)

**Status:** USER ACCEPTANCE PASS untuk login dan paparan dashboard Admin sesi 2027. Pengesahan transaksi sebenar belum diuji melalui bukti screenshot. Ini adalah checkpoint semasa, berasingan daripada laporan QA sejarah 3 November dan milestone eDaftar V22.3.

- **Isu asal:** OTP Admin tidak dapat dihantar dengan mesej "Perkhidmatan OTP tidak tersedia. Cuba kemudian." Source `requestAdminV2Otp` menunjukkan mesej tersebut boleh muncul apabila `MailApp.getRemainingDailyQuota() <= 5`; baki kuota sebenar tidak pernah disahkan. Jangan catat penyebab sebagai terbukti.
- **Penyelesaian telah dikeluarkan oleh Work:** Admin menggunakan Google Sign-In pada portal LIVE sedia ada. Pemilik mengesahkan boleh login dan melihat dashboard, tanpa membuat portal kedua.
- **Bukti visual pemilik:** menu Admin asal kekal; sesi 2027 dipilih; `Pengurusan Murid · 2027` memaparkan 20 rekod, termasuk status `PENDING 2027`, butang `Lihat Bukti Transaksi`, `Sahkan Bayaran` dan `Tolak`. Tiada dakwaan bahawa butang SAHKAN sudah digunakan atau transaksi sebenar sudah diluluskan.
- **Bukti source GitHub:** `index.html` mengisytiharkan `2.0-RC3-Admin-G23.1`, `admin-2027-config.js` mempunyai `googleEnabled:true` dan `googleOnly:true`, dan `admin-2027.js` mengandungi aliran Admin Google. `version.json` juga sepadan dengan G23.1. PWA cache: `upkk-v2-static-20261116-admin-google-g23-r2`.
- **OTP legacy:** nota release `version.json` masih menyatakan OTP Admin sebagai fallback jika Google gagal. Jangan anggap endpoint/fungsi OTP backend sudah dipadam. Google-only dalam UI tidak bermaksud auth lama ditutup di server.
- **Keselamatan:** login Google Admin berjaya dilaporkan pemilik; audit bebas terhadap semua backend authorization/role-check dan fungsi approval selepas release ini **belum direkodkan** dalam checkpoint ini.
- **PWA update loop:** terdapat commit source `19524ad0665a356190da8140905cb81c8145abca` bertajuk `fix(pwa): stop repeated update prompt on reload`. Hasilnya pada peranti Parent/Admin **belum diuji semula**; status belum boleh ditutup.
- **Had perubahan dokumentasi:** penulisan checkpoint ini hanya pada Markdown GitHub. Tidak mengubah GAS, frontend, deployment, OAuth, Google Sheets, Telegram, AutoCrat, resit, Legacy 2026 atau data Parent.

**Komit rujukan sebelum dokumentasi:** `19524ad0665a356190da8140905cb81c8145abca` pada `pages/frontend-v1.34`. Tiada PIN, password, OTP, token, ID murid atau nama individu dimasukkan dalam laporan awam.

---

## Kemas kini milestone LIVE — 16 November 2026 (MYT)

**Skop:** Native eDaftar Sesi 2027 di portal GitHub Pages, bukan pertukaran login Parent Legacy 2026 atau login Admin. Bahagian laporan bertarikh 3 November di bawah ialah rekod QA sejarah; status *BELUM RELEASE* di situ tidak lagi mewakili keadaan eDaftar 2027 pada 16 November.

### Keputusan & bukti

- **Google Sign-In Parent untuk eDaftar 2027: LIVE (user acceptance).** OAuth Google berjaya mengesahkan e-mel penjaga dan mengeluarkan tiket melalui Native GAS. Google-only tersedia pada UI awam; field e-mel diisi daripada akaun Google yang disahkan. Pemilik berjaya menggunakan akaun Google bukan pilot pada 16 November.
- **Pendaftaran Native:** pemilik melaporkan satu penghantaran berjaya disimpan dalam tab `NATIVE_EDAFTAR_2027`, bukti bayaran diterima dan notifikasi Telegram masuk. UI memaparkan respons server bahawa permohonan serta slip diterima; status pendaftaran/bayaran masih menunggu pengesahan Admin. Baris ujian tersebut telah dipadam oleh pemilik sebelum semakan bacaan semula; oleh itu hasil itu dicatat **PASS berdasarkan penerimaan pemilik dan screenshot**, bukan audit bebas row/Telegram yang masih wujud.
- **V22.2 Google-only:** pilihan OTP dikeluarkan daripada *frontend* eDaftar. Backend OTP lama dan Native Admin OTP **tidak** ditutup atau diubah dalam release frontend ini. Pengesahan Admin menggunakan token sesi sedia ada.
- **V22.3 Success UI:** selepas backend membalas `success: true` untuk `submitNativeEdaftar`, form digantikan dengan halaman kejayaan yang menyatakan permohonan diterima, nama murid, e-mel Google, jumlah bukti bayaran serta **MENUNGGU PENGESAHAN PENTADBIR**. Jika status penghantaran gagal/tidak pasti, success UI **tidak** dipaparkan dan Parent diminta menghubungi urusetia sebelum cuba lagi. Tiada panggilan tulis tambahan.
- **Versi PWA:** cache `upkk-v2-static-20261116-edaftar-googleonly-g22-r3`; portal `2.0-RC3-eDaftar-G22.3`, borang `Paparan eDaftar V22.3`. Tiada fail/deployment GAS tambahan diwujudkan.
- **GitHub Pages source:** branch `pages/frontend-v1.34`, HEAD checkpoint `bc69c5472ec3074c8b01ac0d3b7fffa42b7b76d5`; semakan source selepas commit menunjukkan 11/11 invariants PASS, termasuk JavaScript syntax, pengesahan Google, submit sedia ada, status success dan cache version.
- **Parent outreach:** pemilik telah menyebarkan pautan borang kepada penjaga untuk mula mendaftar pada 16 November 2026.

### Sempadan dan isu masih terbuka

1. **Popup kemas kini berulang pada portal:** pemilik melaporkan butang *Reload Sekarang* masih memaparkan popup lagi. **OPEN / belum diperbaiki atau disahkan selesai.** Jangan kelirukan dengan kegagalan pendaftaran.
2. **Ujian skrin kejayaan V22.3 selepas patch:** source GitHub PASS; ujian manual di telefon selepas patch belum dilaporkan, dan tidak perlu cipta row dummy LIVE semata-mata untuk mengulangi penghantaran. Semak pada permohonan sebenar berikutnya.
3. **Admin auth:** Native Admin masih OTP; perubahan kepada Google Sign-In Admin berasingan berasaskan allowlist/server-role merupakan **cadangan untuk skop lain**, bukan release ini. Jangan menggantikan OTP dengan kata laluan ringkas spreadsheet sahaja. Tidak ada PIN, kata laluan, token atau e-mel peribadi dipindah ke dokumentasi awam.
4. **Data/sistem dipelihara:** Legacy 2026, Admin, AutoCrat, Telegram, yuran, resit dan struktur spreadsheet tidak diubah oleh frontend patch V22.2/V22.3. Native eBayar/dashboard Parent bukan sebahagian daripada pengesahan release eDaftar ini.
5. **Akaun Google tertentu:** backend V22 menolak sesetengah identiti Google pihak ketiga yang e-melnya tidak boleh disahkan secara autoritatif; jangan menganggap semua alamat e-mel pihak ketiga disokong.

**Prinsip release:** LIVE bukan bermaksud seluruh projek SEC26 sudah 100% lulus. Perubahan authentication/switch backend atau data rasmi memerlukan semakan berasingan. Pada 16 Nov, laporan ini dikemas kini sebagai dokumentasi sahaja, tanpa mengubah GAS, spreadsheet, trigger atau data.

---


**Tarikh:** 3 November 2026 (MYT)  
**Status:** Native eDaftar QA berjaya diuji dengan Google sebenar dalam **projek dan spreadsheet salinan**. **BELUM RELEASE / BELUM PRODUCTION READY.**  
**Repository:** `shafielegacy/UPKK`  
**V1 LIVE:** branch `master`, baseline sebelum laporan `196daeabdf2b3fa2316cd55c4ddd6eea3ca2b3bd`  
**Kod calon:** branch `feature/native-edaftar-v1-qa`, checkpoint `9268681105d538d8d3524e63ae014e1051c88ae5`  
**Prinsip pemilik:** SIMPLE · STABLE · SECURE; kekalkan **rupa dan aliran V1**. Tukar hanya laluan Google Form pendaftaran/bayaran kepada Native eDaftar/eBayar, tambah OTP dan resit PDF yang bersesuaian. **Jangan redesign dashboard**, bina Master List besar atau tambah spreadsheet rasmi tanpa keperluan.

> Dokumen ini ialah **catatan pembangunan/QA**, BUKAN bukti bahawa kod QA sudah masuk `master` atau GAS LIVE. Semua URL/ID peribadi, MyKid, OTP, nombor telefon serta butiran penjaga/murid dikecualikan.

## 1. Keputusan pemilik projek yang kekal

- **V1 yang terbukti** menjadi asas V2. Login penjaga, pilihan anak, 12 kad bulan, popup status, eSemak dan dashboard Admin kekal secara prinsip.
- Native eDaftar bermula dengan pengambilan **Disember 2026 untuk sesi akademik 2027**, dan sistem perlu menyokong sesi seterusnya.
- Murid yang menyambung **tidak didaftarkan sebagai murid baharu** hanya kerana sesi berubah; rekod 2026/histori bayar tidak dipadam atau dimigrasikan secara pukal.
- Pengambilan baharu 2027 menurut perbincangan pengasas: **Tahun 3 dan Tahun 4** (lazimnya 9 dan 10 tahun). Borang QA ketika milestone masih mempunyai pilihan umur 9–12; **hadkan/padankan pilihan dengan aturan sesi sebenar sebelum release**, termasuk kes umur tak sama dengan tahun sekolah.
- **Yuran bulanan** bermula Disember 2026 dinyatakan **RM50** untuk penambahan mata pelajaran (Bahasa Arab, Akidah, Ibadah). **Yuran pendaftaran baharu belum disahkan oleh pengasas.** Aturan legacy: jumlah RM80 merangkumi RM40 pendaftaran + RM40 bulan pertama. **Jangan tafsir RM50 sebagai keseluruhan bayaran daftar.**
- Cadangan diluluskan untuk diteroka: **Tetapan Yuran pada Admin V1** — kadar pendaftaran dan bulanan berasingan, mengikut sesi; kadar yang dipakai pada permohonan direkod sebagai sejarah. **BELUM DIBANGUNKAN.** Label bukti bayaran `RM50` pada borang QA adalah *sementara* dan tidak boleh di-hardcode untuk release.
- Native eBayar gaya SPKM, pengesahan urusetia dan resit PDF merupakan **kerja seterusnya**, bukan sebahagian daripada milestone ujian eDaftar ini.

## 2. Baseline V1 yang diaudit (read-only)

### Struktur tab `DAFTAR UPKK` dalam workbook rasmi

| Kolum | Makna |
|---|---|
| A–H | Timestamp, email penjaga, nama penjaga, nama murid, MyKid, umur, telefon, alamat |
| I | Pautan bukti bayaran |
| J | `BAYARAN` |
| K | `NO RESIT` — `ARRAYFORMULA` V1 |
| L | `STATUS` — `ARRAYFORMULA` V1 |
| M–P | Empat kolum output AutoCrat `DAFTAR UPKK 2026` |
| Q–T | Pengelasan umur 9/10/11/12 |
| U | Ruang sedia ada / flag legacy jika digunakan; jangan overwrite tanpa audit |
| V | **Tambahan dalam spreadsheet BACKUP QA sahaja:** `STATUS_PERMOHONAN` |

**Penting:** `STATUS` V1 asal bukan nilai statik: `=ARRAYFORMULA(IF(ROW(H:H)=1,"STATUS",IF(LEN(H:H),"SELESAI","")))`. Menulis `PENDING 2027` terus pada L106 memecahkan spill `ARRAYFORMULA` dan menghasilkan `#REF!`. Formula K1 pula menjana nombor resit berdasarkan nombor baris, bukan bukti bayaran disahkan.

Sebelum percubaan QA, audit rasmi mendapati **100 murid berrekod**: umur 9 (1), umur 10 (32), umur 11 (67), dan tiada umur di bawah 9 dalam medan umur yang direkodkan. Ini ialah umur pada rekod 2026, **bukan pengesahan kelas akademik 2027**.

### Trigger GAS LIVE (pemerhatian UI pemilik)

- `onEbayarUPKKSubmit`: spreadsheet / on form submit; paparan error rate 0%.
- `onEdaftarFormSubmit`: Google Form / on form submit.
- Kedua-duanya diset pada **HEAD**. Mengubah kod dalam projek GAS LIVE boleh memberi kesan kepada trigger walaupun deployment `/exec` tidak diganti; **jangan patch GAS LIVE untuk ujian**.

## 3. Persekitaran QA sebenar

1. Pemilik menyalin **spreadsheet rasmi**, bersama projek GAS `container-bound`. Salinan dinamakan `BACKUP UPKK V1 - 03 NOV 2026` (spreadsheet dan projek GAS). Salinan juga menghasilkan sejumlah salinan Google Form yang berkaitan; **tidak digunakan untuk ujian native**.
2. Projek GAS BACKUP didapati mempunyai **0 installed triggers**.
3. `SPREADSHEET_ID` dalam `Code.gs` projek BACKUP telah ditukar secara manual kepada ID spreadsheet BACKUP. **Kod pada branch GitHub QA mungkin masih menunjukkan ID workbook rasmi**; jangan copy semula dan terus Run tanpa membetulkan ID.
4. Pemilik memasang secara manual `Code.gs`, `index.html`, `NativeEdaftar.gs` dari branch QA. Manifest ditambah OAuth scope Drive, selain Sheets dan Mail.
5. Script Properties GAS BACKUP: `UPKK_NATIVE_EDAFTAR_ENABLED`, `UPKK_NATIVE_EDAFTAR_TEST_EMAIL` (allowlist **satu** e-mel ujian), `UPKK_NATIVE_EDAFTAR_SLIP_FOLDER_ID` (folder Drive restricted). Nilai sebenar tidak disimpan dalam GitHub.
6. Test deployment `/dev?view=edaftar` digunakan. Ini **bukan** deployment awam `/exec`. Borang dalam GAS HTML Service menggunakan `google.script.run` untuk data sensitif; paparan GitHub Pages QA hanya bertindak sebagai pautan pembuka halaman GAS, bukan saluran penghantaran MyKid/OTP/slip melalui URL atau JSONP.
7. Folder slip QA masih merupakan folder restricted di akaun UPKK yang sama dan mungkin mengandungi fail ujian; perlu diaudit/dibersihkan selepas ujian. **Backup spreadsheet bukan bermaksud semua sumber Drive automatik diasingkan.**

## 4. Fungsi calon yang dibina

- Native eDaftar dalam tab login V1: nama penjaga, e-mel, telefon, nama murid, MyKid, umur, alamat, slip JPEG/PNG/PDF sehingga 3 MB, OTP.
- OTP 6 digit melalui MailApp, tempoh 10 minit, cooldown 60 saat, had percubaan, pengesahan yang mengeluarkan tiket sekali guna. `UPKK_NATIVE_EDAFTAR_ENABLED` ialah feature flag; satu e-mel penguji dibenarkan ketika smoke test.
- Backend: semak MyKid berganda, lock semasa transaksi, validasi medan/fail dan simpan pautan slip ke Drive private.
- Status permohonan baharu disimpan sebagai `PENDING 2027`, **bukan pembayaran berjaya**. Bayaran / resit rasmi belum dikeluarkan.
- Dialog pengesahan `window.confirm` yang kelihatan kasar telah diganti modal bertema V1.
- Pemilihan row ditukar daripada `getLastRow()+1` kepada pencarian baris yang benar-benar kosong, dengan semakan formula untuk mengelak overwrite.
- Kod QA tidak lagi menulis terus ke kolum K/L yang dipunyai `ARRAYFORMULA`. Permohonan baharu menanda kolum V (`STATUS_PERMOHONAN`), menulis medan A–I, dan membiarkan K/L dikira oleh formula.

## 5. Penemuan, pembaikan dan formula QA

**Penemuan A — row lompat:** Dalam BACKUP, rekod ujian pertama masuk row 106 walaupun row 102–105 kosong. Pemilihan row QA diperbaiki; ujian kedua kemudian disahkan masuk **row 102**, sementara row 106 kekal.

**Penemuan B — formula STATUS:** L1 memaparkan `#REF!` selepas `L106` diisi manual `PENDING 2027`; percubaan membaca kolum V sebelum ia wujud menghasilkan `#VALUE!`. Setelah kolum V ditambah dan L106 dikosongkan, formula berjaya. Penanda `PENDING 2027` disimpan di V106.

**Formula semasa dalam spreadsheet BACKUP QA sahaja:**

```excel
K1 =ARRAYFORMULA(IF(ROW(A:A)=1,"NO RESIT",IF(LEN(A:A),IF(V:V="PENDING 2027","",TEXT(ROW(A:A)-1,"000")),"")))
L1 =ARRAYFORMULA(IF(ROW(H:H)=1,"STATUS",IF(LEN(H:H),IF(V:V="PENDING 2027","PENDING 2027","SELESAI"),"")))
```

Formula ini **mengekalkan nombor lama 001–100 dan status SELESAI** untuk rekod V1, memaparkan K kosong dan L `PENDING 2027` untuk permohonan native. **K1/L1 rasmi LIVE tidak diubah.** Perlu audit lagi semantik “SELESAI” (berasal daripada adanya alamat), serta reka bentuk nombor resit rasmi selepas bayaran disahkan. **Jangan anggap formula K1 ini menyelesaikan sistem resit berbilang tahun.**

**Penemuan C — guard formula:** Semakan backend pada mulanya salah mencari teks `STATUS_PERMOHONAN` dalam **formula L1** walhal formula menggunakan `V:V`. Guard dibetulkan untuk menyemak header V dan rujukan `V:V="PENDING 2027"` tanpa melonggarkan validasi struktur.

## 6. Bukti QA yang telah dilihat

| Semakan | Keputusan | Had bukti |
|---|---|---|
| V1 look & feel, tab eDaftar, borang, upload slip | **PASS — visual** | Screenshot pemilik melalui `/dev` |
| E-mel di luar allowlist | **PASS — observed** | Ditolak dengan “Pendaftaran belum dibuka kepada umum” |
| OTP e-mel sebenar dihantar/diterima | **PASS — observed** | Gmail dan UI disahkan oleh screenshot; kod OTP **jangan rekod** |
| OTP cooldown 60 saat | **PASS — observed** | Permintaan semula terlalu cepat ditolak |
| OTP disahkan | **PASS — observed** | UI menunjukkan e-mel berjaya disahkan dan submit aktif |
| Modal V1 mengganti browser popup | **PASS — visual** | Screenshot modal “Sahkan Pendaftaran” |
| Slip & pendaftaran masuk ke Sheets BACKUP | **PASS — observed** | Dua rekod ujian masuk (row 106 pertama, row 102 selepas patch) |
| Row 102 serta row 106 wujud tanpa overwrite | **PASS — Sheets read** | Bacaan semasa pada BACKUP |
| K dan J kosong; L dan V `PENDING 2027` pada row 102 | **PASS — Sheets read** | Bayaran belum disahkan |
| Rekod legacy row 101 tetap RM80 / NO RESIT 100 / SELESAI | **PASS — Sheets read** | Semakan terhad pada row relevan, bukan audit seluruh workbook |
| MyKid duplicate pada Google sebenar | **NOT VERIFIED** | Mock/semakan kod ada; jangan claim ujian sebenar |
| Workflow Admin sahkan bayaran / resit PDF | **NOT IMPLEMENTED** | Perlu bangunkan |
| GitHub Pages public → GAS production | **NOT RELEASED** | Hanya kod calon, tidak publish |
| Keserasian semua login, Admin & AutoCrat selepas release | **NOT VERIFIED** | Perlukan ujian integrasi minimum |

**Data QA yang tinggal:** dua pendaftaran rekaan dalam spreadsheet BACKUP (row 102 & 106) dan slip rekaan dalam folder Drive restricted. Bersihkan dengan teliti selepas cukup bukti; jangan delete row sebenar atau folder secara pukal.

## 7. Release blockers dan tindakan seterusnya

1. **Sahkan yuran dengan pengasas:** RM50/bulan mulai Dis 2026 disokong oleh perbincangan; **jumlah pendaftaran baharu / pecahan yuran pendaftaran berasingan belum diputuskan**. Jangan buka umum dengan label “RM50” sebagai jumlah penuh.
2. **Tetapan Yuran Admin:** konfigurasi kadar daftar & bulanan bagi setiap sesi, pengesahan role Admin **server-side**, perubahan diaudit dan amaun permohonan dipaku pada tarikh permohonan. Kekalkan dashboard V1.
3. **Tahun persekolahan:** jelaskan input Tahun 3/4 untuk sesi 2027 dan hubungannya dengan umur 9/10, tanpa silap mentafsir umur lama sebagai status kelas baharu.
4. **Pengesahan urusetia:** proses menyemak slip, menyimpan jumlah yang disahkan, menukar pending→approved serta membolehkan akses penjaga tanpa tersalah menganggap slip sebagai bayaran sah.
5. **Resit rasmi:** hanya selepas bayaran disahkan, bukan menjadikan `ROW()-1` sebagai nombor resit berbilang sesi.
6. **Semakan keselamatan:** MyKid duplicate real, OTP single-use, lock/concurrency, pemfailan Drive private, error recovery, skop OAuth, dan akses endpoint legacy (termasuk Admin). Kekalkan `UPKK_NATIVE_EDAFTAR_TEST_EMAIL` sehingga pengasas meluluskan go-live.
7. **Integrasi deployment:** semak HEAD triggers asal, elakkan menampal kod QA ke GAS LIVE secara terus; rancang upgrade yang tidak mengubah aliran tahun 2026. Nilai semula peraturan yang di-hardcode pada 2026.
8. **Sync dokumentasi/kod:** calon GitHub QA berasingan daripada fail yang disalin secara manual ke GAS BACKUP; bandingkan perbezaan sebelum release. Hanya merge apabila pemilik meluluskan dan bukti minimum mencukupi.

## 8. Safety LOCK / checkpoint

- **Master LIVE kekal V1.** Laporan dalam `master` boleh dikemas kini tanpa mengubah fail aplikasi.
- **Tiada merge, deploy, perubahan pada GAS LIVE, Sheet rasmi, Trigger rasmi, atau AutoCrat rasmi** dalam fasa dokumentasi ini.
- Semua rekod ujian, formula V2 dan kolum V yang diterangkan adalah pada spreadsheet BACKUP sahaja.
- **Jangan salin ID/folder/e-mel penguji, OTP, slip atau data murid ke dokumentasi awam.**

**Milestone:** Native eDaftar menggunakan V1 UI → OTP → bukti bayaran → GAS → spreadsheet BACKUP berjaya diuji. Fasa seterusnya: pengesahan kadar yuran, tetapan yuran Admin dan workflow urusetia.

## 9. TODO sambungan — dipersetujui pemilik pada 3 Nov 2026

**Status:** Belum dimulakan kecuali yang ditanda jelas. Sambung dalam branch QA; **jangan sentuh LIVE**.

- [ ] **Konfirmasi pengasas:** jumlah yuran pendaftaran baharu untuk Disember 2026/sesi 2027 dan sama ada termasuk bulan pertama; kadar bulanan RM50 tidak semestinya bayaran pendaftaran keseluruhan.
- [ ] **Admin — Tetapan Yuran:** tambah fungsi kecil pada dashboard V1 sedia ada untuk kadar *pendaftaran* dan *bulanan* berasingan ikut sesi; validasi Admin di backend, rekod kadar pada masa permohonan, tanpa hardcode RM50 pada borang/slip.
- [ ] **Admin — Permohonan Baharu:** tambah tab untuk senarai permohonan `PENDING 2027`, butiran yang perlu, pautan slip restricted dan tindakan **Sahkan/Tolak** (dengan sebab penolakan).
- [ ] **Pengesahan urusetia:** semak bukti dan amaun, catat Admin/masa/amaun, ubah status secara terkawal, elakkan kelulusan berganda, hanya murid sah masuk kiraan aktif/dashboard.
- [ ] **Parent selepas lulus:** login berjaya dan dashboard 12 bulan V1 dipaparkan; sebelum lulus login ditolak dengan mesej yang tepat.
- [ ] **Patch mesej pending pada GAS BACKUP:** kod `Code.gs` telah dikemas kini pada branch `feature/native-edaftar-v1-qa` commit `de0a65fc743a9e7736fb3fd9120f10e62aa7d079` (**syntax PASS, belum ditampal/diuji pada GAS BACKUP**). Semasa salin, **pastikan `SPREADSHEET_ID` kekal ID BACKUP**. Mesej yang dipersetujui: “Permohonan pendaftaran anak anda masih dalam semakan urusetia. Akses dashboard akan tersedia selepas pendaftaran disahkan.”
- [ ] **Admin email khas:** `upkksl@gmail.com` ialah akaun **Admin sahaja**. Abaikan senario akaun Admin = penjaga yang diuji dengan e-mel yang sama; jangan jadikannya keperluan V2.
- [ ] **MyKid & umur automatik:** format input MyKid kepada `YYMMDD-XX-XXXX` semasa menaip (paparan), semak 12 digit dan tarikh lahir yang wujud **di frontend dan backend**; simpan format seragam dengan data lama (kolum E). **Jangan lagi tulis umur manual ke F**: F2 ialah `ARRAYFORMULA` yang mengira umur daripada E menggunakan `TODAY()`, jadi tulis ke F boleh merosakkan spill. QA MyKid rekaan bermula `81` menghasilkan umur `-55` kerana formula mentafsir tahun `2081`. Pilih nombor dummy yang tarikh lahirnya valid untuk ujian. Jangan dedahkan MyKid sebenar dalam laporan. Semak juga keperluan umur pada tahun sesi vs umur tepat hari ini, sebab `TODAY()` berubah sepanjang tahun.
- [ ] **Umur / tahun sekolah:** buang dropdown umur manual daripada Native eDaftar; kekalkan pilihan Tahun 3/Tahun 4 bagi sesi 2027 jika sekolah mahu maklumat kelas yang dipohon. Umur/tarikh lahir dikira daripada MyKid tetapi **jangan anggap** umur menentukan tahun sekolah tanpa pengecualian; jangan ubah data lama.
- [ ] **QA minimum:** pastikan status pending tidak meningkatkan bilangan murid aktif atau kutipan; uji login Admin dan penjaga selepas pembetulan, duplicate MyKid, semakan slip dan approval; jangan tambah ujian/reka bentuk tidak perlu.
- [ ] **Bersihkan data dummy:** selepas pengesahan ujian, padam *hanya* dua rekod ujian dikenal pasti dalam spreadsheet BACKUP dan fail slip dummy dalam folder restricted, bukan data LIVE.
- [ ] **Dokumentasi akhir dan release gate:** semak keselamatan, backup, trigger dan integrasi asal sebelum sebarang cadangan deployment. **Tiada merge/deploy tanpa persetujuan pemilik.**

**Milestone tambahan teramati:** Pemilik berjaya login ke Dashboard Admin V1 melalui GAS QA `/dev`; paparan dashboard, 12 kad bulanan dan menu lama muncul. Ini membuktikan *login/paparan* asas, bukan bahawa semua butang Admin sudah diuji. Dashboard menunjukkan 102 murid kerana dua rekod QA pending; pengiraan murid aktif perlu dibetulkan sebelum release.


## 10. Sambungan 4 Nov 2026 — MyKid auto-format & umur auto-kira (QA candidate)

**Branch:** `feature/native-edaftar-v1-qa`  
**Checkpoint terakhir pakej:** `18004792821a47eb772d67c2cb2ebacd0ace387b` (`index.html`); backend `d0d422be88ddf2c973c460c8928426676a31c8ef` (`NativeEdaftar.gs`).  
**Status:** Kod telah dipush; syntax dan ujian helper berkaitan lulus. **Belum disalin ke GAS BACKUP, belum browser/Google real test, belum release.**

- Format input MyKid kini `YYMMDD-XX-XXXX` dengan auto-hyphen; pengesahan tarikh lahir di browser **dan sekali lagi pada backend**.
- Dropdown umur manual dibuang. UI memaparkan **umur yang akan dicapai pada tahun 2027**; kelayakan biasa dibatasi kepada Tahun 3/4 (kohort tahun lahir 2018/2017; umur 9/10 pada 2027). Kasus luar biasa boleh dirujuk kepada urusetia; tiada override Admin lagi.
- Penulisan di backend hanya **A–E dan G–I**. Kolum **F (UMUR)** adalah formula spill dari F2, **tidak boleh disentuh**. K/L kekal formula spill; V marker pending.
- MyKid baharu disimpan dalam format bertanda sengkang sama seperti data V1; perbandingan MyKid duplikat tetap mengabaikan sengkang.
- QA unit terhad: tarikh lahir valid/tidak valid, penjagaan formula F2, ketiadaan input umur manual. MyKid dummy lama bermula `81` tetap menghasilkan umur negatif di salinan BACKUP sehingga rekod dummy dibersihkan — **jangan ubah data 2026**.
- **Langkah ujian seterusnya:** salin `NativeEdaftar.gs` dan `index.html` terkini ke GAS BACKUP; refresh `/dev?view=edaftar`; masukkan nombor dummy yang mempunyai tarikh lahir 2017/2018, lihat format/umur dan validasi. Untuk ujian penghantaran, gunakan OTP dan slip rekaan dan semak F2 tidak pecah; lakukan hanya jika diperlukan. Pastikan `Code.gs` kekal menunjuk ID BACKUP (jika ditampal semula). Jangan sentuh GAS LIVE.
