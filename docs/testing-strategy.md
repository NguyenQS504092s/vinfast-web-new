# Testing Strategy

## Overview

This document outlines the testing approach for VinFast Dealer Management System, including unit tests, integration tests, and manual testing procedures.

---

## Test Coverage Goals

| Level | Target Coverage | Status |
|-------|-----------------|--------|
| Unit Tests | 90% | 97% (33/34 pass) |
| Integration Tests | 80% | Manual |
| E2E Tests | 70% | Manual |
| Code Coverage | 85%+ | In progress |

---

## Unit Tests

### Test Framework

- **Framework**: Vitest
- **Configuration**: `tests/jest.setup.js`
- **Test Files Location**: `tests/` directory or alongside components with `.test.jsx`

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- showroom-logic.test.js

# Generate coverage report
npm test -- --coverage
```

### Current Test Coverage

```
tests/
├── showroom-fix-summary.md        # Test results summary
├── showroom-logic.test.js         # Showroom selection logic
├── showroom-logic-fix.test.js     # Showroom fix verification
├── editable-fields.test.js        # Editable field behavior
├── GiayXacNhanKieuLoai.test.js    # Form specific tests
├── GiayXacNhanTangBaoHiem.test.js # Form specific tests
└── README.md                      # Test documentation
```

**Current Status**: 33/34 tests pass (97%)

---

## Unit Test Examples

### Testing Components

```javascript
// tests/ExampleComponent.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import ExampleComponent from '../src/components/ExampleComponent';

describe('ExampleComponent', () => {
  test('renders component', () => {
    render(<ExampleComponent />);
    expect(screen.getByText(/example/i)).toBeInTheDocument();
  });

  test('handles button click', () => {
    const handleClick = jest.fn();
    render(<ExampleComponent onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });

  test('displays error message on validation failure', () => {
    render(<ExampleComponent data={{}} />);
    expect(screen.getByText(/required/i)).toBeInTheDocument();
  });
});
```

### Testing Firebase Integration

```javascript
// tests/firebase-integration.test.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get } from 'firebase/database';

// Use Firebase Emulator for testing
const firebaseConfig = {
  apiKey: 'AIzaSyDummyKeyForTesting',
  authDomain: 'test-project.firebaseapp.com',
  projectId: 'test-project',
  databaseURL: 'http://localhost:9000/?ns=test-project'
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

describe('Firebase Database Operations', () => {
  test('saves contract to database', async () => {
    const contractData = {
      tenKh: 'Nguyễn Văn A',
      cccd: '079123456789',
      dongXe: 'VF 7'
    };

    const contractRef = ref(database, 'contracts/test-123');
    await set(contractRef, contractData);

    const snapshot = await get(contractRef);
    expect(snapshot.val()).toEqual(contractData);
  });

  test('handles write permissions error', async () => {
    const restrictedRef = ref(database, 'admin/settings');

    await expect(set(restrictedRef, { restricted: true })).rejects.toThrow();
  });
});
```

### Testing Utility Functions

```javascript
// tests/vsoGenerator.test.js
import { generateVSO } from '../src/utils/vsoGenerator';

describe('VSO Generator', () => {
  test('generates valid VSO code format', () => {
    const vso = generateVSO('S00901', 35);
    expect(vso).toMatch(/^S\d{5}-VSO-\d{2}-\d{2}-\d{4}$/);
  });

  test('includes correct showroom code', () => {
    const vso = generateVSO('S00901', 35);
    expect(vso).toStartWith('S00901');
  });

  test('increments counter correctly', () => {
    const vso1 = generateVSO('S00501', 100);
    const vso2 = generateVSO('S00501', 101);

    const counter1 = parseInt(vso1.split('-').pop());
    const counter2 = parseInt(vso2.split('-').pop());

    expect(counter2).toBe(counter1 + 1);
  });
});

// tests/vndToWords.test.js
import { convertToWords } from '../src/utils/vndToWords';

describe('VND to Words Conversion', () => {
  test('converts simple numbers', () => {
    expect(convertToWords(1)).toBe('một');
    expect(convertToWords(10)).toBe('mười');
    expect(convertToWords(100)).toBe('một trăm');
  });

  test('converts large numbers', () => {
    const result = convertToWords(850000000);
    expect(result).toContain('trăm');
    expect(result).toContain('triệu');
  });

  test('handles zero', () => {
    expect(convertToWords(0)).toBe('không');
  });
});
```

---

## Integration Tests

### Contract Creation Flow

```javascript
// tests/contract-creation-flow.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContractFormPage from '../src/pages/ContractFormPage';
import { BrowserRouter } from 'react-router-dom';

describe('Contract Creation Flow', () => {
  test('complete contract creation workflow', async () => {
    const { container } = render(
      <BrowserRouter>
        <ContractFormPage />
      </BrowserRouter>
    );

    // 1. Select showroom
    const showroomSelect = screen.getByDisplayValue('Chọn showroom');
    fireEvent.change(showroomSelect, { target: { value: 'Trường Chinh' } });

    // 2. Wait for VSO generation
    await waitFor(() => {
      expect(screen.getByDisplayValue(/S00901-VSO/)).toBeInTheDocument();
    });

    // 3. Fill form fields
    const tenKhInput = screen.getByLabelText('Tên khách hàng');
    fireEvent.change(tenKhInput, { target: { value: 'Nguyễn Văn A' } });

    // 4. Submit form
    const submitBtn = screen.getByRole('button', { name: /lưu/i });
    fireEvent.click(submitBtn);

    // 5. Verify success
    await waitFor(() => {
      expect(screen.getByText(/lưu thành công/i)).toBeInTheDocument();
    });
  });

  test('shows validation errors', async () => {
    render(
      <BrowserRouter>
        <ContractFormPage />
      </BrowserRouter>
    );

    const submitBtn = screen.getByRole('button', { name: /lưu/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/tên khách hàng là bắt buộc/i)).toBeInTheDocument();
      expect(screen.getByText(/cccd là bắt buộc/i)).toBeInTheDocument();
    });
  });
});
```

### Print Form Validation

```javascript
// tests/print-form-validation.test.js
import { render, screen } from '@testing-library/react';
import HopDongMuaBanXe from '../src/components/BieuMau/HopDongMuaBanXe';

describe('Print Form Validation', () => {
  test('disables print button when missing required fields', () => {
    const incompleteContract = {
      tenKh: 'Nguyễn Văn A',
      // Missing other required fields
    };

    render(<HopDongMuaBanXe />, { initialState: { contract: incompleteContract } });

    const printBtn = screen.getByRole('button', { name: /in/i });
    expect(printBtn).toBeDisabled();
  });

  test('enables print button with all required fields', () => {
    const completeContract = {
      tenKh: 'Nguyễn Văn A',
      cccd: '079123456789',
      soDienThoai: '0901234567',
      diaChi: '123 Nguyễn Huệ',
      dongXe: 'VF 7',
      showroom: 'Trường Chinh',
      ngoaiThat: 'Crimson Red'
    };

    render(<HopDongMuaBanXe />, { initialState: { contract: completeContract } });

    const printBtn = screen.getByRole('button', { name: /in/i });
    expect(printBtn).not.toBeDisabled();
  });
});
```

---

## Manual Testing

### Testing Checklist - Contract Management

- [ ] Create new contract
  - [ ] Select showroom
  - [ ] VSO generated automatically
  - [ ] Fill all form fields
  - [ ] Save to database
  - [ ] Verify in HopDongPage

- [ ] Edit contract
  - [ ] Open existing draft
  - [ ] Modify fields
  - [ ] Save changes
  - [ ] Verify updates reflected

- [ ] Export contract
  - [ ] Export to exportedContracts
  - [ ] Move from HopDongPage to HopDongDaXuatPage
  - [ ] Verify timestamp
  - [ ] Check Google Sheets sync (if functions deployed)

### Testing Checklist - Print Forms

- [ ] Validate required fields
  - [ ] Show warning if showroom missing
  - [ ] Show warning if customer name missing
  - [ ] Disable print button if validation fails

- [ ] Print layout (each of 27 forms)
  - [ ] A4 size correct
  - [ ] No content overflow
  - [ ] No unwanted page breaks
  - [ ] Print preview looks good
  - [ ] Actual print output is correct

- [ ] Data display
  - [ ] Customer name correct
  - [ ] Vehicle model correct
  - [ ] Prices calculated correctly
  - [ ] Branch info displayed correctly

### Testing Checklist - Calculator

- [ ] Price calculation
  - [ ] Select vehicle model
  - [ ] Select trim/color
  - [ ] Base price displays correctly
  - [ ] Discount applies correctly
  - [ ] VinClub discount applies
  - [ ] Promotion applies if selected

- [ ] Loan calculation
  - [ ] Select loan option
  - [ ] Select bank
  - [ ] Calculate monthly payment
  - [ ] Verify loan amount
  - [ ] Verify interest rate

### Testing Checklist - Dashboard

- [ ] Charts display
  - [ ] Monthly sales chart
  - [ ] Employee performance chart
  - [ ] Contract status overview

- [ ] Filters work
  - [ ] Filter by date range
  - [ ] Filter by showroom
  - [ ] Filter by employee

### Testing Checklist - Authentication

- [ ] Login
  - [ ] Correct credentials accepted
  - [ ] Incorrect password rejected
  - [ ] Non-existent email rejected
  - [ ] Error messages are helpful

- [ ] Route protection
  - [ ] Unauthenticated access blocked
  - [ ] Redirect to login for protected routes
  - [ ] Can navigate after login

### Testing Checklist - Cross-Browser

Test on:
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+

### Testing Checklist - Responsive Design

- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

---

## Performance Testing

### Load Testing

```javascript
// Measure page load time
performance.mark('page-start');
// ... load page ...
performance.mark('page-end');
const measure = performance.measure('page-load', 'page-start', 'page-end');
console.log('Page load time:', measure.duration, 'ms');
```

**Target**: Page load < 3 seconds

### Database Query Performance

```javascript
// Measure Firebase query time
const startTime = performance.now();
const snapshot = await get(ref(database, 'exportedContracts'));
const endTime = performance.now();
console.log('Query time:', endTime - startTime, 'ms');
```

**Target**: Query response < 500ms

### Memory Usage

Check in Chrome DevTools:
1. Open DevTools (F12)
2. Go to Memory tab
3. Take heap snapshot
4. Look for memory leaks

---

## Test Data Management

### Sample Data for Testing

```javascript
// Sample contract for testing
const sampleContract = {
  id: 'test-contract-001',
  tenKh: 'Nguyễn Văn A',
  cccd: '079123456789',
  soDienThoai: '0901234567',
  email: 'a.nguyen@example.com',
  diaChi: '123 Nguyễn Huệ, Quận 1, TP HCM',
  dongXe: 'VF 7',
  phienBan: 'Plus',
  ngoaiThat: 'Crimson Red',
  noiThat: 'Standard',
  giaNiemYet: 850000000,
  giaGiam: 50000000,
  giaHopDong: 800000000,
  soTienCoc: 100000000,
  soTienVay: 600000000,
  nganHang: 'TPBank',
  showroom: 'Trường Chinh',
  vso: 'S00901-VSO-25-01-0001',
  tvbh: 'Trần Văn B',
  tinhTrang: 'nháp',
  createdAt: '2026-01-09T14:30:00Z'
};
```

### Data Reset Between Tests

```javascript
// Clean up test data after each test
afterEach(async () => {
  const testContracts = await get(ref(database, 'contracts'));
  if (testContracts.exists()) {
    for (const [id] of Object.entries(testContracts.val())) {
      if (id.startsWith('test-')) {
        await remove(ref(database, `contracts/${id}`));
      }
    }
  }
});
```

---

## Continuous Integration Testing

### Pre-Commit Testing

```bash
# Run before committing code
npm test -- --bail  # Stop on first failure
```

### CI/CD Pipeline Testing

```yaml
# GitHub Actions (if configured)
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run build
```

---

## Known Test Issues

| Issue | Status | Resolution |
|-------|--------|-----------|
| 1 failing test | Open | See tests/README.md for details |
| Async Firebase operations | Pending | Use Firebase Emulator |
| Component integration tests | Pending | Implement React Testing Library |

---

## Future Testing Improvements

- [ ] Implement React Testing Library for better component testing
- [ ] Setup Firebase Emulator for local testing
- [ ] Add E2E testing with Cypress or Playwright
- [ ] Implement visual regression testing
- [ ] Setup automated accessibility testing
- [ ] Add performance monitoring

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Firebase Testing Guide](https://firebase.google.com/docs/database/security/testing)
- [Jest Documentation](https://jestjs.io/)

---

**Last Updated**: 2026-01-09
**Test Coverage**: 97% (33/34 tests pass)
