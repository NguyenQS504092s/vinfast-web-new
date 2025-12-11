
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EmployeeBarChart = ({ summaryMatrix, timeRangeText }) => {
  // Prepare data for chart
  const prepareChartData = () => {
    if (!summaryMatrix.rows || summaryMatrix.rows.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Filter out the "Tổng" row for the chart but keep ALL employees (including those with 0 data)
    const employeeRows = summaryMatrix.rows.filter(row => row.employee !== "Tổng");
    
    // Sort by total contracts (descending) to show most active employees first
    const sortedRows = employeeRows.sort((a, b) => b.kyTotal - a.kyTotal);

    const labels = sortedRows.map(row => {
      // Truncate long names for better display
      const name = row.employee || 'Không xác định';
      return name.length > 15 ? name.substring(0, 15) + '...' : name;
    });
    const kyData = sortedRows.map(row => row.kyTotal || 0);
    const xuatData = sortedRows.map(row => row.xuatTotal || 0);

    return {
      labels,
      datasets: [
        {
          label: 'Tổng ký',
          data: kyData,
          backgroundColor: 'rgba(59, 130, 246, 0.8)', // Blue
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: 'Tổng xuất',
          data: xuatData,
          backgroundColor: 'rgba(34, 197, 94, 0.8)', // Green
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
          },
          padding: 20,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 11,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        ticks: {
          font: {
            size: 10,
          },
          maxRotation: 45,
          minRotation: 0,
          callback: function(value) {
            // Show all labels but truncate if too long
            const label = this.getLabelForValue(value);
            return label;
          }
        },
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  const chartData = prepareChartData();

  if (chartData.labels.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="truncate">Biểu đồ thống kê nhân viên ({timeRangeText})</span>
        </h2>
        <p className="text-sm text-gray-500">Không có dữ liệu để hiển thị biểu đồ.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="truncate">Biểu đồ thống kê nhân viên ({timeRangeText})</span>
      </h2>
      
      <div className="h-64 sm:h-80 lg:h-96 w-full">
        <Bar data={chartData} options={options} />
      </div>
      
      {chartData.labels.length > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          * Hiển thị tất cả {chartData.labels.length} nhân viên (bao gồm cả những nhân viên chưa có hợp đồng)
        </p>
      )}
    </div>
  );
};

export default EmployeeBarChart;