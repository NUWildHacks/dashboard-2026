# Security Fixes Implementation Plan

This document outlines the step-by-step plan to address the security issues identified in the audit.

## Implementation Order

We'll fix issues in priority order, starting with critical issues, then high priority, and finally medium priority items.

---

## Phase 1: Critical Issues (Week 1)

### Fix 1: Proxy Middleware Session Cookie Verification

**Current Issue:** Middleware only checks cookie existence, not validity.

**Architecture Understanding:**

- `proxy.ts` runs in **Edge Runtime** (cannot use Firebase Admin SDK)
- Each page already calls `getAuthenticatedUser()` → `verifySession()` which verifies the cookie
- Middleware is a lightweight filter; real verification happens at page level

**Revised Plan:**
Since Edge Runtime cannot use Firebase Admin SDK, we have two options:

**Option A: Lightweight JWT Decode (Recommended)**

- Decode JWT token in Edge Runtime without verification (just check expiration)
- This catches expired tokens early without full verification
- Still relies on page-level verification for security
- Reduces unnecessary page loads for expired tokens

**Option B: Accept Current Architecture**

- Keep middleware as lightweight existence check
- Rely on page-level verification (already in place)
- Document this as intentional two-layer defense
- Lower priority - not critical since pages verify anyway

**Recommendation:** Option A - Add lightweight expiration check

**Implementation (Option A):**

1. Create utility to decode JWT and check expiration (no signature verification)
2. Update `proxy.ts` to check expiration if cookie exists
3. Redirect expired tokens early
4. Still rely on page-level verification for security

**Considerations:**

- JWT decode is safe in Edge Runtime (no crypto needed)
- This is a performance optimization, not a security fix
- Page-level verification remains the security boundary
- Invalid signatures will still be caught at page level

**Testing:**

- Test with valid session cookie
- Test with expired session cookie (should redirect)
- Test with invalid/malformed cookie (should redirect)
- Test with missing cookie (should redirect)
- Verify page-level verification still works

**Files to Modify:**

- `proxy.ts`
- Potentially create: `lib/jwt-decode.lib.ts` (for lightweight decode)

**Dependencies:** None

**Note:** This fix is more about performance/UX than security, since pages already verify. The security boundary is at the page level, which is already properly implemented.

---

### Fix 2: XSS in Announcement Body Rendering

**Current Issue:** Announcement body rendered directly without sanitization.

**Plan:**

1. **Decision Point:** Determine if HTML should be allowed
   - **Option A:** If HTML is NOT intended → Add strict validation to prevent HTML
   - **Option B:** If HTML IS intended → Implement sanitization (DOMPurify)

2. **If Option A (No HTML allowed):**
   - Update `create-announcement-dialog.schemas.ts` to reject HTML
   - Add validation to strip/reject HTML tags
   - Update server action to validate before storage
   - Ensure React escapes content (already does by default)

3. **If Option B (HTML allowed):**
   - Install DOMPurify: `pnpm add dompurify @types/dompurify`
   - Create sanitization utility function
   - Sanitize on both client (before submit) and server (before storage)
   - Update announcement dialog to render sanitized HTML safely

4. **Recommendation:** Start with Option A (no HTML) for simplicity and security, can add HTML support later if needed.

**Files to Modify:**

- `app/dashboard/announcements/_schemas/create-announcement-dialog.schemas.ts`
- `app/dashboard/announcements/_actions/create-announcement.actions.ts`
- `app/dashboard/announcements/_components/announcement-dialog.tsx`
- Potentially create: `lib/sanitize.lib.ts` (if HTML allowed)

**Dependencies:** None

---

### Fix 3: XSS in Announcement Links ✅ **COMPLETED**

**Current Issue:** Links rendered without validation, allowing `javascript:` URLs.

**Status:** ✅ **FIXED**

- Created `secureUrlSchema` in `lib/validation.lib.ts`
- Updated announcement schema to use secure URL validator
- Updated project schemas (create/edit) to use secure URL validator
- Updated announcement dialog to use `<a>` tag with `rel="noopener noreferrer"`

**Files Modified:**

- ✅ `lib/validation.lib.ts` (created)
- ✅ `lib/index.ts` (exported secure URL schemas)
- ✅ `app/dashboard/announcements/_schemas/create-announcement-dialog.schemas.ts`
- ✅ `app/dashboard/project/_schemas/create-project-form.schemas.ts`
- ✅ `app/dashboard/project/_schemas/edit-project-form.schemas.ts`
- ✅ `app/dashboard/announcements/_components/announcement-dialog.tsx`

---

## Phase 2: High Priority Issues (Week 2-4)

### Fix 4: Add Input Length Limits

**Current Issue:** No maximum length validation on string fields.

**Plan:**

1. **Define length limits:**
   - Announcement title: 200 chars
   - Announcement body: 5000 chars
   - Project name: 100 chars
   - Project description: 2000 chars
   - Registration fields:
     - first_name: 50 chars
     - last_name: 50 chars
     - github_username: 39 chars (GitHub limit)
     - other_dietary_restrictions: 500 chars

2. **Update all Zod schemas:**
   - Add `.max()` to all string fields
   - Provide clear error messages
   - Ensure limits are reasonable for UX

3. **Update server actions:**
   - Add server-side validation as defense in depth
   - Return clear error messages if limits exceeded

**Files to Modify:**

- `app/dashboard/announcements/_schemas/create-announcement-dialog.schemas.ts`
- `app/dashboard/project/_schemas/create-project-form.schemas.ts`
- `app/dashboard/project/_schemas/edit-project-form.schemas.ts`
- `app/registration/_schemas/registration-form.schemas.ts`
- All corresponding server actions

**Dependencies:** None

---

### Fix 5: Firestore Rules getUserRole() DoS Fix

**Current Issue:** `getUserRole()` doesn't check if user document exists.

**Plan:**

1. **Update Firestore rules:**
   - Add null check in `getUserRole()`
   - Return null if document doesn't exist
   - Update `isAdmin()` to handle null case
   - Ensure all functions using `getUserRole()` handle null

2. **Testing:**
   - Test with authenticated user without document
   - Test with authenticated user with document
   - Verify rules don't throw errors

**Files to Modify:**

- `firestore.rules`

**Dependencies:** None

---

### Fix 6: Implement Rate Limiting

**Current Issue:** No rate limiting on sensitive operations.

**Plan:**

1. **Choose rate limiting solution:**
   - **Option A:** Upstash Redis (recommended for Vercel)
   - **Option B:** In-memory rate limiting (simpler, but doesn't scale)
   - **Option C:** Vercel Edge Config (if available)

2. **If Option A (Upstash):**
   - Install: `pnpm add @upstash/ratelimit @upstash/redis`
   - Set up Upstash Redis instance
   - Create rate limiting utility
   - Define rate limits per action type:
     - Login: 5 attempts per 15 minutes
     - Registration: 3 attempts per hour
     - Create announcement: 10 per minute
     - Delete announcement: 5 per minute
     - Create/join project: 5 per minute
     - Edit profile: 10 per minute

3. **Implement in server actions:**
   - Add rate limiting check at start of each action
   - Return clear error message if limit exceeded
   - Log rate limit violations

4. **Considerations:**
   - Need Upstash account and Redis instance
   - Environment variables for Upstash credentials
   - May need to handle rate limit errors gracefully

**Files to Modify:**

- Create: `lib/rate-limit.lib.ts`
- All server actions (add rate limiting)
- `package.json` (add dependencies)
- Environment variable documentation

**Dependencies:**

- Requires Upstash account setup
- May need to update deployment config

---

## Phase 3: Medium Priority Issues (Month 1-2)

### Fix 7: Environment Variable Validation

**Current Issue:** No validation that required env vars exist.

**Plan:**

1. **Create env validation utility:**
   - List all required environment variables
   - Validate at application startup
   - Provide clear error messages
   - Separate client and server variables

2. **Update config files:**
   - Add validation to `config/firebase-admin.ts`
   - Add validation to `config/firebase-client.ts`
   - Create shared validation utility

**Files to Modify:**

- Create: `lib/env-validation.lib.ts`
- `config/firebase-admin.ts`
- `config/firebase-client.ts`

**Dependencies:** None

---

### Fix 8: Input Sanitization

**Current Issue:** Inputs stored directly without sanitization.

**Plan:**

1. **If we chose Option A for Fix 2 (no HTML):**
   - Ensure all HTML is stripped/rejected
   - Add server-side validation
   - This may already be covered by Fix 2

2. **If we chose Option B for Fix 2 (HTML allowed):**
   - Implement DOMPurify sanitization
   - Sanitize on both client and server
   - Define allowed HTML tags/attributes

**Files to Modify:**

- Depends on decision in Fix 2
- May create: `lib/sanitize.lib.ts`

**Dependencies:** Depends on Fix 2 decision

---

### Fix 9: CSRF Protection Documentation

**Current Issue:** Relies on Next.js defaults without documentation.

**Plan:**

1. **Verify Next.js CSRF protection:**
   - Confirm it's enabled (default in App Router)
   - Document the protection mechanism
   - Add comments in code

2. **Consider explicit tokens:**
   - Only if needed for additional security
   - May not be necessary with Next.js defaults

**Files to Modify:**

- Documentation only (unless explicit tokens needed)
- `README.md` or security documentation

**Dependencies:** None

---

### Fix 10: Content Security Policy

**Current Issue:** No CSP headers configured.

**Plan:**

1. **Define CSP policy:**
   - Start with restrictive policy
   - Allow necessary sources (Firebase, etc.)
   - Test thoroughly to avoid breaking functionality

2. **Implement in Next.js:**
   - Add headers via `next.config.ts`
   - Or use middleware
   - Test with browser dev tools

3. **Considerations:**
   - May need to adjust for Firebase
   - May need to allow inline styles for theme
   - Test all functionality after implementation

**Files to Modify:**

- `next.config.ts`

**Dependencies:** None

---

## Implementation Strategy

### Approach

1. **One fix at a time** - Complete each fix fully before moving to next
2. **Test after each fix** - Ensure no regressions
3. **Document changes** - Update code comments and documentation
4. **Incremental commits** - Commit each fix separately for easy rollback

### Testing Strategy

1. **Unit tests** for validation functions
2. **Integration tests** for server actions
3. **Manual testing** for UI changes
4. **Security testing** - Verify fixes actually prevent vulnerabilities

### Risk Mitigation

1. **Backup current code** - Ensure we can rollback
2. **Test in development** - Thoroughly test before production
3. **Gradual rollout** - Consider feature flags if needed
4. **Monitor after deployment** - Watch for errors or issues

---

## Questions to Resolve Before Implementation

1. **Announcement body HTML:** Should we allow HTML or only plain text?
   - Recommendation: Start with plain text only
   - Can add HTML support later if needed

2. **Rate limiting solution:** Which service to use?
   - Recommendation: Upstash Redis (works well with Vercel)
   - Alternative: In-memory for simpler setup

3. **Deployment timeline:** When do we need these fixes?
   - Critical fixes should be done before production
   - High priority within 2-4 weeks
   - Medium priority can be gradual

4. **Breaking changes:** Are we okay with potential UX changes?
   - Input length limits may affect existing users
   - Rate limiting may frustrate legitimate users if too strict

---

## Estimated Timeline

- **Phase 1 (Critical):** 1 week
  - Fix 1: 1 day
  - Fix 2: 1-2 days
  - Fix 3: ✅ **COMPLETED**
  - Testing: 1 day

- **Phase 2 (High Priority):** 2-3 weeks
  - Fix 4: 2-3 days
  - Fix 5: 1 day
  - Fix 6: 3-5 days (includes Upstash setup)
  - Testing: 2-3 days

- **Phase 3 (Medium Priority):** 1-2 months
  - Fix 7: 1 day
  - Fix 8: 1-2 days (depends on Fix 2)
  - Fix 9: 0.5 days
  - Fix 10: 2-3 days
  - Testing: 2-3 days

**Total Estimated Time:** 4-6 weeks for critical + high priority, additional 2-3 weeks for medium priority.

---

## Next Steps

1. **Review this plan** - Discuss any concerns or modifications
2. **Resolve questions** - Make decisions on HTML, rate limiting, etc.
3. **Start with Phase 1** - Begin with critical fixes
4. **Iterate** - Test and refine as we go
