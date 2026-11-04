# UPKK V2 — Native eBayar Part 2: Backend QA Candidate

**Checkpoint:** 4 Nov 2026 · **Status:** code committed to QA branch only. No real GAS /dev submission or payment sheet change yet.

## Owner decisions carried forward

- Parent dashboard V1 and 12 monthly cards: **LOCKED**.
- For pupils registered November 2026, **Jan–Oct 2026 N/A, Nov–Dec 2026 BELUM**, unless a subsequent verified payment legitimately changes a month.
- Add a minimal **2026 / 2027 year switch** only for approved V2 pupils; 2026 remains the starting view. Do not mix yearly payment statuses.
- eBayar starts **Dec 2026** (not Nov). December pricing/rules **not confirmed**; requests for that period stay blocked. 2027 test payments can use the configured QA monthly fee.
- Single existing **BACKUP workbook**. **One additional dedicated native transaction tab** within that workbook is the safe alternative to writing into the 12 legacy 2026 AutoCrat tabs. No new workbook, no 12 new tabs.
- Parent payment → PENDING → Admin review → only then SELESAI, serial number and AutoCrat receipt. **Admin monthly approval and monthly receipt generation are still TODO.**

## Candidate implementation

### Backend: `NativeEbayar.gs` (new)

- `UPKK_NATIVE_EBAYAR_QA_ENABLED=true` required; QA-only spreadsheet ID checked server-side before any action.
- Parent token issued ONLY by `loginNativeEbayar(email,password)` over `google.script.run`, after re-checking email + last six phone digits from DAFTAR UPKK, requiring `APPROVED 2027`. Admin emails disallowed for guardian sessions. Two-hour script-cache token, held in browser memory only.
- Every request revalidates selected child **MyKid, guardian email, approved status** on server. No trust in posted name/email or client-side role.
- Year-aware transaction key: `CHILD_MYKID + BULAN + TAHUN`. Same guardian can submit for multiple children.
- `getNativeEbayarQuote` reads actual Admin monthly fee from Script Properties and checks for existing PENDING/SELESAI.
- `submitNativeEbayar` validates date, payment method, amount, file MIME/magic bytes, file size <=3 MB; stores private Drive file, then writes **PENDING**. Uses a script lock to reject duplicate active submissions.
- `prepareNativeEbayarQaSheet` is an **explicit Admin action**, creating or checking only one tab `NATIVE_EBAYAR` with 17 stable columns. Requires existing Admin V2 authentication.
- Backend refuses **Nov 2026 and earlier** by start date; Dec 2026 submissions remain **blocked pending Ustaz's confirmation**; allowed QA 2027 only.
- Existing old `submitBayaran` endpoint is blocked in QA because it writes `SELESAI` automatically.

### UI: `index.html` + `Code.gs`

- 2026 view continues V1 history; no replacing N/A with false BELUM.
- Only V2-approved pupils can switch to a separate 2027 year view with twelve monthly cards. Native 2026 and 2027 receipts/statuses read by year from the dedicated tab.
- Native modal correctly derives payment year from the **clicked card** (Nov 2026 is no longer Nov 2027). Displays server fee, child and month. A pending month shows an **under-review popup** and prevents duplicate payment.
- Browser-only preview was replaced by server-authorised submit for **2027 QA**. 2026 submit remains disabled.
- Guardian token and MyKid reference are held in temporary JS state, **not localStorage**. Per-child references matched by child name plus original registration timestamp; not by array position.
- For non-V2 users, the copied GAS QA portal does **not** open old LIVE Google Forms.

## Setup instructions — BACKUP only

1. Copy 3 files from branch `feature/native-ebayar-12bulan-qa` to copied GAS project: `Code.gs`, `index.html`, **new `NativeEbayar.gs`**. Retain `NativeEdaftar.gs` and `AdminV2.gs`.
2. Verify `SPREADSHEET_ID = '1aY5rHWYL3-K8IMGcVQNWS9uyahEwwLHdaVMag8YwYoo'` in copied `Code.gs`. **Never install in LIVE.**
3. Add Script Property `UPKK_NATIVE_EBAYAR_QA_ENABLED=true` to copied GAS project only.
4. For any real **QA 2027 synthetic** submission, set `UPKK_NATIVE_EBAYAR_SLIP_FOLDER_ID` to an accessible private QA Drive folder. Do not share uploaded slips publicly.
5. On copied GAS `/dev`: log out and log in as Admin; **Tetapan Yuran → Sediakan Tab Bayaran QA**. Verify only one `NATIVE_EBAYAR` tab is present in the BACKUP workbook.
6. Logout; log in as an approved 2027 **synthetic guardian** with their normal email + six phone digits (admin-only email cannot act as a parent).
7. Check 2026 view: Jan–Oct N/A, Nov/Dec BELUM for the November dummy.
8. Check **Nov 2026** quote is blocked by start policy. For **Dec 2026**, the quote can be previewed, but submission must be blocked until Ustaz confirms the actual fees.
9. Select **2027**, choose a month, inspect server-derived amount and submit only one dummy proof. Verify tab `NATIVE_EBAYAR` shows `PENDING`, and after refresh the selected month displays PENDING. Repeat-submit must be rejected.
10. **Do not run AutoCrat** or approve payment in the month job during this phase; Admin approval workflow is not yet built.

## Known limitations / gates

- Static syntax: Code.gs, index.html inline scripts, NativeEbayar.gs, AdminV2.gs and NativeEdaftar.gs **PASS**.
- Mock period validation: Dec 2026 allowed for quote only; Nov 2026 rejected; Jan 2027 allowed; 2028 rejected until year support configured **PASS**.
- Mock child ownership: valid child accepted; different guardian, rejected application and child outside session denied **PASS**.
- Actual Apps Script /dev, Drive upload, duplicate race, year switching in browser, and submission in Google Sheets: **NOT VERIFIED**.
- No actual 2027 fee policy or December 2026 approval by Ustaz yet. Admin's RM50 value is still **QA configuration** for testing.
- Month-specific Admin approval, immutable monthly serials, AutoCrat PDF mapping, duplicate-merge prevention, and production release are future work.
- Current code does not implement 2028 or later UI; architecture stores `TAHUN` and can be extended after rates are configured.

**Safety:** V1 LIVE GAS and Google Forms unchanged; AutoCrat triggers remain OFF during QA.
