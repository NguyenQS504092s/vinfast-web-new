# Error Handling & Best Practices

## Overview

This document outlines error handling patterns and strategies used throughout the VinFast application.

---

## 1. Firebase Authentication Errors

### Login Errors

```javascript
// src/pages/Login.jsx
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

const handleLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    navigate('/');
  } catch (error) {
    switch (error.code) {
      case 'auth/user-not-found':
        setError('Email không tồn tại trong hệ thống');
        break;
      case 'auth/wrong-password':
        setError('Mật khẩu không đúng');
        break;
      case 'auth/too-many-login-attempts':
        setError('Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau.');
        break;
      case 'auth/invalid-email':
        setError('Định dạng email không hợp lệ');
        break;
      default:
        setError(`Lỗi: ${error.message}`);
    }
  }
};
```

### Auth State Errors

```javascript
// src/components/ProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        console.error('Auth error:', error);
        setError('Không thể xác thực. Vui lòng đăng nhập lại.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="flex justify-center p-8">Đang tải...</div>;
  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!user) return <Navigate to="/dang-nhap" replace />;

  return children;
}

export default ProtectedRoute;
```

---

## 2. Firebase Database Errors

### Read Operations

```javascript
// Pattern for reading data with error handling
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase/config';

function ExamplePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const dataRef = ref(database, 'contracts');

    const unsubscribe = onValue(
      dataRef,
      (snapshot) => {
        try {
          const value = snapshot.val();
          setData(value ? Object.entries(value) : []);
          setError(null);
        } catch (err) {
          console.error('Error processing data:', err);
          setError('Lỗi xử lý dữ liệu');
        }
        setLoading(false);
      },
      (error) => {
        console.error('Firebase read error:', error);

        switch (error.code) {
          case 'PERMISSION_DENIED':
            setError('Bạn không có quyền truy cập dữ liệu này');
            break;
          case 'NETWORK_ERROR':
            setError('Lỗi kết nối. Vui lòng kiểm tra internet');
            break;
          default:
            setError(`Lỗi: ${error.message}`);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return <div>{/* Render data */}</div>;
}
```

### Write Operations

```javascript
// Pattern for writing data with error handling
import { ref, set, update } from 'firebase/database';
import { database } from '../firebase/config';
import { toast } from 'react-toastify';

const handleSave = async (contractId, data) => {
  try {
    // Validate data first
    if (!data.tenKh?.trim()) {
      toast.error('Vui lòng nhập tên khách hàng');
      return;
    }

    if (!data.cccd?.trim()) {
      toast.error('Vui lòng nhập số CCCD');
      return;
    }

    // Attempt write
    const contractRef = ref(database, `contracts/${contractId}`);
    await set(contractRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });

    toast.success('Lưu thành công!');
  } catch (error) {
    console.error('Save error:', error);

    switch (error.code) {
      case 'PERMISSION_DENIED':
        toast.error('Bạn không có quyền lưu dữ liệu này');
        break;
      case 'NETWORK_ERROR':
        toast.error('Lỗi kết nối. Dữ liệu sẽ được lưu lại khi có kết nối');
        break;
      default:
        toast.error('Lỗi: Không thể lưu. Vui lòng thử lại.');
    }
  }
};
```

---

## 3. Form Validation Errors

### Contract Form Validation

```javascript
// src/pages/ContractFormPage.jsx
const validateForm = (formData) => {
  const errors = {};

  // Required fields
  const requiredFields = [
    { key: 'tenKh', label: 'Tên khách hàng' },
    { key: 'cccd', label: 'CCCD/CMT' },
    { key: 'soDienThoai', label: 'Số điện thoại' },
    { key: 'diaChi', label: 'Địa chỉ' },
    { key: 'dongXe', label: 'Dòng xe' },
    { key: 'showroom', label: 'Showroom' }
  ];

  requiredFields.forEach(({ key, label }) => {
    if (!formData[key]?.toString().trim()) {
      errors[key] = `${label} là bắt buộc`;
    }
  });

  // Phone validation
  if (formData.soDienThoai) {
    const phoneRegex = /^(0|\+84)\d{9,10}$/;
    if (!phoneRegex.test(formData.soDienThoai.replace(/\s/g, ''))) {
      errors.soDienThoai = 'Số điện thoại không hợp lệ';
    }
  }

  // Email validation (optional)
  if (formData.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Email không hợp lệ';
    }
  }

  // CCCD validation
  if (formData.cccd) {
    const cccdRegex = /^\d{9}(\d{2})?$/; // 9 or 12 digits
    if (!cccdRegex.test(formData.cccd.replace(/\s/g, ''))) {
      errors.cccd = 'CCCD/CMT phải từ 9-12 chữ số';
    }
  }

  // Price validation
  if (formData.giaNiemYet && formData.giaNiemYet < 0) {
    errors.giaNiemYet = 'Giá không thể âm';
  }

  if (formData.soTienCoc && formData.soTienCoc < 0) {
    errors.soTienCoc = 'Tiền cọc không thể âm';
  }

  return Object.keys(errors).length === 0 ? null : errors;
};

// Usage in form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = validateForm(formData);
  if (validationErrors) {
    setErrors(validationErrors);
    toast.error('Vui lòng sửa các lỗi trên');
    return;
  }

  // Proceed with save
  await handleSave();
};
```

---

## 4. Print Form Validation

### Print Validation Pattern

```javascript
// Pattern for checking required fields before printing
const requiredFieldsForPrint = [
  { key: 'tenKh', label: 'Tên khách hàng' },
  { key: 'cccd', label: 'CCCD/CMT' },
  { key: 'soDienThoai', label: 'Số điện thoại' },
  { key: 'diaChi', label: 'Địa chỉ' },
  { key: 'dongXe', label: 'Dòng xe' },
  { key: 'showroom', label: 'Showroom' },
  { key: 'ngoaiThat', label: 'Màu ngoài' }
];

const getMissingFields = (contract) => {
  return requiredFieldsForPrint
    .filter(field => !contract[field.key])
    .map(field => field.label);
};

// In component
const missingFields = getMissingFields(contractData);
const canPrint = missingFields.length === 0;

return (
  <>
    {!canPrint && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <strong>Không thể in:</strong> Vui lòng điền đầy đủ thông tin:
        {missingFields.map(field => <li key={field}>{field}</li>)}
      </div>
    )}

    <button
      onClick={() => window.print()}
      disabled={!canPrint}
      className={`px-4 py-2 rounded ${
        canPrint
          ? 'bg-blue-600 hover:bg-blue-700 text-white'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      }`}
    >
      In biểu mẫu
    </button>
  </>
);
```

---

## 5. Async Operation Error Handling

### Contract Export

```javascript
// src/pages/HopDongDaXuatPage.jsx
const handleExport = async (contractId) => {
  try {
    setExporting(true);

    const contract = contracts.find(c => c.id === contractId);
    if (!contract) {
      toast.error('Hợp đồng không tồn tại');
      return;
    }

    const exportedRef = ref(database, `exportedContracts/${contractId}`);
    await set(exportedRef, {
      ...contract,
      exportedAt: new Date().toISOString(),
      exportedBy: user.email
    });

    toast.success('Xuất hợp đồng thành công!');

    // Trigger navigation to print form
    navigate('/hop-dong-mua-ban-xe', { state: contract });
  } catch (error) {
    console.error('Export error:', error);
    toast.error('Lỗi: Không thể xuất hợp đồng. Vui lòng thử lại.');
  } finally {
    setExporting(false);
  }
};
```

---

## 6. Network Error Recovery

### Retry Pattern

```javascript
// Retry utility with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Only retry on network errors, not auth errors
      if (error.code === 'NETWORK_ERROR') {
        // Exponential backoff: 1s, 2s, 4s
        const delayMs = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delayMs));
        continue;
      }

      // Non-network errors should fail immediately
      throw error;
    }
  }

  throw new Error(`Failed after ${maxRetries} retries: ${lastError.message}`);
}

// Usage
const handleSaveWithRetry = async (contractId, data) => {
  try {
    const contractRef = ref(database, `contracts/${contractId}`);
    await retryWithBackoff(() => set(contractRef, data));
    toast.success('Lưu thành công!');
  } catch (error) {
    console.error('Save failed:', error);
    toast.error('Lỗi: Không thể lưu dữ liệu. Vui lòng kiểm tra kết nối mạng.');
  }
};
```

---

## 7. Global Error Handling

### Error Boundary (Future Implementation)

```javascript
// src/components/ErrorBoundary.jsx
import { Component } from 'react';
import { toast } from 'react-toastify';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
    toast.error('Có lỗi xảy ra. Vui lòng tải lại trang.');
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto p-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <h2 className="font-bold">Lỗi ứng dụng</h2>
            <p>Có lỗi xảy ra. Vui lòng tải lại trang.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
            >
              Tải lại
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Usage in App.jsx
<ErrorBoundary>
  <Routes>
    {/* Routes */}
  </Routes>
</ErrorBoundary>
```

---

## 8. Console Logging Best Practices

### Development vs Production

```javascript
// Utility for conditional logging
const isDevelopment = import.meta.env.DEV;

export const logger = {
  debug: (message, data) => {
    if (isDevelopment) console.log(message, data);
  },

  info: (message, data) => {
    console.info(message, data);
  },

  error: (message, error) => {
    console.error(message, error);
    // In production, could send to error tracking service
  },

  warn: (message, data) => {
    console.warn(message, data);
  }
};

// Usage
logger.debug('Contract data:', contractData);
logger.error('Save failed:', error);
logger.warn('Deprecated function used', { function: 'oldFunc' });
```

---

## 9. Error Reporting

### Future: Error Tracking Service

```javascript
// When implementing Sentry or similar service
import * as Sentry from "@sentry/react";

// Initialize in main.jsx
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});

// In error handlers
try {
  await saveContract(data);
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      section: 'contract',
      action: 'save'
    }
  });
  toast.error('Lỗi: Không thể lưu hợp đồng');
}
```

---

## 10. Common Error Messages (Vietnamese)

| Error | User Message | Recovery |
|-------|-------------|----------|
| PERMISSION_DENIED | Bạn không có quyền truy cập | Contact admin |
| NETWORK_ERROR | Lỗi kết nối. Kiểm tra internet | Retry automatically |
| auth/user-not-found | Email không tồn tại | Register new account |
| auth/wrong-password | Mật khẩu không đúng | Reset password |
| Validation error | Vui lòng sửa các lỗi | User fixes form |
| Missing required field | [Field] là bắt buộc | User fills field |

---

## Best Practices Summary

1. **Always validate** user input before saving
2. **Provide helpful error messages** in Vietnamese
3. **Cleanup subscriptions** to prevent memory leaks
4. **Use try-catch** for async operations
5. **Log errors** for debugging (but not credentials)
6. **Show loading state** during long operations
7. **Implement retry logic** for network errors
8. **Test error scenarios** (network down, invalid data, etc.)
9. **Never expose sensitive** data in error messages
10. **Gracefully degrade** when features unavailable

---

**Last Updated**: 2026-01-09
