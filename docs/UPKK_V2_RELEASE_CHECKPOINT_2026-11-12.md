# UPKK Syafie Legacy V2 — Checkpoint Release QA (12 November 2026)

**Repository:** `shafielegacy/UPKK`  
**Frontend branch:** `pages/frontend-v1.34`  
**Checkpoint sebelum catatan:** `b5bca3b37be3f764b3528630fe143b2b55ebca94`  
**Status:** Parent/Admin V2 PILOT lulus berdasarkan ujian pemilik; eDaftar awam 2027 belum diaktifkan. Ini laporan keputusan dan status, bukan arahan deploy.

## Keputusan yang telah disahkan

Pemilik telah melaksanakan ujian dummy pendaftaran Native 2027, rekod disimpan ke **spreadsheet UPKK RASMI**, login Admin V2, pengesahan bayaran, dan perubahan status; pemilik melaporkan semua ujian tersebut berjaya. Tidak perlu mengulang ujian yang sama tanpa sebab.

**Spreadsheet UPKK RASMI (bukan BACKUP):** `1pHzToTNZBBvER7zk9XyQUwdl2f_XXDdpX-fEFml_UJg`, tab `NATIVE_EDAFTAR_2027`.

Bacaan read-only tab tersebut pada 12 November 2026 mengesahkan:

| Rekod sintetik | Kelulusan | Amaun disahkan | Pendaftaran | Bulan pertama | Resit |
| --- | --- | ---: | ---: | --- | --- |
| `QA-FULL100-20261112-01` | APPROVED 2027 | RM100 | RM50 | RM50 / SELESAI | `QA-UPKK-N-2027-0001` |
| `QA-REG50-20261112-01` | APPROVED 2027 | RM50 | RM50 | RM0 / BELUM BAYAR | `QA-UPKK-N-2027-0002` |
| `QA-PILOT-20261112-01` | APPROVED 2027 | RM50 | RM50 | RM0 / BELUM BAYAR | Nombor QA bukan resit rasmi |

### AutoCrat — keputusan penting terkini

**PASS untuk tiga rekod dummy di atas:** kolum AutoCrat pada spreadsheet RASMI menunjukkan dokumen dicipta dan digabung, PDF dijana, serta laporan `Emails Sent`. Pautan dokumen turut direkodkan.

- Dua rekod RM50/RM100: log **12 November 2026, 02:37 MYT**.
- Rekod pilot terdahulu: log **11 November 2026, 23:37 MYT**.
- Bukti ini menunjukkan *time trigger* pernah berjaya, tetapi **bukan bukti** bahawa jadual hourly trigger terkini terus berjalan tanpa masalah atau kandungan PDF telah diaudit secara visual.
- Semasa ujian, log e-mel memaparkan penerima/CC/BCC QA. Sebelum intake umum, semak penerima sebenar, privasi, template, dan tiada pengulangan resit/e-mel.

## GitHub Pages dan flow semasa

Pada branch `pages/frontend-v1.34`:
- `index.html` menyokong penghalaan `?v2=1` ke `v2-portal.html`; Legacy 2026 masih ada.
- `v2-portal.html` mempunyai tab Ibu bapa / Pentadbir dan pautan eDaftar 2027.
- `parent-v2-config.js` dan `v2-admin-config.js` diaktifkan untuk endpoint GAS **pilot** yang sama. Frontend Admin sengaja mengehadkan tindakan kepada ID `QA-`; ini **bukan laluan kelulusan semua murid awam**.
- `edaftar.html` pada branch Pages ini kekal **disabled** dan tidak memuat `edaftar.js`; buka fail statik ini sahaja tidak mengaktifkan pendaftaran.
- Source borang penuh `edaftar.js`, `edaftar-config.js`, dan adapter `PagesEdaftar.gs` wujud pada branch calon `feature/v2-syafie-legacy-rebranding-qa`; versi calon mempunyai branding lama yang perlu digantikan dengan identiti **Kafa & UPKK Syafie Legacy** dan konfigurasi `enabled:false` asal.
- `master` mempunyai `index.html` Legacy yang pautan eDaftarnya menuju GAS `/exec?view=edaftar`. Settings sumber terbit GitHub Pages belum disahkan dalam semakan ini; **jangan anggap branch calon sama dengan kandungan URL awam** tanpa mengesahkan Pages Settings/deployment.

## Next release action — minimum, tanpa pembinaan semula

1. Semak Pages Settings / deployed SHA untuk tentukan kod sebenar di `https://shafielegacy.github.io/UPKK/`.
2. Bawa hanya frontend eDaftar yang telah diuji ke branch Pages yang digunakan (dengan branding SL), padankan endpoint Native khusus dengan installed backend dan pastikan fee & OTP berfungsi. Jangan gunakan endpoint QA/BACKUP untuk intake sebenar.
3. Pastikan Admin production boleh meluluskan ID permohonan sebenar secara authenticated/server-side; frontend QA-only tidak mencukupi.
4. Sebelum mengaktifkan flag public, sahkan perlindungan data 2026, binding workbook rasmi, schema Native, pengasingan writer, ACL slip, penerima AutoCrat dan rollback. **Jangan ubah V65 Legacy, Form 2026, trigger V1, atau rekod lama.**
5. Buka intake dengan kelulusan pemilik secara berasingan; periksa satu transaksi awal secara terkawal. Tiada ujian dummy berulang tanpa sebab.

## Polisi bayaran 2027

RM50 pendaftaran untuk tempahan tempat; RM50 yuran bulan pertama berasingan. Untuk pengambilan selepas mula kelas, penjaga boleh membayar RM50 pendaftaran dahulu atau RM100 bersama. Rekod RM100 mesti menandakan bulan pertama selesai tanpa caj berganda. Jangan paparkan RM100 sebagai satu-satunya pilihan selepas Disember.

## Kawalan perubahan

Dokumen ini sahaja boleh di-commit. **Tiada perubahan kod, GAS, Script Properties, Google Sheets, AutoCrat, V1 atau aktivasi awam dibenarkan oleh checkpoint ini.** Tidak boleh claim 'public release PASS' hanya berdasarkan ujian dummy pilot.

## Pemerhatian dashboard Parent utama — 12 November 2026

Pemilik memberikan screenshot sebenar `https://shafielegacy.github.io/UPKK/index.html` yang menunjukkan akaun ujian Legacy **siti rayka test**, anak yang dipilih dalam dashboard sesi **Jan–Dis 2026**. Paparan menunjukkan 1 SELESAI, 4 BELUM, 7 N/A. **Ia bukan akaun murid yang sama dengan tiga rekod dummy Native 2027**; jangan menganggap mismatch identiti atau data rosak.

Semakan READ-ONLY spreadsheet **RASMI** `1pHzToTNZBBvER7zk9XyQUwdl2f_XXDdpX-fEFml_UJg`, tab `NATIVE_EDAFTAR_2027` mengesahkan tiga rekod QA approved (RM100 bulan pertama SELESAI; dua RM50 bulan pertama BELUM BAYAR). Oleh itu isu yang nampak adalah **paparan utama belum menyediakan session 2027/unified dashboard secara jelas**, bukannya bukti rekod QA hilang.

Keputusan UX pemilik: **satu halaman log masuk** seperti V1, satu design emerald-gold V2, kemudian laluan dashboard berasingan mengikut peranan Ibu Bapa atau Pentadbir. Kekalkan Parent dashboard premium sedia ada dan fungsi Legacy 2026; integrasi 2027 ialah additive sahaja. `v2-portal.html` ialah halaman pilot, bukan design akhir. Jangan gabungkan data murid berlainan akaun semata-mata untuk membuktikan paparan 2027.

## Keputusan penamaan release dan audit kad OGOS 2026

**Keputusan pemilik (12 Nov 2026):** Branch `pages/frontend-v1.34` ialah baseline UI semasa untuk dinaikkan kepada **UPKK V2.0** selepas integrasi dan release disahkan. Jangan buat repository/projek baharu atau ubah V1 Legacy semata-mata untuk penamaan versi. `V2.0` ialah *sasaran release*, bukan dakwaan public release sudah berlaku.

**Semakan kad OGOS 'SELESAI RM80' untuk murid ujian `siti rayka test`:** Spreadsheet RASMI `DAFTAR UPKK` baris 102 merekod pendaftaran pada **11/08/2026** dengan `BAYARAN=RM80`, manakala tab `UPKK OGOS 2026` tidak mempunyai rekod bulanan berasingan atas nama tersebut. Kod Legacy `Code.gs` pada branch aktif, fungsi `isYuranPertamaCoveredByDaftar_` (baris sekitar 189–190), memulangkan true untuk bayaran daftar **>=RM80**; logik `getDashboard` (baris sekitar 619) dan status bil bulanan (sekitar 1539) memang menetapkan bulan daftar sebagai `SELESAI` daripada bayaran pendaftaran. Ini adalah **peraturan V1 yang disengajakan, bukan bukti bayaran OGOS bulanan hilang**.

Perhatian UX untuk V2.0: papar label jelas seperti `SELESAI — termasuk dalam yuran pendaftaran RM80` pada butiran OGOS, dan bezakan sumber bayaran pendaftaran dengan baris eBayar bulanan. **Jangan cipta rekod OGOS tambahan, jangan tuntut bayaran kali kedua, jangan ubah resit/formula Legacy.** Nota ini hanya dokumentasi; belum ada patch UI dibuat.

## Implementasi frontend release-prep selepas owner "ON CARGAS" (12 November 2026)

**Scope:** staging additive pada branch Pages aktif, tanpa intake awam atau GAS/Sheet write.

- Source Native eDaftar yang pernah diuji (`edaftar.js` + `edaftar-config.js`) dibawa daripada branch `feature/v2-syafie-legacy-rebranding-qa` ke `pages/frontend-v1.34`.
- `edaftar.html` kini memuat kedua-dua script melalui CSP berhad `script-src 'self'` dan sambungan HTTPS Apps Script sahaja; semua input kekal **disabled on load**.
- `edaftar.js` hanya membuka fieldset selepas respons `getNativeEdaftarAvailability` yang berjaya serta memberi `enabled`, `feeReady`, `session==='2027'` dan fee contract konsisten. Closed banner disembunyikan hanya apabila pemeriksaan ini lulus.
- Config frontend masih `enabled:false, endpoint:''`, jadi **public intake belum dibuka** dan tiada data dihantar.
- `index.html` sengaja **tidak diubah**; login role Parent/Admin Legacy serta V1 2026 kekal. `APP_VERSION` masih `1.34`; sasaran release selepas selesai ialah V2.0.
- SHA fail disemak terus dari GitHub selepas push. Pemeriksaan statik fail dan gate PASS; **tiada live registration test/QA approval baharu dijalankan**.

**Remaining before V2.0 GO:** penyatuan akses Native Parent/Admin dalam satu UX log masuk `index.html` tanpa memecahkan role routing Legacy; production Admin approval untuk ID bukan QA; pilihan bayaran RM50 atau RM100 selepas Disember; URL dan gate Native production yang tepat; audit akses slip/AutoCrat penerima; validasi backend source parity dan perlindungan record 2026. Jangan aktifkan `edaftar-config.js` atau Script Properties public sebelum perkara tersebut disahkan dan approval release.

## Integrasi satu portal Parent/Admin — implementation checkpoint (12 Nov 2026)

Atas arahan owner **GO**, frontend `pages/frontend-v1.34` dikemas kini secara additive:

- `index.html`: halaman login rasmi kini menyediakan tab **Sesi 2027**. Pilihan **Ibu Bapa 2027** dan **Pentadbir 2027** membuka `#page-native` **dalam dokumen/URL portal utama yang sama**, bukannya mengganti login Legacy 2026. Existing `switchLoginTab` diperluas kepada `login/edaftar/native`.
- Ruang Native menggunakan `parent-v2-config.js`, `parent-v2.js`, `v2-admin-config.js`, `v2-admin.js`, `v2-tabs.js` sedia ada. OTP Parent dan Admin password masih disahkan di backend pilot masing-masing; session token kekal in-memory. **Admin hanya boleh membuat tindakan pada ID `QA-`** mengikut UI semasa.
- `native-portal-embed.css`: gaya emerald-gold di-scope kepada `#page-native`; responsif untuk tiga tab login. Parent dashboard premium Legacy dan Admin dashboard 2026 sedia ada dikekalkan.
- `sw.js`: cache PWA dinamakan `upkk-v1.34-native-ui-20261112` untuk invalidasi cache laman apabila servis pekerja dikemas kini.
- `edaftar.html` + `edaftar.js` serta config Native telah dipasang pada checkpoint sebelumnya. **`edaftar-config.js` masih OFF dengan endpoint kosong**; borang disabled sebelum availability backend sah.
- `index.html` masih `APP_VERSION='1.34'` dan Legacy `GAS_URL` tidak berubah. **V2.0 hanya akan dipaparkan sebagai nombor release selepas GO-LIVE.**
- Verifikasi read-only GitHub selepas commit: tab Native, kedua-dua set ID borang, JS import, Legacy URL, frontend gate OFF, dan version PWA diperiksa serta PASS **statik**. **Tiada tuntutan browser end-to-end atau OTP ujian baharu**.

**Belum selesai untuk release awam V2.0:** sahkan aliran login responsif dalam browser dan role routing; kawalan Admin production yang tidak lagi QA-only serta backend binding workbook rasmi; kaedah public intake dan pilihan RM50/RM100; audit kebenaran slip/AutoCrat, writer coexistence, rollback. Jangan ubah pengesahan Legacy 2026 atau membuka public backend hanya berdasarkan source statik.

## Pembetulan keputusan UI oleh pemilik — 12 Nov 2026 (mengatasi checkpoint integrasi berlapis terdahulu)

**Keputusan akhir:** Hanya **dua tab** pada login utama: **Log Masuk** dan **eDaftar**. Jangan tambah tab Sesi 2027 atau halaman login kedua. `Log Masuk` yang sama menerima Parent/Admin dan menentukan peranan melalui respons backend; paparan dashboard berasingan selepas autentikasi. `eDaftar` mesti membuka terus borang sesi 2027 (`edaftar.html`).

**Tindakan GitHub telah dibuat:** `index.html` dipulihkan daripada baseline sebelum integrasi berlapis, dengan satu-satunya perubahan link eDaftar kepada `./edaftar.html`; commit `a9eaaf84dda7278d58fa0e72c170b2592c0fad3f`. Tab `Sesi 2027` dan `#page-native` dikeluarkan daripada halaman utama, fungsi `doLogin` dan routing `res.role==='admin'` Legacy kekal. Source `edaftar.js` dan `edaftar.html` masih tersedia tetapi **disabled melalui konfigurasi `enabled:false, endpoint:''` dan fieldset disabled sehingga semakan availability berjaya**. Ini membenarkan pengguna melihat borang tanpa menerima submission sebenar buat masa ini.

**Penting:** Semakan source statik PASS; login Native 2027 melalui login tunggal dan public submission **BELUM dibuktikan/diaktifkan**. Jangan salah anggap pembetulan UI ini sebagai penyatuan autentikasi server atau GO-LIVE V2.0. Catatan terdahulu mengenai tab Sesi 2027 dianggap superseded.

## Source of truth selector pilihan RM50/RM100 — penemuan semula milestone

**Penemuan berdasarkan checkpoint kerja terdahulu (11–12 Nov 2026):**
- Frontend QA yang **memiliki selector sebenar** berada dalam workspace laptop `C:\Users\burnk\OneDrive\Documents-assets\UPKK-Part7D-QA`, branch `work/v2-premium-native-integration`.
- Fail yang perlu **diambil semula daripada workspace tersebut, bukan ditulis semula:** `edaftar.html` dan `edaftar.js`.
- Nama selector **`#ed-payment-option`**, payload **`paymentOption`**; pilihan **`REGISTRATION_ONLY`** (RM50 pendaftaran sahaja) atau **`FULL`** (RM100 termasuk yuran bulan pertama).
- Checkpoint menyebut perubahan ini **setempat/QA**, dan endpoint ketika itu masih QA. **Tiada bukti yang cukup bahawa patch ini sudah dipasang pada deployment Native production.**
- Tiga rekod QA `NATIVE_EDAFTAR_2027` di spreadsheet RASMI dan kelulusan Admin/AutoCrat adalah milestone sebenar yang tidak perlu diulang. Namun ia **tidak membuktikan** eDaftar public frontend sekarang sudah menghantar `paymentOption`.
- `edaftar.js` dari branch `feature/v2-syafie-legacy-rebranding-qa` **tidak mempunyai selector/payload tersebut**. Pemindahan fail itu ke branch Pages pada checkpoint terdahulu menyebabkan regression ciri pembayaran dalam frontend.
- **Tindakan minimum seterusnya:** ambil dua fail QA milestone yang tepat daripada laptop, semak diff berbanding branch Pages, port hanya selector/payload dan kemasan branding yang diperlukan, semak kontrak installed GAS Native sebelum membuka public gate.
- Jangan buat test suite baharu, jangan repeat milestone Google, jangan sentuh data Legacy 2026, jangan buka public intake dengan backend yang belum dipadankan.

## Milestone ZIP diterima, selector RM50/RM100 dipulihkan (12 November 2026)

Sumber asal yang dibekalkan pemilik: `UPKK_EDAFTAR_MILESTONE.zip` daripada `UPKK-Part7D-QA`, mengandungi tepat `edaftar.html` (7,063 byte) dan `edaftar.js` (14,085 byte), bertarikh 10 November. Kandungan dibaca tanpa mengekstrak atau mengubah data Google.

- `edaftar.html` pada branch Pages aktif kini mempunyai selector `#ed-payment-option` dengan nilai `REGISTRATION_ONLY` dan `FULL`, serta nota RM50 dahulu/RM100 bersama. UI rasmi branding Syafie Legacy sedia ada dikekalkan. Commit `926cbefb0b3af29087d72b64d0325d35817ccb85`.
- `edaftar.js` kini mempunyai `refreshNativePaymentChoiceUI` dan memasukkan `paymentOption` bersama `quotedTotal` dalam payload submit. Nilai RM50 atau RM100 dipilih berdasarkan fee response authoritative, pilihan `FULL` tidak diaktifkan jika komponen bulanan kosong. Commit `ef3ce3345f281ddf1f68d7bc4352ef363b46023a`.
- **Perlindungan release:** `edaftar-config.js` terus `enabled:false,endpoint:''`, fieldset disabled sehingga backend availability mengesahkan terbuka. `index.html` login role-based Legacy tidak diubah. Source remote telah disemak read-only: selector, kedua-dua options, payload, dynamic quote, gate OFF, login utama PASS secara **struktur**. **Bukan ujian transaksi baharu**.
- **Belum GO public:** installed GAS Native perlu disahkan benar-benar menerima `paymentOption` / RM50 atau RM100 pada submit, menetapkan status `REGISTRATION_ONLY` / `FULL`, dan tidak double-charge first month; pengesahan Admin untuk ID sebenar masih QA-only dalam frontend pilot. Jangan aktifkan public flag sehingga kontrak runtime ini diperiksa.
- Tiada test suite baharu, dummy submission, operasi AutoCrat atau edit spreadsheet dilakukan untuk pemulihan UI ini.

## Pemulihan input milestone & gate sebelum GO-LIVE (12 November 2026)

Pemilik mengesahkan screenshot GitHub Pages menunjukkan borang Native 2027 yang betul dan pemilihan bayaran RM50/RM100. Semakan ZIP asal mendapati dua butiran milestone tambahan yang belum masuk ketika port awal:
- nama penjaga, nama murid dan alamat diubah ke huruf besar pada input; 
- nombor telefon disekat kepada 10–11 digit dan aksara bukan digit dibuang.

Kedua-duanya dipulihkan daripada `UPKK_EDAFTAR_MILESTONE.zip` kepada `edaftar.js` di branch Pages aktif. Commit terakhir pembetulan `60083c159bea20e01bb7cc1e4217aeff91064148`. Semakan **syntax-only** V8 untuk JS: PASS. Semakan remote selector, payload paymentOption, CAPS LOCK, normalisasi telefon, dan gate OFF: PASS. **Tiada ujian berulang dengan data Google atau API berbayar.**

**Keadaan sebenar:** Frontend/UX sudah restored dan telah dilihat oleh pemilik, tetapi `edaftar-config.js` tetap `enabled:false,endpoint:''`. Tiada Apps Script project installed source/Script Properties read connector tersedia dalam chat ini. Pautan GAS dalam `parent-v2-config.js` dan `v2-admin-config.js` ialah pilot berasingan, **bukan bukti** bahawa endpoint khusus eDaftar 2027 production ada `paymentOption` support. Public release perlu pastikan deployed Native GAS menerima option RM50/RM100, meluluskan ID real, menulis hanya baris Native 2027 dalam workbook rasmi dan tidak menjejaskan Legacy 2026. Jangan menghidupkan public switch sebelum padanan tersebut terbukti.

## TODO DISETUJUI — Dashboard Animated V2 (selepas release stabil)

**Rujukan:** video TikTok kedua dikongsikan pemilik pada 12 Nov 2026, gaya dashboard dinamik dengan animasi komponen dan pertukaran halaman.
**Priority:** DEFERRED / POST-RELEASE, bukan blocker untuk Native intake.
**Skop:** kekalkan satu login, dashboard peranan Parent/Admin; gunakan HTML/CSS/JavaScript (boleh gunakan GSAP jika wajar) pada GitHub Pages, backend GAS kekal, tema emerald + gold dan logo rasmi; animasi kad masuk, pertukaran menu, kiraan angka, carta; hormati `prefers-reduced-motion` dan prestasi telefon.
**Jangan** ubah UI eDaftar yang telah dipersetujui, ubah Legacy 2026, atau cipta portal/login kedua. Buat sebagai kerja frontend tersendiri hanya selepas V2 core stabil.

## Milestone semasa — Admin Native Production Integration

Source RC `UPKK_V2_ADMIN_INTEGRATION_CLOSED_RC_20261112.zip` telah mengandungi route `pagesAdminNativeV2Production` yang **OFF by default** melalui `UPKK_V2_ADMIN_POST_ENABLED` dan `UPKK_PAGES_EDAFTAR_ADMIN_ENABLED`. `AdminV2.js` mempunyai fungsi `loginAdminV2`, `upkkAdminV2List`, `decideAdminV2Application` dan `logoutAdminV2`. Walaupun source berfungsi secara struktur, `upkkAdminV2Identity_` masih membandingkan kata laluan plaintext terhadap sel tab `ADMIN UPKK` (kolum kedua); selain itu frontend `v2-admin.js` pada Pages memanggil route pilot `pagesAdminNativeV2` dan menghadkan ID kepada `QA-`. Ia **belum** terintegrasi ke route production dan login utama Parent/Admin.
**Tindakan release minimum:** sediakan pelan migrasi pengesahan Admin yang tidak mendedahkan kata laluan dan tidak merosakkan Legacy; padankan protokol frontend dan server/UUID; semak keizinan admin daripada tab tanpa membaca nilai kata laluan; deploy versi CLOSED dahulu hanya selepas review. Jangan hidupkan kedua-dua flag Admin atau intake sekarang.

## Milestone Unified Admin OTP — staged CLOSED on existing login (12 Nov 2026)

**Checksum owner PASS:** `UPKK_V2_ADMIN_OTP_CLOSED_RC_20261112.zip` matches `B68FBE99E8EE542AB5FEE9A2A7EF30BD14723494A0FD165557D442A8588065F0`.

**Frontend staged on active Pages branch:**
- `admin-2027-config.js` remains `enabled:false,endpoint:''`. Commit `4084d69c3e96ef4f588a7152c3e85e23dd188f45`.
- `admin-2027.js` contains disabled-by-default Native Admin OTP flow: request/verify OTP, session in JS memory only, list and approve/reject Native UUID using `pagesAdminNativeV2Production`; no `QA-` limit and no localStorage session persistence. Commit `fdb65d3f77a51fd1a149ff36920ccc268963d36a`.
- `index.html` imports those files without modifying existing Legacy `doLogin()`, Parent/Admin 2026 routing or existing two login/eDaftar tabs; with config OFF, no Native Admin controls appear. Commit `6ef2dc323b30a369a5d4bc508588d2ad700ae000`.
- Remote JS parser syntax check PASS; route/OTP/UUID contract and existing login markers static-check PASS. **No authenticated runtime test or GAS deployment.**
- `v2-portal.html` QA pilot remains separate and must not be linked as a production login.
- **Before enabling:** deploy reviewed 7-file OTP RC to correct Native GAS as Version 2 CLOSED, verify POST route and MailApp owner authorisation, ensure Admin OTP token/UUID operations are protected, bind production URL in `admin-2027-config.js`, and only then explicitly enable Admin. Public eDaftar remains OFF until separate authorisation. A staged UI is **not** a production-ready login.
- **Important verification:** `pagesNativeEdaftarAdminReady_()` requires production mode, workbook binding and Admin flag; it does not require public eDaftar gate, so CLOSED Admin operating mode is technically possible with separate flags.

**POST-RELEASE TODO:** video-2 inspired animated premium dashboard; not a release blocker.

## Milestone Admin Native 2027 Dashboard Expansion — 12 Nov 2026

Pemilik memberikan bukti visual OTP Admin berjaya disahkan dan tiga rekod QA APPROVED 2027 dipaparkan pada browser sebenar. Ini membuktikan route Admin OTP dan pembacaan senarai Native berfungsi di deployment V2; **tidak membuktikan penerimaan/kelulusan permohonan sebenar melalui frontend baru**. Jangan ulang ujian dummy.

UI Admin V1 dalam `index.html#page-admin` masih lengkap untuk sesi Legacy 2026: Dashboard, Murid, Senarai Bayaran, Sync Murid, graf, status bulanan dan scan MyKid. Fungsi V1 ini tidak boleh dialihkan secara automatik ke sesi OTP Native 2027 kerana laluan data/authorisation berbeza.

Pembaikan minimum pada frontend Native `admin-2027.js` menggunakan hanya `listAdminV2` yang tersedia: ringkasan jumlah permohonan, menunggu, diluluskan dan kutipan disahkan; carian nama penjaga/murid/ID; penapis PENDING/APPROVED/REJECTED; tindakan Sahkan/Tolak UUID dan refresh/log keluar kekal. Layout dashboard diluaskan selepas OTP, dan cache-bust import JS dilaksanakan pada `index.html` (commit `bd32f8d`). Tiada backend/Sheet/penghantaran OTP baru, tiada perubahan logik Legacy.

**Belum release penuh**: semak hasil UI baru pada browser pengguna dan sistem Parent Native 2027 dalam unified login sebelum GO-LIVE. Public eDaftar masih perlu kekal OFF sehingga laluan operasi dan polisi lengkap disahkan. UI Animated V2 kekal TODO selepas release.
