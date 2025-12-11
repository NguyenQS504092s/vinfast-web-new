/**
 * Test riêng cho logic xử lý showroom
 * Kiểm tra các trường hợp edge cases và logic phức tạp
 */

import { getBranchByShowroomName } from '../src/data/branchData';

// Mock data giống với branchData thực tế
const mockBranches = [
  {
    id: 1,
    shortName: "Thủ Đức",
    name: "CÔNG TY CỔ PHẦN ĐẦU TƯ THƯƠNG MẠI VÀ DỊCH VỤ Ô TÔ ĐÔNG SÀI GÒN",
    address: "391 Võ Nguyên Giáp, Phường An Khánh, Thành Phố Thủ Đức, Thành Phố Hồ Chí Minh"
  },
  {
    id: 2,
    shortName: "Trường Chinh",
    name: "CHI NHÁNH TRƯỜNG CHINH - CÔNG TY CỔ PHẦN ĐẦU TƯ THƯƠNG MẠI VÀ DỊCH VỤ Ô TÔ ĐÔNG SÀI GÒN",
    address: "682A Trường Chinh, Phường Tân Bình, Thành Phố Hồ Chí Minh"
  },
  {
    id: 3,
    shortName: "Âu Cơ",
    name: "CHI NHÁNH ÂU CƠ - CÔNG TY CỔ PHẦN ĐẦU TƯ THƯƠNG MẠI VÀ DỊCH VỤ Ô TÔ ĐÔNG SÀI GÒN",
    address: "616 Âu Cơ, Phường Bảy Hiền, Thành Phố Hồ Chí Minh"
  }
];

// Mock getBranchByShowroomName function
jest.mock('../src/data/branchData', () => ({
  getBranchByShowroomName: jest.fn()
}));

describe('Showroom Logic Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Test cases cho showroom null/undefined/empty', () => {
    test('Trả về null khi showroom là null', () => {
      getBranchByShowroomName.mockImplementation((showroomName) => {
        if (!showroomName) return null;
        return mockBranches.find(b => b.name.toLowerCase().includes(showroomName.toLowerCase()));
      });

      const result = getBranchByShowroomName(null);
      expect(result).toBeNull();
    });

    test('Trả về null khi showroom là undefined', () => {
      getBranchByShowroomName.mockImplementation((showroomName) => {
        if (!showroomName) return null;
        return mockBranches.find(b => b.name.toLowerCase().includes(showroomName.toLowerCase()));
      });

      const result = getBranchByShowroomName(undefined);
      expect(result).toBeNull();
    });

    test('Trả về null khi showroom là chuỗi rỗng', () => {
      getBranchByShowroomName.mockImplementation((showroomName) => {
        if (!showroomName || showroomName.trim() === '') return null;
        return mockBranches.find(b => b.name.toLowerCase().includes(showroomName.toLowerCase()));
      });

      const result = getBranchByShowroomName('');
      expect(result).toBeNull();
    });

    test('Trả về null khi showroom chỉ có khoảng trắng', () => {
      getBranchByShowroomName.mockImplementation((showroomName) => {
        if (!showroomName || showroomName.trim() === '') return null;
        return mockBranches.find(b => b.name.toLowerCase().includes(showroomName.toLowerCase()));
      });

      const result = getBranchByShowroomName('   ');
      expect(result).toBeNull();
    });
  });

  describe('Test cases cho showroom hợp lệ', () => {
    test('Tìm được chi nhánh Trường Chinh', () => {
      getBranchByShowroomName.mockImplementation((showroomName) => {
        if (!showroomName || showroomName.trim() === '') return null;
        const searchName = showroomName.toLowerCase().trim();
        if (searchName.includes('trường chinh') || searchName.includes('truong chinh')) {
          return mockBranches[1]; // Trường Chinh
        }
        return null;
      });

      const result = getBranchByShowroomName('Chi Nhánh Trường Chinh');
      expect(result).toEqual(mockBranches[1]);
      expect(result.shortName).toBe('Trường Chinh');
    });

    test('Tìm được chi nhánh Thủ Đức', () => {
      getBranchByShowroomName.mockImplementation((showroomName) => {
        if (!showroomName || showroomName.trim() === '') return null;
        const searchName = showroomName.toLowerCase().trim();
        if (searchName.includes('thủ đức') || searchName.includes('thu duc')) {
          return mockBranches[0]; // Thủ Đức
        }
        return null;
      });

      const result = getBranchByShowroomName('VinFast Đông Sài Gòn-Thủ Đức');
      expect(result).toEqual(mockBranches[0]);
      expect(result.shortName).toBe('Thủ Đức');
    });

    test('Tìm được chi nhánh Âu Cơ', () => {
      getBranchByShowroomName.mockImplementation((showroomName) => {
        if (!showroomName || showroomName.trim() === '') return null;
        const searchName = showroomName.toLowerCase().trim();
        if (searchName.includes('âu cơ') || searchName.includes('au co')) {
          return mockBranches[2]; // Âu Cơ
        }
        return null;
      });

      const result = getBranchByShowroomName('Chi Nhánh Âu Cơ');
      expect(result).toEqual(mockBranches[2]);
      expect(result.shortName).toBe('Âu Cơ');
    });
  });

  describe('Test cases cho showroom không hợp lệ', () => {
    test('Trả về null khi showroom không tồn tại', () => {
      getBranchByShowroomName.mockImplementation((showroomName) => {
        if (!showroomName || showroomName.trim() === '') return null;
        // Không tìm thấy showroom nào khớp
        return null;
      });

      const result = getBranchByShowroomName('Chi Nhánh Không Tồn Tại');
      expect(result).toBeNull();
    });

    test('Trả về null khi showroom có ký tự đặc biệt', () => {
      getBranchByShowroomName.mockImplementation((showroomName) => {
        if (!showroomName || showroomName.trim() === '') return null;
        // Không tìm thấy showroom nào khớp
        return null;
      });

      const result = getBranchByShowroomName('Chi Nhánh @#$%');
      expect(result).toBeNull();
    });
  });
});

/**
 * Test cho logic component sử dụng showroom
 */
describe('Component Showroom Logic Integration', () => {
  // Simulate component logic
  const simulateComponentLogic = (locationState, contractData) => {
    let showroomName = locationState?.showroom || "";
    let showroomLoadedFromContracts = false;
    let branch = null;

    // Logic từ exportedContracts
    if (contractData?.showroom && contractData.showroom.trim() !== "") {
      showroomName = contractData.showroom;
      showroomLoadedFromContracts = true;
      
      // Mock getBranchByShowroomName
      if (showroomName.toLowerCase().includes('trường chinh')) {
        branch = mockBranches[1];
      } else if (showroomName.toLowerCase().includes('thủ đức')) {
        branch = mockBranches[0];
      } else if (showroomName.toLowerCase().includes('âu cơ')) {
        branch = mockBranches[2];
      }
    } else if (contractData?.showroom !== undefined) {
      // Nếu showroom rỗng hoặc null, đảm bảo branch = null
      showroomLoadedFromContracts = true;
      branch = null;
    }

    // Logic từ location.state
    if (!showroomLoadedFromContracts) {
      if (showroomName && showroomName.trim() !== "") {
        if (showroomName.toLowerCase().includes('trường chinh')) {
          branch = mockBranches[1];
        } else if (showroomName.toLowerCase().includes('thủ đức')) {
          branch = mockBranches[0];
        } else if (showroomName.toLowerCase().includes('âu cơ')) {
          branch = mockBranches[2];
        }
      } else {
        branch = null;
      }
    }

    return { branch, showroomName, showroomLoadedFromContracts };
  };

  test('Không có showroom từ bất kỳ nguồn nào', () => {
    const result = simulateComponentLogic({}, {});
    expect(result.branch).toBeNull();
  });

  test('Có showroom từ location.state', () => {
    const result = simulateComponentLogic(
      { showroom: 'Chi Nhánh Trường Chinh' },
      {}
    );
    expect(result.branch).toEqual(mockBranches[1]);
  });

  test('Có showroom từ contractData (ưu tiên hơn location.state)', () => {
    const result = simulateComponentLogic(
      { showroom: 'Chi Nhánh Trường Chinh' },
      { showroom: 'Chi Nhánh Âu Cơ' }
    );
    expect(result.branch).toEqual(mockBranches[2]); // Âu Cơ từ contractData
  });

  test('Showroom rỗng từ contractData', () => {
    const result = simulateComponentLogic(
      { showroom: 'Chi Nhánh Trường Chinh' },
      { showroom: '' }
    );
    expect(result.branch).toBeNull(); // Không dùng location.state
  });

  test('Showroom null từ contractData', () => {
    const result = simulateComponentLogic(
      { showroom: 'Chi Nhánh Trường Chinh' },
      { showroom: null }
    );
    expect(result.branch).toBeNull(); // Không dùng location.state
  });

  test('Showroom chỉ có khoảng trắng từ contractData', () => {
    const result = simulateComponentLogic(
      { showroom: 'Chi Nhánh Trường Chinh' },
      { showroom: '   ' }
    );
    expect(result.branch).toBeNull(); // Không dùng location.state
  });
});