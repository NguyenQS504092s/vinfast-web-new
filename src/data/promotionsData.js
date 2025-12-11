// Promotions data management
// This file exports a function to get promotions from Firebase
// and can be used by components that need the promotions list

import { ref, get } from 'firebase/database';
import { database } from '../firebase/config';

/**
 * Load promotions from Firebase
 * @returns {Promise<Array>} Array of promotions with structure: { id, name, createdAt, createdBy }
 */
export const loadPromotionsFromFirebase = async () => {
  try {
    const promotionsRef = ref(database, "promotions");
    const snapshot = await get(promotionsRef);
    const data = snapshot.exists() ? snapshot.val() : {};
    
    // Convert to array with firebase key
    const promotionsList = Object.entries(data || {}).map(([key, value]) => ({
      id: key,
      ...value,
    })).sort((a, b) => {
      // Sort by createdAt descending (newest first)
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA;
    });
    
    return promotionsList;
  } catch (err) {
    console.error("Error loading promotions from Firebase:", err);
    return [];
  }
};

/**
 * Get promotion names as a simple array (for backward compatibility)
 * @returns {Promise<Array<string>>} Array of promotion names
 */
export const getPromotionNames = async () => {
  const promotions = await loadPromotionsFromFirebase();
  return promotions.map(p => p.name || '').filter(Boolean);
};

/**
 * Default/hardcoded promotions (fallback if Firebase is empty)
 * These are used as initial values or fallback
 * Now includes dongXe field to specify which car models the promotion applies to
 */
export const defaultPromotions = [
  // VF 3 promotions
  {
    id: 'promo_vf3_1',
    name: 'Giảm trực tiếp 5.000.000 VNĐ cho VF 3',
    type: 'fixed',
    value: 5000000,
    maxDiscount: 0,
    minPurchase: 0,
    dongXe: ['vf_3'], // Chỉ áp dụng cho VF 3
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  },
  {
    id: 'promo_vf3_2',
    name: 'Miễn phí sạc tới 30/06/2027 - VF 3',
    type: 'display',
    value: 0,
    maxDiscount: 0,
    minPurchase: 0,
    dongXe: ['vf_3'],
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  },
  // VF 5 promotions
  {
    id: 'promo_vf5_1',
    name: 'Giảm trực tiếp 10.000.000 VNĐ cho VF 5',
    type: 'fixed',
    value: 10000000,
    maxDiscount: 0,
    minPurchase: 0,
    dongXe: ['vf_5'],
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  },
  {
    id: 'promo_vf5_2',
    name: 'Giảm thêm 3% tối đa 15.000.000 VNĐ - VF 5',
    type: 'percentage',
    value: 3,
    maxDiscount: 15000000,
    minPurchase: 0,
    dongXe: ['vf_5'],
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  },
  // VF 6 promotions
  {
    id: 'promo_vf6_1',
    name: 'Giảm trực tiếp 15.000.000 VNĐ cho VF 6',
    type: 'fixed',
    value: 15000000,
    maxDiscount: 0,
    minPurchase: 0,
    dongXe: ['vf_6'],
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  },
  {
    id: 'promo_vf6_2',
    name: 'Ưu đãi bảo hiểm VF 6',
    type: 'display',
    value: 0,
    maxDiscount: 0,
    minPurchase: 0,
    dongXe: ['vf_6'],
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  },
  // VF 7 promotions
  {
    id: 'promo_vf7_1',
    name: 'Thu cũ đổi mới xe xăng VinFast: 50.000.000 vnđ - VF 7',
    type: 'fixed',
    value: 50000000,
    maxDiscount: 0,
    minPurchase: 0,
    dongXe: ['vf_7'],
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  },
  {
    id: 'promo_vf7_2',
    name: 'Giảm thêm 5% tối đa 30.000.000 VNĐ - VF 7',
    type: 'percentage',
    value: 5,
    maxDiscount: 30000000,
    minPurchase: 0,
    dongXe: ['vf_7'],
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  },
  // VF 8 promotions
  {
    id: 'promo_vf8_1',
    name: 'Ưu đãi đặc biệt VF 8 - 70.000.000 VNĐ',
    type: 'fixed',
    value: 70000000,
    maxDiscount: 0,
    minPurchase: 0,
    dongXe: ['vf_8'],
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  },
  // VF 9 promotions
  {
    id: 'promo_vf9_1',
    name: 'Ưu đãi cao cấp VF 9 - 100.000.000 VNĐ',
    type: 'fixed',
    value: 100000000,
    maxDiscount: 0,
    minPurchase: 0,
    dongXe: ['vf_9'],
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  },
  // Multi-model promotions (áp dụng cho nhiều dòng xe)
  {
    id: 'promo_multi_1',
    name: 'Ưu đãi Lái xe Xanh (VN3) - Tất cả dòng xe',
    type: 'fixed',
    value: 1000000,
    maxDiscount: 0,
    minPurchase: 0,
    dongXe: ['vf_3', 'vf_5', 'vf_6', 'vf_7', 'vf_8', 'vf_9'], // Áp dụng cho nhiều dòng xe
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  }
];

/**
 * Filter promotions by car model (dongXe)
 * @param {Array} promotions - Array of promotions
 * @param {string} selectedDongXe - Selected car model code (e.g., 'vf_3', 'vf_5')
 * @returns {Array} Filtered promotions for the selected car model
 */
export const filterPromotionsByDongXe = (promotions, selectedDongXe) => {
  if (!selectedDongXe || !Array.isArray(promotions)) {
    return promotions || [];
  }

  return promotions.filter(promotion => {
    // If promotion doesn't have dongXe field, it applies to all models (backward compatibility)
    if (!promotion.dongXe || !Array.isArray(promotion.dongXe)) {
      return true;
    }
    
    // Check if the selected dongXe is in the promotion's dongXe array
    return promotion.dongXe.includes(selectedDongXe);
  });
};

