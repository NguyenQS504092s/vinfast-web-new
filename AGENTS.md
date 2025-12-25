# AGENTS.md - VinFast Dealer Management System

## Project Overview

Ứng dụng quản lý đại lý VinFast (VinFast Dealer Management) - hệ thống quản lý hợp đồng, khách hàng, và in ấn biểu mẫu cho đại lý xe VinFast.

**Tech Stack:**
- Frontend: React 18 + Vite
- Styling: TailwindCSS
- Backend: Firebase Realtime Database
- Auth: Firebase Authentication
- Charts: Chart.js + react-chartjs-2
- Icons: Lucide React
- Routing: React Router DOM v6

## Directory Structure

```
src/
├── components/
│   ├── BieuMau/          # 27 printable forms (legal documents)
│   ├── FilterPanel/      # Filter components
│   ├── shared/           # Reusable components (CurrencyInput, etc.)
│   └── *.jsx             # Layout components (Header, Footer, etc.)
├── pages/                # Main application pages
├── data/                 # Static data files
│   ├── branchData.js     # Showroom/branch information (MST, bank accounts)
│   ├── calculatorData.js # Vehicle pricing data
│   └── promotionsData.js # Promotion rules
├── firebase/             # Firebase configuration
├── utils/                # Utility functions
│   └── vsoGenerator.js   # VSO code generator with Firebase sequence
├── assets/               # Static assets
└── images/               # Image files
```

## Key Business Logic

### Showroom/Branch System
- 3 showrooms: Thủ Đức (S00501), Trường Chinh (S00901), Âu Cơ (S41501)
- Branch data in `src/data/branchData.js` contains MST, bank accounts, addresses
- **CRITICAL**: Never use default branch fallback on legal documents - always require explicit selection

### VSO (Vehicle Sales Order) Format
- Full format: `{maDms}-VSO-{YY}-{MM}-{sequence}` (e.g., `S00901-VSO-25-12-0001`)
- Generator: `src/utils/vsoGenerator.js`
- Sequence counter stored in Firebase: `vsoCounters/{maDms}-{YY}-{MM}`

### Currency Input
- Use `CurrencyInput` component from `src/components/shared/CurrencyInput.jsx`
- Handles Vietnamese IME (Unikey) input properly
- Auto-formats with thousand separators

### Print Validation
- Required fields for printing: Họ tên KH, CCCD/CMT/Hộ chiếu, Số điện thoại, Địa chỉ, Model xe, Màu xe
- Show missing fields in tooltip when print button is disabled
- Yellow highlight on rows with incomplete data

## Firebase Database Structure

```
/exportedContracts/{id}     # Exported contracts
/contracts/{id}             # Draft contracts  
/invoices/{id}              # Invoices
/vsoCounters/{key}          # VSO sequence counters
/employees/{id}             # Employee data
/customers/{id}             # Customer data
```

## Common Patterns

### Reading from Firebase
```javascript
import { database } from '../firebase/config';
import { ref, get, update, push, onValue } from 'firebase/database';

// Read once
const snapshot = await get(ref(database, 'exportedContracts'));

// Real-time listener
onValue(ref(database, 'contracts'), (snapshot) => { ... });
```

### Form State Management
- Forms use local state with `useState`
- Data passed via `location.state` from navigation
- Currency values stored as numbers, displayed formatted

### Printing Forms (BieuMau)
- Each form in `src/components/BieuMau/` is a printable document
- Forms receive data via `location.state`
- Use `window.print()` for printing
- Forms must handle missing showroom gracefully (show placeholder text)

## Development Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
```

## Environment Variables

Required in `.env`:
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_DATABASE_URL
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
```

## Code Conventions

### Vietnamese Language
- UI text in Vietnamese
- Variable names can mix Vietnamese and English
- Field names often use Vietnamese (e.g., `hoTenKhachHang`, `tienDatCoc`)

### Component Naming
- Pages: `*Page.jsx` (e.g., `ContractFormPage.jsx`)
- Forms: Vietnamese names in BieuMau (e.g., `HopDongMuaBanXe.jsx`)
- Shared: Descriptive English (e.g., `CurrencyInput.jsx`)

### Styling
- TailwindCSS classes directly in JSX
- Custom styles in `index.css` when needed
- Print styles use `@media print`

## Testing

Test files located alongside components with `.test.jsx` suffix.

## Deployment

- Deployed on Vercel
- SPA routing configured in `vercel.json`
- Firebase hosting config in `firebase.json`

## Important Notes

1. **No hardcoded defaults**: Legal documents (BieuMau) must not default to any branch
2. **Currency formatting**: Always use CurrencyInput for money fields
3. **VSO generation**: Auto-generate when showroom is selected, not manually entered
4. **Print validation**: Check all required fields before enabling print button
5. **Firebase transactions**: Use for atomic operations (VSO counter increments)

## Related Documentation

- `docs/troubleshoot_tips.md` - Troubleshooting guide
- `GUIDE_PULL_REQUEST.md` - PR guidelines
- `COMPLETED_FEATURES.md` - Feature changelog
