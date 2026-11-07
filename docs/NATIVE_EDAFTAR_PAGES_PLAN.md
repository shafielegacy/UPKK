# Native eDaftar Pages — pelan pelaksanaan (7 Nov 2026)

Skop diluluskan: borang V2 pada GitHub Pages, HTTPS POST sahaja; guna NativeEdaftar.gs + AdminV2.gs sedia ada. V65, data 2026 dan eBayar bulanan tidak diubah.

1. Uji adapter: default OFF, allowlist e-mel ujian wajib, lima tindakan sahaja, tiada JSONP/GET, error tanpa payload.
2. Ekstrak borang dan validasi V2 ke edaftar.html + edaftar.js; ganti google.script.run dengan fetch POST text/plain, credentials omit, tiada retry automatik. Endpoint kosong dan enabled=false.
3. Index master hanya tukar pautan eDaftar ke halaman setempat. Code.gs hanya tambah route POST khusus; helper berasingan untuk dipasang pada V2, jangan salin Code.gs V1 ke V2.
4. Uji kadar dengan fungsi quote AdminV2 sebenar dan kuota/MyKid NativeEdaftar sebenar dalam VM tanpa Google API. Browser sebenar untuk paparan, input, fail dan kawalan OFF.
5. Catat hasil PASS/FAIL/BLOCKED, simpan pada branch calon, sahkan master tidak bergerak. Tiada merge/deploy/aktivasi awam.

Risiko: CORS dan redirects GAS, deployment belum menyokong route, tiada laluan Google ujian disahkan, cache lama, acknowledgement hilang selepas write. Submit tanpa acknowledgement dikunci untuk semakan urusetia; jangan cuba ulang.
