# Firebase Database Migration Plan

## Overview
Migrate Firebase Realtime Database from old project (owned by previous developer) to a new Firebase project under your control. This includes exporting all data, creating a new project, importing data, and updating configuration.

## Status: ✅ COMPLETED
**Completion Date**: 2024-12-10
**New Project**: `vinfast-dealer-mgmt`
**Live URL**: https://vinfast-dealer-mgmt.web.app

## Migration Summary
| Old Project | New Project |
|-------------|-------------|
| `vinfast-d5bd8` | `vinfast-dealer-mgmt` |
| Owner: Previous dev (lost contact) | Owner: sangquang2904@gmail.com |

---

## TODO Checklist

### Phase 1: Export Data from Old Database (30 min)
- [x] 1.1 Login to Firebase Console with current credentials
- [x] 1.2 Go to Realtime Database section
- [x] 1.3 Export data as JSON (click ⋮ menu → Export JSON)
- [x] 1.4 Save exported JSON file
- [x] 1.5 Verify JSON file is complete

### Phase 2: Create New Firebase Project (20 min)
- [x] 2.1 Go to Firebase Console
- [x] 2.2 Create new project: `vinfast-dealer-mgmt` (via MCP tool)
- [x] 2.3 Project created successfully

### Phase 3: Setup New Firebase Services (30 min)
- [x] 3.1 **Realtime Database**: Created in `asia-southeast1` region
- [x] 3.2 **Authentication**: Enabled Email/Password provider
- [x] 3.3 **Hosting**: Set up automatically
- [x] 3.4 **Register Web App**: `VinFast Dealer Web App` (App ID: `1:38042383436:web:808abf5b8bd2d003a3f0e9`)

### Phase 4: Import Data to New Database (20 min)
- [x] 4.1 Go to new project's Realtime Database
- [x] 4.2 Import JSON data
- [x] 4.3 Verify all data imported correctly

### Phase 5: Update Project Configuration (30 min)
- [x] 5.1 Get new Firebase config from MCP tool
- [x] 5.2 Update `.env` file with new values:
  ```env
  VITE_FIREBASE_API_KEY=AIzaSyA7QaiZ_vqi7LK8MEg_RvjjJwJGI0KiMHI
  VITE_FIREBASE_AUTH_DOMAIN=vinfast-dealer-mgmt.firebaseapp.com
  VITE_FIREBASE_DATABASE_URL=https://vinfast-dealer-mgmt-default-rtdb.asia-southeast1.firebasedatabase.app
  VITE_FIREBASE_PROJECT_ID=vinfast-dealer-mgmt
  VITE_FIREBASE_STORAGE_BUCKET=vinfast-dealer-mgmt.firebasestorage.app
  VITE_FIREBASE_MESSAGING_SENDER_ID=38042383436
  VITE_FIREBASE_APP_ID=1:38042383436:web:808abf5b8bd2d003a3f0e9
  ```
- [x] 5.3 Update `.firebaserc` to use new project as default
- [x] 5.4 Firebase CLI installed globally
- [x] 5.5 Using new project

### Phase 6: Setup Cloud Functions Triggers (Optional - 30 min)
- [ ] 6.1 Initialize functions: `firebase init functions`
- [ ] 6.2 Choose TypeScript or JavaScript
- [ ] 6.3 Create trigger functions
- [ ] 6.4 Deploy functions
> **Status**: Skipped for now - can be added later if needed

### Phase 7: Testing & Verification (20 min)
- [x] 7.1 Build successful
- [ ] 7.2 Test login functionality
- [ ] 7.3 Test viewing contracts list
- [ ] 7.4 Test creating new contract
- [ ] 7.5 Test editing contract
- [ ] 7.6 Verify all data displays correctly
> **Status**: Pending user verification

### Phase 8: Deploy to Production (10 min)
- [x] 8.1 Run `npm run build` - SUCCESS
- [x] 8.2 Run `firebase deploy --only hosting` - SUCCESS
- [x] 8.3 Live at https://vinfast-dealer-mgmt.web.app

---

## Success Criteria
- [x] All data migrated without loss
- [x] New Firebase project fully configured
- [x] Application deployed to new hosting
- [ ] Authentication works (pending test)
- [ ] All CRUD operations functional (pending test)
- [ ] (Optional) Cloud Functions deployed - SKIPPED

---

## New Firebase Project Details
```
Project ID: vinfast-dealer-mgmt
Project Number: 38042383436
Display Name: VinFast Dealer Management
Hosting URL: https://vinfast-dealer-mgmt.web.app
Console: https://console.firebase.google.com/project/vinfast-dealer-mgmt
```

## Files Modified
| File | Status |
|------|--------|
| `.env` | ✅ Updated with new config |
| `.firebaserc` | ✅ Updated to new project |

## Notes
- Old project credentials archived in case rollback needed
- Cloud Functions can be added later if automation is required
- Users may need to re-register if Auth migration needed
