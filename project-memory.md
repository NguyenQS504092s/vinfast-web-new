# Project Memory - VinFast Dealer Management System

**Last Updated:** 2026-01-09T15:45:00+07:00
**Session:** firebase-security-fix
**Context Version:** 2.1

---

## Project Identity

| Field | Value |
|-------|-------|
| **Name** | VinFast Dealer Management System |
| **Type** | Web App (SPA) |
| **Stack** | React 18 + Vite + TailwindCSS + Firebase |
| **Status** | Production |
| **Repo** | vinfast-web |

---

## Current State Snapshot

### Progress Metrics
- **Overall Completion:** 95% (Phase 1 hoàn thành)
- **Current Milestone:** Production release
- **Active Phase:** Maintenance & feature additions
- **Sprint/Iteration:** N/A

### Git State
```
Branch: main
Uncommitted: No (clean after push)
Last Commit: 1685bd9 - chore: migrate to new Firebase project vinfast-web-prod
Ahead/Behind: 0/0 from main
```

### Recent Achievements (This Session)
1. [x] Fixed Firebase security issue - created new project `vinfast-web-prod`
2. [x] Imported data from backup JSON
3. [x] Configured security rules + authentication
4. [x] Deployed to Vercel with new Firebase config
5. [x] Verified login + data working

### Recent Achievements (Last 7 Days)
1. 1685bd9 - chore: migrate to new Firebase project vinfast-web-prod
2. 9e08066 - Add exported contracts page, documentation, gitignore
3. 075908f - Add contract/proposal forms, VSO generator, contract management
4. e2a1ed7 - Fix: remove default branch fallback in forms
5. 17bf00e - Fix: calculator price formulas (VinClub, XHD, payment)

### Active Work
- **Current Focus:** App operational with new Firebase project
- **Active Plan:** Firebase Security Fix (✅ Completed)
- **Active Phase:** N/A
- **Next Action:** Tighten security rules, monitor app

### Known Blockers & Issues
| Issue | Severity | Notes |
|-------|----------|-------|
| Security rules too permissive | Med | Currently read/write: true, need to tighten |
| Cloud Functions not deployed | Low | Phase 6 skipped, can add later |

---

## Architecture Quick Reference

### Firebase Configuration
| Item | Value |
|------|-------|
| **Project ID** | `vinfast-web-prod` |
| **Console** | https://console.firebase.google.com/project/vinfast-web-prod |
| **Region** | asia-southeast1 |
| **Auth** | Email/Password (custom, stored in employees collection) |

### Project Structure
```
vinfast-web/
├── src/                    # Source code
│   ├── components/         # React components (BieuMau, shared)
│   ├── pages/              # 16 page components
│   ├── data/               # Static data (branchData, calculatorData)
│   ├── firebase/           # Firebase config
│   ├── utils/              # vsoGenerator, vndToWords
│   └── App.jsx             # Root + Router
├── functions/              # Firebase Cloud Functions
├── docs/                   # Project documentation (10 files)
├── plans/                  # Migration & feature plans
└── dist/                   # Build output
```

### Key Patterns
| Aspect | Pattern/Approach |
|--------|-----------------|
| **Data Flow** | React state + Firebase Realtime listeners |
| **State Management** | React useState/useEffect + Firebase hooks |
| **API Style** | Firebase Realtime Database (NoSQL) |
| **Database** | Firebase Realtime Database |
| **Authentication** | Custom auth (employees collection + bcrypt) |
| **Styling** | TailwindCSS + print styles |

### Critical File Paths
- **Entry Point:** src/main.jsx
- **Config:** src/firebase/config.js
- **Routes:** src/App.jsx
- **Login:** src/pages/Login.jsx (uses employees collection)
- **Data:** src/data/branchData.js, calculatorData.js
- **Utils:** src/utils/vsoGenerator.js, vndToWords.js
- **Components:** src/components/BieuMau/ (27 forms)

---

## Active Plans

| Plan | Status | Progress | Priority | Last Updated |
|------|--------|----------|----------|--------------|
| [Firebase Security Fix](./plans/260109-1427-firebase-security-fix/plan.md) | ✅ Completed | 100% | P0 | 2026-01-09 |
| [Firebase Migration](./plans/20251210-firebase-migration/plan.md) | ✅ Completed | 100% | N/A | 2024-12-10 |

### Immediate Priorities (Next 3 Actions)
1. **Tighten Security Rules:** Update Firebase rules to be more restrictive
2. **Backup Schedule:** Set up regular data exports
3. **Monitor Usage:** Watch Firebase usage/billing

### Upcoming Work
- [ ] Tighten security rules (currently read/write: true)
- [ ] Deploy Cloud Functions (Phase 6) - if needed
- [ ] Mobile responsive improvements (Phase 2 roadmap)

---

## Development Context

### Essential Commands
```bash
# Development
npm run dev        # Start at localhost:3004

# Build
npm run build      # Production build to dist/

# Preview
npm run preview    # Preview build locally

# Deploy (Firebase Hosting - optional)
firebase deploy --only hosting

# Deploy (Vercel - primary)
git push           # Auto-deploys via Vercel
```

### Environment Setup
- **Node Version:** 18+
- **Package Manager:** npm
- **Required ENV:** VITE_FIREBASE_* (7 vars) - set in Vercel
- **External Services:** Firebase (Realtime DB), Vercel (Hosting)

### Firebase Project History
| Project | Status | Notes |
|---------|--------|-------|
| vinfast-d5bd8 | ❌ No access | Original project |
| vinfast-dealer-mgmt | ❌ Billing disabled | Migration attempt |
| **vinfast-web-prod** | ✅ Active | Current production |

---

## Session Continuity

### Decisions Made This Session
| Decision | Rationale | Impact |
|----------|-----------|--------|
| Create new Firebase project | Old project billing disabled | New project: vinfast-web-prod |
| Use permissive rules temporarily | Need to verify all features work first | Will tighten later |
| Deploy via Vercel | Primary deployment platform | Auto-deploy on git push |

### Technical Insights Discovered
- **Auth System:** App uses custom auth (employees collection), NOT Firebase Auth
- **Login Flow:** Reads employees → bcrypt compare → localStorage session
- **Security Rules:** Must allow public read of `employees` for login to work
- **Data Backup:** `docs/vinfast-d5bd8-default-rtdb-export.json`

### Open Questions (Unresolved)
- [ ] Should we migrate to Firebase Auth for better security?
- [ ] Decide if Cloud Functions (Google Sheets sync) are needed
- [ ] Optimal security rules for custom auth pattern

### Technical Debt Identified
- [ ] Custom auth instead of Firebase Auth (security concern)
- [ ] Large page files (CalculatorPage.jsx 115KB) - could modularize
- [ ] Security rules too permissive

---

## Handover Notes for Next Session

### Start With
App is operational. Focus on security improvements.

### Watch Out For
- Firebase project is now `vinfast-web-prod` (NOT vinfast-dealer-mgmt)
- Security rules are permissive (read/write: true) - tighten when ready
- Auth uses employees collection, not Firebase Auth

### Consider
- Tighten security rules after confirming all features work
- Set up automated backups
- Consider migrating to Firebase Auth for better security

### Files to Review First
1. src/pages/Login.jsx - understand custom auth flow
2. src/firebase/config.js - Firebase configuration
3. plans/260109-1427-firebase-security-fix/plan.md - completed plan

### Commands to Run First
```bash
npm run dev             # Start local dev server
npm run build           # Verify build works
```

---

## Skills & Tools Used

### Skills Activated This Session
- `planning` - Brainstorm security solutions
- Firebase CLI - Project creation

### Recommended Skills for Next Session
- `frontend-development` - React/TailwindCSS work
- `databases` - Firebase security rules
- `backend-development` - If migrating to Firebase Auth

### MCP Tools Used
- None this session

### Agents Delegated To
- None (manual implementation this session)

---

## Changelog

| Date | Change | By |
|------|--------|-----|
| 2026-01-09 | Initial project memory creation | read-project-context |
| 2026-01-09 | Session update: docs-manager, project-manager reports | project-update |
| 2026-01-09 | Firebase security fix: new project vinfast-web-prod | firebase-security-fix |
