# UPKK V2 — Checkpoint Owner 4 November 2026

**Scope:** Preserve V1 parent dashboard + 12 monthly cards; Native eDaftar and Admin approval, AutoCrat registration PDF, then Native eBayar. Keep SIMPLE, STABLE, SECURE.

## Verified in BACKUP (not LIVE)
| Component | Latest evidence | Verdict |
|---|---|---|
| Native eDaftar | Real test registration, OTP, MyKid auto-format and private upload; spreadsheet V marker PENDING | PASS for tested flow |
| Parent pending login | Owner screenshot with agreed pending message; not dashboard access | PASS |
| Admin fee configuration | RM40 + RM50 = RM90 QA in BACKUP | PASS for test value |
| Admin approval | APPROVED 2027, J RM90.00, L SELESAI, audit W:AB | PASS for tested rows |
| Receipt serial | K/AD rows 102, 103, 106 generated as UPKK-2026-0001/2/3 | PASS |
| Registration PDF | Owner screenshot of merged PDF using synthetic testing record | PASS for one merge screenshot, duplicate-prevention not verified |
| AutoCrat monthly | Job merge conditions reviewed; trigger shown OFF | Configuration only, not full monthly merge PASS |
| Native eBayar mock | Owner screenshot of modal, child/month/date/method/file, local preview | UI PASS; NO server write |
| Native eBayar backend | Not implemented or tested | NOT VERIFIED |

## Owner decisions
- V1 dashboard 12 month cards, child selection, popup, Bayar Sekarang are **LOCKED**.
- On the 2026 view, Jan–Oct are N/A for a child who registered in November; Nov–Dec BELUM. **Do not mark old months active**.
- Keep one QA workbook and copied GAS for tests; no additional spreadsheets, no LIVE writes or deploy.
- For registration receipt, year is extracted from registration timestamp (AC TAHUN), no complex academic-year rules.
- V2 receipt numbers stored in AD and displayed via K; preserve V1 historical receipts.
- Native eBayar replaces Google Form route only. Monthly receipt design is ready; no MyKid field needed on monthly receipt.
- Policies not yet confirmed must remain configurable/conditional, not hardcoded.

## Important open issue
**BUG:** eBayar mock opened from Nov 2026 card shows *Nov 2027* and a demo amount. First fix the year mismatch **without changing the existing 2026 month-card statuses**. The current dashboard backend has 2026-specific tab names and the early QA candidate used a 2027 placeholder; backend must use authoritative month+year and parent-child identity.

## Outstanding decisions requested from Ustaz Shafie
WhatsApp already sent; awaiting reply on fee registration, Dec 2026 billing, existing-student continuation/re-enrolment, intake window/capacity, and admin verification process.

## Next engineering steps
1. Correct Native eBayar displayed year to clicked card; preserve V1 dashboard.
2. Audit the existing BACKUP month tabs and schema; design year-aware storage with no new workbook. Do not write 2027 transactions into legacy 2026 month tabs as if they were 2026.
3. Parent identity & owned-child authorisation server-side; prevent forged email, duplicate and cross-child transactions; private slip upload <=3MB; idempotent durable PENDING record.
4. Admin monthly approval/rejection under authenticated session; generate monthly unique receipt only after approval.
5. Test isolated AutoCrat monthly merge and output link; ensure no repeated/old merges before enabling triggers.
6. Carry out read-only or synthetic QA first, keep LIVE/MASTER untouched.

## Refs
- Branch: `feature/native-ebayar-12bulan-qa`
- `docs/UPKK_V2_NATIVE_EBAYAR_PART1_QA.md`
- `docs/UPKK_V2_ADMIN_QA_RUNBOOK.md`
- Source files: `Code.gs`, `index.html`, `NativeEdaftar.gs`, `AdminV2.gs`

**This document is a project checkpoint, not a LIVE release approval.**
