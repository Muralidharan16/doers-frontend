# Doers Product and UI/UX Constitution — Multi-Facility Fitness and Class Management

---

## DOCUMENT METADATA

| Field | Value |
|---|---|
| **Document title** | Doers Product and UI/UX Constitution — Multi-Facility Fitness and Class Management |
| **Program** | Doers Frontend UI Improvement Program |
| **Phase** | 0A — Product and UI/UX Constitution |
| **Version** | 1.0 |
| **Status** | Approved — Phase 0A Accepted by Product Owner |
| **Date** | 2026-07-15 |
| **Repository** | doers-frontend |
| **Branch inspected** | `main` |
| **Commit inspected** | `ade4cbe9b9b1adf051c42d560f5667b353b2bf7c` |
| **Scope** | Frontend product positioning, information architecture, terminology, design system, accessibility, responsive behaviour, interaction standards, trustworthy data presentation, security-facing UX, testing and release gates, future frontend phases |
| **Explicit non-scope** | Implementation, backend changes, API contracts, database design, migrations, payment-provider integration, feature flags, environment values, commit, push, pull request, dependency changes, branch operations, Phase 0B or later work |
| **Implementation authorisation** | None — implementation requires separate phase authorisation. This document does not authorise code, configuration, dependency, API, database, migration, feature-flag, commit or push activity. |
| **Approval requirement** | Phase 0A constitution approved by Product Owner. Implementation phases require separate explicit authorisation. |
| **Related documents** | `docs/enterprise/DOERS_ENTERPRISE_QUALITY_CONSTITUTION.md` (v0.2-draft, a related cross-repository-validated draft — not yet approved and not currently binding; see Section 2.4 for relationship) |
| **Cross-repository validation status** | Pending — backend repository not inspected in this phase. |
| **Supersedes** | No prior product/UI constitution. |
| **Owner** | Product and platform owner |

### Revision History

| Version | Date | Phase | Summary | Approval Status |
|---|---|---|---|---|
| 0.1-draft | 2026-07-15 | 0A | Initial product/UI/UX constitution | Draft — not approved |
| 0.2-draft | 2026-07-15 | 0A-R1 | Owner-review corrections: domain model split, truthful UI, contrast recalculation, font evidence, UTC-date, environment governance, accessibility, roadmap, evidence-register severity and accuracy, governance language, visual-system token architecture | Draft — not approved |
| 0.3-draft | 2026-07-15 | 0A-R2 | Accuracy corrections: F-40 age 18→3, F-38 element correction, F-34 evidence expanded, F-30 restored to partially confirmed, evidence deduplication (F-42→F-13, F-43→F-27, F-44 narrowed), contrast wording, WCAG 2.22→2.2, token examples, environment ignore rules, dialogs in Phase 1 not Phase 0B, scaffold gating | Draft — not approved |
| 1.0 | 2026-07-15 | 0A-F1/F2 | Phase 0A constitution approved by Product Owner; product direction and proposed decisions D-01 through D-08 accepted; open questions Q-01 through Q-07 remain unresolved; backend decisions B-01 through B-04 remain pending; cross-repository verification items X-01 through X-05 remain pending; performance budgets (Section 24.2) remain proposed targets pending separate approval; no implementation phase is authorised. F2 pre-commit consistency: governance independence from Enterprise draft, evidence-register structural and duplicate repairs, demo-labelling replaced with truthful-outcome language. | Approved — Phase 0A Accepted by Product Owner |

---

## NORMATIVE LANGUAGE

This document uses the following normative terms defined by RFC 2119 and extended with programme-specific conventions:

- **MUST** — A mandatory requirement. Non-compliance is a defect.
- **MUST NOT** — A prohibition. Violation is a defect.
- **SHOULD** — Expected unless an approved exception exists and is documented.
- **SHOULD NOT** — Normally prohibited unless an approved exception exists.
- **MAY** — Optional behaviour.
- **PENDING DECISION** — Unresolved and not authorised for implementation. Requires owner approval before any work begins.
- **CURRENT-STATE EVIDENCE** — An observed repository fact. It is not implicitly a desired or approved architecture. It may be flagged for correction or migration.

---

## 1. EXECUTIVE DECISION

### 1.1 What Doers Is

Doers is a premium operating system for fitness, wellness, sports and instructor-led class businesses. It provides a capability-driven SaaS platform for organisations to manage their operations, people, programmes, payments and facilities through a classical, refined interface designed for daily professional use.

### 1.2 What Doers Is Not

Doers is explicitly NOT:
- gym-only software;
- a gym membership dashboard;
- a bodybuilding product;
- a generic CRM;
- a generic admin panel;
- only a payment system.

### 1.3 Core Product Principles

1. **Multi-facility by design.** The platform MUST serve gyms, yoga studios, Pilates studios, dance schools, boxing academies, martial-arts schools, CrossFit and functional-fitness facilities, calisthenics centres, swimming schools, personal-training businesses, sports academies, multi-sport facilities, hybrid facilities and other fitness, wellness, sports or instructor-led activity/class businesses — without creating separate product forks.

2. **Capability-driven, not niche-driven.** Facility type selects sensible defaults, terminology preferences and workflow visibility. It does NOT permanently restrict available capabilities. A boxing academy that also runs general fitness classes MUST NOT require two organisations or separate products.

3. **Visual quality and operational clarity are equally important.** Premium quality MUST come from proportion, spacing, typography, hierarchy, optical balance, precise alignment, subtle borders, calm interaction, truthful information and predictable behaviour. It MUST NOT come from excessive decoration, animation or "luxury" styling that compromises readability.

4. **User trust is more important than decorative sophistication.** Every data point presented to a user MUST be truthful, traceable and scoped to the correct organisation and location. Fabricated, random, unverified or misleading information is prohibited in production interfaces.

5. **Hybrid organisations are first-class.** An organisation operating multiple facility types under one business roof is a supported use case. The platform MUST accommodate multi-activity organisations without requiring product segmentation.

---

## 2. PURPOSE, SCOPE AND NON-GOALS

### 2.1 Purpose

This constitution defines the binding product, user-interface and user-experience standards for the Doers frontend application. It governs all separately authorised frontend work from Phase 0B onward. It provides a shared reference for product owners, designers, frontend engineers, backend engineers, QA reviewers and security reviewers.

### 2.2 In Scope

- Frontend product positioning and brand identity
- Information architecture and navigation
- Domain terminology and vocabulary adaptation
- Design-system governance and token architecture
- Accessibility requirements
- Responsive behaviour
- Interaction standards and state management
- Truthful data presentation and data provenance
- Security-facing UX requirements
- Platform Billing and Facility Member Commerce separation
- Testing strategy
- Quality and release gates
- Phased roadmap from current state to target state

### 2.3 Out of Scope for Phase 0A

- Any implementation (code, configuration, dependency, feature-flag or build changes)
- Database design, API implementation or migrations
- Payment-provider integration
- Backend authorisation changes
- Live payment movement
- Final backend schemas
- Committing, staging or pushing
- Dependency installation, upgrade or removal

### 2.4 Relationship to Enterprise Quality Constitution

The [Doers Enterprise Quality Constitution](../enterprise/DOERS_ENTERPRISE_QUALITY_CONSTITUTION.md) (v0.2-draft) is a related cross-repository-validated draft. It identifies itself as a draft awaiting owner approval and not effective until approved. It is not a currently binding authority.

This Product Constitution (Version 1.0) is independently approved and governs separately authorised frontend work. The Enterprise draft may inform review but cannot override this approved constitution. Any future conflict after Enterprise Constitution approval requires explicit owner adjudication or an approved amendment to this Product Constitution.

---

## 3. PRODUCT AUDIENCES AND FACILITY PROFILES

### 3.1 Supported Facility Profiles

The following profiles MUST be supported by the frontend product without separate forks:

1. Gym / fitness club
2. Yoga studio
3. Pilates studio (including reformer)
4. Dance school / dance academy
5. Boxing academy / combat-sports centre
6. Martial-arts school
7. CrossFit / functional-fitness facility
8. Calisthenics centre
9. Swimming school / swimming facility
10. Personal-training business
11. Sports academy
12. Multi-sport facility
13. Hybrid facility (multiple activity types)
14. Other fitness, wellness, sports or instructor-led activity/class business

### 3.2 CURRENT-STATE EVIDENCE — Facility Profile Support

**Evidence:** `src/features/auth/types/index.ts:31-52`

The current frontend defines 9 facility types: `gym`, `yoga_studio`, `crossfit_box`, `swimming_pool`, `martial_arts`, `dance_studio`, `sports_academy`, `multi_sport`, `others`. Missing explicit types include `pilates_studio`, `boxing_academy`, `calisthenics_centre`, `personal_training`.

**Assessment:** The facility-type enum is a reasonable starting point. `others` captures unlisted types. The enum SHOULD be reviewed and potentially expanded to cover the full list in a later phase. The signup page uses the facility type to select a label but does not restrict subsequent capabilities.

### 3.3 Profile Behaviour

- Selecting a facility type during signup or organisation setup MUST select sensible defaults for terminology, recommended capability sets and navigation visibility.
- Facility type MUST NOT permanently restrict available capabilities.
- Changing the facility type after initial setup MAY require administrative confirmation but MUST NOT be prevented.
- A hybrid organisation MUST be able to reflect its multi-activity nature through terminology mix or a neutral profile selection.

### 3.4 Audience Personas

| Persona | Description | Key needs |
|---|---|---|
| **Owner / Operator** | Business owner or senior manager | Overview, financial reports, staff management, organisation settings |
| **Front-desk / Admin staff** | Day-to-day operations staff | Check-in, member management, payments, schedule management |
| **Instructor / Coach / Trainer** | Staff who deliver sessions | Schedule, attendance, participant lists |
| **Member / Student / Client / Athlete** | End-customer of the facility | Bookings, payments, progress, renewals (member-facing experience) |

Member-facing experiences MUST have separate permission boundaries from staff-facing experiences.

**CURRENT-STATE EVIDENCE:** The current frontend is primarily operator/admin-facing. Member-facing experiences (self-service portal, member bookings, member payments) are a pending product-scope decision and are not currently implemented.

---

## 4. CAPABILITY-DRIVEN PRODUCT MODEL

### 4.1 Capability Groups

The product is defined by capability groups, not fixed feature sets. Each organisation activates the capabilities relevant to its operations. Any organisation may enable any supported capability regardless of its facility profile.

| Capability Group | Description | Common examples — non-exhaustive and non-restrictive |
|---|---|---|
| **Open-access facility use** | General gym floor access, check-in tracking | Gym, CrossFit, calisthenics |
| **Scheduled group classes** | Timetabled classes with instructor, room and capacity | Yoga, Pilates, dance, martial arts, swimming |
| **Recurring batches or courses** | Multi-week programmes with progression | Dance, martial arts, swimming, sports academy |
| **Appointments and private sessions** | One-on-one or small-group private bookings | Personal training, sports academy |
| **Rooms, courts, lanes and resources** | Bookable spaces and equipment | Swimming, multi-sport |
| **Participant capacity** | Per-class, per-session and per-resource capacity limits | All class-based profiles |
| **Bookings** | Member-initiated or staff-initiated class/appointment reservations | All profiles |
| **Waitlists** | Automatic queuing when capacity is exceeded | Class-based profiles |
| **Memberships and enrollments** | Recurring or fixed-term member plans | All profiles |
| **Class packs and credits** | Prepaid credit bundles or punch cards | Yoga, Pilates, dance |
| **Passes** | Time-limited access passes (day, week, month) | Gym, swimming |
| **Drop-ins** | Single-session purchases | Yoga, dance, martial arts |
| **Attendance and check-in** | Member arrival tracking | All profiles |
| **Guardians and minors** | Parent/guardian management for underage participants | Swimming, dance, martial arts |
| **Staff and instructor scheduling** | Staff roster, availability and assignment | All profiles |
| **Payments and invoices** | Billing, collections and receipts | All profiles |
| **Multiple locations** | Multi-branch operations | All profiles |

### 4.2 CURRENT-STATE EVIDENCE — Implemented Capabilities

Based on repository inspection (`src/features/`, `src/pages/`):

| Capability | Status | Evidence |
|---|---|---|
| Organisation profile management | Real, API-connected | `features/organization/`, `pages/onboarding/page.tsx` |
| Authentication (login, signup, verify) | Real, API-connected | `features/auth/`, `pages/auth/` |
| Member management (CRUD) | Real, API-connected | `features/members/`, `pages/members/page.tsx` |
| Subscription/admission management | Real, API-connected | `features/subscriptions/`, `pages/subscriptions/page.tsx` |
| Membership plan management | Real, API-connected | `features/gym/services/membershipPlansApi.ts` |
| Branch/location management | Real, API-connected | `features/gym/`, `components/settings/BranchManagementSection.tsx` |
| Operating hours configuration | Real, API-connected | `components/settings/BranchOperatingHoursSection.tsx` |
| Branding (logo, cover) | Real, API-connected | `components/settings/` |
| Dashboard | Partially real, partially hardcoded | `pages/dashboard/page.tsx` |
| Platform Billing | Real, API-connected | `features/platformBilling/` |
| Trial lock management | Real, API-connected | `features/trial/` |
| Attendance | Mock data, no API | `pages/attendance/page.tsx` |
| Payments (facility) | Mock data, no API | `pages/billing/page.tsx` |
| Reports | Demo data, no API | `pages/reports/page.tsx` |
| Gyms/Facilities (admin view) | Mock data, no API | `pages/gyms/page.tsx` |
| Staff | Empty | `pages/staff/page.tsx`, `features/staff/` |
| Booking, waitlist, class schedule, programme | Absent | No files or types exist |
| Guardian/minor management | Absent | No files or types exist |

### 4.3 Capability Activation

- Capability activation MUST be explicit and predictable.
- Activating a capability MUST NOT silently alter data, enable billing or expose member data without clear confirmation.
- The capability state MUST be clearly visible to administrators.
- Unavailable capabilities MUST be clearly distinguished from capabilities the user lacks permission to access.

---

## 5. CANONICAL DOMAIN CONCEPTS

### 5.1 Concept Definitions

| Canonical Concept | Definition | User-facing label configurability |
|---|---|---|
| **Organisation** | The independently governed business workspace. The top-level tenant boundary. | Fixed — "Organization" in system UI, configurable display name |
| **Location** | A physical, virtual or operating unit through which an Organisation provides services. | Configurable — "Location", "Branch", "Facility", "Studio", "Gym", "Academy", "Centre" based on facility profile |
| **Program / Service** | A named reusable activity or offering definition: a class type, programme, service category, activity or discipline. A program is not a commercial plan. | Configurable — "Program", "Class Type", "Service", "Activity", "Discipline" |
| **Batch / Cohort** | A recurring enrolled group or course run spanning multiple occurrences with progression. A batch is not a single session. | Configurable — "Batch", "Cohort", "Course", "Term", "Level" |
| **Session / Class / Lesson / Appointment** | One scheduled occurrence of a program or service at a specific time, location and resource with an instructor and capacity. | Configurable — "Class", "Session", "Workout", "Lesson", "Training", "Appointment" |
| **Space / Resource** | A bookable room, court, lane, pool, equipment or other capacity-bearing resource. | Configurable — "Room", "Court", "Lane", "Studio", "Pool", "Equipment" |
| **Commercial Product** | A plan, package, pass, credit bundle or membership product sold by the facility. A commercial product may grant access to a program, session or resource without becoming that operational offering. | Configurable — "Plan", "Package", "Pass", "Membership", "Credit Bundle" |
| **Membership / Enrollment / Entitlement** | The participant relationship that grants or records access to a commercial product, program or facility. | Configurable — "Membership", "Enrollment", "Subscription", "Admission" |
| **Booking** | A reservation for an occurrence, appointment, resource or space. A booking is an operational reservation, not a commercial product or membership. | Fixed — "Booking" (or "Reservation") |
| **Waitlist** | An ordered queue for a fully-booked session, resource or service. | Fixed — "Waitlist" |
| **Person / Participant** | An end-customer: member, student, client, athlete. | Configurable — "Member", "Student", "Client", "Athlete", "Participant" |
| **Team Member** | A staff person working for or on behalf of the organisation. | Configurable — "Staff", "Team", "Instructor", "Trainer", "Coach", "Teacher" |
| **Guardian / Household Relationship** | A parent, guardian or household relationship managing access for minors or dependents. **TARGET SCOPE — BACKEND DEPENDENCY.** No current implementation exists; do not invent one. | Configurable — "Guardian", "Parent", "Household" |
| **Attendance / Check-in** | The record of a participant's presence at a session or facility. | Configurable — "Attendance", "Check-in" |
| **Invoice** | A bill issued to a participant for payments due. | Fixed — "Invoice" |
| **Payment** | A monetary transaction from a participant to the organisation. | Fixed — "Payment" |

### 5.2 Concept Classification

| Concept | Classification | Rationale |
|---|---|---|
| Organisation, Location, Booking, Waitlist, Invoice, Payment | Internal canonical concepts | Universal across profiles |
| Person / Participant, Team Member, Session / Class / Lesson / Appointment, Batch / Cohort | Configurable user-facing labels | Terminology varies significantly by facility type |
| Program / Service, Commercial Product, Membership / Enrollment / Entitlement, Attendance / Check-in | Configurable user-facing labels | Terminology varies moderately by facility type |
| Space / Resource | Configurable user-facing labels | Varies by available resource types |
| Guardian / Household Relationship | Configurable user-facing labels | Target scope; backend dependency |
| `gym`, `branch` (current backend terms) | Existing backend compatibility concepts | Requires staged migration with adapter; must not be renamed casually |

---

## 6. CONTROLLED VOCABULARY ADAPTATION

### 6.1 Mapping Table

| Canonical Concept | Gym | Yoga Studio | Dance School | Boxing / Martial Arts | Personal Training | Swimming | Generic Default |
|---|---|---|---|---|---|---|---|
| Person / Participant | Member | Student | Student | Athlete / Student | Client | Student / Swimmer | Member |
| Team Member | Trainer | Instructor | Teacher / Instructor | Coach | Trainer | Instructor / Coach | Team Member |
| Location | Gym / Branch | Studio | Studio | Academy / Gym | Studio | Pool / Facility | Location |
| Class / Session / Batch | Workout / Class | Class | Class / Lesson | Training Session / Class | Session / Appointment | Lesson / Class | Session |
| Programme / Service | Programme | Class Type | Style / Level | Discipline | Service | Programme / Level | Programme |
| Plan / Package / Pass | Membership | Pass / Package | Pass / Package | Membership / Package | Package | Pass / Package | Plan |
| Membership / Enrollment | Membership | Enrollment | Enrollment | Membership | Package Enrollment | Enrollment | Enrollment |
| Attendance / Check-in | Check-in | Attendance | Attendance | Attendance | Session Complete | Attendance | Attendance |

### 6.2 Vocabulary Governance

1. Vocabulary adaptation MUST be centralised in a single, typed vocabulary module. Arbitrary one-off strings scattered through components are prohibited.
2. The vocabulary module MUST accept an organisation's facility profile and return the appropriate terminology set.
3. Hybrid organisations MUST be able to select a neutral terminology set or a blended set with administrator approval.
4. Terminology changes MUST propagate consistently across all user-facing surfaces: navigation, page headers, form labels, empty states, error messages and notifications.
5. Backend names such as `/gyms`, `Gym` types and `branch` entities MUST NOT be renamed casually. They require compatibility adapters or staged migration coordinated with the backend team.
6. Internal code MAY continue to use backend-compatible names (e.g., `Gym` type, `branch` store) until migration is complete. User-facing strings MUST use the configured terminology.

### 6.3 CURRENT-STATE EVIDENCE — Terminology Debt

- **`gym` is the dominant user-facing term** for locations across the entire interface: sidebar label "Gyms" (`src/components/layout/Sidebar.tsx:18`), route `/gyms`, page title "Gyms & Facilities", form labels "Add Gym", "Delete Gym", and placeholder text "Register your first gym". The internal type hierarchy also uses `Gym` and `features/gym/` as the module name.
- **`studio` appears as branding/marketing language** alongside `gym`: sidebar tagline "Studio OS" (`src/components/layout/Sidebar.tsx:106`), login header "Sign in to manage your studio operations" (`src/pages/auth/login/page.tsx:71`), signup header "Open Your Studio" (`src/pages/auth/signup/page.tsx:112`). Inconsistency between "gym" and "studio" terminology across the application. No `Studio` type exists.
- **`branch` is used for location management** in the settings UI ("Locations & Branches" tab, BranchManagementSection, BranchOperatingHoursSection) and in the Zustand store (`features/gym/store/branchStore.ts`). API endpoints use both `/gyms` and `/branches`. The duality of `gym` and `branch` terms creates internal confusion.
- **`admission` is the workflow term** for enrolling a member into a subscription. Consistent within the subscriptions feature. No standard term exists for enrollment of non-member participant types.
- **No profile-specific vocabulary adaptation exists.** All copy is hardcoded as strings in components.

---

## 7. TARGET INFORMATION ARCHITECTURE

### 7.1 Target Navigation Model

The target navigation is organised into logical groups:

**Primary Navigation Group (Core Operations):**

| Navigation Item | Icon | Route | Description |
|---|---|---|---|
| Home | LayoutDashboard | `/dashboard` | Organisation overview with truthful metrics |
| Schedule | Calendar | `/schedule` | Class timetable, bookings, sessions |
| People | Users | `/people` | Members, students, clients, guardians |

**Operations Group:**

| Navigation Item | Icon | Route | Description |
|---|---|---|---|
| Programmes & Services | Dumbbell | `/programs` | Class types, programmes, services, resources |
| Memberships & Enrollments | CreditCard | `/enrollments` | Plans, packages, enrollments, admissions |
| Attendance | ClipboardCheck | `/attendance` | Check-in, attendance records |
| Payments | Receipt | `/payments` | Invoices, payments, collections |

**Management Group:**

| Navigation Item | Icon | Route | Description |
|---|---|---|---|
| Team | UsersRound | `/team` | Staff, instructors, coaches, trainers |
| Reports | BarChart3 | `/reports` | Operational reports with authoritative data |
| Locations | MapPin | `/locations` | Branches, studios, facilities |

**System Group:**

| Navigation Item | Icon | Route | Description |
|---|---|---|---|
| Settings | Settings | `/settings` | Organisation, branding, configuration |
| Plan & Billing | Building2 | `/settings/plan-billing` | Doers platform subscription (separated visually) |

### 7.2 CURRENT-STATE EVIDENCE — Navigation Debt

The current sidebar (`src/components/layout/Sidebar.tsx`) uses:
- "Dashboard" → `/dashboard`
- "Members" → `/members`
- `PLATFORM_BILLING_FRONTEND_SHELL ? 'Member Subscriptions' : 'Subscriptions'` → `/subscriptions`
- "Billing" → `/billing`
- "Reports" → `/reports`
- "Attendance" → `/attendance`
- "Gyms" → `/gyms`
- "Settings" → `/settings`

Missing routes: Schedule, Programmes, Team (empty file exists but no route), dedicated Locations route separate from Settings.

### 7.3 Navigation Behaviour

- The sidebar MUST collapse to icon-only mode on tablet and provide a mobile drawer.
- The sidebar label MUST use the configured vocabulary (e.g., "Members" or "Students" or "Athletes" or "Clients").
- Active navigation state MUST be clearly indicated with visual distinction.
- On narrow viewports, the most critical navigation items MUST remain accessible. Non-critical items MAY move to an overflow menu.

### 7.4 Global versus Location-Scoped Actions

| Domain | Scope |
|---|---|
| Organisation settings, branding, Platform Billing | Global (organisation) |
| Dashboard (aggregate view) | Organisation or all-locations |
| Dashboard (location-filtered view) | Single location |
| People, Enrollments, Payments | Location-scoped with all-locations toggle |
| Attendance, Schedule | Location-scoped |
| Team, Programmes, Reports | Organisation or location-scoped |
| Location management | Organisation-scoped |

### 7.5 Location Context Selector

- A visible location/branch selector MUST be present in the application header.
- The selector MUST clearly indicate the currently selected location.
- An "All Locations" option MUST be available where the data domain supports it.
- Switching locations MUST invalidate location-scoped data caches.
- Location context MUST be persisted in a state store separate from authentication.

---

## 8. PLATFORM BILLING VERSUS FACILITY MEMBER COMMERCE

### 8.1 Mandatory Separation

This section defines a protected boundary that MUST NOT be violated by any frontend work.

### 8.2 Doers Platform Billing

**Definition:** Money an organisation pays to Doers for using the SaaS platform.

**Protected frontend locations:**
- Feature module: `src/features/platformBilling/`
- Route: `/settings/plan-billing`
- Components: `PlatformBillingStatusBanner`, `PlanBillingPage`, `BillingRecoveryPage`
- Feature flag: `PLATFORM_BILLING_FRONTEND_SHELL`

**Protected characteristics:**
- Platform Billing actions are backend-authoritative.
- The frontend MAY hide actions for usability but cannot provide authorisation.
- Billing lock/recovery UX MUST avoid redirect loops, repeated modals, surprise lockouts and lost work.
- Trial lock states (SOFT_LOCKED, HARD_LOCKED) MUST be clearly communicated with distinct recovery paths.
- Existing Platform Billing tests, architecture and accepted phase history MUST be preserved.

### 8.3 Facility Member Commerce

**Definition:** Plans, memberships, enrollments, payments, invoices and collections that a facility manages for its own members, students, clients or athletes.

**Existing facility-facing routes (CURRENT-STATE EVIDENCE):**
- `/subscriptions` — subscription/admission management (flag-gated label)
- `/billing` — currently mock data only

### 8.4 Separation Rules

The following rules are MANDATORY:

1. The two domains MUST never be presented as the same thing in any user-facing surface.
2. Facility membership plans MUST never determine organisation access to Doers.
3. Facility payments MUST never determine Doers Platform Billing status.
4. Platform Billing invoices and Facility Member invoices MUST be visually and contextually distinct.
5. Platform Billing terminology (plan, subscription, invoice, payment) MUST be visually contextualised as belonging to the Doers platform, not to the facility's members.
6. Facility Member Commerce terminology MUST be visually contextualised as belonging to the facility's own operations.
7. Navigation items for Platform Billing MUST be separated from Facility Member Commerce items — in a different navigation group or visually demarcated.
8. Dashboard widgets MUST NOT mix Platform Billing metrics with Facility Member Commerce metrics in the same card or visual area without clear separation.

---

## 9. BRAND AND VISUAL IDENTITY

### 9.1 Visual Character

Doers MUST feel:
- classical, premium, quiet, calm;
- editorial, trustworthy, sophisticated;
- operational, readable, restrained;
- appropriate for daily professional use.

Doers MUST NOT feel:
- neon, flashy, gaming-style;
- generic blue enterprise-admin;
- startup-style with bright gradients;
- "luxury" at the expense of readability.

### 9.2 Colour Palette

**CURRENT-STATE EVIDENCE AND BRAND DIRECTION:** The colour values below are observed from the current codebase snapshot and represent the intended classical premium direction. They are NOT validated binding final tokens. Several combinations fail WCAG 2.2 AA contrast requirements. These values MUST be treated as brand direction pending accessible token refinement. Final semantic tokens MUST satisfy the contrast requirements in Section 13.

**Light Theme (current state):**

| Token | Value | Usage |
|---|---|---|
| `--bg-page` / `--paper` | `#F7F5F1` | Page background |
| `--bg-surface` / `--card` | `#FFFFFF` | Cards, elevated surfaces |
| `--bg-sidebar` | `#FFFFFF` | Sidebar background |
| `--text-primary` / `--ink` | `#1A1814` | Primary text |
| `--text-secondary` / `--ink-muted` | `#6B6760` | Secondary text, metadata |
| `--text-muted` | `#9A9590` | Muted/placeholder text |
| `--border-default` | `#E8E4DE` | Subtle borders |
| `--border-strong` | `#C8C4BC` | Stronger borders |
| `--accent-gold` / `--gold` | `#B87333` | Primary accent, copper/champagne-gold |
| `--accent-gold-dark` | `#9A6428` | Hover/active accent |
| `--accent-gold-text` | `#7A4F1E` | Gold-on-light text |
| `--destructive` | `#E24B4A` | Destruction, critical errors |
| `--success` | `#4CAF50` | Success states |

**Dark Theme:**

| Token | Value |
|---|---|
| `--bg-page` | `#111009` |
| `--bg-surface` | `#1A1814` |
| `--bg-sidebar` | `#141210` |
| `--text-primary` | `#F0EDE6` |
| `--text-secondary` | `#A09890` |
| `--text-muted` | `#6B6760` |
| `--border-default` | `#2E2B26` |
| `--border-strong` | `#3E3B36` |
| `--accent-gold` | `#C9893F` |
| `--accent-gold-dark` | `#B87333` |
| `--accent-gold-text` | `#E8A855` |

### 9.3 Typography

| Role | Font | Usage |
|---|---|---|
| **Headings** | Cormorant Garamond (serif) | `h1`–`h6`, section titles, editorial headers. Font weight: regular to medium. Italic for secondary headings. |
| **Body & Interface** | Instrument Sans (sans-serif) | Paragraphs, labels, form controls, tables, navigation text. Font weights: regular (400), medium (500), semibold (600). |
| **Technical / Metadata** | Geist Mono (monospace) | Codes, IDs, technical data, financial precision values. Only when genuinely useful. |
| **Fallback** | Serif: `serif`. Sans: `sans-serif`. Mono: `monospace`. | System fallbacks. |

**CURRENT-STATE EVIDENCE:** Typography is configured in two places:
- `index.html:9` loads legacy Inter (300–600) and Playfair Display (400–600, italic) from Google Fonts.
- `src/index.css:2` loads the intended Cormorant Garamond (serif), Instrument Sans (sans-serif) and Geist Mono (monospace) from Google Fonts.
- `tailwind.config.js:26-28` references the intended fonts (Cormorant Garamond, Instrument Sans, Geist Mono).

Duplicate and legacy font loading (Inter, Playfair Display) is Phase 1 debt. The `index.html` font link for Inter/Playfair Display MUST be removed or reconciled with the intended font stack.

### 9.4 Typography Sizing Rules

| Role | Minimum | Recommended |
|---|---|---|
| Normal body copy | SHOULD default to 16px | 16px |
| Dense interface / table copy | 14px minimum | 14px |
| Interactive labels (buttons, form labels, navigation) | 14px minimum | 14px |
| Meaningful metadata (timestamps, secondary info, badges) | 12px minimum | 12px–14px |
| Non-essential decorative text | 10px | Should not carry essential information |
| Headings | Logical hierarchy; each level visually distinct | |

**Prohibitions:**
- Essential or actionable information MUST NOT depend on 8px–10px micro-text.
- Form labels, error messages, navigation items and actionable content MUST NOT be below 14px.
- Meaningful metadata and badges MUST NOT be below 12px.
- Mono type MUST NOT be used for ordinary prose.
- Uppercase and letter-spacing MUST be restrained. `tracking-[0.22em]` or wider tracking MUST NOT be applied to running text.

**CURRENT-STATE EVIDENCE:** The codebase uses extensive `text-[8px]`, `text-[9px]`, `text-[10px]` and `text-[11px]` sizing (100+ instances). `metadata-label` class uses `text-[8.5px]`. Navigation sidebar link text is 13px. Form labels use 11px. This requires systematic remediation.

### 9.5 Spacing, Borders, Radius and Shadows

| Aspect | Rule |
|---|---|
| **Spacing** | Consistent spacing scale. Classical generous but not wasteful spacing. Page content area: comfortable reading width where appropriate. |
| **Borders** | Subtle, hairline where possible. `1px solid` preferred. Border colour from token scale. |
| **Radius** | Restrained: 4px (small controls), 6–8px (cards), 12px (large containers). No oversized rounded corners. |
| **Shadows** | Minimal, classical. No heavy drop shadows, no neon glow, no excessive depth. Editorial-style subtle paper shadows preferred. |

**Prohibitions:**
- Oversized rounded cards (radius > 16px for standard content cards)
- Heavy box shadows (blur > 24px for standard elevations)
- Neon or coloured shadows
- Excessive decorative overlays

### 9.6 Iconography

- Icon set: Lucide React (already the dependency: `package.json:21`)
- Icon size: consistent within context. 16px–20px for inline icons, 20px–24px for standalone icons.
- Icon-only actions MUST have accessible text alternatives (aria-label, visually-hidden text, or tooltip).
- No icon font usage that bypasses accessibility.

### 9.7 Motion

- Animation MUST respect `prefers-reduced-motion: reduce`.
- Transition duration: 150ms–400ms for micro-interactions.
- Decorative looping animation (infinite spins, continuous motion, looping decorative transitions) is prohibited.
- A bounded loading animation (e.g., a spinner or progressing indicator) is permitted ONLY while real asynchronous work is pending, and MUST be paired with a timeout/error transition and reduced-motion alternative.
- Page transitions should be instant or minimal fade (under 200ms).
- Existing animations `subtle-up` (0.8s) and `fade-in` (0.6s) in `tailwind.config.js` MUST be reduced or disabled for users who prefer reduced motion.

### 9.8 Dark Mode

- Dark mode MUST be supported with complete token-based theming.
- Dark mode MUST use the same token architecture as light mode. Hardcoded colour values are prohibited.
- Theme toggle MUST persist preference to localStorage.
- System preference MUST be detected on first visit if no stored preference exists.
- Both modes MUST independently meet WCAG 2.2 AA contrast requirements.

**CURRENT-STATE EVIDENCE:** Dark mode exists with token-based theming in `src/tokens.css` and `src/styles/tokens.css`. Two theme providers exist: `src/components/providers/ThemeProvider.tsx` (on-mount init) and `src/shared/context/ThemeContext.tsx` (context-based toggle). Theme is persisted as `doers-theme` in localStorage and `data-theme` attribute on `<html>`. Architecture requires consolidation to a single source of truth.

### 9.9 Prohibited Visual Styles

The following MUST NOT appear in any Doers interface:
- neon colours or neon-on-dark designs;
- bright multicolour gradients;
- glassmorphism or frosted-glass effects (including the existing `glass-surface` utility — see CURRENT-STATE EVIDENCE below);
- gaming-style interfaces with heavy glow effects;
- flashy startup-style visuals;
- heavy shadows (multiple layered box-shadows with large blur values);
- oversized rounded cards;
- excessive animation (bouncing, spinning, continuous motion);
- generic blue enterprise-admin styling (blue-600 headers, blue sidebars);
- unnecessary decorative charts with no actionable data;
- cryptic enterprise vocabulary in UI labels (see Section 10).

**CURRENT-STATE EVIDENCE:** The codebase contains a `glass-surface` utility class (`src/index.css:55`) providing backdrop blur and semi-transparent backgrounds. This utility and all glassmorphism/frosted-surface effects are prohibited. Record the utility as Phase 1 debt for removal.

---

## 10. PLAIN-LANGUAGE UX WRITING

### 10.1 Writing Principles

1. **Direct labels.** Buttons, form fields, navigation items, empty states and error messages MUST use plain, direct language.
2. **Clear actions.** Every action MUST make its effect obvious from its label alone.
3. **Understandable errors.** Error messages MUST describe what happened, why, and what the user can do next — in plain language.
4. **No decorative jargon.** Technical or institutional-sounding terms MUST NOT be used as decorative UI language.
5. **No fake institutional terminology.** Terms like "registry", "infrastructure", "protocol", "diagnostics", "institutional" MUST NOT be used unless they refer to a genuine technical concept that the user needs to understand.
6. **No unnecessary all-caps.** All-caps MUST be reserved for short labels (max 15 characters) where typographic distinction is genuinely useful.
7. **No excessive letter spacing.** Letter-spacing > 0.12em MUST NOT be applied to running text.

### 10.2 CURRENT-STATE EVIDENCE — Writing Issues

The current frontend uses vocabulary that implies capabilities or statuses that do not exist or are decorative:

| Current Wording | Location | Issue | Recommendation |
|---|---|---|---|
| "Initializing Registry Experience" | Router fallback (`src/app/router/index.tsx:46`) | "Registry" is not a real concept | "Loading…" or "Preparing your workspace…" |
| "Studio Intelligence" | Dashboard header (`src/pages/dashboard/page.tsx:28`) | Implies AI/business-intelligence capability not present | "Dashboard" or "Organisation Overview" |
| "System Diagnostics" | Attendance page (`src/pages/attendance/page.tsx:189`) | Implies technical diagnostics | "Facility Status" or remove if non-functional |
| "SECURE CLOUD", "SOC 2 CERTIFIED", "ISO ENCRYPTED" | Signup footer (`src/pages/auth/signup/page.tsx:274-278`) | Unverified compliance claims | Remove or replace with verified status |
| "Secure biometric sync enabled" | Attendance page (`src/pages/attendance/page.tsx:195`) | Biometric capability not implemented | Remove |
| "biometric GPS disabled" | Gyms page (`src/pages/gyms/page.tsx:88`) | No biometric/GPS implementation | Remove |
| "REGISTRY SECURE" | Reports page | "Registry" concept does not exist | Remove |
| "VISUAL GRAPH REGISTRIES" | Reports page | Decorative nonsense word | Remove |
| "Institutional Parameters" | Onboarding page (`src/pages/onboarding/page.tsx:209`) | Pretentious wording | "Organisation Details" or "Business Information" |
| "Trial progression verified" / "Auto-verified" | Dashboard | Implies verification of unclear concept | "Trial active — 8 days remaining" (plain statement) |
| "Average studio dwell: 72 mins" | Dashboard | Hardcoded, not real data | Show real data or remove metric |
| "Operational Insights" with "Healthy", "Initializing", "Stable" | Dashboard | Hardcoded status without real monitoring | Remove or connect to real operational status |
| "Generate Report" (non-functional) | Dashboard | Decorative button with no handler | Remove or connect to reports feature |

### 10.3 Recommended Replacement Examples

| Current Style | Recommended Style |
|---|---|
| "Initialize Studio" | "Complete Setup" |
| "Establish your geographical registry details" | "Enter your business address" |
| "Your registry parameters have been initialized" | "Your organisation profile has been saved" |
| "Verification required for automated registry" | "Address verification in progress" |
| "Manage your gym locations, contacts, and hours" | "Manage your locations, contacts, and operating hours" |
| "The member registry could not be loaded" | "Could not load members" |

---

## 11. DESIGN-SYSTEM GOVERNANCE

### 11.1 Single Authoritative Implementation Requirement

The design system MUST have exactly one authoritative implementation for each of the following:

| Component | Current State | Required Action |
|---|---|---|
| **Theme provider** | Two implementations (`src/components/providers/ThemeProvider.tsx`, `src/shared/context/ThemeContext.tsx`) | Consolidate into one |
| **Design tokens** | Two files (`src/tokens.css`, `src/styles/tokens.css`) plus tokens in `src/index.css` | Consolidate into one authoritative token file |
| **Button** | Two implementations (`src/components/ui/Button.tsx`, `src/shared/components/ui/Button.tsx`) | Retain active, remove dead |
| **Input** | Two implementations (`src/components/ui/Input.tsx`, `src/shared/components/ui/Input.tsx`) | Retain active, remove dead |
| **Card** | Two implementations (`src/components/ui/Card.tsx`, `src/shared/components/ui/Card.tsx`) | Retain active, remove dead |
| **Select** | Not implemented in shared components | Create one |
| **Textarea** | Not implemented in shared components | Create one |
| **Checkbox** | Not implemented in shared components | Create one |
| **Switch / Toggle** | Inline implementations in settings page | Extract into shared component |
| **Badge** | One implementation (`src/components/ui/Badge.tsx`) | Acceptable — retain |
| **Dialog** | Inline `<div className="fixed inset-0">` overlays | Create proper Dialog component |
| **Drawer** | Not implemented | Create if needed |
| **Dropdown** | Not implemented | Create one |
| **Combobox** | Not implemented | Create one |
| **Toast** | Not implemented | Create one |
| **Alert** | Not implemented as shared component | Create one |
| **Empty state** | Inline per-page | Create standardised EmptyState |
| **Loading state** | Inline per-page | Create standardised LoadingState |
| **Error state** | Inline per-page | Create standardised ErrorState |
| **Table** | Inline per-page | Create standardised Table component |
| **Pagination** | Not implemented | Create one |
| **Page header** | One implementation (`src/components/ui/PageHeader.tsx`) | Acceptable — retain |
| **Chart wrapper** | Inline SVG | Create standardised ChartWrapper or use charting library |
| **Responsive container** | Inline Tailwind classes | Create standardised container component |

### 11.2 Token Categories

Design tokens MUST be organised into the following categories:

| Category | Examples |
|---|---|
| **Colour** | Backgrounds, text, borders, accents, semantic states |
| **Typography** | Font families, sizes, weights, line heights, letter-spacing |
| **Spacing** | Scale from 4px to 128px |
| **Radius** | Small (4px), medium (6–8px), large (12px) |
| **Border** | Widths, colours, opacities |
| **Elevation** | Shadow levels (minimal, subtle, raised) |
| **Motion** | Duration, easing curves |
| **Breakpoint** | xs (375px), sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1440px) |
| **Z-index** | Dropdown, sticky, overlay, modal, toast |
| **Control size** | Input heights, button padding, icon sizes |

**CURRENT-STATE EVIDENCE:** `src/styles/tokens.css` is the more complete token file (48 lines, with tokens for `--bg-input`, `--radius-*`, `--navbar-height`, `--sidebar-width`, light and dark). `src/tokens.css` is a simpler subset (35 lines, light only, fewer tokens). Both are imported in `src/main.tsx` and `src/index.css` respectively. Both use `:root` and `:root[data-theme="dark"]` selectors. Consolidation required.

### 11.3 Token Governance

- Token values MUST be defined in exactly one file.
- Components MUST reference tokens via CSS custom properties, not hardcoded colour values.
- Exceptions for hardcoded values are permitted only for: inline SVGs, chart colours with explicit documented rationale, and temporary demo/mock content that is clearly labelled and will be removed.
- Token names MUST be semantic (`--accent-gold`, not `--color-brand-primary`).
- Token changes MUST be versioned and reviewed.

### 11.4 Component API Standards

Every shared component MUST:
- accept a `className` prop for composition;
- forward relevant HTML attributes where appropriate;
- use `forwardRef` where the underlying element needs ref access;
- define visual states: default, hover, focus, active, disabled, loading;
- respect dark mode via token-based theming, not hardcoded `dark:` overrides;
- have a corresponding `.d.ts` declaration file only if explicitly needed (avoid generation pollution);
- be documented with a usage example or Storybook story (future phase).

---

## 12. TYPOGRAPHY AND READABILITY

### 12.1 Minimum Text Sizes

| Text Role | Minimum Size | Rationale |
|---|---|---|
| Primary body text | 14px | Readability for daily professional use |
| Interactive labels (buttons, form labels) | 14px | Readability and touch target |
| Meaningful metadata | 12px | Secondary information |
| Form helper text | 12px | Must be readable to serve purpose |
| Badge text | 12px | Short labels inside bounded containers; 11px acceptable only where truly constrained |
| Non-essential decorative micro-text | 10px | Only for truly non-essential elements |

**8px and 9px text MUST NOT convey essential information.** This applies to form labels, error messages, navigation items, data values and any content the user must read to complete a task.

**CURRENT-STATE EVIDENCE:** The codebase uses extensive `text-[8px]`, `text-[9px]`, `text-[10px]` and `text-[11px]` sizing (100+ instances). `metadata-label` class uses `text-[8.5px]`. Navigation sidebar link text is 13px. Form labels use 11px. These violate the minimum requirements above and require systematic remediation.

### 12.2 Heading Hierarchy

- Headings MUST form a logical, unbroken hierarchy. No skipped levels (e.g., `h1` → `h3` without `h2`).
- Each page MUST have exactly one `h1`.
- Section headings MUST use `h2`, sub-sections `h3`.
- Heading font MUST be Cormorant Garamond (serif).
- Card titles MAY use `h3` or `h4` depending on the page hierarchy.

### 12.3 Letter-Spacing and Case

- Uppercase: reserved for short decorative labels, badges and button text (max ~15 characters). Long uppercase text is prohibited.
- Letter-spacing: `tracking-tightest` for headings; standard for body; `tracking-[0.08em]` to `tracking-[0.12em]` for short uppercase labels. Wider tracking than 0.12em is prohibited on any text the user must read.
- Mono type: Geist Mono reserved for codes, identifiers, financial precision values. Not for labels, headings, or prose.

---

## 13. COLOUR AND CONTRAST

### 13.1 WCAG 2.2 AA Target

All user interfaces in both light and dark themes MUST meet WCAG 2.2 Level AA:

| Requirement | Minimum Ratio |
|---|---|
| Normal text (< 18pt or < 14pt bold) | 4.5:1 |
| Large text (>= 18pt or >= 14pt bold) | 3:1 |
| UI components and graphical objects | 3:1 |
| Focus indicators | 3:1 against adjacent colours |

### 13.2 Colour-Only Information

- Status, state and category MUST NOT be communicated by colour alone.
- Success, warning, error and info states MUST include an icon or text label in addition to colour.
- Charts and graphs MUST have accessible alternatives (data tables or text descriptions).

### 13.3 Light and Dark Theme Verification

- Both themes MUST be tested independently for contrast compliance.
- Muted text (`--text-secondary`, `--text-muted`) MUST remain readable in both themes.
- Focus indicators MUST be visible in both themes.

### 13.4 CURRENT-STATE EVIDENCE — Contrast Risks

The following approximate contrast ratios were verified against the WCAG relative-luminance formula. Several current palette combinations fail AA:

| Pair | Role | Approximate Ratio | AA Normal Text (4.5:1) | AA Large Text (3:1) |
|---|---|---|---|---|
| `#9A9590` on `#F7F5F1` | Muted/secondary text on page | 2.73:1 | FAIL | FAIL |
| `#B8B4AE` on `#F7F5F1` | Placeholder text on page | 1.90:1 | FAIL | FAIL |
| `#6B6760` on `#F7F5F1` | Secondary text on page | 5.17:1 | PASS | PASS |
| `#6B6760` on `#111009` | Muted text on dark page | 3.39:1 | FAIL | PASS |
| `#4CAF50` on `#FFFFFF` | Success indicator on white card | 2.78:1 | FAIL | FAIL |
| `#E24B4A` on `#FFFFFF` | Destructive indicator on white card | 3.93:1 | FAIL | PASS |
| `#FFFFFF` on `#B87333` | White text on copper accent | 3.79:1 | FAIL | PASS |
| `#F0EDE6` on `#1A1814` | Primary text on dark surface | ~10:1 | PASS | PASS |

Never call a failing colour acceptable for normal text. All ratios are presented as current-state evidence pending token refinement. The corrected constitution does not make current failing values binding final tokens; they are recorded as brand direction.

### 13.4-A Layered Token Architecture

The corrected design system MUST implement a layered token architecture:

1. **Palette primitives** — Raw colour values (hex, HSL). Foundation only; not directly consumed by components. Example: `--copper-600: #B87333`.
2. **Semantic tokens** — Purpose-named tokens conveying functional intent rather than appearance. Examples: `--color-action-primary`, `--color-text-muted`, `--color-surface-page`. Derived from palette primitives.
3. **Component tokens** — Component-scoped aliases bridging semantics to specific elements. Example: `--button-primary-bg`. Derived from semantic tokens.

Every semantic token MUST have a validated pair defined for: text-on-surface, text-on-accent, success-on-surface, warning-on-surface, destructive-on-surface and focus-on-surface. Arbitrary hardcoded UI colours for demos, charts or inline SVG are disallowed unless the rationale is documented and the pair is approved.

### 13.4-B Focus Indicators

- Button component (`src/components/ui/Button.tsx`) uses `focus:outline-none` without an alternative focus indicator. Users navigating by keyboard receive no visible focus indication.
- Focus indicators MUST achieve at least 3:1 contrast against adjacent colours in both themes.

---

## 14. ACCESSIBILITY

### 14.1 Conformance Target

```
WCAG 2.2 Level AA
```

No WCAG conformity is claimed until verified through testing. The target is stated as a requirement for all future frontend work.

### 14.2 Keyboard Accessibility

- All interactive functionality MUST be operable via keyboard alone.
- Keyboard navigation order MUST be logical and match the visual layout.
- No keyboard traps MUST exist.
- Skip-to-content link MUST be provided.

### 14.3 Focus Visibility

- All interactive elements MUST have a visible focus indicator.
- Focus outline removal (`focus:outline-none`) MUST be accompanied by a visible alternative (`focus:ring-*`, `focus:border-*`, or equivalent).
- CURRENT-STATE EVIDENCE: `src/components/ui/Button.tsx:65` removes focus outline without replacement. Toggle switches in settings page remove focus outline without replacement. ThemeToggle removes focus outline without replacement.

### 14.4 Semantic Structure

- HTML MUST use semantic elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.
- Exactly one `<main>` landmark MUST be present per page.
- Landmarks MUST be used correctly: `<nav>` for navigation groups, `<aside>` for complementary content.
- Headings MUST follow logical hierarchy.

### 14.5 Form Accessibility

- Every form control MUST have an associated `<label>` element or `aria-label`/`aria-labelledby`.
- Error messages MUST be programmatically associated with their fields via `aria-describedby` or `aria-errormessage`.
- Required fields MUST be indicated both visually and programmatically (`aria-required` or `required` attribute).
- Form validation errors MUST be announced to assistive technology via live regions.
- CURRENT-STATE EVIDENCE: `src/components/ui/Input.tsx` has a `label` prop but the association mechanism should be verified. Member form and subscription form dialogs lack `aria-describedby` for error association.

### 14.6 Dialog Accessibility

- Modals MUST use a proper Dialog component with:
  - `role="dialog"` or the `<dialog>` HTML element;
  - `aria-modal="true"`;
  - `aria-labelledby` referencing the dialog title;
  - Focus trapping within the dialog;
  - Focus restoration to the trigger element on close;
  - Escape key to close;
  - Click-outside-to-close behaviour (where safe).
- CURRENT-STATE EVIDENCE: Member creation dialog and subscription admission dialog use `<div className="fixed inset-0">` overlays without proper dialog semantics, focus trapping or Escape handling.

### 14.7 Combobox Accessibility

- Any combobox (autocomplete, typeahead, searchable select) MUST follow the ARIA 1.2 Combobox pattern.
- Current implementations of searchable member/plan selectors in the subscription form should be audited for combobox semantics.

### 14.8 Touch Targets

- Interactive elements SHOULD have a minimum touch target size of 44×44 CSS pixels.
- Where 44×44 is impractical, targets MUST be at least 24×24 CSS pixels with adequate spacing.
- No touch target overlap.

### 14.9 Screen-Reader Support

- All non-text content MUST have text alternatives (`alt`, `aria-label`, `aria-labelledby`).
- Live regions MUST be used for asynchronous status messages (success, error, loading completion).
- Icon-only buttons MUST have accessible names.
- Status messages (toasts, alerts) MUST use `role="status"` or `role="alert"` as appropriate.

### 14.10 Reduced Motion

- All animations and transitions MUST respect `prefers-reduced-motion: reduce`.
- Where animation conveys information, an alternative non-animated presentation MUST exist.
- CURRENT-STATE EVIDENCE: The codebase uses Tailwind animations (`subtle-up`, `fade-in`) and CSS transitions but does not check `prefers-reduced-motion`. The `animate-spin` loader in the router fallback does not respect reduced motion.

### 14.11 Data Tables and Charts

- Data tables MUST use proper `<thead>`, `<tbody>`, `<th>` with `scope` attributes.
- Charts and graphs MUST have text alternatives (data tables, descriptions, or accessible chart rendering).

### 14.12 Zoom and Reflow

- Content MUST reflow correctly at 200% text resize without loss of content or functionality and without requiring horizontal scrolling.
- Reflow MUST be verified at an equivalent 320 CSS-pixel width, commonly tested at 400% zoom on a 1280 CSS-pixel viewport.
- Documented exceptions are permitted only for essential two-dimensional content (e.g., maps, data tables requiring both rows and columns, media that depends on two-axis layout to convey meaning).

### 14.12-A Additional WCAG 2.2 Requirements

The following WCAG 2.2 Level AA requirements MUST be addressed:

- **Focus Not Obscured (Minimum):** When an interactive element receives focus, it MUST NOT be entirely hidden by author-created content.
- **Dragging Movements:** Any function that uses dragging MUST also be operable through single-pointer actions without dragging.
- **Target Size (Minimum):** Touch/pointer targets SHOULD be at least 24×24 CSS pixels (see Section 14.8).
- **Redundant Entry:** Information previously entered by or provided to the user MUST be auto-populated or available for selection in subsequent steps of the same process.
- **Accessible Authentication:** Cognitive function tests (e.g., password recall, puzzle-solving) MUST NOT be required unless alternative authentication methods or assistance mechanisms are provided.
- **Consistent Help:** Where help mechanisms exist, they MUST appear in a consistent order across pages.

### 14.12-B Dialog and Surface Requirements

- Dialog background content MUST be made inert (`aria-hidden` on background, `inert` attribute, or equivalent) while the dialog is open.
- Scroll on the background page MUST be managed when a dialog is open (body scroll lock).
- Focus MUST be trapped within the dialog and restored to the trigger element on close.
- Toggle switches MUST use `role="switch"` and `aria-checked` to convey state to assistive technology.
- Charts and graphs MUST provide accessible alternatives: data tables, text descriptions or accessible chart rendering that conveys the same information.

### 14.12-C Landmark and Structure Requirements

- No page SHALL contain nested `<main>` landmarks.
- Every form control MUST have a programmatically associated label (via `<label>`, `aria-label` or `aria-labelledby`).
- Every form error MUST be programmatically associated with its field via `aria-describedby` or `aria-errormessage`.

### 14.12-D Reduced-Motion Behaviour

- All animations and transitions MUST respect `prefers-reduced-motion: reduce`.
- Where animation conveys information, a non-animated alternative presentation MUST exist.
- The bounded loading animation permitted by Section 9.7 MUST honour `prefers-reduced-motion` by presenting a non-moving alternative.

---

## 15. RESPONSIVE BEHAVIOUR

### 15.1 Supported Breakpoints

MUST be validated at the following widths:

| Width | Device Class | Validation Requirement |
|---|---|---|
| 320px | Smallest legacy phone | Must render without horizontal scroll; all critical controls accessible |
| 360px | Common small Android | Must be functional |
| 375px | iPhone SE / small iOS | Must be functional |
| 390px | iPhone 14 | Must be functional |
| 640px | Large phone / small tablet portrait | Layout adjustments begin |
| 768px | Tablet portrait | Side-by-side layouts where appropriate |
| 1024px | Tablet landscape / small desktop | Full navigation visible; multi-column layouts |
| 1280px | Desktop | Full layout |
| 1440px | Large desktop | Comfortable maximum width; content width constrained |
| >1440px | Ultrawide | Content centred with max-width; no stretched layouts |

### 15.2 Behaviour by Viewport

| Element | Mobile (< 768px) | Tablet (768–1023px) | Desktop (>= 1024px) |
|---|---|---|---|
| **Sidebar** | Hidden behind hamburger; overlay drawer | Collapsed to icons | Full width with text labels |
| **Header** | Logo, location selector, hamburger | Full controls | Full controls |
| **Location selector** | Truncated; tap to open | Full width if space permits | Full width |
| **Page header** | Stacked (title above actions) | Side-by-side | Side-by-side |
| **Forms** | Single column | Single column or two-column for related fields | Two-column where logical |
| **Tables** | Card view or horizontal scroll | Standard table with priority columns | Full table |
| **Cards / Grid** | Single column | Two columns | Two or three columns |
| **Charts** | Full width; simplified | Full width | Multi-chart layouts |
| **Dialogs** | Full-screen or near-full-screen | Centred modal with max-width | Centred modal with max-width |
| **Settings navigation** | Accordion or tabs | Sidebar tabs | Sidebar tabs |
| **Date pickers** | Native or compact | Full picker | Full picker |

### 15.3 Overflow and Truncation

- No essential control MAY become inaccessible through overflow or truncation at any supported breakpoint.
- Long organisation and location names MUST be truncated with ellipsis and a tooltip or expand mechanism.
- Tables with many columns MUST use priority column patterns, horizontal scroll with sticky first column, or card-view fallback.
- Mobile header controls MUST fit within the available width. If they overflow at 320px, the lowest-priority controls MUST move to an overflow menu.

### 15.4 CURRENT-STATE EVIDENCE — Responsive Risks

- The app shell header contains: hamburger, logo + brand text (mobile only), ThemeToggle, BranchSelector, and avatar — five elements in a fixed-width header bar (`src/components/layout/AppShell.tsx:62-115`). At 320px, these may overflow.
- Tables on members and subscriptions pages use horizontal scroll but lack sticky first-column behaviour.
- Forms on members page use grid layouts that may need adjustment at narrow widths.
- All layouts use Tailwind responsive utilities. No responsive breakpoint-specific bugs were found beyond the header concern.

---

## 16. MULTI-TENANT AND LOCATION CONTEXT

### 16.1 Context Model

| Context | Source | Persistence | Scope |
|---|---|---|---|
| **Authentication** | Backend-verified JWT / session | Zustand persist in localStorage (CURRENT STATE) | User identity |
| **Organisation** | Auth token `org_id` claim | Derived from auth context | Tenant boundary |
| **Selected Location** | User selection via BranchSelector | Zustand persist in localStorage (`branch-storage`) | Most data queries |
| **All-Locations** | Toggle or selector option | Transient | Aggregated views |

### 16.1-A Organisation and Location Ownership

The following ownership rules apply:

- **People** (members, students, clients, athletes) are organisation-scoped identities with one or more location relationships. A person belongs to the organisation; the location relationship records where they primarily attend or are managed.
- **Team members** (staff, instructors, coaches) are organisation-scoped with location assignments. A team member's location assignment controls which location's data they can access; it does not change their ownership from organisation to location.
- **Programs and commercial products** (plans, packages, passes) may be organisation-wide or location-specific depending on business configuration. Some facilities offer the same plans across all locations; others have branch-specific pricing or offerings.
- **Sessions, attendance and physical resources** are normally location-scoped. A class occurrence happens at a specific location; attendance is recorded at that location; a room belongs to a location.
- **A location filter does not change ownership** of an organisation-scoped record. Filtering by location shows a subset of people or plans associated with that location; it does not make those records location-owned.
- **Current membership plans** may be organisation-wide or branch-specific. Cache rules must encode the actual scope of each plan rather than assuming all plans reference the selected location.

### 16.2 Context Rules

1. Backend tenant isolation is the authoritative enforcement layer. The frontend provides presentation-level context selection.
2. A client-supplied organisation or location identifier is context, never authority.
3. Switching locations MUST invalidate location-scoped React Query caches.
4. Switching organisations (multi-org access, future) MUST invalidate all data caches and reset navigation state.
5. Stale-context indicators MUST be displayed when the user's auth token or organisation membership changes.
6. No tenant or location selector supplied by the browser MAY be treated as authorisation.

### 16.3 Cache Isolation

- React Query cache keys MUST include organisation and location identifiers where the data is scoped.
- Global organisation data (settings, branding, plans, Platform Billing) MUST be cached with organisation-scoped keys.
- Location-scoped data (members at a branch, attendance, schedule) MUST be cached with location-scoped keys.
- All-locations aggregated views MUST use distinct cache keys.

### 16.4 Mutation Confirmation

- Mutations that affect location-scoped data MUST confirm or visually indicate the affected location.
- When the selected location context might affect a mutation's outcome, the current context MUST be displayed prominently.

### 16.5 CURRENT-STATE EVIDENCE

- Branch selection is managed by `features/gym/store/branchStore.ts` (Zustand persist).
- `BranchSelector` component shows the current selection in the header.
- Cache invalidation on branch switch was not fully verified but appears to be handled via React Query dependencies.
- Organisation context is derived from JWT token `org_id` claim via `getAuthTokenPayload()` in `client.ts`.

---

## 17. TRUTHFUL UI AND DATA PROVENANCE

### 17.1 Prohibition of Fabricated Data

Production-facing routes MUST NOT display mock, random, hardcoded or sample operational data as if it were a live experience. The frontend MUST NOT present fabricated, random or unverified information as live production data. The following are specifically prohibited:

1. Fabricated production data — presenting mock or hardcoded data without clear labelling as if it were real.
2. Random chart values — using `Math.random()` or equivalent for chart data in production pages.
3. Fake financial numbers — hardcoded revenue, payment or collection figures.
4. Fake occupancy — hardcoded capacity, attendance or utilisation percentages.
5. Fake security health — unverified security, biometric or compliance statuses.
6. Fake retry success — simulating successful retry of operations that are not actually connected to the backend.
7. Fake compliance certification — displaying unverified SOC 2, ISO, PCI, HIPAA or similar badges.
8. Fake synchronisation status — displaying sync statuses not backed by real sync operations.
9. Non-functional controls presented as available — buttons, toggles and actions that do nothing beyond showing an alert, prompt, confirm or logging to console.
10. Fake operational health — hardcoded "Healthy", "Stable", "Initializing" statuses without real monitoring.
11. Fake biometric or sensor claims — "biometric sync enabled", "biometric GPS" or similar without implementation.
12. Non-functional Google sign-in and password-recovery controls.
13. Demo settings switches presented as real, active-looking controls.
14. Active buttons that only call `alert()`, `prompt()` or `console.log()` — these are non-functional and misleading.
15. Empty scaffold pages exposed as working navigation destinations in production.

### 17.1-A Remediation Requirements for Unimplemented Capabilities

For any capability that is not implemented, Phase 0B MUST choose one truthful outcome:

1. **Hide/remove** the production navigation entry entirely;
2. **Gate** the route outside production (feature-flag or environment-gate);
3. **Show an honest unavailable state** with no active-looking controls, clear labelling that the feature is not yet available, and no mock data masquerading as real;
4. **Use a separately entered, unmistakably non-production demo environment** with clear visual separation.

A small "Demo" badge on a normal production route is insufficient — the full page remains misleading because it presents fake operational data in a production context. For an unimplemented capability, Phase 0B must select one of the four truthful outcomes.

### 17.2 Demo Data Requirements

- Demo or mock data MUST be explicitly labelled as "Demo", "Sample" or "Preview".
- Demo data MUST be visually distinct from real data (e.g., watermark, different background tint, badge).
- Demo pages MUST NOT be accessible through normal production navigation paths without explicit opt-in.
- Demo data MUST NOT share the same components or layouts as production data without clear separation.

### 17.3 State Requirements

Every data-displaying screen MUST define and handle:

| State | Requirement |
|---|---|
| **Empty** | Clear message: No data exists. Guidance on how to create the first item. |
| **Unavailable** | Clear message: This feature is not yet available. Expected availability or alternative. |
| **Stale** | Visual indicator: Data may not reflect latest changes. Timestamp of last refresh. |
| **Partial** | Clear message: Only partial data is shown. Why and what is missing. |
| **Error** | Clear error message. Retry action if applicable. |
| **Loading** | Skeleton or spinner. Must not persist indefinitely. |

### 17.4 Data-Source Clarity

- Every data-displaying component MUST make the data source and scope clear:
  - Organisation-level or location-level data;
  - Date range where applicable;
  - Last-updated timestamp for stale-able data;
  - Data completeness (all locations, selected location, subset).

### 17.5 CURRENT-STATE EVIDENCE — Truthfulness Violations

| Page | Issue | Location |
|---|---|---|
| Dashboard | Revenue bar chart uses `Math.random()` | `src/pages/dashboard/page.tsx:207` |
| Dashboard | Multiple hardcoded metric values (42% occupancy, 128 check-ins, ₹12,500/mo) | `src/pages/dashboard/page.tsx:110-170` |
| Dashboard | Hardcoded trial status, plan name, renewal date | `src/pages/dashboard/page.tsx:82-111` |
| Dashboard | "Generate Report" button has no handler | `src/pages/dashboard/page.tsx:67` |
| Attendance | Heatmap uses `Math.floor(Math.random() * 100)` | `src/pages/attendance/page.tsx:34` |
| Attendance | All check-in data is `MOCK_CHECKINS` array | `src/pages/attendance/page.tsx:7-18` |
| Attendance | Hardcoded metrics (42% capacity, 128 members) | `src/pages/attendance/page.tsx:177-189` |
| Billing | All payment data is `MOCK_PAYMENTS` array | `src/pages/billing/page.tsx:8-15` |
| Billing | "Export CSV" triggers `alert()` | `src/pages/billing/page.tsx:22` |
| Reports | All report data is hardcoded SVG | `src/pages/reports/page.tsx` |
| Reports | "Generate Report" triggers `alert()` | `src/pages/reports/page.tsx:19` |
| Gyms | All gym data is `MOCK_GYMS` array | `src/pages/gyms/page.tsx:8-27` |
| Gyms | "Add Gym" uses browser `prompt()` | `src/pages/gyms/page.tsx:32-48` |
| Settings | Security/notification toggles are non-functional | `src/pages/settings/page.tsx:195-221` |
| Signup | Unverified compliance badges in footer | `src/pages/auth/signup/page.tsx:274-278` |
| Attendance | "Secure biometric sync enabled" — no implementation | `src/pages/attendance/page.tsx:195` |
| Login | Google OAuth button only logs to console | `src/pages/auth/login/page.tsx:152` |

---

## 18. LOADING, EMPTY, ERROR AND RECOVERY STATES

### 18.1 Mandatory State Definitions

Every asynchronous screen or component MUST define and visually represent:

1. **Initial loading** — Skeleton or spinner on first data fetch.
2. **Background refresh** — Subtle indicator when data refreshes without blocking interaction.
3. **Empty data** — "No [items] yet" with action to create first item.
4. **Filtered empty** — "No [items] match your filters" with clear-filters action.
5. **Permission denied** — "You don't have access to this [resource]" — no sensitive details leaked.
6. **Authentication expired** — Redirect to login with session-expired message and preserved return URL.
7. **Tenant context missing** — "Organisation context not found" with resolution guidance.
8. **Location unavailable** — "Location not available" with selector to choose another.
9. **Validation failure** — Field-level errors mapped from server response; preserved form data.
10. **Network timeout** — "Request timed out" with retry action.
11. **Rate limit** — "Too many requests. Please wait [X] seconds."
12. **Temporary backend failure** — "Something went wrong. Please try again." with retry action.
13. **Partial success** — Clear indication of what succeeded and what failed.
14. **Retry capability** — User-initiated or automatic retry with visual feedback.
15. **Recovery path** — Clear next steps when automatic recovery is not possible.
16. **Irreversible failure** — "This operation cannot be completed. [Reason.] Please contact support."

### 18.2 Loading Rules

- A loading state MUST NOT be displayed indefinitely when the real state is an error or empty result.
- A loading state MUST transition to the appropriate error, empty or success state within a reasonable timeout.
- Skeleton loading is preferred over spinners for page-level loading.
- Spinners are appropriate for button-level and inline-loading contexts.

### 18.3 CURRENT-STATE EVIDENCE

- The router fallback component uses a spinner with "Initializing Registry Experience" text that persists until lazy-loaded page chunks resolve.
- Members page (`src/pages/members/page.tsx`) has loading, error and empty states.
- Subscriptions page has loading, error and empty states.
- Dashboard mixes real loading indicators with hardcoded data that never transitions.
- Attendance, Billing, Reports, Gyms pages have no loading states — they render mock data immediately.
- Platform Billing features (`PlanBillingPage`, `BillingRecoveryPage`) have well-structured loading, error and unavailable state components.

---

## 19. FORMS AND DATA INTEGRITY

### 19.1 Form Standards

All user-facing forms MUST:

1. Use correct semantic field names that match the backend contract or an explicitly documented mapping.
2. Associate every `<label>` with its control via `htmlFor`/`id` or wrapping.
3. Display inline validation errors adjacent to the relevant field.
4. Map server-side validation errors to the correct form fields.
5. Preserve entered data after recoverable failures — do not clear the form on error.
6. Handle date values in the user's local timezone. `toISOString()` MUST NOT be used for local-date defaults without explicit UTC offset awareness.
7. Support locale-aware phone and postal/address validation.
8. Handle minors and guardians with appropriate field sets (future capability).
9. Require explicit confirmation for destructive actions (see Section 21).
10. Support idempotent submission where the operation is critical — prevent duplicate creation.
11. Prevent duplicate submissions during processing (disable submit button, show loading state).
12. Protect against accidental navigation away from forms with unsaved changes.
13. Use no misleading field labels — the label MUST accurately describe the expected input.

### 19.2 Date and Timezone Handling

- **Local-date defaults:** When a date input defaults to "today", the value MUST represent today in the user's local timezone, not UTC.
- **PROHIBITED PATTERN:** `new Date().toISOString().split('T')[0]` — `toISOString()` returns the UTC date. In positive-offset zones (e.g., India UTC+5:30), this can produce the previous calendar date during early local morning before the UTC day begins. In negative-offset zones, it can produce the next UTC date during late local evening.
- **REQUIRED PATTERN:** Use locale-aware date formatting or manually construct `YYYY-MM-DD` from local date parts.
- **CURRENT-STATE EVIDENCE:** Five source files use `toISOString().split('T')[0]` (or equivalent `slice(0,10)`) for date defaults: `src/pages/dashboard/page.tsx:8-9`, `src/pages/subscriptions/page.tsx:38,101,109` (slice variant), `src/components/settings/BranchOperatingHoursSection.tsx:74,193`, `src/components/settings/OperatingHoursDayRow.tsx:28,39,54,65,94`, `src/components/settings/MembershipPlanForm.tsx:64-65`.

### 19.2-A Temporal Concepts

The following temporal concepts MUST be treated as distinct:

| Concept | Definition | Example |
|---|---|---|
| **UTC instant** | A point in time on the UTC timeline | `2026-07-15T13:00:00.000Z` |
| **Date-only calendar value** | A calendar date without time or timezone, used for date-of-birth, validity dates, etc. | `2026-07-15` |
| **Local wall-clock time** | A time of day without date or timezone context | `09:00` |
| **Organisation IANA timezone** | The primary timezone configured for the organisation | `Asia/Kolkata` |
| **Recurring operating hours** | A repeating pattern of open/close times for a day of the week | "Mon-Fri 09:00–17:00" |
| **Zoned session occurrence** | A date-time pair in a known timezone representing a scheduled session | "2026-07-15 09:00 Asia/Kolkata" |
| **Overnight interval** | A time range where the close time falls before or equal to the open time (cross-midnight) | "22:00–02:00" |

A date-only calendar value MUST NOT be required to carry a timezone. Operations comparing date-only values MUST NOT convert them to UTC instants without explicit timezone context.

### 19.3 Data Integrity in Forms

- Form data MUST NOT be unexpectedly discarded during navigation, session refresh or recoverable errors.
- Draft preservation SHOULD be implemented for critical forms (long forms, onboarding, membership plan creation).
- Date/time values MUST be stored and transmitted with explicit timezone information.
- Currency amounts MUST be transmitted as integers in the smallest unit (e.g., paise for INR) or with explicit decimal precision.

### 19.4 Emergency Contact Issue

**CURRENT-STATE EVIDENCE:** `src/pages/members/page.tsx:775-781`

The member creation/edit form has mislabelled emergency-contact fields:
- Field labelled "Emergency Contact No. 1" maps to `emergency_contact_name` but is validated as a 10-digit Indian phone number.
- Field labelled "Emergency Contact No. 2" maps to `emergency_contact_phone` and is validated as a phone number only if non-empty.
- There is no actual "emergency contact name" field stored — both fields are treated as phone numbers.

**Required correction:** Field labels must match their semantic purpose. Either rename the fields to match what they store, or store a proper emergency contact name alongside the phone number.

---

## 20. SECURITY-FACING UX

### 20.1 Backend-Authoritative Permissions

- All permission enforcement is backend-authoritative.
- Frontend permission checks are for presentation only (hiding UI elements, disabling controls).
- Frontend route guards and component-level permission checks MUST NOT be relied upon as the security enforcement boundary.
- Every protected operation MUST be independently authorised by the backend.

### 20.2 Fail-Closed Behaviour

- Missing, invalid or unresolved permissions MUST deny access.
- The user MUST receive a clear "permission denied" message.
- No sensitive information MUST be leaked in permission-denied responses.

### 20.3 Safe Error Messages

- Error messages MUST be helpful without exposing implementation details, stack traces or sensitive data.
- Authentication errors MUST NOT reveal whether an account exists.
- Authorisation errors MUST NOT reveal the existence of resources the user cannot access.

### 20.4 No Unverified Security Claims

The frontend MUST NOT display:
- security certifications (SOC 2, ISO, PCI) unless independently verified and explicitly approved;
- encryption strength claims unless technically verifiable;
- biometric capability claims unless implemented and functioning;
- compliance badges or trust seals without documented approval.

**CURRENT-STATE EVIDENCE:** `src/pages/auth/signup/page.tsx:274-278` displays "SECURE CLOUD", "SOC 2 CERTIFIED" and "ISO ENCRYPTED" badges without evidence of certification. `src/pages/attendance/page.tsx:195` displays "Secure biometric sync enabled" without any biometric implementation.

### 20.5 Session Security

- The approved authentication session architecture is a pending backend/security review decision. This section records current-state evidence and establishes requirements pending that decision.
- Bearer credentials stored in Web Storage (`localStorage`, `sessionStorage`, IndexedDB) require an explicit, approved security exception with a documented threat model.
- **CURRENT-STATE EVIDENCE:** Authentication tokens (both `access_token` and `refresh_token`) are persisted in `localStorage` via Zustand persist middleware (`src/features/auth/store/authStore.ts:46`, key `auth-storage`). Tokens are read from localStorage for API requests (`src/shared/services/api/client.ts:46`). This pattern is documented as a finding pending the approved session architecture.
- Client logout SHOULD attempt backend session/credential invalidation and clear local state safely — in that order.
- **CURRENT-STATE EVIDENCE:** `src/components/layout/Sidebar.tsx:63-73` clears local state but does NOT call `authApi.logout()`. The server-side refresh token may remain valid until expiry.
- Session return URLs (post-login redirects) MUST be validated as internal application paths; open redirects are prohibited.
- `.env` files containing secrets MUST be listed in `.gitignore`.
- **CURRENT-STATE EVIDENCE:** `.env` is tracked in Git and not listed in `.gitignore`.

### 20.6 Sensitive Data Display

- Sensitive member data (contact details, emergency contacts, financial information) MUST be masked or access-controlled as appropriate.
- Full credit-card numbers MUST never be displayed.
- Authentication tokens MUST never be displayed in the UI, logged to console, or exposed in error messages.

### 20.7 Environment-File Hygiene

- Client-exposed `VITE_*` values are public after bundling. Secrets MUST never be placed in client environment variables.
- `.env` and `.env.*` files containing local overrides or secrets MUST be listed in `.gitignore`.
- Local override files (`.env.local`, `.env.development.local`), backup files and IDE-generated copies MUST be ignored.
- A tracked `.env.example` MAY contain variable names and safe placeholder values (e.g., `VITE_API_BASE_URL=http://localhost:8000`). The `.gitignore` MUST NOT accidentally exclude the safe example file.
- Production environment values MUST never be hardcoded or committed.
- The current tracked `.env` file is a security-hygiene finding unless secret exposure is verified. Regardless of the current value, its presence in the repository index is an unsafe pattern.
- Phase 0B MUST address: (a) ignore-policy correction — add appropriate patterns to `.gitignore`; (b) tracking removal — remove `.env` from the Git index if appropriate; (c) safe history review — verify no credentials were ever committed; (d) credential rotation if exposure is confirmed.
- The environment values were intentionally not inspected or reproduced in this document.

**CURRENT-STATE EVIDENCE:**
- `.gitignore` does NOT include `.env` or `.env*` patterns.
- `.env` is tracked by Git (`git ls-files .env` confirms it is in the index).
- The current `.env` content was intentionally not read for this correction. Whether the value is sensitive or not, the tracked-`.env` pattern is unsafe.

---

## 21. DESTRUCTIVE ACTIONS

### 21.1 Requirements

Every destructive action MUST meet ALL of the following:

1. **Clear object identification.** The confirmation MUST name the specific object(s) being affected.
2. **Clear impact.** The consequences MUST be stated in plain language.
3. **Backend-authoritative permission.** The backend MUST independently verify that the user is authorised.
4. **Confirmation appropriate to risk.** Simple deletion of a single record may use a confirmation dialog. Organisation closure or bulk deletion requires typed confirmation or elevated reauthentication.
5. **Typed confirmation for irreversible operations.** The user MUST type the object name or a confirmation phrase where the impact is severe.
6. **Reason capture where required.** Decommissioning, account closure or bulk operations SHOULD capture a reason.
7. **Reauthentication where required.** High-risk operations (organisation closure, owner transfer, billing cancellation) SHOULD require recent reauthentication.
8. **Pending and final states.** The UI MUST show when a destructive action is in progress and when it has completed.
9. **No promises without backend guarantees.** The UI MUST NOT promise "all data will be deleted", "an email will be sent" or "this cannot be undone" unless the backend provides those guarantees.
10. **No native dialogs.** `alert()`, `prompt()` and `window.confirm()` MUST NOT be used for production destructive-action confirmations.

### 21.2 CURRENT-STATE EVIDENCE — Violations

- Gyms page uses browser `prompt()` for adding gyms (`src/pages/gyms/page.tsx:32-48`).
- Reports page uses `alert()` for "Generate Report" and "Export" actions (`src/pages/reports/page.tsx:19`).
- Billing page uses `alert()` for "Export CSV" (`src/pages/billing/page.tsx:22`).
- Settings page "Delete Gym" button uses `alert()` (`src/pages/settings/page.tsx:172`).
- Branch management decommission warning text mentions cancelling "all future member bookings" — a booking system that does not exist (`src/components/settings/BranchManagementSection.tsx`).

---

## 22. DASHBOARD AND REPORTING

### 22.1 Requirements

The dashboard and all reporting interfaces MUST:

1. Display only authoritative data — data sourced from a verified backend API, not mock, hardcoded or random values.
2. Clearly show the organisation and location scope of the displayed data.
3. Show the date range applicable to the displayed data.
4. Provide comparison-period clarity (e.g., "vs. previous month" with both values shown).
5. Provide accessible chart alternatives (data tables, text summaries).
6. Offer actionable insights — drill-down destinations that lead to the referenced data.
7. Avoid decorative metrics — every displayed metric MUST have a clear business meaning.
8. Never mix Platform Billing concepts with Facility Member Commerce concepts in the same visual area without clear separation.
9. Handle empty, error and stale data states explicitly.

### 22.2 CURRENT-STATE EVIDENCE

The current dashboard (`src/pages/dashboard/page.tsx`) fails several of these requirements:
- Revenue bar chart uses random data.
- Multiple hardcoded metric values.
- Decorative "Operational Insights" section with fake statuses.
- Non-functional "Generate Report" button.
- Platform billing status and facility commerce metrics appear in the same view without clear separation.

### 22.3 Reporting

- Reports MUST be generated from authoritative backend data.
- Report parameters (date range, location, filters) MUST be clearly displayed.
- Report loading MUST show progress for long-running generation.
- Large, sensitive, auditable or asynchronous reports SHOULD use backend generation with secure download URLs.
- Export of already-authorised loaded data MAY be client-side when the data volume is manageable, the export is safe to execute in the browser, and the data has already passed backend authorisation.
- CSV exports MUST mitigate spreadsheet-formula injection (prefix values starting with `=`, `+`, `-`, `@` with a tab or single quote) and MUST preserve tenant, location, filter and date scope.
- No report SHOULD be displayed without a clear data source, scope and generation timestamp.

---

## 23. INTERNATIONALIZATION, LOCALE AND TIME

### 23.1 Future-Safe Requirements

Even if the first operating market is India, the following requirements apply:

1. **Local dates.** Date display and input MUST respect the user's locale. Default date values MUST NOT use UTC-derived local-date conversions.
2. **Timezones.** Time entries (operating hours, class schedules) MUST be stored with timezone awareness. All display MUST be in the organisation's configured timezone.
3. **Currencies.** Currency display MUST respect locale conventions (symbol placement, grouping separators, decimal separators). Multiple currency support with formatting per currency code.
4. **Phone formats.** Phone validation MUST be locale-aware. Indian phone numbers follow a specific pattern; international numbers require different validation.
5. **Postal codes.** Postal/pin code validation MUST be locale-aware.
6. **Tax terminology.** Tax labels (GST, VAT, Sales Tax) MUST be configurable by organisation locale. Current GST-specific language in settings MUST be generalised.
7. **Number formatting.** Large numbers MUST use locale-appropriate grouping separators.
8. **Language expansion.** The architecture MUST NOT prevent future addition of translated UI strings. This does not require an immediate i18n framework, but hardcoded English strings MUST be structured to allow extraction.

### 23.2 UTC Date Bug

**CONFIRMED FINDING:** Five source files use `new Date().toISOString().split('T')[0]` (or equivalent `slice(0,10)`) as a "today" default. `toISOString()` returns the UTC date: in positive-offset zones such as India (UTC+5:30), it can produce the previous calendar date during early local morning before the UTC day begins; in negative-offset zones, it can produce the next UTC date during late local evening. All such usages MUST be replaced with locale-aware local-date construction.

---

## 24. PERFORMANCE

### 24.1 Frontend Performance Principles

1. **Initial JavaScript bundle** SHOULD be minimised through route-based code splitting (already partially implemented with `React.lazy`).
2. **Route chunks** SHOULD be loaded on demand. Above-the-fold content SHOULD NOT be blocked by below-the-fold chunk loading.
3. **Fonts** MUST be loaded efficiently with `font-display: swap` and preconnect hints. The current Google Fonts import SHOULD be self-hosted or optimised.
4. **Images** MUST be appropriately sized, compressed and served in modern formats. Logo and cover images MUST have size limits enforced in the upload UI.
5. **API request duplication** MUST be avoided. React Query deduplication is configured; verify it is effective.
6. **Unnecessary rerenders** SHOULD be minimised. Zustand selectors SHOULD be granular.
7. **Large lists** MUST use pagination or virtualisation. Current member and subscription lists fetch fixed page sizes without pagination controls — this is a P1 issue.
8. **Pagination** MUST be implemented for all potentially unbounded collections. Hardcoded `page: 1, limit: 50` without navigation controls is unacceptable.
9. **Caching** MUST use appropriate stale times and cache invalidation strategies.
10. **Loading priority** — Critical above-the-fold content SHOULD load first. Skeleton loading is preferred over full-page spinners.
11. **Motion performance** — Animations SHOULD use `transform` and `opacity` only (GPU-composited properties).
12. **Slow network behaviour** — The application MUST remain functional on slow connections. Retry and timeout handling is required.

### 24.2 Proposed Budgets (PENDING SEPARATE OWNER APPROVAL)

These are proposed measurement targets. They are not yet release-blocking requirements. They require a separate owner decision after baseline measurements are available.

| Metric | Proposed Budget | Status |
|---|---|---|
| Initial JS bundle (gzipped) | < 200 KB | Proposed — requires baseline measurements |
| Per-route chunk (gzipped) | < 100 KB | Proposed — requires baseline measurements |
| First Contentful Paint | < 1.5s on 4G | Proposed — requires baseline measurements |
| Time to Interactive | < 3s on 4G | Proposed — requires baseline measurements |
| Largest Contentful Paint | < 2.5s on 4G | Proposed — requires baseline measurements |
| Cumulative Layout Shift | < 0.1 | Proposed — requires baseline measurements |
| Interaction to Next Paint | < 200ms | Proposed — requires baseline measurements |

---

## 25. TESTING STRATEGY

### 25.1 Required Test Categories (Later Phases)

| Category | Description | Phase |
|---|---|---|
| **Unit tests** | Individual functions, utilities, hooks | Phase 0B+ |
| **Component tests** | UI components with realistic rendering | Phase 1+ |
| **Integration tests** | Feature workflows with mocked API | Phase 3+ |
| **Contract tests** | API response schema validation | Phase 0B+ |
| **Accessibility tests** | axe-core or equivalent automated checks | Phase 1+ |
| **Keyboard tests** | Tab order, focus management verification | Phase 1+ |
| **Responsive tests** | Viewport validation at all breakpoints | Phase 1+ |
| **Visual regression** | Screenshot comparison for critical paths | Phase 3+ |
| **Dark-mode tests** | All components in both themes | Phase 1+ |
| **Multi-tenant context tests** | Organisation and location switching | Phase 3+ |
| **Error-state tests** | All defined error states per screen | Phase 0B+ |
| **Destructive-action tests** | Confirmation, idempotency, rollback | Phase 3+ |
| **Platform Billing regression tests** | All existing Platform Billing tests preserved | Phase 0B+ |
| **End-to-end tests** | Critical workflows end-to-end | Phase 6+ |

### 25.2 CURRENT-STATE EVIDENCE

- 80 tests pass across 6 test files — all in `src/features/platformBilling/__tests__/`.
- Zero tests exist for: auth, members, subscriptions, dashboard, settings, attendance, onboarding, billing, reports, gyms, staff, trial, shared UI components, API client, auth store, branch store.
- Test infrastructure exists: Vitest, React Testing Library, MSW, jsdom, custom `renderWithProviders`.
- A successful build alone is not sufficient evidence of quality. Tests MUST cover the complete frontend.

### 25.3 Testing Principles

- Tests MUST cover negative and failure paths, not merely happy paths.
- Flaky tests MUST be investigated and fixed. Repeated reruns until passing is not acceptable.
- Test files MUST be co-located with their feature modules or in a `__tests__/` directory.
- Test utilities (renderWithProviders, MSW handlers) MUST be maintained and extended for new features.

---

## 26. RELEASE GATES

### 26.1 Mandatory Gates

Before any frontend phase can be accepted, ALL of the following MUST be satisfied:

1. Only authorised files changed (verified via `git diff`).
2. Clean TypeScript type check (`tsc -b` passes with zero errors).
3. Clean lint (`eslint .` passes with zero errors and zero warnings where configured).
4. All required tests pass for the affected features.
5. Production build succeeds without errors or warnings where configured.
6. No unexpected generated files in the source tree (e.g., `.d.ts` files in `src/` from `emitDeclarationOnly`).
7. Clean diff check — no unintended file changes.
8. Responsive verification at all supported breakpoints.
9. Keyboard navigation verification — all interactive elements reachable and operable.
10. Accessibility verification — automated checks pass; manual checks for dialogs, forms and navigation.
11. Light and dark theme verification — all components render correctly in both themes.
12. Loading, error and empty state verification for all affected screens.
13. Security-boundary verification — no fabricated data, no unverified claims, no exposed tokens or secrets.
14. No fabricated data in production-facing pages.
15. No unverified security, compliance or capability claims.
16. All current-state findings addressed or explicitly deferred with owner approval.
17. Owner review and approval obtained.

### 26.2 CURRENT-STATE EVIDENCE — Gate Status

| Gate | Current Status | Notes |
|---|---|---|
| Type check | Not verified in this phase | Build passes per `package.json:8` (`tsc -b && vite build`) |
| Lint | FAILS — 38 errors | Errors span `.d.ts`, `.ts` and `.tsx` files including explicit `any`, empty object types, React hook/immutability issues, synchronous state updates from effects and `Math.random()` during render; build passes despite lint failure |
| Tests | 80/80 pass | Platform Billing only; 0 tests for rest of frontend |
| Production build | Not verified in this phase | Build may generate `.d.ts` files into `src/` |
| Generated files | Polluted — 58 `.d.ts` files in `src/` | `emitDeclarationOnly: true` without `declarationDir` |

---

## 27. COMPATIBILITY AND MIGRATION STRATEGY

### 27.1 Staged Approach

The frontend migration from current state to target state MUST follow this sequence:

1. **Establish canonical concepts** — Define the canonical domain model as specified in Section 5.
2. **Centralize vocabulary** — Build the vocabulary adaptation module that maps facility profiles to terminology sets.
3. **Update user-facing navigation and labels** — Replace hardcoded strings with vocabulary module lookups. Navigation items, page headers, form labels, empty states and error messages MUST use configured terminology.
4. **Provide route aliases or redirects** — Existing routes (`/gyms`, `/members`, `/subscriptions`) MUST continue to work during migration. New canonical routes (`/locations`, `/people`, `/enrollments`) MAY be added alongside them. Redirects from old to new routes are preferred.
5. **Introduce frontend adapters around legacy backend names** — The frontend MUST create an adapter layer that maps internal canonical concepts to backend API names (`/gyms`, `Gym` types) without changing the backend contracts.
6. **Coordinate backend contract migrations separately** — Route renaming, type renaming and API versioning MUST be coordinated with the backend team in a separate, approved phase.
7. **Remove legacy names only after compatibility evidence** — Old routes, types and labels MUST NOT be removed until the new equivalents are verified working and the backend has completed its migration.
8. **Never perform a blind global rename of `gym`** — A global find-and-replace of `gym` → `location` or similar would break API calls, type compatibility, store keys and backend integration. Every change MUST be individually verified.

### 27.2 Compatibility Rules

- Existing API endpoints (`/gyms`, `/branches`, `/members`, `/subscriptions`) MUST continue to function.
- Existing Zustand store keys (`auth-storage`, `branch-storage`) MUST be preserved or migrated with backward compatibility.
- Existing localStorage keys (`doers-theme`) MUST be preserved or migrated.
- Feature flags MUST be preserved and extended, not removed without deprecation notice.
- Route changes MUST include redirects from old paths.

---

## 28. PHASE ROADMAP

The following phases are recommended for the Doers Frontend UI Improvement Program. Each phase is independent and requires separate owner approval before execution.

### Phase 0B — Baseline Integrity and Trust Blockers

**Objective:** Fix P0 trust and integrity findings — remove fabricated data, unverified claims and security-facing issues. Add `.env` to `.gitignore`. Fix UTC date bug. Apply truthful-outcome treatment to mock/demo pages. **Phase 0B fixes current trust/integrity blockers, not every future product gap.**

**Prerequisites:** Phase 0A owner approval.

**Allowed scope:** Remove hardcoded/mock/random data from production pages. Remove or replace unverified compliance/security/branding claims. Fix `.gitignore` — add `.env` and local-override patterns (`.env.local`, `.env.development.local`); ensure a sanitised `.env.example` remains trackable; review tracking removal, safe history review and credential rotation if exposure is confirmed. Fix `toISOString()` date bugs. Apply one of the four truthful outcomes (hide, gate, show unavailable state, or separate demo environment) for each mock/demo page. Remove or gate non-functional Google sign-in and password-recovery controls. Remove fake biometric, sensor, compliance and operational-health claims. For native browser dialogs (`alert()`, `prompt()`, `window.confirm()`): Phase 0B may remove, hide or truthfully gate the actions that currently depend on them. Standardised accessible Dialog and confirmation components belong to Phase 1 (design system); Phase 0B MUST NOT silently depend on unfinished Phase 1 work. Decommission non-functional demo settings switches.

**Exclusions:** No new features. No design-system changes. No navigation changes. No backend changes. No Platform Billing changes. Missing programs, sessions, bookings and waitlists are P1 product gaps — they are NOT Phase 0B implementation work.

**Principal risks:** Removing mock data may reveal empty pages that require backend to provide data. Safety: apply truthful outcomes rather than leaving confusing empty or broken pages.

**Hard-stop point:** Before any commit.

---

### Phase 1 — Unified Design System

**Objective:** Consolidate design tokens, remove duplicate components evidence-first, create missing shared components, implement standardised loading/error/empty states, establish accessibility foundations.

**Prerequisites:** Phase 0B completion.

**Allowed scope:** Verify duplicate components (`shared/components/ui/*` vs `components/ui/*`) are genuinely unused before removal; remove only proven-dead code. Consolidate token files into one authoritative file with layered token architecture (palette primitives, semantic tokens, component tokens). Remove the `glass-surface` utility — glassmorphism, frosted surfaces and backdrop blur are prohibited. Clean up legacy font loading (Inter, Playfair Display from `index.html`). Define contrast-safe semantic token pairs validated against WCAG 2.2 AA. Create missing components: Dialog, Select, Textarea, Checkbox, Switch, Toast, Alert, EmptyState, LoadingState, ErrorState, Table, Pagination. Add visible focus indicators to all interactive components (no `focus:outline-none` without visible replacement). Implement `prefers-reduced-motion` support. Fix text-size violations per Section 12.1.

**Exclusions:** No terminology changes. No navigation changes. No new features.

**Hard-stop point:** Before commit; after design-system verification.

---

### Phase 2 — Facility Profiles and Vocabulary

**Objective:** Implement centralised vocabulary module. Update all user-facing strings to use configured terminology.

**Prerequisites:** Phase 1 completion.

**Allowed scope:** Create vocabulary module. Implement vocabulary adaptation per facility profile. Update navigation labels, page headers, form labels, empty states and error messages. Add facility-type selection to organisation settings. Support neutral terminology for hybrid organisations.

**Exclusions:** No route changes. No navigation restructuring.

**Hard-stop point:** Before commit; after vocabulary audit.

---

### Phase 3 — Application Shell and Navigation

**Objective:** Restructure navigation to the target information architecture. Add missing routes with scaffold pages.

**Prerequisites:** Phase 2 completion.

**Allowed scope:** Implement target navigation model with logical groups. Add route redirects from old to new paths. Scaffold routes may exist only behind development or non-production gating. Production navigation MUST NOT expose empty scaffolds as completed capabilities. Navigation visibility MUST follow real capability availability. Implement responsive sidebar behaviour (collapsed icons, mobile drawer). Add location-context visibility improvements. Add cache invalidation on location switch.

**Exclusions:** No backend contract changes. Existing routes remain functional.

**Hard-stop point:** Before commit; after navigation and responsive verification.

---

### Phase 4 — Authentication and Onboarding

**Objective:** Improve authentication UX. Address session security findings. Improve onboarding flow.

**Prerequisites:** Phase 3 completion.

**Allowed scope:** Implement backend logout call on client logout. Review session storage architecture (requires cross-team coordination for non-localStorage solution). Add session-expiry UX. Add reauthentication flows. Improve onboarding copy and flow. Add proper facility-type-appropriate onboarding labels.

**Exclusions:** Backend auth changes require separate backend phase.

**Hard-stop point:** Before commit; after security review.

---

### Phase 5 — People, Guardians and Team

**Objective:** Complete the People domain with member management, guardian support and team management.

**Prerequisites:** Phase 4 completion. **Also requires approved backend domain models, API contracts, authorisation/tenant rules, error contracts and test fixtures for the People domain.**

**Allowed scope:** Fix emergency-contact field labels and semantics. Implement proper pagination for member lists. Add guardian/minor fields and workflows. Implement Team (staff) management with CRUD, roles and location assignments. Standardise People terminology per facility profile.

**Exclusions:** No schedule or booking features.

**Hard-stop point:** Before commit; after data-model and accessibility review.

---

### Phase 6 — Programmes, Classes and Scheduling

**Objective:** Implement the programme catalogue, class scheduling, booking and waitlist domains.

**Prerequisites:** Phase 5 completion. **Also requires approved backend domain models, API contracts, authorisation/tenant rules, error contracts and test fixtures for the scheduling, booking and waitlist domains. Capacity, booking and waitlist flows require explicit concurrency, idempotency and integrity rules before frontend implementation can begin.**

**Allowed scope:** Create programme/class-type management. Implement class schedule with calendar view. Implement booking with capacity enforcement. Implement waitlist with automatic promotion. Implement instructor assignment. Implement room/resource booking.

**Exclusions:** No payment or enrollment changes (see Phase 7).

**Hard-stop point:** Before commit; after scheduling logic and capacity testing.

---

### Phase 7 — Plans, Enrollments and Facility Member Commerce

**Objective:** Complete the Facility Member Commerce domain with plan catalogue, enrollment workflows and payment processing.

**Prerequisites:** Phase 6 completion. **Also requires approved backend domain models, API contracts, authorisation/tenant rules, error contracts and test fixtures for the facility member commerce domain. Financial flows require explicit concurrency, idempotency and integrity rules. Facility Member Commerce remains strictly separate from protected Platform Billing.**

**Allowed scope:** Build plan catalogue with facility-profile-appropriate plan types (memberships, class packs, passes, drop-ins). Implement enrollment workflows. Connect payments to real backend. Implement invoicing. Implement collections/dunning. Ensure strict separation from Platform Billing.

**Exclusions:** No Platform Billing changes.

**Hard-stop point:** Before commit; after financial-integrity and separation verification.

---

### Phase 8 — Truthful Dashboard and Reports

**Objective:** Replace the mock dashboard and reports with authoritative, truthful data.

**Prerequisites:** Phases 5–7 completion (as data sources become available). **Also requires approved backend domain models, API contracts, authorisation/tenant rules, error contracts and test fixtures for the reporting domain.**

**Allowed scope:** Implement truthful dashboard metrics from real API data. Implement real reports with backend generation. Implement accessible chart alternatives. Implement drill-down navigation from dashboard to detail pages. Remove all remaining mock data and decorative metrics.

**Exclusions:** No new data domains — reports depend on data from earlier phases.

**Hard-stop point:** Before commit; after data-provenance verification for every displayed metric.

---

### Phase 9 — Final Quality and Release Approval

**Objective:** Complete all remaining quality gates. Achieve owner approval for release.

**Prerequisites:** All preceding phases complete.

**Allowed scope:** Accessibility audit and remediation. Performance optimisation. Visual regression baseline. Cross-browser testing. Responsive audit at all breakpoints. Dark-mode audit. Keyboard audit. Loading/error/empty state audit. Security-facing UX audit. Platform Billing regression verification. Final documentation update.

**Exclusions:** No new features.

**Hard-stop point:** Before release; requires full owner sign-off.

---

## 29. CURRENT-STATE EVIDENCE REGISTER

| ID | Severity | Finding | Evidence Path | Risk | Constitutional Requirement | Correction Phase | Verified |
|---|---|---|---|---|---|---|---|
| F-01 | P1 | Missing core feature domains: program, batch, session, booking, waitlist, resource | Entire src/ search — zero domain entities, types, routes or services for these concepts | Cannot serve class-based facilities | Capability-Driven Product Model (Section 4) | Phase 6 | CONFIRMED |
| F-02 | P0 | Unverified security/compliance claims in UI: "SOC 2 CERTIFIED", "ISO ENCRYPTED", "SECURE CLOUD" | `src/pages/auth/signup/page.tsx:274-278` | Legal liability, false advertising | Security-Facing UX (Section 20.4) | Phase 0B | CONFIRMED |
| F-03 | P0 | `.env` tracked in Git; `.gitignore` does not list `.env` | `.gitignore` missing `.env` pattern; `git ls-files .env` confirms tracked | Credential exposure risk | Security-Facing UX (Section 20.7) | Phase 0B | CONFIRMED |
| F-04 | P1 | Sidebar and routes expose "Gyms" and `/gyms` as primary navigation | `src/components/layout/Sidebar.tsx:18`, `src/app/router/index.tsx:189` | Brand inconsistency for non-gym facilities | Controlled Vocabulary (Section 6), Target IA (Section 7) | Phase 2, 3 | CONFIRMED |
| F-05 | P1 | Internal structures use `features/gym` directory and `Gym` type name | `src/features/gym/`, `src/features/gym/types/index.ts` | Naming debt, code readability | Compatibility & Migration (Section 27) | Phase 5 (adapters) | CONFIRMED |
| F-06 | P1 | Dashboard mixes real API data with hardcoded and random values | `src/pages/dashboard/page.tsx:110-170,207,285-286` | Misleading operational data | Truthful UI (Section 17) | Phase 0B truthful outcome; Phase 8 real implementation | CONFIRMED |
| F-07 | P1 | Attendance page uses entirely mock data (`MOCK_CHECKINS`, random heatmap) | `src/pages/attendance/page.tsx:7-18,34` | Non-functional page in production | Truthful UI (Section 17) | Phase 0B truthful outcome; Phase 6 real implementation | CONFIRMED |
| F-08 | P1 | Billing/payments page uses entirely mock data (`MOCK_PAYMENTS`) | `src/pages/billing/page.tsx:8-15` | Non-functional page in production | Truthful UI (Section 17) | Phase 0B truthful outcome; Phase 7 real implementation | CONFIRMED |
| F-09 | P1 | Reports page is entirely demo content (hardcoded SVG, alert() buttons) | `src/pages/reports/page.tsx` | Non-functional page in production | Truthful UI (Section 17) | Phase 0B truthful outcome; Phase 8 real implementation | CONFIRMED |
| F-10 | P1 | Gyms page is entirely mock data (MOCK_GYMS, prompt() for actions) | `src/pages/gyms/page.tsx:8-27,32-48` | Non-functional page in production | Truthful UI (Section 17), Destructive Actions (Section 21) | Phase 0B truthful outcome; Phase 3 may redirect or reuse existing real location capability only if supported; otherwise remains truthfully unavailable | CONFIRMED |
| F-11 | P1 | Staff page and feature are completely empty; staff not routed | `src/pages/staff/page.tsx` (0 bytes), `src/features/staff/index.ts` (0 bytes) | Dead code, missing feature | Target IA (Section 7) | Phase 5 | CONFIRMED |
| F-12 | P1 | Emergency-contact field labels swapped: "No. 1" maps to name field but validated as phone | `src/pages/members/page.tsx:775-781,314-316` | Data integrity, user confusion | Forms & Data Integrity (Section 19.4) | Phase 5 | CONFIRMED |
| F-13 | P1 | Member and subscription lists fetch hardcoded `page: 1, limit: 50` (or `limit: 200`) without pagination navigation controls — cannot view records beyond the first page | `src/pages/members/page.tsx:259-260`, `src/pages/subscriptions/page.tsx:201,206,212` | Cannot view >50 members or >200 subscriptions | Performance (Section 24.1.8) | Phase 5 | CONFIRMED |
| F-42 | — | Merged into F-13 | | | | | |
| F-14 | P1 | UTC date bug: `toISOString().split('T')[0]` used for local-date defaults | 5 files confirmed: `dashboard/page.tsx`, `subscriptions/page.tsx` (slice variant), `BranchOperatingHoursSection.tsx`, `OperatingHoursDayRow.tsx`, `MembershipPlanForm.tsx` | Incorrect dates across timezones | Forms & Data Integrity (Section 19.2, 23.2) | Phase 0B | CONFIRMED |
| F-15 | P1 | Authentication tokens (access_token + refresh_token) persisted in localStorage | `src/features/auth/store/authStore.ts:46`, `src/shared/services/api/client.ts:46` | XSS token theft | Security-Facing UX (Section 20.5) | Phase 4 or security phase | CONFIRMED |
| F-16 | P1 | Client logout does not call `authApi.logout()` — backend session not invalidated | `src/components/layout/Sidebar.tsx:63-73` | Orphaned server sessions | Security-Facing UX (Section 20.5) | Phase 4 | CONFIRMED |
| F-17 | P2 | Facility signup copy bias: labels say "Studio", "Gym" — not facility-agnostic | `src/pages/auth/signup/page.tsx:112,150`, `src/pages/auth/login/page.tsx:71` | User confusion for non-gym/studio facilities | Controlled Vocabulary (Section 6) | Phase 2 | CONFIRMED |
| F-18 | P2 | Duplicate component implementations: Button, Input, Card in `shared/components/ui/` vs `components/ui/` | `src/shared/components/ui/` vs `src/components/ui/` | Dead code, design inconsistency | Design-System Governance (Section 11) | Phase 1 | CONFIRMED |
| F-19 | P2 | Duplicate token files and theme providers | `src/tokens.css` vs `src/styles/tokens.css`; `src/components/providers/ThemeProvider.tsx` vs `src/shared/context/ThemeContext.tsx` | Token conflicts, theme inconsistency | Design-System Governance (Section 11) | Phase 1 | CONFIRMED |
| F-20 | P2 | Meaningful text frequently uses 8px–11px sizing (100+ instances) | Multiple files — `metadata-label` class, form labels, sidebar text | Accessibility, readability | Typography (Section 12.1) | Phase 1 | CONFIRMED |
| F-21 | P2 | Focus outlines removed without visible replacements (Button, toggles, ThemeToggle) | `src/components/ui/Button.tsx:65`, `src/pages/settings/page.tsx:37` | Keyboard accessibility | Accessibility (Section 14.3) | Phase 1 | CONFIRMED |
| F-22 | P2 | Form dialogs lack proper dialog semantics, focus trapping and Escape handling | `src/pages/members/page.tsx:645-823`, `src/pages/subscriptions/page.tsx:538-640` | Accessibility, UX | Accessibility (Section 14.6) | Phase 1 | CONFIRMED |
| F-23 | P2 | Settings exposes demonstration-only security/notification toggles | `src/pages/settings/page.tsx:195-221` | Misleading feature existence | Truthful UI (Section 17.1) | Phase 0B | CONFIRMED |
| F-24 | P2 | No reduced-motion support; animations ignore `prefers-reduced-motion`; zero references to `prefers-reduced-motion` in entire codebase | CSS animations, Tailwind config, router spinner, entire src/ search | Accessibility violation | Accessibility (Section 14.10, 14.12-D) | Phase 1 | CONFIRMED |
| F-41 | — | Merged into F-24 | | | | | |
| F-25 | P2 | Overnight operating hours unsupported — validation rejects cross-midnight ranges | `src/components/settings/BranchOperatingHoursSection.tsx:112-113,158-159` | Cannot configure overnight businesses | — | Phase 3 or 6 | CONFIRMED |
| F-26 | P2 | Branch decommission warning references "bookings" — booking system does not exist | `src/components/settings/BranchManagementSection.tsx` | Misleading warning text | Truthful UI, Destructive Actions (Section 17.1, 21) | Phase 0B (fix wording) | CONFIRMED |
| F-27 | P2 | TypeScript build emits `.d.ts` files into source tree (58 files) | `tsconfig.app.json:15` (`emitDeclarationOnly: true` without `declarationDir`) | Source tree pollution, build inconsistency | Release Gates (Section 26.2) | Phase 0B or 1 | CONFIRMED |
| F-43 | — | Merged into F-27 | | | | | |
| F-28 | P2 | Tests exist only for Platform Billing (80 tests); zero tests for rest of frontend | `src/features/platformBilling/__tests__/` — only test directory | Large untested surface | Testing Strategy (Section 25) | Phases 0B+ | CONFIRMED |
| F-29 | P3 | Lint fails (38 errors) but build passes — lint not a pre-build step | `package.json:8-9` — `build` does not include `lint`; errors span `.d.ts`, `.ts` and `.tsx` files including explicit `any`, empty object types, React hook/immutability issues, synchronous state updates from effects and `Math.random()` during render | Unchecked code quality | Release Gates (Section 26) | Phase 0B | CONFIRMED |
| F-30 | P3 | Mobile header controls may overflow at 320px–360px | `src/components/layout/AppShell.tsx:62-115` — 5 elements in fixed header; source inspection confirms overflow risk but actual rendered viewport testing was not performed | UI breakage on small screens | Responsive Behaviour (Section 15.3) | Phase 3 | PARTIALLY CONFIRMED |
| F-31 | P2 | Duplicate legacy font loading: Inter and Playfair Display loaded from `index.html` in addition to intended Cormorant Garamond, Instrument Sans, Geist Mono from `src/index.css` | `index.html:9`, `src/index.css:2` | Font loading overhead, visual inconsistency | Typography (Section 9.3) | Phase 1 | CONFIRMED |
| F-32 | P1 | Six normal-text contrast failures among the evaluated pairs — current palette values fail WCAG 2.2 AA normal-text (4.5:1) requirements | See Section 13.4 for verified ratios | Inaccessible interface | Colour and Contrast (Section 13) | Phase 1 | CONFIRMED |
| F-33 | P2 | No route-level 404 handling or error boundaries; router fallback displays decorative text | `src/app/router/index.tsx:31-46` | Blank or confusing screens on failure | Loading/Error States (Section 18) | Phase 0B | CONFIRMED |
| F-34 | P2 | Non-functional Google OAuth sign-in button logs to console; password recovery link uses `href="#"` with no connected flow | `src/pages/auth/login/page.tsx:89-96` (password recovery), `src/pages/auth/login/page.tsx:146-160` (Google OAuth — `onClick={() => console.log('Social sign in')}`) | Non-functional controls in production | Truthful UI (Section 17) | Phase 0B | CONFIRMED |
| F-35 | P2 | Native browser dialogs (`alert`, `prompt`, `window.confirm`) used in multiple production pages | `gyms/page.tsx:33-35`, `reports/page.tsx:19`, `billing/page.tsx:22`, `settings/page.tsx:172`, `members/page.tsx:367-368`, `MembershipPlanCard.tsx:89,100`, `BranchContactsSection.tsx:174,180,190` | Production UX degradation | Destructive Actions (Section 21) | Phase 0B | CONFIRMED |
| F-36 | P2 | Multiple `<main>` landmarks across AppShell and settings page; risk of nested main landmarks | `src/components/layout/AppShell.tsx:118`, `src/pages/settings/page.tsx:92` | Landmark confusion for assistive technology | Accessibility (Section 14.4) | Phase 1 | CONFIRMED |
| F-37 | P2 | Form label/error association gaps: member and subscription dialogs lack `aria-describedby` for errors | `src/pages/members/page.tsx`, `src/pages/subscriptions/page.tsx` | Error messages not announced to screen readers | Accessibility (Section 14.5) | Phase 1 | CONFIRMED |
| F-38 | P2 | Toggle switches in settings page use a `<button>` element but lack appropriate switch semantics (`role="switch"` and `aria-checked`) | `src/pages/settings/page.tsx:32-49,195-221` — `renderToggleSwitch` renders a `<button>` without ARIA switch attributes | Switch state invisible to assistive technology | Accessibility (Section 14.12-B) | Phase 1 | CONFIRMED |
| F-39 | P2 | Chart alternatives (data tables, accessible summaries) absent from dashboard and reports | `src/pages/dashboard/page.tsx`, `src/pages/reports/page.tsx` | Chart data inaccessible | Accessibility (Section 14.11) | Phase 8 | CONFIRMED |
| F-40 | P2 | Hardcoded minimum age (3) in member form without configurable organisation policy | `src/pages/members/page.tsx:310-312` — `if (age < 3) return 'Member must be at least 3 years old.'` | Inflexible age policy; value 3 is reasonable for guardian/minor scenarios but is hardcoded rather than organisation-configurable | Forms & Data Integrity (Section 19) | Phase 5 | CONFIRMED |
| F-44 | P1 | Fake operational-health statuses ("Healthy", "Stable", "Initializing"), biometric claims and sensor claims in production (compliance-badge overlap already covered by F-02) | `dashboard/page.tsx:279-312`, `attendance/page.tsx:195`, `gyms/page.tsx:88`, `reports/page.tsx:103` | Misleading operational and security posture | Truthful UI (Section 17) | Phase 0B | CONFIRMED |


---

## 30. DECISIONS, OPEN QUESTIONS AND ASSUMPTIONS

### 30.1 Enterprise Draft References — Currently Non-Binding

The following constraints are proposed by the related Enterprise Quality Constitution (v0.2-draft, a cross-repository-validated draft that is not yet approved and not independently binding). Requirements already stated directly in this approved Product Constitution are binding because this Product Constitution includes them — not because the Enterprise draft contains similar language. Enterprise-only proposals remain non-binding until separately approved and adopted.

1. Multi-facility product scope (Enterprise Constitution Section 3).
2. Tenant isolation architecture (Enterprise Constitution Section 9).
3. Platform Billing and Facility Member Commerce separation (Enterprise Constitution Section 16).
4. WCAG 2.2 AA accessibility target (Enterprise Constitution Section 19).
5. `localStorage` credential storage prohibition (Enterprise Constitution Section 6.3).
6. Frontend permission checks are presentation-only (Enterprise Constitution Section 8).
7. Production mock data prohibition (Enterprise Constitution Section 14.13).

### 30.2 Approved Product Constitution Decisions

| ID | Decision | Rationale | Status |
|---|---|---|---|
| D-01 | Adopt the canonical domain concepts defined in Section 5 | Provides a neutral, capability-driven vocabulary | Approved |
| D-02 | Adopt the controlled vocabulary adaptation mapping in Section 6 | Enables facility-profile-appropriate terminology without product forks | Approved |
| D-03 | Adopt the target information architecture in Section 7 | Organises navigation logically and accommodates future features | Approved |
| D-04 | Adopt the phase roadmap in Section 28 | Provides a structured, gated path from current state to target state | Approved |
| D-05 | Adopt the classical premium visual direction in Section 9 | Preserves established brand identity with accessibility guardrails | Approved |
| D-06 | Adopt the plain-language writing rules in Section 10 | Eliminates decorative jargon and unverified claims | Approved |
| D-07 | Implement pagination for all unbounded collection views | Members and subscriptions currently show only page 1 | Approved |
| D-08 | Fix emergency-contact field semantics per Section 19.4 | Currently mislabelled and mis-validated | Approved |

### 30.3 Pending Product Decisions

| ID | Question | Context | Status |
|---|---|---|---|
| Q-01 | Should the word "Gym" be retained as a user-facing term for any facility profile, or should all profiles use "Location", "Facility" or profile-specific terms? | Current UI uses "Gyms" everywhere | Pending owner decision |
| Q-02 | Should the product tagline remain "Studio OS" or change to a facility-agnostic alternative? | `src/components/layout/Sidebar.tsx:106` | Pending owner decision |
| Q-03 | What is the priority order for implementing the missing core domains (programmes, classes, scheduling, bookings, waitlists)? | No implementation exists for these domains. **R1 note:** The recommended roadmap places program/scheduling/booking/waitlist in Phase 6, after People/Team (Phase 5) and after backend API contracts are approved. | Pending owner decision |
| Q-04 | Should the staff/team feature be prioritised ahead of programme/class features? | Staff feature is empty; both are needed. **R1 note:** The recommended roadmap places Team in Phase 5, before Programmes/Scheduling in Phase 6. | Pending owner decision |
| Q-05 | What is the acceptable timeline for replacing mock/demo pages with real implementations? | 4 of 12 pages are currently mock or demo. **R1 note:** Phase 0B applies truthful outcomes immediately; Phases 6–8 implement real data as backend APIs become available. | Pending owner decision |
| Q-06 | What facility types should be added to the `FacilityType` enum? | Current enum has 9 types; missing Pilates, boxing, calisthenics, personal training. **R1 note:** The recommended profiles list 14 types; the enum SHOULD be expanded or `others` used generically. | Pending owner decision |
| Q-07 | Should the current operator/admin-facing frontend include a member-facing self-service portal? | No member-facing portal currently exists. **R1 note:** This is a pending product-scope decision; the current frontend is described as primarily operator/admin-facing. Do not assume approval of a member portal. | Pending owner decision |

### 30.4 Pending Backend Decisions

| ID | Question | Context | Status |
|---|---|---|---|
| B-01 | When will backend APIs for attendance, payments, reports and facilities management be available? | Frontend pages exist but use mock data | Pending backend team confirmation |
| B-02 | When will backend APIs for programmes, classes, scheduling, bookings and waitlists be available? | Domain does not exist in the frontend; backend was not inspected in this phase. | Pending backend team confirmation |
| B-03 | What is the approved authentication session architecture? | Current Web Storage credential pattern requires an approved security exception under Product Constitution Section 20.5 | Pending cross-team security phase |
| B-04 | Will backend endpoints `/gyms` and types `Gym` be renamed? | Frontend migration depends on backend migration timeline | Pending backend team confirmation |

### 30.5 Pending Cross-Repository Verification

| ID | Verification Needed | Status |
|---|---|---|
| X-01 | Verify that the backend repository shares the multi-facility product scope | Pending |
| X-02 | Verify backend API contracts for all frontend feature modules | Pending |
| X-03 | Verify that Platform Billing and Facility Member Commerce are separated at the backend | Pending |
| X-04 | Verify backend session-management and token-storage architecture | Pending |
| X-05 | Verify backend rate-limiting and brute-force protection for authentication endpoints | Pending |

### 30.6 Approved Operating Assumptions

These assumptions were accepted with Phase 0A approval. They may be amended through this constitution's amendment process (Section 31.3).

1. The existing classical premium visual direction (cream/paper backgrounds, ink text, copper-gold accents, Cormorant Garamond + Instrument Sans typography) is the approved brand identity and should be preserved, refined and enforced — not replaced.
2. The current set of implemented features (authentication, members, subscriptions, membership plans, organisation settings, branch management, branding, Platform Billing) represents the priority feature set that should be production-hardened first.
3. The first operating market is India, but the architecture should be future-safe for international expansion.
4. Facility types should select terminology and defaults but not restrict capabilities.
5. Hybrid organisations are a supported use case that does not require separate product configuration.

---

## 31. GOVERNANCE, EXCEPTIONS AND AMENDMENTS

### 31.1 Approval Authority

This constitution is approved as Phase 0A product direction by the product and platform owner. It governs all separately authorised frontend work. Implementation phases require separate explicit authorisation.

### 31.2 Exception Process

Deviations from this constitution MUST follow a controlled process. Silent exceptions are forbidden.

Every exception MUST include:

- Affected requirement (specific section of this constitution);
- Reason for deviation;
- Risk assessment;
- Scope (which features, components or timeframes);
- Compensating controls;
- Owner;
- Approval by the product and platform owner;
- Expiry;
- Remediation plan.

An exception temporarily permits a deviation. It does NOT permanently change the constitution. The Enterprise Constitution exception process (Section 30) may apply only after that document is separately approved and this constitution is amended to coordinate with it.

### 31.3 Amendment Process

Amendments permanently change this constitution. They MUST follow this amendment process. Every amendment MUST include:

- Document version increment;
- Proposed change (exact text);
- Affected sections;
- Reason;
- Impact assessment (security, reliability, product);
- Compatibility impact;
- Review evidence;
- Approver (product and platform owner);
- Effective date;
- Changelog;
- Retention of prior version.

An amendment MUST NOT be confused with an exception. The Enterprise Constitution amendment process (Section 31) may apply only after that document is separately approved and this constitution is amended to coordinate with it.

### 31.4 Conflict Resolution

Where this Product Constitution and the Enterprise Quality Constitution propose conflicting rules:

1. This Product Constitution is approved and binding for separately authorised frontend work. The Enterprise Constitution remains an unapproved, non-binding draft.
2. The Enterprise draft cannot override this approved Product Constitution.
3. If the Enterprise Constitution is later approved, any conflict requires explicit owner adjudication or an approved amendment to this Product Constitution.
4. Stronger security, financial-integrity and tenant-isolation protections should be preserved, but unapproved Enterprise rules are not silently imported as binding requirements.

### 31.5 Versioning

- Draft versions: `0.x-draft` — not binding.
- Approved versions: `1.0`, `1.1`, etc. — binding.
- Each amendment increments the minor version. Major revisions increment the major version.

---

## 32. PHASE 0A ACCEPTANCE CRITERIA

### 32.1 Completion Checklist (Phase 0A Approved)

- [x] Only the authorised document was modified (`docs/frontend/DOERS_PRODUCT_UI_UX_CONSTITUTION.md`)
- [x] Current frontend evidence was inspected (all `src/` directories, pages, components, features, configuration)
- [x] Multi-facility positioning is explicit (Section 1, 3)
- [x] Hybrid facilities are supported (Section 1.3.5, 3.3)
- [x] Canonical concepts are defined and corrected — Program, Batch, Session, Space, Commercial Product, Guardian (Section 5)
- [x] Terminology adaptation is controlled (Section 6)
- [x] Target navigation is defined (Section 7)
- [x] Brand rules are preserved with current-state qualification (Section 9)
- [x] Plain-language requirements are defined (Section 10)
- [x] Accessibility requirements are defined with WCAG 2.2 specifics (Section 14)
- [x] Responsive requirements are defined (Section 15)
- [x] Truthful-data requirements are defined and corrected (Section 17)
- [x] Security-facing UX is defined (Section 20)
- [x] Platform Billing separation is protected (Section 8)
- [x] Design-system governance rules are defined with layered token architecture (Sections 11, 13)
- [x] Current findings are traceable to later phases with corrected severities, file counts and evidence (Section 29)
- [x] Loading, empty, error and recovery states defined (Section 18)
- [x] Forms and data integrity requirements defined with corrected UTC explanation and temporal concepts (Section 19)
- [x] Destructive action requirements defined (Section 21)
- [x] Dashboard and reporting requirements defined with export corrections (Section 22)
- [x] Internationalization and time requirements defined with corrected UTC explanation (Section 23)
- [x] Performance principles defined (Section 24)
- [x] Testing strategy defined (Section 25)
- [x] Release gates defined with corrected lint/generated-file counts (Section 26)
- [x] Compatibility and migration strategy defined (Section 27)
- [x] Phase roadmap defined with backend-dependency and truthful-outcome corrections (Section 28)
- [x] Current-state evidence register populated with added findings F-31 through F-44; R2: evidence deduplication (F-42→F-13, F-43→F-27), F-30 PARTIALLY CONFIRMED, F-38 element corrected, F-40 age corrected, F-34 evidence expanded, F-44 narrowed
- [x] Decisions, open questions reconciled with roadmap (Section 30)
- [x] Governance language corrected — draft status, inherited constraints, conflict resolution (Sections 2, 30.1, 31.4)
- [x] Environment governance corrected — value removed, ignore rules clarified, .env.example allowed (Section 20.7)
- [x] Authentication requirements remain architecture-neutral (Section 20.5)
- [x] Document version 1.0, approved by Product Owner; revision history complete
- [x] Document is marked Approved — Phase 0A Accepted
- [x] Implementation authorisation: None — implementation requires separate phase authorisation
- [x] Phase 0B is NOT authorised

---

## 33. DOCUMENT END

This constitution is approved as Phase 0A product direction. It governs all separately authorised frontend work. Implementation phases require separate explicit authorisation.

**Implementation authorisation:** None — implementation requires separate phase authorisation. This document does not authorise code, configuration, dependency, API, database, migration, feature-flag, commit or push activity.

---

*End of Doers Product and UI/UX Constitution — Multi-Facility Fitness and Class Management*

*Version 1.0 | 2026-07-15 | Phase 0A Approved*

---

## 34. PHASE 0A HARD STOP

```
PHASE 0A APPROVED — CONSTITUTION IS ACCEPTED BY PRODUCT OWNER.

Phase 0B implementation, staging, commit, push, pull request,
branch operations, and later-phase work remain unauthorized.

Protected boundaries:
- Platform Billing (Section 8) — unchanged
- Enterprise Quality Constitution — unchanged; remains an unapproved draft
- Backend repository — not inspected
- Application code, tests, CSS, configuration, package files,
  lockfiles, feature flags, environment files, API contracts —
  unchanged
```

**Implementation authorisation:** None — implementation requires separate phase authorisation. This document does not authorise code, configuration, dependency, API, database, migration, feature-flag, commit or push activity.

ALL Phase 0B work, staging, commit, push, pull request, branch operation, or later-phase activity is explicitly NOT authorised.
