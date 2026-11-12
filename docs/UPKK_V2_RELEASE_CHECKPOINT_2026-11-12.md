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
