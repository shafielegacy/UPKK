# UPKK V2 — Part 8C Monthly AutoCrat Integration Preflight QA
**Prepared:** 5 November 2026  
**Repository:** `shafielegacy/UPKK`  
**Branch:** `feature/native-ebayar-12bulan-qa`  
**Baseline:** `18d7215ec5497df2853ebab5a5f924b5525e7512`  
**Scope:** preflight + runbook only, no AutoCrat job creation or actual Google execution.  
**Release:** **NO-GO**. No authorisation for LIVE, triggers or emails.

## What is implemented

- `MonthlyAutoCratV2.gs`: `previewMonthlyAutoCratQa(adminToken,requestId)` is a read-only, single-transaction admission gate, requiring existing Admin authentication and Native eBayar BACKUP guards from Part 8B.
- Reads existing `NATIVE_EBAYAR` A:U and checks receipt metadata R:U; no new Sheets workbook/tab.
- Enforces exactly one `REQUEST_ID`, `SELESAI` payment, unique settled child/month/year, globally unique properly formatted monthly receipt serial and year match.
- Returns **eligible only for RESERVED**, with no recorded PDF and zero previous merge attempts; `MERGING` and `UNCERTAIN` require reconciliation; `READY` cannot be merged again.
- Preview returns receipt number, month/year, amount and request ID, **not** guardian email, MyKid, slip URL or child name. It does not enable real delivery and does not return a PDF.
- Existing `MonthlyReceiptV2.gs` remains unchanged; it provides guarded serial reservation and manual reconciliation only.

## Actual test result

**19 PASS / 0 FAIL** evaluating the committed preflight file and committed test cases in an isolated JS mock runtime (no Google API). The earlier Part 8B 23 mock tests are a separate suite. Test command for a local checkout: `node tests/monthly-autocrat-preflight-qa.test.js`.

Test coverage: eligible RESERVED, delivery disabled, no child PII in preview, non-admin rejection, malformed ID, MERGING, UNCERTAIN, READY with PDF, READY missing PDF, missing serial, wrong serial year, unexpected attempt, previously recorded PDF, duplicate serial globally, duplicate settled child/month/year and recovered clean state.

## Controlled monthly AutoCrat design — NOT YET INSTALLED

1. **Separate monthly job** and separate template from the registration/V1 jobs. Do not change legacy registration or old monthly receipt jobs.
2. Data source is the same `NATIVE_EBAYAR` tab, never a new production workbook. Any AutoCrat run must isolate **exactly one approved reserved transaction** before execution; a broad scan of all `SELESAI` rows is prohibited.
3. Preflight by authenticated Admin and immutable `REQUEST_ID`; verify payment settlement, linked child/month/year, serial, and amount. Operator records `MERGING` before any external merge starts.
4. Any PDF/email side effect can be ambiguous if Apps Script or AutoCrat crashes. On uncertain result, do **not** automatically rerun the job. First inspect AutoCrat logs, output folder, email delivery and the unique receipt serial.
5. Verify destination folder is private, exported PDF matches transaction metadata, and no other guardian can view the file; the current Part 8B manual reconciliation checks PDF MIME but **does not yet check folder membership, file contents or ownership**.
6. Only after verification, manually reconcile one existing PDF into column Q and `READY` state. The `RECEIPT_ATTEMPT` counter must not reset.
7. AutoCrat output field mapping/merge status/email routing must be inspected in the actual add-on UI at BACKUP; it is **NOT VERIFIED** and must never be guessed or enabled by this document.

### Mapping proposal (not a validated AutoCrat configuration)

| Meaning | NATIVE_EBAYAR column | Rule |
|---|---|---|
| Request ID | A — REQUEST_ID | unique transaction key |
| Guardian email | C — GUARDIAN_EMAIL | private, never written to public logs |
| Child name | E — CHILD_NAME | template tag, must verify actual privacy |
| Billing month / year | F / G — BULAN / TAHUN | stable year-month scope |
| Amount | J — JUMLAH_RM | only approved amount |
| Payment status | L — STATUS | must be SELESAI |
| Monthly receipt number | M — NO_RESIT | immutable |
| PDF URL | Q — MERGED_PDF_URL | write after verified PDF |
| Receipt state | R — RECEIPT_STATE | RESERVED → MERGING → READY, or UNCERTAIN |
| Attempt number | U — RECEIPT_ATTEMPT | never reset after attempted merge |

### GO / NO-GO for first BACKUP AutoCrat smoke test

- Need explicit operator approval for copied GAS/Sheets BACKUP only, and separate test recipient email controls. Never send to actual guardian contacts while testing.
- Verify output template, trigger settings, exact-row eligibility, no double-email condition, private folder, Autocrat account access and failure audit.
- If any of those is unknown: **NO-GO**.
- For first smoke test, one synthetic approved monthly transaction, one reserved serial, one private dummy recipient, manual merge only; rerun should cause **zero** additional PDFs or emails.
- Verify Admin and distinct guardian accounts cannot download each other's slips or monthly PDFs.

## Remaining blockers

Actual AutoCrat integration, PDF generation, private access controls, email dedup, one-row manual merge, time-trigger behaviour, authenticated parent monthly receipt retrieval, real GAS /dev and Google Drive checks are **NOT IMPLEMENTED / NOT VERIFIED**. No result here demonstrates actual AutoCrat correctness.

Founder policy RM100 vs RM50 split and crediting the first class month is still HOLD. Do not treat November registration date as a paid November class month; do not issue a second monthly receipt for funds covered in registration.

**Safety:** QA branch files only. No master, LIVE GAS, official Sheets, actual AutoCrat jobs, new workbook, triggers, emails, PR, merge or deploy.
