# UPKK V2 — Part 8D Guardian Monthly Receipt Integration QA

**Date:** 5 November 2026  
**Repository:** `shafielegacy/UPKK`  
**Branch:** `feature/native-ebayar-12bulan-qa`  
**Baseline:** `4adbed92efc7b5827eca22a2fdde605ddb41c31f`  
**Status:** QA branch implementation + isolated mock PASS. Actual Google/Drive/browser QA **NOT VERIFIED**. **NO-GO LIVE**.

## Changes

1. **New `NativeMonthlyReceiptV2.gs`** — `getNativeMonthlyReceipt(token,mykid,month,year)`. Checks a server-side guardian session, revalidates the child against the approved registration, matches guardian email and MyKid to a unique monthly payment row for the specified month/year; only `SELESAI` + ledger `READY` + valid yearly serial + PDF link can return a receipt. Allows historical retrieval without opening future monthly payment. Does NOT change Drive permissions.
2. **`Code.gs`** — removed monthly `MERGED_PDF_URL` from both V2 2027 dashboard data and 2026 native overlay. The dashboard can still present payment status; private native PDF links must be obtained via authenticated `google.script.run`. Existing V1 historical payment behavior is otherwise not rewritten.
3. **`index.html`** — Native V2 paid month card now displays **Semak Resit Bulanan** instead of opening an unverified dashboard PDF link. The existing Resit Digital modal uses the selected child and year, calls the same protected endpoint for native months, and presents the resulting link only after validation. V1 historical receipts keep their previous flow. Native links are hidden until the response arrives.
4. **`tests/native-monthly-receipt-access-qa.test.js`** — 19 deterministic mock tests. No new workbook or tab, and no AutoCrat trigger/job/email.

## Test evidence

**19 PASS / 0 FAIL** from committed `NativeMonthlyReceiptV2.gs` and committed test cases executed in isolated JS fake-GAS runtime.

Covered: owner access, no guardian email/MyKid in response, invalid token, different child, missing month, invalid year/month, PENDING, RESERVED, MERGING, UNCERTAIN, READY missing URL, invalid domain URL, public PDF rejected, non-PDF, deleted PDF, globally duplicate receipt serial, duplicate settled child/month/year, and recovery after mock anomalies.

JS parser checks: `Code.gs`, `NativeMonthlyReceiptV2.gs`, and both inline JS blocks in `index.html`: **PASS**. No real browser interaction or GAS call was performed.

## Security findings / release blockers

- Returning a private Google Drive PDF link **does not grant access to a guardian**. Although the endpoint rejects non-private general sharing, the real guardian's per-file access remains **NOT VERIFIED** with distinct accounts. Do not set `ANYONE_WITH_LINK` as a workaround.
- The pre-existing V1 `getDashboard`/`getResit` email-based JSONP access and V2 payment-status visibility in legacy dashboard warrant a separate auth/privacy audit; removal of native PDF links is **not** full endpoint hardening. **NO GO** if cross-parent records can be exposed.
- The current receipt endpoint uses the MyKid as a server-side matching key, which is already present in the native workflow. No MyKid is included in returned response; it must not be logged or put in URL query strings.
- Actual PDF association with correct child/month/receipt serial and private Drive folder membership are **NOT VERIFIED**. Current ledger reconciliation merely validates URL and PDF MIME; follow-on validation is necessary before producing actual receipts.
- Legacy 2026 receipts remain unchanged. Registration-credit policy RM50/RM100, potential double-charge and December 2026 opening remain **HOLD** pending Ustaz.
- AutoCrat monthly template, job mapping, no-duplicate merge/email, real GAS/Drive/Sheets tests, quota boundaries and rollback are outstanding.

## First authorised QA BACKUP verification (future, not executed)

1. Copy reviewed new `NativeMonthlyReceiptV2.gs` plus updated `Code.gs` and `index.html` into copied GAS BACKUP **only after explicit operator authorisation**. Retain existing QA guard and Script Properties.
2. Use two synthetic guardians with different approved children, plus a separate Admin. Check wrong-child requests, expired token, pending and ready receipts.
3. Verify the PDF is a private file in the approved output folder with correct recipient permissions. No public Drive sharing.
4. Use a synthetic READY ledger record only when its existing test PDF genuinely matches the transaction; never mark READY to make the UI look complete.
5. Test mobile/desktop card/month modal, year switch, sibling switch, asynchronous response after child switch and rejected registrations; capture redacted QA evidence.
6. Re-run AutoCrat separate smoke-test gates and security checklist. Do not enable triggers.

**Safety lock:** no `master` edits, merge, PR, deploy, LIVE GAS, official Sheets, Google Form, AutoCrat, triggers or email changes in Part 8D.
