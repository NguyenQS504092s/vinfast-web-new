import { useState, useEffect } from 'react';
import { loadPromotionsFromFirebase, filterPromotionsByDongXe } from '../data/promotionsData';

export default function TestPromotionFilterPage() {
  const [promotions, setPromotions] = useState([]);
  const [selectedDongXe, setSelectedDongXe] = useState('vf_3');
  const [filteredPromotions, setFilteredPromotions] = useState([]);

  // Load promotions on mount
  useEffect(() => {
    const loadPromotions = async () => {
      try {
        const promotionsList = await loadPromotionsFromFirebase();
        setPromotions(promotionsList);
      } catch (error) {
        console.error('Error loading promotions:', error);
      }
    };
    
    loadPromotions();
  }, []);

  // Filter promotions when selectedDongXe changes
  useEffect(() => {
    const filtered = filterPromotionsByDongXe(promotions, selectedDongXe);
    setFilteredPromotions(filtered);
  }, [promotions, selectedDongXe]);

  const carModels = [
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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Test Lọc Ưu Đãi Theo Dòng Xe
        </h1>

        {/* Car Model Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Chọn Dòng Xe
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {carModels.map((car) => (
              <button
                key={car.code}
                onClick={() => setSelectedDongXe(car.code)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  selectedDongXe === car.code
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {car.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* All Promotions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Tất Cả Ưu Đãi ({promotions.length})
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {promotions.map((promotion) => (
                <div key={promotion.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="font-medium text-gray-900 text-sm">
                    {promotion.name}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    <span className="font-medium">Loại:</span> {promotion.type}
                    {promotion.value > 0 && (
                      <span className="ml-2">
                        <span className="font-medium">Giá trị:</span> {promotion.value}
                        {promotion.type === 'percentage' ? '%' : ' VNĐ'}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    <span className="font-medium">Dòng xe:</span>{' '}
                    {promotion.dongXe && Array.isArray(promotion.dongXe) 
                      ? promotion.dongXe.join(', ') 
                      : 'Tất cả dòng xe'
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filtered Promotions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Ưu Đãi Cho {carModels.find(c => c.code === selectedDongXe)?.name} ({filteredPromotions.length})
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredPromotions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Không có ưu đãi nào cho dòng xe này</p>
                </div>
              ) : (
                filteredPromotions.map((promotion) => (
                  <div key={promotion.id} className="border border-green-200 bg-green-50 rounded-lg p-3">
                    <div className="font-medium text-gray-900 text-sm">
                      {promotion.name}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      <span className="font-medium">Loại:</span> {promotion.type}
                      {promotion.value > 0 && (
                        <span className="ml-2">
                          <span className="font-medium">Giá trị:</span> {promotion.value}
                          {promotion.type === 'percentage' ? '%' : ' VNĐ'}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="font-medium">Dòng xe:</span>{' '}
                      {promotion.dongXe && Array.isArray(promotion.dongXe) 
                        ? promotion.dongXe.join(', ') 
                        : 'Tất cả dòng xe'
                      }
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">
            Hướng Dẫn Test
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Chọn các dòng xe khác nhau để xem ưu đãi được lọc</li>
            <li>• Ưu đãi bên trái hiển thị tất cả, bên phải hiển thị ưu đãi được lọc</li>
            <li>• Ưu đãi không có trường dongXe sẽ hiển thị cho tất cả dòng xe</li>
            <li>• Ưu đãi có dongXe = [] hoặc chứa dòng xe đã chọn sẽ được hiển thị</li>
          </ul>
        </div>
      </div>
    </div>
  );
}