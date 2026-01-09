# API Documentation

## Overview

VinFast Dealer Management System uses **Firebase Realtime Database** as the backend, with **Cloud Functions** for server-side logic. There are no traditional REST API endpoints - all data access goes through Firebase.

---

## Authentication API

### Firebase Auth Endpoints

#### Sign Up
```javascript
import { createUserWithEmailAndPassword } from 'firebase/auth';

const handleSignUp = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};
```

#### Sign In
```javascript
import { signInWithEmailAndPassword } from 'firebase/auth';

const handleLogin = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};
```

#### Sign Out
```javascript
import { signOut } from 'firebase/auth';

const handleLogout = async () => {
  await signOut(auth);
};
```

#### Get Current User
```javascript
import { onAuthStateChanged } from 'firebase/auth';

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('Current user:', user.email);
  } else {
    console.log('No user logged in');
  }
});
```

---

## Realtime Database API

### Database Structure

```
vinfast-d5bd8-default-rtdb/
├── contracts/                    # Draft contracts
├── exportedContracts/            # Exported contracts
├── vsoCounters/                  # VSO sequence counters
├── promotions/                   # Active promotions
├── employees/                    # Employee records
├── customers/                    # Customer records
└── dailySummaries/              # Daily statistics
```

### Read Operations

#### Get Single Record
```javascript
import { ref, get } from 'firebase/database';

const getContract = async (contractId) => {
  const snapshot = await get(ref(database, `contracts/${contractId}`));
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return null;
};
```

#### Get All Records
```javascript
import { ref, get } from 'firebase/database';

const getAllContracts = async () => {
  const snapshot = await get(ref(database, 'contracts'));
  if (snapshot.exists()) {
    return Object.entries(snapshot.val()).map(([id, data]) => ({
      id,
      ...data
    }));
  }
  return [];
};
```

#### Real-Time Listener (Recommended)
```javascript
import { ref, onValue } from 'firebase/database';
import { useEffect, useState } from 'react';

function useContracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onValue(
      ref(database, 'contracts'),
      (snapshot) => {
        const data = snapshot.val();
        setContracts(
          data
            ? Object.entries(data).map(([id, contract]) => ({
                id,
                ...contract
              }))
            : []
        );
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { contracts, loading };
}

// Usage in component
function HopDongPage() {
  const { contracts, loading } = useContracts();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {contracts.map(contract => (
        <div key={contract.id}>{contract.tenKh}</div>
      ))}
    </div>
  );
}
```

#### Query with Filters
```javascript
import { ref, query, orderByChild, equalTo } from 'firebase/database';

// Get contracts by showroom
const getContractsByShowroom = async (showroom) => {
  const q = query(
    ref(database, 'exportedContracts'),
    orderByChild('showroom'),
    equalTo(showroom)
  );
  const snapshot = await get(q);
  return snapshot.val() || {};
};

// Get contracts by date range (requires client-side filtering)
const getContractsByDateRange = async (startDate, endDate) => {
  const snapshot = await get(ref(database, 'exportedContracts'));
  if (!snapshot.exists()) return [];

  return Object.entries(snapshot.val())
    .filter(([, contract]) => {
      const contractDate = new Date(contract.ngayXhd);
      return contractDate >= startDate && contractDate <= endDate;
    })
    .map(([id, contract]) => ({ id, ...contract }));
};
```

### Write Operations

#### Create New Record
```javascript
import { ref, push, set } from 'firebase/database';

const createContract = async (contractData) => {
  const newRef = push(ref(database, 'contracts'));
  await set(newRef, {
    ...contractData,
    createdAt: new Date().toISOString()
  });
  return newRef.key; // Return generated ID
};
```

#### Update Existing Record
```javascript
import { ref, update } from 'firebase/database';

const updateContract = async (contractId, updates) => {
  await update(ref(database, `contracts/${contractId}`), {
    ...updates,
    updatedAt: new Date().toISOString()
  });
};
```

#### Delete Record
```javascript
import { ref, remove } from 'firebase/database';

const deleteContract = async (contractId) => {
  await remove(ref(database, `contracts/${contractId}`));
};
```

#### Atomic Increment (VSO Counter)
```javascript
import { ref, runTransaction } from 'firebase/database';

const incrementVSOCounter = async (maDms, year, month) => {
  const counterKey = `${maDms}-${year}-${month}`;
  const counterRef = ref(database, `vsoCounters/${counterKey}`);

  const result = await runTransaction(counterRef, (currentValue) => {
    return (currentValue || 0) + 1;
  });

  return result.val(); // Returns new counter value
};
```

---

## Contract Data Schema

### Contracts Collection

**Path**: `/contracts/{contractId}`

```typescript
{
  id: string;                    // Unique identifier
  stt: string;                   // Serial number
  tenKh: string;                 // Customer name
  cccd: string;                  // ID/Passport number
  soDienThoai: string;           // Phone number
  email?: string;                // Email address
  diaChi: string;                // Address
  dongXe: string;                // Vehicle model (VF 3-9, Minio, Herio, etc)
  phienBan: string;              // Vehicle trim (Plus, Eco, etc)
  ngoaiThat: string;             // Exterior color
  noiThat?: string;              // Interior color
  giaNiemYet: number;            // List price (VND)
  giaGiam: number;               // Discount amount (VND)
  giaHopDong: number;            // Contract price (VND)
  soTienCoc: number;             // Deposit amount (VND)
  soTienVay?: number;            // Loan amount (VND)
  nganHang?: string;             // Bank name
  laiSuat?: number;              // Interest rate (%)
  kyHan?: string;                // Loan term (months)
  showroom: string;              // Showroom name
  vso: string;                   // VSO code (S00901-VSO-25-01-0001)
  tvbh?: string;                 // Sales person name
  tinhTrang: string;             // Status (nháp/xuất/hoàn thành)
  quaTang?: string;              // Gift/promotion text
  ghiChu?: string;               // Notes
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
  createdBy?: string;            // Creator email
}
```

### Exported Contracts Collection

**Path**: `/exportedContracts/{contractId}`

Same as contracts, plus:

```typescript
{
  exportedAt: string;            // ISO timestamp when exported
  exportedBy: string;            // Email of person who exported
  googleSheetsRowNumber?: number; // Row number in Google Sheets
}
```

---

## VSO Counter Schema

**Path**: `/vsoCounters/{key}` (e.g., `S00901-25-01`)

```typescript
number  // Sequential counter value
```

**Format**: `{showroomCode}-{YY}-{MM}`
**Example**: `S00901-25-01` = 42 (meaning next VSO will be 0043)

---

## Promotions Schema

**Path**: `/promotions/{promotionId}`

```typescript
{
  id: string;                    // Unique identifier
  name: string;                  // Promotion name (e.g., "Giảm 50 triệu VF 7")
  type: string;                  // "fixed" | "percent" | "display"
  value: number;                 // Discount value
  dongXe: string[];              // Applicable vehicle models
  active: boolean;               // Is promotion active
  startDate?: string;            // ISO timestamp
  endDate?: string;              // ISO timestamp
  description?: string;          // Promotion description
}
```

---

## Employees Schema

**Path**: `/employees/{employeeId}`

```typescript
{
  id: string;                    // Unique identifier
  name: string;                  // Full name
  position: string;              // Job position
  department: string;            // Department
  showroom: string;              // Assigned showroom
  phone: string;                 // Phone number
  email: string;                 // Email address
  startDate?: string;            // ISO timestamp
}
```

---

## Customers Schema

**Path**: `/customers/{customerId}`

```typescript
{
  id: string;                    // Unique identifier
  name: string;                  // Full name
  cccd: string;                  // ID/Passport number
  phone: string;                 // Phone number
  email: string;                 // Email address
  address: string;               // Address
  contracts: string[];           // Array of contract IDs
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}
```

---

## Daily Summaries Schema

**Path**: `/dailySummaries/{YYYY-MM-DD}`

```typescript
{
  contractCount: number;         // Number of contracts created
  totalValue: number;            // Total contract value (VND)
  byShowroom: {
    [showroomName: string]: {
      count: number;
      value: number;
    }
  };
  generatedAt: string;           // ISO timestamp
}
```

---

## Cloud Functions API

### onContractExported

**Trigger**: When a new contract is created in `/exportedContracts/{contractId}`

**Action**: Automatically sync to Google Sheets

```javascript
// Triggered automatically - no manual invocation needed

// Function appends row to "HopDongDaXuat" sheet with columns A-X
// See system-architecture.md for column mapping
```

### onContractUpdated

**Trigger**: When a contract is updated in `/exportedContracts/{contractId}`

**Action**: Update corresponding row in Google Sheets

```javascript
// Triggered automatically when contract updated
// Finds matching row and updates all columns
```

### dailySummary

**Trigger**: Schedule - 2 AM Vietnam time daily

**Action**: Generate daily statistics summary

```javascript
// Automatically runs at 2:00 AM Asia/Ho_Chi_Minh timezone
// Generates /dailySummaries/{YYYY-MM-DD} with stats

// Example output:
{
  contractCount: 15,
  totalValue: 12000000000,
  byShowroom: {
    "Trường Chinh": { count: 8, value: 6800000000 },
    "Thủ Đức": { count: 5, value: 4200000000 },
    "Âu Cơ": { count: 2, value: 1000000000 }
  },
  generatedAt: "2026-01-09T02:00:00Z"
}
```

### syncToSheets (HTTP Function)

**Trigger**: HTTP GET request

**Endpoint**: `https://region-project.cloudfunctions.net/syncToSheets`

**Purpose**: Manual sync all contracts to Google Sheets

```bash
# Trigger manual sync
curl -X GET \
  "https://asia-southeast1-vinfast-d5bd8.cloudfunctions.net/syncToSheets"
```

**Response**:
```json
{
  "success": true,
  "rowsUpdated": 127,
  "timestamp": "2026-01-09T14:30:00Z"
}
```

---

## Security Rules

### Current Rules (database.rules.json)

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

### What This Means

- ✅ Authenticated users can read all data
- ✅ Authenticated users can write all data
- ❌ Unauthenticated users cannot access any data
- 🔍 Queries on `exportedContracts` are indexed for performance

### Best Practices

1. **Always authenticate** before accessing database
2. **Never expose credentials** in client-side code
3. **Use `.env` file** for sensitive configuration
4. **Validate input** on client before saving
5. **Use transactions** for atomic operations (like VSO counter)

---

## Error Handling

### Common Firebase Errors

| Error Code | Meaning | Solution |
|-----------|---------|----------|
| `PERMISSION_DENIED` | User not authenticated or lacks permission | Login or update security rules |
| `NETWORK_ERROR` | Connection issue | Check internet, retry with exponential backoff |
| `INVALID_ARGUMENT` | Invalid data format | Validate data before sending |
| `UNAUTHENTICATED` | No auth token | Call `signIn()` first |

### Error Handling Example

```javascript
try {
  const contract = await getContract(contractId);
  // Use contract
} catch (error) {
  switch (error.code) {
    case 'PERMISSION_DENIED':
      console.error('Not authorized');
      break;
    case 'NETWORK_ERROR':
      console.error('Network issue - will retry');
      // Implement retry logic
      break;
    default:
      console.error('Error:', error.message);
  }
}
```

---

## Rate Limiting

Firebase has built-in rate limiting:

- **Concurrent connections**: Unlimited for authenticated users
- **Write rate**: ~16 MB/second per database
- **Read rate**: Unlimited

For high-volume operations:
- Use batch operations
- Implement pagination
- Add delays between writes

---

## Pagination Example

```javascript
const ITEMS_PER_PAGE = 20;

const getPaginatedContracts = async (page = 1) => {
  const snapshot = await get(ref(database, 'exportedContracts'));
  if (!snapshot.exists()) return [];

  const allContracts = Object.entries(snapshot.val()).map(([id, contract]) => ({
    id,
    ...contract
  }));

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  return {
    data: allContracts.slice(startIndex, endIndex),
    total: allContracts.length,
    page,
    totalPages: Math.ceil(allContracts.length / ITEMS_PER_PAGE)
  };
};
```

---

## Batch Operations

```javascript
import { ref, update } from 'firebase/database';

const batchUpdateContracts = async (updates) => {
  const batchUpdates = {};

  updates.forEach(({ contractId, data }) => {
    batchUpdates[`contracts/${contractId}`] = data;
  });

  await update(ref(database), batchUpdates);
};

// Usage
await batchUpdateContracts([
  { contractId: 'id1', data: { tinhTrang: 'xuất' } },
  { contractId: 'id2', data: { tinhTrang: 'hoàn thành' } }
]);
```

---

## Monitoring API Usage

### View in Firebase Console

1. Go to Firebase Console
2. Select project → Realtime Database
3. Check "Usage" tab for:
   - Concurrent connections
   - Data downloaded/uploaded
   - Bandwidth usage

### Check Logs

```bash
# View Firebase logs
firebase functions:log --project=vinfast-d5bd8 --limit=100
```

---

## Resources

- [Firebase Realtime Database Docs](https://firebase.google.com/docs/database)
- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firebase Cloud Functions Docs](https://firebase.google.com/docs/functions)
- [Firebase Security Rules](https://firebase.google.com/docs/database/security)

---

**Last Updated**: 2026-01-09
**API Version**: 1.0 (Firebase Realtime Database)
