# Native eDaftar GitHub Pages — implementation & smoke test

Date: 7 November 2026 (MYT).
**Overall: BLOCKED / NO-GO for public release. Implementation candidate only.**
Production master baseline: 26154f25ec189f4b96021b61be8f42e948a2f554.
V2 source reference: feature/v2-admin-settings-minimal-qa at fd0a3c38e5d3d11c31b93633913adc3224bdfe92.

## Delivered

The standalone Premium forest/gold registration page reuses the existing V2 form fields, MyKid/date/cohort rules, OTP workflow, seat refresh and confirmation/attachment flow. The existing 2026 page changes only its registration link, to ./edaftar.html in the same tab. Login/dashboard scripts, service worker and monthly eBayar are unchanged.

The new client uses HTTPS POST with JSON in a text/plain body, readable CORS responses, credentials omitted and no referrer. It never falls back to JSONP, no-cors, a script URL or a GET payload. OTP tickets remain in memory. The backend adapter explicitly permits five existing registration functions and rejects legacy/Admin RPC, callback/prefix and non-tester email. Existing V2 services retain OTP validation, final fee validation, MyKid duplicate checks, private Drive writes and locked quota enforcement.

All configuration remains OFF, with an empty endpoint. The server additionally requires UPKK_PAGES_EDAFTAR_QA_ENABLED=true AND a nonempty UPKK_NATIVE_EDAFTAR_TEST_EMAIL. This candidate has no public mode. Removing the test email fails closed.

## Smoke test results

PASS below is limited to the evidence stated; local or VM results are not Google end-to-end results.

| Requested check | Result | Evidence / remaining limit |
| --- | --- | --- |
| 1. GitHub Pages opens without Google login | PASS, limited | Existing production page displayed without a new Google sign-in prompt. This was an existing browser profile; a clean signed-out profile was not tested. |
| 2. eDaftar opens within Pages | PASS locally; BLOCKED production | Real Chrome navigation from the candidate 2026 page opened /edaftar.html on the same local origin/tab. No /exec page navigation. Candidate has not been published to GitHub Pages. |
| 3. Registration amount | PASS in VM | Exact reused V2 quote helper: 30 Nov RM50, 1 Dec RM100, 1 Jan RM100; first-month field empty in Nov and 2026-12 in Dec. Browser shows both published rates. Actual deployed fee/policy properties not audited. |
| 4. Tahun 3–5 and quota | PASS cohort UI; BLOCKED real quota | Real Chrome dummy MyKid: 2018 -> T3, 2017 -> T4, 2016 -> T5; 2015 ineligible and invalid February date rejected. VM checks pending + approved count, rejected/other-year excluded. Actual seat responses, final seat race and Google quota limits not tested. |
| 5. OTP send and verify | BLOCKED | V65 rejects the new POST route; no OTP request sent. Adapter/POST-body tests pass with stubbed Google side effects. |
| 6. Evidence upload | BLOCKED | File chooser opened but automation file selection rejected by Chrome extension file-access setting. No file uploaded to Drive. MIME/3 MB client validation and existing V2 server service retained; real upload not verified. |
| 7. Save as PENDING | BLOCKED | No registration submitted and no Google Sheets rows written. |
| 8. Admin reads application | BLOCKED | No new test application exists. Admin logic was not changed. |
| 9. 2026 login/dashboard | PASS source regression; BLOCKED authenticated browser flow | Existing live login screen displayed. Legacy scripts unchanged; both existing test files pass. No dummy 2026 login credentials were used; actual dashboard session not tested. |
| 10. Duplicate/privacy | PASS unit/source; BLOCKED end-to-end | Client has no automatic submit retry and locks further submit after a transmitted request. Sensitive values stay in POST bodies, not application URLs/storage/JSONP. Existing V2 lock/duplicate checks reused. No real concurrent/partial-write Google test or complete privacy audit claimed. |

Responsive browser checks: 390 and 360 viewport overrides; single-column form computed at both widths and no horizontal overflow observed at 360. Desktop/default form opened. Viewport override reset afterwards.

### Read-only V65 compatibility probe

The candidate client temporarily targeted the already-known V65 /exec URL locally and sent ONLY:
{"action":"pagesNativeEdaftar","rpc":"getNativeEdaftarAvailability","args":[]}

No child data, email, OTP or slip was included. Chrome read the response:
**"API awam tidak tersedia. Gunakan portal UPKK rasmi."**
No console warning/error was captured for the probe.

This proves readable cross-origin HTTPS POST for that local-origin read-only probe and confirms that the current deployment blocks this route. It does NOT prove POST from the actual GitHub Pages origin or successful registration. V65 configuration/code was not changed. Local configuration was immediately restored OFF/empty. No production guard was removed.

## Automated verification

Command: node --test tests/*.test.js tests/*.test.cjs

- 14 new node:test cases PASS.
- Both existing legacy test files PASS (19 internal checks printed).
- Node test runner summary: 16 entries PASS, 0 FAIL (14 cases + 2 legacy file entries).
- Syntax parsing PASS for edaftar.js, Code.gs and PagesEdaftar.gs.
- Initial seven adapter tests were observed failing because the adapter did not exist, then passed after implementation.
- Fee/cohort/quota excerpts in tests/fixtures/v2-registration-helpers.js are unchanged functions from the pinned V2 reference. They verify that snapshot, not independently fetched current GAS deployment code.
- Google services in adapter tests are stubs. They are not evidence of real email, Drive or Sheets operations.

## Changed files

| File | Change |
| --- | --- |
| index.html | One registration anchor changed to ./edaftar.html, same tab. No login/dashboard function changes. |
| edaftar.html / edaftar.css | Standalone responsive Premium V2 registration form; restrictive CSP, no inline event handlers or external scripts. |
| edaftar.js | Reused V2 UI validation adapted to POST, asynchronous email binding, no automatic retries, uncertain-save lock. |
| edaftar-config.js | OFF/empty by default. No credentials. |
| PagesEdaftar.gs | Narrow, POST-only, tester-only adapter for existing V2 registration services. |
| Code.gs | One route line inside existing doPost, before legacy dispatcher. No doGet/JSONP changes. |
| tests/pages-edaftar.test.cjs | Adapter, transport, privacy, cohort and fee checks. |
| tests/fixtures/v2-registration-helpers.js | Pinned V2 helper excerpts with provenance. |
| docs/NATIVE_EDAFTAR_PAGES_PLAN.md | Short implementation plan. |
| This report | Results, blockers and release/rollback steps. |

## Next safe step: existing isolated Google test environment

1. Use an EXISTING non-live GAS/Sheets test environment with synthetic records; do not create a spreadsheet, repoint production, alter V65 or enable public intake.
2. Compare its installed V2 NativeEdaftar.gs/AdminV2.gs and doPost against the pinned source. Preserve the existing spreadsheet ID, private folder, formulas, quota headers and properties.
3. Add ONLY PagesEdaftar.gs and this line to that project's current V2 doPost, immediately after parsing the JSON body and before its legacy dispatcher:

   if (body.action === 'pagesNativeEdaftar') return pagesNativeEdaftarPost_(body);

   **Do not overwrite the deployed V2 Code.gs with this branch's V1/master Code.gs.** The branch patch records the insertion point; the rest is the unchanged 2026 master source.
4. Configure the existing test-email restriction plus the new QA flag. Preserve the native registration flag, intake policy and existing fee/slip-folder settings. Confirm RM50/RM50 and class start 1 Dec 2026. No eBayar flag changes.
5. A browser-callable /exec TEST endpoint must serve the adapter. A /dev endpoint requiring the owner's Google cookies cannot prove anonymous Pages access because this client omits credentials. Leave V65 untouched. If no suitable existing endpoint can be safely updated, keep BLOCKED.
6. Point a controlled preview to that test endpoint, then run OTP, dummy attachment, PENDING, Admin read, duplicate attempt, quota and recovery checks. Repeat from the actual Pages origin in a signed-out browser before release. Never submit this smoke test against the official live workbook.
7. Fix extension file selection access only through the user's normal settings/approval flow, or let the owner choose the synthetic file manually. No permission change was made by the agent.

## Release and rollback

Do not merge/publish or enable public registration while any Google end-to-end blocker remains. Public mode needs a separately reviewed explicit release gate; this pilot cannot open by clearing the tester property. Production private-folder access and source/deployment parity remain unverified.

After the tests pass, prepare a reviewed frontend release using the new static files and the single index anchor change. Install only the additive adapter/route into the matching V2 backend under an authorised deployment plan. Do not replace 2026 backend code with V2 or vice versa. Existing 2026 functions, workbook records, formulas and receipts must remain intact.

Rollback: switch the new client configuration OFF and the new server QA flag OFF. Restore the index anchor from the baseline if the frontend was published; remove/disable only the additive POST route if required. Preserve all existing deployments and rows. Do not delete an uncertain submission or its private slip; urusetia must reconcile it.

No paid API used. No new spreadsheet. No OTP email sent. No registration, Drive file, public activation, merge or deployment performed.

## Independent review status

Independent source review remains **BLOCKED / outstanding**: source-read attempts did not complete. No independent conclusion about async state, duplicate protection or transport correctness is claimed. The implementer inspected those paths and the automated checks above pass; these do not replace a completed independent review.
