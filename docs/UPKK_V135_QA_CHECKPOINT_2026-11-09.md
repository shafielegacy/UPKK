# UPKK V1.35 / V2 — Checkpoint QA (9 November 2026)

**Status:** QA integration IN PROGRESS; **NOT RELEASE READY**. This is a documentation-only checkpoint. No code, GitHub Pages deployment, production GAS, live spreadsheet or official Forms changed by this commit.

## Non-negotiable boundaries

- Preserve Legacy V1 / session 2026 login, parent dashboard, monthly payments, receipts, records, Forms and production V65/V66 integrations.
- Native 2027 public registration must remain closed until verified integration, security/regression testing, owner UAT and explicit release approval.
- BACKUP 07 contains synthetic QA records; it is **not** the official production workbook. Do not migrate QA student rows into live.
- Do not reactivate old AutoCrat jobs/triggers or unknown writer scripts without deliberate verification.

## Verified operator and QA observations (9 Nov)

- Existing Premium Emerald Gold parent UI is visible at https://shafielegacy.github.io/UPKK/ (v1.34 screenshot); Legacy parent dashboard was demonstrated in the conversation.
- GAS QA03 Script ID: `1mHi0ZeBC9a3ce2OmFFR768wioglRANFugp592b2HIupH71N-8GsFLXhe` (separate from production). Local clasp staging candidate: `F:\OneDrive\Documents-assets\Documents\ChatGPT\UPKK\V135_QA_INSTALL_20261109\PROJECT`.
- Operator confirmed `clasp push --user upkk-qa` for 13 QA GAS source files, then pushed a payment-policy patch and later a single-file UI loading update to QA03 HEAD. This **does not** deploy to production or automatically update the public Pages frontend.
- QA BACKUP 07 workbook ID: `1IR4-i4MLWd0lESlo9ju8kCZZg44zxwi1KGJzdM-mL_A`. Operator's schema check reported 33-column Native readiness and zero Native rows **before** smoke registration.
- QA feature flags were selectively enabled for controlled smoke testing (Native registration, Pages QA, Admin QA), while public registration and Native eBayar were kept disabled in screenshots/logs. **Recheck current property values before any future writes.**
- Real QA smoke: email OTP delivered, UI OTP verification succeeded, synthetic application saved at row 102 as `PENDING 2027`; Admin was able to load and approve that row. Result `APPROVED 2027`, paid **RM50 registration only**, receipt serial `UPKK-2027-0001`. No first-month tuition was credited. This is a ledger/serial verification, **not** proof that a receipt PDF or email was generated.
- Loading spinner UI patch was hash-verified and operator pushed updated QA03 source at 20:55:55; do not resubmit the already-approved synthetic record to test animation.
- Native Admin tab initially requested login again; after enabling Admin V2 QA flag and fresh login, the operator demonstrated access to `Permohonan Baharu` and approval in GAS `/dev`. This workflow is **not yet integrated** into public GitHub Pages.
- Prior user inspection: QA AutoCrat job list was cleared; some account-level unknown triggers were not proven associated with specific projects. Preserve the two known official production UPKK triggers; do not delete unknown triggers by assumption.

## Owner-confirmed financial policy B

- November 2026: registration RM50 reserves a place. The first class month is separately payable via Native eBayar.
- From December 2026 onward: registration RM50 plus first-month tuition RM50; parent may pay RM50 registration initially and settle first month later, or RM100 together.
- Admin must verify actual received amount. RM100 confirmed together credits exactly one first-month tuition component; never double-charge or mark the same money twice.
- Local test logs showed quotes for Nov RM50, Dec RM100 and Jan RM100, but the Dec/Jan payment workflow has **not** yet passed real Google end-to-end acceptance.
- `AC/TAHUN=2026` on a November 2026 registration is calendar year, while Native application session is 2027, as indicated by `STATUS_PERMOHONAN`.

## Approved branding and document templates

- Organisation: **Kafa & UPKK Syafie Legacy**. Emerald green / metallic gold / off-white / black. No SRA Paya Rumput branding or school logo in new Native documents.
- Preserve approved original artwork/logo provenance; do not replace official logo with a generated approximation. Primary circular Kafa & UPKK logo for portal; SL monogram may be used as faint document watermark.
- Slip Pendaftaran — Google Slides: https://docs.google.com/presentation/d/1zPnyAQx7MEESNMgNqMWdZS-SNw43tdMGX-DLYAF3CoI/edit
- Resit Bulanan — Google Slides: https://docs.google.com/presentation/d/1lF6PjR-dxNT6xhVGcmha2wtXcRUx9xkJPOHGbgIOXMY/edit
- **Important:** Google Slides deck content was inspected earlier in the day, but the owner subsequently revised the monthly receipt image. Verify the current final Slide background/merge elements before automating. The latest monthly-receipt design excludes **No. MyKid** and **Nama Penjaga** and gives **Nama Murid** several lines to accommodate multiple children; do not assume a single-child monthly receipt data model is sufficient.
- Registration slip and monthly receipt are **different documents** and have different merge needs. Existing `<<...>>` Google Slides text boxes are deliberate dynamic merge fields, not to be baked into background images. Final field mapping is not yet locked.
- The current `AdminV2.gs` approval function allocates the receipt **number**, but does **not** create a PDF or send email. The `MonthlyReceiptV2.gs` code shown by owner is monthly receipt ledger/metadata only, also **not** a PDF/email generator.
- AutoCrat is not yet configured for Native QA; consider a guarded GAS + Slides private PDF approach as an alternative, only after acceptance flow and idempotency design are verified.

## Public Pages integration findings (read-only)

- `pages/frontend-v1.34` contains the Premium parent/admin UI but does not contain `edaftar-config.js` or `edaftar.js`; no Native 2027 registration flow was found there in inspected sources.
- `feature/v2-syafie-legacy-rebranding-qa` contains `edaftar.html`, `edaftar.js` and `edaftar-config.js`, but the config remains `enabled:false, endpoint:''`. Its eDaftar transport expects a GAS HTTPS **POST** to an `/exec` URL and uses `text/plain;charset=UTF-8` with `mode:'cors'`; this needs an **actual browser cross-origin smoke test**, not a presumption that GAS automatically supports CORS.
- GAS `/dev` working is not equivalent to a published versioned `/exec` POST working from github.io. Do not publish or point Pages at old V3/deprecated/unknown deployments blindly.
- Legacy Pages backend routing and public parent login remain separate. Native Admin V2 authenticated calls via GAS HTML Service are not automatically portable to GitHub Pages; design and test a secure Pages-compatible Admin authentication/action route before exposing it.

## Next steps — execute in this order

1. Inspect and reconcile the exact current Premium Pages source/branch with Native 2027 QA source. Build/test on an isolated QA branch only; no live Pages writes.
2. Establish a safe, verified, versioned QA `/exec` endpoint and cross-origin HTTPS POST route for Native eDaftar (OTP, availability, upload, submit); keep public gate OFF and use synthetic data only.
3. Integrate and authenticate `Permohonan Baharu` in Premium Pages without introducing a client-side admin token leak or touching Legacy 2026.
4. End-to-end tests for RM50-only, RM100-in-one, remaining first-month payment, duplicate/replay and first-month credit/ledger idempotency. No arbitrary changes to production date or financial policy.
5. Finalise separately the registration slip and monthly receipt merge mappings, guarded PDF creation, private Drive destination and email dispatch with deduplication/reconciliation; **do not auto-run old AutoCrat**.
6. Test Legacy 2026 regression, security/isolation and owner UAT. Only then prepare explicit production release plan/approval.

**STOP condition:** ambiguous source, missing cross-origin/auth guarantee, unexpected writer, data/receipt duplication, or any impact on V1 production. No implied release permission from this documentation checkpoint.
