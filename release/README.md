# Native eDaftar 2027 — release package / owner approval

**7 Nov 2026. PREPARED ONLY. Do not merge, deploy, enable public registration, edit V65, or run migrations from this document without the owner's next explicit instruction.**

## Decision

Source package and targeted local security checks are prepared. Existing real BACKUP smoke at e33bc7d remains PASS (OTP, dummy slip, PENDING row111, Admin read, Physical Year3 30->29). That evidence predates the new guards in this package. Final production release is **BLOCKED pending installed-source parity, changed-guard Google checks, private ACL audit and owner approval**. There are no new Google writes or deployments in this preparation.

## Exact file manifest

| Source path | Future destination / purpose |
| --- | --- |
| index.html | GitHub Pages existing 2026 page; only the already-reviewed registration link changes to ./edaftar.html. Keep its existing 2026 GAS_URL/login/dashboard logic. |
| edaftar.html, edaftar.css, edaftar.js | Complete standalone registration UI; parent remains on Pages. No inline event handlers, external scripts or private values in application URLs/storage. |
| edaftar-config.js | Frontend kill switch. Shipped enabled=false, endpoint empty. Populate ONLY the new approved V2 /exec endpoint after validation; no secret belongs here. |
| PagesEdaftar.gs | Add/update in matching V2 GAS. Five POST registration RPCs only; shared release gates and helpers. |
| release/gas/NativeEdaftar.gs | Registration service derived from pinned V2 reference; compare installed version and apply reviewed delta, or replace ONLY this service file after parity is established. |
| release/gas/AdminV2.gs | Existing V2 Admin service with a narrowly gated production guard. Identity/token/role checks remain. Do not expose it through POST. |
| release/gas/Code.routes.gs.txt | Replace ONLY doPost and _handleApi bodies in the existing V2 Code.gs. Do not append duplicate functions. doGet HTML rendering and all other V2 functions remain. |
| release/gas/AdminUI.patch | One-line change in the matching V2 GAS HTML decision modal: pass item.version for registration decisions; monthly arguments unchanged. Do not patch the 2026 Pages index. |
| tests/pages-release.test.cjs | New source/security tests, not Google integration evidence. |
| docs/NATIVE_EDAFTAR_INDEPENDENT_REVIEW.md | Findings, remediation and remaining gates. |

**Never copy repository-root Code.gs to production V2.** It is the 2026/master source plus the historical pilot route and retains legacy dispatcher code. The production routing patch closes those routes on the NEW V2 endpoint. **Never repoint the 2026 frontend/backend to the new registration endpoint.** Keep V65 pinned and untouched.

Unchanged assets: icons, manifest, sw.js, legacy HTML scripts. Do not rewrite the PWA worker, activate eBayar or copy QA setup tools into a new public API. Service .patch files are review aids against the pinned V2 source; do not force-apply mismatching hunks. Run manual file selection; do not use an unrestricted recursive clasp push from this mixed V1/V2 package.

## GAS dependencies and source parity

Requires the existing V2 Code globals/functions: SPREADSHEET_ID, TAB.DAFTAR, TAB_ADMIN/COL_ADMIN, getDaftarColMap, buildColDaftar and existing V2 HTML Admin UI. Native service and AdminV2 service above supply the remaining registration functions. Keep other installed services, scopes, triggers and receipt configuration unchanged; this package does not install or enable monthly eBayar.

References were read from feature/v2-admin-settings-minimal-qa at fd0a3c38e5d3d11c31b93633913adc3224bdfe92, not exported from installed GAS. Compare against the actual installed BACKUP/V2 files, including post-7 Nov manual patches, before applying. Preserve any newer security fixes. Stop if the selected project is the V1/2026 project or contains live HEAD triggers whose behaviour would change. An unchanged versioned /exec does not isolate HEAD-based installed triggers.

## Script Properties — staging values stay closed

| Property | Required value / purpose |
| --- | --- |
| UPKK_PAGES_EDAFTAR_MODE | QA (default) or exactly PRODUCTION. Invalid values fail closed. |
| UPKK_PAGES_EDAFTAR_QA_ENABLED | true only for controlled QA. Never used as fallback when mode is PRODUCTION. |
| UPKK_NATIVE_EDAFTAR_TEST_EMAIL | Nominated tester in QA. Keep actual value out of repo. Clearing it closes QA; production mode replaces the tester restriction explicitly. |
| UPKK_PAGES_EDAFTAR_SPREADSHEET_ID | Exact existing target workbook ID, matching the V2 Code SPREADSHEET_ID. Mandatory in production. No new workbook. |
| UPKK_NATIVE_EDAFTAR_ENABLED | false during staging; master registration-service switch. |
| UPKK_PAGES_EDAFTAR_PUBLIC_ENABLED | false during staging. true only following owner's explicit public-release instruction. |
| UPKK_PAGES_EDAFTAR_ADMIN_ENABLED | false during staging. Owner may later enable authenticated production Admin separately for private preflight; it never enables public registration. |
| UPKK_NATIVE_EDAFTAR_SLIP_FOLDER_ID | Existing restricted folder ID; not a public/link/domain-shared folder. Audit named viewers/editors and inherited ACLs, not only link setting. |
| UPKK_V2_FEES_2027 | JSON {"session":"2027","daftar":50,"bulanan":50}. Existing quote makes November registration-only RM50 and December RM100. |
| UPKK_V2_POLICY_2027 | JSON {"session":"2027","registrationStart":"2026-11-09","classStart":"2026-12-01","registrationEnd":"2026-12-31","registrationOpen":false}. Confirm actual authorised start with owner; public mode refuses missing/invalid policy, incorrect class start or unapproved fees. |
| UPKK_PAGES_EDAFTAR_OTP_DAILY_LIMIT | Optional integer 1–500; default 50. Requests reserve this budget before sending, including failed sends. Account quota reserve of 20 recipients is retained. |
| UPKK_NATIVE_EBAYAR_QA_ENABLED | false / unchanged OFF. Do not turn monthly payments on. |
| UPKK_PAGES_EDAFTAR_OTP_DAY | Internal daily counter JSON. Do not reset to bypass limits. |
| UPKK_PAGES_EDAFTAR_WRITE_HOLD | Internal circuit breaker, initially absent. Never clear automatically or merely to make a form submit. |

Per-email hourly limit: 5 requests using CacheService (best effort if Google evicts cache early). Global daily cap uses Script Properties under the native request's script lock, so rotating addresses does not evade the script's mail budget. This is not a general DDoS guarantee. OTP generation retains unpredictable existing codes; new records have absolute 10-minute expiry, at most five guesses, one-use verification and a single-use ticket.

Do not publish actual workbook/folder IDs, nominated test mailbox, credentials, OTP, auth tokens or slip URLs in GitHub documentation. Backend needs existing Sheets/Drive/Mail scopes only; no paid API or extra origin proxy. Review current appsscript.json rather than replacing it wholesale.

## Pre-deployment checks — read-only first

1. Record exact existing production and V2 project/deployment IDs and version numbers privately; confirm V65 will not be edited or repointed. Record source exports and Script Property values privately. Snapshot workbook/formulas/headers, folder ACL and triggers. Do not create another operational spreadsheet.
2. Confirm old records/receipt serials and formula ownership F2 (UMUR), K1 (NO RESIT), L1 (STATUS). New intake requires V status, W:Y fee snapshot, Z:AB audit, existing AC/AD and AE:AG year/mode/type, with the exact required headers. Do not run any QA “prepare columns” button on official data as a shortcut; if missing, stop and produce a separately reviewed minimal schema patch.
3. Confirm PENDING drives the existing formulas to PENDING with no issued receipt or confirmed payment. New write helper rejects shifted A:I fields. It writes A:E/G:I/V/W:Y/AE:AG only; no F/K/L overwrite, historical row deletion or reclassification.
4. Audit all new endpoint entry routes. New _handleApi must reject testResit, legacy Admin/list/login/maintenance calls and JSONP regardless of workbook ID or callback query. Only the new POST envelope can reach registration. Admin uses its existing authenticated GAS UI and token.
5. Validate existing V2 Admin credentials/session protection and intended access. Do not transfer six-digit/weak administrative credentials into a public release without owner review; no credential was changed here.
6. Verify Drive folder and newly created file are restricted, named ACL membership is intended, and an unauthorised signed-out user cannot read a dummy slip. Broad-access runtime checks do not audit every inherited/user/group permission.
7. Source tests: node --test tests/*.test.js tests/*.test.cjs. Verify manifest hashes for the reviewed files. Existing e33bc7d Google smoke need not be repeated unchanged; the new mode/budget/private-file/write-hold/legacy-route guards do require targeted negative checks in the existing BACKUP before release.

## Future deployment sequence — only after separate approval

1. Keep all public flags and frontend enabled=false. Apply only the reviewed service-file deltas and TWO routing function bodies to the matching V2 project. Apply AdminUI.patch to the existing matching V2 GAS HTML Admin UI at the same time; old UI without expectedVersion fails closed on approval/rejection. Do not overwrite Code.gs wholesale, install on V1, or modify V65.
2. Use the existing BACKUP for changed-guard negative checks with synthetic data. Confirm QA remains tester-only, production mode cannot fall back to QA, wrong workbook stays closed, malformed OTP/expired code is rejected, private-folder guard fails closed and an injected uncertain write is held for reconciliation. Never inject failures into the official workbook.
3. Prepare a separate new versioned V2 deployment (future owner action), with the reviewed source and intended execute-as/access configuration. Read its public POST availability with credentials omitted. Do not edit/redeploy V65. Do not set actual public flags yet.
4. Apply approved configuration to the existing official workbook-bound V2 environment, with public flag still false. A named Admin checks the locked-out state and intended headers/formulas/ACLs. Audit HEAD triggers before any editor source change.
5. Publish ONLY the four registration assets plus the index registration-link change after owner authorisation. The config endpoint is the NEW V2 endpoint; 2026 GAS_URL is untouched. Verify static files and CSP on actual Pages, including the existing network-first PWA behaviour. No PII should enter GET/query strings.
6. When owner explicitly approves opening: set master native flag, public flag, policy registrationOpen and frontend enabled as coordinated switches. Production mode/binding must already be correct. Remove no guard or old deployment. End this preparation before these actions.

Do not manually sort or insert Sheet rows while intake/approvals are active. Admin expectedVersion rejects stale list targets under the script lock, but a script lock does not prevent human edits after that check. Use filtered views or close intake for maintenance.

## Short post-deployment check

On the actual Pages origin, use a signed-out browser: correct form/rate/aggregate seats; OTP to nominated pilot mailbox; dummy slip; exactly one PENDING record; authenticated Admin read; one seat reserved; retry/replay does not create a second file/row. Repeat only what changed. Check 2026 login/dashboard through their unchanged endpoint, ensure monthly payment remains unavailable, and check no sensitive URLs/console/storage. No public/private ACL test can be replaced with a mock assertion.

## Rollback and uncertain writes

Immediate close: backend UPKK_PAGES_EDAFTAR_PUBLIC_ENABLED=false AND UPKK_NATIVE_EDAFTAR_ENABLED=false; frontend enabled=false. Native GAS UI shares the same release gate, so disabling only the Pages UI is not the sole kill switch. Leave V65/2026 endpoint pinned. If reverting frontend source, restore the prior index link only when owner approves that fallback; do not silently send guardians to a different registration service.

If UPKK_PAGES_EDAFTAR_WRITE_HOLD exists: close the public/native flags and stop new registrations. Under the operator's change-control process, inspect its row/year/mode/time; compare sheet contents, fee snapshot, slip link, quota and formulas. A complete pending row stays pending; do not resubmit it. A partial row/slip requires explicit reconciliation, never bulk row deletion or generated replacement MyKid. Clear only the hold after the row is fully reconciled and quota/formulas verified. Tickets were consumed before write; a new OTP does not bypass the hold.

If rolling backend source back, keep public/native flags OFF first and check no unresolved hold exists. Preserve the hold and uncertain records for reconciliation; do not roll back into the older unguarded submit routine while reopening. Restore only matching prior V2 source/version/property snapshots, preserving 2026 and new valid records. No automatic receipt/approval on rollback.

## Evidence and primary references

- Real BACKUP smoke: docs/NATIVE_EDAFTAR_PAGES_SMOKE_REPORT_2026-11-07.md, e33bc7d. No repeat in this preparation.
- New negative/local tests use simulated Google service boundaries; they are not claimed as new production evidence.
- [Google Content Service](https://developers.google.com/apps-script/guides/content): one-time content redirects are expected; no JSONP for sensitive data. Do not log the final redirect URL.
- [Folder sharing API](https://developers.google.com/apps-script/reference/drive/folder): broad sharing settings and explicitly named ACL membership are distinct.
- [MailApp quota API](https://developers.google.com/apps-script/reference/mail/mail-app): use the current account allowance; this package reserves operational headroom.
