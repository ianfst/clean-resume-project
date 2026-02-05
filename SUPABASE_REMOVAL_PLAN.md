# Supabase Removal Plan

## Overview
This document outlines the plan to remove all Supabase functionality from the project to enable local testing.

## Analysis Summary
- **105 files** import from `@/integrations/supabase`
- **5 files** import from `@supabase/supabase-js`
- **1 npm dependency**: `@supabase/supabase-js`
- **Supabase client** initialized in `src/integrations/supabase/client.ts`
- **Database types** defined in `src/integrations/supabase/types.ts`

## Key Areas Affected

### 1. Authentication (`useAuth` hook)
- Currently uses Supabase auth
- Need to replace with local/mock auth

### 2. Database Operations
- All CRUD operations use Supabase client
- Need to replace with local storage or mock data

### 3. Real-time Features
- Uses Supabase real-time subscriptions
- Can be disabled or mocked

### 4. File Storage
- Resume uploads use Supabase storage
- Need to use local file handling

## Implementation Strategy

### Phase 1: Create Mock Authentication
1. Create a mock auth provider that stores user state in localStorage
2. Replace `useAuth` hook to use mock provider
3. Update `ProtectedRoute` to work with mock auth

### Phase 2: Create Mock Database Layer
1. Create a mock database service using localStorage
2. Replace all `supabase.from()` calls with mock service
3. Maintain same API interface for minimal code changes

### Phase 3: Remove Supabase Dependencies
1. Remove `@supabase/supabase-js` from package.json
2. Remove Supabase client initialization
3. Remove Supabase types
4. Clean up environment variables

### Phase 4: Update File Handling
1. Replace Supabase storage with local file handling
2. Use FileReader API for resume uploads
3. Store file data in localStorage or IndexedDB

## Files to Modify

### Core Files
- `src/integrations/supabase/client.ts` - Remove or replace
- `src/integrations/supabase/types.ts` - Remove or replace
- `src/hooks/useAuth.ts` - Replace with mock auth
- `src/components/ProtectedRoute.tsx` - Update auth check
- `package.json` - Remove Supabase dependency
- `.env` - Remove Supabase variables

### High-Priority Files (Most Used)
- All files in `src/hooks/` that use Supabase
- All files in `src/pages/` that use Supabase
- All files in `src/components/` that use Supabase
- All files in `src/lib/` that use Supabase

## Recommended Approach

**Option A: Mock Layer (Recommended for Testing)**
- Create a mock layer that mimics Supabase API
- Minimal code changes required
- Easy to switch back if needed
- Good for local testing

**Option B: Complete Removal**
- Remove all Supabase code
- Replace with local storage/IndexedDB
- More work but cleaner codebase
- Better for long-term if not using Supabase

## Next Steps

Would you like me to:
1. **Create a mock layer** that allows the app to run locally without Supabase?
2. **Completely remove** all Supabase functionality?
3. **Create a hybrid approach** where some features work locally and others are disabled?

Please let me know which approach you prefer, and I'll proceed with the implementation.
