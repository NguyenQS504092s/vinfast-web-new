import { FileCheck, AlertCircle } from 'lucide-react';

const PendingContractsTable = ({ summaryMatrix, timeRangeText, contracts, allEmployees, selectedEmployee }) => {
  // Prepare data for pending contracts by employee and car model
  const preparePendingData = () => {
    // Get all car models (bỏ "Không xác định")
    const allModels = [
      "VF 3", "VF 5", "VF 6", "VF 7", "VF 8", "VF 9",
      "Minio", "Herio", "Nerio", "Limo", "EC", "EC Nâng Cao"
    ];

    // Initialize data for ALL employees (kể cả không có hợp đồng)
    const employeeData = {};
    
    // Khởi tạo nhân viên dựa trên bộ lọc
    let employeesToShow = [];
    
    if (selectedEmployee && selectedEmployee !== "all") {
      // Nếu chọn nhân viên cụ thể, chỉ hiển thị nhân viên đó
      employeesToShow = [selectedEmployee];
    } else {
      // Nếu chọn "all", hiển thị tất cả nhân viên
      employeesToShow = allEmployees || [];
    }

    // Khởi tạo dữ liệu cho các nhân viên được chọn
    employeesToShow.forEach(employeeName => {
      if (employeeName && employeeName !== "Không xác định") { // Bỏ "Không xác định"
        employeeData[employeeName] = {
          employee: employeeName,
          totalContracts: 0,
          exportedContracts: 0,
          cancelledContracts: 0,
          pendingContracts: 0,
          modelBreakdown: {}
        };

        // Initialize all models with 0
        allModels.forEach(m => {
          employeeData[employeeName].modelBreakdown[m] = {
            total: 0,
            exported: 0,
            cancelled: 0,
            pending: 0
          };
        });
      }
    });

    // Nếu có hợp đồng, xử lý dữ liệu
    if (contracts && contracts.length > 0) {
      contracts.forEach(contract => {
        const employee = contract.TVBH || "";
        const model = contract.model || contract.dongXe || "";
        const status = (contract.status || contract.trangThai || "mới").toLowerCase();

        // Chỉ xử lý nhân viên có tên hợp lệ (bỏ "Không xác định")
        if (!employee || employee === "Không xác định") {
          return;
        }

        // Chỉ xử lý dòng xe có trong danh sách (bỏ "Không xác định")
        if (!allModels.includes(model)) {
          return;
        }

        // Đảm bảo nhân viên tồn tại trong employeeData
        if (!employeeData[employee]) {
          employeeData[employee] = {
            employee,
            totalContracts: 0,
            exportedContracts: 0,
            cancelledContracts: 0,
            pendingContracts: 0,
            modelBreakdown: {}
          };

          // Initialize all models with 0
          allModels.forEach(m => {
            employeeData[employee].modelBreakdown[m] = {
              total: 0,
              exported: 0,
              cancelled: 0,
              pending: 0
            };
          });
        }

        // Count totals
        employeeData[employee].totalContracts++;
        
        // Count by status
        if (status === "xuất") {
          employeeData[employee].exportedContracts++;
        } else if (status === "hủy") {
          employeeData[employee].cancelledContracts++;
        }

        // Count by model
        employeeData[employee].modelBreakdown[model].total++;
        
        if (status === "xuất") {
          employeeData[employee].modelBreakdown[model].exported++;
        } else if (status === "hủy") {
          employeeData[employee].modelBreakdown[model].cancelled++;
        }
      });
    }

    // Calculate pending contracts for each employee and model
    Object.values(employeeData).forEach(emp => {
      // Total pending = total - exported - cancelled
      emp.pendingContracts = emp.totalContracts - emp.exportedContracts - emp.cancelledContracts;
      
      // Pending by model
      Object.keys(emp.modelBreakdown).forEach(model => {
        const modelData = emp.modelBreakdown[model];
        modelData.pending = modelData.total - modelData.exported - modelData.cancelled;
      });
    });

    // Convert to array and sort by total contracts (descending), then by pending contracts
    return Object.values(employeeData)
      .sort((a, b) => {
        // Sắp xếp theo tổng hợp đồng trước (nhiều nhất lên trên)
        if (b.totalContracts !== a.totalContracts) {
          return b.totalContracts - a.totalContracts;
        }
        // Nếu tổng hợp đồng bằng nhau, sắp xếp theo hợp đồng tồn
        return b.pendingContracts - a.pendingContracts;
      });
  };

  const pendingData = preparePendingData();
  const displayModels = ["VF 3", "VF 5", "VF 6", "VF 7", "VF 8", "VF 9", "Minio", "Herio", "Nerio", "Limo", "EC", "EC Nâng Cao"];

  if (pendingData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
          <FileCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="truncate">Thống kê hợp đồng tồn đọng ({timeRangeText})</span>
        </h2>
        <p className="text-sm text-gray-500">Không có dữ liệu nhân viên để hiển thị.</p>
      </div>
    );
  }

  // Calculate totals
  const totals = {
    employee: "Tổng",
    totalContracts: pendingData.reduce((sum, emp) => sum + emp.totalContracts, 0),
    exportedContracts: pendingData.reduce((sum, emp) => sum + emp.exportedContracts, 0),
    cancelledContracts: pendingData.reduce((sum, emp) => sum + emp.cancelledContracts, 0),
    pendingContracts: pendingData.reduce((sum, emp) => sum + emp.pendingContracts, 0),
    modelBreakdown: {}
  };

  displayModels.forEach(model => {
    totals.modelBreakdown[model] = {
      total: pendingData.reduce((sum, emp) => sum + (emp.modelBreakdown[model]?.total || 0), 0),
      exported: pendingData.reduce((sum, emp) => sum + (emp.modelBreakdown[model]?.exported || 0), 0),
      cancelled: pendingData.reduce((sum, emp) => sum + (emp.modelBreakdown[model]?.cancelled || 0), 0),
      pending: pendingData.reduce((sum, emp) => sum + (emp.modelBreakdown[model]?.pending || 0), 0)
    };
  });

  const headerClass = "text-[10px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wide border border-gray-300 text-center px-1 sm:px-2 py-2";
  const cellClass = "border border-gray-200 px-1 sm:px-2 py-1.5 sm:py-2 text-xs sm:text-sm text-center";
  const totalRowClass = "bg-gray-100 font-semibold";

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
        <FileCheck className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="truncate">Thống kê hợp đồng tồn đọng ({timeRangeText})</span>
      </h2>

      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs sm:text-sm text-blue-800">
            <p className="font-medium mb-1">Công thức tính hợp đồng tồn:</p>
            <p>Hợp đồng tồn = Tổng hợp đồng - Hợp đồng đã xuất - Hợp đồng đã hủy</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-300">
        <table className="w-full bg-white text-xs sm:text-sm">
          <thead>
            <tr>
              <th rowSpan="2" className={`${headerClass} bg-gray-200 font-bold`}>
                Tư vấn bán hàng
              </th>
              <th colSpan="4" className={`${headerClass} bg-yellow-200 text-yellow-900`}>
                Tổng quan
              </th>
              <th colSpan={displayModels.length} className={`${headerClass} bg-red-200 text-red-900`}>
                Hợp đồng tồn theo dòng xe
              </th>
            </tr>
            <tr>
              <th className={`${headerClass} bg-blue-100 text-blue-800`}>Tổng HĐ</th>
              <th className={`${headerClass} bg-green-100 text-green-800`}>Đã xuất</th>
              <th className={`${headerClass} bg-red-100 text-red-800`}>Đã hủy</th>
              <th className={`${headerClass} bg-orange-100 text-orange-800 font-bold`}>Tồn</th>
              {displayModels.map((model, index) => (
                <th key={model} className={`${headerClass} ${index % 2 === 0 ? 'bg-red-100 text-red-800' : 'bg-red-50 text-red-700'}`}>
                  {model}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pendingData.map((emp) => (
              <tr key={emp.employee} className="even:bg-gray-50 hover:bg-blue-50">
                <td className={`${cellClass} font-medium text-left px-2 sm:px-3 max-w-[120px] truncate`} title={emp.employee}>
                  {emp.employee}
                </td>
                <td className={`${cellClass} text-blue-700 bg-blue-50`}>{emp.totalContracts}</td>
                <td className={`${cellClass} text-green-700 bg-green-50`}>{emp.exportedContracts}</td>
                <td className={`${cellClass} text-red-700 bg-red-50`}>{emp.cancelledContracts}</td>
                <td className={`${cellClass} font-bold text-orange-800 bg-orange-100`}>{emp.pendingContracts}</td>
                {displayModels.map(model => (
                  <td key={model} className={`${cellClass} ${(emp.modelBreakdown[model]?.pending || 0) > 0 ? 'text-red-700 bg-red-50 font-medium' : 'text-gray-500'}`}>
                    {emp.modelBreakdown[model]?.pending || 0}
                  </td>
                ))}
              </tr>
            ))}
            
            {/* Total row */}
            <tr className={totalRowClass}>
              <td className={`${cellClass} font-bold text-left px-2 sm:px-3`}>Tổng</td>
              <td className={`${cellClass} font-bold text-blue-800 bg-blue-100`}>{totals.totalContracts}</td>
              <td className={`${cellClass} font-bold text-green-800 bg-green-100`}>{totals.exportedContracts}</td>
              <td className={`${cellClass} font-bold text-red-800 bg-red-100`}>{totals.cancelledContracts}</td>
              <td className={`${cellClass} font-bold text-orange-800 bg-orange-200`}>{totals.pendingContracts}</td>
              {displayModels.map(model => (
                <td key={model} className={`${cellClass} font-bold ${(totals.modelBreakdown[model]?.pending || 0) > 0 ? 'text-red-800 bg-red-100' : 'text-gray-600'}`}>
                  {totals.modelBreakdown[model]?.pending || 0}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <p>* Hợp đồng tồn: Các hợp đồng đã ký nhưng chưa xuất và chưa hủy</p>
        <p>* Màu đỏ: Có hợp đồng tồn cần xử lý</p>
        <p>* Sắp xếp: Theo tổng số hợp đồng (nhiều nhất lên trên)</p>
        {selectedEmployee && selectedEmployee !== "all" && (
          <p>* Hiển thị: Chỉ nhân viên "{selectedEmployee}"</p>
        )}
      </div>
    </div>
  );
};

export default PendingContractsTable;