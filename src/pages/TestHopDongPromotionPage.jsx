import { useState, useEffect } from 'react';
import { ArrowLeft, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loadPromotionsFromFirebase, filterPromotionsByDongXe } from '../data/promotionsData';

export default function TestHopDongPromotionPage() {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState([]);
  const [selectedDongXeFilter, setSelectedDongXeFilter] = useState('all');
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load promotions on mount
  useEffect(() => {
    const loadPromotions = async () => {
      try {
        setLoading(true);
        const promotionsList = await loadPromotionsFromFirebase();
        setPromotions(promotionsList);
      } catch (error) {
        console.error('Error loading promotions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPromotions();
  }, []);

  // Filter promotions when selectedDongXeFilter changes
  useEffect(() => {
    if (selectedDongXeFilter === 'all') {
      setFilteredPromotions(promotions);
    } else {
      const filtered = filterPromotionsByDongXe(promotions, selectedDongXeFilter);
      setFilteredPromotions(filtered);
    }
  }, [promotions, selectedDongXeFilter]);

  const carModels = [
    { code: 'all', name: 'Tất cả dòng xe' },
    { code: 'vf_3', name: 'VF 3' },
    { code: 'vf_5', name: 'VF 5' },
    { code: 'vf_6', name: 'VF 6' },
    { code: 'vf_7', name: 'VF 7' },
    { code: 'vf_8', name: 'VF 8' },
    { code: 'vf_9', name: 'VF 9' },
    { code: 'minio', name: 'Minio' },
    { code: 'herio', name: 'Herio' },
    { code: 'nerio', name: 'Nerio' },
    { code: 'limo', name: 'Limo' },
    { code: 'ec', name: 'EC' },
    { code: 'ec_nang_cao', name: 'EC Nâng Cao' }
  ];

  const formatCurrency = (value) => {
    if (!value && value !== 0) return '0';
    return new Intl.NumberFormat('vi-VN').format(Number(value));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/hop-dong')}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại Hợp Đồng</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">
                Test Lọc Ưu Đãi Theo Dòng Xe - Hợp Đồng
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Gift className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Lọc Ưu Đãi Theo Dòng Xe
            </h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {carModels.map((car) => (
              <button
                key={car.code}
                onClick={() => setSelectedDongXeFilter(car.code)}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  selectedDongXeFilter === car.code
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {car.name}
              </button>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <span className="font-medium">Đang lọc:</span> {carModels.find(c => c.code === selectedDongXeFilter)?.name}
              <span className="ml-2">
                ({selectedDongXeFilter === 'all' ? promotions.length : filteredPromotions.length} ưu đãi)
              </span>
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Kết Quả Lọc ({filteredPromotions.length} ưu đãi)
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Đang tải ưu đãi...</p>
            </div>
          ) : filteredPromotions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Gift className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Không có ưu đãi nào cho dòng xe này</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPromotions.map((promotion) => (
                <div key={promotion.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-gray-900">{promotion.name}</span>
                        <span 
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            promotion.type === 'display' 
                              ? 'bg-blue-100 text-blue-800' 
                              : promotion.type === 'percentage' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {promotion.type === 'display' ? 'Chỉ hiển thị' : 
                           promotion.type === 'percentage' ? 'Giảm %' : 'Giảm tiền'}
                        </span>
                      </div>
                      
                      {promotion.type === 'percentage' && (
                        <div className="text-sm text-gray-600 mb-1">
                          Giảm {promotion.value}% {promotion.maxDiscount > 0 ? `(tối đa ${formatCurrency(promotion.maxDiscount)} VNĐ)` : ''}
                        </div>
                      )}
                      
                      {promotion.type === 'fixed' && (
                        <div className="text-sm text-gray-600 mb-1">
                          Giảm {formatCurrency(promotion.value)} VNĐ
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Dòng xe áp dụng:</span>{' '}
                        {promotion.dongXe && Array.isArray(promotion.dongXe) && promotion.dongXe.length > 0
                          ? promotion.dongXe.map(code => {
                              const carMap = {
                                'vf_3': 'VF 3', 'vf_5': 'VF 5', 'vf_6': 'VF 6', 'vf_7': 'VF 7', 
                                'vf_8': 'VF 8', 'vf_9': 'VF 9', 'minio': 'Minio', 'herio': 'Herio', 
                                'nerio': 'Nerio', 'limo': 'Limo', 'ec': 'EC', 'ec_nang_cao': 'EC Nâng Cao'
                              };
                              return carMap[code] || code;
                            }).join(', ')
                          : 'Tất cả dòng xe'
                        }
                      </div>
                      
                      <div className="text-xs text-gray-400 mt-1">
                        Tạo bởi: {promotion.createdBy} • {new Date(promotion.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">
            Hướng Dẫn Test
          </h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Chọn các dòng xe khác nhau để xem ưu đãi được lọc</li>
            <li>• Ưu đãi có trường "dongXe" sẽ chỉ hiển thị cho dòng xe tương ứng</li>
            <li>• Ưu đãi không có trường "dongXe" sẽ hiển thị cho tất cả dòng xe</li>
            <li>• Tính năng này đã được tích hợp vào trang Hợp Đồng chính</li>
          </ul>
        </div>
      </div>
    </div>
  );
}