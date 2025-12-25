# System Architecture

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                    React 18 SPA (Vite)                          │   │
│   │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐     │   │
│   │  │    Pages     │ │  Components  │ │  BieuMau (27 forms)  │     │   │
│   │  │  (16 files)  │ │   (shared)   │ │  (legal documents)   │     │   │
│   │  └──────────────┘ └──────────────┘ └──────────────────────┘     │   │
│   │                                                                  │   │
│   │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐     │   │
│   │  │  React Router│ │ TailwindCSS  │ │  Chart.js + Lucide   │     │   │
│   │  └──────────────┘ └──────────────┘ └──────────────────────┘     │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    │ HTTPS
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           FIREBASE SERVICES                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────┐  ┌────────────────────┐  ┌────────────────────┐     │
│  │   Firebase     │  │  Realtime Database │  │  Cloud Functions   │     │
│  │     Auth       │  │                    │  │   (Node.js 20)     │     │
│  │                │  │  /contracts        │  │                    │     │
│  │  • Email/Pass  │  │  /exportedContracts│  │  • onContractExport│     │
│  │  • Session     │  │  /vsoCounters      │  │  • onContractUpdate│     │
│  │    Management  │  │  /promotions       │  │  • dailySummary    │     │
│  │                │  │  /employees        │  │  • syncToSheets    │     │
│  │                │  │  /customers        │  │                    │     │
│  └────────────────┘  └────────────────────┘  └─────────┬──────────┘     │
│                                                         │                │
└─────────────────────────────────────────────────────────┼────────────────┘
                                                          │
                                                          │ Google API
                                                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL INTEGRATIONS                             │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │                    Google Sheets                                │     │
│  │                                                                 │     │
│  │    Sheet: "HopDongDaXuat"                                      │     │
│  │    • Auto-sync when contracts exported                         │     │
│  │    • Columns A-X with contract data                            │     │
│  │    • Service Account authentication                            │     │
│  └────────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Architecture

### 2.1 Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | React | 18.3.1 |
| Build Tool | Vite | 5.4.1 |
| Routing | React Router DOM | 6.26.0 |
| Styling | TailwindCSS | 3.4.10 |
| Charts | Chart.js + react-chartjs-2 | 4.5.1 |
| Icons | Lucide React | 0.553.0 |
| Notifications | React Toastify | 11.0.5 |

### 2.2 Project Structure

```
src/
├── App.jsx              # Root component với Router
├── main.jsx             # Entry point (ReactDOM.createRoot)
├── index.css            # Global styles + Tailwind imports
│
├── pages/               # Route-level components
│   ├── Home.jsx         # Landing page (báo giá)
│   ├── Dashboard.jsx    # Analytics dashboard
│   ├── Login.jsx        # Authentication
│   └── ...              # 16 total page components
│
├── components/
│   ├── BieuMau/         # 27 printable legal forms
│   ├── FilterPanel/     # Filter UI components
│   ├── shared/          # Reusable components
│   ├── Header.jsx       # Navigation header
│   ├── Footer.jsx       # Page footer
│   └── ProtectedRoute.jsx # Auth guard
│
├── data/                # Static data
│   ├── branchData.js    # 3 showrooms info
│   ├── calculatorData.js # Vehicle pricing
│   ├── promotionsData.js # Promotion rules
│   └── provincesData.js  # Vietnam provinces
│
├── firebase/
│   └── config.js        # Firebase initialization
│
└── utils/
    ├── vsoGenerator.js  # VSO code generator
    └── vndToWords.js    # Number to Vietnamese words
```

### 2.3 Routing Architecture

```jsx
// App.jsx routing structure
<Routes>
  {/* Public */}
  <Route path="/dang-nhap" element={<Login />} />
  
  {/* Protected - require auth */}
  <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
  
  {/* Contract Management */}
  <Route path="/hop-dong" element={<ProtectedRoute><HopDongPage /></ProtectedRoute>} />
  <Route path="/hop-dong/them-moi" element={<ProtectedRoute><ContractFormPage /></ProtectedRoute>} />
  <Route path="/hop-dong-da-xuat" element={<ProtectedRoute><HopDongDaXuatPage /></ProtectedRoute>} />
  
  {/* BieuMau (27 routes) */}
  <Route path="/hop-dong-mua-ban-xe" element={<ProtectedRoute><HopDongMuaBanXe /></ProtectedRoute>} />
  <Route path="/giay-xac-nhan" element={<ProtectedRoute><GiayXacNhan /></ProtectedRoute>} />
  {/* ... more BieuMau routes */}
  
  {/* Other Features */}
  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
  <Route path="/bao-gia" element={<ProtectedRoute><CalculatorPage /></ProtectedRoute>} />
  <Route path="/nhan-su" element={<ProtectedRoute><NhanSuPage /></ProtectedRoute>} />
</Routes>
```

---

## 3. Backend Architecture (Firebase)

### 3.1 Firebase Services

```
Firebase Project: vinfast-d5bd8
Region: asia-southeast1

Services:
├── Authentication    # Email/Password auth
├── Realtime Database # NoSQL data storage
└── Cloud Functions   # Server-side logic
```

### 3.2 Realtime Database Schema

```
vinfast-d5bd8-default-rtdb/
│
├── contracts/                      # Draft contracts
│   └── {contractId}/
│       ├── stt: string            # Số thứ tự
│       ├── tenKh: string          # Tên khách hàng
│       ├── cccd: string           # CCCD/CMND
│       ├── soDienThoai: string    # Số điện thoại
│       ├── email: string          # Email
│       ├── diaChi: string         # Địa chỉ
│       ├── dongXe: string         # Dòng xe (VF 7, VF 8, etc.)
│       ├── phienBan: string       # Phiên bản (Plus, Eco, etc.)
│       ├── ngoaiThat: string      # Màu ngoại thất
│       ├── noiThat: string        # Màu nội thất
│       ├── giaNiemYet: number     # Giá niêm yết
│       ├── giaGiam: number        # Giá giảm
│       ├── giaHopDong: number     # Giá hợp đồng
│       ├── soTienCoc: number      # Số tiền cọc
│       ├── soTienVay: number      # Số tiền vay
│       ├── nganHang: string       # Ngân hàng cho vay
│       ├── showroom: string       # Tên showroom
│       ├── vso: string            # Mã VSO
│       ├── tvbh: string           # Tên nhân viên bán hàng
│       ├── tinhTrang: string      # Tình trạng (nháp/xuất/hoàn thành)
│       ├── quaTang: string        # Quà tặng
│       ├── createdAt: string      # ISO timestamp
│       └── updatedAt: string      # ISO timestamp
│
├── exportedContracts/              # Exported contracts (same schema)
│   └── {contractId}/
│
├── vsoCounters/                    # VSO sequence counters
│   └── {maDms}-{YY}-{MM}: number  # e.g., "S00901-25-12": 35
│
├── promotions/                     # Active promotions
│   └── {promotionId}/
│       ├── name: string
│       ├── type: "fixed" | "percent" | "display"
│       ├── value: number
│       ├── dongXe: string[]       # Applicable vehicle models
│       └── active: boolean
│
├── employees/                      # Employee records
│   └── {employeeId}/
│       ├── name: string
│       ├── position: string
│       ├── department: string
│       ├── showroom: string
│       ├── phone: string
│       └── email: string
│
├── customers/                      # Customer records
│   └── {customerId}/
│       ├── name: string
│       ├── cccd: string
│       ├── phone: string
│       ├── email: string
│       ├── address: string
│       └── contracts: string[]    # Reference to contract IDs
│
└── dailySummaries/                 # Daily statistics
    └── {YYYY-MM-DD}/
        ├── contractCount: number
        ├── totalValue: number
        └── generatedAt: string
```

### 3.3 Security Rules

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

---

## 4. Cloud Functions Architecture

### 4.1 Functions Overview

```javascript
// functions/index.js

// 1. Sync to Google Sheets on contract export
exports.onContractExported = onValueCreated({
  ref: "/exportedContracts/{contractId}",
  region: "asia-southeast1"
});

// 2. Update Google Sheets when contract updated
exports.onContractUpdated = onValueUpdated({
  ref: "/exportedContracts/{contractId}",
  region: "asia-southeast1"
});

// 3. Daily summary at 2 AM Vietnam time
exports.dailySummary = onSchedule({
  schedule: "0 2 * * *",
  timeZone: "Asia/Ho_Chi_Minh",
  region: "asia-southeast1"
});

// 4. HTTP endpoint for manual sync
exports.syncToSheets = onRequest({
  region: "asia-southeast1",
  cors: true
});
```

### 4.2 Google Sheets Integration

```
Flow:
1. Contract exported → onContractExported triggers
2. Function formats contract data to row
3. Uses Google Service Account for auth
4. Appends row to "HopDongDaXuat" sheet

Columns (A-X):
A: STT
B: Ngày XHD
C: TVBH
D: Tên KH
E: SĐT
F: Email
G: Địa chỉ
H: CCCD
I: Dòng xe
J: Phiên bản
K: Ngoại thất
L: Nội thất
M: Giá niêm yết
N: Giá giảm
O: Giá HĐ
P: Tiền cọc
Q: Tình trạng
R: Ngân hàng
S: Tiền vay
T: Phải thu
U: Quà tặng
V: Quà khác
W: Contract ID
X: Timestamp
```

---

## 5. Authentication Flow

```
┌──────────────┐     ┌────────────────┐     ┌───────────────┐
│   Login.jsx  │────▶│ Firebase Auth  │────▶│ ProtectedRoute│
└──────────────┘     └────────────────┘     └───────────────┘
       │                    │                       │
       │ email/password     │ JWT token             │ Check auth
       ▼                    ▼                       ▼
┌──────────────┐     ┌────────────────┐     ┌───────────────┐
│   onSubmit   │     │  Verify user   │     │  auth != null │
│   handler    │     │  Create session│     │  → Render page│
└──────────────┘     └────────────────┘     │  → Redirect   │
                                            └───────────────┘
```

### 5.1 Login Flow

```javascript
// Login.jsx
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const handleLogin = async (email, password) => {
  const auth = getAuth();
  try {
    await signInWithEmailAndPassword(auth, email, password);
    navigate('/');
  } catch (error) {
    setError('Email hoặc mật khẩu không đúng');
  }
};
```

### 5.2 Protected Route

```jsx
// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';

function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/dang-nhap" />;
  
  return children;
}
```

---

## 6. Data Flow Diagrams

### 6.1 Contract Creation Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        CONTRACT CREATION FLOW                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   User                     App                        Firebase           │
│    │                        │                            │               │
│    │  1. Select Showroom    │                            │               │
│    │──────────────────────▶│                            │               │
│    │                        │  2. generateVSO(maDms)     │               │
│    │                        │───────────────────────────▶│               │
│    │                        │                            │               │
│    │                        │  3. runTransaction         │               │
│    │                        │     (vsoCounters)          │               │
│    │                        │◀───────────────────────────│               │
│    │                        │  Return: S00901-VSO-25-12-0035             │
│    │  4. Display VSO        │                            │               │
│    │◀──────────────────────│                            │               │
│    │                        │                            │               │
│    │  5. Fill form data     │                            │               │
│    │──────────────────────▶│                            │               │
│    │                        │                            │               │
│    │  6. Click Save         │                            │               │
│    │──────────────────────▶│  7. set(contracts/{id})    │               │
│    │                        │───────────────────────────▶│               │
│    │                        │                            │               │
│    │  8. Success toast      │  9. Confirm               │               │
│    │◀──────────────────────│◀───────────────────────────│               │
│    │                        │                            │               │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Contract Export Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        CONTRACT EXPORT FLOW                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   User         HopDongPage        Firebase        CloudFn    Sheets     │
│    │               │                  │              │          │        │
│    │  1. Export    │                  │              │          │        │
│    │──────────────▶│                  │              │          │        │
│    │               │                  │              │          │        │
│    │               │ 2. set(exported) │              │          │        │
│    │               │─────────────────▶│              │          │        │
│    │               │                  │              │          │        │
│    │               │                  │ 3. Trigger   │          │        │
│    │               │                  │─────────────▶│          │        │
│    │               │                  │              │          │        │
│    │               │                  │              │ 4. Format│        │
│    │               │                  │              │   row    │        │
│    │               │                  │              │          │        │
│    │               │                  │              │ 5.Append │        │
│    │               │                  │              │─────────▶│        │
│    │               │                  │              │          │        │
│    │ 6. Success    │  7. Confirm     │              │          │        │
│    │◀──────────────│◀─────────────────│              │          │        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.3 BieuMau Print Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         BIỂU MẪU PRINT FLOW                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   HopDongDaXuatPage              BieuMau Component           Browser    │
│        │                              │                          │       │
│        │ 1. User selects contract     │                          │       │
│        │ 2. Click print icon          │                          │       │
│        │                              │                          │       │
│        │ 3. navigate('/bieu-mau', {   │                          │       │
│        │      state: contractData     │                          │       │
│        │    })                        │                          │       │
│        │─────────────────────────────▶│                          │       │
│        │                              │                          │       │
│        │                              │ 4. useLocation()         │       │
│        │                              │    Extract data          │       │
│        │                              │                          │       │
│        │                              │ 5. getBranch(showroom)   │       │
│        │                              │    Lookup branch info    │       │
│        │                              │                          │       │
│        │                              │ 6. Render form           │       │
│        │                              │    with data             │       │
│        │                              │                          │       │
│        │                              │ 7. User clicks print     │       │
│        │                              │─────────────────────────▶│       │
│        │                              │                          │       │
│        │                              │ 8. window.print()        │       │
│        │                              │─────────────────────────▶│       │
│        │                              │                          │       │
│        │                              │ 9. Print dialog          │       │
│        │                              │◀─────────────────────────│       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Deployment Architecture

### 7.1 Deployment Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DEPLOYMENT ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                         ┌─────────────────┐                             │
│                         │   GitHub Repo   │                             │
│                         │   (main branch) │                             │
│                         └────────┬────────┘                             │
│                                  │                                       │
│                    ┌─────────────┴─────────────┐                        │
│                    │                           │                        │
│                    ▼                           ▼                        │
│           ┌────────────────┐         ┌────────────────┐                 │
│           │    Vercel      │         │    Firebase    │                 │
│           │   (Frontend)   │         │  (Functions)   │                 │
│           │                │         │                │                 │
│           │  • Auto deploy │         │  • Deploy via  │                 │
│           │    on push     │         │    firebase    │                 │
│           │  • CDN edge    │         │    deploy      │                 │
│           │  • SSL cert    │         │                │                 │
│           │  • SPA routing │         │  Region:       │                 │
│           │                │         │  asia-southeast│                 │
│           └────────────────┘         └────────────────┘                 │
│                    │                           │                        │
│                    └───────────┬───────────────┘                        │
│                                │                                        │
│                                ▼                                        │
│                    ┌────────────────────────┐                           │
│                    │  Firebase Realtime DB  │                           │
│                    │  (asia-southeast1)     │                           │
│                    └────────────────────────┘                           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Vercel Configuration

```json
// vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### 7.3 Firebase Configuration

```json
// firebase.json
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
  }
}
```

---

## 8. Environment Configuration

### 8.1 Frontend Environment (.env)

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=vinfast-d5bd8.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vinfast-d5bd8
VITE_FIREBASE_DATABASE_URL=https://vinfast-d5bd8-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_STORAGE_BUCKET=vinfast-d5bd8.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
VITE_FIREBASE_MEASUREMENT_ID=xxx
```

### 8.2 Cloud Functions Environment (functions/.env)

```bash
# Google Sheets Configuration
SHEETS_ID=xxx
GOOGLE_SERVICE_ACCOUNT={"client_email":"...","private_key":"..."}
```

---

## 9. Performance Considerations

### 9.1 Frontend Optimizations

| Optimization | Implementation |
|-------------|----------------|
| Code splitting | Vite auto-splits chunks |
| Lazy loading | React.lazy for routes (future) |
| Image optimization | Cloudinary for car images |
| Bundle analysis | `npm run build` shows sizes |

### 9.2 Database Optimizations

| Optimization | Implementation |
|-------------|----------------|
| Indexes | `.indexOn` for query fields |
| Denormalization | Store showroom name in contract |
| Pagination | Load contracts in chunks |
| Real-time subscriptions | Single listener per collection |

### 9.3 Cloud Functions Optimizations

| Optimization | Implementation |
|-------------|----------------|
| Cold start | Functions v2 with min instances |
| Region | asia-southeast1 (nearest to users) |
| Memory | 256MB default (sufficient) |
| Timeout | 60s default |

---

## 10. Monitoring & Logging

### 10.1 Firebase Console
- Authentication: User management
- Realtime Database: Data browser, rules testing
- Functions: Logs, invocation metrics

### 10.2 Vercel Dashboard
- Deployment logs
- Function invocations
- Error tracking

### 10.3 Application Logging

```javascript
// Development logging
console.log('Debug:', data);

// Production: Use Firebase Functions logger
const { logger } = require("firebase-functions");
logger.info('Contract exported:', contractId);
logger.error('Error:', error);
```
