# UPKK V2 — Part 8B Monthly Receipt Ledger QA

**Date:** 5 November 2026  
**Branch:** `feature/native-ebayar-12bulan-qa`  
**Policy:** RM50/RM100 registration and first-month allocation remain **HOLD** pending Ustaz.  
**Status:** Implementation candidate and fake-GAS harness QA **PASS**; real Apps Script/AutoCrat **NOT VERIFIED**. **NO-GO LIVE.**

## Files
- `MonthlyReceiptV2.gs` — guarded QA-only manual ledger management and PDF reconciliation; **no trigger, no PDF generation, no email**.
- `tests/monthly-receipt-ledger-qa.test.js` — deterministic fake-GAS test suite; Node command: `node tests/monthly-receipt-ledger-qa.test.js`.
- Existing `NativeEbayar.gs` and `AdminV2.gs` were **not modified**.
- No new workbook and no twelve new month tabs. Existing single `NATIVE_EBAYAR` schema A:Q stays intact; optional metadata append R:U only with an explicit Admin QA setup.

## Contract and storage

- Column M: `NO_RESIT` (existing, now reserved for monthly serial); column Q: `MERGED_PDF_URL` (existing).
- New optional columns R:U: `RECEIPT_STATE`, `RECEIPT_UPDATED_AT`, `RECEIPT_NOTE`, `RECEIPT_ATTEMPT`.
- Each reservation is tied to one settled `REQUEST_ID` and the child/month/year tuple; the allocator scans all existing serials before issuing `UPKK-M-YYYY-NNNN`, under `LockService`.
- If M has a serial but R is missing or invalid (partial write), allocation **fails closed** until manual reconciliation; no new serial is assigned.
- States: `RESERVED` → `MERGING` → `READY`; `MERGING` can become `UNCERTAIN` and later `READY` after a verified existing PDF. No automatic re-merge from `MERGING`, `UNCERTAIN`, or `READY`.
- `reconcileMonthlyReceiptPdfQa` requires authenticated Admin, a Google Drive file/d URL and a reachable PDF through the executing account. **It does not prove that the file belongs to an authorised private folder, that a merge email was not already sent, or that the file corresponds to the correct child.** These require further integration controls before LIVE.
- The current functions are QA operational helpers and are **not wired into the browser UI**. Existing parent receipt retrieval is unchanged.

## Results

**23 PASS / 0 FAIL** against committed source + committed test cases, evaluated in a JavaScript isolate using fake Sheet ranges, LockService, auth and Drive. In addition, the preceding 15-case preliminary matrix passed. No real Google runtime invoked. These numbers are **not** end-to-end pass counts.

Covered: Admin denial, metadata setup and repeated setup, settle-state preconditions, serial allocation and idempotency, repeat merge denial, invalid URL/MIME, transition to READY, uncertain merge reconciliation, duplicate settled month and duplicate serial fail-closed.

## Remaining critical release blockers

1. Real GAS BACKUP copy, native /dev Admin manual flow, owner signoff and Drive file permission checks.
2. Separate monthly AutoCrat template/job: mapping, merge conditions, output column Q, merge state reconciliation, email dedup and private folder enforcement; currently **NOT IMPLEMENTED**.
3. Crash/recovery tests including partial M/R writes, state MERGING without PDF, external merge succeeded before GAS response, concurrent operators and duplicate emails.
4. Parent-owned authenticated monthly PDF retrieval (child/year/month) with authorization and non-public access; not yet implemented.
5. Registration first-month credit and payment policy; must prevent charging/issuing a separate monthly receipt for funds already recorded on registration.
6. Production configuration, rate limiting/security, official-sheet column audit, backup, rollout, rollback and manual AutoCrat trigger test remain NO-GO gates.

## Safety note

All receipt write functions call existing Admin V2 QA authorisation and Native eBayar BACKUP guard. Do **not** copy this module into LIVE as a workaround. Do not configure AutoCrat to automatically scan all SELESAI rows. No GAS, Google Sheets, Drive or AutoCrat changes performed in this phase.
