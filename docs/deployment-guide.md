# Deployment Guide

## Overview

VinFast Dealer Management System uses a distributed deployment approach:

- **Frontend**: Vercel (auto-deploy on push to main)
- **Backend**: Firebase (Realtime Database + Cloud Functions)
- **Database**: Firebase Realtime Database (asia-southeast1)

---

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All code committed to `main` branch
- [ ] `.env` file is NOT committed (add to `.gitignore`)
- [ ] Environment variables are configured in deployment platform
- [ ] Tests pass locally: `npm run build`
- [ ] No console errors in DevTools (F12)
- [ ] Feature tested on staging environment

---

## Frontend Deployment (Vercel)

### Initial Setup

1. **Connect GitHub Repository**
   ```bash
   # Login to Vercel
   npm install -g vercel
   vercel login

   # Link project
   vercel link
   ```

2. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all `VITE_FIREBASE_*` variables:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_DATABASE_URL`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
     - `VITE_FIREBASE_MEASUREMENT_ID`

3. **Configure Build Settings**
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Auto-Deployment

Once connected to GitHub, **every push to `main` branch automatically deploys**:

```bash
# Just push your changes!
git add .
git commit -m "feat: your changes"
git push origin main

# Vercel automatically:
# 1. Builds the project
# 2. Runs tests
# 3. Deploys to production
# 4. Sends you a Slack notification
```

### Manual Deployment

If needed, deploy manually:

```bash
# Deploy to production
vercel --prod

# Deploy to staging (preview)
vercel

# View deployment logs
vercel logs
```

### Rollback

If there's an issue after deployment:

```bash
# View deployment history
vercel deployments

# Rollback to previous version
vercel rollback [deployment-url]

# Or manually re-push an older commit
git revert <commit-hash>
git push origin main
```

---

## Backend Deployment (Firebase)

### Initial Setup

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize Firebase Project**
   ```bash
   firebase init
   # Select: Realtime Database, Functions, Hosting
   ```

3. **Configure Firebase Project**
   - Edit `.firebaserc`:
     ```json
     {
       "projects": {
         "default": "vinfast-dealer-mgmt"
       }
     }
     ```

4. **Update firebase.json**
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         { "source": "**", "destination": "/index.html" }
       ]
     },
     "functions": {
       "source": "functions",
       "runtime": "nodejs20"
     },
     "database": {
       "rules": "database.rules.json"
     }
   }
   ```

### Database Deployment

**Database Rules** are automatically deployed with Firebase. To update:

```bash
# Validate rules
firebase database:get --project=vinfast-dealer-mgmt / > backup.json

# Deploy rules
firebase deploy --only database
```

Current security rules (`database.rules.json`):

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "vsoCounters": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "exportedContracts": {
      ".indexOn": ["ngayXhd", "showroom", "tinhTrang"]
    }
  }
}
```

### Cloud Functions Deployment

Cloud Functions handle:
- Auto-sync to Google Sheets when contracts exported
- Daily summary statistics

Deploy functions:

```bash
# Navigate to functions directory
cd functions

# Install dependencies (first time only)
npm install

# Deploy functions
firebase deploy --only functions

# View function logs
firebase functions:log --project=vinfast-dealer-mgmt
```

#### Function Configuration

**functions/.env** (not in git):

```bash
# Google Sheets Configuration
SHEETS_ID=your-sheets-spreadsheet-id
GOOGLE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key":"..."}
```

#### Available Functions

| Function | Trigger | Description |
|----------|---------|-------------|
| `onContractExported` | onCreate `/exportedContracts/{id}` | Sync new contract to Google Sheets |
| `onContractUpdated` | onUpdate `/exportedContracts/{id}` | Update contract row in Sheets |
| `dailySummary` | Schedule 2 AM Vietnam time | Generate daily statistics |
| `syncToSheets` | HTTP GET request | Manual sync trigger |

---

## Database Migration/Backup

### Backup Database

```bash
# Export entire database to JSON
firebase database:get / --project=vinfast-dealer-mgmt > backup-$(date +%Y%m%d).json

# Export specific path
firebase database:get /contracts --project=vinfast-dealer-mgmt > contracts-backup.json
```

### Restore Database

```bash
# CAUTION: This overwrites existing data!
firebase database:set / < backup-20250109.json --project=vinfast-dealer-mgmt

# Restore specific path
firebase database:set /contracts < contracts-backup.json --project=vinfast-dealer-mgmt
```

### Import Sample Data

```bash
# Import employees sample data
node scripts/import-employees-sample.js

# Import contracts sample data
node scripts/import-hopdong-sample.js

# Import promotions
node scripts/import-promotions.js
```

---

## Environment Variables

### Frontend (.env)

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=vinfast-dealer-mgmt.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vinfast-dealer-mgmt
VITE_FIREBASE_DATABASE_URL=https://vinfast-dealer-mgmt-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_STORAGE_BUCKET=vinfast-dealer-mgmt.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdefg123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

**NEVER commit `.env` file!**

### Backend (functions/.env)

```env
# Google Sheets API Configuration
SHEETS_ID=your-spreadsheet-id
GOOGLE_SERVICE_ACCOUNT={"type":"service_account",...}
```

---

## Monitoring & Health Checks

### Vercel Monitoring

1. **View Deployments**: https://vercel.com/dashboard
2. **Check Build Logs**: Click on any deployment
3. **Monitor Performance**: Analytics tab
4. **View Error Tracking**: Integrations with Sentry (if configured)

### Firebase Monitoring

1. **Realtime Database**:
   - Go to Firebase Console → Realtime Database
   - View data usage and connections
   - Check security rules are applied

2. **Cloud Functions**:
   - Go to Firebase Console → Cloud Functions
   - View logs for any errors
   - Check memory usage and execution time

3. **Authentication**:
   - Go to Firebase Console → Authentication
   - Monitor active users
   - Review login events

### Health Check Commands

```bash
# Verify Firebase connection
firebase database:get /contracts --project=vinfast-dealer-mgmt

# Check functions deployment status
firebase functions:list --project=vinfast-dealer-mgmt

# View recent function invocations
firebase functions:log --project=vinfast-dealer-mgmt --limit=50
```

---

## Troubleshooting

### Build Fails on Vercel

**Problem**: Build command times out or fails

```bash
# Solution: Increase timeout
# Vercel Settings → Build & Development Settings
# Increase Build Command Timeout to 900 seconds
```

### Firebase Deployment Fails

**Problem**: `Permission denied` error

```bash
# Solution: Login again and select correct project
firebase logout
firebase login
firebase use vinfast-dealer-mgmt
firebase deploy
```

### Environment Variables Not Applied

**Problem**: `undefined` values in app after deployment

```bash
# Solution: Check variable names in Vercel Settings
# Must match exactly: VITE_FIREBASE_API_KEY, etc.
# Restart deployment after adding variables
vercel --prod
```

### Database Rules Too Restrictive

**Problem**: App can't read/write data after deployment

```bash
# Solution: Update database.rules.json
# Ensure ".read" and ".write" rules allow authenticated users
"rules": {
  ".read": "auth != null",
  ".write": "auth != null"
}

# Deploy updated rules
firebase deploy --only database
```

---

## Performance Optimization

### Frontend Optimization

```bash
# Analyze bundle size
npm run build

# Check output:
# dist/
#   ├── index.html
#   ├── assets/
#   │   ├── index-[hash].js (main bundle)
#   │   └── index-[hash].css (styles)
```

Vercel automatically optimizes:
- Minification
- Tree-shaking unused code
- Image optimization
- CDN edge caching

### Database Optimization

- Indexes on frequently queried fields:
  - `exportedContracts.ngayXhd`
  - `exportedContracts.showroom`
  - `exportedContracts.tinhTrang`

- Pagination for large data sets
- Real-time listeners cleanup on unmount

---

## Disaster Recovery

### Emergency Rollback

If production is broken:

```bash
# Option 1: Revert recent commit
git revert <commit-hash>
git push origin main
# Vercel auto-deploys fixed version

# Option 2: Manually rollback on Vercel
# Go to Vercel Dashboard → Deployments
# Click "Promote to Production" on a previous version
```

### Data Recovery

If database is corrupted:

```bash
# Option 1: Restore from backup
firebase database:set / < backup-latest.json --project=vinfast-dealer-mgmt

# Option 2: Export data before deletion (always!)
firebase database:get / > emergency-backup.json --project=vinfast-dealer-mgmt

# Option 3: Firebase automatic backups
# Contact Firebase support for restore options
```

---

## Deployment Checklist

Before each production release:

- [ ] Code review completed
- [ ] Tests pass: `npm run build`
- [ ] No console errors in DevTools
- [ ] Environment variables configured
- [ ] Database rules reviewed
- [ ] Backup created: `firebase database:get / > backup.json`
- [ ] Deployment tested on staging first
- [ ] Notified stakeholders of deployment
- [ ] Post-deployment verification completed

---

## Support & Escalation

**Vercel Support**: https://vercel.com/support
**Firebase Support**: https://firebase.google.com/support
**Emergency Contact**: [Your team contact]

---

**Last Updated**: 2026-01-09
**Deployment Status**: ✅ Automated (Vercel)
