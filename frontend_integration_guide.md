# Frontend Integration Guide: Onboarding & Trial System (v1.1)

This guide outlines how the frontend team should integrate with the Phase 3 backend modules.

---

## 1. Authentication & Cross-Device Sync

### NEW: Polling for Verification (Magic Link Sync)
If a user clicks the verification link on their **phone**, the **laptop** must detect it and log them in automatically.

- **Endpoint**: `GET /auth/signup-status?email={email}`
- **Frequency**: Every 2 seconds on the "Check your Email" page.
- **Success Response (200)**:
  ```json
  {
    "status": "verified",
    "onboarding_completed": false
  }
  ```
- **Action**: Once `status` is `"verified"`, the backend has already set the **Auth Cookies**. The frontend should immediately `router.push('/onboarding')`.

### NEW: Verification Success Page
When a user clicks the email link (on phone or laptop), they are now redirected to:
`http://localhost:5174/auth/verify-success`

- **Task**: Create this simple route.
- **Message**: "Email Verified! You can now continue your setup."

### Authentication Mode
The backend now supports **Cookie-based Auth**. For all subsequent calls:
- **Requirement**: Use `withCredentials: true` (Axios) or `credentials: 'include'` (Fetch).
- **Manual Headers**: You do **not** need to manually add the `Authorization` header for onboarding calls if cookies are enabled.

---

## 2. Onboarding Flow

### Step A: Pincode Lookup (Auto-fill)
Trigger this when the pincode field reaches 6 digits.

- **Endpoint**: `GET /onboarding/pincode/{pincode}`
- **Success Response (200)**:
  ```json
  {
    "city": "Bengaluru",
    "state": "KARNATAKA",
    "district": "Bangalore"
  }
  ```
- **Action**: Pre-fill City and State fields.

### Step B: Submit Onboarding
- **Endpoint**: `POST /onboarding/complete`
- **Request Body**:
  ```json
  {
    "phone": "+919876543210",
    "address_line1": "123 Fitness Street",
    "address_line2": "HSR Layout",
    "city": "Bengaluru",
    "state": "KARNATAKA",
    "pincode": "560102"
  }
  ```
- **Success**: 200 OK. Redirect to `/dashboard`.

---

## 3. Trial Lifecycle & Error Handling

### Soft Lock (Read-Only)
- **Trigger**: `POST/PUT/DELETE` return `403 Forbidden`.
- **Error JSON**:
  ```json
  {
    "detail": {
      "code": "SOFT_LOCKED",
      "message": "Trial expired. Read-only mode."
    }
  }
  ```
- **Action**: Show "Trial Expired" banner; disable "Save" buttons.

### Hard Lock (Full Block)
- **Trigger**: All requests return `403 Forbidden`.
- **Error JSON**:
  ```json
  {
    "detail": {
      "code": "HARD_LOCKED",
      "message": "Account locked. Subscription required."
    }
  }
  ```
- **Action**: Redirect to `/subscription-required`.

---

## 4. Helpful Endpoints
- `GET /onboarding/status`: Get trial countdown days and lock dates.
