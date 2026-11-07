# Native eDaftar production release preparation — 7 Nov 2026

Approved scope: independent source review + minimum production-ready candidate, SAME branch only. No merge/deploy/public activation; no LIVE/V65/2026 record edits. Existing real BACKUP smoke remains evidence for e33bc7d, not repeated.

1. Review candidate and pinned V2 dependencies independently. Installed GAS parity remains an explicit release gate.
2. Add tests for QA/PRODUCTION fail-closed gates and exact workbook binding, Admin exclusion, OTP abuse budget/absolute expiry, private sharing, partial-write circuit breaker and frontend unknown-save behaviour.
3. Update PagesEdaftar.gs. Prepare only registration-specific NativeEdaftar.gs/AdminV2.gs files under release/gas, not a wholesale Code.gs replacement. Production Admin access remains authenticated; no public Admin RPC.
4. Keep native form frontend, fixed 2026 scripts and default frontend OFF. Runtime quote guard rejects invalid fee contract.
5. Supply additive doPost snippet, properties, manifest, backup/deployment/rollback/postdeploy checks and scoped approval gates. V65 untouched; future separate V2 deployment only under owner approval.
6. Run local targeted NEW negative tests and existing source regressions after changes. Do not rerun completed real smoke without reason. Independent reviewer checks final delta. Push only branch feature/native-edaftar-pages-smoke.

Implementation calls: production OTP budget defaults to 50 requests/day (reserve 20 remaining MailApp recipients) and 5 requests/email/hour; configurable lower caps are valid. One persistent write-hold pauses new submissions after any uncertain Sheets write until a named Admin reconciles the recorded row. This favours manual recovery over silent duplicate/over-capacity writes.
