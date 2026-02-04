# Feature Removal Plan - Resume Builder Only

**Date:** February 3, 2026  
**Goal:** Remove all features except Resume Builder

---

## 🎯 Features to Remove

### 1. Career Vault / Master Resume
- [ ] `/master-resume` page
- [ ] `/career-vault/*` routes
- [ ] `src/pages/MasterResume.tsx`
- [ ] `src/components/career-vault/` directory
- [ ] `src/components/master-resume/` directory
- [ ] Career vault database queries/hooks

### 2. LinkedIn Tools
- [ ] `/agents/linkedin-blogging` route
- [ ] `/agents/linkedin-profile-builder` route
- [ ] `/agents/linkedin-networking` route
- [ ] `src/pages/agents/LinkedInBloggingAgent.tsx`
- [ ] `src/pages/agents/LinkedInProfileBuilder.tsx`
- [ ] `src/pages/agents/LinkedInNetworkingAgent.tsx`
- [ ] `src/components/linkedin/` directory

### 3. Interview Prep
- [ ] `/agents/interview-prep` route (already redirects)
- [ ] `src/components/interview/` directory
- [ ] Interview prep edge functions

### 4. Networking Agent
- [ ] `/agents/networking` route
- [ ] `src/pages/agents/NetworkingAgentComplete.tsx`
- [ ] `src/components/networking/` directory

### 5. Job Search
- [ ] `/job-search` route
- [ ] `/boolean-search` route
- [ ] `src/pages/JobSearch.tsx`
- [ ] `src/pages/BooleanSearch.tsx`
- [ ] `src/components/job-search/` directory

### 6. Related Features
- [ ] `/active-applications` (Application Queue)
- [ ] `/agencies` route
- [ ] `/coaching` route
- [ ] `src/pages/ApplicationQueue.tsx`
- [ ] `src/pages/Agencies.tsx`
- [ ] `src/pages/Coaching.tsx`
- [ ] `src/components/applications/` directory
- [ ] `src/components/coaching/` directory

---

## ✅ Features to Keep

### Resume Builder
- ✅ `/resume-builder` - Main resume builder
- ✅ `/resume-builder/:projectId/*` - All resume builder pages
- ✅ `/quick-score` - Resume scoring
- ✅ `/resume-optimizer` - Resume optimization
- ✅ `/my-resumes` - Resume management
- ✅ `src/pages/resume-builder/` directory
- ✅ `src/components/resume-builder/` directory
- ✅ `src/components/resume/` directory
- ✅ `src/components/quick-score/` directory
- ✅ `src/components/resume-match/` directory

### Core Features
- ✅ `/` - Landing page
- ✅ `/home` - Dashboard
- ✅ `/auth` - Authentication
- ✅ `/profile` - User profile
- ✅ `/pricing` - Pricing page
- ✅ `/admin/*` - Admin pages
- ✅ Navigation components
- ✅ UI components

---

## 📝 Implementation Steps

### Phase 1: Update Routes (App.tsx)
1. Remove LinkedIn agent routes
2. Remove networking agent route
3. Remove job search routes
4. Remove career vault routes
5. Remove application queue route
6. Remove coaching route
7. Remove agencies route
8. Update redirects to point to `/home` or `/resume-builder`

### Phase 2: Remove Page Components
1. Delete `src/pages/MasterResume.tsx`
2. Delete `src/pages/JobSearch.tsx`
3. Delete `src/pages/BooleanSearch.tsx`
4. Delete `src/pages/ApplicationQueue.tsx`
5. Delete `src/pages/Agencies.tsx`
6. Delete `src/pages/Coaching.tsx`
7. Delete `src/pages/agents/LinkedInBloggingAgent.tsx`
8. Delete `src/pages/agents/LinkedInProfileBuilder.tsx`
9. Delete `src/pages/agents/LinkedInNetworkingAgent.tsx`
10. Delete `src/pages/agents/NetworkingAgentComplete.tsx`

### Phase 3: Remove Component Directories
1. Delete `src/components/career-vault/`
2. Delete `src/components/master-resume/`
3. Delete `src/components/linkedin/`
4. Delete `src/components/interview/`
5. Delete `src/components/networking/`
6. Delete `src/components/job-search/`
7. Delete `src/components/applications/`
8. Delete `src/components/coaching/`

### Phase 4: Update Navigation
1. Update `TopNav.tsx` - Remove links to removed features
2. Update `CommandMenu.tsx` - Remove commands for removed features
3. Update `src/pages/AIAgents.tsx` - Remove agent cards for removed features

### Phase 5: Clean Up Hooks & Services
1. Review `src/hooks/` - Remove hooks for removed features
2. Review `src/services/` - Remove services for removed features
3. Review `src/stores/` - Remove stores for removed features

### Phase 6: Update Documentation
1. Update `README.md` - Remove references to removed features
2. Update `DEPLOYMENT.md` - Remove testing steps for removed features
3. Update `TESTING.md` - Remove test cases for removed features

---

## ⚠️ Considerations

### Database
- Career vault tables will remain in database (no data loss)
- Can be re-enabled later if needed
- Consider adding migration to mark features as "disabled"

### Edge Functions
- LinkedIn edge functions can remain (won't be called)
- Interview prep edge functions can remain
- Job search edge functions can remain
- Or delete them to reduce clutter

### User Impact
- Users with existing career vault data won't lose it
- Existing resumes will still work
- Application queue data preserved
- Consider showing "Feature temporarily unavailable" message

---

## 🔄 Rollback Plan

If you need to restore features:
1. Revert git commit
2. Re-enable routes in App.tsx
3. Restore navigation links
4. Test functionality

---

## 📊 Estimated Impact

**Files to Remove:** ~150-200 files
**Lines of Code:** ~15,000-20,000 lines
**Build Size Reduction:** ~20-30%
**Maintenance Reduction:** ~60-70%

---

**Ready to proceed?**
