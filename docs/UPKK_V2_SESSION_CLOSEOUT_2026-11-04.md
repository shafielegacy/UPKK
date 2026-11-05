# UPKK V2 — Session Closeout · 4 November 2026

**Owner status:** HOLD development. Resume only after follow-up from Ustaz Shafie or explicit owner instruction.

**Working branch:** `feature/native-ebayar-12bulan-qa`. **Safety:** changes in this session are documentation-only; no QA spreadsheet or GAS mutation by the assistant, no LIVE writes/deploy/merge/PR; AutoCrat triggers remain OFF during QA.

## Business policy — CONFIRMED by Ustaz Shafie
- **Pendaftaran RM50 + bulan pertama RM50 = RM100**. Monthly fee RM50.
- All returning and new students must enrol for the **new package**, including returning students. Three subjects: **Bahasa Arab, Akidah and Ibadah**.
- Ordinary intake open through **31 Dec 2026**; after 1 Jan 2027, admission only upon discretionary review if a seat remains. A public self-service exception is NOT currently implemented.
- For each **Tahun 3 / Tahun 4 / Tahun 5**: **30 Fizikal + 20 Online**, up to 50 per year. No automatic carry-over of V1 pupils into the new package.
- Payment proof uploaded by guardian, then urusetia confirms before official receipt generation.

## IMPORTANT question still awaiting Ustaz
For a new package enrolment paid in **December 2026**, should the **RM50 first-month** component settle **December 2026** or **January 2027**?
- **NO decision yet.**
- Do not automatically mark either month `SELESAI` based on registration approval.
- Related December monthly eBayar policy must remain blocked/held until clarification.

## Verified QA in copied workbook / copied GAS
1. **Native eDaftar RM100**: submitted and accepted for review with 2027 package status `PENDING 2027`. Snapshot RM50/RM50/RM100 verified.
2. **Returning pupil**: same MyKid appears in **legacy row 102** and **new V2 row 106**, correctly preserving history. At entry, AE/AF/AG = **5 / FIZIKAL / DAFTAR SEMULA**.
3. **Admin approval**: screenshots and read-only Sheets check verified row **106** approved, amount **RM100.00**, receipt **UPKK-2026-0004** in K and AD, and populated approval audit fields. The receipt year is 2026 because that is the **registration calendar year**.
4. **Parent login**: owner screenshot showed the returning student appears **once**, with current V2 registration date and preserved 2026 status cards: **Jan–Oct N/A, Nov BELUM, Dec BELUM DIBUKA**.
5. **Resit Digital monthly**: no November monthly receipt was found; this is expected given no verified November monthly payment. The registration receipt is a separate document.
6. **Future-month UI**: screenshot showed all 12 months of the 2027 view as **BELUM DIBUKA** in November 2026. Backend date guard earlier passed deterministic mocked MYT tests, **not real tampered-request testing**.
7. **Year 3–5 form**: class automatically inferred from MyKid (9→T3, 10→T4, 11→T5); 12-year-old input rejected. Misleading empty class-year field fixed in QA UI.
8. **AE:AG setup**: explicit Admin action reported success in the BACKUP workbook; columns verified in subsequent row 106 read.

## Not yet verified
- 30/20 capacity at boundary and concurrent submissions; old pre-patch dummy rows may lack class/mod and cannot be used to prove capacity totals.
- Exception handling after 31 Dec; current public flow closes.
- Native monthly eBayar actual PENDING upload, Admin monthly approval, receipt numbering, monthly AutoCrat PDF and duplicate avoidance.
- Registration PDF specifically from **new RM100** approval and its stored output link; older registration PDF QA was at **RM90**.
- Broader security and production migration; V1 LIVE remains the operational source.
- Future-year 2028+ support is not yet implemented.

## Resume order
1. Record Ustaz's explicit decision about which month the first RM50 applies to, without changing past receipt records.
2. QA the full **RM100 registration PDF** in isolation with triggers OFF; ensure it is parent-accessible separately from monthly receipts.
3. Validate class capacity with synthetic tests (including concurrency), no live data.
4. Implement year-aware monthly eBayar PENDING → Admin approve/reject → unique receipt → AutoCrat, with one BACKUP workbook and an isolated native payments tab.
5. Release review only after documented full QA and owner authorisation.

## Supporting references
- `docs/UPKK_V2_OWNER_DECISIONS_2026-11-04.md`
- `docs/UPKK_V2_EDAFTAR_OWNER_RULES_PART3_QA.md`
- `docs/UPKK_V2_NATIVE_EBAYAR_PART2_BACKEND_QA.md`
- `docs/UPKK_V2_ADMIN_QA_RUNBOOK.md`

This is a **QA closeout**, not approval to deploy.

## Added to To-Do — Intake capacity shown to parents (owner request, 4 Nov 2026)
- [ ] On the Native eDaftar form, after MyKid determines **Tahun 3/4/5**, display **remaining seats per mode** using the current BACKUP data: `Fizikal — 29 tempat lagi`, `Online — 20 tempat lagi` (example only).
- [ ] Count **PENDING + APPROVED** applications for the same year and mode as reserved places. Exclude **REJECTED**. Limits: **30 Fizikal / 20 Online per year**.
- [ ] Update availability whenever year/selection changes, and refresh immediately before submission; **server must recheck under LockService**, never trust the displayed count.
- [ ] At zero remaining seats, show `PENUH` and disable that option; ensure a concurrent final-place submission cannot overbook.
- [ ] Test counts using synthetic records, including two parents competing for the final seat; preserve historical V1 records and keep LIVE untouched.

**Planning target:** aim for UPKK V2 operational readiness **before December 2026**, subject to Ustaz's outstanding first-month credit decision, real QA, safe release readiness, and owner approval. This is a target, **not a confirmed deployment date**.

## Added to To-Do — Telegram Notifications A+B (owner approved planning, 4 Nov 2026)

**Status: PLANNING ONLY — NOT IMPLEMENTED.** Keep the simple V1 architecture: **one Telegram bot, two destinations**, backed by the existing Google Apps Script and **one official spreadsheet**. No Firebase, additional hosting, new production workbook, or bot-based approval workflow.

### A — Existing Syafie Legacy Telegram group (operational alerts)
- [ ] Send concise notifications for **new Native eDaftar applications** and **new Native eBayar proof submissions** that require Admin/AJK review.
- [ ] Notify the group when **registration/payment is rejected** (without sensitive personal details). Approved actions may be bundled into a short daily summary to avoid notification noise.
- [ ] Notify about **sensitive Admin setting changes** (for example fees, quotas, or registration window): actor identity/role, timestamp, setting name, before/after values and audit reference; do not disclose credentials or secret values.
- [ ] Operational faults only appear in the group if AJK action or service availability is affected. No parent-facing decisions from Telegram.

### B — Developer private Telegram chat (technical alerts)
- [ ] Route **system failures** (Apps Script/API, private slip upload, receipt/AutoCrat generation, notification delivery failures) to the developer's private chat.
- [ ] Alert on significant **suspicious Admin authentication / authorisation events**, with minimal non-sensitive details; prevent floods from repeated events.
- [ ] Preserve diagnostic correlation IDs and timestamps in audit records; avoid dumping stack traces, tokens, email OTPs or child PII into Telegram.

### Activity log, privacy and reliability
- [ ] Append events to **one `ACTIVITY_LOG` tab** in the existing workbook (BACKUP first). Suggested minimum fields: event ID, Malaysia timestamp, event type, actor/role, related transaction reference, result, and notification dispatch status. For configuration changes store safe **before/after** values.
- [ ] Record only meaningful server-side outcomes; distinguish `PENDING`, `APPROVED`, `REJECTED` and failures. No notification for ordinary parent page views.
- [ ] Use server-side Telegram Bot API `sendMessage` via GAS `UrlFetchApp`; store **bot token and destination chat IDs only in Script Properties**, never GitHub or Sheets.
- [ ] **Never expose full MyKid, phone, addresses, proof-of-payment files, OTP/PIN or other secrets** in group/DM notifications. Admin-only details stay in authenticated UPKK dashboard.
- [ ] **Primary transaction must not fail if Telegram fails.** Log failed dispatch, provide bounded and non-duplicating retry (with event ID), and avoid blocking checkout/registration on Telegram availability.
- [ ] Test with the BACKUP GAS / spreadsheet and **private TEST destinations** before any connection to the actual committee group; obtain owner approval before activating real notifications.

### Timing and acceptance
- [ ] Treat this as an **enhancement after core eDaftar/eBayar flows**, not a release blocker for the December readiness target unless the owner expressly reprioritises it.
- [ ] QA: one submitted application produces one group message; one technical failure goes to developer DM rather than the group; changes to fee/quotas are audited; Telegram failure leaves the underlying registration/payment intact; no secrets or duplicate broadcasts.

**Project remains HOLD** pending Ustaz Shafie's decision on whether the first RM50 settles December 2026 or January 2027. This documentation update does **not** authorise implementation, production activation, or changes to LIVE.

## Progress — 5 Nov 2026, after owner QA (QA branch)

### LOCK: parent-facing intake seat counts
- **Owner UI QA PASS** using synthetic birth-year MyKids, without submitting new registrations. Tahun 3: **30 Fizikal / 20 Online**, Tahun 4: **30 / 20**, Tahun 5: **29 / 20**. Year 5's one occupied physical seat matches the approved BACKUP V2 record.
- UX and basic read-only count calculation confirmed; **NOT YET VERIFIED**: full-capacity rejection in real GAS, two concurrent last-seat submissions, cross-account audit. Do not claim full quota QA completion.
- No more work on seat-count UI unless a regression is found.

### QA-only implementation: registration PDF available to parent
- `NativeEbayar.gs`: new GAS-only `getNativeRegistrationReceipt(token,mykid)` validates the short-lived **parent session**, owned MyKid, single **APPROVED 2027** record, immutable V2 receipt number, AutoCrat PDF merge completion, and an allowlisted Google Drive/Docs URL. It is **not exposed through doGet/JSONP**.
- `index.html`: existing **Resit Digital** modal gains a distinct **Resit Pendaftaran UPKK 2027** action for eligible V2 children only; monthly receipts remain separate. A completed server read displays a **click-to-open PDF link**, avoiding automatic popup blockers. When AutoCrat is unfinished, it explains that the PDF is not yet available.
- The BACKUP record **row 106** has a previously generated Drive PDF link and `PDF created` merge status; this is a **read-only source check**, **not runtime proof of the new access function**.
- **PASS:** source JS syntax inspection, existing session/ownership API use, expected AutoCrat header mapping and URL form.
- **NOT VERIFIED:** actual GAS BACKUP parent download, Drive permission in parent browser, permission denial for a sibling/unowned child and expired sessions, pending PDF message, or browser refresh/restore.
- **Owner QA handoff:** copy **NativeEbayar.gs** and **index.html** from branch into **GAS BACKUP** only; do not change `Code.gs` or QA `SPREADSHEET_ID`. Log out / log in again (in-memory parent receipt token is established during native login), open **Resit Digital → Resit Pendaftaran → Buka PDF**. Test with controlled QA account and no real child-data exposure.
- **LOCK:** AutoCrat manual merge accepted by owner as QA PASS for generation. Time trigger is separate **NOT VERIFIED**; do not reactivate or rerun merely for this UI test.

**All changes above are QA branch code/documentation only. No LIVE or BACKUP Sheets mutation, GAS deployment, trigger activation, PR or merge performed by assistant.**
