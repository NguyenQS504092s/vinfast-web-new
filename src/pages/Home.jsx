import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import VinfastLogo from "../assets/vinfast.svg";

function Home() {
  const [currentDate, setCurrentDate] = useState("");
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formattedDate);

    // Load quotes from localStorage
    loadQuotes();
  }, []);

  const loadQuotes = () => {
    const savedQuotes = JSON.parse(localStorage.getItem('homepageQuotes') || '[]');
    setQuotes(savedQuotes);
  };

  const deleteQuote = (id) => {
    const updatedQuotes = quotes.filter(q => q.id !== id);
    setQuotes(updatedQuotes);
    localStorage.setItem('homepageQuotes', JSON.stringify(updatedQuotes));
  };

  const formatCurrency = (value) => {
    if (!value) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <img
            src={VinfastLogo}
            alt="VinFast Logo"
            className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-700">
              Báo giá & Cấu hình xe VinFast
            </h1>
            <p className="text-sm sm:text-base text-secondary-600 mt-1 sm:mt-2">{currentDate}</p>
          </div>
        </div>
      </div>

      {/* Models / Quick Quote Section */}
      <div className="bg-neutral-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-secondary-900 mb-3 sm:mb-4">
          Báo giá các mẫu xe
        </h2>

        {quotes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm sm:text-base">Chưa có báo giá nào. Vui lòng tạo báo giá từ trang Calculator.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STT
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ảnh xe
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên xe
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá gốc (gồm VAT)
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá XHĐ
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quotes.map((quote, index) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <img
                        src={quote.carImageUrl}
                        alt={`${quote.carModel} ${quote.carVersion}`}
                        className="h-16 w-24 object-contain rounded"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">
                      <div className="font-semibold">{quote.carModel}</div>
                      <div className="text-gray-500">{quote.carVersion}</div>
                      <div className="text-gray-400 text-xs">{quote.exteriorColorName}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatCurrency(quote.basePrice)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                      {formatCurrency(quote.totalCost)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => deleteQuote(quote.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Xóa báo giá"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-neutral-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-secondary-900 mb-3 sm:mb-4">Dịch vụ & Ưu đãi</h2>
        // ở đây
      </div>
    </div>
  );
}

export default Home;
