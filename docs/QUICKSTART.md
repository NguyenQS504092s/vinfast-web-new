# Quick Start Guide - VinFast Dealer Management System

## Welcome!

This guide helps you get the VinFast Dealer Management System running locally in **5 minutes**.

---

## Prerequisites

Before you start, make sure you have:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)
- **A Firebase Project** with credentials

---

## Step 1: Clone & Setup (2 minutes)

```bash
# Clone the repository
git clone https://github.com/realleesan/vinfast-web.git
cd vinfast-web

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

---

## Step 2: Configure Firebase (.env file)

Edit `.env` and add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Get these from:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **Project Settings** (gear icon)
4. Copy all values from the "VITE_" prefixed fields

---

## Step 3: Start Development Server (1 minute)

```bash
npm run dev
```

The app will be available at: **http://localhost:3004**

---

## Step 4: Login & Explore

1. Use your Firebase Auth credentials to login
2. Explore the key features:
   - **Báo Giá** (Price Calculator) - Start here!
   - **Hợp Đồng** - Contract Management
   - **Dashboard** - Sales Analytics
   - **Nhân Sự** - Employee Directory

---

## Common Tasks

### View Source Code Structure

```
src/
├── pages/          # 16 route components
├── components/
│   ├── BieuMau/   # 27 printable forms
│   └── shared/    # Reusable components
├── data/           # Static data (vehicles, promotions)
├── firebase/       # Firebase config
└── utils/          # Utility functions
```

### Edit a Page

All pages are in `src/pages/` and follow this pattern:

```jsx
// Example: src/pages/ExamplePage.jsx
import { useState, useEffect } from 'react';
import { database } from '../firebase/config';
import { ref, onValue } from 'firebase/database';

function ExamplePage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const dataRef = ref(database, 'path/to/data');
    const unsubscribe = onValue(dataRef, (snapshot) => {
      setData(snapshot.val() || []);
    });
    return () => unsubscribe();
  }, []);

  return <div className="container mx-auto p-4">{/* Content */}</div>;
}

export default ExamplePage;
```

### Add a New Form (BieuMau)

All forms are in `src/components/BieuMau/`. They receive contract data via React Router state:

```jsx
// Example BieuMau component
import { useLocation } from 'react-router-dom';
import { getBranchByShowroomName } from '../../data/branchData';

function ExampleBieuMau() {
  const location = useLocation();
  const contractData = location.state || {};
  const branch = getBranchByShowroomName(contractData.showroom);

  return (
    <div className="print:p-0">
      <button onClick={() => window.print()} className="print:hidden">
        In biểu mẫu
      </button>
      <div className="max-w-[210mm] mx-auto bg-white">
        {/* A4 form content */}
      </div>
    </div>
  );
}
```

### Modify Calculator Pricing

Edit `src/data/calculatorData.js` - add or modify vehicle pricing:

```javascript
{
  model: 'VF 7',
  trim: 'Eco',
  exterior_color: 'Crimson Red',
  interior_color: 'Standard',
  price_vnd: 800000000,
  car_image_url: '/images/vf7_crimson_red.webp'
}
```

### View Database Data

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project → Realtime Database
3. Browse the data structure:
   - `contracts/` - Draft contracts
   - `exportedContracts/` - Exported contracts
   - `vsoCounters/` - VSO sequence numbers
   - `promotions/` - Active promotions
   - `employees/` - Employee data

---

## Build for Production

```bash
# Create production build
npm run build

# Preview build locally
npm run preview

# Deploy to Vercel (if configured)
# Just push to main branch - auto-deploys!

# Deploy Cloud Functions (if needed)
cd functions
npm install
firebase deploy --only functions
```

---

## Important Notes

### Critical Rules

1. **No default branch on legal documents** - Always require explicit showroom selection
2. **Use CurrencyInput** component for all money fields
3. **VSO auto-generation** is atomic (prevents duplicates)
4. **Print validation** checks required fields before enabling print

### File Naming

| Type | Pattern | Example |
|------|---------|---------|
| Pages | PascalCase + Page | `ContractFormPage.jsx` |
| BieuMau | Vietnamese, PascalCase | `HopDongMuaBanXe.jsx` |
| Components | PascalCase | `CurrencyInput.jsx` |
| Utils | camelCase | `vsoGenerator.js` |

### Styling

All styling uses **TailwindCSS**:

```jsx
<div className="container mx-auto px-4 py-6">
  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
    Click me
  </button>
</div>
```

For print layouts, use `print:` prefix:

```jsx
<div className="print:hidden">Not printed</div>
<div className="hidden print:block">Only in print</div>
```

---

## Troubleshooting

### Port 3004 already in use?

```bash
# Use a different port
npm run dev -- --port 3005
```

### Firebase credentials not working?

1. Check `.env` file exists and is readable
2. Verify all VITE_FIREBASE_* variables are set
3. Check Firebase project is active in console

### Print layout looks wrong?

1. Open Chrome DevTools (F12)
2. Click ⋯ → More tools → Rendering
3. Check "Emulate CSS media feature prefers-color-scheme"
4. Look for any overflow or page-break issues

### Contract data not saving?

1. Check Firebase Realtime Database is accessible
2. Verify Firebase Security Rules allow writes (auth != null)
3. Check browser console for errors (F12)

---

## Next Steps

After you get it running:

1. **Read** [Code Standards](./code-standards.md) - understand naming conventions
2. **Explore** [System Architecture](./system-architecture.md) - understand the design
3. **Check** [Project Overview](./project-overview-pdr.md) - understand business requirements
4. **Review** [Troubleshooting](./troubleshoot_tips.md) - common issues & solutions

---

## Commands Quick Reference

```bash
npm run dev           # Start dev server
npm run build         # Production build
npm run preview       # Preview build locally
npm test              # Run tests (if configured)
npm run lint          # Check code style (if configured)
```

---

## Need Help?

- Check [Troubleshooting Guide](./troubleshoot_tips.md)
- Review existing components in `src/components/`
- Look at similar pages as examples
- Check Firebase Console for data/errors
- Read code comments for implementation details

---

**Happy coding! 🚀**
