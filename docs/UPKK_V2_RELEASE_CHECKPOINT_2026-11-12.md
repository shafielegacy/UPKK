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
