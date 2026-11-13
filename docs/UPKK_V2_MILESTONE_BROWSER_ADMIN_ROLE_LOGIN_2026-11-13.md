# UPKK SL V2.0 — Milestone Browser Admin & Role-Based Login Decision
**Tarikh:** 13 November 2026 (MYT)
**Status:** QA checkpoint, bukan public release GO

## Owner-verified milestone
- Git clone QA berjaya pada `C:\Users\burnk\Downloads\UPKK_V2_UNIFIED_DASHBOARD_QA`.
- Local Node static preflight: **18 PASS / 0 FAIL** (output pengguna).
- GitHub Actions run [43357153901](https://github.com/shafielegacy/UPKK/actions/runs/43357153901): completed **SUCCESS**, including both Native JS syntax checks and static assertions.
- Localhost `http://localhost:8765/`: portal login dua tab, logo rasmi dan Admin OTP form dipaparkan.
- Pada percubaan awal OTP, mesej sambungan gagal dan kemudian rate limit; percubaan seterusnya **berjaya**: pengguna sahkan e-mel OTP diterima.
- Pengguna mengesahkan OTP melalui browser dan dashboard Admin Native 2027 dipaparkan pada `#page-admin` dengan sidebar hijau/emas, logo, navigasi, carian dan empat kad.
- Bacaan backend dalam screenshot: 3 permohonan QA, 0 pending, 3 approved, RM200 jumlah **rekod QA**, bukan kutipan rasmi.
- Paparan Admin Legacy 2026 boleh dicapai daripada **borang login utama yang sama dengan Parent**, dengan pengenalpastian peranan. Screenshot pengguna mengesahkan UX tersebut dan menetapkannya sebagai rujukan reka bentuk V2.
- **Belum verified:** klik logout Native, akses selepas logout, Parent V4 OTP, cross-user isolation, mobile layout, transaksi/resit sebenar, public eDaftar.

## Owner-approved login architecture clarification (LOCK)
**Satu portal + satu borang Log Masuk sebagai pintu masuk pengguna.** Selepas pengenalpastian/autorisation peranan, arahkan ke dashboard Parent atau Admin dalam shell UI yang sama, dengan selector sesi 2026/2027. Jangan paparkan login Admin V2 sebagai portal/page lain untuk public release. Jangan bina dashboard kedua.

**Security caveat:** pengenalpastian role pada Legacy 2026 tidak secara automatik memberi hak Native 2027. Native Admin 2027 mesti kekal menggunakan OTP/token server yang sah; UI boleh membenarkan *step-up OTP dalam halaman sama* selepas pengguna dikenal pasti Admin, bukan melangkau pengesahan Native. Parent 2027 juga perlu Native verification sebelum dedahkan data. Ini ialah keputusan UX/architecture, **belum siap implementation**; frontend QA kini masih memaparkan butang 'Log Masuk Admin' sebagai pilihan OTP.

## Safety/next gate
- Native GAS V4 deployed CLOSED; pinned @1/@2/@3/@4 kekal.
- Parent frontend `enabled:false`, public eDaftar `enabled:false`; tidak diaktifkan.
- Legacy V65, production Pages, Sheets, Forms dan AutoCrat tidak diubah.
- Next: audit role detection + implement *single-login entry with role-aware step-up Native OTP* on isolated QA branch; verify browser OTP/logout without creating dummy records or bypassing security, then review before release.
- **NO-GO** until these runtime and safety checks pass.


## Follow-up implementation — Legacy Admin → Native OTP, 13 Nov 2026
- QA frontend `admin-2027.js` now adds **Sesi 2027 · Sahkan OTP** in the authenticated Legacy Admin dashboard navigation (`#page-admin .adm-tab-bar`). The handler checks `S.user.role==='admin'`; it moves to the **same** login page and shows Native Admin OTP step-up, optionally prefilling the Legacy admin email. It does **not** reuse Legacy authorisation for Native data.
- The transitional standalone `Log Masuk Admin` button is hidden in QA. This prioritises the single-login architecture; Admin without Legacy credentials must be handled by authorised account provisioning before release.
- Existing Native backend OTP and token verification stay unchanged. Parent Auth and eDaftar remain OFF.
- Added a role-aware step-up assertion to the QA static test suite (now 19 assertions). CI outcome must be checked after changes; earlier 18 PASS is not automatically proof of this new flow.
- This is **implementation in isolated QA branch, not deployed Pages**. No change to GAS, spreadsheet, Legacy login code, official data, triggers or public flags.
- **Still required:** owner browser check Legacy Admin main login → Sesi 2027 OTP → Native dashboard → Logout; critical Parent/public registration acceptance criteria and owner GO before Pages merge.


## Navigation correction — session selector (owner decision, 13 Nov 2026)

- Owner rejected the misleading sidebar entry **"Sesi 2026 — Log Masuk"**. It is removed from both Native Admin and Native Parent sidebars in QA.
- Instead, Native Admin and Parent dashboards expose **Sesi 2027 / Sesi 2026** via accessible dropdowns in their main header.
- Legacy Admin dashboard exposes a dropdown (default Sesi 2026; choose 2027 to initiate role-checked Native OTP step-up in the same portal). No new login page.
- Selecting 2026 from a Native dashboard **does not grant access**: it closes the Native token and returns to the existing Legacy login surface. Legacy verification remains mandatory, since no server-approved cross-session token conversion exists.
- Logout stays a dedicated separate action. Legacy/Native backends, business logic, financial data and public flags untouched.
- QA only, not published to Pages. Browser checks for selection, OTP, role permissions and logout remain necessary. Static suite updated to assert both selectors; CI result recorded separately after completion.

**Architecture status:** LOCK remains one portal, one main login surface, role-specific dashboards and two academic sessions. No claim of invisible SSO or full unified authorisation.
