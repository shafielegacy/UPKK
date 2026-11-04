# UPKK V2 Admin — Tetapan Yuran & Pengesahan Pendaftaran (QA)

**Tarikh:** 4 Nov 2026 · **Status:** Kod calon dalam branch QA, belum diuji pada Google sebenar dan belum release.

## Skop minimum

- Kekalkan Admin Dashboard V1, tambah hanya **Permohonan Baharu** dan **Tetapan Yuran**.
- Admin mengisi dua kadar sesi 2027: pendaftaran dan yuran bulan pertama. Nilai **tidak diberi default** kerana pengasas belum mengesahkan kadar pendaftaran.
- Borang eDaftar membaca jumlah semasa; setiap permohonan baharu menyimpan snapshot kadar asal.
- Admin melihat permohonan pending, buka slip restricted, sahkan jumlah sebenar atau tolak dengan sebab.
- Pending dan ditolak tidak boleh login; approved boleh login melalui aturan V1. Tiada resit PDF rasmi dalam skop ini.

## Safety LOCK

**Bukan untuk GAS LIVE.** Backend Admin V2 menolak operasi jika `SPREADSHEET_ID` bukan spreadsheet BACKUP QA yang dipersetujui; juga memerlukan Script Property `UPKK_ADMIN_V2_QA_ENABLED=true`. Tiada backend baharu diekspos dalam `doGet`/JSONP; hanya `google.script.run` dengan token Admin sementara (6 jam) dan semakan akaun Admin pada server.

**Jangan tukar ID BACKUP kepada LIVE untuk melangkau guard.** Jangan deploy, merge atau sentuh trigger rasmi. Pengguna `upkksl@gmail.com` ialah Admin sahaja.

## Langkah pasang di projek GAS BACKUP sahaja

1. Semak `Code.gs` baris `SPREADSHEET_ID`: branch QA kini **default ke ID spreadsheet BACKUP UPKK V1 - 03 NOV 2026**. Tetap sahkan ID sebelum Save. Kod QA turut menyekat `syncMuridToForms`, `kemasFormEbayar` dan `setupAutoSyncTrigger` daripada mengubah Google Forms LIVE.
2. Salin empat fail daripada branch QA: `Code.gs`, `index.html`, `NativeEdaftar.gs`, dan **fail baharu `AdminV2.gs`** (gunakan **+ → Script** jika belum ada).
3. Selepas salin `Code.gs`, **semak dan betulkan semula ID BACKUP**, kemudian Save.
4. Script Properties projek BACKUP sahaja: `UPKK_ADMIN_V2_QA_ENABLED=true`. Kekalkan `UPKK_NATIVE_EDAFTAR_ENABLED=true` hanya semasa ujian terkawal. Jangan masukkan sebarang kata laluan atau token ke GitHub.
5. Refresh `/dev`; login semula sebagai Admin menggunakan tab login V1 (jangan guna sesi Admin lama yang dipulihkan daripada localStorage). Buka **Tetapan Yuran**.
6. Tekan **Sediakan Formula BACKUP** sekali. Kaedah ini mengubah hanya spreadsheet QA:
   - K1: kekalkan resit legacy 2026, tetapi kosongkan NO RESIT bagi semua permohonan V2 `PENDING/APPROVED/REJECTED 2027`.
   - L1: `PENDING 2027` / `DITOLAK 2027` / `SELESAI` (jika approved), tanpa menulis ke spill row.
   - Kolum **W:AB** dalam tab DAFTAR UPKK bagi snapshot kadar, Admin, tarikh tindakan dan sebab penolakan; **tiada tab atau spreadsheet baharu**.
7. **Tetapan Yuran:** gunakan kadar *rekaan* hanya bagi ujian QA; sebarang kadar operasi sebenar tunggu pengesahan pengasas. Klik **Simpan Tetapan Yuran**. Perubahan kadar tidak mengubah snapshot permohonan yang baharu.
8. Semak eDaftar: label slip kini memaparkan jumlah terkini; tanpa tetapan yuran, pendaftaran baharu disengajakan disekat. Permohonan sebelum tetapan (legacy QA dummy) akan menggunakan kadar QA terkini apabila diputuskan; jangan jadikan keputusan itu bukti kadar sebenar.
9. **Permohonan Baharu:** buka slip, sahkan amaun yang diterima, klik Sahkan/Tolak, dan semak V, L, K, J, W:AB di BACKUP. Uji login penjaga selepas sahkan dan pastikan status ditolak tidak boleh login.
10. Jika mahu ulang ujian, gunakan rekod dummy baharu atau reset *hanya* rekod dummy tertentu selepas backup; jangan padam rekod 2026.

## Jangkaan status dan kolum

| Keadaan | V marker | L (formula) | J bayaran | K resit |
|---|---|---|---|---|
| Permohonan dihantar | PENDING 2027 | PENDING 2027 | Kosong | Kosong |
| Admin sahkan | APPROVED 2027 | SELESAI | Jumlah disahkan | Kosong sehingga sistem resit dibina |
| Admin tolak | REJECTED 2027 | DITOLAK 2027 | Kosong | Kosong |
| Rekod V1 | Kosong | SELESAI | Kekal | Nombor resit lama kekal |

**Penting:** Fungsi resit PDF rasmi, notifikasi keputusan melalui e-mel, dashboard yuran 2027 dan pengesahan peraturan yuran pendaftaran masih TODO. Jangan claim "sistem siap LIVE".

## Semakan / gates

- [x] Semakan sintaks `Code.gs`, `NativeEdaftar.gs`, `AdminV2.gs` dan inline JavaScript `index.html` — PASS.
- [x] Backend menggunakan lock, idempotency guard marker `PENDING 2027`, autorisasi server-side, dan QA-only guard.
- [x] Borang eDaftar memaparkan jumlah yuran dari Admin; backend menolak quote lama jika kadar berubah ketika borang dibuka.
- [ ] GAS BACKUP: login Admin dan buka tab baharu.
- [ ] GAS BACKUP: prepare formula; semak tiada `#REF!` dan rekod lama tidak berubah.
- [ ] GAS BACKUP: tetapan kadar → eDaftar terpapar jumlah → submit → snapshot W:Y.
- [ ] GAS BACKUP: Sahkan + Tolak secara berasingan; semak J/K/L/V, rekod audit, login penjaga.
- [ ] GAS BACKUP: kadar diubah tidak mengubah snapshot rekod terdahulu; pending/rejected tidak masuk dashboard aktif.
- [ ] Semakan keselamatan dan keputusan pengasas sebelum sebarang release.

**Satu-satunya spreadsheet QA** kekal workbook BACKUP sedia ada. Ini tidak menyentuh LIVE.
