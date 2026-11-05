# UPKK V2 — Part 8A Native eBayar Admin Approval (QA)

**Status:** implementation candidate in GitHub QA branch; **NOT YET runtime tested in GAS BACKUP**. No LIVE deployment authorised.

## Scope and preserved constraints
- **Repository:** `shafielegacy/UPKK`, branch `feature/native-ebayar-12bulan-qa`.
- **Data:** existing `NATIVE_EBAYAR` tab in the same QA BACKUP workbook, existing 17 columns A:Q unchanged.
- **Authentication:** existing `loginAdminV2` and `upkkAdminV2Auth_` token; no public JSONP routes and no new admin identity store.
- **Parent flow:** 12 months, existing modal, OTP/eDaftar and 2026 historical tabs untouched.
- **HOLD:** First-month RM50 credit and Dec 2026 billing stay unassigned until Ustaz Shafie replies.
- **No AutoCrat trigger or monthly receipt generation** in Part 8A; separate Part 8B.

## Implemented in QA code

### Backend — `NativeEbayar.gs`
- `listNativeEbayarAdmin(token)`: an authenticated admin reads up to 200 most recent monthly applications, with amount, date, method, status, private slip URL, reference and decision audit. No MyKid or parent email returned to the browser for this admin list.
- `decideNativeEbayarAdmin(token, requestId, decision, amount, reason)`: authenticated admin action only, on the BACKUP workbook only.
- Uses existing `LockService.getScriptLock()` and re-reads the transaction under lock. **Exactly one REQUEST_ID** must match and the current status must be `PENDING`; duplicate/stale decisions are denied.
- **APPROVE**: Admin re-enters the verified amount; exact match to stored monthly amount is required. A second already-`SELESAI` transaction for the same MyKid/month/year is rejected. Status becomes `SELESAI` only after checks.
- **REJECT**: requires a 5–250 character reason. Status becomes `REJECTED`, allowing the existing parent submission logic to accept a corrected new payment later.
- Both outcomes store authenticated Admin email and decision timestamp in existing N/O audit columns; rejection reason in P. `NO_RESIT` (M) and `MERGED_PDF_URL` (Q) are **not changed**. Existing `APPROVED_BY`/`APPROVED_AT` headers N/O serve as decision actor/time for both outcomes in QA; consider renaming on a controlled migration only if necessary.
- A `SELESAI` payment has **verified approval** but **monthly AutoCrat PDF pending**; do not claim receipt creation.

### Admin UI — `index.html`
- Adds a **Bayaran Bulanan Native eBayar — QA** section under existing **Admin → Permohonan**.
- Displays records with month, year, amount, payment method, date, reference and link to slip. Shows **Sahkan/Tolak** only for PENDING.
- Confirmation prompt and verified amount on approval; mandatory reason for rejection; refreshes list after success.
- No changes to parent billing screens or registration PDF access.

## Static verification
- JS parser passed for updated `NativeEbayar.gs` and both existing inline scripts in `index.html`.
- Function signatures match existing `adminV2Run` token-injection adapter.
- Column indices checked against A:Q (L status, M receipt, N actor, O timestamp, P reason, Q PDF).
- **NOT VERIFIED:** Apps Script runtime, actual PENDING transactions, real admin approve/reject, stale retries, quote/child ownership integration, PDF or AutoCrat, browser QA.

## Owner handoff to GAS BACKUP (no LIVE)
1. Copy **only** `NativeEbayar.gs` and `index.html` from the QA branch into copied **GAS BACKUP**, Save. Do not change `Code.gs` or the BACKUP `SPREADSHEET_ID`.
2. Login to copied `/dev` as Admin; open **Permohonan** and observe the new **Bayaran Bulanan** section. Existing `NATIVE_EBAYAR` tab may be empty: that is expected.
3. For an actual PENDING QA test, use one approved **synthetic** parent and a billing month legally open under MYT, with private dummy proof; note **Dec 2026 currently blocked pending Ustaz** and **future 2027 months cannot be submitted yet**. **Do not bypass time/policy checks merely to fabricate test success.**
4. Once a legitimate synthetic PENDING exists: verify approval requires matching amount; rejection requires reason; one decision only; repeat approval rejected; after approval the dashboard shows `SELESAI` but receipt still pending.
5. Keep monthly AutoCrat and any trigger OFF until a separate approved receipt workflow is ready.

## Release blockers
- No live Admin approval test available until a permitted monthly transaction can be created in QA (or an isolated mock/harness is used).
- First-month credit policy pending Ustaz Shafie.
- Monthly receipt numbering, AutoCrat PDF generation, monthly receipt retrieval and permissions still required.
- Concurrency / ownership / negative-path QA before LIVE.

**Safety LOCK:** QA branch only. No commits to master, no PR, merge, deployment, additional workbook, GAS LIVE or spreadsheet LIVE mutation.
