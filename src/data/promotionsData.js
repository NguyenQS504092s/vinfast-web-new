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
 */
export const defaultPromotions = [
  {
    id: 'promo1',
    name: 'Giảm trực tiếp 10.000.000 VNĐ',
    type: 'fixed',
    value: 10000000,
    maxDiscount: 0,
    minPurchase: 0,
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  },
  {
    id: 'promo2',
    name: 'Giảm thêm 5% tối đa 20.000.000 VNĐ',
    type: 'percentage',
    value: 5,
    maxDiscount: 20000000,
    minPurchase: 0,
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  },
  {
    id: 'promo3',
    name: 'Miễn phí sạc tới 30/06/2027',
    type: 'display',
    value: 0,
    maxDiscount: 0,
    minPurchase: 0,
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  },
  {
    id: 'promo4',
    name: 'Thu cũ đổi mới xe xăng VinFast: 50.000.000 vnđ',
    type: 'fixed',
    value: 50000000,
    maxDiscount: 0,
    minPurchase: 0,
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  },
  {
    id: 'promo5',
    name: 'Ưu đãi Lái xe Xanh (VN3)',
    type: 'fixed',
    value: 1000000,
    maxDiscount: 0,
    minPurchase: 0,
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  },
  {
    id: 'promo6',
    name: 'Ưu đãi tháng 10',
    type: 'fixed',
    value: 5000000,
    maxDiscount: 0,
    minPurchase: 0,
    createdAt: new Date().toISOString(),
    createdBy: 'system'
  }
];

