# UPKK Syafie Legacy V2 — Keputusan Pengasas 4 Nov 2026

**Sumber:** Mesej WhatsApp Ustaz Shafie yang diserahkan pemilik projek pada 4 November 2026. Dokumen ini merekod keputusan perniagaan; bukan persetujuan untuk ubah LIVE.

## Dasar yang sudah disahkan

1. **Yuran pendaftaran RM50** dan **yuran bulan pertama RM50**. **Jumlah awal RM100**.
2. **Disember 2026:** Semua murid yang menyertai pakej baharu, termasuk murid lama yang menyambung, wajib membayar yuran bulanan RM50.
3. **SEMUA MURID PERLU DAFTAR SEMULA**, termasuk murid lama. Ini bukan sambungan automatik daripada daftar 2026; pakej baharu mempunyai tiga mata pelajaran: **Bahasa Arab, Akidah dan Ibadah**. Pendaftaran semula juga dikenakan yuran pendaftaran RM50.
4. **Pendaftaran biasa kini dibuka sehingga 31 Disember 2026.** Mulai 1 Januari 2027, pengambilan biasa ditutup; pertimbangan luar biasa boleh dibuat jika ada tempat kosong. Pengesahan/kelulusan khas perlu melalui Admin, bukan dibuka secara automatik.
5. **Had setiap Tahun 3, 4, 5:** 30 murid Fizikal + 20 murid Online = 50 per tahun. Jumlah teoritikal 150 jika semua enam kelompok penuh.
6. Penjaga bayar/upload bukti → urusetia semak → **hanya selepas disahkan** baru resit rasmi dijana.

## Soalan SUSULAN BELUM dijawab

**RM50 bulan pertama dalam RM100 bagi pendaftaran yang dibuat pada Disember 2026**: kredit yuran **Disember 2026** atau **Januari 2027**? Pemilik telah bertanya, menunggu jawapan. **Jangan** auto-kredit mana-mana bulan sehingga ada keputusan.

## Implikasi dan sempadan

- Rekod 2026 V1 **jangan padam, pindah, atau edit** untuk mensimulasikan pendaftaran semula. Satu MyKid boleh wujud sebagai rekod V1 lama dan permohonan V2 baharu; tetapi hanya satu permohonan pakej baharu yang aktif untuk MyKid sama.
- Data pakej baharu perlu disimpan secara jelas: **Tahun Kelas** (3/4/5), **Mod** (FIZIKAL/ONLINE), **Jenis Daftar** (BAHARU/DAFTAR SEMULA), status, snapshot RM50 + RM50.
- Semak kuota secara **server-side dengan LockService**. Kira APPROVED + PENDING sebagai tempat diperuntukkan sehingga keputusan Admin; yang REJECTED tidak menduduki kuota. Mengelakkan kes overbooking semasa semakan.
- Tarikh tutup pada waktu Malaysia 31 Dis 2026 23:59:59. Selepas itu hentikan pendaftaran awam biasa, sediakan laluan pengecualian Admin dalam fasa berasingan.
- MyKid yang pernah wujud pada rekod V1 bukan lagi alasan automatik untuk menolak permohonan. MyKid yang sudah PENDING atau APPROVED dalam pakej baharu mesti ditolak sebagai duplicate.
- **Jangan** ubah formula F (umur), K (No Resit), L (Status), atau nombor resit V1. Kolum-kolum tambahan mesti disemak dahulu terhadap header semasa sebelum ditulis.
- Tahap QA: Program boleh menyediakan kod dan ujian mock dalam branch QA. Belum ada kelulusan untuk LIVE.

## Urutan

1. Simpan keputusan pengasas ✓
2. Audit dan patch eDaftar: tahun 3–5, mod, re-enrolment, kuota dan deadline.
3. Semak QA pada GAS/Spreadsheet BACKUP dengan data rekaan sahaja; jangan ubah rekod murid sebenar.
4. Selepas pengesahan bulan pertama, integrasi kredit yuran ke kad yang betul.
5. Sambung Native eBayar approval dan AutoCrat bulanan.

**Jangan anggap RM90 dalam rekod QA lama sebagai harga rasmi.** Ia ialah data ujian lama; konfigurasi pengambilan baharu perlu RM100 sebelum pendaftaran seterusnya.
