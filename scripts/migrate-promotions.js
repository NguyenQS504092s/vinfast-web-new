// Script to migrate existing promotions to include dongXe field
// Run this script to update existing promotions in Firebase

import { ref, get, update } from 'firebase/database';
import { database } from '../src/firebase/config.js';

const migratePromotions = async () => {
  try {
    console.log('Starting promotions migration...');
    
    // Get all existing promotions
    const promotionsRef = ref(database, 'promotions');
    const snapshot = await get(promotionsRef);
    
    if (!snapshot.exists()) {
      console.log('No promotions found to migrate.');
      return;
    }
    
    const promotions = snapshot.val();
    const updates = {};
    
    // Process each promotion
    Object.entries(promotions).forEach(([key, promotion]) => {
      // If promotion doesn't have dongXe field, add it
      if (!promotion.dongXe) {
        // Default: apply to all car models for backward compatibility
        updates[`promotions/${key}/dongXe`] = [
          'vf_3', 'vf_5', 'vf_6', 'vf_7', 'vf_8', 'vf_9', 
          'minio', 'herio', 'nerio', 'limo', 'ec', 'ec_nang_cao'
        ];
        
        console.log(`Adding dongXe field to promotion: ${promotion.name}`);
      }
    });
    
    // Apply updates if any
    if (Object.keys(updates).length > 0) {
      await update(ref(database), updates);
      console.log(`Successfully migrated ${Object.keys(updates).length} promotions.`);
    } else {
      console.log('All promotions already have dongXe field.');
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  }
};

// Run migration
migratePromotions();