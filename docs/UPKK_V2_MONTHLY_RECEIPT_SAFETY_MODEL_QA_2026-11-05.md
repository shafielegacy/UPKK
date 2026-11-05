# UPKK V2 — Monthly Receipt Safety Model QA (5 Nov 2026)

**Branch:** `feature/native-ebayar-12bulan-qa`  
**Scope:** pure JavaScript decision model and deterministic tests. **NOT a GAS/AutoCrat integration.**  
**Business policy:** RM50/RM100 and first-month credit still HOLD pending Ustaz.  
**Release:** NO-GO; no LIVE or BACKUP Google write.

## Added

- `qa/monthly-receipt-decision.js` — pure receipt decision policy model with no Google or email side effects.
- `tests/monthly-receipt-decision.test.js` — Node assert suite (run: `node tests/monthly-receipt-decision.test.js`).

## QA results

**23 PASS / 0 FAIL** using the committed module and cases evaluated in a JS isolate; no Node filesystem-based run was possible in this execution environment. Commit contents were fetched back from GitHub and executed against the checked-in case matrix. This proves only the deterministic decision function, **not** Apps Script, Drive, concurrency or AutoCrat integration.

Covered: payment state gate, invalid request/month/year/amount, wrong ledger identity, receipt serial presence, reserved state, READY with PDF, READY without PDF, MERGING/FAILED/UNCERTAIN hold, PDF/state inconsistency, duplicate same child-month-year, and non-conflicting child/month/year.

## Critical safety design boundary

The function proposes `RESERVE_WITH_LOCK` only when a settled transaction has no durable record. It **does not assign serial numbers**, because serial allocation must be atomic, durable and checked against the full stored ledger.

`MERGE_MANUAL_ONLY` is a design label, **not permission to call AutoCrat automatically**. External AutoCrat/Drive/email side effects may succeed even when the caller reports a failure. Therefore a real implementation must:

1. Allocate a stable serial under server lock to one settled transaction, keyed by child + year + month and immutable request ID.
2. Persist a dedicated merge state (`RESERVED` → `MERGING` → `READY`, else `FAILED`/`UNCERTAIN`) plus private PDF URL and minimal audit event.
3. Reconcile uncertain merges/outputs before a manual retry. Never send a second email or regenerate a PDF automatically without proof that no prior output exists.
4. Keep V1 legacy data, receipt numbers, formulas and AutoCrat jobs entirely separate.
5. Link the PDF only to an authenticated guardian's selected child and month. Never use public JSONP or public file access.

## Outstanding BEFORE any release

- Define actual ledger columns and an idempotent receipt serial allocator, with concurrency and crash recovery evidence.
- Define isolated monthly AutoCrat template, job mapping and merge conditions and check duplicate email handling.
- Implement a private receipt retrieval endpoint and browser UI updates.
- Run real GAS BACKUP /dev, Drive permission and controlled trigger QA with synthetic identities and zero real mail recipients.
- Run negative tests: stale token, wrong child, repeated approval, same-period duplicate, partial merge failure, retry after partial result.
- Resolve registration first-month credit policy with Ustaz. A registration receipt must never produce an extra monthly receipt for the same funds.
- Review QA guard to production environment migration separately with explicit owner go/no-go.

**No master, GAS LIVE, official Sheets, Drive or AutoCrat production changes.**
