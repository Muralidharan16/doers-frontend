# Doers Enterprise Quality Constitution

---

## 1. Document Control

| Field | Value |
|---|---|
| **Title** | Doers Enterprise Quality Constitution |
| **Document Version** | 1.0 |
| **Document Status** | Approved |
| **Phase** | 0A — Enterprise Quality Constitution |
| **Purpose** | Establish the permanent minimum quality standards for all Doers platform engineering, security, operations and product work |
| **Scope** | All Doers frontend, backend, database, infrastructure, billing, integration and operational work across all repositories |
| **Owner / Approval Authority** | Product and platform owner |
| **Effective Status** | Effective — explicitly approved by the product and platform owner on 2026-08-15 |
| **Last Updated** | 2026-08-15 |
| **Supersession Rules** | This document supersedes all prior informal quality standards. Future amendments MUST follow the amendment process defined in Section 31 or a subsequent approved phase. |
| **Related Documents** | **Frontend reviewed:** `README.md`, `package.json`, `eslint.config.js`, `tsconfig.json`, `tailwind.config.js`, `vitest.config.ts`, `src/config/flags.ts`, `src/tokens.css`, `src/shared/services/api/client.ts`, `src/features/auth/store/authStore.ts`, `src/shared/components/AuthGuard.tsx`, `src/features/platformBilling/` (schemas, API, types, tests), `src/features/organization/types/`. **Backend reviewed (gymflow-backend):** `README.md`, `docs/architecture/DOERS_PLATFORM_SUBSCRIPTION_CONSTITUTION_V2.md`, `docs/architecture/DOERS_PLATFORM_SUBSCRIPTION_V3_1_EXECUTION_SPEC.md`, `docs/architecture/PLATFORM_BILLING_SESSION_SECURITY_MIGRATION_PLAN.md`, `docs/finance/PHASE_5A_VITARA_FINANCE_CORE_RAZORPAY_CONTRACT_FREEZE_REPORT.md`, `docs/finance/PHASE_5B_VITARA_FINANCE_CORE_IMPLEMENTATION_PLAN.md`, `docs/subscription-lifecycle-phase-0-audit.md`, `docs/subscription-lifecycle-phase-1-domain-design.md`, `docs/subscription-lifecycle-phase-1-5-baseline-report.md`, `docs/subscription-lifecycle-phase-2-migration-report.md`, `docs/subscription-lifecycle-phase-3-read-layer-report.md`. **Pending review:** Infrastructure configuration, CI workflows, deployment documents, production environment configuration. |
| **Approval Requirement** | Satisfied — explicit owner approval recorded on 2026-08-15. |
| **Cross-Repository Validation Status** | Completed against the authoritative backend repository (`gymflow-backend`, `git@github.com:Muralidharan16/gymflow-backend.git`), Platform Billing constitution V2, V3.1 execution specification, session security migration plan, Finance Core phase documents, and subscription lifecycle phase documents. Cross-platform alignment confirmed; corrections applied in Phase 0A-R2. |

### Revision History

| Version | Date | Phase | Summary | Approval Status |
|---|---|---|---|---|
| 0.1-draft | 2026-07-13 | 0A | Initial enterprise-quality constitution and review corrections | Draft — not approved |
| 0.2-draft | 2026-07-13 | 0A-R2 | Cross-repository validation against backend; organisation, location, tenant-context, tenant-scoped repositories, CORS, CSRF, production mock data, route/action permissions corrected; related documents updated with reviewed backend paths; revision history added | Draft — not approved |
| 1.0 | 2026-08-15 | 0A-R2 | Owner ratification of the reviewed Enterprise Quality Constitution; document-control status made effective with no additional normative requirement changes | Approved — effective |

Version 0.2-draft reflects substantial cross-repository validation and constitutional corrections that change normative requirements. The version increment from 0.1 to 0.2 acknowledges that multiple sections were materially revised, not merely edited for clarity.

Version 1.0 ratifies the reviewed 0.2-draft following explicit approval by the product and platform owner on 2026-08-15. Ratification changes the document's approval and effective status but introduces no additional normative requirements beyond the reviewed 0.2-draft.

### Normative Language

This document uses the following normative terms:

- **MUST** — A mandatory requirement. Non-compliance is a defect.
- **MUST NOT** — A prohibition. Violation is a defect.
- **SHOULD** — A strongly recommended practice. Deviation requires documented rationale.
- **MAY** — An optional practice that is permitted but not required.

---

## 2. Purpose

This constitution defines the minimum quality standard for all:

- frontend work;
- backend work;
- database work;
- infrastructure work;
- security work;
- billing work;
- integrations;
- reports;
- background jobs;
- operational tooling;
- production releases.

Feature completion does NOT override these requirements. A feature that is functionally complete but violates any mandatory requirement of this constitution is NOT considered done.

---

## 3. Product Scope

Doers is a multi-tenant SaaS operating platform for diverse fitness-business categories, including but not limited to:

- commercial gyms;
- yoga studios;
- Pilates and reformer studios;
- CrossFit and functional-fitness centres;
- martial-arts academies;
- boxing and combat-sports centres;
- dance schools;
- swimming academies;
- personal-training studios;
- sports academies;
- multi-sport facilities;
- other fitness and activity businesses.

Doers is NOT gym-only software. The platform MUST maintain neutral core concepts that serve all supported business types. Niche-specific terminology and workflows MAY vary by business profile, but shared security, reliability, data integrity and platform foundations MUST remain consistent across all profiles.

---

## 4. Definitions

| Term | Definition |
|---|---|
| **Organisation** | An independently governed Doers business workspace or customer account operating one or more locations. It MAY represent a legal entity, sole proprietor, fitness brand, franchise group, enterprise division or another approved business unit. The relationship between an Organisation and legal entities MUST be explicitly modelled where tax, billing, privacy or contractual rules require it. |
| **Tenant** | The currently approved security and data-isolation boundary for Doers. The approved tenancy boundary MUST be explicitly documented and consistently enforced. An organisation is the normal tenant boundary, while enterprise or platform-level models require separately approved architecture. |
| **Location** | A physical, virtual or otherwise approved operating unit through which an Organisation provides services. Examples include a gym, studio, academy, pool, court, outdoor programme, online coaching unit or mobile-service operation. Physical-address requirements apply only when the location type requires them. An organisation MAY operate multiple locations. |
| **User** | A User is an authenticated identity in Doers. Organisation access MUST be granted through explicit, revocable organisation membership or another approved relationship. A user MAY have access to one or more organisations only when the approved product and authorisation model permits it. Identity alone does not grant tenant access. |
| **Organisation Membership** | The explicit relationship between a user and an organisation. It includes: status (active, suspended, revoked); assigned role and capabilities; location scope where applicable; effective dates where required; revocation capability; and complete audit history. |
| **Staff Member** | A user who holds an active organisation membership and works for or on behalf of the fitness-business organisation, operating the Doers platform in an administrative or operational capacity. |
| **Member / Customer** | An individual who is a client, student, athlete, or member of the fitness business. Members do not automatically receive administrative workspace access. Members MAY use controlled member-facing experiences such as bookings, renewals, invoices or progress tracking. Member-facing access MUST have separate permissions and security boundaries from staff-member access. |
| **Capability** | A discrete, named permission that grants the right to perform a specific protected operation. Capabilities are the atomic units of authorisation. |
| **Role** | A named collection of capabilities assigned to a staff member through their organisation membership. Roles define what operations a staff member is permitted to perform. |
| **Platform Administrator** | A Doers employee or contractor who operates the SaaS platform infrastructure. Platform administrators are distinct from organisation staff and MUST NOT have routine access to tenant data. |
| **Platform Billing** | The financial domain representing money that fitness businesses pay to Doers for using the SaaS platform. Includes subscriptions, plans, checkout, invoices, dunning, entitlements and platform-level payment processing. |
| **Facility Member Commerce** | The financial domain representing money that a fitness business collects from its own members, students, athletes or customers. Includes member subscriptions, packages, payments, refunds, discounts, taxes and receipts. |
| **Source of Truth** | For each authoritative domain fact or aggregate, one system or component MUST be designated as the authoritative owner. Caches, replicas, projections, search indexes, analytics stores and provider mirrors MAY exist, but MUST remain derivative and reconcilable and MUST NOT silently become competing authorities. |
| **Idempotency** | The property that repeating the same operation with the same idempotency key produces the same result and side effects as executing it once. |
| **Optimistic Concurrency** | A strategy where concurrent updates are detected by comparing a version token (e.g., ETag, version column) and rejecting conflicting writes rather than silently overwriting. |
| **Audit Event** | An immutable, timestamped record of a security-sensitive or business-significant action, including the actor, operation, target, outcome and relevant context. |
| **Sensitive Data** | Any data whose unauthorised disclosure, modification or destruction could cause harm. Includes credentials, tokens, personal data, financial records, health information and tenant-specific business data. |
| **Production-Ready** | A state where all applicable release gates (Section 26) are satisfied, all mandatory tests pass, no unresolved critical defects exist, and the owner has approved deployment. |
| **Release Gate** | A mandatory condition that MUST be satisfied before a change is deployed to production. |
| **Accepted Risk** | A known defect or deviation that has been explicitly documented with an owner, rationale, mitigation, expiry date and tracking reference, and approved through the exception process. |
| **Critical Workflow** | Any user-facing or system operation whose failure would result in data loss, financial error, security breach, tenant-isolation violation, or inability to conduct core business operations. |

---

## 5. Quality Hierarchy

When quality attributes conflict, the following priority order applies (highest first):

1. **Protection of people, credentials and data** — Security of individuals and their information.
2. **Tenant isolation and authorisation correctness** — No cross-tenant access; correct permission enforcement.
3. **Financial and transactional correctness** — Accurate monetary calculations; correct payment processing.
4. **Data integrity and recoverability** — Invariants preserved; data recoverable after failures.
5. **Reliability and operational continuity** — System remains available and correct under adverse conditions.
6. **Accessibility and user comprehension** — All users can perceive, understand and operate the interface.
7. **Product correctness** — Features behave as specified.
8. **Maintainability and testability** — Code is understandable, modifiable and verifiable.
9. **Performance** — Operations complete within acceptable time budgets.
10. **Visual refinement** — Aesthetic polish and brand consistency.

Visual polish MUST NOT compensate for or mask insecure, unreliable or incorrect behaviour. A visually refined screen that violates tenant isolation or misrepresents financial data is a defect, not an achievement.

---

## 6. Security Requirements

### 6.1 Secure Authentication

- Authentication mechanisms MUST be explicitly documented and reviewed.
- Authentication MUST fail closed: unresolved identity MUST result in denial.
- Multi-factor authentication readiness MUST be maintained in the session architecture.

### 6.2 Session Lifecycle

- Session creation, renewal, invalidation and destruction MUST follow a documented lifecycle.
- Sessions MUST have defined maximum lifetimes.
- Session invalidation MUST propagate to all active server-side sessions and credentials.

### 6.3 Credential Handling

- Long-lived credentials (refresh tokens, API keys) MUST NOT be unnecessarily exposed to JavaScript.
- Production long-lived bearer or session credentials MUST NOT be stored in `localStorage`, `sessionStorage` or IndexedDB. Deviation is permitted only through an explicitly approved, time-limited security exception.
- Credentials SHOULD be held through a server-managed session or secure `HttpOnly`, `Secure`, appropriately configured cookie architecture where compatible with the approved session design.
- Credentials MUST NOT be written to logs, analytics, error messages or browser storage without explicit justification.

### 6.4 Password-Reset Behaviour

- Password-reset flows MUST NOT reveal whether an account exists.
- Reset tokens MUST be single-use, time-limited and invalidated after use.

### 6.5 Logout and Revocation

- Logout MUST revoke server-side sessions and refresh credentials.
- Access tokens MUST have bounded lifetimes; stateless tokens cannot be individually invalidated before expiry.
- Revocation MUST be verified through revocation or version checks for high-risk operations where required.
- Access-token lifecycle (issuance, renewal, rotation, revocation, concurrency behaviour) MUST be documented separately from refresh/session credentials.
- Revocation MUST propagate within documented expectations.
- Complete testing of multi-tab and concurrent renewal behaviour MUST be performed.

### 6.6 Multi-Factor Readiness

- The session architecture MUST support the addition of multi-factor authentication without requiring fundamental redesign.

### 6.7 CSRF Prevention

- Cookie-authenticated or other ambient-authority state-changing requests MUST use approved CSRF protections.
- Architectures that do not use ambient browser credentials MUST document why CSRF is not applicable while still protecting against XSS, replay, origin confusion and credential leakage.
- All state-changing operations MUST be protected against Cross-Site Request Forgery where ambient authority exists.
- Cookie-based authentication MUST use appropriate CSRF countermeasures (e.g., SameSite attributes, CSRF tokens).

### 6.8 XSS Prevention

- All user-supplied content MUST be escaped or sanitised before rendering.
- Content Security Policy headers MUST restrict script sources.

### 6.9 Injection Prevention

- All database queries MUST use parameterised statements or equivalent safe query construction.
- All system commands MUST avoid shell injection vectors.

### 6.10 Secure Headers

- HTTP responses MUST include appropriate security headers (e.g., `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `Referrer-Policy`).

### 6.11 Content Security Policy

- A Content Security Policy MUST be defined and enforced.
- The policy MUST be as restrictive as functionally possible.

### 6.12 CORS

- Authenticated, credentialed or sensitive production APIs MUST use an explicit approved origin policy and MUST NOT use unrestricted wildcard origins.
- Intentionally public, non-credentialed resources MAY use broader CORS policies only when documented and supported by the threat model.
- Credentialed requests MUST never combine unsafe origin reflection with credentials.

### 6.13 Rate Limiting

- Authentication endpoints MUST be rate-limited.
- API endpoints MUST have appropriate rate limits to prevent abuse.

### 6.14 Brute-Force Protection

Authentication endpoints MUST implement an appropriate combination of:

- account- and source-aware throttling;
- progressive delays;
- rate limiting;
- suspicious-login detection;
- CAPTCHA or step-up verification where justified;
- temporary lockout only where designed safely;
- secure recovery mechanisms;
- protection against attackers deliberately locking out legitimate users.

Generic account lockout without consideration for denial-of-service via lockout is NOT sufficient.

### 6.15 File-Upload Safety

Uploaded files MUST satisfy all of the following:

- size validation;
- extension and content-type validation;
- magic-byte or content inspection where appropriate;
- randomised storage names;
- access control;
- malware scanning according to risk;
- no execution of uploaded content;
- `X-Content-Type-Options: nosniff` on served responses;
- safe `Content-Disposition` headers;
- restricted caching for sensitive files;
- isolated media origin for untrusted active content or where the threat model requires it.

Original filenames MUST never control executable storage paths.

### 6.16 Secrets Management

- Secrets MUST NOT be committed to source control.
- Secrets MUST be managed through environment variables or a dedicated secrets manager.
- `.env` files containing secrets MUST be listed in `.gitignore`.

### 6.17 Dependency Security

- Dependencies MUST be monitored for known vulnerabilities.
- Critical dependency vulnerabilities MUST be addressed within an approved timeframe.

### 6.18 Logging Redaction

- Logs MUST NOT contain plaintext passwords, tokens, API keys, full credit-card numbers or other sensitive credentials.
- Personal data in logs MUST follow data-minimisation principles.

### 6.19 Auditability

- Security-sensitive actions (authentication, authorisation changes, data exports, privilege escalation) MUST produce audit events.

### 6.20 Privilege Separation

- Platform-administrator access MUST be separate from tenant-level access.
- Administrative tools MUST require explicit elevated privileges.

### 6.21 Administrative Access

- Administrative cross-tenant access MUST be exceptional, explicit, restricted, time-limited and audited.

### 6.22 Security Testing

- Security controls MUST be testable and independently verifiable.
- Automated tests MUST cover authentication bypass, authorisation bypass and tenant-isolation failure scenarios.

### 6.23 Standards Reference

Security requirements SHOULD reference recognised standards including:

- OWASP Application Security Verification Standard (ASVS);
- OWASP Web Security Testing Guide (WSTG);
- NIST Secure Software Development Framework (SSDF).

No certification or compliance status is claimed by this constitution.

---

## 7. Authentication Constitution

- The session design MUST be explicitly documented, including token types, storage mechanisms, lifetimes and renewal behaviour.
- Production long-lived bearer or session credentials MUST NOT be stored in `localStorage`, `sessionStorage` or IndexedDB. Deviation requires an explicitly approved, time-limited security exception. The exact target session architecture will be approved in a subsequent phase after frontend and backend inspection.
- Access-token behaviour MUST be defined separately from refresh and session credentials. Access tokens MAY be short-lived and held in memory; refresh and session credentials MUST follow the stricter storage rules above.
- Refresh and renewal behaviour MUST be safe under concurrency. Simultaneous refresh attempts MUST NOT produce duplicate tokens, race conditions or authentication failures.
- Session invalidation MUST be supported for logout, password change, privilege change and administrative revocation through server-side session or refresh-credential revocation.
- Session expiry MUST be predictable. Users MUST NOT lose unsaved work without warning where practical.
- Authentication failures MUST NOT produce redirect loops.
- Multi-tab behaviour MUST be defined: concurrent tabs MUST share authentication state consistently, and token renewal in one tab MUST NOT break others.
- Missing or unresolvable identity MUST fail closed (deny access).
- Client-decoded token claims (e.g., JWT payload decoded in the browser) MUST NOT be treated as authoritative backend permission evidence. The backend MUST independently verify identity and authorisation for every protected operation.

---

## 8. Authorisation Constitution

- The backend MUST enforce capability-based authorisation for every protected operation.
- Each protected operation MUST have an explicitly named capability or permission.
- Frontend permission checks are for presentation only (hiding UI elements). They MUST NOT be relied upon as the enforcement boundary.
- Authorisation MUST fail closed: missing, invalid or unresolved permissions MUST deny access.
- No default privileged role MUST exist. A new user or staff member MUST NOT automatically receive administrative capabilities.
- Location-level restrictions MUST be supported where relevant (e.g., a staff member permitted at one location but not another).
- Ownership-transfer operations MUST require explicit elevated authorisation.
- Any cross-organisation transfer or copying of personal or business records:
  - requires a separately designed workflow;
  - MUST NOT be available through normal tenant CRUD permissions;
  - requires source and destination authority where applicable;
  - requires privacy and legal consideration;
  - requires complete audit evidence;
  - MUST define move versus copy semantics;
  - MUST prevent accidental data leakage.
- Platform-administrator capabilities MUST be separate from tenant-level capabilities.
- Changes to roles, capabilities and permissions MUST produce audit events.
- Automated tests MUST verify permission enforcement for each protected operation, including negative tests (denied access).
- Object-level authorisation MUST be enforced against Insecure Direct Object References (IDOR) and Broken Object-Level Authorisation (BOLA). The backend MUST verify that the authenticated user has access to the specific resource being requested, not just the resource type.

---

## 9. Tenant-Isolation Constitution

### 9.1 Mandatory Isolation Layers

Tenant isolation MUST exist at multiple layers:

- **Authenticated server context** — Tenant context MUST be resolved by the server from trusted authentication state and an authorised organisation membership. A client MAY request or select an organisation context, but the server MUST validate that selection against the authenticated identity's active memberships, status, capabilities and location scope. A client-supplied organisation identifier is context, never authority. The system MUST explicitly handle: users with access to multiple organisations; suspended memberships; revoked memberships; stale selected-organisation state; cross-tab organisation switching; background jobs; and platform-administrator context.
- **Backend authorisation** — Every API endpoint MUST verify tenant scope.
- **Tenant-scoped repositories** — Every repository accessing tenant-owned data MUST require and enforce an approved tenant context. Public reference data, platform-owned data and explicitly platform-scoped administrative data MAY use separately authorised repository boundaries. Tenant-owned and platform-owned access paths MUST NOT be ambiguous.
- **Query constraints** — Database queries MUST include tenant-filtering predicates.
- **Database constraints** — Foreign keys and check constraints MUST prevent cross-tenant references where applicable.
- **Row-level security** — Where adopted, RLS policies MUST enforce tenant boundaries at the database level.
- **Automated cross-tenant tests** — Negative tests MUST prove that cross-tenant access is denied.

### 9.2 Scope of Isolation

The following MUST preserve tenant isolation:

- API requests;
- Service methods;
- Repository operations;
- Database queries;
- Background jobs;
- Exports;
- Reports;
- Webhooks;
- Caches;
- Object storage;
- Search indexes;
- Logs (MUST NOT leak one tenant's sensitive data into another tenant's visible output);
- Administrative tooling;
- Analytics.

### 9.3 Client-Supplied Identifiers

Organisation identifiers received from the browser MUST be validated against the trusted server-side authentication context and the authenticated identity's active memberships, status, capabilities and location scope. Client-supplied tenant identifiers are context, never authority. The server MUST reject or ignore client-supplied organisation contexts that the authenticated identity is not authorised to access.

### 9.4 Automated Negative Tests

Automated tests MUST prove cross-tenant denial. At minimum, tests MUST demonstrate that:

- User A from Organisation 1 CANNOT read Organisation 2's data.
- User A from Organisation 1 CANNOT modify Organisation 2's data.
- User A from Organisation 1 CANNOT delete Organisation 2's data.
- Background jobs and exports scoped to Organisation 1 do NOT include Organisation 2's data.

---

## 10. Reliability Constitution

### 10.1 Duplicate Requests

Critical operations MUST be idempotent. Submitting the same request multiple times with the same idempotency key MUST produce the same result and side effects.

### 10.2 Retries

Client retries and server retries MUST be safe. Retry logic MUST use bounded attempts with backoff and jitter.

### 10.3 Concurrency

Concurrent updates to the same resource MUST be handled using optimistic concurrency, pessimistic locking, or deterministic state transitions. Silent overwrites MUST NOT occur.

### 10.4 Timeouts

All external calls (API, database, provider) MUST have explicit timeouts. Operations MUST NOT hang indefinitely.

### 10.5 Partial Outages

The system MUST degrade gracefully when a dependency is unavailable. Non-critical features MAY be disabled, but core operations MUST remain correct.

### 10.6 Provider Failures

External-provider failures (payment gateways, email services, webhooks) MUST be handled with bounded retries, dead-letter queues or reconciliation. The system MUST NOT report success before the authoritative operation has succeeded.

### 10.7 Process Crashes

Operations interrupted by process restarts MUST be recoverable. Incomplete transactions MUST NOT leave the system in an inconsistent state.

### 10.8 Delayed Messages

Background messages and events MUST be processed correctly regardless of delay. Out-of-order delivery MUST NOT corrupt state.

### 10.9 Duplicate Events

Webhook and event handlers MUST be idempotent. Duplicate delivery of the same event MUST NOT produce duplicate side effects.

### 10.10 Out-of-Order Events

Event handlers MUST handle events arriving out of chronological order. Deterministic state transitions MUST prevent invalid state regressions.

### 10.11 Reconciliation

Where eventual consistency is used, reconciliation processes MUST exist to detect and correct drift.

### 10.12 Degraded Modes

Degraded-mode behaviour MUST be documented. Users MUST be informed when the system is operating in a reduced-capability state.

### 10.13 Recovery

Recovery procedures MUST be documented and tested. Critical state transitions MUST be deterministic and testable.

---

## 11. Data-Integrity Constitution

Important invariants MUST be protected using appropriate layers:

- **Request validation** — Input MUST be validated at the API boundary.
- **Domain validation** — Business rules MUST be enforced in the domain/service layer.
- **Service-layer rules** — Complex invariants MUST be checked before persistence.
- **Transactions** — Multi-step operations MUST use database transactions where applicable.
- **Foreign keys** — Referential integrity MUST be enforced at the database level.
- **Uniqueness constraints** — Business uniqueness rules MUST be enforced at the database level where possible.
- **Check constraints** — Value-range and format rules MUST be enforced at the database level where practical.
- **Immutable records** — Audit events, financial transactions and equivalent records MUST be immutable once created.
- **Optimistic concurrency** — Concurrent modification MUST be detected and rejected, not silently overwritten.
- **Audit history** — Changes to critical records MUST be traceable.

Frontend validation improves usability but is NOT an integrity boundary. The backend MUST independently validate all data.

### Financial Immutability

Financial and audit records MUST be immutable. Incorrect financial records MUST NOT be overwritten or deleted to hide history. Corrections MUST use reversal, refund, credit, adjustment or compensating records. The original event and its correction MUST remain traceable. Financial state MUST be reconstructable from authoritative records. Derived balances MAY be recalculated but MUST reconcile to authoritative entries.

---

## 12. Database and Migration Standards

- Migrations MUST be additive and backward-compatible where practical.
- Breaking schema changes MUST use the expand-and-contract pattern.
- Downgrade policy MUST be explicitly documented.
- Data backfills MUST be safe for production-scale tables.
- Lock-risk review MUST be performed for migrations that alter large tables or add indexes.
- Index creation MUST use concurrent strategies where supported to avoid blocking.
- Production-size validation MUST estimate migration duration and lock impact.
- Migration ordering MUST be deterministic and conflict-free.
- Each owned database, schema or explicitly defined migration boundary MUST have one authoritative migration lineage. Parallel conflicting lineages for the same ownership boundary are forbidden.
- Migrations MUST preserve tenant isolation.
- Every migration MUST have:
  - a deployment compatibility plan;
  - an application rollback plan;
  - a data rollback or roll-forward strategy;
  - an explicit statement when downgrade is unsafe;
  - a preference for forward repair where destructive downgrade would create greater risk;
  - restore or recovery evidence for irreversible operations;
  - alignment with accepted existing migration architecture.
- Pre-deployment and post-deployment checks MUST be defined.

**Migrations MUST NOT be generated or modified during Phase 0A.**

---

## 13. API Standards

- **Versioning** — A versioning strategy MUST be defined and followed (e.g., URL path versioning such as `/api/v1/`).
- **Typed contracts** — API request and response schemas MUST be typed.
- **Schema validation** — All API input MUST be validated against declared schemas.
- **Standard error envelopes** — Error responses MUST use a consistent structure including error code, message and correlation ID.
- **Correlation IDs** — Every request MUST be traceable via a correlation ID propagated through the call chain.
- **Pagination** — Potentially unbounded collection endpoints MUST use bounded pagination. Small, explicitly bounded reference collections MAY be returned without pagination.
- **Filtering and sorting** — Where the use case requires filtering or sorting, endpoints MUST support documented parameters.
- **Idempotency** — Creation, financial and other side-effecting operations where duplicate execution would be harmful MUST support an approved repeat-safety mechanism, such as idempotency keys, natural uniqueness or deterministic deduplication.
- **Concurrency control** — Update and delete operations with lost-update or stale-write risk MUST use an approved concurrency-control mechanism.
- **Safe retry classification** — Errors MUST be classified as retryable or non-retryable.
- **Timeout behaviour** — API responses MUST be returned within defined time limits.
- **Authentication** — Every protected endpoint MUST require authentication.
- **Authorisation** — Every protected endpoint MUST verify the caller's capabilities.
- **Tenant scoping** — Every tenant-scoped endpoint MUST enforce tenant isolation.
- **Deprecation** — Deprecated endpoints MUST be documented and sunset according to a published schedule.
- **Backwards compatibility** — Breaking changes MUST be versioned. Non-breaking additions SHOULD be preferred.
- **Observability** — API calls MUST produce structured logs and metrics.
- **Sensitive-data minimisation** — Responses MUST NOT include unnecessary sensitive fields.

---

## 14. Frontend Engineering Standards

### 14.1 TypeScript

- Strict TypeScript MUST be enabled.
- Unjustified use of `any` MUST NOT be permitted. Type narrowing and explicit types SHOULD be preferred.

### 14.2 Architecture

- Clear feature boundaries MUST be maintained.
- Reusable domain components MUST be extracted to shared locations.
- A central API transport MUST be used for all backend communication.
- Runtime response validation SHOULD be applied where appropriate.

### 14.3 State Management

- Explicit server-state management MUST be used.
- Client state MUST be controlled and predictable.

### 14.4 Routing and Permissions

- Route-level permission checks MUST gate access to protected pages requiring one coherent capability.
- Mixed-capability pages require action-level and resource-level presentation checks in addition to route-level guards.
- Frontend route guards and permission checks are for presentation only (hiding UI elements, disabling controls). They MUST NOT be relied upon as the enforcement boundary.
- The backend MUST independently enforce authorisation for every protected operation, regardless of frontend presentation.

### 14.5 Error and Loading States

- Error boundaries MUST be implemented.
- Loading states MUST be defined for asynchronous operations.
- Empty states MUST be handled.
- Stale states MUST be communicated to the user.
- Offline and degraded states MUST be handled gracefully.

### 14.6 Form Preservation

- Form data MUST NOT be unexpectedly discarded during navigation, session refresh or recoverable errors.
- Draft preservation SHOULD be implemented for critical forms.

### 14.7 Mutation Safety

- Mutations MUST use safe patterns (e.g., idempotency keys, optimistic concurrency).
- Duplicate submissions MUST be prevented.

### 14.8 Accessibility

- Components MUST be accessible (see Section 19 for full requirements).

### 14.9 Responsive Design

- Responsive behaviour MUST be implemented for all supported breakpoints.

### 14.10 Dark Mode

- Dark-mode consistency MUST be maintained with token-based theming.

### 14.11 Design Tokens

- Design tokens MUST be used via CSS custom properties.

### 14.12 Testability

- Components MUST be testable. Test utilities MUST be provided.

### 14.13 Production Mock Data

- Production execution MUST NOT depend on, expose or silently fall back to development mocks, test fixtures or fabricated business data.
- Development and test fixtures MAY remain in properly isolated test or development-only paths that cannot be activated in production.

### 14.14 Linting and Formatting

- Adherence to the repository's existing linting, formatting and import rules is mandatory.

---

## 15. Backend Engineering Standards

### 15.1 Architecture

- Clear domain/service/repository boundaries MUST be maintained.
- Typed interfaces MUST define contracts between layers.
- Schema validation MUST be applied at API boundaries.
- Secure defaults MUST be applied (fail-closed, least privilege).

### 15.2 Dependency Injection

- Where established in the codebase, dependency injection MUST be used for testability and separation of concerns.

### 15.3 Transaction Ownership

- Each service operation MUST have a clear transaction owner. Nested or overlapping transactions MUST be handled explicitly.

### 15.4 Tenant-Scoped Repositories

- Every repository accessing tenant-owned data MUST require and enforce an approved tenant context.
- Public reference data, platform-owned data and explicitly platform-scoped administrative data MAY use separately authorised repository boundaries.
- Tenant-owned and platform-owned access paths MUST NOT be ambiguous.
- Queries accessing tenant-owned data MUST include tenant context.

### 15.5 Structured Errors

- Errors MUST be structured with consistent error codes, messages and correlation IDs.
- Sensitive data MUST NOT be included in error responses.

### 15.6 Idempotency

- State-changing operations MUST support idempotency where applicable.

### 15.7 Concurrency Handling

- Optimistic concurrency or equivalent MUST be used for concurrent modifications.

### 15.8 Audit Events

- Security-sensitive and business-significant operations MUST produce audit events.

### 15.9 Background-Job Reliability

- Background jobs MUST be reliable, retryable and idempotent.
- Failed jobs MUST be visible in monitoring.

### 15.10 External-Provider Isolation

- External-provider failures MUST NOT corrupt internal state.
- Provider responses MUST be validated before processing.

### 15.11 Testability

- All services MUST be testable in isolation.

### 15.12 Backwards-Compatible API Evolution

- API changes MUST maintain backwards compatibility or use versioning.

### 15.13 Technology Conventions

Backend work MUST adhere to existing project conventions for the technologies in use. Only technologies confirmed by repository evidence SHOULD be referenced. Technology-specific standards will be documented when the backend repository is available for inspection.

---

## 16. Financial-Domain Constitution

### 16.1 Platform Billing

Platform Billing represents money that fitness businesses pay to Doers for using the SaaS platform. This domain includes:

- Doers SaaS plans and pricing;
- subscriptions paid to Doers;
- checkout sessions and payment-provider integration;
- provider events and webhooks;
- invoices issued by Doers;
- dunning and payment-retry logic;
- grace periods and access-mode transitions;
- entitlements and usage tracking;
- platform administration tools.

### 16.2 Facility Member Commerce

Facility Member Commerce represents money that a fitness business collects from its own members, students, athletes or customers. This domain includes:

- fitness-business plans and packages;
- member subscriptions and memberships;
- packages and class credits;
- facility invoices;
- member payments;
- refunds and chargebacks;
- discounts and promotions;
- taxes;
- receipts;
- reconciliation.

### 16.3 Separation Requirements

The two financial domains MUST remain completely separated in:

- terminology;
- database tables;
- domain models;
- repositories;
- services;
- API routes;
- payment-provider context;
- webhook processing;
- invoices;
- payment records;
- reports;
- permissions;
- reconciliation;
- audit trails;
- frontend state;
- customer-facing screens.

One financial domain's records MUST NOT be reused as the source of truth for the other.

Existing accepted Platform Billing architecture, migrations, documents, feature flags and phase history MUST NOT be altered by this constitution.

---

## 17. UX Constitution

Every critical workflow MUST define the following states:

| State | Requirement |
|---|---|
| **Entry state** | The initial condition when the user arrives at the workflow. |
| **Loading state** | Visual feedback while asynchronous operations are in progress. |
| **Validation** | Clear, specific error messages for invalid input. |
| **Success state** | Unambiguous confirmation that the operation completed. |
| **Partial-failure state** | Communication of which parts succeeded and which failed. |
| **Recoverable error state** | Clear guidance on how the user can retry or resolve the issue. |
| **Unrecoverable error state** | Clear communication that the operation cannot proceed, with next steps. |
| **Duplicate-submission behaviour** | Prevention of duplicate side effects; user feedback that the request is already in progress. |
| **Session-expiry behaviour** | Clear notification; preservation of unsaved work where practical; safe re-authentication. |
| **Permission-denied behaviour** | Clear explanation that the user lacks permission; no sensitive details leaked. |
| **Retry behaviour** | User-initiated or automatic retry with feedback. |
| **Cancellation behaviour** | Ability to cancel in-progress operations where safe. |
| **Refresh/resume behaviour** | Ability to resume interrupted workflows. |
| **User-visible confirmation** | Explicit confirmation for destructive or irreversible actions. |

Destructive actions (deletion, cancellation, financial changes) MUST require clear confirmation and communicate consequences.

Users MUST NOT be left uncertain whether an operation succeeded.

---

## 18. Design-System Constitution

### 18.1 Design Tokens

The design system MUST define and maintain semantic tokens for:

- **Colour** — Semantic colour tokens for backgrounds, text, borders, accents and interactive states.
- **Typography** — Font families, sizes, weights and line heights.
- **Spacing** — Consistent spacing scale.
- **Elevation** — Shadow and depth levels.
- **Borders** — Border widths, radii and colours.
- **Iconography** — Consistent icon set.

### 18.2 Responsive Breakpoints

Responsive breakpoints MUST be defined and consistently applied.

### 18.3 Focus States

All interactive elements MUST have visible focus states.

### 18.4 Motion

Motion and animation MUST respect the `prefers-reduced-motion` media query.

### 18.5 Dark Mode

Dark mode MUST be fully supported with consistent token-based theming.

### 18.6 Facility Branding

The design system MUST support facility-level branding (logos, names) without breaking the platform identity.

### 18.7 Component States

All interactive components MUST define visual states for: default, hover, focus, active, disabled, loading, error and success.

### 18.8 Visual Regression Testing

Visual regression testing SHOULD be implemented for critical UI components and layouts.

### 18.9 Brand Identity

The premium cream, charcoal and copper identity MAY be preserved, but accessibility and clarity MUST take precedence over visual subtlety.

---

## 19. Accessibility Constitution

### Target

```text
WCAG 2.2 Level AA
```

### Requirements

- **Keyboard accessibility** — All interactive functionality MUST be operable via keyboard.
- **Visible focus** — Focus indicators MUST be clearly visible.
- **Semantic structure** — HTML MUST use semantic elements (headings, landmarks, lists, tables).
- **Accessible forms** — Form fields MUST have associated labels, error messages MUST be programmatically associated with fields.
- **Error announcements** — Validation errors MUST be announced to assistive technology.
- **Accessible dialogs** — Modal dialogs MUST trap focus, provide close mechanisms and have appropriate ARIA attributes.
- **Screen-reader labels** — All non-text content MUST have text alternatives.
- **Colour contrast** — Text and interactive elements MUST meet minimum contrast ratios (4.5:1 for normal text, 3:1 for large text).
- **Touch-target sizing** — Interactive touch targets MUST be at least 24x24 CSS pixels (44x44 recommended).
- **Zoom and reflow** — Content MUST reflow correctly at 200% zoom without horizontal scrolling.
- **Reduced-motion support** — Animations MUST respect `prefers-reduced-motion`.
- **Accessible tables and charts** — Data tables MUST use proper header associations. Charts MUST provide text alternatives.
- **Automated and manual verification** — Accessibility MUST be verified through automated tools and manual testing.

No WCAG conformity is claimed until verified through testing.

---

## 20. Testing Constitution

### 20.1 Required Test Categories

| Category | Description |
|---|---|
| **Unit tests** | Test individual functions and modules in isolation. |
| **Component tests** | Test UI components with realistic rendering. |
| **API contract tests** | Verify that API responses match declared schemas. |
| **Backend integration tests** | Test service-to-database and service-to-provider flows. |
| **Database tests** | Verify constraints, migrations and data integrity. |
| **Migration tests** | Verify migration correctness, rollback and data preservation. |
| **Tenant-isolation tests** | Prove cross-tenant access is denied (negative tests). |
| **Permission tests** | Verify capability enforcement for each protected operation. |
| **End-to-end tests** | Test critical workflows from user interaction to database persistence. |
| **Accessibility tests** | Verify WCAG 2.2 AA requirements. |
| **Security tests** | Verify authentication, authorisation and injection prevention. |
| **Concurrency tests** | Verify correct behaviour under concurrent operations. |
| **Retry tests** | Verify idempotency and bounded retry behaviour. |
| **Failure-injection tests** | Verify graceful degradation under component failures. |
| **Webhook tests** | Verify idempotent and correct webhook processing. |
| **Reconciliation tests** | Verify drift detection and correction. |
| **Visual regression tests** | Detect unintended visual changes. |
| **Performance tests** | Verify performance budgets are met. |
| **Cross-browser tests** | Verify behaviour across supported browsers. |

### 20.2 Negative and Failure Paths

Tests MUST cover negative and failure paths, not merely happy paths. Every critical workflow MUST have tests for:

- authentication failure;
- authorisation denial;
- tenant-isolation violation attempt;
- validation failure;
- concurrency conflict;
- provider failure;
- timeout;
- duplicate submission.

### 20.3 Flaky Tests

Flaky tests MUST be investigated and fixed. Repeatedly rerunning a flaky test until it passes is NOT an acceptable resolution.

---

## 21. Performance Constitution

Measurable performance budgets MUST exist for:

- **Initial application load** — Time to interactive for the initial page load.
- **Route transitions** — Time to render after navigation.
- **Interaction latency** — Time from user action to visual feedback.
- **JavaScript bundle size** — Total and per-route bundle sizes.
- **Image size** — Image assets MUST be optimised.
- **API response time** — Server-side response time for API endpoints.
- **Database query time** — Query execution time for critical queries.
- **Report generation** — Time to generate standard reports.
- **Background-job throughput** — Number of jobs processed per unit time.
- **Large-tenant data volumes** — Performance under realistic data volumes for large tenants.

Core Web Vitals (LCP, INP, CLS) MUST be used as part of frontend performance evaluation.

Where exact numeric targets require production evidence or business approval, they MUST be listed as proposed decisions for Phase 0B/0C rather than inventing confirmed commitments.

---

## 22. Observability Constitution

### 22.1 Required Capabilities

- **Structured logs** — All log output MUST be structured (JSON or equivalent).
- **Correlation IDs** — Every request MUST carry a correlation ID propagated through all layers.
- **Metrics** — Key operational metrics MUST be collected (request rate, error rate, latency, queue depth).
- **Traces** — Distributed tracing SHOULD be implemented for cross-service operations.
- **Frontend exception reporting** — Uncaught frontend errors MUST be reported to a monitoring service.
- **Backend exception reporting** — Uncaught backend errors MUST be reported.
- **Release identification** — Every deployment MUST be identifiable by a unique release version or commit hash.
- **Queue monitoring** — Background-job queues MUST be monitored for depth, latency and failure rate.
- **Webhook monitoring** — Webhook delivery and processing MUST be monitored.
- **Database monitoring** — Query performance, connection pool usage and slow queries MUST be monitored.
- **Audit events** — Security and business-significant events MUST be recorded.
- **Business reconciliation metrics** — Financial reconciliation status MUST be observable.
- **Alerts** — Critical conditions MUST trigger alerts.
- **Runbooks** — Operational runbooks MUST exist for known failure scenarios.
- **Sensitive-data redaction** — Observability output MUST NOT contain plaintext credentials, tokens or unnecessary personal data.

### 22.2 Diagnostic Questions

Observability MUST help answer:

1. What failed?
2. When did it fail?
3. Which operation was affected?
4. Which tenant was affected (without leaking sensitive data)?
5. Was data integrity affected?
6. How do we recover?

---

## 23. Privacy and Data-Governance Constitution

- **Data classification** — Data MUST be classified by sensitivity level.
- **Data minimisation** — Only data necessary for the stated purpose MUST be collected.
- **Purpose limitation** — Data MUST only be used for the purpose for which it was collected.
- **Consent** — Where required, user consent MUST be obtained before processing personal data.
- **Retention** — Data retention periods MUST be defined and enforced.
- **Deletion** — Data deletion requests MUST be fulfilled within defined timeframes.
- **Export** — Users MUST be able to export their data in a portable format.
- **Account closure** — Account closure MUST result in appropriate data deletion or anonymisation.
- **Audit retention** — Audit events MUST be retained for a period defined by the owner.
- **Sensitive-field access** — Access to sensitive fields MUST be restricted and logged.
- **Log redaction** — Logs MUST NOT contain unnecessary personal or sensitive data.
- **File-storage security** — Uploaded files MUST be stored securely with appropriate access controls.
- **Administrative access** — Administrative access to personal data MUST be restricted, logged and audited.
- **Incident handling** — Data-breach incidents MUST follow a documented response process.

No unsupported legal-compliance claims (e.g., "GDPR compliant") are made by this constitution. Jurisdiction-specific legal review is recorded as a separate owner-approval decision.

---

## 24. CI/CD Constitution

### 24.1 Required Checks

Every applicable change MUST pass:

- formatting;
- lint;
- static type checking;
- unit tests;
- integration tests;
- production build;
- dependency scanning;
- secret scanning;
- static security analysis;
- migration validation;
- generated-file checks;
- bundle-size checks where relevant.

### 24.2 Branch and Review Policy

- Protected branches MUST be configured.
- Pull requests MUST be reviewed before merge.
- Artefacts MUST be immutable once published.
- Environments (development, staging, production) MUST be separated.
- Secrets MUST be controlled and not exposed to untrusted environments.
- Deployment health checks MUST verify service availability after deployment.
- Rollback capability MUST exist for every deployment.
- A release audit trail MUST be maintained.
- Feature-flag governance MUST ensure undocumented or unmonitored flags do not reach production.

---

## 25. Backup and Disaster-Recovery Constitution

- **Documented backups** — Backup procedures MUST be documented.
- **Encryption** — Backups MUST be encrypted at rest.
- **Retention** — Backup retention periods MUST be defined.
- **Restore testing** — Backup restoration MUST be tested regularly.
- **Recovery objectives** — RPO and RTO MUST be defined by the business owner.
- **Incident ownership** — Incident ownership MUST be assigned.
- **Escalation paths** — Escalation paths MUST be documented.
- **Disaster-recovery runbooks** — DR runbooks MUST exist and be tested.
- **Periodic exercises** — DR exercises MUST be conducted at defined intervals.

```text
A backup is not considered proven until restoration has been successfully tested.
```

Exact RPO, RTO and availability targets MUST be listed as business-owner decisions when not already approved.

---

## 26. Release Gates

### 26.1 Mandatory Gates

No change MAY be deployed to production unless ALL of the following are satisfied:

1. No unresolved critical security defect.
2. No unresolved critical tenant-isolation defect.
3. No unresolved critical financial-integrity defect.
4. No failing required tests.
5. No lint failure.
6. No type-check failure.
7. No production-build failure.
8. No unexplained migration risk.
9. No production mock data.
10. No undocumented feature flag.
11. No unreviewed high-risk dependency issue.
12. Rollback plan exists.
13. Observability is sufficient for the released capability.
14. Documentation is updated.
15. Evidence is retained.

### 26.2 Accepted-Risk Process

Lower-severity risks MAY be accepted through the following process:

- Explicit owner assigned;
- Written rationale documented;
- Mitigation plan defined;
- Expiry date set;
- Tracking reference created;
- Review date scheduled.

Critical risks MUST NOT be accepted merely to meet a deadline.

---

## 27. Severity Model

| Severity | Business Impact | Security Impact | Data-Integrity Impact | Release Consequence | Expected Response |
|---|---|---|---|---|---|
| **Critical** | Core business operations halted; financial loss; legal exposure. | Authentication bypass; tenant-isolation breach; credential exposure. | Data loss or corruption; financial records incorrect. | Release blocked. Immediate fix required. | Immediate investigation. Fix before any release. |
| **High** | Significant feature degradation; multiple users affected. | Privilege escalation; unauthorised data access within tenant. | Data inconsistency requiring manual correction. | Release blocked unless accepted risk is documented. | Investigation without delay. Fix in current or next release. |
| **Medium** | Partial feature degradation; workaround available. | Information disclosure of non-sensitive data; minor policy violation. | Minor data inconsistency auto-corrected by reconciliation. | Release permitted with documented tracking. | Scheduled for upcoming release cycle. |
| **Low** | Cosmetic issue; minor inconvenience. | No direct security impact. | No data-integrity impact. | Release permitted. | Backlog prioritisation. |
| **Informational** | No user impact; improvement suggestion. | No security impact. | No data-integrity impact. | No release impact. | Considered during planning. |

Remediation timelines are governance decisions requiring owner approval. No numerical deadlines are imposed by this constitution without owner authorisation. The severity model defines release consequences, not remediation deadlines.

---

## 28. Evidence Requirements

Assertions such as "secure," "production-ready," "tenant-safe" or "fully tested" MUST be supported by evidence.

Acceptable evidence includes:

- command outputs (e.g., test results, lint output, build logs);
- test results with pass/fail counts;
- diffs showing changes;
- screenshots demonstrating behaviour;
- API request/response examples;
- migration verification output;
- threat models;
- architecture diagrams;
- benchmark results;
- security scan outputs;
- restore-test results;
- incident-exercise records.

Unsupported assertions are NOT acceptable in release documentation.

---

## 29. Phase-Development Workflow

The permanent Doers development workflow is:

```text
Requirement and evidence
        ↓
Detailed plan
        ↓
Hard approval stop
        ↓
Implementation
        ↓
Tests and evidence
        ↓
Independent review
        ↓
Corrections and retesting
        ↓
Hard stop before commit
        ↓
Explicit commit approval
        ↓
Hard stop before push
        ↓
Explicit push approval
        ↓
Clean accepted checkpoint
```

### Workflow Clarifications

- Planning approval does NOT authorise implementation.
- Implementation approval does NOT authorise commit.
- Commit approval does NOT authorise push.
- Completion of one phase does NOT authorise the next phase.
- Each phase transition requires explicit, documented owner approval.

---

## 30. Exception Process

Deviations from this constitution MUST follow a controlled process. Silent exceptions are forbidden.

Every exception MUST include:

| Field | Description |
|---|---|
| **Affected requirement** | The specific constitution section being deviated from. |
| **Reason** | Why the deviation is necessary. |
| **Risk** | What risks the deviation introduces. |
| **Scope** | Which features, components or timeframes are affected. |
| **Compensating controls** | What alternative measures mitigate the risk. |
| **Owner** | The person responsible for the exception. |
| **Approval** | Explicit approval from the constitution owner. |
| **Expiry** | The date or condition when the exception expires. |
| **Remediation plan** | How full compliance will be restored. |

An exception temporarily permits a deviation. It does NOT permanently change the constitution.

---

## 31. Constitution Amendment Process

Amendments permanently change the constitution. An amendment MUST NOT be confused with an exception. An exception must not silently rewrite a constitutional rule.

Every amendment MUST include:

| Field | Description |
|---|---|
| **Document version** | The version number of the amendment. |
| **Proposed change** | The exact text being added, modified or removed. |
| **Affected sections** | Which sections are impacted. |
| **Reason** | Why the amendment is necessary. |
| **Security/reliability/product impact** | Whether the amendment strengthens, weakens or is neutral to existing requirements. |
| **Compatibility impact** | Whether the amendment requires changes to existing implementations, migrations or operational procedures. |
| **Review evidence** | Supporting analysis, stakeholder input and risk assessment. |
| **Approver** | The constitution owner or delegated authority. |
| **Effective date** | When the amendment takes effect. |
| **Changelog** | A summary of what changed. |
| **Retention of prior version** | The previous version MUST be retained for audit purposes. |

---

## 32. Decisions Requiring Owner Approval

The following decisions CANNOT be invented by the implementation agent and require explicit owner approval:

| Decision | Planning Candidate | Rationale | Consequences | Status |
|---|---|---|---|---|
| **Availability target** | Candidate for cost and architecture analysis | Availability targets determine infrastructure investment and SLA commitments | Infrastructure cost, redundancy requirements, operational complexity | Pending owner approval |
| **RPO (Recovery Point Objective)** | Candidate for cost and architecture analysis | RPO determines backup frequency and data-loss tolerance | Backup infrastructure cost, data-loss exposure | Pending owner approval |
| **RTO (Recovery Time Objective)** | Candidate for cost and architecture analysis | RTO determines acceptable downtime window | DR infrastructure cost, process investment | Pending owner approval |
| **Data-retention periods** | Pending legal and accounting review | Retention must be determined by record category, tax and accounting requirements, privacy requirements, contractual obligations, jurisdiction, and deletion or anonymisation capability | Storage costs, compliance posture, deletion complexity | Pending legal/accounting review |
| **Supported browsers** | Candidate for market analysis | Determines testing scope and polyfill requirements | Testing burden, feature availability, polyfill cost | Pending owner approval |
| **Responsive web and mobile support** | Candidate for market analysis | Responsive web browser support and mobile web support are distinct from future native application support | Testing scope, responsive design requirements | Pending owner approval |
| **Native mobile application support** | Out of scope unless explicitly approved | Native iOS/Android version requirements cannot be defined without an approved native mobile application scope | Native development investment, testing matrix | Pending owner approval |
| **Geographic hosting requirements** | Pending owner decision | Data sovereignty and latency considerations | Cloud provider and region selection | Pending owner approval |
| **Legal jurisdictions** | Pending owner decision | Determines legal compliance requirements | Compliance obligations, data residency | Pending owner approval |
| **Penetration-testing cadence** | Risk-based, pending approval | Testing should be triggered by material changes and periodic independent review | Security assurance level, cost | Pending owner approval |
| **Vulnerability-remediation timelines** | Pending owner approval | Remediation windows must balance risk exposure with operational capacity | Operational response requirements, risk exposure | Pending owner approval |
| **Production support hours** | Candidate for team-capacity analysis | Determines incident response SLAs | Staffing requirements, on-call burden | Pending owner approval |
| **Maintenance-window policy** | Candidate for operational analysis | Minimises user disruption | Deployment scheduling, operational complexity | Pending owner approval |
| **Accessibility certification expectations** | Candidate for cost analysis | Internal verification against WCAG 2.2 AA is a practical starting point; external certification requires separate approval | Testing investment, legal risk | Pending owner approval |

No candidate above is binding until explicitly approved by the owner. Planning candidates are not commitments.

---

## 33. Constitution Completeness Checklist

This checklist confirms that the approved constitution covers all required governance domains.

Checked boxes indicate that a topic is addressed within the document. They do NOT indicate:

- owner approval;
- security compliance;
- implementation compliance;
- release readiness;
- cross-repository validation.

- [x] Universal fitness-business scope (Section 3)
- [x] Security (Section 6)
- [x] Authentication (Section 7)
- [x] Authorisation (Section 8)
- [x] Tenant isolation (Section 9)
- [x] Reliability (Section 10)
- [x] Data integrity (Section 11)
- [x] Frontend standards (Section 14)
- [x] Backend standards (Section 15)
- [x] Database standards (Section 12)
- [x] API standards (Section 13)
- [x] Platform billing separation (Section 16.1)
- [x] Facility member commerce (Section 16.2)
- [x] UX (Section 17)
- [x] Accessibility (Section 19)
- [x] Testing (Section 20)
- [x] Performance (Section 21)
- [x] Observability (Section 22)
- [x] Privacy (Section 23)
- [x] CI/CD (Section 24)
- [x] Backups (Section 25)
- [x] Disaster recovery (Section 25)
- [x] Release gates (Section 26)
- [x] Evidence (Section 28)
- [x] Exceptions (Section 30)
- [x] Amendment process (Section 31)
- [x] Approval workflow (Section 29)

---

*End of Doers Enterprise Quality Constitution.*
