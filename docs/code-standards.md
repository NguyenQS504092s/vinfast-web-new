# Code Standards & Conventions

## 1. Naming Conventions

### 1.1 File Naming

| Type | Convention | Ví dụ |
|------|------------|-------|
| **Pages** | PascalCase + `Page.jsx` suffix | `ContractFormPage.jsx`, `HopDongDaXuatPage.jsx` |
| **BieuMau** | Vietnamese name, PascalCase | `HopDongMuaBanXe.jsx`, `GiayXacNhan.jsx` |
| **Shared Components** | English, PascalCase | `CurrencyInput.jsx`, `Pagination.jsx` |
| **Layout Components** | English, PascalCase | `Header.jsx`, `Footer.jsx` |
| **Data Files** | camelCase + `.js` | `branchData.js`, `calculatorData.js` |
| **Utils** | camelCase + `.js` | `vsoGenerator.js`, `vndToWords.js` |
| **Test Files** | Same name + `.test.jsx` | `Header.test.jsx` |

### 1.2 Variable Naming

Dự án sử dụng **hỗn hợp tiếng Việt và tiếng Anh** cho tên biến:

```javascript
// Vietnamese field names (business domain)
const tenKh = "Nguyễn Văn A";           // Tên khách hàng
const cccd = "079123456789";             // CCCD/CMND
const dongXe = "VF 7";                   // Dòng xe
const soTienCoc = 50000000;              // Số tiền cọc
const giaNiemYet = 850000000;            // Giá niêm yết
const giaHopDong = 800000000;            // Giá hợp đồng
const tinhTrang = "xuất";                // Tình trạng
const showroom = "Trường Chinh";         // Showroom

// English for technical/common terms
const isLoading = true;
const handleSubmit = () => {};
const formatCurrency = (value) => {};
const selectedContract = {};
```

### 1.3 Component Naming

```jsx
// PascalCase for components
function ContractFormPage() { ... }
function GiayXacNhan() { ... }
function CurrencyInput({ value, onChange }) { ... }

// camelCase for handlers
const handleInputChange = (e) => { ... };
const handleSubmit = async () => { ... };
const handlePrint = () => { ... };
```

### 1.4 Constants

```javascript
// UPPER_SNAKE_CASE for constants
const FIREBASE_PATHS = {
  CONTRACTS: 'contracts',
  EXPORTED_CONTRACTS: 'exportedContracts',
  VSO_COUNTERS: 'vsoCounters',
};

// camelCase for config objects
const defaultBranch = {
  id: 2,
  maDms: 'S00901',
  displayName: 'Chi Nhánh Trường Chinh',
};
```

---

## 2. Component Patterns

### 2.1 Page Component Structure

```jsx
// Typical page structure
import { useState, useEffect } from 'react';
import { database } from '../firebase/config';
import { ref, onValue, update } from 'firebase/database';

function ExamplePage() {
  // 1. State declarations
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Firebase subscriptions
  useEffect(() => {
    const dataRef = ref(database, 'path/to/data');
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const value = snapshot.val();
      setData(value ? Object.entries(value) : []);
      setIsLoading(false);
    }, (error) => {
      setError(error.message);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 3. Event handlers
  const handleAction = async () => {
    try {
      await update(ref(database, 'path'), newData);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // 4. Render
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Content */}
    </div>
  );
}

export default ExamplePage;
```

### 2.2 BieuMau Component Structure

```jsx
import { useLocation } from 'react-router-dom';
import { getBranchByShowroomName } from '../../data/branchData';

function BieuMauExample() {
  const location = useLocation();
  const contractData = location.state || {};

  // Lookup branch info
  const branch = getBranchByShowroomName(contractData.showroom);

  // Format helpers
  const formatDate = (dateStr) => {
    if (!dateStr) return '___/___/______';
    // ... format logic
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="print:p-0">
      {/* Print button - hide when printing */}
      <button 
        onClick={handlePrint}
        className="print:hidden fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        In biểu mẫu
      </button>

      {/* Printable content */}
      <div id="printable-content" className="max-w-[210mm] mx-auto bg-white p-8 print:p-0">
        {/* Form content */}
      </div>
    </div>
  );
}

export default BieuMauExample;
```

### 2.3 Shared Component Pattern

```jsx
// CurrencyInput.jsx - Example of a controlled input component
import { useState, useEffect, useRef } from 'react';

/**
 * Currency input with Vietnamese IME support
 * @param {number} value - Raw numeric value
 * @param {function} onChange - Callback with parsed number
 * @param {string} className - Additional CSS classes
 */
function CurrencyInput({ value, onChange, className = '', ...props }) {
  const [displayValue, setDisplayValue] = useState('');
  const inputRef = useRef(null);

  // Sync display value with prop
  useEffect(() => {
    if (value) {
      setDisplayValue(formatNumber(value));
    }
  }, [value]);

  const formatNumber = (num) => {
    return num.toLocaleString('vi-VN');
  };

  const parseNumber = (str) => {
    return parseInt(str.replace(/\D/g, ''), 10) || 0;
  };

  const handleChange = (e) => {
    const rawValue = e.target.value;
    setDisplayValue(rawValue);
    onChange(parseNumber(rawValue));
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={displayValue}
      onChange={handleChange}
      className={`border rounded px-3 py-2 ${className}`}
      {...props}
    />
  );
}

export default CurrencyInput;
```

---

## 3. State Management

### 3.1 Local State with useState

```javascript
// Simple state
const [isOpen, setIsOpen] = useState(false);

// Object state
const [formData, setFormData] = useState({
  tenKh: '',
  cccd: '',
  soDienThoai: '',
  // ...
});

// Update object state (immutable)
const updateField = (field, value) => {
  setFormData(prev => ({
    ...prev,
    [field]: value
  }));
};
```

### 3.2 Firebase Real-time State

```javascript
// Real-time subscription pattern
useEffect(() => {
  const contractsRef = ref(database, 'exportedContracts');
  
  const unsubscribe = onValue(contractsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const contractArray = Object.entries(data).map(([id, contract]) => ({
        id,
        ...contract
      }));
      setContracts(contractArray);
    } else {
      setContracts([]);
    }
    setLoading(false);
  });

  return () => unsubscribe();
}, []);
```

### 3.3 Navigation State

```javascript
// Passing data via navigation
import { useNavigate, useLocation } from 'react-router-dom';

// Sender
const navigate = useNavigate();
navigate('/bieu-mau', { state: contractData });

// Receiver
const location = useLocation();
const data = location.state || {};
```

---

## 4. Styling Conventions

### 4.1 TailwindCSS Classes

```jsx
// Standard layout
<div className="container mx-auto px-4 py-6">

// Card/Panel
<div className="bg-white rounded-lg shadow-md p-6">

// Form input
<input className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

// Primary button
<button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors">

// Table
<table className="w-full border-collapse">
  <thead className="bg-gray-100">
    <tr>
      <th className="border border-gray-300 px-4 py-2 text-left">
```

### 4.2 Print Styles

```jsx
// Hide when printing
<div className="print:hidden">
  {/* Non-printable content */}
</div>

// Show only when printing
<div className="hidden print:block">
  {/* Print-only content */}
</div>

// Print layout
<div className="print:p-0 print:m-0 print:shadow-none">
```

### 4.3 Custom CSS (index.css)

```css
/* Print page settings */
@media print {
  @page {
    size: A4;
    margin: 10mm;
  }

  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Prevent page breaks inside elements */
  .no-break {
    page-break-inside: avoid !important;
  }
}

/* Vietnamese font support */
body {
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
}
```

---

## 5. Currency Handling

### 5.1 Using CurrencyInput Component

```jsx
import CurrencyInput from '../components/shared/CurrencyInput';

// Usage
<CurrencyInput
  value={formData.soTienCoc}
  onChange={(value) => setFormData(prev => ({ ...prev, soTienCoc: value }))}
  placeholder="Nhập số tiền cọc"
/>
```

### 5.2 Parse & Format Utilities

```javascript
// Parse string to number
const parseValue = (val) => {
  if (!val) return 0;
  if (typeof val === 'string') {
    return parseFloat(val.replace(/[^\d]/g, '')) || 0;
  }
  return typeof val === 'number' ? val : 0;
};

// Format number to Vietnamese currency
const formatCurrency = (value) => {
  if (!value) return '0';
  return value.toLocaleString('vi-VN');
};

// Format with VND suffix
const formatVND = (value) => {
  return `${formatCurrency(value)} VNĐ`;
};
```

### 5.3 Number to Words (Vietnamese)

```javascript
import { convertToWords } from '../utils/vndToWords';

// Convert number to Vietnamese words
const amount = 850000000;
const words = convertToWords(amount);
// Output: "Tám trăm năm mươi triệu đồng"
```

---

## 6. Print Layout Conventions

### 6.1 A4 Page Structure

```jsx
<div className="max-w-[210mm] mx-auto bg-white">
  {/* Header */}
  <div className="flex justify-between border-b pb-4 mb-4">
    <div className="text-sm">
      <p>CÔNG TY...</p>
      <p>Địa chỉ:...</p>
    </div>
    <div className="text-center">
      <h1 className="text-lg font-bold">TÊN BIỂU MẪU</h1>
    </div>
  </div>

  {/* Content */}
  <div className="space-y-4">
    {/* Sections */}
  </div>

  {/* Signatures - Always at bottom */}
  <div className="mt-8 flex justify-between">
    <div className="text-center w-1/3">
      <p className="font-bold">BÊN A</p>
      <p className="text-sm">(Ký, ghi rõ họ tên)</p>
    </div>
    <div className="text-center w-1/3">
      <p className="font-bold">BÊN B</p>
      <p className="text-sm">(Ký, ghi rõ họ tên)</p>
    </div>
  </div>
</div>
```

### 6.2 Print Validation

```javascript
// Required fields for printing
const requiredFields = [
  { key: 'tenKh', label: 'Họ tên KH' },
  { key: 'cccd', label: 'CCCD/CMT/Hộ chiếu' },
  { key: 'soDienThoai', label: 'Số điện thoại' },
  { key: 'diaChi', label: 'Địa chỉ' },
  { key: 'dongXe', label: 'Dòng xe' },
  { key: 'ngoaiThat', label: 'Màu xe' },
];

const getMissingFields = (contract) => {
  return requiredFields
    .filter(field => !contract[field.key])
    .map(field => field.label);
};

// Disable print if missing required fields
const missingFields = getMissingFields(contract);
const canPrint = missingFields.length === 0;
```

### 6.3 Showroom Handling (CRITICAL)

```jsx
// NEVER use default branch on legal documents
// Always show placeholder if showroom not selected

const branch = getBranchByShowroomName(contract.showroom);

// In form display
<span className={!branch ? 'text-red-500' : ''}>
  {branch?.name || '[Chưa chọn showroom]'}
</span>

// Tax code
<span>{branch?.taxCode || '________________'}</span>

// Bank account
<span>{branch?.bankAccount || '________________'}</span>
```

---

## 7. Firebase Patterns

### 7.1 Reading Data

```javascript
// One-time read
const snapshot = await get(ref(database, 'exportedContracts'));
const data = snapshot.val();

// Real-time listener
const unsubscribe = onValue(ref(database, 'contracts'), (snapshot) => {
  const data = snapshot.val();
  // Update state
});

// Cleanup
return () => unsubscribe();
```

### 7.2 Writing Data

```javascript
// Create new record
const newRef = push(ref(database, 'contracts'));
await set(newRef, contractData);

// Update existing
await update(ref(database, `contracts/${id}`), {
  tinhTrang: 'xuất',
  updatedAt: new Date().toISOString()
});

// Delete
await remove(ref(database, `contracts/${id}`));
```

### 7.3 Atomic Operations (VSO Counter)

```javascript
// Use transaction for atomic increment
const result = await runTransaction(counterRef, (currentValue) => {
  return (currentValue || 0) + 1;
});
```

---

## 8. Error Handling

```javascript
// Async operations
try {
  await update(ref(database, path), data);
  toast.success('Lưu thành công!');
} catch (error) {
  console.error('Error saving:', error);
  toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
}

// Form validation
const validateForm = () => {
  const errors = {};
  
  if (!formData.tenKh?.trim()) {
    errors.tenKh = 'Vui lòng nhập họ tên khách hàng';
  }
  
  if (!formData.cccd?.trim()) {
    errors.cccd = 'Vui lòng nhập số CCCD';
  }
  
  return Object.keys(errors).length === 0 ? null : errors;
};
```

---

## 9. Important Rules

### 9.1 Critical Business Rules

1. **No hardcoded branch defaults** on legal documents
2. **Always validate required fields** before printing
3. **Use atomic transactions** for VSO counter
4. **Filter promotions by dongXe** when model is selected

### 9.2 Code Quality Rules

1. **No console.log in production** - use proper error handling
2. **Always cleanup subscriptions** in useEffect
3. **Use descriptive variable names** (Vietnamese ok for business terms)
4. **Keep components focused** - one responsibility per component
5. **Test print layouts** with Print Preview (Ctrl+P)
