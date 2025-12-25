import { ref, get, set, runTransaction } from 'firebase/database';
import { database } from '../firebase/config';

/**
 * Generate VSO number with format: {maDms}-VSO-{YY}-{MM}-{sequence}
 * Example: S00901-VSO-25-12-0035
 * 
 * @param {string} maDms - Branch code (e.g., S00901, S00501, S41501)
 * @returns {Promise<string>} Generated VSO number
 */
export const generateVSO = async (maDms) => {
  if (!maDms) {
    throw new Error('maDms is required');
  }

  const now = new Date();
  const year = String(now.getFullYear()).slice(-2); // Last 2 digits: 25
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 01-12
  
  // Key for sequence counter: e.g., "S00901-25-12"
  const sequenceKey = `${maDms}-${year}-${month}`;
  const counterRef = ref(database, `vsoCounters/${sequenceKey}`);

  try {
    // Use transaction to safely increment counter
    const result = await runTransaction(counterRef, (currentValue) => {
      return (currentValue || 0) + 1;
    });

    if (result.committed) {
      const sequence = String(result.snapshot.val()).padStart(4, '0');
      return `${maDms}-VSO-${year}-${month}-${sequence}`;
    } else {
      throw new Error('Transaction failed');
    }
  } catch (error) {
    console.error('Error generating VSO:', error);
    // Fallback: use timestamp-based sequence
    const fallbackSequence = String(Date.now() % 10000).padStart(4, '0');
    return `${maDms}-VSO-${year}-${month}-${fallbackSequence}`;
  }
};

/**
 * Get the next VSO sequence number without incrementing (for preview)
 * 
 * @param {string} maDms - Branch code
 * @returns {Promise<string>} Preview of next VSO number
 */
export const previewNextVSO = async (maDms) => {
  if (!maDms) return '';

  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  
  const sequenceKey = `${maDms}-${year}-${month}`;
  const counterRef = ref(database, `vsoCounters/${sequenceKey}`);

  try {
    const snapshot = await get(counterRef);
    const currentValue = snapshot.exists() ? snapshot.val() : 0;
    const nextSequence = String(currentValue + 1).padStart(4, '0');
    return `${maDms}-VSO-${year}-${month}-${nextSequence}`;
  } catch (error) {
    console.error('Error previewing VSO:', error);
    return `${maDms}-VSO-${year}-${month}-????`;
  }
};

/**
 * Check if a VSO string has the full format
 * 
 * @param {string} vso - VSO string to check
 * @returns {boolean} True if VSO has full format
 */
export const isFullVSOFormat = (vso) => {
  if (!vso) return false;
  // Pattern: S00901-VSO-25-12-0035
  const pattern = /^S\d{5}-VSO-\d{2}-\d{2}-\d{4}$/;
  return pattern.test(vso);
};

/**
 * Extract maDms from a VSO string
 * 
 * @param {string} vso - VSO string
 * @returns {string|null} maDms or null if not found
 */
export const extractMaDmsFromVSO = (vso) => {
  if (!vso) return null;
  const match = vso.match(/^(S\d{5})/);
  return match ? match[1] : null;
};

export default {
  generateVSO,
  previewNextVSO,
  isFullVSOFormat,
  extractMaDmsFromVSO,
};
