# Firebase Database Migration Plan

## Overview
Migrate Firebase Realtime Database from old project (owned by previous developer) to a new Firebase project under your control. This includes exporting all data, creating a new project, importing data, and updating configuration.

## Current State
- **Old Projects**: `report-867c2`, `report-fc377`, `vinfast-d5bd8`
- **Database URL**: Configured in `.env` (VITE_FIREBASE_DATABASE_URL)
- **Services Used**: Realtime Database, Authentication, Hosting

## Estimated Time: 2-3 hours

---

## TODO Checklist

### Phase 1: Export Data from Old Database (30 min)
- [ ] 1.1 Login to Firebase Console with current credentials
- [ ] 1.2 Go to Realtime Database section
- [ ] 1.3 Export data as JSON (click ⋮ menu → Export JSON)
- [ ] 1.4 Save exported JSON file to `./backup/database-backup-YYYYMMDD.json`
- [ ] 1.5 Verify JSON file is complete (check file size and content)

### Phase 2: Create New Firebase Project (20 min)
- [ ] 2.1 Go to [Firebase Console](https://console.firebase.google.com/)
- [ ] 2.2 Create new project (suggested name: `vinfast-dealer-mgmt`)
- [ ] 2.3 Enable Google Analytics (optional)
- [ ] 2.4 Wait for project creation to complete

### Phase 3: Setup New Firebase Services (30 min)
- [ ] 3.1 **Realtime Database**: Create database in `asia-southeast1` region
- [ ] 3.2 **Authentication**: Enable Email/Password provider
- [ ] 3.3 **Hosting**: Set up hosting (will use later)
- [ ] 3.4 **Register Web App**: Add web app to get new config

### Phase 4: Import Data to New Database (20 min)
- [ ] 4.1 Go to new project's Realtime Database
- [ ] 4.2 Click ⋮ menu → Import JSON
- [ ] 4.3 Select the backup JSON file
- [ ] 4.4 Verify all data imported correctly
- [ ] 4.5 Update database rules (copy from `database.rules.json`)

### Phase 5: Update Project Configuration (30 min)
- [ ] 5.1 Get new Firebase config from Project Settings → Your apps
- [ ] 5.2 Update `.env` file with new values:
  ```env
  VITE_FIREBASE_API_KEY=new_api_key
  VITE_FIREBASE_AUTH_DOMAIN=new_project.firebaseapp.com
  VITE_FIREBASE_DATABASE_URL=https://new_project-default-rtdb.asia-southeast1.firebasedatabase.app
  VITE_FIREBASE_PROJECT_ID=new_project_id
  VITE_FIREBASE_STORAGE_BUCKET=new_project.appspot.com
  VITE_FIREBASE_MESSAGING_SENDER_ID=new_sender_id
  VITE_FIREBASE_APP_ID=new_app_id
  ```
- [ ] 5.3 Update `.firebaserc`:
  ```json
  {
    "projects": {
      "default": "new_project_id"
    }
  }
  ```
- [ ] 5.4 Run `firebase login` to authenticate
- [ ] 5.5 Run `firebase use new_project_id`

### Phase 6: Setup Cloud Functions Triggers (Optional - 30 min)
- [ ] 6.1 Initialize functions: `firebase init functions`
- [ ] 6.2 Choose TypeScript or JavaScript
- [ ] 6.3 Create trigger functions in `functions/src/index.ts`:
  - `onContractCreate` - When new contract is added
  - `onContractUpdate` - When contract is updated
  - `onContractStatusChange` - When status changes to "xuất"
- [ ] 6.4 Deploy functions: `firebase deploy --only functions`

### Phase 7: Testing & Verification (20 min)
- [ ] 7.1 Run `npm run dev` to start local development
- [ ] 7.2 Test login functionality
- [ ] 7.3 Test viewing contracts list
- [ ] 7.4 Test creating new contract
- [ ] 7.5 Test editing contract
- [ ] 7.6 Verify all data displays correctly

### Phase 8: Deploy to Production (10 min)
- [ ] 8.1 Run `npm run build`
- [ ] 8.2 Run `firebase deploy --only hosting`
- [ ] 8.3 Verify production site works

---

## Success Criteria
- [ ] All data migrated without loss
- [ ] New Firebase project fully configured
- [ ] Application works with new database
- [ ] Authentication works
- [ ] All CRUD operations functional
- [ ] (Optional) Cloud Functions deployed

## Rollback Plan
If migration fails:
1. Revert `.env` to old values
2. Revert `.firebaserc` to old values
3. Old database remains untouched

---

## Files to Modify
| File | Changes |
|------|---------|
| `.env` | New Firebase config values |
| `.firebaserc` | New project ID |
| `functions/` | New Cloud Functions (if creating) |

## Notes
- Keep old database running until migration is verified
- Do NOT delete old project until new one is fully tested
- Consider setting up Firebase Auth user migration if needed
