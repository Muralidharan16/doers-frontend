# DOERS Frontend — Phase 0B-A0 Supplementary Audit Addendum Planning

## 5.1 Document Control

* **Title:** Phase 0B Supplementary Audit Addendum
* **Status:** FINAL CORRECTED DRAFT — READY FOR SUPPLEMENTARY PLAN REVIEW. NO IMPLEMENTATION AUTHORIZED.
* **Repository:** `/home/jeevashri/Projects/doers-front/doers-frontend`
* **Branch:** `main`
* **Baseline HEAD:** `04e76e1f278fe91d0c52bee9e0382a83a7586138`
* **origin/main:** `df4e5cb23f61e8141a6d0698193826839c924a48`
* **Governing Phase 0B Plan Path:** `docs/frontend/PHASE_0B_BASELINE_AND_TRUST_BLOCKERS_PLAN.md`
* **Governing Phase 0B Plan Checksum:** `ee883519f7766e4144cd737f5e8f01bcebefe617924dff64a19619bfb1f2c6d3`
* **Product/UI Constitution Checksum:** `7f1c1b223921eaba780148c96ac9d999944142a9a24df86e4162d33032e24012`
* **Enterprise Constitution Checksum:** `603b385af500efc808faae11f26865e1f79392811e035b55d354b3318198f3e9`
* **Authorization Limitations:** This document is for planning and investigation only. It does not authorize implementation. No code changes, commits, stages, pushes, pulls, merges, or rebase actions are authorized under Phase 0B-A0. Platform Billing remains absolutely protected and untouched.
* **Document Date:** `2026-07-20`
* **Agent and Reasoning Level:** Antigravity (Gemini 3.1 Pro (High))

---

## 5.2 Executive Summary

The broader repository audit has confirmed four material findings not fully represented in the original Phase 0B plan:
* **Deployment Safety:** Accidental production builds currently bake local-only environment variables (`http://127.0.0.1:8000`) into the production JS bundles.
* **Configuration Determinism:** Tracked duplicate config files shadow the primary configuration. `vite.config.js` is the executable tracked artifact that direct Vite commands currently resolve before `vite.config.ts`. `vite.config.d.ts` is a generated declaration artifact but does not itself shadow the TypeScript configuration.
* **Dependency Security:** Outdated direct and transitive packages contain security advisories (e.g., CRLF injection, CSRF) that must be safely patched following triage.
* **Accessibility Completeness:** Several settings-related overlays and confirmations lack keyboard access and ARIA semantics, representing Phase 1 debt.

These findings must be addressed in subsequent micro-phases before production deployment to protect system trust, security, and accessibility.

---

## 5.3 Baseline Evidence

### Pre-creation Git status
```text
$ git branch --show-current
main

$ git rev-parse HEAD
04e76e1f278fe91d0c52bee9e0382a83a7586138

$ git rev-parse origin/main
df4e5cb23f61e8141a6d0698193826839c924a48

$ git status --short --branch --untracked-files=all
## main...origin/main [ahead 1]
?? docs/enterprise/DOERS_ENTERPRISE_QUALITY_CONSTITUTION.md
```

### Plan and Constitution Checksums
```text
$ sha256sum docs/frontend/PHASE_0B_BASELINE_AND_TRUST_BLOCKERS_PLAN.md docs/frontend/DOERS_PRODUCT_UI_UX_CONSTITUTION.md docs/enterprise/DOERS_ENTERPRISE_QUALITY_CONSTITUTION.md
ee883519f7766e4144cd737f5e8f01bcebefe617924dff64a19619bfb1f2c6d3  docs/frontend/PHASE_0B_BASELINE_AND_TRUST_BLOCKERS_PLAN.md
7f1c1b223921eaba780148c96ac9d999944142a9a24df86e4162d33032e24012  docs/frontend/DOERS_PRODUCT_UI_UX_CONSTITUTION.md
603b385af500efc808faae11f26865e1f79392811e035b55d354b3318198f3e9  docs/enterprise/DOERS_ENTERPRISE_QUALITY_CONSTITUTION.md
```

### Environment and Runtime Tooling
* **Node Version:** `v22.18.0`
* **npm Version:** `10.9.3`

### Relevant Packages (package.json / npm outdated)
* `react`: `^19.2.5` (Current: `19.2.6`, Wanted: `19.2.7`)
* `react-dom`: `^19.2.5` (Current: `19.2.6`, Wanted: `19.2.7`)
* `react-router-dom`: `^7.15.0` (Current: `7.15.0`, Wanted: `7.18.1`)
* `vite`: `^5.4.21` (Current: `5.4.21`, Wanted: `5.4.21`, Latest: `8.1.5`)
* `axios`: `^1.16.0` (Current: `1.16.0`, Wanted: `1.18.1`)
* `typescript`: `~6.0.2` (Current: `6.0.3`, Wanted: `6.0.3`, Latest: `7.0.2`)
* `vitest`: `^4.1.9` (Current: `4.1.9`, Wanted: `4.1.10`)
* `zustand`: `^5.0.13` (Current: `5.0.13`, Wanted: `5.0.14`)

### Current Environment Files
* `.env` (Tracked in Git):
  ```text
  VITE_API_BASE_URL=http://127.0.0.1:8000
  ```
* `.env.example`: *Does not exist in root.*

### Vite Config Files
* `vite.config.ts` (Tracked in Git)
* `vite.config.js` (Tracked in Git)
* `vite.config.d.ts` (Tracked in Git)
* `tsconfig.tsbuildinfo` (Tracked in Git)

### Current Modal / Overlay Source Locations
* `src/pages/members/page.tsx:645-823`
* `src/pages/subscriptions/page.tsx:538-640`
* `src/components/settings/MembershipPlansSection.tsx:197-209` (containing `MembershipPlanForm.tsx`)
* `src/components/settings/BranchContactsSection.tsx:307-429`
* `src/components/settings/BranchManagementSection.tsx:715-739`
* `src/components/settings/BranchManagementSection.tsx:741-780`
* `src/components/settings/BranchManagementSection.tsx:782-838`

### Actual post-correction Git status
```text
## main...origin/main [ahead 1]
?? docs/enterprise/DOERS_ENTERPRISE_QUALITY_CONSTITUTION.md
?? docs/frontend/PHASE_0B_SUPPLEMENTARY_AUDIT_ADDENDUM.md
```

---

## 5.4 Supplementary Blocker Inventory

### P0B-036 — Production API Endpoint Safety

1. **ID:** `P0B-036`
2. **Title:** Production API Endpoint Safety
3. **Category:** Deployment / Configuration / Data Connectivity
4. **Severity:** Critical
5. **Primary status:** Active
6. **User impact:** Production builds automatically embed the local development URL (`http://127.0.0.1:8000`), breaking all backend communication for end users in production.
7. **Exact evidence:**
   * `.env` is tracked in Git (`git ls-files .env`) containing `VITE_API_BASE_URL=http://127.0.0.1:8000`.
   * `src/shared/services/api/client.ts` defines:
     `baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'`
   * Production builds silently bake `http://127.0.0.1:8000` into `dist` bundles as a static replacement for `import.meta.env.VITE_API_BASE_URL`.
8. **Confirmed facts:**
   * The local `.env` is committed to Git.
   * `.env.example` is missing.
   * Vite bakes `.env` values into production builds.
   * Missing production configuration results in silent fallbacks to local endpoints.
9. **Assumptions or unknowns:**
   * Production hosting environment strategy (separate API subdomain vs same-origin proxy).
10. **Root cause:** Committing a local environment config to repository control instead of leveraging `.env.example` templates and build validation.
11. **Required treatment:**
    * Rely on Phase 0B.1A and 0B.1B for `.gitignore` updates and `.env` index removal.
    * Provide a safe `.env.example` template.
    * Secure the production API origin/path decision supporting either absolute API-origin strategy or same-origin path strategy.
    * Implement compile-time validation in `vite.config.ts` or during startup to enforce the chosen production API strategy requirements.
12. **Dependencies:** Successful completion of 0B.1A and 0B.1B for repository hygiene; Product Owner strategy decision on absolute URL vs same-origin path.
13. **Protected boundary:** Platform Billing endpoints must not have their API semantics modified.
14. **Verification requirements:** Replace generic missing-variable failure requirements with conditional tests for the selected strategy.
15. **Acceptance evidence:** Built assets contain the Product Owner-approved API-base representation—either the approved HTTPS origin or approved same-origin path—and contain no accidental localhost or 127.0.0.1 production endpoint.

---

### P0B-037 — Vite Configuration Authority and Generated Root Artifacts

1. **ID:** `P0B-037`
2. **Title:** Vite Configuration Authority and Generated Root Artifacts
3. **Category:** Build / Configuration Determinism
4. **Severity:** High
5. **Primary status:** Active
6. **User impact:** Configuration changes in `vite.config.ts` may be silently ignored during development, leading to environment mismatches and developer confusion.
7. **Exact evidence:**
   * Root files contain `vite.config.ts`, `vite.config.js`, and `vite.config.d.ts` (all tracked by Git).
   * `vite.config.js` is the executable tracked artifact that direct Vite commands currently resolve before `vite.config.ts`.
   * `vite.config.d.ts` is a generated declaration artifact but does not itself shadow the TypeScript configuration.
   * Direct Vite commands and `npm run dev` may load a stale `vite.config.js`.
   * The current `npm run build` sequence runs `tsc -b` before `vite build`, so `vite.config.js` may be regenerated before Vite loads it. The production build still relies on an unnecessary generated root configuration artifact, but the document must not claim that `vite.config.ts` is always ignored during that build sequence.
8. **Confirmed facts:**
   * Running `tsc -b` generates these files directly in the root directory.
9. **Assumptions or unknowns:**
   * Why these generated artifacts were tracked in Git originally.
10. **Root cause:** Emit output is enabled for `vite.config.ts` in `tsconfig.node.json` with composite build outputs directed to the root directory and tracked in Git.
11. **Required treatment:**
    * Test the existing TypeScript project-reference graph and evaluate emit strategies. No emit strategy is approved in this planning document.
    * Atomically resolve configuration shadowing and remove generated configs from Git tracking.
12. **Dependencies:** None.
13. **Protected boundary:** Must not break TypeScript project references or Vitest configs.
14. **Verification requirements:** Evaluate emit strategies and require evidence for `npx tsc -b --pretty false`, `npx tsc --noEmit`, `npm run build`, Vite resolved config path, root generated-artifact inventory before and after, `npm run test`, and `npm run test:platform-billing`.
15. **Acceptance evidence:** Verified resolved config paths and test evidence with a clean root avoiding generated config collisions.

---

### P0B-038 — Dependency Security Advisories

1. **ID:** `P0B-038`
2. **Title:** Dependency Security Advisories
3. **Category:** Supply Chain / Dependency Security
4. **Severity:** High
5. **Primary status:** Active
6. **User impact:** Vulnerable dependencies represent risk. The current dependency graph contains packages within advisory-affected version ranges. Each advisory requires architectural and environmental applicability analysis before exploitability or production impact is asserted.
7. **Exact evidence:**
   * `npm audit --json` confirms vulnerabilities in `form-data`, `react-router`, `react-router-dom`, `@babel/core`, `esbuild`, and `vite`.
8. **Confirmed facts:**
   * Security advisories exist in the project lockfile.
9. **Assumptions or unknowns:**
   * React 19 compatibility with candidate dependency updates.
10. **Root cause:** The lockfile resolves advisory-affected package versions, and the repository currently lacks an automated dependency-advisory triage and controlled remediation gate.
11. **Required treatment:**
    * Populate and resolve an advisory matrix tracking applicability and proposed treatment using strict lockfile paths and precise GHSA details.
    * Target updates must be evaluated for compatibility before target selection.
12. **Dependencies:** Full typescript compilation and lockfile diff reviews.
13. **Protected boundary:** No Platform Billing source files, routes, API contracts, feature flags, or behavior may be intentionally changed. Because dependencies are shared, every dependency micro-phase must pass all 80 Platform Billing regression tests.
14. **Verification requirements:** Run audit verifications; test applicability of candidate updates; run platform billing tests.
15. **Acceptance evidence:** No unresolved applicable Critical or High production advisory remains without an explicit Product Owner-approved risk disposition. Residual non-applicable, development-only, Moderate, or Low advisories must be documented with exact applicability and remediation/defer reasoning.

**Baseline Advisory Triage Matrix:**

| Package | Installed version | Dependency path | Direct or transitive | Production or development dependency | Exact GHSA/CVE | Advisory severity | Affected versions | Patched versions | Current DOERS usage | Applicability to DOERS | Proposed disposition | Evidence source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `form-data` | `4.0.5` | `axios` -> `form-data` | Transitive | Production | `GHSA-hmw2-7cc7-3qxx` | High | `4.0.0` through `4.0.5` | `4.0.6` | HTTP client request formatting via Axios | Exploitation depends on the Node `form-data` implementation receiving attacker-controlled multipart field names or filenames. NOT YET PROVEN that the Node adapter is shipped and invoked in the DOERS browser bundle. | Triage / controlled update group | `npm audit --json`, `package-lock.json`, GitHub Advisory Database |
| `react-router` | `7.15.0` | `react-router-dom` -> `react-router` | Transitive | Production | `GHSA-84g9-w2xq-vcv6` | Low | `>=7.12.0 <7.15.1` | `7.15.1` | Application routing | DOERS uses Data Mode with `createBrowserRouter` / `RouterProvider`. Declarative Mode and Data Mode are not impacted. | Controlled hygiene update | `npm audit --json`, `package-lock.json`, GitHub Advisory Database |
| `react-router-dom` | `7.15.0` | `react-router-dom` | Direct | Production | `GHSA-84g9-w2xq-vcv6` | Low | `>=7.12.0-pre.0 <7.15.1` | `7.15.1` | Application routing | DOERS uses Data Mode with `createBrowserRouter` / `RouterProvider`. Declarative Mode and Data Mode are not impacted. | Controlled hygiene update | `npm audit --json`, `package-lock.json`, GitHub Advisory Database |
| `@babel/core` | `7.29.0` | `@vitejs/plugin-react` -> `@babel/core` | Transitive | Development | `GHSA-4x5r-pxfx-6jf8` | Low | `<=7.29.0` | `7.29.6` | Vite/React build process | Requires Babel to compile attacker-controlled source code and expose the resulting output under the documented prerequisites. | Controlled hygiene update | `npm audit --json`, `package-lock.json`, GitHub Advisory Database |
| `esbuild` | `0.21.5` | `vite` -> `esbuild` | Transitive | Development | `GHSA-67mh-4wv8-2f99` | Moderate | `<=0.24.2` | `0.25.0` | Dev server and bundler | Concerns the development server and enters through the Vite dependency path. Network-exposed development-server condition. | Controlled hygiene update | `npm audit --json`, `package-lock.json`, GitHub Advisory Database |
| `vite` | `5.4.21` | `vite` | Direct | Development | `GHSA-4w7w-66w2-5vf9` | Moderate | `<=6.4.1` | Requires compatibility evaluation before target selection. | Dev server and bundler | Path Traversal in Optimized Deps `.map` Handling. Network-exposed development-server condition. | Controlled hygiene update | `npm audit --json`, `package-lock.json`, GitHub Advisory Database |
| `vite` | `5.4.21` | `vite` | Direct | Development | `GHSA-v6wh-96g9-6wx3` | Moderate | `<=6.4.2` | Requires compatibility evaluation before target selection. | Dev server and bundler | NTLMv2 hash disclosure via UNC path handling. Windows-only condition. Network-exposed development-server condition. | Controlled hygiene update | `npm audit --json`, `package-lock.json`, GitHub Advisory Database |
| `vite` | `5.4.21` | `vite` | Direct | Development | `GHSA-fx2h-pf6j-xcff` | High | `<=6.4.2` | Requires compatibility evaluation before target selection. | Dev server and bundler | `server.fs.deny` bypass on alternate paths. Windows-only condition. Network-exposed development-server condition. | Controlled hygiene update | `npm audit --json`, `package-lock.json`, GitHub Advisory Database |

---

### P0B-039 — Broader Modal/Dialog Accessibility Inventory

1. **ID:** `P0B-039`
2. **Title:** Broader Modal/Dialog Accessibility Inventory
3. **Category:** Accessibility / Interaction Safety
4. **Severity:** High
5. **Primary status:** Hybrid
6. **User impact:** Keyboard and screen-reader users get stuck or are unaware of modal dialogs on settings pages.
7. **Exact evidence:**
   * Inline overlays lack `role="dialog"`, `aria-modal`, and keyboard traps. We audited:
     1. `src/pages/members/page.tsx:645-823` (Member Profile form)
     2. `src/pages/subscriptions/page.tsx:538-640` (Create Subscription form)
     3. `src/components/settings/MembershipPlansSection.tsx:197-209` (Membership Plan Form)
     4. `src/components/settings/BranchContactsSection.tsx:307-429` (Branch Contact Form)
     5. `src/components/settings/BranchManagementSection.tsx:715-739` (Delete Confirmation)
     6. `src/components/settings/BranchManagementSection.tsx:741-780` (Maintenance Transition)
     7. `src/components/settings/BranchManagementSection.tsx:782-838` (Decommission Transition)
   * Browser-native confirm calls (`window.confirm`) found in `MembershipPlanCard.tsx`, `BranchContactsSection.tsx`, and `members/page.tsx`.
8. **Confirmed facts:**
   * Active Phase 0B subset: Members modal, Subscriptions modal. (These remain covered by P0B-024 in the governing Phase 0B plan).
   * Deferred Phase 1 subset: Membership-plan settings overlay, Branch-contact settings overlay, Branch-management transition/confirmation overlays, Native window.confirm replacement, Any shared Dialog component migration beyond the P0B-024 hook.
9. **Assumptions or unknowns:**
   * Effort needed for a shared Dialog component vs inline application in Phase 1.
10. **Root cause:** Ad-hoc HTML implementations lacking ARIA properties and keyboard focus event handling.
11. **Required treatment:**
    * Create exact Phase 1 backlog entries for the settings overlays and native confirmations.
    * Do not edit settings overlays, replace `window.confirm()`, create a shared Dialog component, or expand `useDialogFocus` into deferred files during Phase 0B.
12. **Dependencies:** Verification against the full overlay inventory.
13. **Protected boundary:** Platform Billing payments must not be broken.
14. **Verification requirements:** Verify overlay inventory matches the defined split between active Phase 0B and deferred Phase 1 subsets.
15. **Acceptance evidence:** Verified complete documentation and Phase 1 backlog tracking items.

---

## 10. Supplementary Work Packages

### 0B-A1 — Production Environment Safety

1. **Objective:** Enforce deployment safety by preventing localhost fallbacks from compiling into production assets.
2. **Included blocker IDs:** `P0B-036`.
3. **Exact scope:** Create a safe `.env.example`, determine the production API-origin/path decision, remove or restrict the localhost fallback, and implement production build/startup validation.
4. **Probable files:** `vite.config.ts`, `.env.example`, `src/shared/services/api/client.ts`.
5. **Explicitly protected files:** `src/features/platformBilling/**`, both constitution files, and `PHASE_0B_BASELINE_AND_TRUST_BLOCKERS_PLAN.md`.
6. **Explicit exclusions:** `.env` ignore and index-removal work (owned exclusively by 0B.1A and 0B.1B). Modifying backend configuration files or Platform Billing API structures.
7. **Dependencies:** Successful completion of 0B.1A and 0B.1B; Product Owner decision on production API path/URL strategy.
8. **Blocking questions:** Should the build process mandate absolute URLs or resolve via relative same-origin reverse-proxy?
9. **Micro-phase decomposition:**
   * *0B-A1.1 — Production API Contract and Environment Template:* Create `.env.example` and execute product API decisions.
   * *0B-A1.2 — Production Build Validation and Client Fallback Safety:* Implement validation and fallback restrictions.
10. **Automated verification:** Production build command appropriately responds depending on the selected strategy (e.g. fails when missing production environment properties if an absolute URL is required).
11. **Manual verification:** Run valid and invalid environment tests and perform built-asset inspections to verify that localhost overrides are rejected.
12. **Risks:** Broken deployment pipeline if environment variable is not passed correctly during build.
13. **Rollback/restoration:** Revert `vite.config.ts` validations.
14. **Evidence-report requirements:** Build error output when building with localhost or empty configuration; built-asset inspection results.
15. **Hard-stop conditions:** If local developer startup or testing is disrupted.
16. **Commit boundaries:**
   * Commit 1: `build: create env template and remove client localhost fallback`
   * Commit 2: `build: validate env variables at build-time`
17. **Agent/reasoning:** Antigravity (planning mode, repository audit).
18. **Authorization lifecycle:** Requires approval of the addendum and a separate micro-phase planning ticket.

---

### 0B-A2 — Vite Configuration Authority

1. **Objective:** Establish `vite.config.ts` as the sole configuration source without prescribing a specific emit strategy before testing.
2. **Included blocker IDs:** `P0B-037`.
3. **Exact scope:** Test the existing TypeScript project-reference graph, select an emit strategy safely, remove generated config files from Git tracking, and resolve configuration shadowing atomically.
4. **Probable files:** `tsconfig.node.json`, `vite.config.js` (untrack), `vite.config.d.ts` (untrack).
5. **Explicitly protected files:** `src/features/platformBilling/**`, `package.json`, and `vite.config.ts`.
6. **Explicit exclusions:** Changing Vite loader aliases or Vitest configs. Treating `noEmit: true` as pre-approved.
7. **Dependencies:** None.
8. **Blocking questions:** Which emit strategy passes all constraints for the TypeScript project-reference graph?
9. **Micro-phase decomposition:**
   * *0B-A2.1 — Read-Only Configuration and Emit Strategy Experiment:* Planning/experiment only. It must: record the exact root artifact inventory; test project references; test each candidate strategy reversibly; record Vite’s resolved configuration path; choose one strategy; make no staged or committed repository change; not delete tracked generated files. Candidate strategies remain: 1. redirect `outDir`, `declarationDir` and `tsBuildInfoFile` to an ignored temporary directory; 2. evaluate an explicit Vite config path only if required; 3. test `noEmit` only as a controlled experiment and reject it if project references or build fail.
   * *0B-A2.2 — Atomic Configuration Authority Implementation:* Only after 0B-A2.1 is reviewed and separately approved. It must atomically: implement the selected strategy; remove `vite.config.js` and `vite.config.d.ts` from Git tracking; prevent them from reappearing; verify Vite resolves `vite.config.ts`; run TypeScript, all tests, 80 Platform Billing tests and production build. (If the selected strategy requires changing a file not currently listed in probable files, stop and amend the micro-phase plan before implementation).
10. **Automated verification:** Evaluate emit strategies and require evidence for `npx tsc -b --pretty false`, `npx tsc --noEmit`, `npm run build`, Vite resolved config path, root generated-artifact inventory before and after, `npm run test`, and `npm run test:platform-billing`.
11. **Manual verification:** Confirm root generated-artifact inventory remains clean.
12. **Risks:** Breaking TypeScript project references if emit configurations are disrupted.
13. **Rollback/restoration:** Restore deleted JS/D.TS config files to tracking and revert `tsconfig` changes.
14. **Evidence-report requirements:** Required logs of `npx tsc -b`, Vite resolved config paths, and test runs.
15. **Hard-stop conditions:** If project references fail; if Vite resolves the wrong config; if root artifacts reappear; or if any Platform Billing test fails.
16. **Commit boundaries:**
   * 0B-A2.1: no commit — experiment and evidence only.
   * 0B-A2.2: one separately authorized atomic commit containing the selected configuration correction and generated-file removals.
17. **Agent/reasoning:** Antigravity (planning mode).
18. **Authorization lifecycle:** Approved addendum followed by micro-phase execution approval.

---

### 0B-A3 — Controlled Dependency Patching

1. **Objective:** Patch high/moderate-severity vulnerabilities securely following advisory matrix triage.
2. **Included blocker IDs:** `P0B-038`.
3. **Exact scope:** Triage advisories and perform required dependency upgrades safely within tightly related dependency groups.
4. **Probable files:** `package.json`, `package-lock.json`.
5. **Explicitly protected files:** All source code (`src/` folders except lockfiles). No Platform Billing source files, routes, API contracts, feature flags, or behavior may be intentionally changed.
6. **Explicit exclusions:** Running blanket `npm audit fix --force` or blindly targeting 0 vulnerabilities if it forces major breaking upgrades. Prescribing exact versions prior to full advisory triage.
7. **Dependencies:** Because dependencies are shared, every dependency micro-phase must pass all 80 Platform Billing regression tests.
8. **Blocking questions:** Which candidate package updates resolve advisories while maintaining React 19 compatibility?
9. **Micro-phase decomposition:**
   * *0B-A3.1 — Advisory Matrix Finalization and Product Owner Disposition*
   * *0B-A3.2+ — One Separately Authorized Dependency Group per Micro-Phase:* After 0B-A3.1, create one micro-phase per tightly related dependency group (e.g., React Router advisory group, Vite/esbuild toolchain group, etc.).
10. **Automated verification:** Run `npm audit` before and after; `npx tsc --noEmit`; `npm run test`; `npm run test:platform-billing`; `npm run build`.
11. **Manual verification:** Document advisory applicability and run a development-server smoke test when dev tooling changes.
12. **Risks:** Broken lockfile states; transitive dependency conflicts.
13. **Rollback/restoration:** Restore original `package.json` and `package-lock.json` lockfiles using exact rollback instructions.
14. **Evidence-report requirements:** Full populated advisory matrix; `npm audit` reports; platform billing test logs. Exact package and target versions, and a lockfile diff review are required.
15. **Hard-stop conditions:** Any Platform Billing source diff; test failures in Platform Billing or compilation errors.
16. **Commit boundaries:**
   * One separately authorized dependency group per commit. Never mix unrelated package upgrades.
17. **Agent/reasoning:** Antigravity (planning mode).
18. **Authorization lifecycle:** Addendum approval, followed by separate micro-phase planning approvals.

---

### 0B-A4 — Extended Overlay Inventory Closure

1. **Objective:** Verify the full overlay inventory, confirm Members and Subscriptions are covered by P0B-024, and create exact Phase 1 backlog entries for the settings overlays and native confirmations.
2. **Included blocker IDs:** `P0B-039`.
3. **Exact scope:** Verification and planning only. Maintain Phase 0B subset scope strictly to P0B-024 (Members/Subscriptions). Document settings overlays and native confirms as Phase 1 debt.
4. **Probable files:** Phase 1 project backlog documentation.
5. **Explicitly protected files:** `src/features/platformBilling/**`.
6. **Explicit exclusions:** Editing settings overlays; replacing `window.confirm()`; creating a shared Dialog component; expanding `useDialogFocus` into deferred files.
7. **Dependencies:** Complete overlay inventory verification.
8. **Blocking questions:** None.
9. **Micro-phase decomposition:**
   * *Phase 0B-A4.1:* Verify overlay inventory and log Phase 1 backlog entries.
10. **Automated verification:** N/A.
11. **Manual verification:** Backlog inspection.
12. **Risks:** Over-committing accessibility fixes in Phase 0B.
13. **Rollback/restoration:** N/A.
14. **Evidence-report requirements:** Verified Phase 1 backlog items.
15. **Hard-stop conditions:** Modification of any application code or overlay component outside P0B-024 constraints.
16. **Commit boundaries:**
   * No application-code commit. Documentation/backlog evidence only.
17. **Agent/reasoning:** Antigravity (planning mode).
18. **Authorization lifecycle:** Addendum approval, followed by separate micro-phase planning approvals.

---

## 11. Open Questions

1. **Question:** Which production API origin/path is authoritative?
   * **Classification:** `BLOCKING`
2. **Question:** Should production use an absolute API URL or same-origin reverse-proxy path?
   * **Classification:** `PRODUCT_OWNER_DECISION`
3. **Question:** Which Vite config file should remain authoritative?
   * **Classification:** `NON_BLOCKING_SAFE_DEFAULT` (Authoritative file is `vite.config.ts`)
4. **Question:** Which TypeScript project currently emits vite.config.js and vite.config.d.ts?
   * **Classification:** `NON_BLOCKING_SAFE_DEFAULT` (`tsconfig.node.json`)
5. **Question:** Can Vite be upgraded within the current Node version?
   * **Classification:** `NON_BLOCKING_SAFE_DEFAULT` (Yes, Node v22.18.0 supports all Vite versions up to v8)
6. **Question:** Which dependency fixes are patch-only versus major?
   * **Classification:** `NON_BLOCKING_SAFE_DEFAULT` (`react-router-dom` to `7.18.1` is a minor-version update; Vite upgrade to `8.1.5` is a major update)
7. **Question:** Which overlays must be fixed in Phase 0B versus deferred to Phase 1?
   * **Classification:** `DEFERRED` (Core profile/admission forms in `members/page.tsx` and `subscriptions/page.tsx` fixed in Phase 0B under `P0B-024`; settings/confirmation overlays deferred to Phase 1)

---

## 12. Protected Boundaries

The following files and paths are absolutely protected and must remain untouched:
* `src/features/platformBilling/**`
* `docs/frontend/DOERS_PRODUCT_UI_UX_CONSTITUTION.md`
* `docs/frontend/PHASE_0B_BASELINE_AND_TRUST_BLOCKERS_PLAN.md`
* `docs/enterprise/DOERS_ENTERPRISE_QUALITY_CONSTITUTION.md`
* `package.json`
* `package-lock.json`
* `.env`
* `vite.config.ts`
* `vite.config.js`
* `vite.config.d.ts`
* All application code and test files (only the new addendum file is authorized to be added).

Phase 0B-A0 authorizes only the creation of `docs/frontend/PHASE_0B_SUPPLEMENTARY_AUDIT_ADDENDUM.md` as an untracked file. No implementation is authorized.
