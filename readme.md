<p align="center">
  <img src="https://i.ibb.co/5WQVGBTx/photo-2026-06-08-12-53-39.jpg" alt="Logo UPKK SKA Paya Rumput" width="150"/>
</p>

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
| **GF eBayar Januari 2026** | https://docs.google.com/forms/d/e/1FAIpQLSdIKsDMRQ2bWMELDNZxSVl1DrhJbOQNqL73FR6lFPNr86Qu2Q/viewform |
| **GF eBayar Februari 2026** | https://docs.google.com/forms/d/e/1FAIpQLSc_baJPPLHV1LoxLoH-z-jPcPw8IMHHdZAGMarC0hVlqASs-g/viewform |
| **GF eBayar Mac 2026** | https://docs.google.com/forms/d/e/1FAIpQLScW_I6L1IqVlz4RvBcjh-9SQiTAgjLLKhplClu1izT2R8XHzA/viewform |
| **GF eBayar April 2026** | https://docs.google.com/forms/d/e/1FAIpQLSdm1pKUHVKdr8llxlDJ1kOyqLAznN-_7S_iH6pF83gnuU2tQA/viewform |
| **GF eBayar Mei 2026** | https://docs.google.com/forms/d/e/1FAIpQLSfOwJzIEQnbJ-33eMkO99bjdYcm8wTO4DOu3n3Pd4dVk4kGYA/viewform |
| **GF eBayar Jun 2026** | https://docs.google.com/forms/d/e/1FAIpQLSf2e-qhKquxvC3WWsElC1lQ20WOQrbSDsP3R1e__qIjPf2iYg/viewform |
| **GF eBayar Julai 2026** | https://docs.google.com/forms/d/e/1FAIpQLSfItRyNHpaPpV1cCf0bnktnsh7cxIxvxdMuTsd-PLtgFPItjA/viewform |
| **GF eBayar Ogos 2026** | https://docs.google.com/forms/d/e/1FAIpQLScwkvztMKKkLIkp6rIa_PAEm1n9Gx3934IFYE2No8H8B059YA/viewform |
| **GF eBayar September 2026** | https://docs.google.com/forms/d/e/1FAIpQLSc_zyiT5GhwNZqWu4KUBPGiNj337WbXKEFHgoNf6zY6yixXqA/viewform |
| **GF eBayar Oktober 2026** | https://docs.google.com/forms/d/e/1FAIpQLSeLi6GsHg3QzButzWGi4E6BfsleBY_MTBNLmO_5c0eWv2frqw/viewform |
| **GF eBayar November 2026** | https://docs.google.com/forms/d/e/1FAIpQLSdeyPq0kSwvamQ0cpjkq_j68NyLwUBq9W805Xmm-AsE0dgJKQ/viewform |
| **GF eBayar Disember 2026** | https://docs.google.com/forms/d/e/1FAIpQLSfrI2aQsFVOoL4ytQnKpAQQ7lPdK0-Q7qdYFvscUVxpahNBow/viewform |

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
| 1 | `Timestamp` | Tarikh & masa pendaftaran ← Tarikh daftar murid |
| 2 | `Email address` | Emel ibu bapa / penjaga ← LOGIN |
| 3 | `NAMA PENJAGA (SAMA SEPERTI MYKAD)` | Nama penuh ibu bapa/penjaga |
| 4 | `NAMA MURID (SAMA SEPERTI MYKID)` | Nama penuh murid |
| 5 | `NO. MYKID` | No. MyKid murid |
| 6 | `UMUR` | Umur murid |
| 7 | `NO. TELEFON` | No. telefon ibu bapa ← PASSWORD (6 digit terakhir) |
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

| Field | Sumber Data | Lajur |
|-------|-------------|-------|
| **Email** | Tab `DAFTAR UPKK` | `Email address` |
| **Password** | Tab `DAFTAR UPKK` | `NO. TELEFON` — 6 digit terakhir sahaja (masked ••••••) |

---

## 👤 Akaun & Akses Projek

| Komponen | Maklumat |
|----------|----------|
| **GitHub Username** | `shafielegacy` |
| **GitHub Email** | `burn.kajang@gmail.com` |
| **GitHub Repo** | [https://github.com/shafielegacy/UPKK](https://github.com/shafielegacy/UPKK) |
| **GitHub Pages (Live)** | [https://shafielegacy.github.io/UPKK](https://shafielegacy.github.io/UPKK) |
| **GAS Admin Email** | upkksl@gmail.com |

> ⚠️ **Penting:** User TIDAK diberikan URL GAS `/exec`. URL yang digunakan ialah GitHub Pages sahaja: `shafielegacy.github.io/UPKK`

---

## 🏗️ Arkitektur Sistem

```
GitHub Pages (index.html)  ←→  fetch GET + JSON  ←→  Google Apps Script (Code.gs)
                                                                 ↕
                                                      Google Spreadsheet
                                                    (data murid & yuran)
```

### Aliran Deploy

```
Kod tempatan (OneDrive)
       │
       ├── clasp push --force  →  GAS Editor  →  Deploy New Version
       │
       └── git push            →  GitHub repo  →  GitHub Pages (live)
```

---

## 🔄 Aliran Kerja Sistem

```
IBU BAPA / PENJAGA
       │
       ▼
┌─────────────────┐
│   LOGIN         │ ← Email + 6 digit terakhir NO. TELEFON
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
│(Hantar │ │(Muat   │
│ Yuran) │ │ Turun) │
└────────┘ └────────┘
         │
         ▼
┌─────────────────┐
│  Pengesahan     │ ← Admin sahkan STATUS → Jana Resit Digital
│  Admin          │
└─────────────────┘
```

---

## 📁 Status Fail

| Fail | Fungsi | Status |
|------|--------|--------|
| `index.html` | Frontend UI — Login + Dashboard + Modal eBayar + Modal Resit | ✅ Siap |
| `Code.gs` | Backend GAS — 4 fungsi API: login, getDashboard, submitBayaran, getResit | ✅ Siap |
| `appsscript.json` | Manifest GAS (timezone, runtime V8) | ✅ Siap |
| `.clasp.json` | Konfigurasi clasp untuk deploy ke GAS | ✅ Siap |
| `manifest.json` | PWA manifest (boleh install ke home screen) | ✅ Siap |
| `sw.js` | Service Worker untuk PWA offline cache | ✅ Siap |

---

## 🐛 Isu Semasa

| Isu | Status |
|-----|--------|
| Kad bulan berfungsi | ✅ Fixed |
| eBayar modal → Google Form | ✅ Fixed |
| Resit Digital download | ✅ Fixed |
| Nama murid terpotong | ✅ Fixed |
| Logo sekolah | ✅ Fixed |

---

## 🛠️ Cara Deploy

### Push kod ke GAS
```bash
clasp push --force
```
Kemudian dalam GAS Editor: **Deploy → Manage Deployments → Edit → New Version → Deploy**

### Push ke GitHub Pages
```bash
git add .
git commit -m "update"
git push https://shafielegacy:<TOKEN>@github.com/shafielegacy/UPKK.git master
```

---

## 📊 Statistik Sistem

| Data | Maklumat |
|------|----------|
| **Jumlah Murid Berdaftar** | 48 murid |
| **Yuran Bulanan** | RM40 / bulan |
| **Yuran 2 Bulan** | RM80 |
| **Tahun Aktif** | 2026 |

---

## 🔜 Pembangunan Seterusnya

### 🟡 Panel Admin (admin.html — fail berasingan)
- Login admin guna email upkksl@gmail.com + password khas
- Dua superadmin guna akaun yang sama (upkksl@gmail.com)
- URL admin: shafielegacy.github.io/UPKK/admin
- Credentials disimpan dalam tab ADMIN UPKK dalam spreadsheet
- Senarai semua bayaran MENUNGGU
- Butang "Sahkan" + auto-jana resit digital (Document Merge)
- Auto-email ibu bapa bila resit siap
- Laporan & statistik (bayaran bulan ini, tertunggak, export PDF)
- Carian & filter nama murid, bulan, status

---

## 🔜 Modul Tambahan

**Sync Murid ke Google Form eBayar** — Button/fungsi sync senarai murid baru dari tab DAFTAR UPKK ke Google Form eBayar. Sync akan auto-filter bulan berdasarkan tarikh daftar murid (Timestamp) — murid yang daftar Mac 2026 hanya nampak pilihan bulan Mac-Dis 2026 dalam form, bulan sebelum tarikh daftar tidak akan appear. (Form ID: `1K-CY3tkA2e-qb127F7I1IXEFR7iPkaqZXjIDKTdkslM`)

---

## 📞 Maklumat Pentadbiran

**Institusi:** Sekolah Rendah Agama Paya Rumput  
**Lokasi:** Masjid Tanah, Melaka  
**Program:** Kelas Pengajian Bahasa Arab UPKK  
**Tahun:** 2026  
**Emel Admin:** upkksl@gmail.com

---

*Sistem ini dibangunkan menggunakan Google Workspace (Google Forms, Google Sheets, Google Docs, Google Apps Script) dan dihoskan di GitHub Pages.*
