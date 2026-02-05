# Local Setup Instructions

## Overview
All Supabase functionality has been removed and replaced with local implementations. The app now runs entirely in the browser using localStorage for data persistence.

## What Was Changed

### 1. **Database Layer** (`src/lib/localDatabase.ts`)
- Created a localStorage-based database that mimics the Supabase client API
- Supports all CRUD operations (create, read, update, delete)
- Implements query filters, ordering, and limits
- Includes file storage using base64 encoding
- Mock realtime subscriptions (non-functional but won't break the app)

### 2. **Authentication** (`src/lib/localAuth.ts`)
- Created a localStorage-based auth system
- Supports sign up, sign in, sign out, and user updates
- Sessions persist for 7 days
- User data stored locally

### 3. **Client Integration** (`src/integrations/supabase/client.ts`)
- Replaced Supabase client with local implementations
- Maintains the same API interface for compatibility
- No code changes needed in components that use the client

### 4. **Updated Files**
- `src/hooks/useAuth.ts` - Updated to use local User type
- `src/components/ProtectedRoute.tsx` - Updated to use local Session type
- `src/hooks/useExtractionProgress.ts` - Added mock realtime types
- `package.json` - Removed `@supabase/supabase-js` dependency

## How to Run Locally

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure API Key (Required for AI Features)

**Option A: Environment Variable (Recommended)**
1. Open `.env.local` in the project root
2. Replace `your_lovable_api_key_here` with your actual Lovable API key
3. Get your key from: https://lovable.dev

**Option B: Browser localStorage**
1. Start the app first
2. Open browser DevTools (F12) → Console
3. Run: `localStorage.setItem('lovable_api_key', 'your_key_here')`

See `API_SETUP_GUIDE.md` for detailed instructions.

### Step 3: Start the Development Server
```bash
npm run dev
```

### Step 4: Access the Application
Open your browser to `http://localhost:5173` (or the port shown in the terminal)

## Important Notes

### Data Storage
- All data is stored in **localStorage**
- Data persists between sessions but is **browser-specific**
- Clearing browser data will delete all stored information
- Each browser/profile has its own isolated data

### Authentication
- Create a new account using any email/password
- No email verification required
- Passwords are stored in plain text (local only - not secure for production)
- Sessions last 7 days

### Limitations in Local Mode

1. **No Real-time Updates**
   - Realtime subscriptions are mocked and don't actually update
   - Refresh the page to see changes

2. **No Server-side Processing**
   - Edge functions won't work
   - AI features that depend on backend APIs won't function
   - File processing is limited to client-side only

3. **Storage Limits**
   - localStorage has a ~5-10MB limit per domain
   - Large files or extensive data may hit this limit

4. **No Cross-device Sync**
   - Data is local to each browser
   - No cloud backup or sync

### Features That Still Work

✅ **Authentication** - Sign up, sign in, sign out
✅ **Data Persistence** - All CRUD operations
✅ **File Storage** - Upload/download files (base64)
✅ **Routing** - All navigation and protected routes
✅ **UI Components** - All UI elements and interactions
✅ **Form Validation** - Client-side validation
✅ **Local State Management** - React Query, Zustand, etc.

### Features That Won't Work

❌ **AI Processing** - Requires backend APIs
❌ **Real-time Collaboration** - No websocket support
❌ **Email Notifications** - No email service
❌ **External API Calls** - Edge functions disabled
❌ **Database Triggers** - No server-side logic
❌ **File Processing** - PDF parsing, image processing, etc.

## Testing the Application

### Create a Test Account
1. Go to `/auth`
2. Click "Sign Up"
3. Enter any email (e.g., `test@example.com`)
4. Enter any password
5. Click "Sign Up"

### Test Data Persistence
1. Create some data in the app
2. Close the browser
3. Reopen and navigate back to the app
4. Your data should still be there

### Clear All Data
To start fresh, open browser DevTools and run:
```javascript
localStorage.clear();
location.reload();
```

## Troubleshooting

### App Won't Start
- Make sure you ran `npm install` after removing Supabase
- Check for any TypeScript errors in the console
- Try deleting `node_modules` and running `npm install` again

### Data Not Persisting
- Check if localStorage is enabled in your browser
- Check browser storage limits
- Try a different browser or incognito mode

### TypeScript Errors
- Some files may still reference Supabase types
- These will need to be updated to use local types
- Check the console for specific error messages

## Next Steps

If you want to add backend functionality later:
1. The local implementations can be easily swapped back to Supabase
2. All the original Supabase code is preserved in git history
3. The API interface is the same, so minimal code changes needed

## Development Tips

### Inspecting Local Data
Open browser DevTools → Application → Local Storage → `http://localhost:5173`

You'll see keys like:
- `local_auth_session` - Current user session
- `local_auth_users` - All registered users
- `local_db_[table_name]` - Database tables
- `local_db_storage_[bucket]_[path]` - Uploaded files

### Debugging
- All database operations log to the console
- Check the browser console for any errors
- Use React DevTools to inspect component state

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify localStorage is working
3. Try clearing localStorage and starting fresh
4. Check that all dependencies are installed

---

**Note**: This is a development/testing setup. For production use, you'll need a proper backend with security, scalability, and data persistence.
