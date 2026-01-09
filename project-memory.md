# Project Memory - VinFast Dealer Management System

**Last Updated:** 2026-01-09T14:30:00+07:00
**Session:** project-update
**Context Version:** 2.0

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
Uncommitted: Yes (6 new docs, 1 modified, project-memory.md)
Last Commit: 9e08066 - feat: add exported contracts page, initial project documentation
Ahead/Behind: 0/0 from main
```

### Recent Achievements (This Session)
1. [x] Documentation update - 9 files created/updated (4,800+ lines)
2. [x] Coverage improved 50% → 95%
3. [x] Firebase project migration documented (vinfast-dealer-mgmt)
4. [x] Project status report generated

### Recent Achievements (Last 7 Days)
1. 9e08066 - Add exported contracts page, documentation, gitignore
2. 075908f - Add contract/proposal forms, VSO generator, contract management
3. e2a1ed7 - Fix: remove default branch fallback in forms
4. 17bf00e - Fix: calculator price formulas (VinClub, XHD, payment)
5. d1a7fdd - Feat: CurrencyInput with IME support, gifts section, print validation

### Active Work
- **Current Focus:** Documentation & project memory update
- **Active Plan:** None
- **Active Phase:** N/A
- **Next Action:** Commit documentation changes, verify auth testing

### Known Blockers & Issues
| Issue | Severity | Notes |
|-------|----------|-------|
| Cloud Functions not deployed | Low | Phase 6 skipped, can add later |
| Auth testing pending | Med | Need user verification |
| 1 failing test | Low | 33/34 tests pass (97%) |

---

## Architecture Quick Reference

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
| **Testing** | Manual + Vitest (97% pass) |
| **Styling** | TailwindCSS + print styles |

### Critical File Paths
- **Entry Point:** src/main.jsx
- **Config:** src/firebase/config.js
- **Routes:** src/App.jsx
- **Data:** src/data/branchData.js, calculatorData.js
- **Utils:** src/utils/vsoGenerator.js, vndToWords.js
- **Components:** src/components/BieuMau/ (27 forms)

### Dependencies (Key)
| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.3.1 | UI framework |
| firebase | 10.13.0 | Backend services |
| react-router-dom | 6.26.0 | Routing |
| tailwindcss | 3.4.10 | Styling |
| chart.js | 4.5.1 | Dashboard charts |
| lucide-react | 0.553.0 | Icons |

---

## Active Plans

| Plan | Status | Progress | Priority | Last Updated |
|------|--------|----------|----------|--------------|
| [Firebase Migration](./plans/20251210-firebase-migration/plan.md) | Completed | 90% | N/A | 2024-12-10 |

### Immediate Priorities (Next 3 Actions)
1. **Commit docs:** Add 6 new documentation files to git
2. **Verify Auth:** Test login functionality with new Firebase project
3. **Test CRUD:** Verify contract create/edit/export works

### Upcoming Work
- [ ] Complete auth testing (Phase 7.2-7.6)
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

# Deploy
firebase deploy --only hosting
```

### Environment Setup
- **Node Version:** 18+
- **Package Manager:** npm
- **Required ENV:** VITE_FIREBASE_* (7 vars)
- **External Services:** Firebase (Realtime DB, Auth, Hosting)

### Test Coverage
- **Unit Tests:** 97% pass (33/34 tests)
- **Integration:** Manual testing
- **E2E:** Manual testing

---

## Session Continuity

### Decisions Made This Session
| Decision | Rationale | Impact |
|----------|-----------|--------|
| Full docs update | Improve onboarding & coverage | 95% coverage achieved |
| Use docs-manager agent | Automated comprehensive update | 9 files updated |
| Project status report | Track completion metrics | Clear visibility |

### Technical Insights Discovered
- **Documentation:** 4,800+ lines across 10 files
- **Firebase Migration:** Completed to `vinfast-dealer-mgmt`
- **Live URL:** https://vinfast-dealer-mgmt.web.app

### Open Questions (Unresolved)
- [ ] Need user to verify login works with new Firebase project
- [ ] Decide if Cloud Functions (Google Sheets sync) are needed
- [ ] Which test is failing and why?

### Technical Debt Identified
- [ ] Large page files (CalculatorPage.jsx 115KB) - could modularize
- [ ] Mix of Vietnamese/English naming conventions

---

## Handover Notes for Next Session

### Start With
Commit documentation changes: `git add docs/ && git commit -m "docs: comprehensive documentation update"`

### Watch Out For
- Firebase project changed from `vinfast-d5bd8` to `vinfast-dealer-mgmt`
- Cloud Functions not deployed yet (Google Sheets sync won't work)
- 6 uncommitted doc files need to be added

### Consider
- Modularize large page components if adding features
- Add Cloud Functions if auto-sync to Sheets needed
- Run full test suite to identify failing test

### Files to Review First
1. docs/QUICKSTART.md - new developer onboarding
2. docs/API.md - API reference documentation
3. plans/reports/docs-manager-260109-1421-documentation-update-report.md

### Commands to Run First
```bash
git status              # Check uncommitted changes
npm run dev             # Start local dev server
npm run build           # Verify build works
```

---

## Skills & Tools Used

### Skills Activated This Session
- None (command-based update)

### Recommended Skills for Next Session
- `frontend-development` - React/TailwindCSS work
- `databases` - Firebase Realtime Database
- `debugging` - If issues found during testing

### MCP Tools Used
- None this session

### Agents Delegated To
- `docs-manager` - Documentation update (9 files)
- `project-manager` - Status report generation

---

## Changelog

| Date | Change | By |
|------|--------|-----|
| 2026-01-09 | Initial project memory creation | read-project-context |
| 2026-01-09 | Session update: docs-manager, project-manager reports | project-update |
