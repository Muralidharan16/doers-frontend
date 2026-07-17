# Phase 0B — Baseline Integrity and Trust Blockers Plan

## 9.1 Document Control

| Field | Value |
|---|---|
| **Title** | Phase 0B Baseline and Trust Blockers Plan |
| **Phase** | 0B — Planning Only |
| **Status** | REPAIRED (v0.5-draft) — READY FOR G-01R PRODUCT OWNER REVIEW. NO IMPLEMENTATION AUTHORIZED. |
| **Governing Constitution** | `docs/frontend/DOERS_PRODUCT_UI_UX_CONSTITUTION.md` |
| **Governing Constitution Commit** | `df4e5cb23f61e8141a6d0698193826839c924a48` |
| **Governing Constitution SHA-256** | `7f1c1b223921eaba780148c96ac9d999944142a9a24df86e4162d33032e24012` |
| **Repository** | `git@github.com:Muralidharan16/doers-frontend.git` |
| **Branch** | `main` |
| **Baseline Commit** | `df4e5cb23f61e8141a6d0698193826839c924a48` |
| **Date** | 2026-07-17 |
| **Prior Plan SHA-256** | `81eb1735102a0b9773bf0748ad9ce8769b5198941de3ddb959a27c94c68df971` |
| **Authorization Limits** | Planning-document repair only. No implementation, staging, committing, pushing, merging, rebasing, pulling, branch creation or pull-request creation is authorized. |

### Revision History

| Version | Summary |
|---|---|
| 0.1-draft | Initial investigation (1820 lines) |
| 0.2-draft | First corrections: PB isolation, index gating, auth assumptions |
| 0.3-draft | Consistency: manifest, test commands, gate split |
| 0.4-draft | Document repair: authoritative manifest, complete blocker inventory, work packages, test register, reconciled counts |
| 0.5-draft | Exact compliance: v0.5 version, 50 verification cases (49 automated + 1 manual RT-04), 8-column declaration manifest, 15-field blocker entries, 18-field work packages, 7-column verification register, corrected acceptance criteria, AT-01–08 blocked on OQ-01 |

---

## 9.2 Executive Summary

Six production pages display fabricated operational data. Eight unsupported compliance claims exist. Authentication has logout + 401-cleanup gaps. Five demo toggles have no persistence. Fourteen `toISOString()` expressions: 10 confirmed local-date bugs (IST midnight–5:29 AM), 4 deferred pending backend contracts. Repository: `.env` tracked, 57 generated `.d.ts` files in `src/`, 38 ESLint errors.

Phase 0B will: remove fabricated data and claims; apply truthful unavailable states; gate/disable non-functional controls; fix 10 local-date expressions; add backend logout (after OQ-01) + P0B-011A cleanup; add 404, error boundaries, focus indicators, dialog ARIA, reduced-motion; add 50 verification cases (49 automated + 1 manual); delete 57 generated `.d.ts` files from manifest; add `.gitignore` patterns. No Platform Billing changes. No minimum-age/overnight-hours/emergency-contact changes.

**Status:** 26 Active only, 1 Hybrid (P0B-013: 10 active + 4 blocked expressions), 3 Blocked only, 4 Deferred, 1 Documented-only, 1 Protected-boundary = 36 total findings. Implementation remains unauthorized. OQ-01, OQ-02, OQ-03, OQ-05 are blocking. OQ-04, OQ-06 resolved per approved safe defaults.

---

## 9.3 Baseline Evidence

| Item | Value |
|---|---|
| Repository | `/home/jeevashri/Projects/doers-front/doers-frontend` |
| Remote | `git@github.com:Muralidharan16/doers-frontend.git` |
| Branch | `main` |
| HEAD / origin/main | `df4e5cb23f61e8141a6d0698193826839c924a48` |
| Product Constitution SHA-256 | `7f1c1b223921eaba780148c96ac9d999944142a9a24df86e4162d33032e24012` |
| Enterprise Constitution SHA-256 | `603b385af500efc808faae11f26865e1f79392811e035b55d354b3318198f3e9` |
| Untracked files | `docs/enterprise/DOERS_ENTERPRISE_QUALITY_CONSTITUTION.md`, `docs/frontend/PHASE_0B_BASELINE_AND_TRUST_BLOCKERS_PLAN.md` |
| `.d.ts` files in `src/` | 58 (from `find src -type f -name '*.d.ts' \| wc -l`) |
| Platform Billing `.d.ts` | 0 (verified) |
| React Router | v7.15.0 (native `errorElement`) |
| ESLint | 38 errors, 0 warnings; `tsc --noEmit` — 0 errors |
| Package scripts | `test`=`vitest run`, `test:platform-billing`=`vitest run src/features/platformBilling` |
| IST vulnerable interval | 12:00 AM–5:29 AM IST |
| Verified source paths | `src/components/settings/MembershipPlanForm.tsx`, `src/pages/subscriptions/page.tsx` — both exist |

---

## 9.4 Scope Boundaries

### In Scope

Remove fabricated operational data + unsupported claims. Add `.gitignore` patterns (working-tree only). Fix `emitDeclarationOnly`: `declarationDir` + delete 57 NON_PLATFORM_GENERATED_CANDIDATE from manifest. Fix 10 confirmed local-calendar-date expressions; defer 4. Gate/disable non-functional controls per matrix. Remove `alert()`/`prompt()` from fabricated pages; preserve `window.confirm()` for real destructive ops. Retain overnight-hours validation. Block emergency-contact change. Add 404 + `errorElement`. Add backend logout (after OQ-01) + P0B-011A cleanup. Add 50 verification cases (49 automated + 1 manual). Protect PB. Protect both constitutions. Document localStorage risk in decision record.

### Out of Scope

Minimum-age change, overnight-hours removal, full auth redesign, design-system consolidation, vocabulary adaptation, navigation restructure, all backend-dependent features (Phases 5–8), full accessibility audit, `git rm --cached` during implementation (separate authorization).

### Protected — Absolute Prohibition

`src/features/platformBilling/**`, `docs/enterprise/DOERS_ENTERPRISE_QUALITY_CONSTITUTION.md`, `docs/frontend/DOERS_PRODUCT_UI_UX_CONSTITUTION.md`, PB feature flags, PB routes, PB settings integration.

---

## 9.5 Trust-Blocker Inventory

### P0B-001 — `.env` Tracked; `.gitignore` Incomplete

| Field | Value |
|---|---|
| **ID** | P0B-001 |
| **Title** | `.env` tracked in Git index; `.gitignore` missing `.env` and `*.tsbuildinfo` |
| **Category** | Repository Hygiene |
| **Severity** | High |
| **Primary Status** | Active |
| **User Impact** | Secret values could be accidentally committed |
| **Exact Evidence** | `.gitignore` — no `.env` pattern; `git ls-files .env` confirms tracked; `.env` contains `VITE_API_BASE_URL=http://127.0.0.1:8000` |
| **Confirmed Facts** | `.env` is tracked; `.gitignore` uses only `*.local` pattern; current `.env` value is a localhost URL |
| **Assumptions/Unknowns** | `.env` git history not yet reviewed for prior secret exposure |
| **Root Cause** | Vite template `.gitignore` does not include `.env` |
| **Phase 0B Treatment** | 0B.1A: Add `.env`, `.env.*` (except `.env.example`), `*.tsbuildinfo` to `.gitignore`. Review git history. 0B.1B (separate authorization): `git rm --cached .env tsconfig.tsbuildinfo`. |
| **Deferred Dependency** | None |
| **Protected Boundary** | None |
| **Verification-Case IDs** | None (configuration change — verified via Git commands) |
| **Acceptance Evidence** | After 0B.1B: `git ls-files .env` empty; `.env` on disk; Vite reads it |

### P0B-002 — 57 Generated `.d.ts` Files in `src/`

| Field | Value |
|---|---|
| **ID** | P0B-002 |
| **Title** | `emitDeclarationOnly` with `composite:true` and no `declarationDir` produces 57 generated files in source tree |
| **Category** | Repository Hygiene / Build |
| **Severity** | Medium |
| **Primary Status** | Active |
| **User Impact** | Source tree pollution; confusion between hand-written and generated types |
| **Exact Evidence** | `tsconfig.app.json:3,15`; `find src -type f -name '*.d.ts' \| wc -l` = 58; full manifest at Section 9.8-A |
| **Confirmed Facts** | 57 candidates have corresponding `.ts`/`.tsx` sources; declaration content mechanically matches exports; no ambient `declare module` patterns; `MembershipPlanForm.d.ts` confirmed NOT on filesystem |
| **Assumptions/Unknowns** | None — all 57 candidates confirmed generated |
| **Root Cause** | `declarationDir` never configured; `composite:true` requires declarations somewhere |
| **Phase 0B Treatment** | Add `"declarationDir": "./node_modules/.tmp/declarations"` to `tsconfig.app.json`. Preserve `composite:true`. Delete 57 from manifest after `find`/manifest comparison. Preserve `vite-env.d.ts`. Controlled `npm run build`. |
| **Deferred Dependency** | None |
| **Protected Boundary** | Platform Billing has zero `.d.ts` files |
| **Verification-Case IDs** | BT-01, BT-02 |
| **Acceptance Evidence** | `find src/ -name '*.d.ts'` returns only `vite-env.d.ts`; `tsc --noEmit` passes; `npm run build` succeeds; `npm run test:platform-billing` passes |

### P0B-003 — Fabricated Dashboard Data

| Field | Value |
|---|---|
| **ID** | P0B-003 |
| **Title** | Dashboard displays randomly generated charts, hardcoded metrics, fake statuses, dead buttons |
| **Category** | Data Truth |
| **Severity** | Critical |
| **Primary Status** | Active |
| **User Impact** | Operators see fabricated 42% occupancy, 128 check-ins, ₹12,500/mo, random chart bars, fake operational health |
| **Exact Evidence** | `dashboard/page.tsx:207` — `Math.random()*70`; `:82` — `"Healthy"`; `:86` — `"Professional Operating Plan"`; `:87` — `"8 Trial Days Remaining"`; `:110` — `"₹12,500 / mo"`; `:139` — `42%`; `:165` — `128`; `:265` — `"Sensor signals healthy"`; `:285-286` — hardcoded alerts; `:350-356` — fake operational insights; `:55-68,119-123,328-338` — dead buttons |
| **Confirmed Facts** | All listed literals hardcoded in source; `Math.random()` called during render; no backend aggregation API |
| **Assumptions/Unknowns** | None |
| **Root Cause** | Dashboard built as visual prototype; no backend aggregation API |
| **Phase 0B Treatment** | HONEST_EMPTY_STATE. Remove each fabricated literal. Remove `Math.random()`. Preserve API-connected data (PB status, org name, branch count). Truthful wording: "This feature is not available in the current version." No invented contacts/deliveries. |
| **Deferred Dependency** | Phase 8 |
| **Protected Boundary** | PB status card — must not be altered |
| **Verification-Case IDs** | TT-01, TT-02, TT-03 |
| **Acceptance Evidence** | Fabricated literals absent; API data preserved; dead buttons removed |

### P0B-004 — Fabricated Attendance Data

| Field | Value |
|---|---|
| **ID** | P0B-004 |
| **Title** | Attendance page: `MOCK_CHECKINS`, random heatmap, hardcoded metrics |
| **Category** | Data Truth |
| **Severity** | Critical |
| **Primary Status** | Active |
| **User Impact** | Fabricated check-in logs, random heatmap, "99.8% Healthy", "64 minutes average stay" |
| **Exact Evidence** | `attendance/page.tsx:7-18` — `MOCK_CHECKINS` 10 entries; `:34` — `Math.floor(Math.random()*100)`; `:177-189` — hardcoded metrics; `:195` — `"Secure biometric sync enabled"` |
| **Confirmed Facts** | All attendance data is `useState(MOCK_CHECKINS)`; no backend API |
| **Assumptions/Unknowns** | None |
| **Root Cause** | Attendance page built as visual prototype |
| **Phase 0B Treatment** | HONEST_EMPTY_STATE |
| **Deferred Dependency** | Phase 6 |
| **Protected Boundary** | None |
| **Verification-Case IDs** | TT-04 |
| **Acceptance Evidence** | `MOCK_CHECKINS` absent; `Math.random()` absent; claim string absent |

### P0B-005 — Fabricated Billing Data

| Field | Value |
|---|---|
| **ID** | P0B-005 |
| **Title** | Billing: `MOCK_PAYMENTS`, `alert()`, hardcoded ₹ totals |
| **Category** | Data Truth |
| **Severity** | Critical |
| **Primary Status** | Active |
| **User Impact** | Fabricated payment ledgers, fake ₹ amounts, false 82% settlement rate |
| **Exact Evidence** | `billing/page.tsx:8-14` — `MOCK_PAYMENTS`; `:22` — `alert()`; `:76-108` — hardcoded ₹ |
| **Confirmed Facts** | All billing data is `useState(MOCK_PAYMENTS)`; no backend API |
| **Assumptions/Unknowns** | None |
| **Root Cause** | Billing page built as visual prototype |
| **Phase 0B Treatment** | HONEST_EMPTY_STATE. Clearly differentiated from Platform Billing. |
| **Deferred Dependency** | Phase 7 |
| **Protected Boundary** | Must not display/mix PB invoices with facility commerce |
| **Verification-Case IDs** | TT-05 |
| **Acceptance Evidence** | `MOCK_PAYMENTS` absent; hardcoded ₹ absent; `alert()` absent |

### P0B-006 — Fabricated Reports Data

| Field | Value |
|---|---|
| **ID** | P0B-006 |
| **Title** | Reports: hardcoded SVG, `alert()`, "REGISTRY SECURE" |
| **Category** | Data Truth |
| **Severity** | Critical |
| **Primary Status** | Active |
| **User Impact** | Fake report charts; non-functional "Generate Report" |
| **Exact Evidence** | `reports/page.tsx:19` — `alert()`; `:103` — `"REGISTRY SECURE"` |
| **Confirmed Facts** | All report data is hardcoded; no backend API |
| **Assumptions/Unknowns** | None |
| **Root Cause** | Reports page built as visual prototype |
| **Phase 0B Treatment** | HONEST_EMPTY_STATE |
| **Deferred Dependency** | Phase 8 |
| **Protected Boundary** | None |
| **Verification-Case IDs** | TT-06 |
| **Acceptance Evidence** | Claim string absent; `alert()` absent; hardcoded SVG removed |

### P0B-007 — Fabricated Gyms Data

| Field | Value |
|---|---|
| **ID** | P0B-007 |
| **Title** | Gyms: `MOCK_GYMS`, `prompt()`, "biometric GPS disabled" |
| **Category** | Data Truth |
| **Severity** | Critical |
| **Primary Status** | Active |
| **User Impact** | Fake gym listings with fake member counts and revenue; "Add Gym" uses browser `prompt()` |
| **Exact Evidence** | `gyms/page.tsx:8-27` — `MOCK_GYMS`; `:32-48` — `prompt()`; `:88` — claim |
| **Confirmed Facts** | Real location data exists in settings; `/gyms` page is disconnected mock |
| **Assumptions/Unknowns** | None |
| **Root Cause** | Gyms page built as visual prototype separate from real location management |
| **Phase 0B Treatment** | REDIRECT `/gyms` → `/settings?tab=branches`. Remove mock data. OQ-04 approved safe default. |
| **Deferred Dependency** | Phase 3 (may further refine after vocabulary) |
| **Protected Boundary** | Real location management must remain functional |
| **Verification-Case IDs** | TT-07 |
| **Acceptance Evidence** | `MOCK_GYMS` absent; `prompt()` absent; claim absent; redirect works |

### P0B-008 — Unsupported Security & Compliance Claims

| Field | Value |
|---|---|
| **ID** | P0B-008 |
| **Title** | Eight unverified claims: SOC 2, ISO, SECURE CLOUD, biometric, sensor, registry, operational |
| **Category** | Security / Data Truth |
| **Severity** | Critical |
| **Primary Status** | Active |
| **User Impact** | False advertising; legal liability; broken user trust |
| **Exact Evidence** | `signup/page.tsx:274-278` — "SECURE CLOUD", "SOC 2 CERTIFIED", "ISO ENCRYPTED"; `login/page.tsx:182` — "All Systems Operational"; `attendance/page.tsx:195`; `gyms/page.tsx:88`; `dashboard/page.tsx:265`; `reports/page.tsx:103` |
| **Confirmed Facts** | All claims are hardcoded strings; no certification/compliance evidence exists |
| **Assumptions/Unknowns** | None |
| **Root Cause** | Decorative text added during prototyping without verification |
| **Phase 0B Treatment** | REMOVE_FROM_PRODUCTION_UI. Exact strings in Section 9.13. |
| **Deferred Dependency** | None — removal is self-contained |
| **Protected Boundary** | None |
| **Verification-Case IDs** | TT-08, TT-09 |
| **Acceptance Evidence** | Each exact claim string absent from specified file |

### P0B-009 — Non-Functional Settings Controls

| Field | Value |
|---|---|
| **ID** | P0B-009 |
| **Title** | Five toggle switches + "Delete Gym" have no backend persistence |
| **Category** | Controls / Data Truth |
| **Severity** | High |
| **Primary Status** | Active |
| **User Impact** | Toggles visually change but affect only `useState`, reset on refresh; "Delete Gym" calls `alert()` with no actual deletion |
| **Exact Evidence** | `settings/page.tsx:27-29` — demo `useState`; `:190-203` — 2FA/Auto Sign-Out noop; `:209-222` — notification noop; `:172` — Delete Gym `alert()` |
| **Confirmed Facts** | No backend endpoints exist for any of these controls |
| **Assumptions/Unknowns** | None |
| **Root Cause** | Settings page sections built as static demonstrations |
| **Phase 0B Treatment** | Per matrix: Security+Notifications HIDE; Delete Gym REMOVE; Email+Product DISABLED_SEMANTIC_CONTROL |
| **Deferred Dependency** | Phase 4 (2FA), Phase 5 (notifications) |
| **Protected Boundary** | None |
| **Verification-Case IDs** | CT-01, CT-02, CT-03, CT-04 |
| **Acceptance Evidence** | Hidden tabs not rendered; disabled toggles have `disabled` + ARIA; Delete Gym absent |

### P0B-010 — Google/Forgot-Password No-Ops

| Field | Value |
|---|---|
| **ID** | P0B-010 |
| **Title** | Google sign-in calls `console.log()`; forgot-password is dead `href="#"` |
| **Category** | Controls / Security |
| **Severity** | High |
| **Primary Status** | Active |
| **User Impact** | Users click "Google Account" expecting OAuth — nothing happens; "Forgot password?" is a dead link |
| **Exact Evidence** | `login/page.tsx:148-161` — `onClick={() => console.log('Social sign in')}`; `:89-95` — `<a href="#" ...>` |
| **Confirmed Facts** | No Google OAuth integration; no password reset flow |
| **Assumptions/Unknowns** | None |
| **Root Cause** | Social login and password reset planned but never implemented |
| **Phase 0B Treatment** | HIDE both. No invented contacts. |
| **Deferred Dependency** | Phase 4 |
| **Protected Boundary** | None |
| **Verification-Case IDs** | CT-05, CT-06 |
| **Acceptance Evidence** | Neither element in DOM |

### P0B-011 — Client Logout Doesn't Call Backend

| Field | Value |
|---|---|
| **ID** | P0B-011 |
| **Title** | `handleLogout()` never calls `POST /auth/logout` |
| **Category** | Security |
| **Severity** | High |
| **Primary Status** | Blocked (OQ-01) |
| **User Impact** | If backend relies on server-side session tracking, tokens may remain valid after sign-out |
| **Exact Evidence (FRONTEND CONFIRMED)** | `Sidebar.tsx:63-73` — clears local, never calls `authApi.logout()`; `authApi.ts:81-83` — `logout` method exists, zero callers |
| **Confirmed Facts** | Frontend logout method exists but is never called |
| **Assumptions/Unknowns** | Whether `POST /auth/logout` invalidates refresh tokens, cookies, or nothing |
| **Root Cause** | Backend logout endpoint was added to API service after sidebar handler was written |
| **Phase 0B Treatment** | After authoritative source inspection + contract confirmed: add `await authApi.logout()` with try/catch; always proceed with local cleanup. AT-01 through AT-08 blocked until OQ-01 resolved. |
| **Deferred Dependency** | OQ-01 (blocking) |
| **Protected Boundary** | PB interceptor not altered |
| **Verification-Case IDs** | AT-01, AT-02, AT-03, AT-04, AT-05, AT-06, AT-07, AT-08 (all blocked on OQ-01) |
| **Acceptance Evidence** | Contract verified; 8 cases pass; `npm run test:platform-billing` passes |

### P0B-011A — BranchManagementSection 401 Cleanup Gap

| Field | Value |
|---|---|
| **ID** | P0B-011A |
| **Title** | `BranchManagementSection.tsx` 401 handler redirects without clearing auth storage |
| **Category** | Security |
| **Severity** | High |
| **Primary Status** | Active |
| **User Impact** | Stale auth data in localStorage after component-level 401; mismatch between apparent auth state and actual API access |
| **Exact Evidence** | `BranchManagementSection.tsx:115-116` — `window.location.assign('/login')` without `clearAuth()` or `localStorage.removeItem('auth-storage')`. Global interceptor at `client.ts:142-143` does both. |
| **Confirmed Facts** | Component handler bypasses global interceptor cleanup |
| **Assumptions/Unknowns** | None |
| **Root Cause** | Component-level 401 catch written without awareness of global cleanup sequence |
| **Phase 0B Treatment** | Add `clearAuth()` + `localStorage.removeItem('auth-storage')` before redirect. Part of Phase 0B (fixes broken cleanup, not new architecture). |
| **Deferred Dependency** | None |
| **Protected Boundary** | PB interceptor not altered |
| **Verification-Case IDs** | AT-09 |
| **Acceptance Evidence** | Component 401 clears auth storage before redirect; test passes |

### P0B-012 — Tokens in localStorage

| Field | Value |
|---|---|
| **ID** | P0B-012 |
| **Title** | `access_token` + `refresh_token` in `localStorage` — XSS risk |
| **Category** | Security |
| **Severity** | High |
| **Primary Status** | Documented-only |
| **User Impact** | Any XSS vulnerability in any dependency can extract tokens |
| **Exact Evidence** | `authStore.ts:46` — Zustand persist; `client.ts:46,100-102,121-129` — interceptor reads/writes localStorage |
| **Confirmed Facts** | Both tokens stored in localStorage via Zustand persist middleware |
| **Assumptions/Unknowns** | Phase 4 architecture decision pending |
| **Root Cause** | Architecture decision to use Zustand persist for auth state |
| **Phase 0B Treatment** | DOCUMENT_IN_DECISION_RECORD (Section 9.11). No source-code comments. No functional changes to shared client. |
| **Deferred Dependency** | Phase 4 |
| **Protected Boundary** | PB interceptor; shared `client.ts` — no functional changes |
| **Verification-Case IDs** | None (documentation only) |
| **Acceptance Evidence** | Risk documented in decision record; no changes to auth store or client |

### P0B-013 — UTC Date Bug

| Field | Value |
|---|---|
| **ID** | P0B-013 |
| **Title** | 14 `toISOString()` expressions — 10 local-date bugs (IST midnight–5:29 AM), 4 deferred |
| **Category** | Data Correctness |
| **Severity** | Critical |
| **Primary Status** | Hybrid active/blocked (1 finding with subscopes) |
| **User Impact** | Users in IST (midnight–5:29 AM) see dates shifted backward by one day in operating-hour `valid_from`, plan validity, subscription dates, dashboard filters |
| **Exact Evidence** | Full inventory Appendix B. 10 LOCAL_CALENDAR_DATE_INPUT: `dashboard/page.tsx:8,9`, `OperatingHoursDayRow.tsx:28,39,54,65,94`, `BranchOperatingHoursSection.tsx:74,193`, `subscriptions/page.tsx:38`. 4 API_DEFINED_DATE: `MembershipPlanForm.tsx:64,65` (verified path exists), `subscriptions/page.tsx:101,109` (verified path exists). |
| **Confirmed Facts** | IST vulnerability 12:00 AM–5:29 AM; both source files for deferred expressions confirmed to exist |
| **Assumptions/Unknowns** | B-14, B-15 — backend date contracts unconfirmed for 4 deferred expressions |
| **Root Cause** | `toISOString()` returns UTC; `split('T')[0]` extracts UTC date not local date |
| **Phase 0B Treatment** | Replace 10 with `getLocalDateString(date?:Date)`. Create `shared/utils/date.ts`. Defer 4 pending B-14/B-15. |
| **Deferred Dependency** | B-14, B-15 for 4 deferred expressions |
| **Protected Boundary** | None |
| **Verification-Case IDs** | DC-01 through DC-07 |
| **Acceptance Evidence** | 10 replaced; 7 cases pass; 4 documented as deferred |

### P0B-014 — Pagination Metadata Ignored

| Field | Value |
|---|---|
| **ID** | P0B-014 |
| **Title** | Backend returns `total`/`page`/`pages`; frontend ignores it |
| **Category** | Data Correctness |
| **Severity** | High |
| **Primary Status** | Active |
| **User Impact** | Organizations with >50 members or subscriptions cannot view records beyond first page |
| **Exact Evidence** | `members/page.tsx:259-260` — `page:1,limit:50`; `members/types/member.ts:78-81` — `total/page/size/pages`; same for subscriptions |
| **Confirmed Facts** | Backend pagination metadata confirmed in API response types and parsers |
| **Assumptions/Unknowns** | None |
| **Root Cause** | Pagination UI components never implemented |
| **Phase 0B Treatment** | Info message when `total > data.length`. Retain limit 50. |
| **Deferred Dependency** | Phase 1 (Pagination component), Phase 5 (full management) |
| **Protected Boundary** | None |
| **Verification-Case IDs** | DC-08, DC-09 |
| **Acceptance Evidence** | Info shown when total exceeds returned; absent when equal |

### P0B-015 — Overnight Hours Blocked (BLOCKED)

| Field | Value |
|---|---|
| **ID** | P0B-015 |
| **Title** | Client validation rejects cross-midnight ranges; backend unconfirmed |
| **Category** | Data Correctness |
| **Severity** | High |
| **Primary Status** | Blocked (OQ-02) |
| **User Impact** | Gyms operating past midnight cannot save actual hours |
| **Exact Evidence** | `BranchOperatingHoursSection.tsx:110-115,156-161` — `if (openStr >= closeStr)` |
| **Confirmed Facts** | Client-side lexicographic string comparison rejects overnight |
| **Assumptions/Unknowns** | Backend validation behavior not inspected |
| **Root Cause** | String comparison: `"22:00" >= "02:00"` is true |
| **Phase 0B Treatment** | Retain validation. Message: "Overnight operating hours are not currently available." |
| **Deferred Dependency** | OQ-02 (blocking); Phase 3/6 |
| **Protected Boundary** | None |
| **Verification-Case IDs** | None |
| **Acceptance Evidence** | Validation active; truthful message present |

### P0B-016 — Emergency Contact Naming (BLOCKED)

| Field | Value |
|---|---|
| **ID** | P0B-016 |
| **Title** | `emergency_contact_name` semantics unconfirmed |
| **Category** | Data Correctness |
| **Severity** | Medium |
| **Primary Status** | Blocked (OQ-03) |
| **User Impact** | Field named "_name" but validated as phone — data model mismatch |
| **Exact Evidence** | `members/types/member.ts:20` — named "_name", validated as phone at `members/page.tsx:314-316` |
| **Confirmed Facts** | UI labels phone fields; data model names them as names |
| **Assumptions/Unknowns** | Backend intent: name, phone, or legacy overloaded value |
| **Root Cause** | Field semantics never formally defined |
| **Phase 0B Treatment** | IMPLEMENTATION BLOCKED pending backend-contract inspection. |
| **Deferred Dependency** | OQ-03 (blocking); Phase 5 |
| **Protected Boundary** | None |
| **Verification-Case IDs** | Deferred until contract resolved |
| **Acceptance Evidence** | Blocker documented as blocked |

### P0B-017 — Hardcoded Minimum Age (DEFERRED)

| Field | Value |
|---|---|
| **ID** | P0B-017 |
| **Title** | Age 3 hardcoded; no configurable policy |
| **Category** | Data Correctness |
| **Severity** | Low |
| **Primary Status** | Deferred |
| **User Impact** | Organizations accepting members younger than 3 cannot add them |
| **Exact Evidence** | `members/page.tsx:312` — `if (age < 3)` |
| **Confirmed Facts** | Static validation without organization-level configuration |
| **Assumptions/Unknowns** | Organization policy model not yet designed |
| **Root Cause** | Policy configuration system not implemented |
| **Phase 0B Treatment** | DEFER TO PHASE 5. No change. |
| **Deferred Dependency** | Phase 5 |
| **Protected Boundary** | None |
| **Verification-Case IDs** | None |
| **Acceptance Evidence** | Finding documented as deferred |

### P0B-018 — Native Dialog Calls

| Field | Value |
|---|---|
| **ID** | P0B-018 |
| **Title** | `alert()`, `prompt()`, `window.confirm()` in production pages |
| **Category** | Controls / UX |
| **Severity** | High |
| **Primary Status** | Active (scoped) |
| **User Impact** | Production workflows degraded by browser-native dialogs |
| **Exact Evidence** | `gyms` — `prompt()`; `reports/billing/settings` — `alert()`; `members/plans/contacts` — `window.confirm()` |
| **Confirmed Facts** | Native dialogs used in multiple pages |
| **Assumptions/Unknowns** | None |
| **Root Cause** | Lack of shared confirmation dialog component |
| **Phase 0B Treatment** | REMOVE: `alert()`/`prompt()` from fabricated/non-functional pages (resolved by P0B-005/006/007/009); `alert()` error in BranchContactsSection → inline. PRESERVE: `window.confirm()` for real destructive ops (Phase 1 debt). |
| **Deferred Dependency** | Phase 1 (Dialog component) |
| **Protected Boundary** | None |
| **Verification-Case IDs** | CT-07 |
| **Acceptance Evidence** | No `alert()`/`prompt()` in affected pages; `window.confirm()` retained |

### P0B-019 — Missing 404 Route

| Field | Value |
|---|---|
| **ID** | P0B-019 |
| **Title** | No wildcard route |
| **Category** | Routing |
| **Severity** | Medium |
| **Primary Status** | Active |
| **User Impact** | Unknown paths render empty content |
| **Exact Evidence** | `router/index.tsx:49-234` — no `path:'*'` |
| **Confirmed Facts** | No catch-all route defined |
| **Assumptions/Unknowns** | None |
| **Root Cause** | Router built incrementally; catch-all never added |
| **Phase 0B Treatment** | Add wildcard with "Page not found." |
| **Deferred Dependency** | None |
| **Protected Boundary** | None |
| **Verification-Case IDs** | RT-01 |
| **Acceptance Evidence** | `/nonexistent` → 404 message |

### P0B-020 — No Error Boundaries

| Field | Value |
|---|---|
| **ID** | P0B-020 |
| **Title** | No `errorElement` — React Router v7.15.0 supports it natively |
| **Category** | Routing |
| **Severity** | Medium |
| **Primary Status** | Active |
| **User Impact** | Uncaught errors produce blank screens |
| **Exact Evidence** | `router/index.tsx` — no `errorElement` on any route |
| **Confirmed Facts** | React Router v7.15.0 natively supports `errorElement` |
| **Assumptions/Unknowns** | None |
| **Root Cause** | Error boundaries never implemented |
| **Phase 0B Treatment** | Add `errorElement` on root route. RT-02, RT-03 — automated. RT-04 — manual. |
| **Deferred Dependency** | None |
| **Protected Boundary** | None |
| **Verification-Case IDs** | RT-02, RT-03 (automated), RT-04 (manual) |
| **Acceptance Evidence** | RT-02, RT-03 pass; RT-04 manual evidence recorded |

### P0B-021 — Dead Dashboard Buttons

| Field | Value |
|---|---|
| **ID** | P0B-021 |
| **Title** | Three buttons without `onClick` |
| **Category** | Controls |
| **Severity** | Medium |
| **Primary Status** | Active |
| **User Impact** | Buttons appear styled and interactive but produce zero response |
| **Exact Evidence** | `dashboard/page.tsx:55-68,119-123,328-338` |
| **Confirmed Facts** | Three buttons have hover effects but no `onClick` handler |
| **Assumptions/Unknowns** | None |
| **Root Cause** | Buttons styled as part of visual design; handlers never connected |
| **Phase 0B Treatment** | REMOVE as part of P0B-003 |
| **Deferred Dependency** | Phase 8 |
| **Protected Boundary** | None |
| **Verification-Case IDs** | Covered by TT-02 |
| **Acceptance Evidence** | No button without `onClick` on dashboard |

### P0B-022 — Fake Router Fallback Text

| Field | Value |
|---|---|
| **ID** | P0B-022 |
| **Title** | "Initializing Registry Experience" — "Registry" not a real concept |
| **Category** | Writing / Data Truth |
| **Severity** | Medium |
| **Primary Status** | Active |
| **User Impact** | Users see meaningless decorative jargon while pages load |
| **Exact Evidence** | `router/index.tsx:35` — `Initializing Registry Experience` |
| **Confirmed Facts** | "Registry" has no corresponding product concept |
| **Assumptions/Unknowns** | None |
| **Root Cause** | Decorative placeholder text from visual prototyping |
| **Phase 0B Treatment** | Replace with "Loading…" |
| **Deferred Dependency** | None |
| **Protected Boundary** | None |
| **Verification-Case IDs** | TT-10 |
| **Acceptance Evidence** | Text reads "Loading…" not containing "Registry" |

### P0B-023 — Focus Outlines Removed

| Field | Value |
|---|---|
| **ID** | P0B-023 |
| **Title** | `focus:outline-none` without visible alternative |
| **Category** | Accessibility |
| **Severity** | High |
| **Primary Status** | Active |
| **User Impact** | Keyboard-only users cannot determine which element has focus |
| **Exact Evidence** | `Button.tsx:65`; settings toggle; ThemeToggle — all `focus:outline-none` without replacement |
| **Confirmed Facts** | Three interactive components lack visible focus indicator |
| **Assumptions/Unknowns** | None |
| **Root Cause** | Developers removed default outlines without adding replacements |
| **Phase 0B Treatment** | Add `focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2` to Button, retained toggles, ThemeToggle. Use `focus-visible:` (not `focus:`) for mouse-click avoidance. |
| **Deferred Dependency** | Phase 1 (unified focus-ring system) |
| **Protected Boundary** | None |
| **Verification-Case IDs** | AC-08 |
| **Acceptance Evidence** | Visible focus indicator on each via keyboard Tab |

### P0B-024 — Inaccessible Dialog Overlays

| Field | Value |
|---|---|
| **ID** | P0B-024 |
| **Title** | Inline overlays lack dialog semantics, focus trapping, Escape |
| **Category** | Accessibility |
| **Severity** | High |
| **Primary Status** | Active |
| **User Impact** | Screen reader users cannot identify dialogs; keyboard users tab into background; Escape doesn't close |
| **Exact Evidence** | `members/page.tsx:645-823`; `subscriptions/page.tsx:538-640` — `<div className="fixed inset-0">` without `role="dialog"`, `aria-modal`, `aria-labelledby`, focus trapping, Escape |
| **Confirmed Facts** | Both form overlays use inline `<div>` pattern without accessibility |
| **Assumptions/Unknowns** | None |
| **Root Cause** | No Dialog component exists; overlays built without accessibility |
| **Phase 0B Treatment** | Create `useDialogFocus` hook: Tab/Shift+Tab cycling, Escape close, focus restoration, scroll lock, cleanup, multiple-open protection. Add `role="dialog"`, `aria-modal="true"`, `aria-labelledby`. |
| **Deferred Dependency** | Phase 1 (proper Dialog component) |
| **Protected Boundary** | None |
| **Verification-Case IDs** | AC-01 through AC-06 |
| **Acceptance Evidence** | 6 cases pass; if dialog focus cannot safely be delivered → classify as Phase 1 blocker |

### P0B-025 — Toggle ARIA Missing

| Field | Value |
|---|---|
| **ID** | P0B-025 |
| **Title** | `<button>` without `role="switch"` or `aria-checked` |
| **Category** | Accessibility |
| **Severity** | High |
| **Primary Status** | Active (scoped) |
| **User Impact** | Screen reader users cannot determine switch state |
| **Exact Evidence** | `settings/page.tsx:32-54` — `renderToggleSwitch` uses `<button>` without ARIA |
| **Confirmed Facts** | Toggle implementation lacks switch semantics |
| **Assumptions/Unknowns** | None |
| **Root Cause** | Inline toggle implementation predates accessibility requirements |
| **Phase 0B Treatment** | Only retained toggles (Email Alerts, Product Updates) get `role="switch"`, `aria-checked`, `disabled`. Hidden toggles need no ARIA. |
| **Deferred Dependency** | Phase 1 (proper Switch component) |
| **Protected Boundary** | None |
| **Verification-Case IDs** | AC-07 |
| **Acceptance Evidence** | Retained toggles have correct ARIA attributes |

### P0B-026 — ESLint Baseline

| Field | Value |
|---|---|
| **ID** | P0B-026 |
| **Title** | 38 ESLint errors; build passes without lint |
| **Category** | Code Quality |
| **Severity** | Medium |
| **Primary Status** | Active (documented) |
| **User Impact** | Code quality issues unreported during build |
| **Exact Evidence** | `eslint . --no-cache` → 38 errors: ~24 generated-d.ts (`client.d.ts`), 2 `react-hooks/purity` (dashboard `Math.random()`), ~12 source `.tsx` files |
| **Confirmed Facts** | Build script does not include lint; errors categorized |
| **Assumptions/Unknowns** | Exact deferred-error count at implementation time |
| **Root Cause** | Lint not in build pipeline; generated files add errors |
| **Phase 0B Treatment** | P0B-002 deletions resolve ~24. P0B-003 resolves 2. Remaining ~12 = Phase 1 debt. 0 errors in Phase-0B-modified files. |
| **Deferred Dependency** | Phase 1 (systematic cleanup) |
| **Protected Boundary** | PB files must not be touched |
| **Verification-Case IDs** | None (lint is verification tool, not testable) |
| **Acceptance Evidence** | `react-hooks/purity` resolved; generated-file errors gone; ~12 documented |

### P0B-027 — Branch Warning Mentions Bookings

| Field | Value |
|---|---|
| **ID** | P0B-027 |
| **Title** | Decommission warning references non-existent booking system |
| **Category** | Data Truth |
| **Severity** | Medium |
| **Primary Status** | Active |
| **User Impact** | Misleads users about system capabilities |
| **Exact Evidence** | `BranchManagementSection.tsx` — decommission warning references "all future member bookings" |
| **Confirmed Facts** | Booking system does not exist |
| **Assumptions/Unknowns** | None |
| **Root Cause** | Warning text written assuming booking feature existed |
| **Phase 0B Treatment** | Replace with "Decommissioning will remove this location from active operations." |
| **Deferred Dependency** | Phase 6 (restore accurate text when bookings exist) |
| **Protected Boundary** | None |
| **Verification-Case IDs** | None (text change) |
| **Acceptance Evidence** | Warning does not mention "bookings" |

### P0B-028 — Nested `<main>` Landmarks

| Field | Value |
|---|---|
| **ID** | P0B-028 |
| **Title** | AppShell + settings both use `<main>` |
| **Category** | Accessibility |
| **Severity** | Medium |
| **Primary Status** | Active |
| **User Impact** | Screen reader landmark navigation confused |
| **Exact Evidence** | `AppShell.tsx:118`; `settings/page.tsx:92` |
| **Confirmed Facts** | Two `<main>` elements possible in rendered page |
| **Assumptions/Unknowns** | None |
| **Root Cause** | Inconsistent landmark usage |
| **Phase 0B Treatment** | Change settings inner `<main>` to `<section>` |
| **Deferred Dependency** | Phase 1 (full landmark audit) |
| **Protected Boundary** | AppShell structure must not change |
| **Verification-Case IDs** | None (DOM structure) |
| **Acceptance Evidence** | No nested `<main>` in rendered output |

### P0B-029 — No Reduced-Motion Support

| Field | Value |
|---|---|
| **ID** | P0B-029 |
| **Title** | Zero `prefers-reduced-motion`; animations unconditional |
| **Category** | Accessibility |
| **Severity** | Medium |
| **Primary Status** | Active |
| **User Impact** | Users with vestibular disorders experience all animations |
| **Exact Evidence** | No `prefers-reduced-motion` in `src/`; `subtle-up`, `fade-in`, `animate-spin`, `animate-pulse` identified |
| **Confirmed Facts** | Four Tailwind animation classes play unconditionally |
| **Assumptions/Unknowns** | None |
| **Root Cause** | Motion-reduction support never implemented |
| **Phase 0B Treatment** | TARGETED `@media (prefers-reduced-motion:reduce)` per identified class. Spinner: static "Loading…" when suppressed. |
| **Deferred Dependency** | Phase 1 (per-component alternatives) |
| **Protected Boundary** | None |
| **Verification-Case IDs** | AC-09 |
| **Acceptance Evidence** | Spinner does not rotate with reduced-motion enabled |

### P0B-030 — Empty Staff Files (DEFERRED)

| Field | Value |
|---|---|
| **ID** | P0B-030 |
| **Title** | 0-byte staff page + feature; not routed |
| **Category** | Navigation |
| **Severity** | Low |
| **Primary Status** | Deferred |
| **User Impact** | None — page not accessible via navigation; dead code only |
| **Exact Evidence** | `src/pages/staff/page.tsx` — 0 bytes; `src/features/staff/index.ts` — 0 bytes; no route in router |
| **Confirmed Facts** | Files are empty placeholders |
| **Assumptions/Unknowns** | None |
| **Root Cause** | Staff feature planned but never implemented |
| **Phase 0B Treatment** | DOCUMENT. No Phase 0B action. |
| **Deferred Dependency** | Phase 5 |
| **Protected Boundary** | None |
| **Verification-Case IDs** | None |
| **Acceptance Evidence** | Finding documented for Phase 5 |

### P0B-031 — Terminology Inconsistency (DEFERRED)

| Field | Value |
|---|---|
| **ID** | P0B-031 |
| **Title** | "Studio OS" / "Gym" — inconsistent with multi-facility positioning |
| **Category** | Writing / Product |
| **Severity** | Medium |
| **Primary Status** | Deferred |
| **User Impact** | Non-gym/studio facilities see mismatched terminology |
| **Exact Evidence** | `Sidebar.tsx:106` — "Studio OS"; `:18` — "Gyms"; login/signup headers |
| **Confirmed Facts** | Terminology inconsistent with multi-facility scope |
| **Assumptions/Unknowns** | None |
| **Root Cause** | Terminology chosen during early development before multi-facility positioning |
| **Phase 0B Treatment** | DEFER to Phase 2. No Phase 0B action. |
| **Deferred Dependency** | Phase 2 |
| **Protected Boundary** | Backend `Gym` types and `/gyms` endpoints |
| **Verification-Case IDs** | None |
| **Acceptance Evidence** | Finding documented for Phase 2 |

### P0B-032 — Duplicate Tokens/Themes/Components (DEFERRED)

| Field | Value |
|---|---|
| **ID** | P0B-032 |
| **Title** | Duplicate design tokens, theme providers, UI components |
| **Category** | Maintainability |
| **Severity** | Low |
| **Primary Status** | Deferred |
| **User Impact** | No direct user impact — maintenance risk only |
| **Exact Evidence** | `tokens.css` vs `styles/tokens.css`; `ThemeProvider` vs `ThemeContext`; `components/ui/` vs `shared/components/ui/` |
| **Confirmed Facts** | Multiple duplicate implementations confirmed |
| **Assumptions/Unknowns** | Which duplicates are genuinely unused requires dependency tracing |
| **Root Cause** | Duplicates created during development without cleanup |
| **Phase 0B Treatment** | DEFER to Phase 1. No Phase 0B action. |
| **Deferred Dependency** | Phase 1 |
| **Protected Boundary** | None |
| **Verification-Case IDs** | None |
| **Acceptance Evidence** | Finding documented for Phase 1 |

### P0B-033 — Settings Billing Fallback (PROTECTED-BOUNDARY)

| Field | Value |
|---|---|
| **ID** | P0B-033 |
| **Title** | Settings billing tab shows hardcoded "Gold plan" when PB flag disabled |
| **Category** | Data Truth |
| **Severity** | Medium |
| **Primary Status** | Protected-boundary |
| **User Impact** | Fabricated plan information when Platform Billing flag is disabled |
| **Exact Evidence** | `settings/page.tsx:184-244` |
| **Confirmed Facts** | Fallback content is hardcoded; PB integration point at line 184-185 |
| **Assumptions/Unknowns** | None |
| **Root Cause** | Fallback written as static placeholder |
| **Phase 0B Treatment** | NO PHASE 0B ACTION. Requires separate Platform Billing authorization. |
| **Deferred Dependency** | Separate PB authorization |
| **Protected Boundary** | Platform Billing — no change authorized |
| **Verification-Case IDs** | None |
| **Acceptance Evidence** | Finding documented as protected-boundary; no change to PB integration |

### P0B-034 — Declaration-Emit Risk

| Field | Value |
|---|---|
| **ID** | P0B-034 |
| **Title** | `tsc -b` emits `.d.ts` into `src/` — production build pollutes working tree |
| **Category** | Build |
| **Severity** | Medium |
| **Primary Status** | Active |
| **User Impact** | Every `npm run build` creates/updates 57 files in source tree |
| **Exact Evidence** | `package.json:8` — `"build": "tsc -b && vite build"`; `tsconfig.app.json:3,15` |
| **Confirmed Facts** | Production build emits declarations into `src/` |
| **Assumptions/Unknowns** | None |
| **Root Cause** | `declarationDir` never configured |
| **Phase 0B Treatment** | Part of P0B-002. |
| **Deferred Dependency** | None |
| **Protected Boundary** | None |
| **Verification-Case IDs** | BT-02 |
| **Acceptance Evidence** | `npm run build` succeeds without new files in `src/` |

### P0B-035 — `tsconfig.tsbuildinfo` in Root

| Field | Value |
|---|---|
| **ID** | P0B-035 |
| **Title** | Build cache file at repository root |
| **Category** | Repository Hygiene |
| **Severity** | Low |
| **Primary Status** | Active |
| **User Impact** | No user impact — developer hygiene |
| **Exact Evidence** | `tsconfig.tsbuildinfo` at repo root |
| **Confirmed Facts** | Single-line JSON build cache file in working tree |
| **Assumptions/Unknowns** | None |
| **Root Cause** | Generated by `tsc -b` and committed |
| **Phase 0B Treatment** | 0B.1A: add `*.tsbuildinfo` to `.gitignore`. 0B.1B: index removal. |
| **Deferred Dependency** | None |
| **Protected Boundary** | None |
| **Verification-Case IDs** | None |
| **Acceptance Evidence** | `*.tsbuildinfo` in `.gitignore`; not in index after 0B.1B |

### Treatment Matrix (P0B-009)

| Control | Treatment | ARIA? |
|---|---|---|
| Two-Factor Auth | HIDE | No |
| Auto Sign-Out | HIDE | No |
| Push Notifications | HIDE | No |
| Payment Failure Alerts | HIDE | No |
| Email Alerts | DISABLED_SEMANTIC_CONTROL | role="switch", aria-checked, disabled |
| Product Updates | DISABLED_SEMANTIC_CONTROL | role="switch", aria-checked, disabled |
| Delete Gym | REMOVE | N/A |

### Native-Dialog Scope (P0B-018)

| Removed (Phase 0B) | Preserved (Phase 1 Debt) |
|---|---|
| `prompt()` — gyms | `window.confirm()` — member archive |
| `alert()` — Generate Report | `window.confirm()` — plan archive/deactivate |
| `alert()` — Export CSV | `window.confirm()` — branch contact delete |
| `alert()` — Delete Gym | |
| `alert()` error — BranchContacts → inline | |

### Blocker-Status Summary

| Primary status | Finding IDs | Count |
|---|---|---|
| Active only | P0B-001–010, P0B-011A, P0B-014, P0B-018–029, P0B-034, P0B-035 | 26 |
| Hybrid active/blocked | P0B-013 (10 active + 4 blocked expressions — subscopes) | 1 |
| Blocked only | P0B-011, P0B-015, P0B-016 | 3 |
| Deferred | P0B-017, P0B-030–032 | 4 |
| Documented-only | P0B-012 | 1 |
| Protected-boundary | P0B-033 | 1 |
| **Total unique stable IDs** | | **36** |

---

## 9.6 Severity Definitions

| Severity | Definition |
|---|---|
| **Critical** | Can expose credentials, misrepresent security/compliance, corrupt user data, or execute destructive behavior without reliable confirmation. |
| **High** | Can materially mislead users, break essential operations, create session risk, or show false live information. |
| **Medium** | Creates inconsistent behavior, accessibility barriers, maintainability risk, or incomplete operational flows. |
| **Low** | Non-blocking polish or clarity issue deferred to later phase. |

---

## 9.7 Phase 0B Implementation Work Packages

### Phase 0B.1A — Working-Tree Repository Hygiene

1. **Objective:** Add `.gitignore` patterns; review `.env` history. No index mutation.
2. **Included Blocker IDs:** P0B-001 (working-tree), P0B-035 (working-tree)
3. **Exact Scope:** Edit `.gitignore`: add `.env`, `.env.*` (except `.env.example`), `*.tsbuildinfo`. Review `git log --all --full-history -- .env`.
4. **Probable Files:** `.gitignore`
5. **Explicitly Protected Files:** `.env` content; Enterprise Constitution; PB
6. **Explicit Exclusions:** `git rm --cached`, `git add`, `git restore --staged`, `git reset`
7. **Dependencies:** None
8. **Blocking Questions:** None
9. **Implementation Sequence:** 1. Review `.env` git history. 2. Edit `.gitignore`. 3. Verify patterns. 4. Verify `.env` still tracked (index removal separate).
10. **Automated Verification Cases:** None
11. **Manual Verification:** `.gitignore` has correct patterns; `.env` on disk and Vite reads it; `git ls-files .env` still shows tracked
12. **Risks:** Secret exposure in `.env` history → HARD STOP
13. **Rollback/Restoration:** Revert `.gitignore`
14. **Evidence-Report Requirements:** `.gitignore` diff; `.env` history review results
15. **Hard-Stop Conditions:** Secrets in history; any index mutation
16. **Commit Boundary:** Single commit (separately authorized)
17. **Agent/Reasoning:** DeepSeek V4 Pro / max
18. **Authorization Lifecycle:** Implementation auth → implementation → evidence → hard stop → staging auth → staging → evidence → hard stop → commit auth → commit → hard stop

### Phase 0B.1B — Index-Removal (SEPARATE AUTHORIZATION)

1. **Objective:** Remove `.env` and `tsconfig.tsbuildinfo` from Git index without deleting from disk. Requires separate Product Owner authorization.
2. **Included Blocker IDs:** P0B-001 (index), P0B-035 (index)
3. **Exact Scope:** `git rm --cached .env`; `git rm --cached tsconfig.tsbuildinfo`. Verify `git diff --cached` shows only these two deletions. **`git rm --cached` mutates and stages the Git index and is permitted only under this dedicated authorization.**
4. **Probable Files:** `.env` (index), `tsconfig.tsbuildinfo` (index)
5. **Explicitly Protected Files:** `.env` file on disk (must remain); all source/config files
6. **Explicit Exclusions:** `git add .`, `git add -A`, `git add docs/`; committing; pushing
7. **Dependencies:** Phase 0B.1A completed
8. **Blocking Questions:** None
9. **Implementation Sequence:** 1. Verify authorization. 2. `git rm --cached .env tsconfig.tsbuildinfo`. 3. Verify only those two in `--cached`. 4. Verify files still on disk.
10. **Automated Verification Cases:** None
11. **Manual Verification:** `git ls-files .env` empty; `git ls-files tsconfig.tsbuildinfo` empty; files on disk
12. **Risks:** Accidental staging of other files → HARD STOP
13. **Rollback/Restoration:** `git restore --staged .env tsconfig.tsbuildinfo`
14. **Evidence-Report Requirements:** `git diff --cached --name-only`; `git status`
15. **Hard-Stop Conditions:** Any file other than `.env`/`tsconfig.tsbuildinfo` in `--cached`
16. **Commit Boundary:** After separate staging+commit authorization
17. **Agent/Reasoning:** DeepSeek V4 Pro / max
18. **Authorization Lifecycle:** Product Owner authorization → staging → evidence → hard stop → commit auth → commit → hard stop

### Phase 0B.2 — Build Configuration and Generated-Artifact Stabilization

1. **Objective:** Stop declaration pollution; delete 57 NON_PLATFORM_GENERATED_CANDIDATE from manifest.
2. **Included Blocker IDs:** P0B-002, P0B-034
3. **Exact Scope:** Add `"declarationDir": "./node_modules/.tmp/declarations"` to `tsconfig.app.json`. Preserve `composite:true`. Agent MUST run `find src -type f -name '*.d.ts' -print | sort` and compare with manifest before deletion. Delete 57 from manifest. Preserve `vite-env.d.ts`. Controlled `npm run build`. Verify `npm run test:platform-billing`.
4. **Probable Files:** `tsconfig.app.json`; 57 `.d.ts` files (manifest-based)
5. **Explicitly Protected Files:** `vite-env.d.ts`; all PB; all `.ts`/`.tsx` sources
6. **Explicit Exclusions:** Removing `composite`; wildcard deletion; modifying `tsconfig.json`/`tsconfig.node.json`
7. **Dependencies:** 0B.1A
8. **Blocking Questions:** None
9. **Implementation Sequence:** 1. Edit config. 2. Compare manifest with `find`. 3. Delete from manifest. 4. `tsc --noEmit`. 5. `npm run build`. 6. `npm run test:platform-billing`.
10. **Automated Verification Cases:** BT-01, BT-02
11. **Manual Verification:** `find src/ -name '*.d.ts'` returns only `vite-env.d.ts`; `npm run build` succeeds; no new files in `src/`; `npm run test:platform-billing` passes
12. **Risks:** `composite:true` required by root `tsconfig.json` references
13. **Rollback/Restoration:** Revert config; restore files from git
14. **Evidence-Report Requirements:** Manifest comparison; `find` output; `tsc --noEmit` result; `npm run build` result; PB test result
15. **Hard-Stop Conditions:** Manifest/`find` mismatch; `tsc` failure; `build` creates `src/` files; PB test failure
16. **Commit Boundary:** Single commit (separately authorized)
17. **Agent/Reasoning:** DeepSeek V4 Pro / max
18. **Authorization Lifecycle:** Implementation auth → implementation → evidence → hard stop → staging auth → staging → evidence → hard stop → commit auth → commit → hard stop

### Phase 0B.3 — Fabricated Data and Unsupported Claim Removal

1. **Objective:** Remove all fabricated operational data, random values, unsupported claims from production pages.
2. **Included Blocker IDs:** P0B-003–008, P0B-021, P0B-022
3. **Exact Scope:** Dashboard: remove each fabricated literal, `Math.random()`, dead buttons, fake statuses; keep API-connected data. Mock pages: honest unavailable states. Gyms: redirect to `/settings?tab=branches` (OQ-04 approved). Auth pages: remove claims. Router fallback: "Loading…". Truthful wording: "This feature is not available in the current version." No invented contacts/deliveries.
4. **Probable Files:** `dashboard/page.tsx`, `attendance/page.tsx`, `billing/page.tsx`, `reports/page.tsx`, `gyms/page.tsx`, `auth/login/page.tsx`, `auth/signup/page.tsx`, `onboarding/page.tsx`, `app/router/index.tsx`
5. **Explicitly Protected Files:** PB status card; all API-connected data; PB pages
6. **Explicit Exclusions:** Settings data-connected sections; Members/Subscriptions pages
7. **Dependencies:** None
8. **Blocking Questions:** None
9. **Implementation Sequence:** 1. Dashboard cleanup. 2. Mock pages to unavailable states. 3. Gyms redirect. 4. Auth claim removal. 5. Fallback text. 6. Verify all in both themes.
10. **Automated Verification Cases:** TT-01 through TT-10
11. **Manual Verification:** Per-page: no fabricated data; correct state displayed; both themes render correctly
12. **Risks:** Dashboard layout restructuring needed
13. **Rollback/Restoration:** Revert each file individually
14. **Evidence-Report Requirements:** Per-page screenshots/descriptions; grep for exact claim strings; test results
15. **Hard-Stop Conditions:** Any page completely blank/broken; API-connected data lost
16. **Commit Boundary:** 3 commits (dashboard, auth pages, mock pages) — separately authorized
17. **Agent/Reasoning:** DeepSeek V4 Pro / max
18. **Authorization Lifecycle:** Per-commit: implementation auth → implementation → evidence → hard stop → staging auth → staging → evidence → hard stop → commit auth → commit → hard stop

### Phase 0B.4 — Non-Functional Control Containment

1. **Objective:** Disable/hide non-functional controls per matrix; scope native-dialog removal.
2. **Included Blocker IDs:** P0B-009, P0B-010, P0B-018(p)
3. **Exact Scope:** Settings: HIDE security/notification tabs; REMOVE Delete Gym; DISABLE email/product toggles with native `disabled` + ARIA. Login: HIDE Google button + forgot-password. BranchContacts: `alert()` → inline error. PRESERVE `window.confirm()` for real destructive ops.
4. **Probable Files:** `settings/page.tsx`, `auth/login/page.tsx`, `settings/BranchContactsSection.tsx`
5. **Explicitly Protected Files:** Real destructive-operation flows (member archive, plan archive/deactivate, contact delete)
6. **Explicit Exclusions:** Members archive; plan archive/deactivate; PB settings integration
7. **Dependencies:** None
8. **Blocking Questions:** None
9. **Implementation Sequence:** 1. Settings: hide/remove/disable. 2. Login: remove controls. 3. BranchContacts: inline error. 4. Verify.
10. **Automated Verification Cases:** CT-01 through CT-07
11. **Manual Verification:** Tabs not visible; Delete Gym absent; disabled toggles correct; Google/fp buttons absent; errors inline
12. **Risks:** Removing tabs leaves sidebar navigation items pointing nowhere — adjust tab list
13. **Rollback/Restoration:** Revert each file individually
14. **Evidence-Report Requirements:** Tab visibility; DOM attribute verification; test results
15. **Hard-Stop Conditions:** Any real destructive operation broken
16. **Commit Boundary:** Single commit
17. **Agent/Reasoning:** DeepSeek V4 Pro / max
18. **Authorization Lifecycle:** Implementation auth → implementation → evidence → hard stop → staging auth → staging → evidence → hard stop → commit auth → commit → hard stop

### Phase 0B.5 — Authentication/Session Risk Containment

1. **Objective:** Fix P0B-011A (independent); document P0B-012; implement P0B-011 after OQ-01 resolved.
2. **Included Blocker IDs:** P0B-011 (blocked), P0B-011A (active), P0B-012 (documented-only)
3. **Exact Scope — AUTHORIZED-INDEPENDENT:** P0B-011A: fix `BranchManagementSection.tsx:115-116` — add `clearAuth()` + `localStorage.removeItem('auth-storage')` before redirect (AT-09). P0B-012: document risk in Section 9.11. **BLOCKED:** P0B-011: logout call + AT-01 through AT-08 blocked until OQ-01 resolved.
4. **Probable Files:** `settings/BranchManagementSection.tsx`, `layout/Sidebar.tsx` (blocked portion)
5. **Explicitly Protected Files:** PB interceptor; `client.ts` (no functional changes); `authStore.ts` (no functional changes)
6. **Explicit Exclusions:** Token storage architecture (Phase 4); source-code comments as documentation
7. **Dependencies:** OQ-01 (blocking for full P0B-011)
8. **Blocking Questions:** OQ-01: Does `POST /auth/logout` invalidate refresh tokens?
9. **Implementation Sequence:** 1. P0B-011A: add cleanup before redirect. 2. Document P0B-012 in decision record. 3. When OQ-01 resolved: add `authApi.logout()` with try/catch. 4. Run AT-01 through AT-09.
10. **Automated Verification Cases:** AT-09 (independent). AT-01 through AT-08 (blocked on OQ-01).
11. **Manual Verification:** P0B-011A: component 401 triggers cleanup. After OQ-01: network tab shows `POST /auth/logout`; local cleanup completes regardless.
12. **Risks:** Logout endpoint semantics may differ from assumption
13. **Rollback/Restoration:** Revert component changes
14. **Evidence-Report Requirements:** Test results; PB test results; network verification (after OQ-01)
15. **Hard-Stop Conditions:** Build/runtime error; PB test failure
16. **Commit Boundary:** Single commit (split if independent portion committed before OQ-01 resolved)
17. **Agent/Reasoning:** DeepSeek V4 Pro / max
18. **Authorization Lifecycle:** Implementation auth → implementation → evidence → hard stop → staging auth → staging → evidence → hard stop → commit auth → commit → hard stop

### Phase 0B.6 — Data-Correctness Fixes

1. **Objective:** Fix 10 local-date expressions; add pagination info; update branch warning.
2. **Included Blocker IDs:** P0B-013(p active), P0B-014, P0B-027
3. **Exact Scope — AUTHORIZED-INDEPENDENT:** Create `shared/utils/date.ts` with `getLocalDateString(date?:Date)`; replace 10 LOCAL_CALENDAR_DATE_INPUT expressions; add pagination info (backend `total` field); update branch warning. **BLOCKED:** 4 API_DEFINED_DATE (B-14/B-15); overnight-hours removal (OQ-02); emergency-contact (OQ-03).
4. **Probable Files:** `shared/utils/date.ts` (new); `dashboard/page.tsx` (2); `OperatingHoursDayRow.tsx` (5); `BranchOperatingHoursSection.tsx` (2+message); `subscriptions/page.tsx` (1 replace + 2 blocked); `MembershipPlanForm.tsx` (2 blocked — verified at `src/components/settings/MembershipPlanForm.tsx`); `members/page.tsx` (pagination); `subscriptions/page.tsx` (pagination); `BranchManagementSection.tsx` (warning)
5. **Explicitly Protected Files:** Backend API contracts; operating-hours validation
6. **Explicit Exclusions:** Minimum-age change; overnight-hours removal; emergency-contact changes
7. **Dependencies:** B-14/B-15 (blocking for deferred); OQ-02 (blocking for P0B-015)
8. **Blocking Questions:** OQ-02, OQ-03, OQ-05
9. **Implementation Sequence:** 1. Create date utility with DC-01–07. 2. Replace 10 expressions. 3. Add pagination info (DC-08, DC-09). 4. Update warning text. 5. Retain overnight-hours validation.
10. **Automated Verification Cases:** DC-01 through DC-09
11. **Manual Verification:** Create member at 2 AM IST: DOB shows today; plan valid_from correct; overnight message present
12. **Risks:** Date changes must preserve API-bound format; pagination must use correct field
13. **Rollback/Restoration:** Revert each file individually; remove utility file
14. **Evidence-Report Requirements:** Test results; manual date verification; pagination message verification
15. **Hard-Stop Conditions:** `getLocalDateString()` returns wrong date in any test TZ; overnight-hours validation removed
16. **Commit Boundary:** Date fixes (1) + pagination/warning (1) — separately authorized
17. **Agent/Reasoning:** DeepSeek V4 Pro / max
18. **Authorization Lifecycle:** Per-commit: implementation auth → implementation → evidence → hard stop → staging auth → staging → evidence → hard stop → commit auth → commit → hard stop

### Phase 0B.7 — Routing and Failure-State Integrity

1. **Objective:** Add 404 route; error boundaries via React Router v7 `errorElement`; fix fallback text.
2. **Included Blocker IDs:** P0B-019, P0B-020
3. **Exact Scope:** Add `path:'*'` wildcard with "Page not found." Add `errorElement` on root route. Distinguish: route resolution, lazy chunk-load, render errors. RT-01 through RT-03 automated; RT-04 manual (lazy-import failure not reliably testable in jsdom).
4. **Probable Files:** `app/router/index.tsx`, `components/RouteErrorBoundary.tsx` (new)
5. **Explicitly Protected Files:** All existing route definitions; PB routes
6. **Explicit Exclusions:** Loader/action errors; full error-state system (Phase 1)
7. **Dependencies:** React Router v7.15.0
8. **Blocking Questions:** None
9. **Implementation Sequence:** 1. Create error element. 2. Add `errorElement` + wildcard. 3. Update fallback. 4. Write RT-01–03; document RT-04 manual procedure.
10. **Automated Verification Cases:** RT-01, RT-02, RT-03
11. **Manual Verification:** RT-04: simulate lazy-import failure (e.g., network throttle / blocked chunk URL) → verify error boundary fallback
12. **Risks:** Error boundary may not catch all lazy-load errors — RT-04 verifies
13. **Rollback/Restoration:** Revert router changes
14. **Evidence-Report Requirements:** Test results; RT-04 manual procedure and screenshots
15. **Hard-Stop Conditions:** Error boundary breaks existing route rendering
16. **Commit Boundary:** Single commit
17. **Agent/Reasoning:** DeepSeek V4 Pro / max
18. **Authorization Lifecycle:** Implementation auth → implementation → evidence → hard stop → staging auth → staging → evidence → hard stop → commit auth → commit → hard stop

### Phase 0B.8 — Immediate Accessibility Blockers

1. **Objective:** Fix focus indicators, dialog semantics, toggle ARIA, reduced motion, nested landmarks.
2. **Included Blocker IDs:** P0B-023, P0B-024, P0B-025(p), P0B-028, P0B-029
3. **Exact Scope:** Button/ThemeToggle/retained toggles: `focus-visible:ring`. Dialogs: `useDialogFocus` hook (Tab/Shift+Tab/Escape/restore/cleanup/scroll-lock). Retained toggles: `role="switch"`+`aria-checked`+`disabled`. Reduced motion: targeted `@media` per class. Settings: `<section>` not `<main>`.
4. **Probable Files:** `ui/Button.tsx`, `settings/page.tsx`, `ui/ThemeToggle.tsx`, `members/page.tsx`, `subscriptions/page.tsx`, `hooks/useDialogFocus.ts` (new), `index.css`
5. **Explicitly Protected Files:** AppShell layout structure
6. **Explicit Exclusions:** Hidden toggles (no ARIA); full Dialog/Switch components (Phase 1); universal wildcard reduced-motion rule
7. **Dependencies:** P0B-009 determines which toggles get ARIA
8. **Blocking Questions:** None
9. **Implementation Sequence:** 1. Focus-visible rings. 2. `useDialogFocus` hook. 3. Integrate with dialogs. 4. Toggle ARIA (retained only). 5. Targeted reduced-motion. 6. Fix nested `<main>`.
10. **Automated Verification Cases:** AC-01 through AC-09
11. **Manual Verification:** Tab through: visible focus; dialog: ARIA correct, Tab/Escape work; toggles: screen reader announces state; reduced-motion: spinner static
12. **Risks:** Dialog multiple-open edge case; focus ring contrast in dark mode
13. **Rollback/Restoration:** Revert each file individually; revert hook
14. **Evidence-Report Requirements:** Test results; screen reader verification; keyboard navigation verification
15. **Hard-Stop Conditions:** If dialog focus cannot safely be delivered → classify as Phase 1 blocker rather than falsely claiming completion
16. **Commit Boundary:** Single commit
17. **Agent/Reasoning:** DeepSeek V4 Pro / max
18. **Authorization Lifecycle:** Implementation auth → implementation → evidence → hard stop → staging auth → staging → evidence → hard stop → commit auth → commit → hard stop

### Phase 0B.9 — Integrated Verification

1. **Objective:** Run all checks; confirm no regressions; produce acceptance evidence.
2. **Included Blocker IDs:** All active blockers (verification that corrections were applied correctly)
3. **Exact Scope:** 1. `npx tsc --noEmit` — 0 errors. 2. `npx eslint . --no-cache` — 0 errors in Phase-0B-modified files. 3. `npm run test` — all pass. 4. `npm run test:platform-billing` — 80 pass. 5. `npm run build` — succeeds without polluting `src/`. 6. `git diff --name-only -- src/features/platformBilling/` — empty. 7. Both constitution hashes unchanged. 8. `find src/ -name '*.d.ts'` — only `vite-env.d.ts`. 9. Before/after `git status`. 10. All 41 currently executable automated verification cases pass (AT-01 through AT-08 remain BLOCKED_NOT_RUN pending OQ-01). 11. RT-04 manual verification evidence recorded.
4. **Probable Files:** None (verification only)
5. **Explicitly Protected Files:** PB; both constitutions; all application files
6. **Explicit Exclusions:** Any changes to source files
7. **Dependencies:** All preceding work packages
8. **Blocking Questions:** None (verification confirms prior corrections)
9. **Implementation Sequence:** 1. Run each check sequentially. 2. Record outputs. 3. If any fails, return to relevant work package.
10. **Automated Verification Cases:** All 41 currently executable automated cases from Appendix C (AT-01 through AT-08 remain BLOCKED_NOT_RUN pending OQ-01; RT-04 is manual). Additionally: `tsc --noEmit`, `eslint . --no-cache`, `npm run test`, `npm run test:platform-billing`, `npm run build`, `git diff`, `sha256sum`, `find`.
11. **Manual Verification:** RT-04; per-page visual verification; both themes; responsive behavior
12. **Risks:** None (read-only verification)
13. **Rollback/Escalation:** If any check fails, document the failure, return to the responsible work package, and re-verify. Do not proceed past a failed check.
14. **Evidence-Report Requirements:** Each check output; test results; `git status` before/after; `git diff` for PB; constitution hashes
15. **Hard-Stop Conditions:** Any check fails; PB diff non-empty; constitution hash changed
16. **Commit Boundary:** No commit (verification phase only)
17. **Agent/Reasoning:** DeepSeek V4 Pro / max
18. **Authorization Lifecycle:** Execution → evidence report → hard stop → Product Owner review

---

## 9.8 File Impact Map

### 9.8-A Exact Declaration-File Manifest

Authoritative source: `find src -type f -name '*.d.ts' -print | sort` at baseline commit `df4e5cb`. Result: 58 files. No duplicates. Zero Platform Billing. Machine-verification: implementation agent MUST re-run `find` and compare with this manifest before deletion.

Note: `Tracked?` confirmed via `git ls-files --error-unmatch`. `Platform Billing?` confirmed via path inspection. `Git-history evidence` records the most recent commit touching each file where available. `Source-generation evidence` confirms each file has a corresponding `.ts`/`.tsx` source and declaration content mechanically matches `emitDeclarationOnly` output (no ambient `declare module` patterns).

| # | Exact Path | Tracked? | PB? | Classification | Source-gen Evidence | Git-history Evidence | Future Action |
|---|---|---|---|---|---|---|---|
| 1 | `src/vite-env.d.ts` | YES | NO | HAND_WRITTEN_PRESERVE | No corresponding source file; ambient `/// <reference>` directive | Initial commit `331cb2b` | PRESERVE |
| 2 | `src/types/assets.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `src/types/assets.ts`; export type declarations match source | Committed `d36432b` | DELETE |
| 3 | `src/main.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `src/main.tsx`; emitted declarations match exports | Committed `f03d2be` | DELETE |
| 4 | `src/components/layout/AppShell.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `AppShell.tsx`; emitted declarations match exports | Bulk commit with source | DELETE |
| 5 | `src/components/layout/BranchSelector.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `BranchSelector.tsx`; emitted declarations match exports | Bulk commit with source | DELETE |
| 6 | `src/components/layout/Sidebar.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `Sidebar.tsx`; emitted declarations match exports | Bulk commit with source | DELETE |
| 7 | `src/components/providers/ThemeProvider.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `ThemeProvider.tsx`; emitted declarations match exports | Bulk commit with source | DELETE |
| 8 | `src/components/settings/BranchContactsSection.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `BranchContactsSection.tsx`; emitted declarations match exports | Bulk commit with source | DELETE |
| 9 | `src/components/settings/BranchManagementSection.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `BranchManagementSection.tsx`; emitted declarations match exports | Committed `d36432b` | DELETE |
| 10 | `src/components/settings/BranchOperatingHoursSection.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `BranchOperatingHoursSection.tsx`; emitted declarations match exports | Committed `eb026d2` | DELETE |
| 11 | `src/components/settings/CoverUploader.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `CoverUploader.tsx`; emitted declarations match exports | Committed `d36432b` | DELETE |
| 12 | `src/components/settings/LogoUploader.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `LogoUploader.tsx`; emitted declarations match exports | Committed `d36432b` | DELETE |
| 13 | `src/components/settings/OperatingHoursDayRow.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `OperatingHoursDayRow.tsx`; emitted declarations match exports | Bulk commit with source | DELETE |
| 14 | `src/components/settings/OperatingHoursStatusCard.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `OperatingHoursStatusCard.tsx`; emitted declarations match exports | Bulk commit with source | DELETE |
| 15 | `src/components/settings/OrganizationBrandingSection.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `OrganizationBrandingSection.tsx`; emitted declarations match exports | Bulk commit with source | DELETE |
| 16 | `src/components/settings/SpecialHoursEditor.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `SpecialHoursEditor.tsx`; emitted declarations match exports | Bulk commit with source | DELETE |
| 17 | `src/components/ui/Badge.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `Badge.tsx`; emitted declarations match exports | Committed `f03d2be` | DELETE |
| 18 | `src/components/ui/Button.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `Button.tsx`; emitted declarations match exports | Bulk commit with source | DELETE |
| 19 | `src/components/ui/Card.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `Card.tsx`; emitted declarations match exports | Committed `f03d2be` | DELETE |
| 20 | `src/components/ui/DoersLogo.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `DoersLogo.tsx`; emitted declarations match exports | Bulk commit with source | DELETE |
| 21 | `src/components/ui/Input.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `Input.tsx`; emitted declarations match exports | Bulk commit with source | DELETE |
| 22 | `src/components/ui/PageHeader.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `PageHeader.tsx`; emitted declarations match exports | Bulk commit with source | DELETE |
| 23 | `src/components/ui/ThemeToggle.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `ThemeToggle.tsx`; emitted declarations match exports | Bulk commit with source | DELETE |
| 24 | `src/features/auth/services/authApi.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `authApi.ts`; emitted declarations match exports | Bulk commit with source | DELETE |
| 25 | `src/features/auth/types/index.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `index.ts`; emitted declarations match exports | Committed `cbb2aa6` | DELETE |
| 26 | `src/features/gym/hooks/useBranchHours.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `useBranchHours.ts`; emitted declarations match exports | Bulk commit with source | DELETE |
| 27 | `src/features/gym/index.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `index.ts`; emitted declarations match exports | Bulk commit with source | DELETE |
| 28 | `src/features/gym/services/branchContactsApi.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `branchContactsApi.ts`; emitted declarations match exports | Bulk commit with source | DELETE |
| 29 | `src/features/gym/services/branchHoursApi.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `branchHoursApi.ts`; emitted declarations match exports | Bulk commit with source | DELETE |
| 30 | `src/features/gym/services/gymApi.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `gymApi.ts`; emitted declarations match exports | Bulk commit with source | DELETE |
| 31 | `src/features/gym/store/branchStore.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `branchStore.ts`; emitted declarations match exports | Bulk commit with source | DELETE |
| 32 | `src/features/gym/types/branchContacts.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `branchContacts.ts`; emitted declarations match exports | Bulk commit with source | DELETE |
| 33 | `src/features/gym/types/branchHours.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `branchHours.ts`; emitted declarations match exports | Bulk commit with source | DELETE |
| 34 | `src/features/gym/types/index.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `index.ts`; emitted declarations match exports | Committed `eb026d2` | DELETE |
| 35 | `src/features/onboarding/services/onboardingApi.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `onboardingApi.ts`; emitted declarations match exports | Bulk commit with source | DELETE |
| 36 | `src/features/onboarding/types/index.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `index.ts`; emitted declarations match exports | Bulk commit with source | DELETE |
| 37 | `src/features/organization/components/BasicInfoForm.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `BasicInfoForm.tsx`; emitted declarations match exports | Bulk commit with source | DELETE |
| 38 | `src/features/organization/index.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `index.ts`; emitted declarations match exports | Bulk commit with source | DELETE |
| 39 | `src/features/organization/services/organizationApi.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `organizationApi.ts`; emitted declarations match exports | Bulk commit with source | DELETE |
| 40 | `src/features/organization/types/index.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `index.ts`; emitted declarations match exports | Bulk commit with source | DELETE |
| 41 | `src/features/reports/hooks/useDashboard.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `useDashboard.ts`; emitted declarations match exports | Bulk commit with source | DELETE |
| 42 | `src/features/reports/index.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `index.ts`; emitted declarations match exports | Bulk commit with source | DELETE |
| 43 | `src/features/reports/services/reportsApi.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `reportsApi.ts`; emitted declarations match exports | Bulk commit with source | DELETE |
| 44 | `src/features/reports/types/index.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `index.ts`; emitted declarations match exports | Bulk commit with source | DELETE |
| 45 | `src/hooks/useCoverUpload.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `useCoverUpload.ts`; emitted declarations match exports | Committed `d36432b` | DELETE |
| 46 | `src/hooks/useFocalPoint.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `useFocalPoint.ts`; emitted declarations match exports | Committed `238bcbb`/`d36432b` | DELETE |
| 47 | `src/hooks/useLogoUpload.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `useLogoUpload.ts`; emitted declarations match exports | Committed `d36432b` | DELETE |
| 48 | `src/lib/services/assetService.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `assetService.ts`; emitted declarations match exports | Committed `d36432b` | DELETE |
| 49 | `src/pages/attendance/page.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `page.tsx`; emitted declarations match exports | Bulk commit with source | DELETE |
| 50 | `src/pages/auth/verify-success/page.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `page.tsx`; emitted declarations match exports | Bulk commit with source | DELETE |
| 51 | `src/pages/billing/page.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `page.tsx`; emitted declarations match exports | Bulk commit with source | DELETE |
| 52 | `src/pages/gyms/page.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `page.tsx`; emitted declarations match exports | Bulk commit with source | DELETE |
| 53 | `src/pages/_layouts/DashboardLayout.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `DashboardLayout.tsx`; emitted declarations match exports | Committed `f03d2be` | DELETE |
| 54 | `src/pages/members/page.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `page.tsx`; emitted declarations match exports | Bulk commit with source | DELETE |
| 55 | `src/pages/reports/page.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `page.tsx`; emitted declarations match exports | Bulk commit with source | DELETE |
| 56 | `src/pages/settings/page.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `page.tsx`; emitted declarations match exports | Bulk commit with source | DELETE |
| 57 | `src/pages/subscriptions/page.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `page.tsx`; emitted declarations match exports | Bulk commit with source | DELETE |
| 58 | `src/shared/services/api/client.d.ts` | YES | NO | NON_PLATFORM_GENERATED_CANDIDATE | Source: `client.ts`; emitted declarations match exports | Modified `ae9a65e` | DELETE |

#### Declaration Summary

| Classification | Count |
|---|---|
| HAND_WRITTEN_PRESERVE | 1 |
| NON_PLATFORM_GENERATED_CANDIDATE | 57 |
| PLATFORM_BILLING_PROTECTED | 0 |
| UNPROVEN_PRESERVE | 0 |
| **Total** | **58** |
| Future deletion | 57 |
| Expected remaining | 1 |

---

## 9.9 Backend-Contract Dependency Register

| ID | Capability | Blocking? | Phase 0B Temporary |
|---|---|---|---|
| B-01 | `POST /auth/logout` semantics | **BLOCKING** (OQ-01) | Document; implement after verification |
| B-05 | Overnight hours | **BLOCKING** (OQ-02) | Retain validation |
| B-13 | `emergency_contact_name` contract | **BLOCKING** (OQ-03) | No change |
| B-14 | Membership plan date contract | Defers 2 P0B-013 | Keep existing |
| B-15 | Subscription date contract | Defers 2 P0B-013 | Keep existing |

---

## 9.10 Truthful-State Policy

All unavailable states: "This feature is not available in the current version." Prohibited: invented support contacts, delivery timelines, "coming soon", roadmap promises.

---

## 9.11 Authentication/Session Decision Record

| Aspect | Current State | Risk |
|---|---|---|
| Token storage | `localStorage` (`auth-storage` key) | XSS token theft |
| Logout | Local cleanup only; backend never called | Server session unconfirmed |
| Duplicate 401 | `BranchManagementSection.tsx:115-116` bypasses cleanup | Stale auth data |

Documented here. No source-code comments. Full migration Phase 4.

---

## 9.12 Acceptance Criteria

## Partial containment completion (while OQ-01 remains unresolved)

41 currently executable automated verification cases must pass (49 total minus 8 blocked AT-01 through AT-08). RT-04 manual verification evidence must be recorded and approved. AT-01 through AT-08 remain BLOCKED_NOT_RUN and are not counted as passed, failed, or executable.

Calculation: 49 automated - 8 blocked authentication = 41 currently executable.

## Full Phase 0B completion (after OQ-01 resolved + P0B-011 authorization)

All 49 automated verification cases must pass. RT-04 manual verification evidence must be recorded and approved.

### Key acceptance points:

- `find src/ -name '*.d.ts'` returns only `vite-env.d.ts`
- Each claim string absent from specified file (Section 9.13)
- `Math.random()` absent from dashboard
- All 41 executable automated cases pass; AT-01–08 BLOCKED_NOT_RUN; RT-04 manual evidence recorded
- `npm run test:platform-billing` — 80 tests pass
- PB diff empty; both constitutions unchanged; `npm run build` succeeds
- 10 local-date expressions replaced; 4 deferred with comments
- Overnight-hours validation retained with truthful message
- No `alert()`/`prompt()` in affected pages

---

## 9.13 Verification Matrix — Claim Strings

| Exact String | File |
|---|---|
| `SOC 2 CERTIFIED` | `src/pages/auth/signup/page.tsx` |
| `ISO ENCRYPTED` | `src/pages/auth/signup/page.tsx` |
| `SECURE CLOUD` | `src/pages/auth/signup/page.tsx` |
| `All Systems Operational` | `src/pages/auth/login/page.tsx` |
| `Secure biometric sync enabled` | `src/pages/attendance/page.tsx` |
| `biometric GPS disabled` | `src/pages/gyms/page.tsx` |
| `REGISTRY SECURE` | `src/pages/reports/page.tsx` |
| `Sensor signals healthy` | `src/pages/dashboard/page.tsx` |
| `Initializing Registry Experience` | `src/app/router/index.tsx` |
| `Studio Intelligence` | `src/pages/dashboard/page.tsx` |
| `Institutional Parameters` | `src/pages/onboarding/page.tsx` |

---

## 9.14 Risk Register

| Risk | Likelihood | Impact | Blocking? |
|---|---|---|---|
| Accidental PB regression | Low | Critical | Yes |
| Loss of auth compatibility | Low | High | Yes |
| Backend contract uncertainty | Medium | Medium | Yes |
| Secret exposure in `.env` history | Low | Low | Yes |

---

## 9.15 Deferred Work

| Item | Target |
|---|---|
| Design-system consolidation | Phase 1 |
| `window.confirm()` replacement | Phase 1 |
| ESLint source-file errors (~12) | Phase 1 |
| Vocabulary adaptation | Phase 2 |
| Navigation restructuring | Phase 3 |
| Full auth migration | Phase 4 |
| Minimum-age policy | Phase 5 |
| Emergency-contact correction | Phase 5 (after B-13) |
| Overnight-hours removal | Phase 3/6 (after B-05) |
| P0B-033 fallback | Separate PB authorization |
| Real attendance/billing/reports/dashboard | Phases 6–8 |

---

## 9.16 Approval Gates

| Gate | Description |
|---|---|
| **G-01R** | Corrected Plan Review (Product Owner) — CURRENT |
| **G-02S** | Plan Staging: `git add -- docs/frontend/PHASE_0B_BASELINE_AND_TRUST_BLOCKERS_PLAN.md` only. Prohibit `git add .`, `git add -A`, `git add docs/`. |
| **G-02SR** | Plan Staging Review |
| **G-02C** | Plan Commit (after G-02SR) |
| **G-02CR** | Plan Commit Review |
| **G-03A–G-11** | Implementation gates per work package |
| **G-12** | Per-commit authorization |
| **G-13** | Push authorization |

Each gate lifecycle: implementation auth → implementation → evidence → hard stop → staging auth → staging → evidence → hard stop → commit auth → commit → hard stop. No gate automatically authorizes the next.

---

## 9.17 Open Questions

| ID | Question | Classification | Blocks |
|---|---|---|---|
| OQ-01 | Backend logout semantics? | **BLOCKING** | P0B-011 (AT-01–08) |
| OQ-02 | Backend overnight hours? | **BLOCKING** | P0B-015 |
| OQ-03 | `emergency_contact_name` semantics? | **BLOCKING** | P0B-016 |
| OQ-05 | Date contract (membership/subscription)? | **BLOCKING** | 4 P0B-013 expressions |
| OQ-04 | `/gyms` redirect? | **NON_BLOCKING — APPROVED SAFE DEFAULT:** redirect `/gyms` → `/settings?tab=branches` | OQ-04 resolved |
| OQ-06 | `shared/utils/date.ts` location? | **NON_BLOCKING — APPROVED SAFE DEFAULT:** create at `src/shared/utils/date.ts` | OQ-06 resolved |
| OQ-07 | `shared/components/ui/` duplicates unused? | DEFERRED | Phase 1 |
| OQ-08 | Plan document commit? | **PRODUCT_OWNER_DECISION** — plan commit unauthorized until G-02S, G-02SR, G-02C completed | G-02S/G-02C |

---

## 9.18 Final Planning Recommendation

The corrected Phase 0B plan (v0.5-draft) is ready for **G-01R Product Owner review**. Implementation remains unauthorized. Recommended next action after G-01R: **G-02S — Plan Staging Authorization only**.

### Execution Platform

| Field | Value |
|---|---|
| Platform | OpenCode Go |
| Agent | DeepSeek V4 Pro |
| Reasoning | max / strongest available |

The work packages in this plan are umbrella planning groups. They must not be implemented as one large agent task. Each package must be divided into separately authorized micro-phases. Each micro-phase should normally contain: one objective; one to three production files; directly related test files; one acceptance checklist; one evidence report; one hard stop. A fresh independent OpenCode Go review session must inspect every implementation diff before staging authorization.

### Per-Package Agent Recommendation

| Work Package | Agent | Reasoning |
|---|---|---|
| 0B.1A | DeepSeek V4 Pro | max |
| 0B.1B | DeepSeek V4 Pro | max |
| 0B.2 | DeepSeek V4 Pro | max |
| 0B.3 | DeepSeek V4 Pro | max |
| 0B.4 | DeepSeek V4 Pro | max |
| 0B.5 | DeepSeek V4 Pro | max |
| 0B.6 | DeepSeek V4 Pro | max |
| 0B.7 | DeepSeek V4 Pro | max |
| 0B.8 | DeepSeek V4 Pro | max |
| 0B.9 | DeepSeek V4 Pro | max |

---

## Appendix A — Summary Counts

| Metric | Value |
|---|---|
| Total stable finding IDs | 36 |
| Active only | 26 |
| Hybrid active/blocked | 1 (P0B-013) |
| Blocked only | 3 |
| Deferred | 4 |
| Documented-only | 1 |
| Protected-boundary | 1 |
| `.d.ts` files in `src/` | 58 |
| HAND_WRITTEN_PRESERVE | 1 |
| NON_PLATFORM_GENERATED_CANDIDATE | 57 |
| Future deletion | 57 |
| Expected remaining | 1 |
| `toISOString()` total | 14 |
| Replace (LOCAL_CALENDAR_DATE_INPUT) | 10 |
| Defer (API_DEFINED_DATE) | 4 |
| Total verification cases | 50 |
| Automated | 49 |
| Manual (RT-04) | 1 |
| ESLint errors total | 38 |
| Resolved by P0B-002 (~24) + P0B-003 (2) | ~26 |
| Remaining Phase 1 debt | ~12 |
| Full test command | `npm run test` |
| PB test command | `npm run test:platform-billing` |
| Timezone test matrix | `TZ=Asia/Kolkata`, `TZ=UTC`, `TZ=America/New_York` |

## Appendix B — toISOString Expression Inventory

| # | File | Line | Classification | Replace? |
|---|---|---|---|---|
| 1 | `dashboard/page.tsx` | 8 | LOCAL_CALENDAR_DATE_INPUT | YES |
| 2 | `dashboard/page.tsx` | 9 | LOCAL_CALENDAR_DATE_INPUT | YES |
| 3 | `OperatingHoursDayRow.tsx` | 28 | LOCAL_CALENDAR_DATE_INPUT | YES |
| 4 | `OperatingHoursDayRow.tsx` | 39 | LOCAL_CALENDAR_DATE_INPUT | YES |
| 5 | `OperatingHoursDayRow.tsx` | 54 | LOCAL_CALENDAR_DATE_INPUT | YES |
| 6 | `OperatingHoursDayRow.tsx` | 65 | LOCAL_CALENDAR_DATE_INPUT | YES |
| 7 | `OperatingHoursDayRow.tsx` | 94 | LOCAL_CALENDAR_DATE_INPUT | YES |
| 8 | `BranchOperatingHoursSection.tsx` | 74 | LOCAL_CALENDAR_DATE_INPUT | YES |
| 9 | `BranchOperatingHoursSection.tsx` | 193 | LOCAL_CALENDAR_DATE_INPUT | YES |
| 10 | `subscriptions/page.tsx` | 38 | LOCAL_CALENDAR_DATE_INPUT | YES |
| 11 | `MembershipPlanForm.tsx` | 64 | API_DEFINED_DATE | BLOCKED (B-14) |
| 12 | `MembershipPlanForm.tsx` | 65 | API_DEFINED_DATE | BLOCKED (B-14) |
| 13 | `subscriptions/page.tsx` | 101 | API_DEFINED_DATE | BLOCKED (B-15) |
| 14 | `subscriptions/page.tsx` | 109 | API_DEFINED_DATE | BLOCKED (B-15) |

## Appendix C — Verification Register (50 Cases)

### Repository/Build

| ID | Type | Proposed Test/Evidence File | Setup/Precondition | Action/Command | Exact Expected Assertion/Result | Work Pkg |
|---|---|---|---|---|---|---|
| BT-01 | AUTOMATED_STATIC_CHECK | Shell verification | `declarationDir` applied; all 57 deleted | `find src -type f -name '*.d.ts' -print \| sort` | Output is exactly `src/vite-env.d.ts` (1 line) | 0B.2 |
| BT-02 | AUTOMATED_BUILD_CHECK | Shell verification | `declarationDir` applied; `npm run build` completed | `find src -type f -name '*.d.ts' -print \| sort` and `find src -type f -name '*.d.ts' \| wc -l` and `git status` | Output is exactly `src/vite-env.d.ts`; count is 1; no new/untracked declaration file in `src/`; `npm run build` exit code 0 | 0B.2 |

### Truthful UI

| ID | Type | Proposed Test/Evidence File | Setup/Precondition | Action/Command | Exact Expected Assertion/Result | Work Pkg |
|---|---|---|---|---|---|---|
| TT-01 | VITEST | `dashboard.test.tsx` | MSW mock returns real PB API data; wrap with providers | Render DashboardPage | Platform Billing status card is visible; organization name from API is visible | 0B.3 |
| TT-02 | VITEST | `dashboard.test.tsx` | Render DashboardPage | Assert absence of each fabricated literal (Section 9.13) | None of the fabricated strings in DOM; no `Math.random()` called in render | 0B.3 |
| TT-03 | AUTOMATED_STATIC_CHECK | Grep verification | File edited | `grep -n 'Math.random()' src/pages/dashboard/page.tsx` | No matches (empty output) | 0B.3 |
| TT-04 | VITEST | `attendance.test.tsx` | Render AttendancePage | Assert element text | Element contains "not available in the current version"; no MOCK_CHECKINS entries rendered | 0B.3 |
| TT-05 | VITEST | `billing.test.tsx` | Render BillingPage | Assert element text | Element contains "not available in the current version"; no hardcoded ₹ amounts | 0B.3 |
| TT-06 | VITEST | `reports.test.tsx` | Render ReportsPage | Assert element text | Element contains "not available in the current version"; no SVG report data | 0B.3 |
| TT-07 | VITEST | `gyms.test.tsx` | Navigate to `/gyms` | Assert redirect target | Navigation results in `/settings?tab=branches` | 0B.3 |
| TT-08 | VITEST | `login.test.tsx` | Render LoginPage | Assert absence of each claim string from Section 9.13 | "All Systems Operational" not in DOM | 0B.3 |
| TT-09 | VITEST | `signup.test.tsx` | Render SignupPage | Assert absence of each claim string | "SOC 2 CERTIFIED", "ISO ENCRYPTED", "SECURE CLOUD" not in DOM | 0B.3 |
| TT-10 | VITEST | `router.test.tsx` | Render router fallback | Assert fallback text | Fallback element textContent is "Loading…" (not containing "Registry") | 0B.3 |

### Controls

| ID | Type | Proposed Test/Evidence File | Setup/Precondition | Action/Command | Exact Expected Assertion/Result | Work Pkg |
|---|---|---|---|---|---|---|
| CT-01 | VITEST | `settings.test.tsx` | Render SettingsPage with security tab active | Assert DOM absence | No toggle switch elements with "Two-Factor" or "Auto Sign-Out" labels | 0B.4 |
| CT-02 | VITEST | `settings.test.tsx` | Render SettingsPage with notifications tab active | Assert DOM absence | No toggle switch elements with "Push" or "Payment Failure" labels | 0B.4 |
| CT-03 | VITEST | `settings.test.tsx` | Render SettingsPage (preferences) | Query retained toggles | Email Alerts and Product Updates elements have `disabled` attribute, `role="switch"`, `aria-checked` set correctly | 0B.4 |
| CT-04 | VITEST | `settings.test.tsx` | Render SettingsPage (preferences) | Assert DOM absence | No element with text "Delete Gym" | 0B.4 |
| CT-05 | VITEST | `login.test.tsx` | Render LoginPage | Query Google button | No button or element with "Google" visible text | 0B.4 |
| CT-06 | VITEST | `login.test.tsx` | Render LoginPage | Query forgot-password | No `<a>` element with "Forgot password" textContent | 0B.4 |
| CT-07 | AUTOMATED_STATIC_CHECK | Grep verification | All files edited | `grep -rnE '(alert|prompt)[[:space:]]*\(' src/pages/dashboard/ src/pages/attendance/ src/pages/billing/ src/pages/reports/ src/pages/gyms/ src/pages/settings/ src/components/settings/BranchContactsSection.tsx` | No matches. Permitted `window.confirm()` calls in real destructive workflows are outside the `alert\|prompt` pattern and remain preserved. | 0B.4 |

### Authentication

| ID | Type | Proposed Test/Evidence File | Setup/Precondition | Action/Command | Exact Expected Assertion/Result | Work Pkg |
|---|---|---|---|---|---|---|
| AT-01 | VITEST (BLOCKED on OQ-01) | `logout.test.tsx` | MSW mock `POST /auth/logout` → 200 | Trigger handleLogout | `POST /auth/logout` was called once | 0B.5 |
| AT-02 | VITEST (BLOCKED on OQ-01) | `logout.test.tsx` | MSW mock `POST /auth/logout` → network error | Trigger handleLogout | Local cleanup proceeds; localStorage `auth-storage` is null; navigation to `/login` | 0B.5 |
| AT-03 | VITEST (BLOCKED on OQ-01) | `logout.test.tsx` | MSW mock `POST /auth/logout` → 401 | Trigger handleLogout | Local cleanup proceeds; no retry loop; navigation to `/login` | 0B.5 |
| AT-04 | VITEST (BLOCKED on OQ-01) | `logout.test.tsx` | MSW mock `POST /auth/logout` → 200 | Trigger handleLogout; check request count | `POST /auth/refresh` was NOT called (no refresh loop) | 0B.5 |
| AT-05 | VITEST (BLOCKED on OQ-01) | `logout.test.tsx` | MSW mock `POST /auth/logout` → 200 | Trigger handleLogout; read localStorage | `localStorage.getItem('auth-storage')` is null | 0B.5 |
| AT-06 | VITEST (BLOCKED on OQ-01) | `logout.test.tsx` | MSW mock `POST /auth/logout` → 200 | Trigger handleLogout; read sessionStorage | `sessionStorage.getItem('signup-email')` and `signup-poll-token` are null | 0B.5 |
| AT-07 | VITEST (BLOCKED on OQ-01) | `logout.test.tsx` | Pre-populate React Query cache | Trigger handleLogout | React Query cache is empty after logout | 0B.5 |
| AT-08 | VITEST (BLOCKED on OQ-01) | `logout.test.tsx` | MSW mock `POST /auth/logout` → 200 | Trigger handleLogout; check navigation | Current route is `/login` | 0B.5 |
| AT-09 | VITEST | `branchContacts.test.tsx` | MSW mock branch contacts API → 401 | Trigger an API call that hits the component's error handler | `localStorage.getItem('auth-storage')` is null after error handling; `clearAuth()` was called | 0B.5 |

### Data Correctness

| ID | Type | Proposed Test/Evidence File | Setup/Precondition | Action/Command | Exact Expected Assertion/Result | Work Pkg |
|---|---|---|---|---|---|---|
| DC-01 | VITEST | `dateUtils.test.ts` | `TZ=Asia/Kolkata`; import `getLocalDateString` | `getLocalDateString(new Date('2026-01-14T22:00:00Z'))` | Returns `"2026-01-15"` | 0B.6 |
| DC-02 | VITEST | `dateUtils.test.ts` | `TZ=Asia/Kolkata` | `getLocalDateString(new Date('2026-01-15T14:00:00Z'))` | Returns `"2026-01-15"` | 0B.6 |
| DC-03 | VITEST | `dateUtils.test.ts` | `TZ=UTC` | `getLocalDateString(new Date('2026-01-15T12:00:00Z'))` | Returns `"2026-01-15"` | 0B.6 |
| DC-04 | VITEST | `dateUtils.test.ts` | `TZ=America/New_York` | `getLocalDateString(new Date('2026-01-15T02:00:00Z'))` | Returns `"2026-01-14"` (crosses to previous calendar day in NY) | 0B.6 |
| DC-05 | VITEST | `dateUtils.test.ts` | `TZ=UTC` | `getLocalDateString(new Date('2024-02-29T12:00:00Z'))` | Returns `"2024-02-29"` | 0B.6 |
| DC-06 | VITEST | `dateUtils.test.ts` | `TZ=Asia/Kolkata` | `getLocalDateString(new Date('2025-12-31T20:00:00Z'))` | Returns `"2026-01-01"` (month/year boundary) | 0B.6 |
| DC-07 | VITEST | `dateUtils.test.ts` | `TZ=Asia/Kolkata` | `getLocalDateString(new Date('2025-12-31T00:00:00Z'))` | Returns `"2025-12-31"` (same date, no boundary cross) | 0B.6 |
| DC-08 | VITEST | `members.test.tsx` | MSW mock returns array of 5 members with `total: 50` | Render MembersPage | Info element visible with text containing "Showing the first" and "50" | 0B.6 |
| DC-09 | VITEST | `members.test.tsx` | MSW mock returns array of 5 members with `total: 5` | Render MembersPage | Info element NOT visible | 0B.6 |

### Routing

| ID | Type | Proposed Test/Evidence File | Setup/Precondition | Action/Command | Exact Expected Assertion/Result | Work Pkg |
|---|---|---|---|---|---|---|
| RT-01 | VITEST | `router.test.tsx` | MemoryRouter at `/nonexistent` | Render router | Page renders "Page not found" text | 0B.7 |
| RT-02 | VITEST | `router.test.tsx` | Test component that throws during render; wrapped in route with `errorElement` | Render route | Error boundary fallback element is visible | 0B.7 |
| RT-03 | VITEST | `router.test.tsx` | After error boundary rendered | Navigate to `/dashboard` | Dashboard content renders (recovery successful) | 0B.7 |
| RT-04 | MANUAL_VERIFICATION | Manual procedure document | Build app; serve; use browser DevTools to block a route chunk URL | Navigate to lazy-loaded page whose chunk is blocked | Error boundary fallback is displayed; not a blank screen | 0B.7 |

### Accessibility

| ID | Type | Proposed Test/Evidence File | Setup/Precondition | Action/Command | Exact Expected Assertion/Result | Work Pkg |
|---|---|---|---|---|---|---|
| AC-01 | VITEST | `dialogFocus.test.tsx` | Render form dialog; `useDialogFocus` attached | Open dialog | `document.activeElement` is the first focusable element inside the dialog | 0B.8 |
| AC-02 | VITEST | `dialogFocus.test.tsx` | Dialog open; focus on first element | `userEvent.tab()` | Focus moves to next focusable within dialog; does NOT escape to background | 0B.8 |
| AC-03 | VITEST | `dialogFocus.test.tsx` | Dialog open; focus on second element | `userEvent.tab({shift: true})` | Focus moves to previous focusable within dialog | 0B.8 |
| AC-04 | VITEST | `dialogFocus.test.tsx` | Dialog open | `userEvent.keyboard('{Escape}')` | Dialog is closed; `onClose` callback was called | 0B.8 |
| AC-05 | VITEST | `dialogFocus.test.tsx` | Dialog open; track trigger element ref | Close dialog via Escape | `document.activeElement` is the trigger element that opened the dialog | 0B.8 |
| AC-06 | VITEST | `dialogFocus.test.tsx` | Render dialog | Query dialog element | Element has `role="dialog"`, `aria-modal="true"`, `aria-labelledby` referencing the title | 0B.8 |
| AC-07 | VITEST | `settings.test.tsx` | Render SettingsPage; retained toggles | Query retained switches | Elements have `role="switch"`, `aria-checked` matches initial state, `disabled` attribute present | 0B.8 |
| AC-08 | VITEST | `buttonFocus.test.tsx` | Render Button component | `userEvent.tab()` to focus the button | Button has `:focus-visible` ring styles applied (computed style check for outline/box-shadow) | 0B.8 |
| AC-09 | VITEST | `reducedMotion.test.tsx` | `window.matchMedia('(prefers-reduced-motion: reduce)')` mocked to `true` | Render component with spinner | Spinner element does NOT have CSS `animation` property with rotation; shows static text | 0B.8 |

**Total: 50 cases. 49 automated (VITEST/AUTOMATED_STATIC_CHECK/AUTOMATED_BUILD_CHECK). 1 manual (RT-04).**

**Mechanical count validation:** `awk '/^## Appendix C/,/^## Appendix D/' docs/frontend/PHASE_0B_BASELINE_AND_TRUST_BLOCKERS_PLAN.md | grep -oP '^[|] \x60?[A-Z]+-\d+' | sort -u | wc -l` must return 50.

## Appendix D — Full Test Command Matrix

```bash
TZ=Asia/Kolkata npm run test
TZ=UTC npm run test
TZ=America/New_York npm run test
npm run test:platform-billing
```

No dependency installation required. Uses existing `npm run test` script (`vitest run`). `TZ` is a standard Linux environment variable supported by Node.js.

---

```
HARD STOP — Phase 0B v0.5 exact compliance repair is complete. The plan requires G-01R Product Owner review. No implementation, staging, commit, push, pull request or later-phase work is authorized.
```
