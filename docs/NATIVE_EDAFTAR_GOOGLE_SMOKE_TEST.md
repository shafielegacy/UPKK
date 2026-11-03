# UPKK Native eDaftar — One-Submission Google Smoke Test

## Scope
QA branch only: `feature/native-edaftar-v1-qa`. V1 GitHub Pages `master` and existing deployed GAS `/exec` must remain unchanged until owner approval. Do **not** merge, publish GitHub Pages or change any official Google Sheets tab structure.

## How the flow runs
On public GitHub Pages, eDaftar launches the GAS-hosted instance of the *same V1 interface* using `?view=edaftar`. It deliberately does not transmit MyKid, OTP or uploaded slip via URL/JSONP. The GAS page uses `google.script.run` for sensitive operations.

## Prerequisites before any real-Google test
1. Make a versioned backup/export of the existing Google Apps Script source. Copy the QA branch's `Code.gs`, `index.html`, `NativeEdaftar.gs` and `appsscript.json` into the existing GAS project **only after reviewing impact on installed triggers**. This is not safe to do blindly: saved HEAD code is used by installed triggers, even if the V1 `/exec` deployment is versioned.
2. Avoid creating a new spreadsheet. The QA backend targets the **official** spreadsheet and tab `DAFTAR UPKK`, so any real test will write real data.
3. Create/select one private Google Drive folder for submitted slips. Never make the folder public. Record its ID.
4. Under GAS project Script Properties set:
   - `UPKK_NATIVE_EDAFTAR_ENABLED=true` (only during approved smoke test)
   - `UPKK_NATIVE_EDAFTAR_TEST_EMAIL=<one designated test email>` (mandatory during testing)
   - `UPKK_NATIVE_EDAFTAR_SLIP_FOLDER_ID=<private folder ID>`
5. Ensure GAS owner's OAuth grants include Drive, Sheets, and Mail scopes and that the deployment executes as owner.
6. Use GAS **Test deployments** `/dev?view=edaftar` as an editor of the script. `/dev` reads HEAD and is not available to the general public. Do not replace the existing `/exec` URL.

## Single smoke test
1. Sign in as an editor and open the GAS test URL `/dev?view=edaftar`.
2. Confirm same V1 interface loads and eDaftar tab is selected.
3. Use only the designated test email. Submit **dummy** guardian/student details with a synthetic (non-real) 12-digit MyKid and a harmless fake payment slip. **Do not claim an actual RM50 transfer.**
4. Verify OTP email arrives; wrong OTP is rejected; correct OTP yields a one-use submission ticket.
5. Submit once. Verify one new row in official `DAFTAR UPKK`: timestamp, email, guardian, student, MyKid, age, phone, address, slip URL, `STATUS = PENDING 2027`, **empty** BAYARAN and NO RESIT.
6. Verify the uploaded slip is in the configured **private** Drive folder; no anyone-with-link sharing.
7. Re-submit same MyKid: should be rejected with `EXISTING_STUDENT`; no extra row or slip.
8. Confirm 2026 records, old AutoCrat output columns, 12 monthly tabs and V1 parent/admin login are unchanged.
9. Remove *only* the known dummy row and dummy slip, after confirming no other linked records, and switch `UPKK_NATIVE_EDAFTAR_ENABLED=false` before leaving.

## Important limitations
- The V1 GitHub Pages URL continues to point to the existing GAS `/exec` until its frontend is released; branch QA edits alone do not deploy.
- The smoke test is **NOT VERIFIED** until performed in the actual Google Apps Script editor.
- The registration workflow does not yet include urusetia approval UI, confirmed payment state, or AutoCrat generation for 2027.
- Do not remove the test-email restriction before the owner explicitly approves public opening.
