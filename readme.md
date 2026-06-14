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

### ID Utama

| Komponen | ID |
|----------|----|
| **Spreadsheet Utama** | `1pHzToTNZBBvER7zk9XyQUwdl2f_XXDdpX-fEFml_UJg` |
| **GAS Project** | `1ic6k1EntnEUOgkG4jcD6-XviqDVu7KWPLE5O6R8NP3xxPsKPLYv_gFxA` |
| **Template Resit (Slides)** | `1lF6PjR-dxNT6xhVGcmha2wtXcRUx9xkJPOHGbgIOXMY` |
| **Google Drive Folder** | `1_v5nmDafvc2cUFj1ayFtyVTnfDgsaXKQ` |

### Tab dalam Spreadsheet Utama

| Tab | Fungsi |
|-----|--------|
| `ADMIN UPKK` | Akaun admin (EMAIL, PASSWORD, NAMA) |
| `DAFTAR UPKK` | Rekod lengkap semua murid berdaftar |
| `UPKK JAN 2026` hingga `UPKK DIS 2026` | Rekod yuran bulanan (12 tab) |

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
│  Pengesahan     │ ← Admin Panel (index.html)
│  Admin          │   Sahkan STATUS → Jana Resit via Autocrat
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
| Dashboard | Ringkasan SELESAI / BELUM BAYAR per bulan |
| Senarai Bayaran | Semak & sahkan rekod bayaran murid |
| Sync Murid | Sync senarai murid ke 12 Google Forms yuran |

---

## 🔁 Logik Khas

### N/A untuk Bulan Sebelum Daftar
Murid yang mendaftar lewat dalam tahun tidak akan dikira sebagai "BELUM BAYAR" untuk bulan-bulan sebelum tarikh daftar mereka. Logik ini menggunakan `tarikhDaftar` dan `CUTOFF_DATES`.

### Bulan Daftar Auto-SELESAI
Bulan di mana murid mendaftar dikira automatik sebagai SELESAI (yuran pendaftaran merangkumi bulan pertama).

### Sync Murid ke Google Forms
GAS menggunakan `FormApp.openById()` untuk sync senarai murid ke 12 borang yuran menggunakan Form Edit IDs.

### Status Bayaran: SELESAI / BELUM Sahaja
Tiada status "MENUNGGU" — Autocrat trigger automatik bila borang eBayar dihantar, terus jana resit dan tetapkan STATUS=SELESAI tanpa pengesahan manual admin. Bayaran pendaftaran (eDaftar) juga dikira sebagai yuran bulan pertama secara automatik.
---

## 📁 Konvensyen Penamaan

| Item | Format |
|------|--------|
| Tab Yuran | `UPKK [BULAN SINGKATAN] [TAHUN]` |
| Resit Dokumen | `RESIT UPKK [BULAN SINGKATAN] [TAHUN]` |
| Nama Fail Resit | `RESIT_[NAMA MURID]_[BULAN]_[TAHUN]` |

---

## 👥 Pengguna Sistem

| Peranan | Akses |
|---------|-------|
| **Ibu Bapa / Penjaga** | eDaftar, eBayar, eSemak |
| **Guru / Admin** | Semua di atas + Admin Panel |
| **Superadmin** | Akaun `upkksl@gmail.com` (dua pengguna berkongsi) |

---

## 🛠️ Tools & Deployment

| Tool | Kegunaan |
|------|----------|
| `clasp` | Deploy GAS dari local |
| GitHub Pages | Host `index.html` (frontend) |
| Autocrat | Mail merge → jana resit PDF (13 jobs) |
| Google Forms | eDaftar + 12 borang yuran bulanan |

**Local paths:**
- Laptop: `C:\Users\burnk\OneDrive\Documents-assets\UPKK`
- PC: `D:\OneDrive\Documents-assets\UPKK`

**`.claspignore` rules:** Exclude `sw.js`, `manifest.json`, `readme.md` — jangan exclude `index.html`

---

## 🛡️ Keselamatan Data

- Spreadsheet & Drive folder dimiliki `upkksl@gmail.com`, akses terhad
- General access: **Restricted** (bukan public link)
- Login sistem: email + 6 digit terakhir telefon (dimasked)
- ID sensitif & credentials **tidak** didedahkan dalam README awam

---

## 🔗 MCP Integration (Developer)

Untuk debugging sesi claude.ai, Google Drive folder projek di-share kepada `burn.kajang@gmail.com` sebagai Viewer. Ini membolehkan Claude membuat live-check pada:
- Data spreadsheet
- Kewujudan fail resit dalam Drive
- Cross-reference antara Sheets dan Drive

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
---

*Sistem ini dibangunkan menggunakan Google Workspace (Google Forms, Google Sheets, Google Docs, Google Apps Script) untuk kemudahan pengurusan kelas UPKK Bahasa Arab SKA Paya Rumput.*
