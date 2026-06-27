# 📚 Sistem eDaftar · eBayar · eSemak
## Kelas Pengajian Bahasa Arab UPKK
### Sekolah Kebangsaan Agama Paya Rumput, Masjid Tanah, Melaka

> **Live:** `shafielegacy.github.io/UPKK`

---

## 🗂️ Ringkasan Projek

Sistem pengurusan digital bersepadu untuk Kelas Pengajian Bahasa Arab peperiksaan **UPKK (Ujian Penilaian Kelas Kafa)** yang merangkumi tiga modul utama:

| Modul | Fungsi |
|-------|--------|
| **eDaftar** | Pendaftaran murid baharu secara dalam talian melalui Google Form |
| **eBayar** | Pengemukaan bukti bayaran yuran bulanan oleh ibu bapa/penjaga |
| **eSemak** | Semakan status pendaftaran dan rekod pembayaran yuran |

---

## 🏗️ Seni Bina Sistem

```
Frontend (GitHub Pages)          Backend (Google Apps Script)
shafielegacy.github.io/UPKK  ←→  GAS Web App (API)
        │                                │
        │                                ▼
        │                      Google Sheets (Database)
        │                      Google Drive (Fail & Resit)
        └──── Role-based view ──→ Admin Panel / Parent View
```

**Stack:**
- **Frontend:** `index.html` di GitHub Pages (`github.com/shafielegacy/UPKK`)
- **Backend API:** Google Apps Script (GAS)
- **Database:** Google Sheets
- **Storage:** Google Drive

---

## 🔧 Infrastruktur Google Workspace

### Komponen Utama

| Komponen | Fungsi | Lokasi Rujukan |
|----------|--------|----------------|
| **Spreadsheet Utama** | Pangkalan data murid, bayaran, admin dan sync log | `PRIVATE.md` lokal sahaja |
| **GAS Project** | Backend API, trigger automasi dan sync Google Forms | `PRIVATE.md` lokal sahaja |
| **Template Resit / Daftar** | Dokumen sumber untuk jana slip dan resit | `PRIVATE.md` lokal sahaja |
| **Google Drive Folder** | Simpan fail resit, slip dan bahan berkaitan | `PRIVATE.md` lokal sahaja |

### Tab dalam Spreadsheet Utama

| Tab | Fungsi |
|-----|--------|
| `ADMIN UPKK` | Akaun admin (EMAIL, PASSWORD, NAMA) |
| `DAFTAR UPKK` | Rekod lengkap semua murid berdaftar |
| `UPKK JAN 2026` hingga `UPKK DIS 2026` | Rekod yuran bulanan (12 tab; Julai menggunakan nama tab `UPKK JULAI 2026`) |

---

## 📋 Struktur Data

### Tab `DAFTAR UPKK`

| # | Lajur | Penerangan |
|---|-------|------------|
| 1 | `Timestamp` | Tarikh & masa pendaftaran |
| 2 | `Email address` | Emel ibu bapa / penjaga |
| 3 | `NAMA PENJAGA` | Nama penuh penjaga |
| 4 | `NAMA MURID` | Nama penuh murid |
| 5 | `NO. MYKID` | No. kad pengenalan murid |
| 6 | `UMUR` | Umur murid |
| 7 | `NO. TELEFON` | No. telefon penjaga |
| 8 | `ALAMAT` | Alamat kediaman |
| 9 | `MUAT NAIK RESIT BAYARAN` | Resit bayaran pendaftaran |
| 10 | `NO RESIT` | Nombor resit |
| 11 | `STATUS` | Status pendaftaran |
| 12–15 | `Merged Doc *` | ID, URL, Link, Status dokumen daftar |
| 16 | `tarikhDaftar` | Tarikh pendaftaran (untuk logik N/A yuran) |

### Tab Yuran Bulanan

| # | Lajur | Penerangan |
|---|-------|------------|
| 1 | `Timestamp` | Tarikh & masa penyerahan |
| 2 | `Email address` | Emel ibu bapa / penjaga |
| 3 | `NAMA PENUH MURID` | Nama penuh murid |
| 4 | `BAYARAN YURAN BAGI BULAN` | Bulan yang dibayar |
| 5 | `TAHUN` | Tahun berkenaan |
| 6 | `TARIKH BAYARAN DIBUAT` | Tarikh bayaran sebenar |
| 7 | `JUMLAH BAYARAN (RM)` | Amaun dalam Ringgit Malaysia |
| 8 | `MUAT NAIK RESIT BAYARAN` | URL resit dimuat naik |
| 9 | `NO RESIT` | Nombor resit rasmi |
| 10 | `STATUS` | SELESAI / BELUM DISAHKAN |
| 11 | `Merged Doc ID` | ID dokumen resit dijana |
| 12 | `Merged Doc URL` | URL dokumen resit *(index 11)* |
| 13 | `Link to merged Doc` | Pautan aktif resit |
| 14 | `Document Merge Status` | Status penjanaan resit |

---

## 🔄 Aliran Kerja Sistem

```
IBU BAPA / PENJAGA
       │
       ▼
┌─────────────────┐
│   eDaftar       │ ← Google Form → tab: DAFTAR UPKK
│  (Pendaftaran)  │   Auto-jana dokumen daftar via Autocrat
└────────┬────────┘
         │ (Murid Berdaftar)
         ▼
┌─────────────────┐
│   eBayar        │ ← Google Form yuran bulanan
│  (Pembayaran)   │   Simpan ke tab: UPKK [BULAN] 2026
└────────┬────────┘
         │ (Rekod Bayaran)
         ▼
┌─────────────────┐
│  Autocrat       │ ← Jana resit & STATUS=SELESAI
│  + Admin Panel  │   Admin pantau, semak, sync form
└────────┬────────┘
         │ (Resit Dijana)
         ▼
┌─────────────────┐
│   eSemak        │ ← Ibu bapa log masuk → semak status & resit
│  (Semakan)      │
└─────────────────┘
```

---

## 👤 Panel Admin

Admin panel tersedia dalam URL yang sama (`index.html`) dengan role-based view detection.

**Login:** Email + 6 digit terakhir nombor telefon

**Tab Admin:**
| Tab | Fungsi |
|-----|--------|
| Dashboard | Ringkasan murid, kutipan, status bulanan, dan senarai murid perlu tindakan |
| Senarai Bayaran | Semak rekod SELESAI / BELUM mengikut bulan dan carian nama |
| Sync Murid | Rebuild pilihan nama dalam 12 Google Form eBayar berdasarkan murid belum bayar sahaja |

---

## 🔁 Logik Khas

### N/A untuk Bulan Sebelum Daftar
Murid yang mendaftar lewat dalam tahun tidak akan dikira sebagai "BELUM BAYAR" untuk bulan-bulan sebelum tarikh daftar mereka. Logik ini menggunakan `tarikhDaftar` dan `CUTOFF_DATES`.

### Bulan Daftar Auto-SELESAI
Bulan di mana murid mendaftar dikira automatik sebagai SELESAI (yuran pendaftaran merangkumi bulan pertama).

### Sync Murid ke Google Forms
GAS menggunakan `FormApp.openById()` untuk sync pilihan nama murid dalam 12 borang yuran menggunakan Form Edit IDs. Sejak v1.20, sync hanya memasukkan murid yang layak bayar bulan tersebut dan belum `SELESAI` dalam tab yuran bulan itu. Ini mengelakkan nama yang sudah bayar muncul semula selepas admin tekan "Sync Sekarang" atau selepas auto-sync eDaftar.

### Status Bayaran: SELESAI / BELUM Sahaja
Tiada status "MENUNGGU" — Autocrat trigger automatik bila borang eBayar dihantar, terus jana resit dan tetapkan STATUS=SELESAI tanpa pengesahan manual admin. Bayaran pendaftaran (eDaftar) juga dikira sebagai yuran bulan pertama secara automatik.

### Auto-Kemas Form eBayar
Trigger `onEbayarUPKKSubmit()` dipasang pada spreadsheet utama. Bila rekod eBayar baru masuk, sistem kesan bulan, baca nama yang sudah `SELESAI`, dan buang nama tersebut daripada pilihan Google Form eBayar bulan yang sama. Nama murid dinormalisasi dari segi huruf besar/kecil dan ruang berganda sebelum dipadankan.

### Sync Log — Pengesanan Murid Baru
Tab `SYNC_LOG` (auto-cipta) menyimpan snapshot senarai nama murid daripada sync terakhir. Setiap kali "Sync Sekarang" dijalankan, sistem membandingkan senarai semasa dengan snapshot — nama yang belum ada dalam snapshot dipaparkan dalam modal popup "🎉 Murid Baru Disync", kemudian `SYNC_LOG` dikemaskini dengan senarai semasa untuk perbandingan seterusnya.
---

## 📁 Konvensyen Penamaan

| Item | Format |
|------|--------|
| Tab Yuran | `UPKK [BULAN SINGKATAN] [TAHUN]` kecuali Julai: `UPKK JULAI 2026` |
| Resit Dokumen | `RESIT UPKK [BULAN SINGKATAN] [TAHUN]` |
| Nama Fail Resit | `RESIT_[NAMA MURID]_[BULAN]_[TAHUN]` |

---

## 👥 Pengguna Sistem

| Peranan | Akses |
|---------|-------|
| **Ibu Bapa / Penjaga** | eDaftar, eBayar, eSemak |
| **Guru / Admin** | Semua di atas + Admin Panel |
| **Superadmin** | Akaun dalaman projek (rujukan dalam `PRIVATE.md`) |

---

## 🛠️ Tools & Deployment

| Tool | Kegunaan |
|------|----------|
| `clasp` | Deploy GAS dari local |
| GitHub Pages | Host `index.html` (frontend) |
| Autocrat | Mail merge → jana resit PDF (13 jobs) |
| Google Forms | eDaftar + 12 borang yuran bulanan |

**`.claspignore` rules:** Exclude `sw.js`, `manifest.json`, `readme.md` — jangan exclude `index.html`

---

## 🛡️ Keselamatan Data

- Spreadsheet & Drive folder dimiliki akaun Google Workspace dalaman, akses terhad
- General access: **Restricted** (bukan public link)
- Login sistem: email + 6 digit terakhir telefon (dimasked)
- ID sensitif, URL editor, folder dalaman, dan credentials **tidak** didedahkan dalam README awam; rujuk `PRIVATE.md` lokal sahaja

---

## 🔗 Debugging & Akses Developer

Maklumat akses developer, perkongsian Google Drive, dan rujukan ID dalaman disimpan dalam `PRIVATE.md` lokal sahaja. README awam ini tidak menyimpan ID Google Workspace atau maklumat akaun dalaman.

---

## 📞 Maklumat Pentadbiran

**Institusi:** Sekolah Kebangsaan Agama Paya Rumput
**Lokasi:** Masjid Tanah, Melaka
**Program:** Kelas Pengajian Bahasa Arab UPKK
**Tahun:** 2026

---

## 📝 Log Versi

| Versi | Tarikh | Perubahan |
|-------|--------|-----------|
| v1.0 | Nov 2025 | Pelancaran sistem eDaftar, eBayar, eSemak |
| v1.1 | Nov 2025 | Penambahan ciri penjanaan dokumen diperibadikan (Autocrat) |
| v1.2 | Jan 2026 | Admin panel, role-based view, sync murid ke 12 Forms, N/A logic, bulan daftar auto-SELESAI |
| v1.3 | Jun 2026 | MCP Google Drive integration untuk debugging, audit kepemilikan GD, README restructure |
| v1.4 | Jun 2026 | Fix sync counter (form JAN checkbox), fix JUMLAH MURID count (GAS logic), dashboard cleanup (remove BELUM BAYAR & BAYARAN SELESAI cards), debug Logger.log removed from Code.gs |
| v1.5 | Jun 2026 | Admin dashboard: tambah bar chart (kutipan per bulan), senarai "Tiada Bayaran" & "Konsisten" (getTiadaBayarDanKonsisten); responsive chart sizing, guard aktivCount>0, nama normalize; buang status MENUNGGU sepenuhnya (sistem auto-SELESAI via Autocrat on form submit); fix FORM_ID constant (sebelum ini salah arah ke form YURAN JUN, sekarang betul ke "DAFTAR KELAS UPKK BAHASA ARAB 2026") dan sahkan FORM_EDIT_IDS.JUN ("YURAN UPKK JUN 2026") adalah betul |
| v1.6 | Jun 2026 | Tambah PWA icons (72–512px + maskable 192/512) dari logo SRA Paya Rumput, fix manifest.json (rujukan icon betul, buang field screenshots yang rosak) — install "Add to Home Screen" disahkan berfungsi di mobile |
| v1.7 | Jun 2026 | Fitur "Murid Baru Disync": syncMuridToForms() kini track tab SYNC_LOG (auto-cipta) untuk bandingkan senarai murid setiap sync; murid baru (belum ada dalam snapshot lalu) dipaparkan dalam modal popup melayang 🎉 selepas Sync Sekarang — senyap jika tiada murid baru. Diuji end-to-end di /exec. |
| v1.8 | Jun 2026 | Auto-sync murid baru ke 12 Google Form eBayar bila eDaftar dihantar (installable trigger pada Form eDaftar, guna syncMuridToForms() sedia ada); email notification automatik ke semua admin (dari tab ADMIN UPKK) bila murid baru dikesan |
| v1.9 | Jun 2026 | Fix bug: rekod eBayar dengan nama gabungan (adik-beradik dihantar serentak via checkbox multi-select dalam satu submission) gagal dipadankan kerana exact-string-match — tambah splitMuridNames() helper, ubah getDashboard/getSenaraiByuran/getTiadaBayarDanKonsisten untuk membership-check bukan exact-match |
| v1.10 | Jun 2026 | (Dilangkau — digabung ke dalam v1.15/v1.16) |
| v1.11 | Jun 2026 | (Dilangkau — fix login adik-beradik diselesaikan secara manual via data fix, bukan kod) |
| v1.12 | Jun 2026 | Fix regresi: getDashboard() throw ReferenceError senyap (rujukan rowNama tertinggal selepas fix splitMuridNames v1.9) menyebabkan dashboard ibu bapa tunjuk semua bulan BELUM walaupun ada rekod SELESAI sah |
| v1.13 | Jun 2026 | Admin dashboard: gantikan senarai "Bayar Penuh" dengan "Sebahagian" (murid dengan campuran SELESAI/BELUM, disusun peratus bayaran terendah dulu) — fokus kepada murid yang perlu tindakan admin, bukan murid yang dah elok |
| v1.14 | Jun 2026 | Tukar "Kutipan per Bulan" chart dan ACTIVE_BULAN (getTiadaBayarDanKonsisten) daripada hardcoded 6 bulan kepada dinamik — auto-extend ikut bulan kalendar semasa (getCurrentMonthNum()), elak bulan akan datang yang belum bermula dikira sebagai wajib bayar |
| v1.15 | Jun 2026 | Tambah butang "↻ Muat Semula" dalam admin dashboard (panggil semula getAdminDashboard tanpa logout); fix auto-logout bila page refresh — session kini disimpan dalam localStorage dan dipulihkan automatik, keluar hanya bila tekan "Log Keluar" |
| v1.16 | Jun 2026 | Fix bug: restore session (localStorage, v1.15) gagal untuk role admin selepas F5 — punca: restore code jalan synchronous sebelum #page-admin wujud dalam DOM (element tu selepas tag </script>); fix bungkus restore logic dalam DOMContentLoaded |
| v1.17 | Jun 2026 | Hapuskan flash page-login semasa F5 restore session — sorok page-login synchronous (inline script) sebelum paint jika localStorage ada sesi tersimpan, loading overlay kekal terbuka sehingga restore data selesai (bukan ikut timer 2.5s sedia ada); tambah safety-net 12s fallback ke page-login kalau restore gagal/timeout supaya skrin tak kekal kosong |
| v1.18 | Jun 2026 | Fix durable: tab DAFTAR UPKK kini dibaca melalui lookup header dinamik (buildColDaftar) bukan index tetap hardcoded — soalan baru ditambah ke Form eDaftar di masa depan (tak kira kedudukan) tidak lagi akan rosakkan sistem secara senyap seperti isu v1.17 |
| v1.19 | Jun 2026 | Auto-kemas Google Form eBayar: tambah `kemasFormEbayar()` + trigger `onEbayarUPKKSubmit` (pada spreadsheet UPKK utama, berbeza dari `onEdaftarFormSubmit` yang pada Form eDaftar) — bila ibu bapa submit bayaran, nama disingkir automatik dari checkbox form bulan berkenaan; butang manual via endpoint `kemasFormEbayar` disediakan untuk penggunaan admin |
| v1.20 | Jun 2026 | Fix logik eBayar: `syncMuridToForms()` dan `kemasFormEbayar()` kini guna sumber logik sama — hanya murid layak bayar bulan tersebut dan belum `SELESAI` akan muncul dalam Google Form; nama dibezakan secara normalize spacing/case; rujukan tab Julai dibetulkan kepada `UPKK JULAI 2026` |
| v1.21 | Jun 2026 | UI Batch 1 — 4 penambahbaikan admin panel (frontend sahaja, index.html): (1) sorting Senarai Bayaran — butang 📅 Terbaru / 📋 Nama A-Z / 💰 Tertinggi, sort berlaku atas data yang sudah difilter, state reset bila tukar tab; (2) progress bar % kutipan per murid dalam kad Status Bulanan dengan warna threshold (merah <30%, oren 30–69%, hijau ≥70%), bulan kosong papar "—"; (3) badge 🔔 notifikasi murid baru di topbar admin (defensive — sedia untuk backend v1.22, guna `res.muridBaru \|\| []`); (4) dark mode toggle 🌙/☀️ untuk admin panel sahaja, scoped ke `#page-admin.adm-dark`, persist via localStorage `upkk_darkmode` |
---

*Sistem ini dibangunkan menggunakan Google Workspace (Google Forms, Google Sheets, Google Docs, Google Apps Script) untuk kemudahan pengurusan kelas UPKK Bahasa Arab SKA Paya Rumput.*
