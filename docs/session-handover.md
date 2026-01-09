# Session Handover - VinFast Dealer Management

**Last Session:** 2026-01-09
**Focus:** Firebase Security Fix
**Status:** ✅ Completed

---

## What Was Done

### Firebase Security Fix (CRITICAL)
1. **Problem:** Old Firebase project (`vinfast-dealer-mgmt`) had billing disabled, app couldn't connect
2. **Solution:** Created new Firebase project `vinfast-web-prod`
3. **Data:** Imported from backup `docs/vinfast-d5bd8-default-rtdb-export.json`
4. **Deployment:** Vercel with new Firebase config

### Configuration Changes
- `.env` - New Firebase config (vinfast-web-prod)
- `.firebaserc` - Changed default project to vinfast-web-prod
- Vercel Environment Variables - Updated with new Firebase config

---

## Current State

### App Status
| Component | Status |
|-----------|--------|
| Firebase Project | `vinfast-web-prod` ✅ |
| Realtime Database | Working ✅ |
| Authentication | Working (custom auth) ✅ |
| Vercel Deploy | Working ✅ |
| Login | Working ✅ |
| Data Access | Working ✅ |

### Security Rules
⚠️ **ATTENTION:** Current rules are permissive (read/write: true)

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**Reason:** App uses custom auth (employees collection + bcrypt), not Firebase Auth. Cannot use `auth != null` rules.

---

## Firebase Project History

| Project | Status | Notes |
|---------|--------|-------|
| vinfast-d5bd8 | ❌ No access | Original project |
| vinfast-dealer-mgmt | ❌ Billing disabled | Previous migration |
| **vinfast-web-prod** | ✅ Active | Current production |

---

## Next Session: Start Here

### Priority Tasks
1. **Tighten Security Rules** - Consider options given custom auth limitation
2. **Backup Schedule** - Set up regular Firebase data exports
3. **Monitor Usage** - Watch Firebase billing/usage

### Files to Read First
1. `src/pages/Login.jsx` - Understand custom auth flow
2. `src/firebase/config.js` - Firebase configuration
3. `project-memory.md` - Full project context

### Quick Commands
```bash
npm run dev             # Start local server
npm run build           # Build for production
git push                # Auto-deploy to Vercel
```

---

## Technical Insights

### Custom Auth System
App does NOT use Firebase Auth. Instead:
1. Reads `employees` collection from Realtime Database
2. Compares email/password using bcrypt
3. Stores session in localStorage

**Implication:** Cannot use `auth != null` in security rules.

### Security Options
| Option | Feasibility | Security |
|--------|-------------|----------|
| Current permissive rules | ✅ Works | ⚠️ Low |
| Migrate to Firebase Auth | Complex change | ✅ High |
| Add API layer | Complex change | ✅ High |

---

## Open Questions

- [ ] Should we migrate to Firebase Auth for better security?
- [ ] What's the acceptable security level for this internal app?
- [ ] Need Cloud Functions for Google Sheets sync?

---

## Links

- **Firebase Console:** https://console.firebase.google.com/project/vinfast-web-prod
- **Vercel:** Auto-deploy on git push
- **Data Backup:** `docs/vinfast-d5bd8-default-rtdb-export.json`
