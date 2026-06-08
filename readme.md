# 📚 Sistem eDaftar · eBayar · eSemak
## Kelas Pengajian Bahasa Arab UPKK
### Sekolah Rendah Agama Paya Rumput, Masjid Tanah, Melaka

---

## 🗂️ Ringkasan Projek

Sistem pengurusan digital bersepadu untuk Kelas Pengajian Bahasa Arab peperiksaan **UPKK (Ujian Penilaian Kelas Kafa)** yang merangkumi tiga modul utama:

| Modul | Fungsi |
|-------|--------|
| **eDaftar** | Pendaftaran murid baharu secara dalam talian melalui Google Form |
| **eBayar** | Pengemukaan bukti bayaran yuran bulanan oleh ibu bapa/penjaga |
| **eSemak** | Semakan status pendaftaran dan rekod pembayaran yuran |

---

## 🔧 Infrastruktur Google Workspace

### ID & Pautan Utama

| Komponen | ID / Maklumat |
|----------|---------------|
| **Google Spreadsheet Utama** | `1pHzToTNZBBvER7zk9XyQUwdl2f_XXDdpX-fEFml_UJg` |
| **Google Form eDaftar** | `1K-CY3tkA2e-qb127F7I1IXEFR7iPkaqZXjIDKTdkslM` |
| **Google Apps Script (GAS)** | [Buka Editor GAS](https://script.google.com/u/0/home/projects/1ic6k1EntnEUOgkG4jcD6-XviqDVu7KWPLE5O6R8NP3xxPsKPLYv_gFxA/edit) |
| **GAS Project ID** | `1ic6k1EntnEUOgkG4jcD6-XviqDVu7KWPLE5O6R8NP3xxPsKPLYv_gFxA` |
| **GAS Web App URL** | `https://script.google.com/macros/s/AKfycbwkM4yIRPDORVYM5qyDWVUuq3P37TnpjLa98KsJN-6bhn0Wp4Gr_iYgkz0YCAGCQEzajA/exec` |
| **Template Resit (Google Doc)** | `1lF6PjR-dxNT6xhVGcmha2wtXcRUx9xkJPOHGbgIOXMY` |
| **Template Daftar (Google Doc)** | `1zPnyAQx7MEESNMgNqMWdZS-SNw43tdMGX-DLYAF3CoI` |

### Lokasi Fail Tempatan (Local Path)

| Komponen | Path / URL |
|----------|------------|
| **OneDrive Local Path** | `C:\Users\burnk\OneDrive\Documents-assets\UPKK` |
| **GitHub Repository** | [https://github.com/shafielegacy/UPKK](https://github.com/shafielegacy/UPKK) |
| **GitHub Pages (Live)** | [https://shafielegacy.github.io/UPKK](https://shafielegacy.github.io/UPKK) |

### Tab dalam Spreadsheet Utama

#### Tab Pendaftaran
- `DAFTAR UPKK` — Rekod lengkap semua murid yang berdaftar (sumber utama login ibu bapa)

#### Tab Yuran Bulanan (12 bulan)
| Tab | Bulan |
|-----|-------|
| `UPKK JAN 2026` | Januari 2026 |
| `UPKK FEB 2026` | Februari 2026 |
| `UPKK MAC 2026` | Mac 2026 |
| `UPKK APRIL 2026` | April 2026 |
| `UPKK MEI 2026` | Mei 2026 |
| `UPKK JUN 2026` | Jun 2026 |
| `UPKK JUL 2026` | Julai 2026 |
| `UPKK OGOS 2026` | Ogos 2026 |
| `UPKK SEPT 2026` | September 2026 |
| `UPKK OKT 2026` | Oktober 2026 |
| `UPKK NOV 2026` | November 2026 |
| `UPKK DIS 2026` | Disember 2026 |

---

## 📋 Struktur Data — Tab DAFTAR UPKK

| # | Nama Lajur | Penerangan |
|---|-----------|------------|
| 1 | `Timestamp` | Tarikh & masa pendaftaran |
| 2 | `Email address` | Emel ibu bapa / penjaga ← **LOGIN** |
| 3 | `NAMA PENJAGA (SAMA SEPERTI MYKAD)` | Nama penuh ibu bapa/penjaga |
| 4 | `NAMA MURID (SAMA SEPERTI MYKID)` | Nama penuh murid |
| 5 | `NO. MYKID` | No. MyKid murid |
| 6 | `UMUR` | Umur murid |
| 7 | `NO. TELEFON` | No. telefon ibu bapa ← **PASSWORD** |
| 8 | `ALAMAT PENUH TEMPAT TINGGAL` | Alamat murid |
| 9 | `MUAT NAIK RESIT BAYARAN` | Resit bayaran pendaftaran |
| 10 | `NO RESIT` | No. resit pendaftaran |
| 11 | `STATUS` | Status pendaftaran |
| 12 | `Merged Doc ID - DAFTAR UPKK 2026` | ID dokumen slip daftar |
| 13 | `Merged Doc URL - DAFTAR UPKK 2026` | URL dokumen slip daftar |
| 14 | `Link to merged Doc - DAFTAR UPKK 2026` | Pautan aktif slip daftar |
| 15 | `Document Merge Status - DAFTAR UPKK 2026` | Status penjanaan dokumen |
| 16 | `UMUR 10 TAHUN` | Kiraan murid umur 10 |
| 17 | `UMUR 11 TAHUN` | Kiraan murid umur 11 |
| 18 | `UMUR 12 TAHUN` | Kiraan murid umur 12 |

---

## 📋 Struktur Data — Tab Yuran Bulanan

| # | Nama Lajur | Penerangan |
|---|-----------|------------|
| 1 | `Timestamp` | Tarikh & masa penyerahan |
| 2 | `Email address` | Emel ibu bapa / penjaga |
| 3 | `NAMA PENUH MURID` | Nama penuh murid |
| 4 | `BAYARAN YURAN BAGI BULAN` | Bulan yang dibayar |
| 5 | `TAHUN` | Tahun berkenaan |
| 6 | `TARIKH BAYARAN DIBUAT` | Tarikh bayaran sebenar |
| 7 | `JUMLAH BAYARAN (RM)` | Amaun bayaran (RM40 / RM80) |
| 8 | `MUAT NAIK RESIT BAYARAN` | URL resit yang dimuat naik |
| 9 | `NO RESIT` | Nombor resit rasmi |
| 10 | `STATUS` | Status: SELESAI / BELUM |
| 11 | `Merged Doc ID - RESIT UPKK [BULAN] 2026` | ID dokumen resit dijana |
| 12 | `Merged Doc URL - RESIT UPKK [BULAN] 2026` | URL dokumen resit |
| 13 | `Link to merged Doc - RESIT UPKK [BULAN] 2026` | Pautan aktif resit |
| 14 | `Document Merge Status - RESIT UPKK [BULAN] 2026` | Status penjanaan resit |

---

## 🔐 Sistem Login Ibu Bapa

### Kaedah Login
| Field | Sumber Data | Lajur |
|-------|-------------|-------|
| **Email** | Tab `DAFTAR UPKK` | `Email address` |
| **Password** | Tab `DAFTAR UPKK` | `NO. TELEFON` |

### Selepas Login Berjaya — Dashboard Ibu Bapa
1. **Nama anak** dipaparkan (dari `NAMA MURID (SAMA SEPERTI MYKID)`)
2. **Status yuran** Jan–Dis 2026 (cari email dalam semua 12 tab yuran)
3. **eBayar** — kemaskini bayaran bulan semasa
4. **Download Resit** — muat turun resit yang telah disahkan (`Link to merged Doc`)

---

## 🔄 Aliran Kerja Sistem

```
IBU BAPA / PENJAGA
       │
       ▼
┌─────────────────┐
│   LOGIN         │ ← Email + NO. TELEFON (semak dari tab DAFTAR UPKK)
└────────┬────────┘
         │ (Berjaya Log Masuk)
         ▼
┌─────────────────┐
│   Dashboard     │ ← Nama anak + Status yuran Jan-Dis 2026
│   Ibu Bapa      │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌────────┐
│ eBayar │ │ Resit  │
│(Kemaskini│ │(Download│
│ Yuran) │ │  PDF)  │
└────────┘ └────────┘
         │
         ▼
┌─────────────────┐
│  Pengesahan     │ ← Admin sahkan STATUS → Jana Resit Digital
│  Admin          │
└─────────────────┘
```

---

## 🏷️ Projek — UPKK Nama Diberi

### Konstanta GAS

```javascript
// =============================================
// SISTEM UPKK — SKA PAYA RUMPUT 2026
// =============================================

const SPREADSHEET_ID = '1pHzToTNZBBvER7zk9XyQUwdl2f_XXDdpX-fEFml_UJg';
const FORM_ID        = '1K-CY3tkA2e-qb127F7I1IXEFR7iPkaqZXjIDKTdkslM';
const TEMPLATE_RESIT = '1lF6PjR-dxNT6xhVGcmha2wtXcRUx9xkJPOHGbgIOXMY';
const TEMPLATE_DAFTAR= '1zPnyAQx7MEESNMgNqMWdZS-SNw43tdMGX-DLYAF3CoI';

// Tab nama
const TAB = {
  DAFTAR : 'DAFTAR UPKK',
  JAN    : 'UPKK JAN 2026',
  FEB    : 'UPKK FEB 2026',
  MAC    : 'UPKK MAC 2026',
  APRIL  : 'UPKK APRIL 2026',
  MEI    : 'UPKK MEI 2026',
  JUN    : 'UPKK JUN 2026',
  JUL    : 'UPKK JUL 2026',
  OGOS   : 'UPKK OGOS 2026',
  SEPT   : 'UPKK SEPT 2026',
  OKT    : 'UPKK OKT 2026',
  NOV    : 'UPKK NOV 2026',
  DIS    : 'UPKK DIS 2026'
};

// Lajur tab DAFTAR UPKK (index bermula 0)
const COL_DAFTAR = {
  TIMESTAMP : 0,
  EMAIL     : 1,
  NAMA_PENJAGA : 2,
  NAMA_MURID   : 3,
  NO_MYKID     : 4,
  UMUR         : 5,
  NO_TELEFON   : 6,
  ALAMAT       : 7,
  RESIT_UPLOAD : 8,
  NO_RESIT     : 9,
  STATUS       : 10
};

// Lajur tab yuran bulanan (index bermula 0)
const COL_YURAN = {
  TIMESTAMP    : 0,
  EMAIL        : 1,
  NAMA_MURID   : 2,
  BULAN        : 3,
  TAHUN        : 4,
  TARIKH_BAYAR : 5,
  JUMLAH       : 6,
  RESIT_UPLOAD : 7,
  NO_RESIT     : 8,
  STATUS       : 9,
  MERGED_ID    : 10,
  MERGED_URL   : 11,
  MERGED_LINK  : 12,
  MERGE_STATUS : 13
};
```

---

## 📁 Konvensyen Penamaan

| Item | Format |
|------|--------|
| Tab Yuran | `UPKK [BULAN SINGKATAN] [TAHUN]` |
| Resit Dijana | `RESIT UPKK [BULAN] [NAMA MURID]` |
| Nama Fail Resit | `RESIT_[NAMA MURID]_[BULAN]_[TAHUN]` |

---

## 👥 Pengguna Sistem

| Peranan | Akses |
|---------|-------|
| **Ibu Bapa / Penjaga** | Login → Dashboard → eBayar → Download Resit |
| **Guru / Admin** | Semak rekod, sahkan bayaran, jana resit digital |
| **Pengetua / Pentadbir** | Akses penuh semua data & laporan |

---

## 📊 Statistik Semasa

| Data | Maklumat |
|------|----------|
| **Jumlah Murid Berdaftar** | 48 murid |
| **Yuran Bulanan** | RM40 / bulan |
| **Yuran 2 Bulan** | RM80 |
| **Tahun Aktif** | 2026 |

---

## 🛡️ Keselamatan Data

- Login disahkan menggunakan **Email + NO. TELEFON** dari tab `DAFTAR UPKK`
- Semua data murid disimpan dalam Google Spreadsheet yang dilindungi
- Akses spreadsheet dihadkan kepada pentadbir yang sah sahaja
- Resit bayaran disimpan dalam Google Drive yang selamat
- Emel pengesahan dihantar automatik kepada ibu bapa/penjaga

---

## 📞 Maklumat Pentadbiran

**Institusi:** Sekolah Rendah Agama Paya Rumput  
**Lokasi:** Masjid Tanah, Melaka  
**Program:** Kelas Pengajian Bahasa Arab UPKK  
**Tahun:** 2026  
**Emel Admin:** upkksl@gmail.com

---

## 🏗️ Arkitektur Sistem

```
GitHub Pages (index.html)  ←→  JSONP  ←→  Google Apps Script (Code.gs)
                                                      ↕
                                           Google Spreadsheet
                                         (data murid & yuran)
```

---

## 📂 Status Fail

| Fail | Fungsi | Status |
|------|--------|--------|
| `index.html` | Frontend UI — Login + Dashboard + Modal eBayar + Modal Resit | ✅ Siap |
| `Code.gs` | Backend GAS — 4 fungsi API: login, getDashboard, submitBayaran, getResit | ✅ Siap |
| `manifest.json` | PWA manifest (boleh install ke home screen) | ✅ Siap |
| `sw.js` | Service Worker untuk PWA | ⏳ Belum ada |
| `icons/` | Folder ikon PWA (icon-72.png hingga icon-512.png) | ⏳ Belum ada |
| `screenshots/` | Screenshot untuk PWA install prompt | ⏳ Belum ada |

---

## ⚠️ Isu Semasa

| Isu | Status |
|-----|--------|
| CORS "Failed to fetch" — GitHub Pages tidak dapat connect ke GAS | ⏳ Belum fix |
| Admin login — belum dibina | ⏳ Belum ada |
| sw.js & ikon PWA — PWA tidak berfungsi sepenuhnya | ⏳ Belum ada |

---

## 🔜 Pembangunan Seterusnya

### Kritikal (Perlu Segera)
1. **Fix CORS** — `Code.gs` return `ContentService` JSON dengan headers betul
2. **sw.js** — Service Worker untuk PWA install berfungsi
3. **icons/** — Folder ikon PWA

### Panel Admin (Belum Ada)
- Login admin berasingan
- Senarai semua bayaran MENUNGGU
- Butang "Sahkan" + auto-jana resit digital
- Laporan & statistik (bayaran bulan ini, tertunggak, export PDF)

### Modul Tambahan
- **eDaftar** — Paparan status pendaftaran dalam dashboard (Google Form dah ada)
- **Notifikasi Emel** — Auto email bila bayaran diterima/disahkan/resit siap
- **Keselamatan Login** — Rate limiting, session token / OTP

---

## 📝 Log Versi

| Versi | Tarikh | Perubahan |
|-------|--------|-----------|
| v1.0 | 2026 | Pelancaran sistem eDaftar, eBayar, eSemak |
| v1.1 | 2026 | Projek UPKK Nama Diberi — Login ibu bapa, Dashboard, eBayar, Download Resit |

---

*Sistem ini dibangunkan menggunakan Google Workspace (Google Forms, Google Sheets, Google Docs, Google Apps Script) untuk kemudahan pengurusan kelas UPKK Bahasa Arab Sekolah Rendah Agama Paya Rumput.*
