# UPKK SL V2 — GitHub Pages Release Decision Record

**Date:** 2026-11-13. **Current decision:** QA candidate promising; official Pages **NO-GO pending release gate**.

## Verified by owner

- Admin one-OTP unified premium dashboard: 2026/2027 switching visually PASS.
- Parent one-OTP unified original premium dashboard: login, 2026/2027 switching visually PASS.
- Parent session 2027: approved QA records, child selector, Jan–Dec informational cards visible.
- 2026 dashboard monthly states and Legacy action surfaces visually remain accessible.
- STEP87 local patch installed, backup created. No Git push from installation.

## Still required for Pages GO

- Verify correct Git branch + a clean and reviewed change list, rather than copying entire QA folder.
- Confirm no pilot email, secret, token, test receipts, personal student data, backup and local-only config accidentally exposed.
- Review `UPKK_V2_PARENT_AUTH_ENABLED=true` in PILOT and the `ANYONE_ANONYMOUS` web-app access; ensure public UI does not rely on unproven authorisation boundaries.
- Validate cross-parent isolation and that public unauthorised requests cannot retrieve child data.
- Keep Native 2027 payment and public registration gates OFF pending separate owner decision.
- Resolve misleading 2027 footer and distorted summary display before official publication, or explicitly accept as a known non-security limitation.
- Confirm service worker refresh/version and rollback path.

## Approved release scope **not yet established**

The owner's expressed interest in GitHub Pages is treated as an invitation to prepare review, **not** approval to publish the current local pilot build. Push to a non-production QA branch may be authorised separately after diff inspection.

## Rollback checkpoints

- Frontend STEP87: `C:\Users\burnk\Downloads\UPKK_V2_UNIFIED_DASHBOARD_QA\STEP87_BACKUP_20261113_212455`.
- Backend: Native @6 remains unchanged since earlier deploy; Legacy V65 and earlier pinned Native versions unchanged.

**No actual Git commit / push / merge / Pages publication is claimed in this record.**
