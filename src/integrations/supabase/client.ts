// =====================================================
// LOCAL CLIENT - Replaces Supabase Client
// =====================================================
// This file now exports local implementations instead of
// the Supabase client, allowing the app to run without
// any backend dependencies.
// =====================================================

import { localDb } from '@/lib/localDatabase';
import { localAuth } from '@/lib/localAuth';

// Create a unified client that combines database and auth
export const supabase = {
  ...localDb,
  auth: localAuth.auth,
};

// Export for backwards compatibility
export { localDb as database };
export { localAuth as auth };
