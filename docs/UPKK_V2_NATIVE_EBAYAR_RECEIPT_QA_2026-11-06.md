# UPKK V2 — Native eBayar Monthly Receipt: QA Checkpoint (6 November 2026)

**Repository:** `shafielegacy/UPKK`  
**Branch:** `feature/v2-admin-settings-minimal-qa`  
**Environment:** GAS BACKUP + spreadsheet `BACKUP UPKK V1 - 03 NOV 2026` only  
**Result:** **QA PASS** for controlled manual AutoCrat merge and guardian-initiated lazy PDF reconciliation. **NOT RELEASE-READY / NOT LIVE.**

## Purpose and agreed workflow

Keep the established parent flow: select owned child → monthly card → month popup → check/download digital receipt. Do not introduce a multi-child/month payment wizard.

1. Parent submits a Native eBayar payment and proof.
2. Admin verifies the transfer and clicks **SAHKAN** once.
3. Backend assigns a unique monthly receipt serial and sets the row to `SELESAI` / `RESERVED`.
4. AutoCrat `UPKK V2 - RESIT BULANAN QA` generates the PDF and emails the guardian. **QA tested with a single manually initiated run; hourly trigger is OFF and unverified.**
5. When the authenticated guardian checks that child's monthly receipt, `getNativeMonthlyReceipt` reconciles an existing valid private AutoCrat output and changes `RECEIPT_STATE` from `RESERVED` to `READY` without admin Sync.

## Verified end-to-end test (6 November 2026)

- Native transaction: `UPKK-M-2026-0004`, December 2026, RM50, child `MURID QA AUTO RESIT`; **dummy test payment, not actual funds received**.
- Admin SAHKAN produced the serial and `RESERVED` state. Status preflight returned `READY_FOR_CONTROLLED_MANUAL_MERGE`.
- Owner explicitly approved sending the test email to their QA address; AutoCrat job ran **once manually** with trigger OFF.
- Spreadsheet `NATIVE_EBAYAR` row 5, V:Y: AutoCrat document ID, document URL, expected filename `RESIT_UPKK_V2_UPKK-M-2026-0004`, and output log containing `Document successfully merged; PDF created; Emails Sent`. Email send is **log-confirmed**, not independent mailbox-delivery proof.
- Parent test child was registered as an **approved dummy** in BACKUP tab `DAFTAR UPKK`, row 109; guardian logged in again to refresh session ownership. No change to the original payment transaction's child ID was needed.
- Parent Dashboard → child `MURID QA AUTO RESIT` → **Dis 2026** → **Semak Resit Bulanan** returned `UPKK-M-2026-0004` and a working PDF link. PDF contents showed correct serial, child, amount RM50 and month.
- Re-read of `NATIVE_EBAYAR!L5:Y5` confirmed `SELESAI`, serial `0004`, Q5 populated with the AutoCrat PDF Drive link, R5 **`READY`**, T5 **`Auto-sync on authenticated guardian receipt lookup (QA)`**, and U5 **`0`**.
- Admin **Sync PDF AutoCrat** was **not** clicked; no extra merge was run during guardian retrieval.

**Result:** Controlled admin approval → unique serial → manual AutoCrat PDF/email log → authenticated guardian lookup → lazy reconciliation → PDF open **PASS** in BACKUP.

## Regression observations

- Earlier `UPKK-M-2026-0002` remained accessible from its owned child's December 2026 card and PDF. This validates existing `READY` retrieval, **not** the newly implemented lazy sync.
- Year 2027's twelve monthly cards showed `BELUM DIBUKA` on 6 November 2026. Future-year UI lock passed visual QA.
- Dummy registration row 109 inherits spreadsheet-derived values in the pre-existing registration area; do not use registration status/formula output as evidence of real payment. Never treat QA transactions or dummy slip links as real money.

## Code points

- `NativeEbayar.gs`: admin approval, receipt allocation, locking, `RESERVED` state.
- `NativeMonthlyReceiptV2.gs`: authenticated `getNativeMonthlyReceipt` and `neSyncOwnMonthlyPdfQa_` (guardian-owned, receipt serial/AutoCrat output validation, Drive PRIVATE verification, `READY` update; no PDF generation, emailing, or new trigger).
- `index.html`: parent year switch/month popup and `fetchNativeMonthlyReceiptUI`.
- AutoCrat job: `UPKK V2 - RESIT BULANAN QA`.

## Not yet verified / release blockers

1. **Hourly AutoCrat trigger:** not yet activated or observed in QA; remains OFF. Do not turn on as part of this checkpoint.
2. **Email duplicate prevention:** interrupted/repeated AutoCrat runs have not been demonstrated safe; the successful manual run does not prove exactly-once delivery.
3. **Drive recipient permissions:** private-PDF validation passed for the tester, but access by an unrelated real guardian and sharing policy still need independent pre-release testing.
4. **Production hardening:** review anonymous/legacy endpoints, authentication and admin security; remove or adapt QA-only guards carefully for production, with rollback and backups.
5. **Payment rules:** school/founder must resolve December 2026 versus 2027 first-month credit to prevent double charging.
6. **Automation timing:** when AutoCrat finishes, the row can remain `RESERVED` until the parent next checks their receipt; the QA implementation is **lazy reconciliation**, not a background PDF sync.
7. **End-to-end live deployment and real-payment reconciliation:** not tested and not authorised.

## Safety lock and next checkpoint

- **Do not merge into `main`, deploy GAS, edit LIVE spreadsheets, run legacy AutoCrat, enable any trigger, or treat dummy QA rows as production payments.**
- Preserve the successful `0004` BACKUP test as evidence. Avoid re-running AutoCrat for it.
- Next phase: separately assess duplicate-email safety and controlled hourly-trigger behaviour on BACKUP, then confirm school fee policy and security/release checklist before considering LIVE approval.

_Last verified: 6 November 2026, Asia/Kuala_Lumpur. Evidence: owner screenshots plus direct BACKUP Google Sheets reads._
