# eBayar Sync Unpaid Only Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sync each eBayar form with only students who still need to pay for that month.

**Architecture:** Reuse the existing DAFTAR and eBayar parsing helpers. Extend the eBayar choice builder so registration-month payments are only treated as covered when the registration payment amount is RM80 or more, then surface clearer sync counts in the admin UI.

**Tech Stack:** Google Apps Script, plain HTML/CSS/JS, Node-based unit tests.

## Global Constraints

- A student registered in a month is considered paid for that registration month only when `BAYARAN` in `DAFTAR UPKK` is RM80 or more.
- A student registered in a month with only RM40 registration payment must remain in that month's eBayar form choices.
- A student who already appears in the eBayar sheet for a month must not appear in that month's form choices.
- A multi-name eBayar cell separated by commas counts as multiple students.
- Keep changes limited to `Code.gs`, `index.html`, and sync tests.

---

### Task 1: Sync Choice Formula

**Files:**
- Modify: `tests/upkk-form-sync.test.js`
- Modify: `Code.gs`

**Interfaces:**
- Consumes: `buildEbayarChoices_(muridList, paidNameCells, cutoffMs, bulanNum)`
- Produces: a filtered name list for every eBayar form.

- [x] Add a test proving same-month RM80 registrations are excluded while same-month RM40 registrations remain in form choices.
- [x] Update `buildEbayarChoices_` to accept `bulanNum` and exclude `m.daftarBulan === bulanNum` only when `isYuranPertamaCoveredByDaftar_(m.bayaranDaftar)` is true.
- [x] Update `syncMuridToForms()` and `kemasFormEbayar()` to pass the month number.
- [x] Run `node tests\upkk-form-sync.test.js` and confirm it passes.

### Task 2: Clearer Sync Result Copy

**Files:**
- Modify: `index.html`
- Modify: `tests/admin-dashboard.test.js`

**Interfaces:**
- Consumes: sync response rows `{ bulan, count }`
- Produces: admin copy that says synced names are names that still need payment.

- [x] Add a test for the new admin Sync copy.
- [x] Update admin Sync text and table label to say `Nama perlu bayar`.
- [x] Run `node tests\admin-dashboard.test.js` and confirm it passes.

### Task 3: Full Verification

**Files:**
- Test only.

- [x] Run `node tests\admin-dashboard.test.js`.
- [x] Run `node tests\upkk-form-sync.test.js`.
- [x] Deploy merged `Code.gs` to GAS Version 55 and verify Sync Murid completes with 12 forms updated, 574 choices, 0 errors.
- [x] Report deployment/git limitations if local staging still cannot write `.git`.
