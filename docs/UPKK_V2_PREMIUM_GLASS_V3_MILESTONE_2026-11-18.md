# UPKK SL V2 — Premium Glass Login & Dashboard V3

**Tarikh:** 18 November 2026 (MYT)  
**Status:** LIVE — OWNER VERIFIED (visual version loaded + Parent/Admin login smoke PASS)  
**Repo:** `shafielegacy/UPKK`  
**Branch:** `pages/frontend-v1.34`  
**Portal:** https://shafielegacy.github.io/UPKK/  
**App version:** `2.0-RC3-GlassDash-V3`

## Keputusan pemilik / milestone

Pemilik meluluskan konsep login premium emerald–gold dengan tulisan berkontras tinggi, kemudian mengarahkan perubahan **UI sahaja** pada LIVE. Selepas pelancaran V3, pemilik mengesahkan bahawa versi V3 sudah masuk pada telefon, **login Parent dan Admin berjaya** dan **tiada masalah fungsi dikesan semasa smoke test pemilik**. Ini bukan pengesahan penuh seluruh feature atau ujian bayaran sebenar.

## Skop yang disiapkan

1. **Login Glass UI1** — latar emerald gelap, animasi ambient dan shimmer ringan, logo rasmi, label dan input berkontras tinggi, butang gold serta media query untuk telefon dan reduced motion. Login Parent asal (e-mel + enam digit terakhir nombor telefon), pintu masuk pentadbir sedia ada dan tab eDaftar **dikekalkan**. Tiada penggantian auth dengan mock Google OAuth.
2. **Dashboard UI2** — penyelarasan palet pada Parent dan Admin serta pembetulan kontras tulisan eBayar pada butang emas.
3. **Dashboard V3** — perubahan visual yang ketara: background dark emerald untuk halaman Parent/Admin; glass cards emerald/ivory dengan border gold, bayang dan kontras tulisan; susun atur mobile dan elemen interaktif asal kekal. Perubahan kekal CSS scoped pada `#page-dashboard` dan `#page-admin:not(.adm-dark)`; dark-mode Admin tidak disengajakan ditulis semula.
4. **PWA** — `APP_VERSION`, `version.json` dan nama static cache `sw.js` diselaraskan bagi setiap versi; fetch rules allowlist lama dalam service worker dikekalkan. Pemilik pada awalnya melihat UI2 selepas V3 committed, kemudian membuka URL yang mempunyai parameter cache-bust dan mengesahkan V3 telah dipaparkan.

## Rekod release pada branch ini

| Perubahan | Commit |
| --- | --- |
| Login Glass UI1 (`index.html`) | `b8dd7df9be6e33146f76b6eaa22d3c7ff04dffa5` |
| UI2: Parent/Admin palette + eBayar contrast | `747cb2cf454697b3fdc062cb08ba8aa890eae497` |
| V3: premium glass dashboard (`index.html`) | `55ab12fa35da2ee3344a2a07ce8d24c144b3513c` |
| V3: `version.json` | `c6692cf398083677359b10ddfb43c9e9fb53fa5e` |
| V3: `sw.js` | `9534d48c1c3dd2d8b12c2c8401f4853f65a28e95` |

**Integrity check semasa penulisan:** Pada setiap perubahan `index.html` skrip/HTML asal dibandingkan dengan versi sebelumnya: hanya CSS tambahan dan nilai `APP_VERSION` diubah; tiada handler JS, ID input, elemen fungsi atau URL transaksi diubah. `version.json` ialah metadata; `sw.js` cuma cache key diubah, bukan logic caching.

## Keputusan semakan dan had bukti

| Perkara | Status / bukti |
| --- | --- |
| V3 muncul pada peranti pemilik | **PASS — owner confirmed** selepas membuka URL refresh khas |
| Login Parent | **PASS — owner-reported smoke test** |
| Login Admin | **PASS — owner-reported smoke test** |
| Fungsi sedia ada tidak terjejas dalam percubaan pemilik | **PASS — owner-reported**, bukan exhaustive regression |
| Aliran bayaran dan resit | **PASS — owner-reported full test, 18 Nov 2026**; pemilik mengesahkan ujian penuh bayaran dan resit berjaya. Tiada log transaksi atau langkah ujian terperinci dilampirkan pada milestone ini. |
| eDaftar, AutoCrat, Telegram dan fungsi lain di luar ujian yang dilaporkan | **NOT RETESTED** dalam milestone UI ini; tiada perubahan logic dibuat |
| Accessibility menyeluruh / semua browser / reduced motion | **NOT FORMALLY AUDITED**; CSS bersasar readability dan mobile |

## LOCK — perkara yang mesti kekal

- Jangan ubah login Parent, login Google Pentadbir / pengesahan backend, approval, session 2026/2027, pemilihan anak, senarai yuran, eBayar, resit, eDaftar, Telegram atau AutoCrat untuk kerja visual.
- Tiada perubahan kepada Script Properties, deployment Apps Script atau spreadsheet rasmi; jangan cipta URL deployment/QA yang banyak.
- Kekalkan logo `assets/branding/portal-logo.png`, palette emerald–gold, kontras label dan input, serta pengurangan animasi melalui `prefers-reduced-motion`.
- Setiap perubahan frontend pada masa hadapan wajib selaraskan `APP_VERSION`, `version.json` dan cache version `sw.js`; jangan cache respons identiti/bayaran.
- Semak fungsi pada telefon selepas apa-apa lagi perubahan dan catat secara jujur status owner smoke test berasingan daripada source check.

## Sambungan kemudian

**Pengesahan tambahan pemilik (18 Nov 2026): ujian penuh bayaran dan resit SUCCESS/PASS.** Keputusan ini ialah laporan pemilik, bukan ujian bebas oleh assistant. Tiada kerja tertunggak untuk milestone UI V3 yang telah diluluskan ini. Hanya buat visual refinement jika pemilik meminta. Jangan ulang suite mock, cipta folder ujian baru, atau melakukan deploy backend semata-mata untuk tema UI.


## Sambungan UI — Status Bulanan 2027 + Native eDaftar Glass (18 Nov 2026)

- **Versi frontend:** `2.0-RC3-MonthCards-EdGlass`. `APP_VERSION`, `version.json` dan static cache `sw.js` dikemaskini serentak.
- **Admin 2027:** `admin-2027.js` menukar persembahan `academicMonths` daripada jadual kepada kad `adm-bc` yang mirip UI V1 2026. Data `settled`, `pending`, `unpaid`, `notStarted`, `notApplicable` dipetakan **tanpa mengubah nilainya**. Kad menggunakan progress nisbah selesai kepada jumlah kategori status. Kad bukan clickable, kerana frontend Native 2027 belum mempunyai tindakan senarai murid setara V1 yang selamat. Tiada amaun RM per kad direka.
- **Borang eDaftar Native 2027:** `edaftar.css` menambah lapisan tema emerald–gold glass, ivory card, input kontras tinggi, paparan mobile serta reduced motion. `edaftar.html` hanya menukar query versi CSS dan label versi UI; `edaftar.js`, backend, form fields, Google Sign-In, uploads dan validation tidak disentuh.
- **Cache:** halaman `index.html` menggunakan versioned URL untuk `admin-2027.js`; borang eDaftar menggunakan versioned URL untuk `edaftar.css`. Service worker mengekalkan fetch rules asal.
- **QA:** pemeriksaan source GitHub memastikan keenam-enam fail `index.html`, `admin-2027.js`, `edaftar.html`, `edaftar.css`, `version.json` dan `sw.js` sepadan. **LIVE owner smoke test untuk perubahan tambahan ini belum dibuat.** Milestone V3 terdahulu yang sudah lulus kekal berasingan.
- **Lock:** Jangan menganggap `Belum bermula` sama dengan tunggakan. Backend aggregations termasuk isu kiraan 29 permohonan / 28 lulus belum diubah atau disahkan semula.
