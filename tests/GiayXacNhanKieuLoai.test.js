/**
 * Test file cho component GiayXacNhanKieuLoai
 * Kiểm tra 2 vấn đề chính:
 * 1. Logic hiển thị showroom (chỉ hiển thị khi có showroom được chọn)
 * 2. Khả năng chỉnh sửa các trường trong bảng
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GiayXacNhanKieuLoai from '../src/components/BieuMau/GiayXacNhanKieuLoai';

// Mock Firebase
jest.mock('../src/firebase/config', () => ({
  database: {}
}));

jest.mock('firebase/database', () => ({
  ref: jest.fn(),
  get: jest.fn()
}));

// Mock branchData
jest.mock('../src/data/branchData', () => ({
  getBranchByShowroomName: jest.fn()
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    state: null
  })
}));

// Wrapper component for Router
const TestWrapper = ({ children, locationState = null }) => {
  const mockUseLocation = () => ({
    state: locationState
  });
  
  React.useEffect(() => {
    require('react-router-dom').useLocation = mockUseLocation;
  }, []);

  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

describe('GiayXacNhanKieuLoai Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Vấn đề 1: Logic hiển thị showroom', () => {
    test('Không hiển thị thông tin chi nhánh khi không có showroom', async () => {
      const { getBranchByShowroomName } = require('../src/data/branchData');
      const { get } = require('firebase/database');
      
      // Mock không có showroom
      getBranchByShowroomName.mockReturnValue(null);
      get.mockResolvedValue({
        exists: () => false
      });

      render(
        <TestWrapper locationState={{ firebaseKey: 'test-key' }}>
          <GiayXacNhanKieuLoai />
        </TestWrapper>
      );

      await waitFor(() => {
        // Kiểm tra hiển thị "[Chưa chọn showroom]" thay vì tên chi nhánh
        expect(screen.getByText('[Chưa chọn showroom]')).toBeInTheDocument();
      });

      // Không được hiển thị tên chi nhánh cụ thể
      expect(screen.queryByText(/CHI NHÁNH.*TRƯỜNG CHINH/)).not.toBeInTheDocument();
      expect(screen.queryByText(/CHI NHÁNH.*THỦ ĐỨC/)).not.toBeInTheDocument();
      expect(screen.queryByText(/CHI NHÁNH.*ÂU CƠ/)).not.toBeInTheDocument();
    });

    test('Hiển thị thông tin chi nhánh khi có showroom hợp lệ', async () => {
      const { getBranchByShowroomName } = require('../src/data/branchData');
      const { get } = require('firebase/database');
      
      // Mock có showroom Trường Chinh
      const mockBranch = {
        id: 2,
        shortName: "Trường Chinh",
        name: "CHI NHÁNH TRƯỜNG CHINH - CÔNG TY CỔ PHẦN ĐẦU TƯ THƯƠNG MẠI VÀ DỊCH VỤ Ô TÔ ĐÔNG SÀI GÒN",
        address: "682A Trường Chinh, Phường Tân Bình, Thành Phố Hồ Chí Minh"
      };
      
      getBranchByShowroomName.mockReturnValue(mockBranch);
      get.mockResolvedValue({
        exists: () => true,
        val: () => ({
          showroom: "Chi Nhánh Trường Chinh"
        })
      });

      render(
        <TestWrapper locationState={{ 
          firebaseKey: 'test-key',
          showroom: 'Chi Nhánh Trường Chinh'
        }}>
          <GiayXacNhanKieuLoai />
        </TestWrapper>
      );

      await waitFor(() => {
        // Kiểm tra hiển thị tên chi nhánh
        expect(screen.getByText(/CHI NHÁNH TRƯỜNG CHINH/)).toBeInTheDocument();
      });

      // Không được hiển thị "[Chưa chọn showroom]"
      expect(screen.queryByText('[Chưa chọn showroom]')).not.toBeInTheDocument();
    });

    test('Xử lý showroom rỗng hoặc null từ database', async () => {
      const { getBranchByShowroomName } = require('../src/data/branchData');
      const { get } = require('firebase/database');
      
      getBranchByShowroomName.mockReturnValue(null);
      
      // Test với showroom = ""
      get.mockResolvedValue({
        exists: () => true,
        val: () => ({
          showroom: ""
        })
      });

      const { rerender } = render(
        <TestWrapper locationState={{ firebaseKey: 'test-key' }}>
          <GiayXacNhanKieuLoai />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('[Chưa chọn showroom]')).toBeInTheDocument();
      });

      // Test với showroom = null
      get.mockResolvedValue({
        exists: () => true,
        val: () => ({
          showroom: null
        })
      });

      rerender(
        <TestWrapper locationState={{ firebaseKey: 'test-key-2' }}>
          <GiayXacNhanKieuLoai />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('[Chưa chọn showroom]')).toBeInTheDocument();
      });
    });
  });

  describe('Vấn đề 2: Khả năng chỉnh sửa các trường trong bảng', () => {
    test('Các input trong bảng có thể chỉnh sửa được', async () => {
      const { getBranchByShowroomName } = require('../src/data/branchData');
      const { get } = require('firebase/database');
      
      getBranchByShowroomName.mockReturnValue(null);
      get.mockResolvedValue({
        exists: () => false
      });

      render(
        <TestWrapper>
          <GiayXacNhanKieuLoai />
        </TestWrapper>
      );

      await waitFor(() => {
        // Tìm các input trong bảng
        const hdmbInput = screen.getByPlaceholderText('Nhập thông tin HĐMB');
        const tbpdInput = screen.getByPlaceholderText('Nhập thông tin TBPĐ');
        const giayXnInput = screen.getByPlaceholderText('Nhập thông tin giấy XN');

        // Kiểm tra các input tồn tại
        expect(hdmbInput).toBeInTheDocument();
        expect(tbpdInput).toBeInTheDocument();
        expect(giayXnInput).toBeInTheDocument();

        // Kiểm tra có thể focus và nhập liệu
        expect(hdmbInput).not.toBeDisabled();
        expect(tbpdInput).not.toBeDisabled();
        expect(giayXnInput).not.toBeDisabled();
      });
    });

    test('Có thể thay đổi giá trị trong các input', async () => {
      const { getBranchByShowroomName } = require('../src/data/branchData');
      const { get } = require('firebase/database');
      
      getBranchByShowroomName.mockReturnValue(null);
      get.mockResolvedValue({
        exists: () => false
      });

      render(
        <TestWrapper>
          <GiayXacNhanKieuLoai />
        </TestWrapper>
      );

      await waitFor(() => {
        const hdmbInput = screen.getByPlaceholderText('Nhập thông tin HĐMB');
        const tbpdInput = screen.getByPlaceholderText('Nhập thông tin TBPĐ');
        const giayXnInput = screen.getByPlaceholderText('Nhập thông tin giấy XN');

        // Thay đổi giá trị
        fireEvent.change(hdmbInput, { target: { value: 'VF 8 Plus' } });
        fireEvent.change(tbpdInput, { target: { value: 'VINFAST VF 8 Plus' } });
        fireEvent.change(giayXnInput, { target: { value: 'VF 8 Plus' } });

        // Kiểm tra giá trị đã thay đổi
        expect(hdmbInput.value).toBe('VF 8 Plus');
        expect(tbpdInput.value).toBe('VINFAST VF 8 Plus');
        expect(giayXnInput.value).toBe('VF 8 Plus');
      });
    });

    test('Input có styling phù hợp để nhận biết có thể chỉnh sửa', async () => {
      const { getBranchByShowroomName } = require('../src/data/branchData');
      const { get } = require('firebase/database');
      
      getBranchByShowroomName.mockReturnValue(null);
      get.mockResolvedValue({
        exists: () => false
      });

      render(
        <TestWrapper>
          <GiayXacNhanKieuLoai />
        </TestWrapper>
      );

      await waitFor(() => {
        const hdmbInput = screen.getByPlaceholderText('Nhập thông tin HĐMB');
        
        // Kiểm tra có class editable-field
        expect(hdmbInput).toHaveClass('editable-field');
        
        // Kiểm tra có background color để dễ nhận biết
        expect(hdmbInput).toHaveClass('bg-blue-50');
        
        // Kiểm tra có border để dễ nhận biết
        expect(hdmbInput).toHaveClass('border-blue-300');
      });
    });

    test('Input hoạt động đúng khi focus và blur', async () => {
      const { getBranchByShowroomName } = require('../src/data/branchData');
      const { get } = require('firebase/database');
      
      getBranchByShowroomName.mockReturnValue(null);
      get.mockResolvedValue({
        exists: () => false
      });

      render(
        <TestWrapper>
          <GiayXacNhanKieuLoai />
        </TestWrapper>
      );

      await waitFor(() => {
        const hdmbInput = screen.getByPlaceholderText('Nhập thông tin HĐMB');
        
        // Focus vào input
        fireEvent.focus(hdmbInput);
        expect(hdmbInput).toHaveFocus();
        
        // Nhập text
        fireEvent.change(hdmbInput, { target: { value: 'Test Value' } });
        expect(hdmbInput.value).toBe('Test Value');
        
        // Blur khỏi input
        fireEvent.blur(hdmbInput);
        expect(hdmbInput).not.toHaveFocus();
        
        // Giá trị vẫn được giữ lại
        expect(hdmbInput.value).toBe('Test Value');
      });
    });
  });

  describe('Integration Tests', () => {
    test('Khi có showroom và có thể chỉnh sửa bảng cùng lúc', async () => {
      const { getBranchByShowroomName } = require('../src/data/branchData');
      const { get } = require('firebase/database');
      
      const mockBranch = {
        id: 2,
        shortName: "Trường Chinh",
        name: "CHI NHÁNH TRƯỜNG CHINH - CÔNG TY CỔ PHẦN ĐẦU TƯ THƯƠNG MẠI VÀ DỊCH VỤ Ô TÔ ĐÔNG SÀI GÒN"
      };
      
      getBranchByShowroomName.mockReturnValue(mockBranch);
      get.mockResolvedValue({
        exists: () => true,
        val: () => ({
          showroom: "Chi Nhánh Trường Chinh",
          dongXe: "VF 6 Eco"
        })
      });

      render(
        <TestWrapper locationState={{ 
          firebaseKey: 'test-key',
          showroom: 'Chi Nhánh Trường Chinh'
        }}>
          <GiayXacNhanKieuLoai />
        </TestWrapper>
      );

      await waitFor(() => {
        // Kiểm tra hiển thị showroom
        expect(screen.getByText(/CHI NHÁNH TRƯỜNG CHINH/)).toBeInTheDocument();
        
        // Kiểm tra có thể chỉnh sửa bảng
        const hdmbInput = screen.getByPlaceholderText('Nhập thông tin HĐMB');
        expect(hdmbInput).toBeInTheDocument();
        expect(hdmbInput).not.toBeDisabled();
        
        // Thử chỉnh sửa
        fireEvent.change(hdmbInput, { target: { value: 'VF 8 Plus Modified' } });
        expect(hdmbInput.value).toBe('VF 8 Plus Modified');
      });
    });
  });
});