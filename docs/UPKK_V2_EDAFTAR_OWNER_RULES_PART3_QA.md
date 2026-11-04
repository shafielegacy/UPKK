# UPKK V2 — eDaftar Pakej Baharu: Part 3 QA (4 Nov 2026)

**Branch:** `feature/native-ebayar-12bulan-qa` · **Scope:** code QA only, no LIVE writes or deploy. Pautan dasar: `UPKK_V2_OWNER_DECISIONS_2026-11-04.md`.

## Implemented in QA code
- **RM50 registration + RM50 first month = RM100**, validated **both frontend availability and backend submit** against Admin Script Property `UPKK_V2_FEES_2027`. Old RM90 QA rows remain unchanged. Admin must update fee values manually before any new testing.
- Year 3 (9), Year 4 (10), **Year 5 (11)** by MyKid DOB for session 2027. Class year derives from validated MyKid; not user-editable.
- Mandatory **FIZIKAL / ONLINE** choice. Server stores `Tahun`, `Mod`, `Jenis Daftar` in existing `DAFTAR UPKK` tab: **AE `V2_TAHUN_KELAS`**, **AF `V2_MOD_KELAS`**, **AG `V2_JENIS_DAFTAR`**. AC = TAHUN and AD = V2_NO_RESIT are preserved.
- Admin-only `prepareNativeEdaftarIntakeQa` via `Tetapan Yuran → Sediakan Kolum Pengambilan QA`: explicit action to set up AE:AG. Does not create a workbook or a tab. Refuses conflicting headers.
- For a MyKid with only **historical V1 row(s)** (V marker blank), accept new enrolment; mark `DAFTAR SEMULA`. If there is already `PENDING 2027` or `APPROVED 2027`, block duplicate; if `REJECTED 2027`, require urusetia intervention. MyKid unseen before = `BAHARU`.
- Quota **per class year and mode**: maximum 30 Fizikal, 20 Online. `PENDING` and `APPROVED` both occupy seats, `REJECTED` does not. Quota check and new application run inside existing `LockService` lock.
- Public ordinary intake closes at **31 Dec 2026 (Malaysia date)**. Admin exception after closing **not implemented**; deliberate fail-closed.
- Parent login returns one selected child per MyKid, preferring approved new intake when both legacy V1 and V2 records exist. No historical row deletion.
- Preserve F2 UMUR, K1 NO RESIT, L1 STATUS array formulas and old receipt serials.

## Important unresolved business rule
Ustaz has NOT YET confirmed which month receives the RM50 first-month component for a December 2026 registration: **Dec 2026 or Jan 2027**. Code **does not automatically mark either month SELESAI** based on this component. Do not implement until response arrives.

## Rollout / QA plan (GAS BACKUP ONLY)
1. In **BACKUP Admin → Tetapan Yuran**, change registration fee to **RM50** and first-month fee to **RM50**; save. Confirm total **RM100**. This modifies QA Script Properties only.
2. Copy branch QA files **`Code.gs`, `index.html`, `NativeEdaftar.gs`** to GAS BACKUP. `AdminV2.gs` remains necessary for admin access. Verify `SPREADSHEET_ID` is the **BACKUP workbook** after copying.
3. Open copied GAS `/dev`, log in Admin, click **Tetapan Yuran → Sediakan Kolum Pengambilan QA** *once*. Verify AE:AG headers in BACKUP `DAFTAR UPKK`; do not change AC:AD.
4. Log out. Refresh `/dev?view=edaftar`. Verify Year 3/4/5 (DOB 2018/2017/2016), mode selection and displayed RM100.
5. Use synthetic data only and verify: new pupil, re-registration of historical MyKid, second active duplicate blocked, quota limits independently (Fizikal 30, Online 20), incorrect year, wrong proof MIME, stale fee quote, and 1 Jan 2027 deadline.
6. Ensure application appears PENDING in column V, age F formula intact, K/L formulas intact and W:Y snapshot is RM50/RM50/RM100, AE/AF/AG populated correctly.
7. Verify parent login re-registration has **only one child entry per MyKid**. Dashboard year logic and first-month credit require separate testing after Ustaz decision.
8. AutoCrat triggers remain OFF; only synthetic PDF merges if explicitly needed.

## Static QA
- Syntax `NativeEdaftar.gs`, `Code.gs`, `index.html` inline scripts: **PASS**.
- Mock MyKid 2018→9, 2017→10, 2016→11; age 12 outside accepted range: **PASS**.
- Mock quota count: 2 pending/approved of same class/mod, rejected and other class excluded: **PASS**.
- Structural review: fixed K/L/F arrays, explicit Admin setup, dedup login: **PASS (code review)**.
- **NOT VERIFIED:** Full GAS /dev submit, quota race in Google Sheets, new-parent/login behaviour after duplicate V1 record, real PDF merge for new amount, date rollover in GAS.

## Historical QA data caveat
The previously approved synthetic rows 102, 103 and 106 were created **before** AE:AG existed, so they have no class/mod assignment. The quota helper does not count unclassified old QA rows. **Do not use this QA workbook to claim fully reconciled operational class capacity** until old synthetic cases are cleared or classified as test records. Never do such reconciliation on LIVE without a specific migration plan.

## Safety
No LIVE spreadsheet changes, no V1 migration, no merge, no deployment, no AutoCrat trigger activation. All owner decisions in `UPKK_V2_OWNER_DECISIONS_2026-11-04.md`.


## Owner real BACKUP QA update — 4 November 2026 (latest evidence)

The historical `NOT VERIFIED` items above describe the state **before** owner testing. These observations supersede those individual items **only to the extent stated**:

- **PASS, targeted manual test:** one student with a historical **V1** row **102** was re-enrolled into a separate **V2** row **106** using the **same MyKid**. Neither record was replaced or deleted. This demonstrates the new duplicate rules allow historical V1 + new V2.
- **PASS, live BACKUP Sheets verification:** after Native eDaftar submission, row 106 was `PENDING 2027` with frozen fee snapshot **RM50 registration + RM50 first month = RM100**; AE/AF/AG held **5 / FIZIKAL / DAFTAR SEMULA**. This is an actual QA registration, not merely a mock.
- **PASS, Admin approval screenshot plus read-only Sheets verification:** row 106 changed to `APPROVED 2027`, derived L `SELESAI`, confirmed J **RM100.00**, K and AD both **UPKK-2026-0004**, and Admin approval audit fields were populated. The year **2026** in the serial is the registration calendar year, not the academic-session year.
- **PASS, screenshot observation:** after parent login, the same child appeared **once** and dashboard used the **4 Nov 2026** V2 registration record. 2026 history still showed Jan–Oct **N/A**, Nov **BELUM**, Dec **BELUM DIBUKA**. This confirms the owner-observed display, not an exhaustive cross-user login/security audit.
- **EXPECTED, screenshot observation:** monthly **Resit Digital** showed no November monthly payment record. **The confirmed RM100 was a registration payment**, not a verified stand-alone November monthly payment; do not treat that popup as a defect.
- **PASS, earlier targeted test:** the duplicate-warning path rejected an already active V2 MyKid. The ordinary Year 3–5 validation also showed age 12 is ineligible for automatic intake; the explanatory class-year field was improved in QA code.

### Still NOT VERIFIED / open

- Real quota boundary and concurrent registrations at **30 FIZIKAL / 20 ONLINE** per year; test both without changing real historical pupil data.
- Real onboarding after public deadline, exceptional admission flow, and full security/permission review.
- Monthly eBayar PENDING submission, Admin monthly approval, monthly receipt and AutoCrat end-to-end.
- New registration PDF merge for the **RM100** row and safe output-link / no-duplicate behaviour. Existing earlier PDF proof at RM90 is not proof for this new amount.
- **Do NOT auto-credit the RM50 first-month component** to either Dec 2026 or Jan 2027. Ustaz Shafie's follow-up answer is outstanding.

### Pause checkpoint

Owner has elected to **hold further QA/development** and rest pending Ustaz's answer. No additional GAS, Sheets or LIVE changes are part of this documentation update.
