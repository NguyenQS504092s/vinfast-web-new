# CI/CD Pipeline Configuration

## Overview

VinFast Dealer Management System uses automated Continuous Integration/Continuous Deployment (CI/CD) pipelines to ensure code quality and enable rapid, reliable deployments.

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Developer                                │
│                      (Push to main)                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   GitHub Repo   │
                    │   (main branch) │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │    Vercel    │  │  Firebase    │  │   Slack      │
    │   Frontend   │  │  Functions   │  │   Notify     │
    │ Auto Deploy  │  │  (Manual)    │  │              │
    └──────────────┘  └──────────────┘  └──────────────┘
```

---

## Frontend Deployment (Vercel)

### Configuration

**Vercel automatically deploys on push to `main` branch**

#### Build Settings

- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Build Timeout**: 900 seconds

#### Environment Variables

```env
# These must be configured in Vercel Dashboard
VITE_FIREBASE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=vinfast-dealer-mgmt.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vinfast-dealer-mgmt
VITE_FIREBASE_DATABASE_URL=https://vinfast-dealer-mgmt-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_STORAGE_BUCKET=vinfast-dealer-mgmt.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdefg123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Deployment Flow

```
1. git push origin main
   │
2. GitHub webhook triggers Vercel
   │
3. Vercel:
   ├─ Clone repository
   ├─ Install dependencies (npm install)
   ├─ Build project (npm run build)
   ├─ Run tests (if configured)
   ├─ Deploy to CDN
   └─ Create unique preview URL
   │
4. Vercel notification:
   ├─ Build successful/failed
   ├─ Live URL: https://vinfast-dealer-mgmt.web.app
   └─ Preview URL for staging
```

### Manual Deployment

If needed to deploy without pushing code:

```bash
# Deploy current version to production
vercel --prod

# Deploy to staging/preview
vercel

# View deployment history
vercel deployments

# Rollback to previous version
vercel rollback [deployment-id]
```

### Viewing Deployments

1. **Vercel Dashboard**: https://vercel.com/dashboard
2. **GitHub**: See "Deployments" tab in repository
3. **CLI**: `vercel deployments`

---

## Backend Deployment (Firebase Functions)

### Configuration

Cloud Functions are deployed manually (not auto-deployed)

#### Function List

| Function | Trigger | Region |
|----------|---------|--------|
| `onContractExported` | Firebase DB onCreate | asia-southeast1 |
| `onContractUpdated` | Firebase DB onUpdate | asia-southeast1 |
| `dailySummary` | Schedule 2 AM VN time | asia-southeast1 |
| `syncToSheets` | HTTP endpoint | asia-southeast1 |

### Manual Deployment

```bash
# Install Firebase CLI (one time)
npm install -g firebase-tools

# Authenticate with Firebase
firebase login

# Select project
firebase use vinfast-dealer-mgmt

# Deploy functions
cd functions
npm install
firebase deploy --only functions

# View deployment status
firebase functions:list

# View function logs
firebase functions:log --limit=50
```

### Function Configuration (functions/.env)

```bash
# Google Sheets API credentials (NOT in git!)
SHEETS_ID=your-spreadsheet-id
GOOGLE_SERVICE_ACCOUNT={"type":"service_account",...}
```

### Monitoring Functions

```bash
# View recent function invocations
firebase functions:log --project=vinfast-dealer-mgmt

# View errors
firebase functions:log --level=error --limit=50

# Download logs for analysis
firebase functions:log > function-logs.txt
```

---

## Database Deployment

### Security Rules

```bash
# Validate rules before deployment
firebase database:get / --project=vinfast-dealer-mgmt

# Deploy updated security rules
firebase deploy --only database

# Check current rules
firebase database:get /rules --project=vinfast-dealer-mgmt > current-rules.json
```

### Backup & Restore

```bash
# Create backup before major changes
firebase database:get / --project=vinfast-dealer-mgmt > backup-$(date +%Y%m%d).json

# Restore from backup (CAUTION: overwrites data!)
firebase database:set / < backup-20260109.json --project=vinfast-dealer-mgmt
```

---

## GitHub Workflows (if configured)

Example GitHub Actions workflow for automated testing:

```yaml
# .github/workflows/test.yml
name: Test & Build

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --bail

      - name: Build project
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: build-output
          path: dist/

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
        run: |
          npm install -g vercel
          vercel --prod --token $VERCEL_TOKEN
```

---

## Pre-Deployment Checklist

Before deploying code to production:

- [ ] **Code Review**: PR reviewed and approved
- [ ] **Tests Pass**: `npm test` passes locally
- [ ] **Build Success**: `npm run build` completes without errors
- [ ] **No Console Errors**: DevTools shows no errors
- [ ] **Environment Variables**: All VITE_* variables configured in Vercel
- [ ] **Database Backup**: Created backup before critical changes
- [ ] **Security Rules**: Updated and tested if changed
- [ ] **Documentation Updated**: README and docs reflect changes
- [ ] **Breaking Changes Documented**: If any API changes made
- [ ] **Staging Tested**: Feature tested on staging URL first

---

## Rollback Procedures

### Frontend Rollback (Vercel)

```bash
# Option 1: Using CLI
vercel rollback [deployment-id]

# Option 2: Via Vercel Dashboard
# 1. Go to Deployments
# 2. Find previous version
# 3. Click "Promote to Production"

# Option 3: Revert git commit
git revert <commit-hash>
git push origin main
# Vercel automatically deploys new version
```

### Backend Rollback (Firebase)

```bash
# Option 1: Restore previous function code
git checkout <previous-commit> functions/
firebase deploy --only functions

# Option 2: Manual restore (if you have backup)
# Re-upload backup database
firebase database:set / < backup-previous.json
```

---

## Performance Monitoring

### Vercel Analytics

1. **Dashboard**: https://vercel.com/dashboard
2. **Performance**: Analytics tab shows:
   - Page load time
   - Core Web Vitals
   - Traffic patterns
   - Error rate

### Firebase Monitoring

1. **Console**: https://console.firebase.google.com/
2. **Performance**:
   - Database read/write count
   - Bandwidth usage
   - Concurrent connections
3. **Functions**:
   - Invocation count
   - Execution time
   - Error rate

### Custom Monitoring

```javascript
// Measure performance in app
performance.mark('critical-operation-start');

// ... operation ...

performance.mark('critical-operation-end');
performance.measure(
  'critical-operation',
  'critical-operation-start',
  'critical-operation-end'
);

const measure = performance.getEntriesByName('critical-operation')[0];
console.log('Operation took:', measure.duration, 'ms');
```

---

## Troubleshooting

### Build Fails

```
Error: Out of memory during build
Solution:
- Increase Node heap size: NODE_OPTIONS=--max-old-space-size=4096
- Or increase Vercel build timeout in settings
```

### Deployment Times Out

```
Solution:
1. Check Vercel dashboard for build logs
2. Optimize build process:
   - Remove unused dependencies
   - Implement code splitting
   - Use tree-shaking
3. Increase timeout in Vercel settings (max 900s)
```

### Environment Variables Not Applied

```
Solution:
1. Verify variable names in Vercel Dashboard
2. Names must match exactly: VITE_FIREBASE_API_KEY, etc.
3. Redeploy after adding/changing variables
4. Clear browser cache (Ctrl+Shift+Delete)
```

### Firebase Auth Fails After Deploy

```
Solution:
1. Check Firebase config in .env matches deployed settings
2. Verify Firebase project ID is correct
3. Check Firebase authentication is enabled
4. Verify CORS settings if using custom domain
```

---

## Deployment Timeline

**Typical deployment takes:**

| Step | Time |
|------|------|
| Code push | Immediate |
| Vercel build | 2-3 minutes |
| Vercel deploy to CDN | 1-2 minutes |
| CDN propagation | < 1 minute |
| **Total** | **5-10 minutes** |

### Firebase Functions Deployment

| Step | Time |
|------|------|
| `firebase deploy --only functions` | 3-5 minutes |
| Cold start of functions | 5-10 seconds (first invocation) |
| Warm invocation | < 100ms |

---

## Post-Deployment Verification

After deployment, verify:

1. **Frontend**
   - [ ] Site loads at https://vinfast-dealer-mgmt.web.app
   - [ ] Login works
   - [ ] Can create contract
   - [ ] Can export contract
   - [ ] Print forms work

2. **Backend**
   - [ ] Firebase connection established
   - [ ] Data reads work
   - [ ] Data writes work
   - [ ] VSO generator works

3. **Monitoring**
   - [ ] Check Vercel Dashboard for errors
   - [ ] Check Firebase Console for errors
   - [ ] Check Google Sheets sync (if functions deployed)

---

## Disaster Recovery

### If Production is Down

1. **Check Status**
   ```bash
   # Check if it's a frontend issue
   curl -I https://vinfast-dealer-mgmt.web.app

   # Check if it's a database issue
   firebase database:get /contracts --project=vinfast-dealer-mgmt
   ```

2. **Identify Root Cause**
   - Check Vercel deployment status
   - Check Firebase console
   - Check function logs
   - Check browser console (F12)

3. **Immediate Recovery Options**
   - Rollback frontend: `vercel rollback`
   - Restore database: `firebase database:set / < backup.json`
   - Disable problematic function (manual)

4. **Communicate**
   - Notify stakeholders of issue
   - Provide ETA for fix
   - Update status as resolved

---

## Security in CI/CD

### Secrets Management

✅ **Correct**:
- Secrets in Vercel environment variables
- Secrets in Firebase secrets (functions/.env)
- Never commit `.env` file

❌ **Incorrect**:
- Hardcoding API keys in code
- Committing `.env` file
- Storing secrets in comments

### Access Control

- Only authorized users can merge to `main`
- Only authorized users can deploy to production
- Enable branch protection on `main` branch

```bash
# GitHub: Require PR reviews before merge
# Settings → Branch protection rules:
- Require pull request reviews before merging
- Require status checks to pass (tests)
- Include administrators in restrictions
```

---

## Deployment Commands Reference

```bash
# Frontend
npm run dev          # Local development
npm run build        # Production build
npm run preview      # Preview build
vercel               # Deploy to staging
vercel --prod        # Deploy to production
vercel logs          # View deployment logs

# Backend
firebase login       # Authenticate
firebase use [project] # Select project
firebase deploy      # Deploy all
firebase deploy --only functions # Deploy functions only
firebase deploy --only database  # Deploy DB rules
firebase functions:log           # View function logs
```

---

## Resource Links

- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Deployment Guide](https://firebase.google.com/docs/hosting)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)

---

**Last Updated**: 2026-01-09
**Deployment Status**: ✅ Automated Frontend, Manual Backend
**Uptime SLA**: 99.9% (Vercel) / 99.95% (Firebase)
