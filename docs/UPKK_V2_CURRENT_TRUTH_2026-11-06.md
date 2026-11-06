# UPKK V2 — CURRENT TRUTH / KEPUTUSAN TERKINI (6 NOV 2026)

> **SUMBER UTAMA STATUS AKTIF. BACA INI DAHULU.** Dokumen bertarikh 4–5 November ialah rekod sejarah QA; mana-mana ayat 'yuran belum disahkan', 'monthly AutoCrat not implemented', 'hourly trigger OFF', atau 'Admin sync unverified' dalam rekod lama **TIDAK LAGI menggambarkan status terkini**. Jangan ulang pertanyaan dasar yuran yang pemilik sudah sahkan.

**Repository:** shafielegacy/UPKK  
**QA branch:** feature/v2-admin-settings-minimal-qa  
**Dikemas kini:** Jumaat, 6 November 2026 (MYT)  
**Sasaran pemilik:** Buka pendaftaran V2 pada **Isnin, 9 November 2026**, tertakluk kepada security QA dan release authorisation. Belum GO-LIVE.

## KEPUTUSAN YURAN — CONFIRMED / LOCKED oleh pemilik berdasarkan ketetapan Ustaz

| Perkara | Ketetapan aktif |
| --- | --- |
| Yuran pendaftaran | **RM50** |
| Yuran bulanan | **RM50** |
| Pendaftaran dalam **November 2026** | **RM50 sahaja** untuk pendaftaran/tempahan tempat; **TIADA yuran bulanan November** |
| Kelas bermula | **Disember 2026** |
| Pendaftaran mulai **Disember 2026** | **RM100** = RM50 pendaftaran + RM50 yuran bulan pertama |
| Kredit RM50 dalam RM100 | Dikira untuk **bulan pertama yang dikenakan semasa pendaftaran** (bagi pendaftaran Disember 2026: **Disember 2026**); jangan caj dua kali bulan sama |
| Murid lama | **WAJIB daftar semula**; rekod V1 kekal |
| Mata pelajaran pakej baharu | Bahasa Arab, Akidah, Ibadah |
| Tahun kelas | Tahun 3, 4, 5 |
| Kuota setiap tahun | 30 Fizikal + 20 Online |
| Admin | Semak bukti bayaran dahulu; resit rasmi selepas pengesahan |
| Penutupan pengambilan | Rekod keputusan asal 4 Nov menetapkan **31 Disember 2026**, pengecualian selepas itu oleh Admin sahaja. **Tetapan tarikh tamat kosong dalam BACKUP ialah QA sahaja**, bukan kelulusan buka pendaftaran LIVE tanpa had. |

**PENTING:** Baris kredit Disember di atas merekod tafsiran operasi terkini yang pemilik telah tetapkan dalam perbualan; jangan lagi membawa catatan 'Disember atau Januari?' dari dokumen 4 Nov sebagai *keputusan dasar yuran belum disahkan*. Jika Ustaz memberikan arahan baru yang berbeza secara nyata, catat perubahan bertarikh dan audit implikasi resit; jangan diam-diam ubah sejarah.

## STATUS QA TERKINI (6 NOV)

| Aliran | Status/bukti |
| --- | --- |
| Native eDaftar November RM50, OTP, permohonan, Admin approval, resit pendaftaran | PASS di GAS + Sheets BACKUP untuk sampel QA |
| Parent dashboard + kad November + resit pendaftaran | PASS untuk sampel QA |
| Native eBayar bulanan + Admin SAHKAN, serial | PASS untuk ujian dummy terdahulu; bukan pengesahan keseluruhan concurrency/production |
| Resit bulanan AutoCrat manual dan guardian lazy-sync | PASS untuk resit dummy 0004 |
| **AutoCrat hourly time trigger** | **2/2 PASS** untuk resit dummy 0005 & 0006; dua PDF dan dua e-mel diterima (log + screenshot inbox pemilik) |
| **Admin Sync PDF** | **2/2 PASS**: 0005 & 0006 bertukar RESERVED ke READY, Q diisi dengan URL PDF sedia ada, V:Y kekal, attempt 0 |
| AutoCrat skip pada trigger berulang | Pemilik yakin / mengesahkan operasinya; ujian repeat terperinci tidak didokumenkan sebagai bukti bebas |
| Fasa 9A — keselamatan Admin legacy read | Patch pada QA GitHub untuk empat fungsi, semakan statik PASS; **GAS /dev test belum dibuat** |
| Privasi/akses guardian legacy, quota race, rollback, LIVE config | **BELUM PASS / release blocker** |

## KEPUTUSAN RELEASE

**Sasaran Isnin 9 Nov: registration-only V2** — Native eDaftar + OTP + Admin approval + registration PDF; monthly tuition payment kekal mengikut calendar gate dan **tidak perlu dibuka pada November**. Feature resit bulanan QA sudah berfungsi tetapi bukannya sebab untuk buka yuran lebih awal.

**NO-GO LIVE pada 6 Nov** sehingga security negatif (Admin & guardian) diuji pada GAS BACKUP, private data/Drive access, kuota, production config, backups, rollback dan pilot registration PASS. Sebarang deployment memerlukan arahan eksplisit pemilik. **Jangan sentuh master, LIVE GAS, LIVE Sheets/Forms, triggers produksi.**

## Peraturan membaca dokumen

1. **Baca dokumen ini dahulu** untuk dasar yuran dan status QA semasa.
2. Dokumen `UPKK_V2_OWNER_DECISIONS_2026-11-04.md` ialah **sejarah keputusan 4 Nov**, bukan sumber aktif bagi soalan kredit yang telah dimuktamadkan selepas itu.
3. Dokumen `UPKK_V2_RELEASE_READINESS_CHECKLIST_2026-11-05.md` dan `UPKK_V2_MILESTONE_NATIVE_EDAFTAR_2026-11-05.md` mengandungi snapshot lampau; checklist security/rollback masih terpakai, tetapi status lama AutoCrat dan yuran telah diganti dengan dokumen ini.
4. Setiap QA checkpoint seterusnya perlu mengemas kini fail ini terlebih dahulu supaya tidak terus membaca fakta lama.

Rujukan bukti terperinci: `UPKK_V2_NATIVE_EBAYAR_RECEIPT_QA_2026-11-06.md` dan `UPKK_V2_PHASE9A_SECURITY_RELEASE_GATE_2026-11-06.md`.

## Latest development checkpoint — 6 Nov, Phase 9A

**QA GitHub source only:** Four privileged Admin legacy reads now require server Admin session; two guardian legacy reads (`getDashboard` and `getResit`) now require a short-lived authenticated parent token and ownership checks. `index.html` forwards those tokens for GAS calls, excludes the guardian token from browser storage and requires fresh login after reload. Source read-back checks PASS. **Real GAS /dev authentication and browser tests have NOT been performed.**

Latest Phase 9A docs: `UPKK_V2_PHASE9A_SECURITY_RELEASE_GATE_2026-11-06.md`. The Monday registration-only target remains conditional: old writable/maintenance endpoint audit, proper negative tests, quota/privacy and rollback still required; **not authorised for LIVE**.
