# UPKK V2 — Native eBayar 12 Bulan: Part 1 UI QA

Checkpoint: 4 November 2026.

## Owner directive
- **KEEP V1** Parent login → pilih anak → 12 kad bulan → popup status → Bayar Sekarang.
- Replace only Google Form route with Native eBayar. No checkbox month wizard, no dashboard rewrite.
- Native eBayar starts **December 2026**, continues in later years; no mixing of financial years.
- QA branch and GAS BACKUP only. No LIVE changes, no production deploy, no new spreadsheet or trigger.

## Part 1 delivered (QA code only)
- `Code.gs`: successful parent login now returns `nativeEbayar2027` per owned child, derived from the registration approval marker in the BACKUP workbook.
- `getDashboard`: for an approved 2027 child only, returns 12 distinct **BELUM** QA cards for 2027, isolated from 2026 payment records. These are **UI placeholders**, NOT actual authoritative payment status.
- `index.html`: preserves V1 monthly cards, status popup and child selection. For an approved 2027 child on GAS /dev, pressing **Bayar Sekarang** opens the Native eBayar modal, not a Google Form.
- Modal fields: read-only child and selected month, example amount RM50 (clearly labeled **demo**), payment date, payment method, JPEG/PNG/PDF proof limited to 3MB; submit button only previews locally.
- **No payment submission, proof upload, spreadsheet write, or Admin confirmation** in this part. No new API/JSONP endpoint; no money movement.

## QA evidence
- Static JavaScript syntax verification of the inline scripts and Code.gs: PASS.
- Confirm modal element, handler route, 2026 legacy source still present: PASS.
- Browser QA /dev on copied GAS, real Google uploads, actual payment records: **NOT VERIFIED**.

## Next steps (Part 2 backend)
1. Implement server-authenticated parent session and child ownership check using MyKid/student identity; never trust name/email supplied by browser alone.
2. Set up a **year-aware** data model for Dec 2026 vs Jan–Dec 2027 using existing ONE QA workbook (no new workbook), and ensure eBayar 2026 historical records stay unchanged.
3. Read Admin fee configuration from server, not hardcoded UI demo; define correct December 2026 vs 2027 rates.
4. Upload private payment proof, submit once per child + month + year with lock and idempotency; status PENDING until Admin approval, then receipt serial and AutoCrat.
5. Render real PENDING/SELESAI states on 12 cards; do not claim sample BELUM data represents real payment truth.
6. Design and test Admin review (approval / rejection) and receipt output; audit AutoCrat job mappings, conditions, and no duplicate merges.
7. Keep all AutoCrat triggers OFF while testing and do not run merge on real V1 rows.

## Installation to preview (not production)
From `feature/native-ebayar-12bulan-qa`, copy `Code.gs` and `index.html` into GAS BACKUP. Verify `SPREADSHEET_ID` points at the BACKUP workbook. Keep `NativeEdaftar.gs` and `AdminV2.gs` unchanged. Save, refresh `/dev`, log out and log in as parent to refresh child metadata. Choose an **APPROVED 2027** dummy child, click any month → Bayar Sekarang. Do not submit actual payment. This is a **mock preview** only.

## Risks to close
- Existing backend `submitBayaran()` still writes year `2026` and auto-`SELESAI`; it must NEVER be called by Native eBayar V2.
- Current V1 `getDashboard` is fixed to 2026 tab names. The 2027 QA branch returns mock BELUM for eligible 2027 child as a temporary UI bridge.
- Multiple children can share the same guardian email. The backend must bind all submissions to a validated child, month, and year.
- AutoCrat PDF working for registration is separate from monthly AutoCrat 2027; verify each job independently.


## Owner review and amended scope — 4 Nov 2026

### Browser QA evidence from owner screenshots
- **PASS (UI preview only):** Parent with two registered children can select one child, open a 2026 month card and see the existing V1 popup flow. Native eBayar modal opens with selected child's name, payment date, payment method and JPEG/PNG/PDF upload control.
- **PASS (local preview):** Filled-in form displays its QA validation/preview message; **NO submission** occurs. The uploaded file shown in the browser has **not** been uploaded to Drive.
- **Accepted owner decision:** 12-card history view is correct: **Jan–Oct 2026 = N/A**, **Nov–Dec 2026 = BELUM** for the shown child registered in November. DO NOT change the 10 N/A cards to BELUM or force all 12 months active.
- **OPEN DEFECT:** Native eBayar modal says **Nov 2027** when opened from a **Nov 2026** card. The dashboard heading remains Jan–Dis 2026. Align selected month/year first, without changing the V1 card history.
- **OPEN UI issue:** Payment amount `50.00 (demo)` is a mock value, NOT confirmation of the true amount to charge. Server-side fee policy is outstanding.
- **NOT VERIFIED:** Genuine backend submission, proof upload, durable pending entry, parent/child identity binding, Admin monthly approval, monthly receipt numbering and AutoCrat merge.

### Fee and intake decisions awaiting Ustaz Shafie
A follow-up WhatsApp has been sent to Ustaz Shafie. Treat the responses as **pending**, not approved:
1. Confirm registration fee and whether the old RM40 registration component continues when the monthly fee becomes RM50.
2. Confirm December 2026 charges for new and continuing pupils.
3. Continuing pupil re-registration and any renewal fee.
4. Registration window and intake capacity for Year 3 / Year 4.
5. Confirm urusetia review → approval → receipt workflow.

### Next implementation order
1. Fix selected year in the Native eBayar modal to match the clicked V1 month card (e.g. Nov 2026), preserving all N/A logic.
2. Design minimal year-aware records in **the existing BACKUP workbook** for future years; no new workbook. Source of truth must include guardian/child identity, payment month and payment year.
3. Restrict writes to server-validated parent + owned child; do not trust browser-provided email/name. Prevent duplicate submissions and give PENDING its own state.
4. Only after year model and review workflow are stable, test one synthetic payment and its approval/receipt in BACKUP. AutoCrat triggers remain OFF until isolated merge checks pass.

**Safety lock:** No edits to LIVE, no production deployment, no changes to legacy 2026 records or AutoCrat job configuration here.
