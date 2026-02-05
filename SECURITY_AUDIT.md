# Security Audit Report - Dashboard 2026

**Date:** 2026
**Auditor:** Security Review
**Status:** Issues Found

## Executive Summary

This security audit identified **13 security concerns** across the application, including:

- **3 Critical Issues** requiring immediate attention
- **3 High Priority Issues** that should be addressed soon
- **4 Medium Priority Issues** for improvement
- **3 Low Priority / Best Practice** recommendations

## Critical Issues 🔴

### 1. Proxy Middleware Doesn't Verify Session Cookie Validity

**Location:** `proxy.ts` (lines 26-34)

**Issue:** The middleware only checks if a session cookie exists but doesn't verify if it's valid or expired.

```typescript
// Current implementation
if (isProtectedRoute) {
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) {
    // redirects to login
  }
}
```

**Architecture Note:** The middleware runs in Edge Runtime and cannot use Firebase Admin SDK. Each page already calls `getAuthenticatedUser()` which internally verifies the session cookie using Firebase Admin SDK. The real security boundary is at the page level.

**Risk:**

- **Lower than initially assessed** - Pages already verify, so this is more of a performance/UX issue
- Invalid/expired cookies will pass middleware but get rejected at page level
- Wastes resources processing invalid requests

**Recommendation:** Since Edge Runtime cannot use Firebase Admin SDK, we have two options:

**Option A:** Lightweight JWT decode (check expiration only, no signature verification)

- Decode JWT in Edge Runtime to check expiration
- Redirect expired tokens early
- Page-level verification remains the security boundary

**Option B:** Accept current architecture

- Keep middleware as lightweight filter
- Document that page-level verification is the security boundary
- Lower priority fix

**Implementation (Option A):**

```typescript
// Lightweight JWT decode (Edge Runtime compatible)
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true; // Treat invalid tokens as expired
  }
}

if (isProtectedRoute) {
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie || isTokenExpired(sessionCookie)) {
    return NextResponse.redirect(loginUrl);
  }
}
// Note: Full signature verification happens at page level via verifySession()
```

---

### 2. XSS Vulnerability in Announcement Body Rendering

**Location:** `app/dashboard/announcements/_components/announcement-dialog.tsx` (line 78)

**Issue:** Announcement body is rendered directly without sanitization:

```tsx
<p className="text-center sm:text-left">{body}</p>
```

**Risk:** If HTML is stored in the database, it could execute malicious scripts.

**Recommendation:**

- If HTML is not intended: Ensure input validation prevents HTML
- If HTML is intended: Use a sanitization library like DOMPurify or a markdown renderer

---

### 3. XSS Vulnerability in Announcement Links

**Location:**

- `app/dashboard/announcements/_schemas/create-announcement-dialog.schemas.ts` (line 9)
- `app/dashboard/announcements/_components/announcement-dialog.tsx` (lines 84-88)

**Issue:**

1. **Zod validation is insufficient** - `z.url()` accepts dangerous protocols:
   - ✅ `javascript:alert(1)` - **PASSES validation** (XSS risk)
   - ✅ `data:text/html,<script>alert(1)</script>` - **PASSES validation** (XSS risk)
   - ✅ `file:///etc/passwd` - **PASSES validation** (SSRF risk)

2. Links are rendered directly without protocol validation

**Risk:** Malicious URLs with dangerous protocols could execute scripts or access local files.

**Recommendation:** Create a secure URL validator that only allows `http://` and `https://`:

```typescript
// Create reusable secure URL schema
import { z } from "zod";

const secureUrlSchema = z
  .string()
  .url("Invalid URL format")
  .refine(
    (url) => {
      try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
      } catch {
        return false;
      }
    },
    { message: "URL must use http:// or https:// protocol" }
  );

// Use in announcement schema
export const createAnnouncementDialogSchema = z.object({
  // ...
  links: z.array(z.object({ url: secureUrlSchema })).max(4),
});

// In component - add rel="noopener noreferrer" for security
{links.map((link) => (
  <li key={link}>
    <Link href={link} target="_blank" rel="noopener noreferrer">
      {link}
    </Link>
  </li>
))}
```

**Also update:** Project URL schemas (`create-project-form.schemas.ts`, `edit-project-form.schemas.ts`) use the same pattern.

---

## High Priority Issues 🟠

### 4. Missing Input Length Limits

**Locations:** Multiple schemas (announcements, projects, registration)

**Issue:** No maximum length validation on string fields, allowing potentially unlimited input.

**Risk:**

- Denial of Service (DoS) attacks
- Database storage exhaustion
- Performance degradation

**Recommendation:** Add `max()` constraints to all string fields:

```typescript
// Example for announcement schema
export const createAnnouncementDialogSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(200, { message: "Title must be 200 characters or less" }),
  body: z
    .string()
    .min(1, { message: "Body is required" })
    .max(5000, { message: "Body must be 5000 characters or less" }),
  // ...
});
```

**Fields to update:**

- Announcement: title, body
- Project: name, description
- Registration: first_name, last_name, github_username, other_dietary_restrictions

---

### 5. Firestore Rules: Potential DoS in getUserRole()

**Location:** `firestore.rules` (line 11)

**Issue:** The `getUserRole()` function doesn't check if the user document exists:

```javascript
function getUserRole() {
  return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
}
```

**Risk:** If a user document doesn't exist, this could cause rule evaluation failures.

**Recommendation:** Add existence check:

```javascript
function getUserRole() {
  let userDoc = get(/databases/$(database)/documents/users/$(request.auth.uid));
  return userDoc != null && userDoc.data != null ? userDoc.data.role : null;
}

function isAdmin() {
  return isAuthenticated() && getUserRole() == 'Admin';
}
```

---

### 6. No Rate Limiting

**Location:** All server actions

**Issue:** No rate limiting implemented on sensitive operations (login, registration, announcements, etc.).

**Risk:**

- Brute force attacks
- Denial of Service (DoS)
- Resource exhaustion
- Abuse of functionality

**Recommendation:** Implement rate limiting using:

- Vercel Edge Config with Upstash Redis
- Next.js middleware with rate limiting library
- Firebase App Check for additional protection

Example using `@upstash/ratelimit`:

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

export const createAnnouncement = async (data: CreateAnnouncementDialogSchema) => {
  const userId = await verifySession();
  if (!userId) redirect(LOGIN_PATH);

  const { success } = await ratelimit.limit(userId);
  if (!success) {
    return { success: false, error: "Rate limit exceeded. Please try again later." };
  }

  // ... rest of function
};
```

---

## Medium Priority Issues 🟡

### 7. Session Cookie Security in Development

**Location:** `constants/cookie.constants.ts` (line 9)

**Issue:** Secure flag is only set in production:

```typescript
secure: process.env.APP_ENV === "production";
```

**Risk:** Session cookies sent over HTTP in development (acceptable if localhost-only).

**Recommendation:** Document this behavior and ensure production always uses HTTPS.

---

### 8. Missing Environment Variable Validation

**Location:** `config/firebase-admin.ts`, `config/firebase-client.ts`

**Issue:** No validation that required environment variables are present at startup.

**Risk:** Runtime failures with unclear error messages.

**Recommendation:** Add validation:

```typescript
const requiredEnvVars = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  // ...
];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});
```

---

### 9. No Explicit CSRF Protection

**Location:** Server actions

**Issue:** Relies solely on Next.js built-in CSRF protection.

**Risk:** Potential CSRF if Next.js configuration is misconfigured.

**Recommendation:**

- Verify Next.js CSRF protection is enabled (default in App Router)
- Consider adding explicit CSRF tokens for highly sensitive operations
- Use SameSite cookie attribute (already implemented)

---

### 10. Missing Input Sanitization

**Location:** All server actions

**Issue:** User inputs are stored directly without sanitization (though React escapes by default).

**Risk:** If data is later rendered unsafely, stored XSS could occur.

**Recommendation:**

- Sanitize HTML content before storage if HTML is allowed
- Use libraries like DOMPurify or sanitize-html
- Consider using markdown instead of raw HTML

---

## Low Priority / Best Practices 🟢

### 11. Error Messages May Leak Information

**Location:** Multiple server actions

**Issue:** Some error messages may expose internal details.

**Recommendation:** Use generic error messages for users, log detailed errors server-side.

---

### 12. No Content Security Policy (CSP)

**Location:** `app/layout.tsx`

**Issue:** No Content Security Policy headers configured.

**Recommendation:** Add CSP headers via Next.js middleware or `next.config.ts`:

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
          },
        ],
      },
    ];
  },
};
```

---

### 13. dangerouslySetInnerHTML Usage

**Location:** `components/ui/chart.tsx` (line 74)

**Issue:** Uses `dangerouslySetInnerHTML` for style injection.

**Risk:** Low (input appears controlled), but worth reviewing.

**Recommendation:** Ensure input is fully controlled and cannot be manipulated by users.

---

## Positive Security Practices ✅

The application demonstrates several good security practices:

1. ✅ **Strong Authentication:** Uses Firebase Authentication with session cookies
2. ✅ **Authorization Checks:** Server actions properly check user roles
3. ✅ **Input Validation:** Uses Zod schemas for validation
4. ✅ **Firestore Security Rules:** Comprehensive rules in place
5. ✅ **HttpOnly Cookies:** Session cookies are HttpOnly
6. ✅ **SameSite Cookies:** Cookies use SameSite=strict
7. ✅ **Server-Side Validation:** Validation occurs on both client and server
8. ✅ **Type Safety:** TypeScript provides additional safety

---

## Priority Action Items

### Immediate (Critical)

1. Sanitize/validate announcement body and links (XSS vulnerabilities) ✅ **FIXED: Links**
2. Add input length limits to all schemas (DoS prevention)

### Short Term (High Priority)

3. Fix proxy middleware to check token expiration (performance/UX improvement)
4. Fix Firestore rules getUserRole() function
5. Implement rate limiting
6. Add environment variable validation

### Medium Term (Medium Priority)

7. Add explicit CSRF protection documentation
8. Implement input sanitization
9. Add Content Security Policy headers

---

## Testing Recommendations

1. **Penetration Testing:** Conduct professional pen testing
2. **Automated Security Scanning:** Use tools like Snyk, npm audit
3. **Dependency Updates:** Regularly update dependencies
4. **Security Headers:** Test with securityheaders.com
5. **OWASP Top 10:** Review against OWASP Top 10 checklist

---

## Conclusion

While the application has a solid security foundation, there are several critical and high-priority issues that should be addressed before production deployment. The most critical issues are related to authentication bypass and XSS vulnerabilities.

**Overall Security Rating:** ⚠️ **Needs Improvement**

**Recommended Timeline:**

- Critical issues: Fix within 1 week
- High priority: Fix within 2-4 weeks
- Medium priority: Fix within 1-2 months
- Low priority: Address as time permits
