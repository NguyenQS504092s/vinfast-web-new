const fs = require('fs');
const path = require('path');

describe('Showroom Logic Fix Tests', () => {
  const filesToTest = [
    'src/components/BieuMau/GiayThoaThuanHTLS_VPBank.jsx',
    'src/components/BieuMau/TT_HTLV_CĐX_TPB.jsx', 
    'src/components/BieuMau/Thoa_thuan_ho_tro_lai_suat_vay_CĐX_Vinfast_va_LFVN.jsx'
  ];

  filesToTest.forEach(filePath => {
    describe(`File: ${filePath}`, () => {
      let fileContent;

      beforeAll(() => {
        const fullPath = path.join(process.cwd(), '..', filePath);
        fileContent = fs.readFileSync(fullPath, 'utf8');
      });

      test('should import getDefaultBranch from branchData', () => {
        expect(fileContent).toMatch(/import.*getDefaultBranch.*from.*branchData/);
      });

      test('should have branch state variable', () => {
        expect(fileContent).toMatch(/const \[branch, setBranch\] = useState\(null\)/);
      });

      test('should initialize company fields as empty strings', () => {
        expect(fileContent).toMatch(/const \[congTy, setCongTy\] = useState\(""\)/);
        expect(fileContent).toMatch(/const \[diaChiTruSo, setDiaChiTruSo\] = useState\(""\)/);
      });

      test('should use setBranch when loading showroom data', () => {
        expect(fileContent).toMatch(/setBranch\(branchInfo\)/);
      });

      test('should conditionally render company info based on branch', () => {
        expect(fileContent).toMatch(/\{branch \? \(/);
        expect(fileContent).toMatch(/\[Chưa chọn showroom\]/);
      });

      test('should wrap company info fields in branch condition', () => {
        expect(fileContent).toMatch(/\{branch && \(/);
      });

      test('should set all branch fields when showroom is selected', () => {
        expect(fileContent).toMatch(/setMaSoDN\(branchInfo\.taxCode/);
        expect(fileContent).toMatch(/setTaiKhoan\(branchInfo\.bankAccount/);
        expect(fileContent).toMatch(/setNganHangTK\(branchInfo\.bankName/);
        expect(fileContent).toMatch(/setDaiDien\(branchInfo\.representativeName/);
        expect(fileContent).toMatch(/setChucVu\(branchInfo\.position/);
      });

      test('should not have hardcoded company info', () => {
        expect(fileContent).not.toMatch(/CHI NHÁNH TRƯỜNG CHINH.*useState/);
        expect(fileContent).not.toMatch(/682A Trường Chinh.*useState/);
      });
    });
  });

  test('should have consistent showroom logic across all files', () => {
    const patterns = [
      /getBranchByShowroomName.*getDefaultBranch/,
      /setBranch\(branchInfo\)/,
      /\{branch \? \(/,
      /\[Chưa chọn showroom\]/
    ];

    filesToTest.forEach(filePath => {
      const fullPath = path.join(process.cwd(), '..', filePath);
      const content = fs.readFileSync(fullPath, 'utf8');
      
      patterns.forEach(pattern => {
        expect(content).toMatch(pattern);
      });
    });
  });
});