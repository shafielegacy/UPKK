# UPKK V1 → V2 — Native eDaftar: Milestone & Laporan Ujian Google

## 26 November 2026 — Production Stability Lock

Checkpoint penyelenggaraan production (MYT). Keputusan di bawah mengatasi TODO terdahulu bagi skop yang sama. Rekod 25 November dan sebelumnya dikekalkan sebagai sejarah.

| Semakan | Keputusan | Bukti dan batas pengesahan |
| --- | --- | --- |
| Task 01 — Production baseline | **PASS WITH LIMITATIONS** | Branch frontend `pages/frontend-v1.34` pada SHA `c7c3a11418277df287ae9b6e6cf8d01d357677b1` mempunyai 51 fail tracked. [Run Pages bagi release aplikasi](https://github.com/shafielegacy/UPKK/actions/runs/45604411814) berjaya. Aliran sedia ada untuk Parent dan Admin dikekalkan. |
| Task 02 — Status Bulanan Admin | **EXPECTED BEHAVIOUR · NO CHANGE REQUIRED** | Manage deployments mengesahkan endpoint production menggunakan Native V28. Project History → Version 28 → `AdminDashboard2027.gs` (55–87, 124–135) menunjukkan hanya permohonan APPROVED masuk agregat bulanan. Permohonan PENDING dikecualikan. Bayaran bulanan PENDING bagi murid diluluskan mempunyai kategori sendiri. Peralihan bulan mengikut MYT. Perbezaan angka sejarah 28/29 kekal **NOT VERIFIED · MONITOR ONLY**. Bandingkan lima kategori dengan jumlah diluluskan daripada respons yang sama jika ia berulang. |
| Task 03 — Native eBayar Disember | **SOURCE-VERIFIED · READY · NO CHANGE REQUIRED** | Disember dibuka secara automatik bagi murid yang layak mulai 1 Disember 2026 MYT. Tiada deployment atau trigger tengah malam diperlukan. `NativeEbayar2027.gs` (28–49, 63–120, 128–164, 183–231) mengesahkan pemilikan anak, sesi, PIN, amaun pelayan, sekatan pendua, ScriptLock dan kelulusan Admin. Kredit penuh bulan pertama menyekat bayaran kedua. Transaksi sebenar Disember belum **LIVE-VERIFIED**. |

### Task 03B — Konfigurasi operasi

| Konfigurasi | Keputusan pada 26 November |
| --- | --- |
| Flag eBayar production | **VERIFIED ACTIVE** |
| Workbook dan lejar | **VERIFIED** — workbook sepadan dengan V28 dan kesemua 25 header `NATIVE_EBAYAR!A1:Y1` sepadan mengikut turutan. |
| Folder bukti | **VERIFIED** — folder yang dikonfigurasi wujud dan boleh dibuka. |
| AutoCrat bulanan | **VERIFIED CONFIGURED** — job resit dipadankan kepada tab lejar. Konfigurasi PDF, e-mel dan time trigger tersedia. |
| Nilai sebenar kadar bulanan RM50 | **NOT VERIFIED** — RM50 ialah kadar polisi. Property kadar tidak kelihatan dalam 50 entri pertama Project Settings. |
| Padanan trigger terpasang kepada job AutoCrat khusus | **NOT VERIFIED** — inventori trigger tidak mengenal pasti job bagi entri time-based berkenaan. |

Mulai 1 Disember, gunakan transaksi biasa untuk mengesahkan amaun bagi murid tanpa kredit bulan pertama dan penghantaran resit selepas kelulusan. Penerimaan resit mengesahkan hasil penghantaran bagi transaksi tersebut. Identiti trigger khusus memerlukan bukti padanan tersendiri.

### Arahan owner dan backlog

**STRICTLY NO QA.** Jangan bina environment, spreadsheet atau deployment QA. Jangan buat pendaftaran atau transaksi dummy. Kekalkan fungsi dan UI/UX Parent serta Admin yang sudah stabil. Elakkan refactor tanpa keperluan. **Parent Google Sign-In** dan **AutoCrat Fast Delivery** kekal **HOLD**. Owner menerima **NO CHANGE REQUIRED** sebagai milestone berjaya. Sebarang perubahan production memerlukan **OWNER GO berasingan**.

| Skop | Status |
| --- | --- |
| Keselamatan Legacy SEC26 | Audit **READ-ONLY** |
| Dependency deployment Native V1–V4 | Audit **READ-ONLY** |
| Telegram exactly-one delivery | Pantau penghantaran bagi kelulusan sebenar |
| Native eBayar Disember | Pantau bayaran dan resit melalui penggunaan sebenar |
| Admin Interactive Monthly Cards | **BACKLOG** |
| Smart Action Centre | **BACKLOG** |

## LIVE CHECKPOINT — Kenaikan Kuota Native UPKK 2027 (25 November 2026, MYT)

**Status: RELEASED — OWNER VERIFIED (paparan baki eDaftar Tahun 3/4/5).** Fungsi Admin Tetapan Kuota dinamik yang pernah dicadangkan **tidak dibina**. Owner memilih cara minimum: menambah 10 tempat bagi setiap mod/tahun melalui pemalar backend dan had paparan frontend sahaja. Tiada rekod murid atau transaksi dummy diwujudkan.

### Kuota dan bukti sebenar

| Tahun / umur sesi 2027 | Fizikal lama → baharu | Online lama → baharu | Baki sebelum (F/O) | Baki selepas, screenshot LIVE (F/O) |
| --- | ---: | ---: | ---: | ---: |
| Tahun 3 / 9 tahun | 30 → **40** | 20 → **30** | 24 / 16 | **34 / 26** |
| Tahun 4 / 10 tahun | 30 → **40** | 20 → **30** | 22 / 15 | **32 / 25** |
| Tahun 5 / 11 tahun | 30 → **40** | 20 → **30** | 14 / 9 | **24 / 19** |
| **Jumlah** | **90 → 120** | **60 → 90** | **100** | **160** |

Kapasiti keseluruhan **150 → 210**. Penggunaan tersirat daripada screenshot ialah **50 tempat**, bukan audit terus spreadsheet; baki berubah jika ada permohonan baharu. Pengiraan sedia ada menganggap `PENDING 2027` dan `APPROVED 2027` menggunakan tempat, `REJECTED 2027` tidak. Semakan submit masih dijalankan dalam `LockService` asal, tanpa perubahan logik.

### Perubahan dan release yang benar-benar berlaku

- **GAS**: Pemilik mengubah satu baris `NativeEdaftar.gs` daripada `const NE_INTAKE_MAX_={FIZIKAL:30,ONLINE:20};` kepada `const NE_INTAKE_MAX_={FIZIKAL:40,ONLINE:30};`, menyimpan HEAD, lalu **Edit deployment production sedia ada → New version**. Bukti screenshot: `Deployment successfully updated`, **Version 28 pada 25 Nov 2026, 19:25 MYT**. Deployment ID/URL utama dikekalkan, bukan *New deployment*. Komen sejarah di atas pemalar masih merujuk 30/20; komen ini bukan runtime dan tidak diubah dalam skop minimum.
- **GitHub Pages LIVE**: branch `pages/frontend-v1.34`. `edaftar.js` membetulkan dua label maksimum dan entri clamp `Math.min` bagi mod Fizikal 30→40 dan Online 20→30; commit `27601ba161362e6ea5a269842fa71e92c9ee0179`. `edaftar.html` mengubah hanya URL skrip kepada `edaftar.js?v=20261125-kuota-40-30` supaya browser memuatkan kod yang dikemas kini; commit `7462f2d7fe890ce059bf9b0d58835300e4dba253`.
- **Penerbitan Pages**: GitHub Actions run [`45604411814`](https://github.com/shafielegacy/UPKK/actions/runs/45604411814) untuk commit akhir **completed / success**. URL asal kekal: https://shafielegacy.github.io/UPKK/ dan https://shafielegacy.github.io/UPKK/edaftar.html.
- **Pengesahan owner**: screenshot LIVE selepas refresh menunjukkan tiga pasangan baki yang tepat, termasuk Tahun 3 34/26 dan Tahun 4 32/25 (sebelum itu dipaparkan maksimum 30/20). Ini **UI smoke + seat response**, bukan bukti submit sebenar, audit data atau ujian menyeluruh Admin, Parent, bayaran atau Telegram.
- **Tidak disentuh semasa release**: `index.html`, `APP_VERSION`, `version.json`, `sw.js`, `admin-2027.js`, Legacy 2026, login, eBayar, yuran, resit, Telegram, AutoCrat, trigger, OAuth, Script Properties, data spreadsheet dan deployment lama V1–V4. Service Worker sedia ada tidak menyenaraikan `edaftar.js` dalam cache allowlist; hanya URL script eDaftar di-version.

### Masalah / halangan yang dihadapi dan cara atasi

| Masalah | Punca dan bukti | Penyelesaian / tindakan masa depan |
| --- | --- | --- |
| **Work tidak boleh edit `NativeEdaftar.gs`** | Cloud Browser Apps Script Editor gagal memilih fail secara konsisten dan tamat masa. Sesi Work berikutnya tiada alat sunting GAS. | **Jangan paksa UI atau tulis fail yang salah.** Pemilik buka fail yang betul, sunting tepat satu baris, simpan dengan Ctrl+S dan baca semula; kemudian gunakan Manage deployments → Edit → New version. Jangan buat deployment baharu. |
| **API Enabled tetapi Work masih tiada akses GAS** | Tetapan akaun Apps Script API ON dan API diaktifkan pada Cloud project `upkk-sl-edaftar-2027`; GAS LIVE pula menunjukkan `GCP: Default` pada Project Settings. Tiada connector Apps Script read/write tersedia dalam sesi Work. | Mengaktifkan API **bukan** memberikan connector/OAuth kepada Work. Tidak perlu menukar GCP project GAS, OAuth atau credentials demi kuota kecil ini. Suntingan manual satu baris terbukti berhasil. |
| **Tahun 3 dan 4 masih papar 30/20 selepas backend V28** | Frontend lama `edaftar.js` menggunakan `Math.min(30, baki)` bagi Fizikal dan `Math.min(20, baki)` bagi Online. Tahun 5 tidak kelihatan bermasalah kerana baki 24/19 di bawah had lama. | Selaraskan label dan clamp 40/30 pada `edaftar.js`, bump query URL JS dalam `edaftar.html`, pastikan Pages Actions SUCCESS. Screenshot owner kemudian menunjukkan **34/26; 32/25; 24/19**. |
| **Footer versi portal masih lama** | Paparan `v2.0-RC3-GoogleButton-UI1` ialah versi portal utama, bukan versi baki eDaftar. | Jangan bump `APP_VERSION`/`version.json`/`sw.js` bagi perubahan eDaftar yang tidak menggunakan cache SW. Gunakan pautan eDaftar skrip terkini dan hard refresh jika perlu. |
| **Deployment Native sejarah V1–V4 masih Active** | Audit kod READ-ONLY Work: V1 ada laluan tulis ke `DAFTAR UPKK`; V2–V4 ada laluan Native 2027 dan kuota hardcoded 30/20. Kejayaan endpoint lama pada runtime serta kebergantungan luar **belum diuji/disahkan**. | **RISIKO TERBUKA, BUKAN FIXED.** Jangan archive, padam atau ubah V1–V4 tanpa semakan kebergantungan dan OWNER GO berasingan. V28 tidak mengubah kod sejarah. |

### LOCK / Handoff

1. **Skop release siap:** hanya kapasiti 40/30 dan paparan eDaftar. Tiada fungsi **Admin Tetapan Kuota** baharu. Ustaz masih tidak mempunyai panel ubah kuota sendiri.
2. **Release dan dokumentasi berperingkat:** owner terlebih dahulu sahkan tiga screenshot baki LIVE, kemudian memberi GO khusus untuk kemas kini `.md`. Kemas kini dokumentasi **bukan** arahan untuk mengubah GAS/Pages sekali lagi.
3. **Risiko dan TODO lain kekal mengikut checkpoint sejarah:** isu agregat Status Bulanan, Telegram exactly-one, Parent Google Sign-In/AutoCrat HOLD, keselamatan Legacy dan dependency deployment lama tidak diselesaikan oleh penambahan kuota.
4. **Bagi perubahan kuota masa depan:** semak HEAD GAS dan branch Pages, ubah pemalar backend dan clamp/label frontend yang berkaitan sahaja, gunakan deployment ID GAS sedia ada, pastikan GitHub Pages Actions SUCCESS dan minta pemilik semak baki ketiga-tiga tahun; jangan ubah aliran submission, data, trigger, IAM, OAuth atau deployment lama tanpa GO.

---


## SNAPSHOT SEJARAH / TODO AKTIF PADA 18 November 2026 (malam, MYT)

**Snapshot 18 November ini ialah sejarah; checkpoint 25 November di atas mengatasi status versi dan kuota terdahulu.** Bahagian bertarikh 3–17 November di bawah ialah checkpoint sejarah, bukan arahan mengulang deploy/QA. Status semasa menurut dokumentasi, source GitHub dan penerimaan yang telah dilaporkan pemilik; item NOT VERIFIED tidak boleh dianggap PASS.

**Keputusan pemilik — LOCK:** **Parent Google Sign-In = HOLD.** Hanya idea untuk kajian masa depan; tiada implementasi, pertukaran auth, account linking atau data read/write Parent dibenarkan tanpa GO baharu. Kekalkan Parent login semasa, dua sesi 2026/2027, pilihan anak, PIN 2027, kelulusan dan akses data sedia ada. **AutoCrat Fast Delivery = HOLD**; trigger/templat sedia ada terus beroperasi.

### Sudah siap / jangan ulang kerja
- **Native eDaftar dan Admin Google:** sudah LIVE; Admin Google Sign-In V23.2 dan Native GAS **V27** telah diterbitkan melalui deployment Native sedia ada. Jangan anggap status “V26 / deploy pending” dalam checkpoint lama masih semasa.
- **Parent V2:** dual-session dan selector anak, sesi 2026 Jan–Nov sahaja, sesi 2027 dengan Dis 2026, PIN/approval flow, slip pendaftaran, dan tindakan sidebar redundan telah dibaiki / diterbitkan seperti milestone 17–18 Nov. Pemilik mengesahkan login Parent/Admin dan bayaran/resit penuh PASS pada 18 Nov; itu owner-reported, bukan audit bebas untuk semua laluan.
- **Premium Glass:** Login, Parent dan Admin V3 owner-verified. Selepas itu UI Status Bulanan 2027 jenis kad dan tema borang Native eDaftar diterbitkan di GitHub; label status dikemaskan. Butang Admin **Log masuk dengan Google** berlogo Google turut dikemas kini pada `2.0-RC3-GoogleButton-UI1` (source + PWA cache sudah versi baharu). **Penerimaan peranti bagi UI tambahan yang terakhir ini belum direkodkan**, jangan samakan dengan smoke test V3.

### TODO AKTIF — ikut prioriti dan bukti
| Prioriti | Kerja | Status / syarat |
| --- | --- | --- |
| **P0 — Ketepatan laporan** | **Audit agregat Status Bulanan 2027 Dis 2026** | **OPEN, read-only first.** Screenshot pemilik: 29 permohonan, 11 `settled`, 18 `notStarted`, 0 `unpaid`, sedangkan 28 lulus dan 1 pending dilaporkan sebelumnya. Siasat fungsi backend `getAdminV2Dashboard2027`, bagaimana APPROVED/PENDING, yuran daftar RM50 dan yuran bulan pertama RM50 dibezakan, dan sempadan tarikh MYT. **Jangan** label 18 sebagai tunggakan atau paksa angka 0 menjadi 18 tanpa bukti. Label frontend telah diperjelas sahaja; **formula belum dibaiki**. |
| **P1 — Fungsi Admin** | **Klik kad bulan → senarai murid & status eBayar** | **BELUM DIBINA.** Perlu sumber senarai read-only berautorisasi Admin untuk bulan dipilih, filter hanya murid layak, status sebenar dan pemisahan PENDING/due-date; jangan papar nama melalui agregat atau endpoint awam. Sediakan skop + GO berasingan sebelum backend/perubahan data. |
| **P1 — Telegram** | **Sahkan exactly-one delivery pada kelulusan sebenar** | **LIVE V27 / trigger Completed / REAL DELIVERY NOT VERIFIED.** Pantau kelulusan baharu yang berlaku normal: status approved, tepat satu Telegram, event `SENT`; jangan Run manual, buat dummy/replay/reapprove, atau tambah trigger/deployment. |
| **P1 — Native eBayar** | **Penerimaan bayaran bulanan pada 1 Disember 2026** | **NOT YET DUE.** Semak semasa bulan dibuka bahawa kad bulan aktif mengikut tarikh MYT, rekod yuran bulan pertama RM50 tepat, RM100 yang telah dikreditkan tidak dicaj semula, resit/approval benar dan tiada duplicate. Jangan aktifkan awal atau buat transaksi palsu LIVE. |
| **P1 — QA visual akhir** | **Semak Status Bulanan kad, label kejelasan, borang eDaftar glass dan logo Google Admin** | **SOURCE UPDATED; OWNER UI SMOKE PENDING** untuk keluaran selepas V3. Semak dengan laluan sebenar tanpa permohonan/transaksi dummy. |
| **P1 — Operasi Admin** | **Smart Action Centre: pautan tindakan permohonan/bukti bayaran pending** | **BELUM DILAKSANAKAN**; boleh guna menu authenticated sedia ada, perlu GO skop UI berasingan, tiada status palsu. |
| **P1 — Keselamatan Legacy** | **Pengurusan Murid / Scan Duplikat MyKid 2026 dan SEC26** | **LOCKED / AUDIT BERASINGAN.** Fungsi Legacy berisiko jika dibuka tanpa autorisasi; kekalkan tertutup sehingga audit role, endpoint dan izin data selesai. Jangan guna scan duplikat untuk Native 2027. |
| **P2 — Monitor** | **Kes terpencil upload bukti pada telefon** | **MONITOR ONLY.** Semak MIME/saiz/peranti jika masalah berulang; tiada bukti isu meluas. |
| **P2 — HOLD** | **AutoCrat slip e-mel/PDF lebih cepat** | **HOLD by owner**; jangan ubah trigger/template atau tambah sistem penghantaran. |
| **P2 — HOLD** | **Parent Google Sign-In + own-child data linking** | **HOLD by owner, 18 Nov.** Kajian kelak: Google identity + first-time verification + server-side guardian-to-child linking, support multi-child/dual-session, revoke; jangan gunakan email sahaja sebagai kebenaran. |

**Penting:** Item TODO bertarikh 3 Nov berkaitan QA BACKUP, OTP lama, yuran yang “belum disahkan”, atau cadangan umum boleh kekal sebagai **sejarah**; jangan dilaksanakan semula secara automatik. Polisi yuran 2027 yang telah diluluskan kemudian mengatasi cadangan awal. Tiada operasi code/backend/data LIVE diluluskan melalui kemas kini dokumentasi ini.

---

## Telegram Notification Reliability — Native V27 LIVE (18 November 2026)

**Status semasa: RELEASED / TRIGGER EXECUTION PASS / ADMIN READ-ONLY SMOKE PASS / TELEGRAM REAL DELIVERY NOT VERIFIED.**

- **Bukti Apps Script Executions (pemilik, 18 November MYT):** `upkkTelegramRetryApproved2027` pada `Head`, `Time-driven`, berstatus `Completed` pada **06:20:02 (0.755s), 06:25:02 (1.036s), 06:30:02 (0.777s)**. Tiga pelaksanaan berjalan sekitar sela 5 minit tanpa error yang kelihatan. Cloud Logs memaparkan `No logs are available for this execution`; ini **tidak membuktikan queue kosong, penghantaran berlaku, atau tiada Telegram berganda**.
- **Release pemilik:** melalui `Deploy → Manage deployments → Edit deployment sedia ada → New version`; Apps Script memaparkan **`Deployment successfully updated`**, **Version 27 pada 18 Nov 2026, 06:49 MYT**. Deployment ID yang kelihatan kekal sama seperti pada V26; **bukan New deployment** dan tiada URL baharu diwujudkan. Deskripsi release: `UPKK SL V27 - Telegram Approval Reliability Fix | Retry & Deduplication | 18 Nov 2026`. Pembaikan `AdminV2.gs` / `UPKK_TelegramNotify2027.gs` yang sebelumnya di HEAD telah diterbitkan melalui versi ini (berdasarkan checkpoint Work + tindakan pemilik).
- **Smoke test selepas release (screenshot pemilik):** login Google Admin berjaya; `Pengurusan Murid · 2027` memaparkan **29 rekod**, termasuk status `PENDING 2027` dan `APPROVED 2027`; butang `Lihat Bukti Transaksi`, `Sahkan Bayaran`, `Tolak`, sidebar dan pemilih sesi kelihatan. **PASS untuk akses dan render sahaja**; tiada tindakan approve/reject/bayar dilakukan. Paparan 29 rekod bukan pengesahan jumlah resmi terhadap spreadsheet.
- **Tidak diubah pada langkah release/smoke ini:** kod frontend/cache PWA, Parent S1.1, data atau bayaran rasmi, resit, Telegram token/chat ID/properties, trigger sedia ada atau AutoCrat. **AutoCrat Fast Delivery kekal HOLD**; job asal terus menangani PDF/e-mel. Ketiadaan perubahan frontend bermaksud tiada bump PWA diperlukan untuk release GAS ini.
- **Baki acceptance:** tunggu **kelulusan permohonan baharu yang berlaku secara normal**, kemudian secara baca sahaja pastikan rekod `APPROVED 2027`, **tepat satu** mesej notifikasi approval pada kumpulan Telegram, dan event notifikasi berstatus `SENT`. Jika status tidak boleh diakses tanpa mendedahkan identiti/token atau mengubah data, catat **NOT VERIFIED**; jangan jalankan fungsi, hantar ujian, replay sejarah atau approve rekod lama. Walaupun trigger `Completed`, penghantaran Telegram sebenar masih **NOT VERIFIED**.
- **Sempadan milestone:** 21/21 mock tests PASS menurut Work dan semakan keselamatan HEAD merupakan bukti peringkat source/mock, **bukan jaminan exactly-once LIVE**. Pantau ralat pada `Executions` menggunakan aliran semasa; tiada trigger atau deployment tambahan diperlukan.

## Telegram Reliability — checkpoint tutup 17 Nov, sambung 18 Nov 2026 (MYT)

**Status terkini (bukti screenshot pemilik): TRIGGER INSTALLED / HEAD READY / DEPLOYMENT V26 BELUM DIKEMAS KINI.** 17 November 2026 malam. **Jangan ulang tambah trigger**; jangan samakan trigger Head dengan release web app. Penyediaan ini ialah checkpoint operasi, bukan pengesahan penghantaran Telegram LIVE.

- **Source HEAD:** Work melaporkan pembetulan dua fail `AdminV2.gs` dan `UPKK_TelegramNotify2027.gs` serta **21/21 ujian mock PASS**. Diff dan ujian keselamatan dilaporkan Work; tiada perubahan Apps Script oleh kemas kini dokumentasi ini.
- **Punca V26:** kelulusan disimpan dahulu, helper Telegram cuba sekali dan membuang sebab gagal. Punca spesifik Telegram lama tidak sampai tidak diketahui; properties Telegram dilaporkan aktif dan konfigurasi sah.
- **Semakan keselamatan read-only Work: PASS:** `upkkTelegramRetryApproved2027_()` hanya memproses event `UPKK_TG_2027_APPROVED_` berstatus `QUEUED` yang `dueAt` sudah tiba; `SENT`, `UNKNOWN` dan `IN_FLIGHT` lapuk tidak dihantar semula; max 3 cubaan keseluruhan, `ScriptLock` untuk concurrency, hormat `retry_after` pada 429, tiada replay sejarah kelulusan. Status kelulusan kekal `APPROVED` jika Telegram gagal. Ini berdasarkan laporan pembacaan source oleh Work, bukan live delivery.
- **Trigger telah disimpan secara manual oleh pemilik:** projek `UPKK SL - Native eDaftar 2027`; fungsi `upkkTelegramRetryApproved2027`; deployment `Head`; event `time-based`; **Minutes timer → Every 5 minutes** (berdasarkan screenshot konfigurasi sebelum Save). Screenshot selepas Save menunjukkan **1 trigger** di bawah akaun `Me`, `Last run: -`, `Error rate: -`. Akaun lain mungkin memiliki trigger yang tidak kelihatan; jangan tambah semula tanpa sebab.
- **LIVE status:** Web App Native sedia ada masih **V26** (belum diterbitkan versi baharu); frontend terakhir `2.0-RC3-Parent-S1.1` pada `pages/frontend-v1.34`. Trigger yang dipasang berjalan atas **HEAD**, jadi pelaksanaan automatik boleh berlaku sebelum web-app dideploy; log `Executions` belum diperiksa selepas Save.
- **Esok 18 November — urutan minimum:** (1) buka projek Apps Script yang sama dan semak `Executions` bagi `upkkTelegramRetryApproved2027` serta ralat/masa pelaksanaan, tanpa Run manual; (2) jika sihat, guna **Deploy → Manage deployments → Edit deployment sedia ada → New version** untuk publish pembetulan Native ke deployment asal, **bukan New deployment**; sahkan version dan URL asal tidak berubah; (3) semak Admin Google/Parent ringkas hanya jika perlu; (4) pada **kelulusan sebenar yang berlaku secara normal** nanti, periksa `APPROVED`, satu notifikasi Telegram, event `SENT`. Jika belum ada kelulusan baharu, kekalkan real-delivery sebagai **NOT VERIFIED**.
- **Larangan:** jangan cipta pendaftaran/bayaran dummy, re-approve rekod lama, replay notifikasi lama atau hantar mesej ujian ke group; jangan ubah token/chat ID, Script Properties, trigger AutoCrat, bayaran, Legacy 2026, Parent, Admin UI, atau portal/branch/deployment baharu. **AutoCrat Fast Delivery kekal HOLD**, job asal terus menangani PDF dan e-mel.

**Nota:** Tiada source GAS atau deployment diubah melalui commit dokumentasi ini.

## Telegram Notification Reliability — checkpoint HEAD, 17 November 2026 (MYT)

**Status historikal sebelum trigger dipasang: MOCK PASS / RELEASE BLOCKED.** Laporan Work menyatakan pembetulan telah disimpan dalam Apps Script HEAD tetapi Native deployment masih V26. **Kemas kini terkini dan pemasangan trigger ada dalam checkpoint 17→18 Nov di atas.**

- **Fail diubah dalam Apps Script HEAD:** `AdminV2.gs`, `UPKK_TelegramNotify2027.gs`. Tiada kod GAS disimpan ke repo GitHub Pages ini melalui checkpoint.
- **Penemuan source V26 (Work):** kelulusan disimpan terlebih dahulu, kemudian helper Telegram dipanggil sekali; sebab gagal tidak direkodkan secara boleh-audit. Punca spesifik mesej yang pernah tidak sampai **tidak dapat dibuktikan**. Properties Telegram dilaporkan aktif dan format konfigurasi sah; token/chat ID dilarang dalam log atau dokumentasi.
- **21 ujian mock dilaporkan PASS:** status `SENT` hanya selepas kejayaan API Telegram; 429 menurut `retry_after`; retry terhad bagi 5xx yang benar-benar gagal; timeout yang hasilnya tidak pasti menjadi `UNKNOWN` tanpa replay automatik; kelulusan kekal `APPROVED` apabila Telegram gagal; aliran `PENDING` kekal serasi V26.
- **Blocker operasi ketika laporan Work disediakan (kini diatasi):** Work terhenti sebelum memasang trigger. **Pemilik kemudian berjaya memasang trigger Head setiap 5 minit**; screenshot pasca-Save mengesahkan satu trigger. **Baki blocker:** semak Executions, publish versi Native pada deployment sedia ada, dan sahkan penghantaran pada approval sebenar berikutnya.
- **Pra-release wajib:** sahkan projek Apps Script Native yang betul, inventory trigger sedia ada (elak pendua), dan pastikan queue retry hanya menyasar event yang belum `SENT` serta **tidak backfill/menyiarkan kelulusan sejarah secara pukal**. Trigger berjalan atas kod HEAD; jangan anggap ia menunggu deployment baharu. Jangan approve semula rekod sebenar, ubah status murid, atau hantar mesej ujian kepada kumpulan tanpa kelulusan berasingan.
- **Langkah baki:** **Trigger sudah dipasang**; semak `Executions` tanpa Run manual, publish versi Native baharu **pada deployment asal** selepas semakan, lalu sahkan pada kelulusan sebenar berikutnya: `APPROVED`, satu Telegram, event `SENT`. AutoCrat kekal **HOLD**.

## Parent Sidebar eBayar 2026 — 17 November 2026 (MYT)

**Frontend `2.0-RC3-Admin-D6.3`** pada `pages/frontend-v1.34`. Cache PWA `upkk-v2-static-20261117-admin-d6-3`.

- Atas arahan pemilik, buang **hanya** butang `eBayar Yuran` daripada navigasi sidebar Parent Legacy **Sesi 2026** di `index.html`. Ini item berlebihan yang menghala terus ke `openEBayarForm()`.
- **Kekal:** menu Dashboard, Status Yuran, Resit Digital, Tindakan Pantas eBayar, 11 kad Jan–Nov, fungsi klik kad/resit, pemilih 2026/2027, pengesahan PIN 2027 dan keseluruhan fungsi Admin.
- Tiada perubahan GAS, Native V26, Google Sheets, bayaran, AutoCrat, Telegram, resit, data peribadi atau Parent 2027. **AutoCrat Fast Delivery ditangguhkan atas arahan pemilik; kekalkan job asal.**
- Pemeriksaan source/statik sebelum release: item sidebar tiada; pautan Tindakan Pantas eBayar kekal; event handler dan pemilih sesi kekal; versi dan cache PWA dinaikkan. **Semakan UI selepas login Parent LIVE belum dijalankan dalam sesi ini.**

## Smart Session Selector Parent — 17 November 2026 (MYT)

### Penerimaan pengguna LIVE — PASS (17 November 2026)

**Pemilik mengesahkan melalui dua tangkapan skrin sebenar selepas deployment `2.0-RC3-Parent-S1.1` (commit [`7633c963`](https://github.com/shafielegacy/UPKK/commit/7633c963c2b517451c5a316e6ca8a0036b910d10)) bahawa paparan pilihan sesi Parent kini betul.**

| Senario yang disaksikan | Keputusan |
| --- | --- |
| Parent Legacy 2026 sahaja, anak ujian tiada padanan Native 2027 | **PASS:** hanya butang `Sesi 2026` muncul; `Sahkan sesi 2027` tidak dipaparkan |
| Parent dengan akses kepada sesi 2026 dan Native 2027 yang sudah diluluskan | **PASS:** pilihan `Sesi 2026` dan `Sesi 2027` tersedia; dashboard Parent 2027 terbuka bagi murid yang sah |
| Kad ringkasan Parent sesi 2027 | **PASS paparan:** RM50 pendaftaran + RM50 yuran bulan pertama, Disember 2026 `SELESAI`; tiada permintaan bayaran kedua pada tangkapan skrin |
| Sidebar Parent 2026 selepas cleanup D6.3 | **PASS paparan:** Dashboard, Status Yuran dan Resit Digital kekal, `eBayar Yuran` redundan tiada |

**Had penerimaan:** screenshot tidak membuktikan ujian semula PIN *selepas refresh*, semua gabungan penjaga berbilang anak, penghantaran e-mel atau transaksi Native eBayar pada 1 Disember. Kekalkan ujian berasingan apabila benar-benar diperlukan; **jangan ulang QA yang sudah PASS**. Identiti/nama murid ujian dan nombor resit tidak ditulis semula dalam dokumentasi awam ini.



**Frontend `2.0-RC3-Parent-S1.1`**, PWA cache `upkk-v2-static-20261117-parent-s1-1`; laluan `pages/frontend-v1.34`. **Native GAS V26 tidak diubah.**

- Pilihan `Sahkan sesi 2027` pada Parent Legacy 2026 kini hanya dipaparkan apabila semakan Native menggunakan e-mel + PIN enam digit telah mengesahkan anak yang sama sebagai `APPROVED 2027`. Padanan dibuat pada nama murid yang dinormalkan dalam senarai penjaga yang sudah disahkan backend; semakan nama ini hanya mengawal UI, bukan autorisasi.
- Anak Legacy yang tidak mempunyai padanan Native 2027 hanya melihat `Sesi 2026` apabila penjaga juga tiada anak Native lain yang diluluskan. Jika penjaga ada anak **2027-only** yang tiada dalam senarai Legacy, butang dilabel `Sesi 2027 (anak lain)` dan memilih anak Native tersebut selepas PIN disahkan. Jika seorang daripada beberapa anak Legacy mempunyai padanan Native, pilihan 2027 hanya muncul bagi anak yang layak. Semakan Native `denied` tidak memaparkan tombol PIN 2027.
- Selepas refresh, UI mengingati **indeks anak yang layak dan penanda kewujudan anak 2027-only sahaja** di dalam rekod sesi tab `sessionStorage` sedia ada, tanpa menyimpan PIN, token baharu atau maklumat Native 2027. Apabila akses semula dipilih, PIN diwajibkan dan backend Native menyemak semula. Data 2027 tidak dipulihkan melalui hint UI.
- Sesi 2027-only, Parent dua sesi, pemilihan anak, Slip Viewer dan eBayar Native masih menggunakan panggilan POST/semakan pemilikan server sedia ada. Kegagalan sambungan pada login baharu tidak dianggap bukti kelulusan; pilihan tersembunyi sehingga pengesahan berjaya.
- Semakan kod/sintaks dan ujian logik sintetik lulus sebelum commit. **Pemilik kini mengesahkan paparan LIVE PASS** untuk Legacy-only dan Parent dua sesi berdasarkan screenshot (rujuk penerimaan pengguna di atas). Pengesahan PIN selepas refresh bukan sebahagian bukti screenshot. **AutoCrat kekal HOLD.**

### Keutamaan selepas penerimaan S1.1

- **P1 Smart Action Centre Admin (NEXT, belum dilaksanakan):** guna data sedia ada untuk tindakan pendaftaran `PENDING 2027` dan bukti bayaran `PENDING`, serta pautan ke menu Admin yang sudah dikawal sesi; jangan tambah backend atau status rekaan tanpa skop/GO baharu.
- **P1 Telegram approval reliability (TRIGGER INSTALLED / DEPLOY PENDING):** 21/21 mock PASS menurut Work; trigger `upkkTelegramRetryApproved2027` Head setiap 5 minit disimpan dan disaksikan melalui screenshot; `Executions` belum disemak, web deployment masih V26. Esok semak log dan edit deployment asal, jangan ulang approve atau replay sejarah.
- **P2 AutoCrat Fast Delivery (HOLD atas arahan pemilik):** AutoCrat sedia ada terus mengurus merge PDF dan e-mel; tiada perubahan trigger/template, tiada pengganti SPDK/Native.
- **P1 Pengurusan Murid & Scan MyKid 2026 (LOCKED):** fungsi Legacy wujud tetapi tidak dibuka melalui endpoint tidak berautoriti. Sebarang pemulihan memerlukan semakan keselamatan berasingan.

## Dashboard Admin No. 6 — 17 November 2026 (MYT)

**Frontend `2.0-RC3-Admin-D6.1`** pada `pages/frontend-v1.34`. Cache PWA `upkk-v2-static-20261117-admin-d6-1`. Deployment Native sedia ada menggunakan **V26**.

- **Dashboard Utama.** Paparan jumlah permohonan, Diluluskan, Menunggu Semakan, Ditolak dan kutipan disahkan. Pecahan tahun dan mod mengira murid yang diluluskan.
- **Status Bulanan.** Jadual meliputi Disember 2026 hingga Disember 2027. Status Selesai, Dalam Semakan, Belum Bayar, Belum Bermula dan Tak Berkenaan mengikut bulan yuran murid. Bayaran bulan pertama yang disahkan semasa daftar sudah dikreditkan dalam bulan tersebut.
- **Kutipan per Bulan.** Graf menggunakan tarikh kelulusan dalam waktu Malaysia. Pecahan pendaftaran dan yuran bulanan dikira dalam sen. Yuran bulan pertama daripada pendaftaran dimasukkan sekali. Kutipan merangkumi bayaran yang disahkan.
- **Autorisasi.** `getAdminV2Dashboard2027` menggunakan router POST Native serta pengesahan token, tamat sesi dan allowlist Admin sedia ada. Agregat hanya membaca tab rasmi. V25 digunakan sebagai asas kod keluaran.
- **Ujian.** 13 semakan backend dan 7 semakan frontend lulus, termasuk semakan token, pecahan kutipan, bulan belum bermula dan padanan kod Parent P0.3.

| Bacaan rasmi semasa pengesahan (MYT) | Nilai |
| --- | --- |
| Permohonan · diluluskan · menunggu · ditolak | 28 · 28 · 0 · 0 |
| Tahun 3 · Tahun 4 · Tahun 5 | 4 · 6 · 18 |
| Fizikal · Online | 16 · 12 |
| Kutipan November 2026 · pendaftaran · yuran bulanan | RM1,950 · RM1,400 · RM550 |
| Yuran Disember 2026 · selesai · belum bermula · belum bayar | 11 · 17 · 0 |
| Transaksi Native eBayar semasa bacaan | 0 |

[Buka portal Admin LIVE](https://shafielegacy.github.io/UPKK/?admin=1)

### Paparan Status Bulanan Admin Sesi 2026 — `2.0-RC3-Admin-D6.2`

Tab **Status Bulanan · 2026** kini memaparkan 11 kad, dari Januari hingga November. Disember 2026 ialah bulan yuran pertama dalam **Status Bulanan · 2027**. Pembetulan terhad kepada paparan kad Admin 2026.

Cache PWA `upkk-v2-static-20261117-admin-d6-2`. Ujian terkawal mengesahkan 11 kad, paparan dan tindakan November, serta baris yuran Disember 2026 bagi Sesi 2027.

## Slip pendaftaran Parent sesi 2027 — 17 November 2026 (MYT)

**Frontend `2.0-RC3-Parent-P0.3`** pada `pages/frontend-v1.34`. Cache PWA `upkk-v2-static-20261117-parent-p0-3`. Deployment Native sedia ada menggunakan **V25**. Keluaran ini diterbitkan daripada komit [`40d41bb`](https://github.com/shafielegacy/UPKK/commit/40d41bb06edf349ded086ed17bb9dc5166a9e86c).

- **Pengesahan pemilik di LIVE.** Pada 17 November 2026, pemilik mengesahkan melalui tangkapan skrin bahawa butang **Lihat Slip Pendaftaran** muncul pada kad **November 2026** dalam bahagian **Permulaan Sesi** di dashboard Parent **Sesi 2027**. Kad **Disember 2026** memaparkan yuran bulan pertama sebagai **SELESAI**.
- **Cara buka slip.** Pilih **Sesi 2027**, sahkan PIN dan pilih murid. Tekan **Lihat Slip Pendaftaran** pada kad pendaftaran di **Permulaan Sesi**. Butang tersedia apabila AutoCrat sudah menjana PDF dan akaun Google penjaga berdaftar mempunyai akses kepada fail.
- **Akses PDF.** Akses Viewer bagi satu PDF sebenar telah disahkan untuk e-mel penjaga berdaftar. Fail ditetapkan sebagai **Restricted** dan notifikasi perkongsian dimatikan. Pengesahan pembukaan PDF menggunakan akaun penjaga menunggu ujian pengguna sebenar.
- V25 dibina daripada V24 dengan pindaan slip dalam `NativeParentExistingLogin2027`. Snapshot Apps Script HEAD dengan draf Admin dipulihkan dan disahkan sebelum pertukaran versi.
- Ujian terkawal meliputi padanan slip bagi murid yang dipilih, PDF tanpa akses penjaga, pengesahan semula PIN selepas refresh, 11 kad sesi 2026 dan bayaran bulan pertama pada sesi 2027.

## Dashboard Parent Jan–Nov 2026 — 17 November 2026 (MYT)

**Frontend `2.0-RC3-Parent-P0.2`** pada `pages/frontend-v1.34`. Cache PWA `upkk-v2-static-20261117-parent-p0-2`.

- **Parent sesi 2026.** Tajuk `Status Yuran Jan–Nov 2026` dan ringkasan `Selesai`, `Belum` serta `N/A` merujuk kepada 11 kad. Kad November kekal memaparkan status, amaun dan resit sedia ada. Resit Disember 2026 masih boleh dirujuk melalui Resit Digital.
- **Parent sesi 2027.** Ujian regresi meliputi pilihan sesi dan pengesahan PIN selepas refresh, paparan Disember 2026 yang sudah dibayar serta tarikh mula bayaran 1 Disember bagi bulan pertama yang masih belum dibayar. Grid Jan–Dis 2027 kekal 12 kad.
- **Penerimaan pemilik.** Pemilik mengesahkan akses dual-session dan pengesahan PIN sesi 2027 pada release `2.0-RC3-Parent-P0.1`.

## P0 Parent sesi 2027 — 17 November 2026 (MYT)

**Frontend `2.0-RC3-Parent-P0.1`** pada `pages/frontend-v1.34`. Cache PWA `upkk-v2-static-20261117-parent-p0-1`.

- **Punca selepas refresh.** Portal memulihkan sesi tab Legacy 2026. Keputusan semakan Native 2027 hanya wujud dalam memori dan hilang apabila halaman dimuat semula.
- **Login baharu.** Frontend terdahulu menyembunyikan pemilih sesi 2027 apabila semakan Native gagal. Respons penolakan, had percubaan dan masalah sambungan menghasilkan paparan yang sama. Ujian terkawal menghasilkan semula gejala ini. Punca percubaan LIVE untuk akaun terlibat belum disahkan.
- **Aliran Parent.** Selepas refresh, Parent boleh guna dashboard 2026 dan tekan **Sahkan sesi 2027** pada pemilih sesi. Pengesahan semula memerlukan enam digit terakhir telefon. Respons Native yang sah membuka dashboard 2027. PIN dihantar dalam body POST dan dibersihkan daripada input. Semakan baharu berlaku apabila Parent menghantar pengesahan.
- **Semakan release.** Chrome membaca respons penolakan JSON daripada kedua-dua endpoint LIVE dengan input kosong. Ujian Chrome terkawal meliputi Legacy sahaja, Native sahaja, pertukaran sesi dan refresh, PENDING/REJECTED, kegagalan sambungan, timeout dan had percubaan. Fixture RM100 menunjukkan RM50 pendaftaran, RM50 bulan pertama dan `SELESAI` untuk bulan yang dibayar. Grid Jan–Dis 2027 memaparkan 12 kad. Pemilik kemudian mengesahkan akses dual-session dan pengesahan PIN sesi 2027 dalam portal LIVE.
- **Skop.** Keluaran Pages meliputi pemilih sesi, pengangkutan login Parent, mesej ralat dan cache PWA. Ujian regresi Admin serta penyelarasan borang sedia ada lulus dengan data sintetik.

## Checkpoint penutupan malam — 16 November 2026 (MYT)

**Status:** Dokumentasi dan handoff sahaja; TIADA perubahan kod, GAS, deployment, trigger, Google Sheets, resit atau data melalui checkpoint ini. **Last verified frontend**: `2.0-RC3-Admin-G23.2` pada `pages/frontend-v1.34`; Native GAS **V24** ialah baseline yang telah disahkan untuk Admin Google popup. Work seterusnya *melaporkan* menerbitkan agregat read-only Dashboard sebagai **Native GAS V25** pada deployment asal sebelum usage limit tamat; **status versi deploy dan liputan kod V25 belum disahkan secara bebas di checkpoint ini**. Frontend belum menggunakan agregat; Dashboard Admin No. 6 masih **IN PROGRESS**.

### Penerimaan operasi LIVE oleh pemilik

- **eDaftar Parent 2027:** Google Sign-In, pengisian/penghantaran pendaftaran yang cepat, bukti bayaran dan paparan kejayaan dilaporkan **PASS**. Slip pendaftaran/PDF diperoleh, tetapi pemilik terpaksa menjalankan AutoCrat secara manual kerana menunggu job berkala yang mengambil masa sekitar **1 jam**.
- **Admin 2027:** Google login popup berjaya pada desktop dan Android; kelulusan beberapa permohonan sebenar telah dibuat oleh Admin/Ustaz, dan sekurang-kurangnya **satu** mesej Telegram `Pendaftaran Disahkan` berjaya diterima. Mesej bagi sebahagian kelulusan lain **tidak** masuk — jangan tandakan notifikasi sebagai 100% PASS.
- **Rekod rasmi:** semakan read-only pada tab `NATIVE_EDAFTAR_2027` malam ini menemui **24 APPROVED 2027, 0 PENDING**, dengan tarikh kelulusan. Ini snapshot semasa semakan, bukan angka kekal atau bukti penghantaran Telegram. Rekod approved tidak boleh diulang approve untuk menguji notifikasi.
- **Dashboard Parent:** selepas Admin meluluskan, Parent boleh login dan melihat dashboard masing-masing, termasuk akses sesi 2027. Kes khusus Parent yang turut mempunyai Legacy 2026: selepas **refresh** login masih aktif tetapi selector/paparan 2027 hilang dan tinggal dashboard 2026. Rekod murid dan penjaga telah dipadankan secara read-only pada kedua-dua tab; Native masih `APPROVED 2027`.
- **PWA update popup:** pemilik telah mengesahkan isu popup reload berulang **PASS/CLOSED** pada peranti yang diuji.
- **Native eBayar Disember:** kekalkan **1 Disember 2026** sebagai tarikh aktif yang dirancang. Bayaran bulan pertama yang telah diluluskan semasa daftar mesti dikreditkan, tanpa caj kedua. Tingkah laku LIVE pada 1 Disember **belum disahkan**.
- **Kes slip format:** satu kes upload ditolak oleh validasi signature; pemilik memilih **MONITOR / bukan release blocker** sementara tiada kes berulang dilaporkan.

### Repair dan pembaikan susulan (jangan laksana tanpa GO berasingan)

1. **P1 — Dashboard Admin No. 6:** diselesaikan pada 17 November 2026. Rujuk [milestone keluaran](#dashboard-admin-no-6--17-november-2026-myt).
2. **P0 — Parent dual-session refresh:** dibaiki dalam `2.0-RC3-Parent-P0.1`. Selector 2026/2027 dan pengesahan semula Native selepas refresh lulus dalam ujian Chrome terkawal. Pemilik mengesahkan akses dual-session dan pengesahan PIN sesi 2027.
3. **P1 — Buang butang sidebar `eBayar Yuran` Parent:** tangkap layar 16 Nov mengesahkan item sidebar redundan; kod `index.html` masih mengikatnya kepada `openEBayarForm()` (laluan form Legacy terus). **Buang/hide hanya entry sidebar** supaya Parent bayar melalui **kad bulan yang layak diklik**, dengan modal/form Legacy atau Native berdasarkan sesi dan pemeriksaan server. Jangan membuang kad bulan, mengaktifkan bulan awal, memintas kelulusan, atau mengubah eBayar. Nilai juga pintasan `Tindakan Pantas` supaya tidak memintas laluan kad, tetapi jangan ubah tanpa skop.
4. **P1 — Telegram Notification Reliability:** semak helper selepas kelulusan, sebab beberapa mesej approval tidak sampai walaupun semua rekod sudah `APPROVED`. Semak status API (termasuk 429), logging selamat, dedupe, dan retry **notifikasi sahaja**; jangan ulang penulisan rekod/approval atau menghantar berganda. Penyebab sebenar belum dibuktikan.
5. **P2 — Masa penjanaan slip AutoCrat:** pemilik menyatakan tunggu sekitar sejam lalu menjalankan AutoCrat secara manual untuk memperoleh slip. Semak masa proses, trigger sebenar, kuota dan risiko salinan PDF/e-mel berganda; cadang kaedah lebih pantas yang **idempotent** dengan status `PENDING`/dokumen, tanpa menukar trigger atau templat LIVE sebelum kelulusan.
6. **P2 — SEC26 dan Legacy:** backend authorisation/role, pemisahan data, resit Legacy 2026 dan access controls masih audit berasingan; tiada bypass fungsi Legacy.

**Peraturan sambung esok:** baca checkpoint ini + sumber frontend LIVE semasa; semak kewujudan/perlindungan V25 sebelum edit Dashboard No. 6; *read-only first*. Jangan ulang audit V23.2 Google popup atau cipta data ujian. Rekod pilihan kerja pemilik selepas semakan. Pastikan semua kod yang mengubah PWA menaikkan cache/version untuk pengguna sedia ada.

---

## Milestone LIVE — Admin Google Sign-In V23.2 (16 November 2026)

- Pada V23.1, Chrome Android menghantar pengguna ke GAS `/exec` selepas pemilihan akaun. Android membuka pautan itu dalam Google Drive dan memaparkan ralat halaman.
- Portal memulakan `initCodeClient` Google Identity Services dalam mod `popup`. Callback JavaScript menghantar kod melalui POST ke Native GAS. GAS menggunakan origin `https://shafielegacy.github.io`, klien OAuth production yang sama dan rahsia dalam Script Properties untuk menukar kod. [Panduan Google Identity Services](https://developers.google.com/identity/oauth2/web/guides/use-code-model)
- Cabaran Admin diikat pada pengesah dalam tab dan digunakan sekali sahaja. GAS menyemak tuntutan identiti Google termasuk `email_verified` dan allowlist sebelum mengeluarkan token sesi Admin. Panggilan `decideAdminV2Application` terus memerlukan sesi Admin yang sah.
- Native GAS V24 diterbitkan pada 20:37 MYT melalui deployment Native sedia ada. Sumber berubah dalam `AdminGoogleV23.gs` dan `PagesAdminV2Production.gs`. Frontend dan cache PWA dikemas kini ke G23.2 pada komit [`2a60d55`](https://github.com/shafielegacy/UPKK/commit/2a60d55003bd9712c1d4eb25f5027bc3596f245c).
- Semakan LIVE pada Chrome desktop membuka dashboard dalam tab portal asal. Senarai sesi 2027 dimuatkan dan log keluar berjaya. Pemilik mengesahkan dashboard Admin terbuka pada portal selepas memilih akaun Google dalam Chrome Android.
- Pengesahan SAHKAN dan TOLAK meliputi paparan butang dan semakan kebenaran pada backend.
- Callback V23.1 masih tersedia untuk percubaan yang bermula sebelum penerbitan G23.2.

Portal Admin LIVE [Log Masuk Admin](https://shafielegacy.github.io/UPKK/?admin=1)

## Checkpoint pemilik: Admin Google di telefon PASS + TODO aktif (16 November 2026)

**User acceptance terbaru:** pemilik mengesahkan selepas pembetulan V23.2 bahawa **Google Sign-In Admin boleh digunakan di telefon dan kembali ke dashboard portal GitHub Pages**. Insiden Android sebelum ini yang terhenti pada `script.google.com` / Google Drive **selesai untuk peranti yang diuji**. Source semasa: `2.0-RC3-Admin-G23.2`, Google Identity Services `ux_mode:'popup'`, commit rujukan `2a60d55003bd9712c1d4eb25f5027bc3596f245c`. Jangan anggap semua model Android/browser telah diuji.

**Had bukti:** kejayaan login dan paparan senarai permohonan tidak sama dengan bukti lengkap tindakan **Sahkan Bayaran**, rekod yuran, notifikasi selepas kelulusan atau resit. Semua kekal sebagai semakan operasi berasingan.

### TODO semasa — keutamaan selepas parent mula daftar LIVE

| Prioriti | Perkara | Status & kriteria selesai |
| --- | --- | --- |
| **P0** | **Aliran kelulusan Admin 2027** | **OPERASI PASS (16 Nov):** pemilik/Ustaz sudah meluluskan beberapa permohonan sebenar, rekod spreadsheet semuanya APPROVED dan sekurang-kurangnya satu Telegram kelulusan diterima. **Namun** keandalan penghantaran Telegram masih OPEN; semak resit/padanan jumlah secara berasingan. Jangan approve semula rekod hanya untuk ujian. |
| **P2** | **Ralat muat naik slip pada telefon** | **MONITOR:** hanya satu kes format fail tidak sepadan setakat laporan pemilik; bukan blocker LIVE. Jika berulang, semak MIME/signature JPEG/PNG/PDF dan proses tukar fail tanpa hilang borang, kekalkan had 3 MB dan perlindungan slip. |
| **P1** | **Paparan kejayaan Parent V22.3** | **PASS oleh pemilik:** Parent berjaya daftar dan menerima maklum balas kejayaan; status bayaran/kelulusan kekal berasingan. |
| **P0** | **Login Parent yang sudah diluluskan** | **PASS PEMILIK** pada `2.0-RC3-Parent-P0.1`. Parent dual-session boleh membuka dashboard 2026 dan sahkan semula akses 2027 dengan PIN selepas refresh. |
| **P1** | **Native eBayar & status 12 bulan sesi 2027** | **TUNGGU 1 DIS 2026 untuk pengesahan LIVE:** kad bulanan dirancang hidup ikut tarikh; RM50 pendaftaran sahaja memerlukan bulan pertama, RM100 (daftar+bulan mula) sudah kredit bulan tersebut. Jangan double charge atau paksa aktivasi awal. |
| **P1** | **Dashboard Admin sesi 2026/2027** | **SELESAI — NO. 6 (17 Nov 2026).** Dashboard Utama, Status Bulanan dan Kutipan per Bulan sesi 2027 tersedia dalam `2.0-RC3-Admin-D6.1` dan Native V26. Akses 2026 kekal read-only. |
| **P1** | **Popup kemas kini PWA berulang** | **PASS/CLOSED (pengesahan pemilik pada peranti diuji)** untuk V23.2. Setiap perubahan frontend berikutnya tetap perlu bump cache/version PWA. |
| **P1** | **Parent 2027 hilang selepas refresh (dual-session restore)** | **OPEN / BUG PAPARAN:** pemilik melaporkan Parent yang berdaftar dalam Legacy 2026 dan Native 2027 kekal login selepas refresh, tetapi sesi/pemilih 2027 hilang dan hanya dashboard 2026 dipaparkan. Semakan read-only mengesahkan murid dan penjaga yang sama wujud pada kedua-dua tab dan rekod Native berstatus `APPROVED 2027`. Punca kod yang kuat: `index.html` memulihkan `upkk_session` Legacy melalui `loadDashboard()` tetapi **tidak memanggil** `UPKKParentExistingV2.afterLegacyLogin()` pada restore; `parent-existing-2027.js` menyimpan `children`/`verified` dalam memori yang terpadam ketika reload. Reka semula pemulihan sesi 2027 melalui pengesahan server-side yang berautoriti atau re-auth yang jelas; **jangan** simpan PIN enam digit telefon, MyKid, bukti bayaran atau identiti sensitif dalam localStorage/query string. Kekalkan sesi 2026, pemilih 2026/2027, pilihan sesi asal apabila selamat, fungsi Parent dan keselamatan data. Pengesahan end-to-end selepas pembetulan belum dibuat. |
| **P1** | **Telegram Notification Reliability — kelulusan 2027** | **TRIGGER PASS / RELEASE BELUM (17 Nov):** 21/21 mock PASS menurut Work, trigger `upkkTelegramRetryApproved2027` Head setiap 5 minit disimpan dan screenshot mengesahkan satu trigger (`Last run -`). **Native LIVE masih V26.** Esok semak Executions, kemudian edit deployment asal ke versi baharu tanpa URL/trigger tambahan, dan pantau kelulusan sebenar seterusnya untuk event `SENT`. |
| **P1** | **Pilihan sesi Parent 2027 mengikut anak berdaftar** | **PASS PEMILIK — 17 Nov 2026 (`2.0-RC3-Parent-S1.1`, commit `7633c963`).** Screenshot mengesahkan Legacy-only hanya Sesi 2026, Parent dua sesi boleh mengakses Sesi 2027 dan ringkasan bulan pertama betul. PIN selepas refresh tidak diuji semula dalam penerimaan ini. |
| **P1** | **Buang sidebar eBayar Yuran Parent** | **CODE DONE — `2.0-RC3-Admin-D6.3`:** item eBayar Yuran pada navigasi sidebar Parent Sesi 2026 dibuang. Tindakan Pantas eBayar, 11 kad 2026, butang/resit dan Parent 2027 dikekalkan tanpa perubahan. Semakan UI selepas login Parent LIVE menunggu pengesahan pemilik. |
| **P1** | **Kad Disember 2026 — paparan Parent Legacy** | **SELESAI** dalam `2.0-RC3-Parent-P0.2`. Parent sesi 2026 memaparkan Jan–Nov dengan 11 kad dan ringkasan berdasarkan tempoh yang sama. Disember 2026 kekal dipaparkan dalam sesi akademik 2027 bagi murid yang berkaitan. |
| **P2** | **AutoCrat slip pendaftaran terlalu lambat** | **HOLD — arahan pemilik 17 Nov; AutoCrat asal terus menangani merge PDF dan e-mel.** pemilik terpaksa menjalankan AutoCrat secara manual selepas menunggu lebih kurang sejam. Audit trigger sebenar/masa penjanaan, idempotency, kuota dan risiko PDF/e-mel pendua; cadang penjanaan lebih cepat tanpa mengubah trigger/templat LIVE sebelum GO. |
| **P2** | **Keselamatan dan compatibility keseluruhan** | **AUDIT BERASINGAN:** sahkan session/token/allowlist Admin V24, pengasingan data 2027, endpoint Legacy V65, akses resit dan hak penjaga. Jangan tutup endpoint Legacy atau mengganti fungsi sehingga keserasian 2026 dibuktikan dan pemilik memberi GO. |

**Keutamaan operasi:** fokus kelulusan permohonan yang sedang masuk dan ralat slip Parent dahulu; kemudian status Parent, eBayar, PWA dan hardening. Dokumentasi ini bukan arahan untuk menjalankan perubahan LIVE. Semua penulisan kod/deployment/data memerlukan skop dan kelulusan tersendiri.

---

## Milestone LIVE — Admin Google Sign-In V23.1 (16 November 2026)

**Status:** USER ACCEPTANCE PASS untuk login dan paparan dashboard Admin sesi 2027. Pengesahan transaksi sebenar belum diuji melalui bukti screenshot. Ini adalah checkpoint semasa, berasingan daripada laporan QA sejarah 3 November dan milestone eDaftar V22.3.

- **Isu asal:** OTP Admin tidak dapat dihantar dengan mesej "Perkhidmatan OTP tidak tersedia. Cuba kemudian." Source `requestAdminV2Otp` menunjukkan mesej tersebut boleh muncul apabila `MailApp.getRemainingDailyQuota() <= 5`; baki kuota sebenar tidak pernah disahkan. Jangan catat penyebab sebagai terbukti.
- **Penyelesaian telah dikeluarkan oleh Work:** Admin menggunakan Google Sign-In pada portal LIVE sedia ada. Pemilik mengesahkan boleh login dan melihat dashboard, tanpa membuat portal kedua.
- **Bukti visual pemilik:** menu Admin asal kekal; sesi 2027 dipilih; `Pengurusan Murid · 2027` memaparkan 20 rekod, termasuk status `PENDING 2027`, butang `Lihat Bukti Transaksi`, `Sahkan Bayaran` dan `Tolak`. Tiada dakwaan bahawa butang SAHKAN sudah digunakan atau transaksi sebenar sudah diluluskan.
- **Bukti source GitHub:** `index.html` mengisytiharkan `2.0-RC3-Admin-G23.1`, `admin-2027-config.js` mempunyai `googleEnabled:true` dan `googleOnly:true`, dan `admin-2027.js` mengandungi aliran Admin Google. `version.json` juga sepadan dengan G23.1. PWA cache: `upkk-v2-static-20261116-admin-google-g23-r2`.
- **OTP legacy:** nota release `version.json` masih menyatakan OTP Admin sebagai fallback jika Google gagal. Jangan anggap endpoint/fungsi OTP backend sudah dipadam. Google-only dalam UI tidak bermaksud auth lama ditutup di server.
- **Keselamatan:** login Google Admin berjaya dilaporkan pemilik; audit bebas terhadap semua backend authorization/role-check dan fungsi approval selepas release ini **belum direkodkan** dalam checkpoint ini.
- **PWA update loop:** terdapat commit source `19524ad0665a356190da8140905cb81c8145abca` bertajuk `fix(pwa): stop repeated update prompt on reload`. Hasilnya pada peranti Parent/Admin **belum diuji semula**; status belum boleh ditutup.
- **Had perubahan dokumentasi:** penulisan checkpoint ini hanya pada Markdown GitHub. Tidak mengubah GAS, frontend, deployment, OAuth, Google Sheets, Telegram, AutoCrat, resit, Legacy 2026 atau data Parent.

**Komit rujukan sebelum dokumentasi:** `19524ad0665a356190da8140905cb81c8145abca` pada `pages/frontend-v1.34`. Tiada PIN, password, OTP, token, ID murid atau nama individu dimasukkan dalam laporan awam.

---

## Kemas kini milestone LIVE — 16 November 2026 (MYT)

**Skop:** Native eDaftar Sesi 2027 di portal GitHub Pages, bukan pertukaran login Parent Legacy 2026 atau login Admin. Bahagian laporan bertarikh 3 November di bawah ialah rekod QA sejarah; status *BELUM RELEASE* di situ tidak lagi mewakili keadaan eDaftar 2027 pada 16 November.

### Keputusan & bukti

- **Google Sign-In Parent untuk eDaftar 2027: LIVE (user acceptance).** OAuth Google berjaya mengesahkan e-mel penjaga dan mengeluarkan tiket melalui Native GAS. Google-only tersedia pada UI awam; field e-mel diisi daripada akaun Google yang disahkan. Pemilik berjaya menggunakan akaun Google bukan pilot pada 16 November.
- **Pendaftaran Native:** pemilik melaporkan satu penghantaran berjaya disimpan dalam tab `NATIVE_EDAFTAR_2027`, bukti bayaran diterima dan notifikasi Telegram masuk. UI memaparkan respons server bahawa permohonan serta slip diterima; status pendaftaran/bayaran masih menunggu pengesahan Admin. Baris ujian tersebut telah dipadam oleh pemilik sebelum semakan bacaan semula; oleh itu hasil itu dicatat **PASS berdasarkan penerimaan pemilik dan screenshot**, bukan audit bebas row/Telegram yang masih wujud.
- **V22.2 Google-only:** pilihan OTP dikeluarkan daripada *frontend* eDaftar. Backend OTP lama dan Native Admin OTP **tidak** ditutup atau diubah dalam release frontend ini. Pengesahan Admin menggunakan token sesi sedia ada.
- **V22.3 Success UI:** selepas backend membalas `success: true` untuk `submitNativeEdaftar`, form digantikan dengan halaman kejayaan yang menyatakan permohonan diterima, nama murid, e-mel Google, jumlah bukti bayaran serta **MENUNGGU PENGESAHAN PENTADBIR**. Jika status penghantaran gagal/tidak pasti, success UI **tidak** dipaparkan dan Parent diminta menghubungi urusetia sebelum cuba lagi. Tiada panggilan tulis tambahan.
- **Versi PWA:** cache `upkk-v2-static-20261116-edaftar-googleonly-g22-r3`; portal `2.0-RC3-eDaftar-G22.3`, borang `Paparan eDaftar V22.3`. Tiada fail/deployment GAS tambahan diwujudkan.
- **GitHub Pages source:** branch `pages/frontend-v1.34`, HEAD checkpoint `bc69c5472ec3074c8b01ac0d3b7fffa42b7b76d5`; semakan source selepas commit menunjukkan 11/11 invariants PASS, termasuk JavaScript syntax, pengesahan Google, submit sedia ada, status success dan cache version.
- **Parent outreach:** pemilik telah menyebarkan pautan borang kepada penjaga untuk mula mendaftar pada 16 November 2026.

### Sempadan dan isu masih terbuka

1. **Popup kemas kini berulang pada portal:** pemilik melaporkan butang *Reload Sekarang* masih memaparkan popup lagi. **OPEN / belum diperbaiki atau disahkan selesai.** Jangan kelirukan dengan kegagalan pendaftaran.
2. **Ujian skrin kejayaan V22.3 selepas patch:** source GitHub PASS; ujian manual di telefon selepas patch belum dilaporkan, dan tidak perlu cipta row dummy LIVE semata-mata untuk mengulangi penghantaran. Semak pada permohonan sebenar berikutnya.
3. **Admin auth:** Native Admin masih OTP; perubahan kepada Google Sign-In Admin berasingan berasaskan allowlist/server-role merupakan **cadangan untuk skop lain**, bukan release ini. Jangan menggantikan OTP dengan kata laluan ringkas spreadsheet sahaja. Tidak ada PIN, kata laluan, token atau e-mel peribadi dipindah ke dokumentasi awam.
4. **Data/sistem dipelihara:** Legacy 2026, Admin, AutoCrat, Telegram, yuran, resit dan struktur spreadsheet tidak diubah oleh frontend patch V22.2/V22.3. Native eBayar/dashboard Parent bukan sebahagian daripada pengesahan release eDaftar ini.
5. **Akaun Google tertentu:** backend V22 menolak sesetengah identiti Google pihak ketiga yang e-melnya tidak boleh disahkan secara autoritatif; jangan menganggap semua alamat e-mel pihak ketiga disokong.

**Prinsip release:** LIVE bukan bermaksud seluruh projek SEC26 sudah 100% lulus. Perubahan authentication/switch backend atau data rasmi memerlukan semakan berasingan. Pada 16 Nov, laporan ini dikemas kini sebagai dokumentasi sahaja, tanpa mengubah GAS, spreadsheet, trigger atau data.

---


**Tarikh:** 3 November 2026 (MYT)  
**Status:** Native eDaftar QA berjaya diuji dengan Google sebenar dalam **projek dan spreadsheet salinan**. **BELUM RELEASE / BELUM PRODUCTION READY.**  
**Repository:** `shafielegacy/UPKK`  
**V1 LIVE:** branch `master`, baseline sebelum laporan `196daeabdf2b3fa2316cd55c4ddd6eea3ca2b3bd`  
**Kod calon:** branch `feature/native-edaftar-v1-qa`, checkpoint `9268681105d538d8d3524e63ae014e1051c88ae5`  
**Prinsip pemilik:** SIMPLE · STABLE · SECURE; kekalkan **rupa dan aliran V1**. Tukar hanya laluan Google Form pendaftaran/bayaran kepada Native eDaftar/eBayar, tambah OTP dan resit PDF yang bersesuaian. **Jangan redesign dashboard**, bina Master List besar atau tambah spreadsheet rasmi tanpa keperluan.

> Dokumen ini ialah **catatan pembangunan/QA**, BUKAN bukti bahawa kod QA sudah masuk `master` atau GAS LIVE. Semua URL/ID peribadi, MyKid, OTP, nombor telefon serta butiran penjaga/murid dikecualikan.

## 1. Keputusan pemilik projek yang kekal

- **V1 yang terbukti** menjadi asas V2. Login penjaga, pilihan anak, 12 kad bulan, popup status, eSemak dan dashboard Admin kekal secara prinsip.
- Native eDaftar bermula dengan pengambilan **Disember 2026 untuk sesi akademik 2027**, dan sistem perlu menyokong sesi seterusnya.
- Murid yang menyambung **tidak didaftarkan sebagai murid baharu** hanya kerana sesi berubah; rekod 2026/histori bayar tidak dipadam atau dimigrasikan secara pukal.
- Pengambilan baharu 2027 menurut perbincangan pengasas: **Tahun 3 dan Tahun 4** (lazimnya 9 dan 10 tahun). Borang QA ketika milestone masih mempunyai pilihan umur 9–12; **hadkan/padankan pilihan dengan aturan sesi sebenar sebelum release**, termasuk kes umur tak sama dengan tahun sekolah.
- **Yuran bulanan** bermula Disember 2026 dinyatakan **RM50** untuk penambahan mata pelajaran (Bahasa Arab, Akidah, Ibadah). **Yuran pendaftaran baharu belum disahkan oleh pengasas.** Aturan legacy: jumlah RM80 merangkumi RM40 pendaftaran + RM40 bulan pertama. **Jangan tafsir RM50 sebagai keseluruhan bayaran daftar.**
- Cadangan diluluskan untuk diteroka: **Tetapan Yuran pada Admin V1** — kadar pendaftaran dan bulanan berasingan, mengikut sesi; kadar yang dipakai pada permohonan direkod sebagai sejarah. **BELUM DIBANGUNKAN.** Label bukti bayaran `RM50` pada borang QA adalah *sementara* dan tidak boleh di-hardcode untuk release.
- Native eBayar gaya SPKM, pengesahan urusetia dan resit PDF merupakan **kerja seterusnya**, bukan sebahagian daripada milestone ujian eDaftar ini.

## 2. Baseline V1 yang diaudit (read-only)

### Struktur tab `DAFTAR UPKK` dalam workbook rasmi

| Kolum | Makna |
|---|---|
| A–H | Timestamp, email penjaga, nama penjaga, nama murid, MyKid, umur, telefon, alamat |
| I | Pautan bukti bayaran |
| J | `BAYARAN` |
| K | `NO RESIT` — `ARRAYFORMULA` V1 |
| L | `STATUS` — `ARRAYFORMULA` V1 |
| M–P | Empat kolum output AutoCrat `DAFTAR UPKK 2026` |
| Q–T | Pengelasan umur 9/10/11/12 |
| U | Ruang sedia ada / flag legacy jika digunakan; jangan overwrite tanpa audit |
| V | **Tambahan dalam spreadsheet BACKUP QA sahaja:** `STATUS_PERMOHONAN` |

**Penting:** `STATUS` V1 asal bukan nilai statik: `=ARRAYFORMULA(IF(ROW(H:H)=1,"STATUS",IF(LEN(H:H),"SELESAI","")))`. Menulis `PENDING 2027` terus pada L106 memecahkan spill `ARRAYFORMULA` dan menghasilkan `#REF!`. Formula K1 pula menjana nombor resit berdasarkan nombor baris, bukan bukti bayaran disahkan.

Sebelum percubaan QA, audit rasmi mendapati **100 murid berrekod**: umur 9 (1), umur 10 (32), umur 11 (67), dan tiada umur di bawah 9 dalam medan umur yang direkodkan. Ini ialah umur pada rekod 2026, **bukan pengesahan kelas akademik 2027**.

### Trigger GAS LIVE (pemerhatian UI pemilik)

- `onEbayarUPKKSubmit`: spreadsheet / on form submit; paparan error rate 0%.
- `onEdaftarFormSubmit`: Google Form / on form submit.
- Kedua-duanya diset pada **HEAD**. Mengubah kod dalam projek GAS LIVE boleh memberi kesan kepada trigger walaupun deployment `/exec` tidak diganti; **jangan patch GAS LIVE untuk ujian**.

## 3. Persekitaran QA sebenar

1. Pemilik menyalin **spreadsheet rasmi**, bersama projek GAS `container-bound`. Salinan dinamakan `BACKUP UPKK V1 - 03 NOV 2026` (spreadsheet dan projek GAS). Salinan juga menghasilkan sejumlah salinan Google Form yang berkaitan; **tidak digunakan untuk ujian native**.
2. Projek GAS BACKUP didapati mempunyai **0 installed triggers**.
3. `SPREADSHEET_ID` dalam `Code.gs` projek BACKUP telah ditukar secara manual kepada ID spreadsheet BACKUP. **Kod pada branch GitHub QA mungkin masih menunjukkan ID workbook rasmi**; jangan copy semula dan terus Run tanpa membetulkan ID.
4. Pemilik memasang secara manual `Code.gs`, `index.html`, `NativeEdaftar.gs` dari branch QA. Manifest ditambah OAuth scope Drive, selain Sheets dan Mail.
5. Script Properties GAS BACKUP: `UPKK_NATIVE_EDAFTAR_ENABLED`, `UPKK_NATIVE_EDAFTAR_TEST_EMAIL` (allowlist **satu** e-mel ujian), `UPKK_NATIVE_EDAFTAR_SLIP_FOLDER_ID` (folder Drive restricted). Nilai sebenar tidak disimpan dalam GitHub.
6. Test deployment `/dev?view=edaftar` digunakan. Ini **bukan** deployment awam `/exec`. Borang dalam GAS HTML Service menggunakan `google.script.run` untuk data sensitif; paparan GitHub Pages QA hanya bertindak sebagai pautan pembuka halaman GAS, bukan saluran penghantaran MyKid/OTP/slip melalui URL atau JSONP.
7. Folder slip QA masih merupakan folder restricted di akaun UPKK yang sama dan mungkin mengandungi fail ujian; perlu diaudit/dibersihkan selepas ujian. **Backup spreadsheet bukan bermaksud semua sumber Drive automatik diasingkan.**

## 4. Fungsi calon yang dibina

- Native eDaftar dalam tab login V1: nama penjaga, e-mel, telefon, nama murid, MyKid, umur, alamat, slip JPEG/PNG/PDF sehingga 3 MB, OTP.
- OTP 6 digit melalui MailApp, tempoh 10 minit, cooldown 60 saat, had percubaan, pengesahan yang mengeluarkan tiket sekali guna. `UPKK_NATIVE_EDAFTAR_ENABLED` ialah feature flag; satu e-mel penguji dibenarkan ketika smoke test.
- Backend: semak MyKid berganda, lock semasa transaksi, validasi medan/fail dan simpan pautan slip ke Drive private.
- Status permohonan baharu disimpan sebagai `PENDING 2027`, **bukan pembayaran berjaya**. Bayaran / resit rasmi belum dikeluarkan.
- Dialog pengesahan `window.confirm` yang kelihatan kasar telah diganti modal bertema V1.
- Pemilihan row ditukar daripada `getLastRow()+1` kepada pencarian baris yang benar-benar kosong, dengan semakan formula untuk mengelak overwrite.
- Kod QA tidak lagi menulis terus ke kolum K/L yang dipunyai `ARRAYFORMULA`. Permohonan baharu menanda kolum V (`STATUS_PERMOHONAN`), menulis medan A–I, dan membiarkan K/L dikira oleh formula.

## 5. Penemuan, pembaikan dan formula QA

**Penemuan A — row lompat:** Dalam BACKUP, rekod ujian pertama masuk row 106 walaupun row 102–105 kosong. Pemilihan row QA diperbaiki; ujian kedua kemudian disahkan masuk **row 102**, sementara row 106 kekal.

**Penemuan B — formula STATUS:** L1 memaparkan `#REF!` selepas `L106` diisi manual `PENDING 2027`; percubaan membaca kolum V sebelum ia wujud menghasilkan `#VALUE!`. Setelah kolum V ditambah dan L106 dikosongkan, formula berjaya. Penanda `PENDING 2027` disimpan di V106.

**Formula semasa dalam spreadsheet BACKUP QA sahaja:**

```excel
K1 =ARRAYFORMULA(IF(ROW(A:A)=1,"NO RESIT",IF(LEN(A:A),IF(V:V="PENDING 2027","",TEXT(ROW(A:A)-1,"000")),"")))
L1 =ARRAYFORMULA(IF(ROW(H:H)=1,"STATUS",IF(LEN(H:H),IF(V:V="PENDING 2027","PENDING 2027","SELESAI"),"")))
```

Formula ini **mengekalkan nombor lama 001–100 dan status SELESAI** untuk rekod V1, memaparkan K kosong dan L `PENDING 2027` untuk permohonan native. **K1/L1 rasmi LIVE tidak diubah.** Perlu audit lagi semantik “SELESAI” (berasal daripada adanya alamat), serta reka bentuk nombor resit rasmi selepas bayaran disahkan. **Jangan anggap formula K1 ini menyelesaikan sistem resit berbilang tahun.**

**Penemuan C — guard formula:** Semakan backend pada mulanya salah mencari teks `STATUS_PERMOHONAN` dalam **formula L1** walhal formula menggunakan `V:V`. Guard dibetulkan untuk menyemak header V dan rujukan `V:V="PENDING 2027"` tanpa melonggarkan validasi struktur.

## 6. Bukti QA yang telah dilihat

| Semakan | Keputusan | Had bukti |
|---|---|---|
| V1 look & feel, tab eDaftar, borang, upload slip | **PASS — visual** | Screenshot pemilik melalui `/dev` |
| E-mel di luar allowlist | **PASS — observed** | Ditolak dengan “Pendaftaran belum dibuka kepada umum” |
| OTP e-mel sebenar dihantar/diterima | **PASS — observed** | Gmail dan UI disahkan oleh screenshot; kod OTP **jangan rekod** |
| OTP cooldown 60 saat | **PASS — observed** | Permintaan semula terlalu cepat ditolak |
| OTP disahkan | **PASS — observed** | UI menunjukkan e-mel berjaya disahkan dan submit aktif |
| Modal V1 mengganti browser popup | **PASS — visual** | Screenshot modal “Sahkan Pendaftaran” |
| Slip & pendaftaran masuk ke Sheets BACKUP | **PASS — observed** | Dua rekod ujian masuk (row 106 pertama, row 102 selepas patch) |
| Row 102 serta row 106 wujud tanpa overwrite | **PASS — Sheets read** | Bacaan semasa pada BACKUP |
| K dan J kosong; L dan V `PENDING 2027` pada row 102 | **PASS — Sheets read** | Bayaran belum disahkan |
| Rekod legacy row 101 tetap RM80 / NO RESIT 100 / SELESAI | **PASS — Sheets read** | Semakan terhad pada row relevan, bukan audit seluruh workbook |
| MyKid duplicate pada Google sebenar | **NOT VERIFIED** | Mock/semakan kod ada; jangan claim ujian sebenar |
| Workflow Admin sahkan bayaran / resit PDF | **NOT IMPLEMENTED** | Perlu bangunkan |
| GitHub Pages public → GAS production | **NOT RELEASED** | Hanya kod calon, tidak publish |
| Keserasian semua login, Admin & AutoCrat selepas release | **NOT VERIFIED** | Perlukan ujian integrasi minimum |

**Data QA yang tinggal:** dua pendaftaran rekaan dalam spreadsheet BACKUP (row 102 & 106) dan slip rekaan dalam folder Drive restricted. Bersihkan dengan teliti selepas cukup bukti; jangan delete row sebenar atau folder secara pukal.

## 7. Release blockers dan tindakan seterusnya

1. **Sahkan yuran dengan pengasas:** RM50/bulan mulai Dis 2026 disokong oleh perbincangan; **jumlah pendaftaran baharu / pecahan yuran pendaftaran berasingan belum diputuskan**. Jangan buka umum dengan label “RM50” sebagai jumlah penuh.
2. **Tetapan Yuran Admin:** konfigurasi kadar daftar & bulanan bagi setiap sesi, pengesahan role Admin **server-side**, perubahan diaudit dan amaun permohonan dipaku pada tarikh permohonan. Kekalkan dashboard V1.
3. **Tahun persekolahan:** jelaskan input Tahun 3/4 untuk sesi 2027 dan hubungannya dengan umur 9/10, tanpa silap mentafsir umur lama sebagai status kelas baharu.
4. **Pengesahan urusetia:** proses menyemak slip, menyimpan jumlah yang disahkan, menukar pending→approved serta membolehkan akses penjaga tanpa tersalah menganggap slip sebagai bayaran sah.
5. **Resit rasmi:** hanya selepas bayaran disahkan, bukan menjadikan `ROW()-1` sebagai nombor resit berbilang sesi.
6. **Semakan keselamatan:** MyKid duplicate real, OTP single-use, lock/concurrency, pemfailan Drive private, error recovery, skop OAuth, dan akses endpoint legacy (termasuk Admin). Kekalkan `UPKK_NATIVE_EDAFTAR_TEST_EMAIL` sehingga pengasas meluluskan go-live.
7. **Integrasi deployment:** semak HEAD triggers asal, elakkan menampal kod QA ke GAS LIVE secara terus; rancang upgrade yang tidak mengubah aliran tahun 2026. Nilai semula peraturan yang di-hardcode pada 2026.
8. **Sync dokumentasi/kod:** calon GitHub QA berasingan daripada fail yang disalin secara manual ke GAS BACKUP; bandingkan perbezaan sebelum release. Hanya merge apabila pemilik meluluskan dan bukti minimum mencukupi.

## 8. Safety LOCK / checkpoint

- **Master LIVE kekal V1.** Laporan dalam `master` boleh dikemas kini tanpa mengubah fail aplikasi.
- **Tiada merge, deploy, perubahan pada GAS LIVE, Sheet rasmi, Trigger rasmi, atau AutoCrat rasmi** dalam fasa dokumentasi ini.
- Semua rekod ujian, formula V2 dan kolum V yang diterangkan adalah pada spreadsheet BACKUP sahaja.
- **Jangan salin ID/folder/e-mel penguji, OTP, slip atau data murid ke dokumentasi awam.**

**Milestone:** Native eDaftar menggunakan V1 UI → OTP → bukti bayaran → GAS → spreadsheet BACKUP berjaya diuji. Fasa seterusnya: pengesahan kadar yuran, tetapan yuran Admin dan workflow urusetia.

## 9. TODO sambungan — dipersetujui pemilik pada 3 Nov 2026

**Status:** Belum dimulakan kecuali yang ditanda jelas. Sambung dalam branch QA; **jangan sentuh LIVE**.

- [ ] **Konfirmasi pengasas:** jumlah yuran pendaftaran baharu untuk Disember 2026/sesi 2027 dan sama ada termasuk bulan pertama; kadar bulanan RM50 tidak semestinya bayaran pendaftaran keseluruhan.
- [ ] **Admin — Tetapan Yuran:** tambah fungsi kecil pada dashboard V1 sedia ada untuk kadar *pendaftaran* dan *bulanan* berasingan ikut sesi; validasi Admin di backend, rekod kadar pada masa permohonan, tanpa hardcode RM50 pada borang/slip.
- [ ] **Admin — Permohonan Baharu:** tambah tab untuk senarai permohonan `PENDING 2027`, butiran yang perlu, pautan slip restricted dan tindakan **Sahkan/Tolak** (dengan sebab penolakan).
- [ ] **Pengesahan urusetia:** semak bukti dan amaun, catat Admin/masa/amaun, ubah status secara terkawal, elakkan kelulusan berganda, hanya murid sah masuk kiraan aktif/dashboard.
- [ ] **Parent selepas lulus:** login berjaya dan dashboard 12 bulan V1 dipaparkan; sebelum lulus login ditolak dengan mesej yang tepat.
- [ ] **Patch mesej pending pada GAS BACKUP:** kod `Code.gs` telah dikemas kini pada branch `feature/native-edaftar-v1-qa` commit `de0a65fc743a9e7736fb3fd9120f10e62aa7d079` (**syntax PASS, belum ditampal/diuji pada GAS BACKUP**). Semasa salin, **pastikan `SPREADSHEET_ID` kekal ID BACKUP**. Mesej yang dipersetujui: “Permohonan pendaftaran anak anda masih dalam semakan urusetia. Akses dashboard akan tersedia selepas pendaftaran disahkan.”
- [ ] **Admin email khas:** `upkksl@gmail.com` ialah akaun **Admin sahaja**. Abaikan senario akaun Admin = penjaga yang diuji dengan e-mel yang sama; jangan jadikannya keperluan V2.
- [ ] **MyKid & umur automatik:** format input MyKid kepada `YYMMDD-XX-XXXX` semasa menaip (paparan), semak 12 digit dan tarikh lahir yang wujud **di frontend dan backend**; simpan format seragam dengan data lama (kolum E). **Jangan lagi tulis umur manual ke F**: F2 ialah `ARRAYFORMULA` yang mengira umur daripada E menggunakan `TODAY()`, jadi tulis ke F boleh merosakkan spill. QA MyKid rekaan bermula `81` menghasilkan umur `-55` kerana formula mentafsir tahun `2081`. Pilih nombor dummy yang tarikh lahirnya valid untuk ujian. Jangan dedahkan MyKid sebenar dalam laporan. Semak juga keperluan umur pada tahun sesi vs umur tepat hari ini, sebab `TODAY()` berubah sepanjang tahun.
- [ ] **Umur / tahun sekolah:** buang dropdown umur manual daripada Native eDaftar; kekalkan pilihan Tahun 3/Tahun 4 bagi sesi 2027 jika sekolah mahu maklumat kelas yang dipohon. Umur/tarikh lahir dikira daripada MyKid tetapi **jangan anggap** umur menentukan tahun sekolah tanpa pengecualian; jangan ubah data lama.
- [ ] **QA minimum:** pastikan status pending tidak meningkatkan bilangan murid aktif atau kutipan; uji login Admin dan penjaga selepas pembetulan, duplicate MyKid, semakan slip dan approval; jangan tambah ujian/reka bentuk tidak perlu.
- [ ] **Bersihkan data dummy:** selepas pengesahan ujian, padam *hanya* dua rekod ujian dikenal pasti dalam spreadsheet BACKUP dan fail slip dummy dalam folder restricted, bukan data LIVE.
- [ ] **Dokumentasi akhir dan release gate:** semak keselamatan, backup, trigger dan integrasi asal sebelum sebarang cadangan deployment. **Tiada merge/deploy tanpa persetujuan pemilik.**

**Milestone tambahan teramati:** Pemilik berjaya login ke Dashboard Admin V1 melalui GAS QA `/dev`; paparan dashboard, 12 kad bulanan dan menu lama muncul. Ini membuktikan *login/paparan* asas, bukan bahawa semua butang Admin sudah diuji. Dashboard menunjukkan 102 murid kerana dua rekod QA pending; pengiraan murid aktif perlu dibetulkan sebelum release.


## 10. Sambungan 4 Nov 2026 — MyKid auto-format & umur auto-kira (QA candidate)

**Branch:** `feature/native-edaftar-v1-qa`  
**Checkpoint terakhir pakej:** `18004792821a47eb772d67c2cb2ebacd0ace387b` (`index.html`); backend `d0d422be88ddf2c973c460c8928426676a31c8ef` (`NativeEdaftar.gs`).  
**Status:** Kod telah dipush; syntax dan ujian helper berkaitan lulus. **Belum disalin ke GAS BACKUP, belum browser/Google real test, belum release.**

- Format input MyKid kini `YYMMDD-XX-XXXX` dengan auto-hyphen; pengesahan tarikh lahir di browser **dan sekali lagi pada backend**.
- Dropdown umur manual dibuang. UI memaparkan **umur yang akan dicapai pada tahun 2027**; kelayakan biasa dibatasi kepada Tahun 3/4 (kohort tahun lahir 2018/2017; umur 9/10 pada 2027). Kasus luar biasa boleh dirujuk kepada urusetia; tiada override Admin lagi.
- Penulisan di backend hanya **A–E dan G–I**. Kolum **F (UMUR)** adalah formula spill dari F2, **tidak boleh disentuh**. K/L kekal formula spill; V marker pending.
- MyKid baharu disimpan dalam format bertanda sengkang sama seperti data V1; perbandingan MyKid duplikat tetap mengabaikan sengkang.
- QA unit terhad: tarikh lahir valid/tidak valid, penjagaan formula F2, ketiadaan input umur manual. MyKid dummy lama bermula `81` tetap menghasilkan umur negatif di salinan BACKUP sehingga rekod dummy dibersihkan — **jangan ubah data 2026**.
- **Langkah ujian seterusnya:** salin `NativeEdaftar.gs` dan `index.html` terkini ke GAS BACKUP; refresh `/dev?view=edaftar`; masukkan nombor dummy yang mempunyai tarikh lahir 2017/2018, lihat format/umur dan validasi. Untuk ujian penghantaran, gunakan OTP dan slip rekaan dan semak F2 tidak pecah; lakukan hanya jika diperlukan. Pastikan `Code.gs` kekal menunjuk ID BACKUP (jika ditampal semula). Jangan sentuh GAS LIVE.
