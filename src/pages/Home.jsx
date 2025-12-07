import { useEffect, useState } from "react";
import { Trash2, Gift } from "lucide-react";
import VinfastLogo from "../assets/vinfast.svg";
import { loadPromotionsFromFirebase } from "../data/promotionsData";

function Home() {
  const [currentDate, setCurrentDate] = useState("");
  const [quotes, setQuotes] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loadingPromotions, setLoadingPromotions] = useState(true);

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
    
    // Load promotions from Firebase
    loadPromotions();
  }, []);

  const loadQuotes = () => {
    const savedQuotes = JSON.parse(localStorage.getItem('homepageQuotes') || '[]');
    // Giới hạn tối đa 6 báo giá
    setQuotes(savedQuotes.slice(0, 6));
  };

  const loadPromotions = async () => {
    setLoadingPromotions(true);
    try {
      const promotionsList = await loadPromotionsFromFirebase();
      // Giới hạn tối đa 6 ưu đãi
      setPromotions(promotionsList.slice(0, 6));
    } catch (error) {
      console.error("Error loading promotions:", error);
      setPromotions([]);
    } finally {
      setLoadingPromotions(false);
    }
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
                    Ảnh
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dòng xe
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phiên bản
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngoại thất
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nội thất
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá bán
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá cuối
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
                        className="h-12 w-20 object-contain rounded"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">
                      <div className="font-semibold">{quote.carModel}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">
                      <div>{quote.carVersion}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">
                      <div className="text-xs">{quote.exteriorColorName}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">
                      <div className="text-xs">{quote.interiorColorName || 'N/A'}</div>
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

      {/* Promotions Section */}
      <div className="bg-neutral-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-secondary-900 mb-3 sm:mb-4">Dịch vụ & Ưu đãi</h2>
        
        {loadingPromotions ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải ưu đãi...</p>
          </div>
        ) : promotions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Gift className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm sm:text-base">Chưa có ưu đãi nào được thêm.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {promotions.map((promotion, index) => (
              <div key={promotion.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex items-center space-x-2">
                    <Gift className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      #{index + 1}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {promotion.name}
                    </h3>
                    {promotion.createdAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(promotion.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {promotion.type === 'fixed' && promotion.value > 0 && (
                    <span className="text-green-600 font-bold text-sm">
                      -{formatCurrency(promotion.value)}
                    </span>
                  )}
                  
                  {promotion.type === 'percentage' && promotion.value > 0 && (
                    <div className="text-orange-600 font-bold text-sm text-right">
                      <p>-{promotion.value}%</p>
                      {promotion.maxDiscount > 0 && (
                        <p className="text-xs text-gray-500">
                          Tối đa {formatCurrency(promotion.maxDiscount)}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {promotion.type && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      promotion.type === 'fixed' ? 'bg-green-100 text-green-700' :
                      promotion.type === 'percentage' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {promotion.type === 'fixed' ? 'Cố định' :
                       promotion.type === 'percentage' ? 'Phần trăm' : 'Hiển thị'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
