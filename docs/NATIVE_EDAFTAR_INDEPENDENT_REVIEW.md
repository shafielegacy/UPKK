# Independent review & release decision — Native eDaftar 2027

Date: 7 Nov 2026 (MYT). Branch: feature/native-edaftar-pages-smoke.
Base real-Google checkpoint: e33bc7d9eab3368a73a23354372a033da5a33fde.
First hardened candidate reviewed remotely: 47294631b35e9422aa41fbc7023cef1df9b5c1fc.

## Review provenance and coverage

An independent reviewer successfully read EXACT remote source files at 47294631b35e9422aa41fbc7023cef1df9b5c1fc:
PagesEdaftar.gs, edaftar.js, release/gas/NativeEdaftar.gs, release/gas/AdminV2.gs, release/gas/Code.routes.gs.txt.
An earlier local-read attempt stalled and produced NO source coverage; it was superseded by the successful GitHub reads, not counted as a passed review.

A separate independent synopsis reviewer identified a production Admin guard fallback. Root reproduced it with a failing test and fixed it before the remote source-review candidate. The source reviewer then identified stale row targeting in the existing Admin decision flow; root added applicant-version checks and a one-line GAS Admin UI argument patch. That reviewer accepted the exact described remediation, with the remaining manual Sheet-edit race clearly stated. The final remediation was not initially in the five-file reviewed SHA; any final-source reread will be recorded separately. No reviewer claimed to have inspected installed GAS or real Drive ACLs.

## Findings and disposition

| Risk | Finding / location | Candidate treatment |
| --- | --- | --- |
| HIGH | Pinned V2 legacy dispatcher has testResit raw-row output when QA workbook-only isolation does not apply. A route-only promotion would risk public data access. | Required Code.routes.gs.txt closes ALL legacy GET/JSONP and non-registration POST on the NEW V2 endpoint; five explicit registration RPCs only. Root/V1 Code.gs is NOT for V2 deployment. Existing 2026 deployment untouched. |
| HIGH | Per-email OTP cooldown alone permits rotating addresses to consume the script's email allowance. NativeEdaftar request path. | New global persistent daily cap (50 default), fixed-window per-email hourly cap (5), and MailApp remaining-quota reserve (20), under existing script lock. Failed sends count too. |
| HIGH | “No setSharing call” does not establish restricted Drive access; folder inheritance/default broad access may expose slips. | Refuse broad folder/file sharing before acceptance. Named/group/inherited ACL audit and signed-out file-access check remain a RELEASE GATE; code check alone is not a guarantee. |
| HIGH | Multi-call Sheets writes are not atomic. A failure before MyKid/class fields are complete could evade later duplicate/quota counts after a fresh OTP. | Persistent global WRITE_HOLD before first mutation, ticket consumed before write. Hold survives partial failure and prevents further submissions until operator reconciliation; no automatic retry/hold clearing. |
| MEDIUM | Wrong OTP attempts refreshed cache TTL and could extend the advertised ten minutes. | New absolute expiresAt and remaining-TTL rewrite. Five guesses and one-use verification retained. Old in-flight OTP records without expiry fail closed after upgrade. |
| MEDIUM | Fixed A:E/G:I writes were not guarded against every email/name/address column shift. | Exact fixed-index checks now reject moved columns before upload/write. F/K/L remain formula owned. |
| MEDIUM | Admin service was QA-workbook-only; naive promotion/fallback could bypass intended production flag. Independent synopsis finding. | Separate production Admin flag + exact workbook binding; legacy branch explicitly mode===QA. QA setup/formula-preparation functions reject production. Existing identity/token checks retained. |
| MEDIUM | decideAdminV2Application targeted mutable row number only. Source reviewer finding. Sorting/inserting between list and action could target another pending applicant. | Protected list now includes a fingerprint of identity/status/fee/intake fields; Admin decision requires matching expectedVersion under lock before writes. Matching GAS Admin UI passes that version. Stale/missing version fails closed; no new column or workbook. |
| LOW | Browser could enable OTP on a malformed/inconsistent fee response. | Session2027 + numeric RM50/0-or-50/sum contract checked before enabling form. |
| CONDITIONAL HARDENING | Existing GAS Admin login has no attempt throttling. Exposure and password quality were not verified; no successful exploit claimed. | Production gate requires owner review of Admin access/strong unique credentials. No credentials changed here. Do not treat a six-digit/weak credential as acceptable merely because registration uses OTP. |

Manual Sheet sorting/insertion after the version check is not locked by LockService. Keep intake/approval rows free from manual sort/insert while the service is active; use filtered views and close intake for maintenance. The expectedVersion mitigation prevents stale-list targeting, not arbitrary concurrent human editing inside the write window.

## Eight requested focus areas

1. POST/CORS/redirect: explicit registration allowlist, body-only payload, text/plain simple POST, credentials omitted, readable JSON, follow redirects; no JSONP/no-cors fallback. Do not log Google content redirect URLs.
2. OTP/token/MyKid/guardian privacy: OTP hash server-side, absolute expiry/attempt budget/one-use, email-bound ticket in memory, no private application URL/localStorage. Private data remains behind existing service checks and Admin token.
3. Slip: JPEG/PNG/PDF signature/MIME/3MB checks retained. Generated filename, private checks and no automatic approval. Actual ACL membership is an external gate.
4. Duplicate/retry: MyKid checks and quotas under lock; ticket consumed before write; durable hold for uncertainty. Success disables client submit; no automatic network retries. No claim of distributed transaction semantics.
5. Fees: existing server quote preserved, production config pinned to registration50/monthly50 and Dec2026 start; November50, December100. Stale totals rejected; per-row quote retained.
6. Quotas: Years3-5 from valid DOB; Physical30/Online20; PENDING+APPROVED occupy seats, REJECTED does not; checked under lock. New negative source tests hit both exact limits.
7. Admin isolation: no Admin POST RPC, all legacy API actions closed on new endpoint, authenticated GAS Admin retained, production flag bound to workbook, stale record checks.
8. 2026 compatibility: root legacy index scripts, Code.gs, sw.js and assets unchanged by this release-preparation delta; only registration assets/services reviewed. Do not repoint V1 GAS_URL, overwrite V1/V2 Code wholesale, edit V65 or enable monthly eBayar.

## Validation and limits

- Existing real BACKUP smoke at e33bc7d remains PASS: OTP request+owner-assisted verification, dummy PDF service acceptance, PENDING row111, Admin read and Physical Year3 30->29. No repeat during preparation.
- New source/security tests use simulated Google boundaries, NOT new Google integration proof. Final runner: **41 PASS, 0 FAIL** (25 new release cases, 14 earlier adapter/frontend cases and two legacy file entries). Full results are in NATIVE_EDAFTAR_RELEASE_TEST_OUTPUT.txt.
- Release JavaScript/GAS files parse. Existing legacy regression suites are included.
- New production guards and Admin version patch are not installed or tested in GAS in this task. The previous smoke does not prove their real runtime behaviour.
- Scope of static source review is the five named files, not the entire installed project. Reference Code/Admin/Native source was pinned to fd0a3c38e5d3d11c31b93633913adc3224bdfe92; preserve later manual security fixes through source comparison.
- Saved frontend config remains OFF/empty. No public flag/property/deployment/Sheet/Drive change was made in this task.

## Result

| Item | Result |
| --- | --- |
| Requested source review | PASS, scoped to named files and described final remediation; configuration/integration limits stated above |
| Candidate source security/regression checks | PASS — see captured runner output |
| Historical real BACKUP happy path | PASS — retained, not repeated |
| Changed guards / Admin version in real GAS | BLOCKED — not installed/executed |
| Installed-source parity, ACL, Admin access, official schema/formulas | BLOCKED — require owner-controlled preflight |
| Public production release | BLOCKED / NOT AUTHORISED |

Release package: release/README.md, service-specific files/diffs, two routing bodies, one GAS Admin UI patch, frontend root assets and checksums. Ready for owner review of the package; not permission to merge/deploy/open intake.
