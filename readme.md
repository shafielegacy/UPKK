# 📚 Sistem eDaftar · eBayar · eSemak
## Kelas Pengajian Bahasa Arab UPKK
### Sekolah Kebangsaan Agama Paya Rumput, Masjid Tanah, Melaka

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

### Lokasi Fail Tempatan (Local Path)

| Komponen | Path / URL |
|----------|------------|
| **OneDrive Local Path** | `C:\Users\burnk\OneDrive\Documents-assets\UPKK` |
| **GitHub Repository** | [https://github.com/shafielegacy/UPKK](https://github.com/shafielegacy/UPKK) |
### Tab dalam Spreadsheet Utama

#### Tab Pendaftaran
- `DAFTAR UPKK` — Rekod lengkap semua murid yang berdaftar

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

## 📋 Struktur Data — Tab Yuran Bulanan

Setiap tab yuran bulanan mengandungi lajur-lajur berikut:

| # | Nama Lajur | Penerangan |
|---|-----------|------------|
| 1 | `Timestamp` | Tarikh & masa penyerahan borang |
| 2 | `Email address` | Emel ibu bapa / penjaga |
| 3 | `NAMA PENUH MURID` | Nama penuh murid |
| 4 | `BAYARAN YURAN BAGI BULAN` | Bulan yang dibayar |
| 5 | `TAHUN` | Tahun berkenaan |
| 6 | `TARIKH BAYARAN DIBUAT` | Tarikh pembayaran sebenar |
| 7 | `JUMLAH BAYARAN (RM)` | Amaun bayaran dalam Ringgit Malaysia |
| 8 | `MUAT NAIK RESIT BAYARAN` | URL/fail resit yang dimuat naik |
| 9 | `NO RESIT` | Nombor resit rasmi |
| 10 | `STATUS` | Status pembayaran (Disahkan / Belum Disahkan) |
| 11 | `Merged Doc ID - RESIT UPKK [BULAN] [TAHUN]` | ID dokumen resit yang dijana |
| 12 | `Merged Doc URL - RESIT UPKK [BULAN] [TAHUN]` | URL dokumen resit |
| 13 | `Link to merged Doc - RESIT UPKK [BULAN] [TAHUN]` | Pautan aktif ke dokumen resit |
| 14 | `Document Merge Status - RESIT UPKK [BULAN] [TAHUN]` | Status proses penjanaan resit |

---

## 🔄 Aliran Kerja Sistem

```
IBU BAPA / PENJAGA
       │
       ▼
┌─────────────────┐
│   eDaftar       │ ← Google Form (ID: 1K-CY3tkA2e-qb127F7I1IXEFR7iPkaqZXjIDKTdkslM)
│  (Pendaftaran)  │   Simpan ke tab: DAFTAR UPKK
└────────┬────────┘
         │ (Murid Berdaftar)
         ▼
┌─────────────────┐
│   eBayar        │ ← Serahkan resit bayaran bulanan
│  (Pembayaran)   │   Simpan ke tab: UPKK [BULAN] 2026
└────────┬────────┘
         │ (Rekod Bayaran)
         ▼
┌─────────────────┐
│  Pengesahan     │ ← Admin semak & sahkan STATUS
│  Admin          │   Penjanaan Resit Digital (Document Merge)
└────────┬────────┘
         │ (Resit Dijana)
         ▼
┌─────────────────┐
│   eSemak        │ ← Ibu bapa semak status & muat turun resit
│  (Semakan)      │
└─────────────────┘
```

---

## 🏷️ Projek Baharu — UPKK Nama Diberi

### Tujuan
Fitur baharu untuk sistem ini ialah **penjanaan dokumen yang diperibadikan dengan nama murid** secara automatik — setiap resit/dokumen akan dihasilkan dengan nama penuh murid berkenaan.

### Kaedah Pelaksanaan (Google Apps Script)

```javascript
/**
 * UPKK Nama Diberi — Jana dokumen resit dengan nama murid
 * Sistem eDaftar eBayar eSemak UPKK SKA Paya Rumput
 */

const SPREADSHEET_ID = '1pHzToTNZBBvER7zk9XyQUwdl2f_XXDdpX-fEFml_UJg';
const FORM_ID = '1K-CY3tkA2e-qb127F7I1IXEFR7iPkaqZXjIDKTdkslM';

// Lajur dalam tab yuran bulanan
const COL = {
  TIMESTAMP: 0,
  EMAIL: 1,
  NAMA_MURID: 2,
  BULAN: 3,
  TAHUN: 4,
  TARIKH_BAYARAN: 5,
  JUMLAH: 6,
  RESIT_UPLOAD: 7,
  NO_RESIT: 8,
  STATUS: 9,
  MERGED_DOC_ID: 10,
  MERGED_DOC_URL: 11,
  MERGED_DOC_LINK: 12,
  MERGE_STATUS: 13
};
```

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
| **Ibu Bapa / Penjaga** | eDaftar (hantar borang), eBayar (muat naik resit), eSemak (semak status) |
| **Guru / Admin** | Semak rekod, sahkan bayaran, jana resit digital |
| **Pengetua / Pentadbir** | Akses penuh semua data & laporan |

---

## 🛡️ Keselamatan Data

- Semua data murid disimpan dalam **Google Spreadsheet** yang dilindungi kata laluan folder Google Drive
- Akses spreadsheet dihadkan kepada pentadbir yang sah sahaja
- Resit bayaran yang dimuat naik disimpan dalam Google Drive yang selamat
- Emel pengesahan dihantar secara automatik kepada ibu bapa / penjaga

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
| v1.0 | 2026 | Pelancaran sistem eDaftar, eBayar, eSemak |
| v1.1 | 2026 | Penambahan ciri UPKK Nama Diberi (penjanaan dokumen diperibadikan) |

---

*Sistem ini dibangunkan menggunakan Google Workspace (Google Forms, Google Sheets, Google Docs, Google Apps Script) untuk kemudahan pengurusan kelas UPKK Bahasa Arab SKA Paya Rumput.*
